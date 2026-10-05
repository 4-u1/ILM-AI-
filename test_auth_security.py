#!/usr/bin/env python3
"""
Comprehensive Pytest & Unittest Security Suite for Authentication Endpoint.
Tests:
  1. SQL Injection (SQLi) Defense
  2. Malformed & Unexpected Payload Validation
  3. Authentication Bypass Resistance
  4. Brute-Force Rate Limiting (Lockout after 5 attempts)
"""

import os
import sys
import json
import time
import urllib.request
import urllib.error

LOGIN_URL = os.getenv("TARGET_LOGIN_URL", "http://localhost:3000/api/auth/login")


def send_login_request(payload, headers=None, url=LOGIN_URL):
    """Utility function to send HTTP POST request with standard error handling."""
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)

    if isinstance(payload, str):
        data = payload.encode('utf-8')
    else:
        data = json.dumps(payload).encode('utf-8')

    req = urllib.request.Request(url, data=data, headers=req_headers, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            status_code = response.getcode()
            body_text = response.read().decode('utf-8')
            try:
                body_json = json.loads(body_text)
            except Exception:
                body_json = {}
            return status_code, body_json, body_text
    except urllib.error.HTTPError as e:
        status_code = e.code
        body_text = e.read().decode('utf-8')
        try:
            body_json = json.loads(body_text)
        except Exception:
            body_json = {}
        return status_code, body_json, body_text
    except Exception as e:
        return 0, {}, str(e)


# ==============================================================================
# 1. SQL INJECTION (SQLi) DEFENSE TESTS
# ==============================================================================
def test_sql_injection_payloads():
    """Verify that SQL injection attempts are safely rejected and do not leak database errors."""
    sqli_payloads = [
        "' OR '1'='1",
        "admin' --",
        "admin' /*",
        "' OR 1=1 --",
        "' UNION SELECT 1, 'admin', 'password_hash' --",
        "'; DROP TABLE users; --",
        "admin' OR 'a'='a",
        "1' OR '1' = '1' UNION SELECT null, version() --"
    ]

    for idx, payload in enumerate(sqli_payloads):
        client_headers = {"X-Forwarded-For": f"10.10.1.{idx + 1}"}
        # Test in email field
        code, body, text = send_login_request({
            "email": payload,
            "password": "RandomInvalidPassword123!"
        }, headers=client_headers)
        assert code in [400, 401], f"Expected 400 or 401 for SQLi payload '{payload}', got {code}"
        assert "token" not in body, f"Security breach: Token generated on SQLi payload: {payload}"

        # Ensure no database syntax errors leak
        text_lower = text.lower()
        forbidden_signatures = ["syntax error", "sql syntax", "pg_", "sqlite3", "mysql_fetch", "ora-"]
        for sig in forbidden_signatures:
            assert sig not in text_lower, f"Database error signature leaked: '{sig}'"

    # Test in password field
    code, body, text = send_login_request({
        "email": "admin@ilm-platform.com",
        "password": "' OR '1'='1"
    }, headers={"X-Forwarded-For": "10.10.1.99"})
    assert code in [400, 401], f"Expected 400/401 for SQLi in password, got {code}"
    assert "token" not in body
    print("  ✅ [PASS] 1. SQL Injection Defense: 8 payloads tested & securely blocked.")


# ==============================================================================
# 2. MALFORMED & UNEXPECTED PAYLOADS TESTS
# ==============================================================================
def test_malformed_and_unexpected_payloads():
    """Verify that unexpected data types and malformed schemas are rejected with 400/422."""
    headers_base = {"X-Forwarded-For": "10.10.2.1"}

    # 2.1 Empty JSON body
    code, _, _ = send_login_request({}, headers=headers_base)
    assert code in [400, 422], f"Expected 400 for empty body, got {code}"

    # 2.2 Missing fields
    code, _, _ = send_login_request({"email": "user@ilm.org"}, headers={"X-Forwarded-For": "10.10.2.2"})
    assert code in [400, 422], f"Expected 400 for missing password, got {code}"

    code, _, _ = send_login_request({"password": "SomePassword123"}, headers={"X-Forwarded-For": "10.10.2.3"})
    assert code in [400, 422], f"Expected 400 for missing email, got {code}"

    # 2.3 Invalid data types (Numbers, Booleans, Arrays, Nested Objects)
    invalid_cases = [
        {"email": 123456, "password": "Password123!"},
        {"email": True, "password": False},
        {"email": ["admin@ilm.org"], "password": "Password123!"},
        {"email": {"$gt": ""}, "password": {"$gt": ""}},
    ]
    for idx, case in enumerate(invalid_cases):
        code, _, _ = send_login_request(case, headers={"X-Forwarded-For": f"10.10.2.{10 + idx}"})
        assert code in [400, 422], f"Expected 400 for invalid type case {case}, got {code}"

    # 2.4 Oversized payload (Buffer Overflow / Memory Exhaustion attempt)
    huge_payload = {"email": "A" * 5000, "password": "B" * 5000}
    code, _, _ = send_login_request(huge_payload, headers={"X-Forwarded-For": "10.10.2.50"})
    assert code in [400, 413, 422], f"Expected 400/413 for oversized payload, got {code}"

    # 2.5 Invalid Content-Type
    code, _, _ = send_login_request("email=admin&password=admin", headers={"Content-Type": "text/plain", "X-Forwarded-For": "10.10.2.60"})
    assert code in [400, 415], f"Expected 400/415 for non-JSON content-type, got {code}"

    print("  ✅ [PASS] 2. Malformed & Unexpected Payloads: 8 schema anomaly tests passed.")


# ==============================================================================
# 3. AUTHENTICATION BYPASS RESISTANCE TESTS
# ==============================================================================
def test_authentication_bypass_resistance():
    """Verify that empty values, null bytes, and spoofed headers cannot bypass authentication."""
    # 3.1 Whitespace / Blank credentials
    code, body, _ = send_login_request({"email": "   ", "password": "   "}, headers={"X-Forwarded-For": "10.10.3.1"})
    assert code in [400, 401], f"Expected 400/401 on whitespace, got {code}"
    assert "token" not in body

    # 3.2 Null byte injection
    code, body, _ = send_login_request({"email": "admin@ilm.org\x00extra", "password": "Password123\x00"}, headers={"X-Forwarded-For": "10.10.3.2"})
    assert code in [400, 401], f"Expected 400/401 on null byte injection, got {code}"
    assert "token" not in body

    # 3.3 Forged proxy & authentication headers
    spoofed_headers = {
        "X-Authenticated-User": "admin",
        "X-Remote-User": "superadmin",
        "X-Original-URL": "/api/admin/dashboard",
        "X-Forwarded-For": "10.10.3.3"
    }
    code, body, _ = send_login_request({
        "email": "invalid_user@ilm.org",
        "password": "WrongPassword123"
    }, headers=spoofed_headers)
    assert code == 401, f"Expected 401 on forged headers, got {code}"
    assert "token" not in body

    print("  ✅ [PASS] 3. Authentication Bypass Resistance: all bypass vectors rejected.")


# ==============================================================================
# 4. RATE LIMITING DEFENSE (LOCKOUT AFTER 5 ATTEMPTS)
# ==============================================================================
def test_rate_limiting_defense():
    """Verify that after 5 failed consecutive attempts from the same IP, the 6th is blocked with 429."""
    unique_ip = f"198.51.100.{int(time.time() * 1000) % 250 + 1}"
    custom_headers = {"X-Forwarded-For": unique_ip}

    dummy_credentials = {
        "email": "brute_force_target@ilm.org",
        "password": "WrongPasswordAttempt"
    }

    # Execute 5 consecutive failed attempts
    for attempt_idx in range(1, 6):
        code, body, _ = send_login_request(dummy_credentials, headers=custom_headers)
        assert code == 401, f"Attempt {attempt_idx} expected 401, got {code}"

    # 6th attempt MUST trigger Rate Limiting (429 Too Many Requests)
    code_6th, body_6th, _ = send_login_request(dummy_credentials, headers=custom_headers)
    assert code_6th == 429, f"Expected 429 on 6th attempt, but received {code_6th}"
    assert "retryAfter" in body_6th or "message" in body_6th or "error" in body_6th, (
        "Rate limit response 429 is missing lockout explanation"
    )

    print("  ✅ [PASS] 4. Rate Limiting: Lockout triggered precisely on the 6th attempt (HTTP 429).")


def run_all_tests():
    print("=" * 70)
    print("🛡️  RUNNING AUTHENTICATION SECURITY REGRESSION SUITE")
    print(f"🎯 Target Endpoint: {LOGIN_URL}")
    print("=" * 70)

    test_sql_injection_payloads()
    test_malformed_and_unexpected_payloads()
    test_authentication_bypass_resistance()
    test_rate_limiting_defense()

    print("=" * 70)
    print("🎉 ALL 4 SECURITY CATEGORIES PASSED WITH 100% SUCCESS!")
    print("=" * 70)


if __name__ == "__main__":
    run_all_tests()
