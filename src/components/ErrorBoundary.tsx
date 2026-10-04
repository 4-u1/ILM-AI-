import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Compass } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ILM ErrorBoundary] Uncaught runtime error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleResetToHome = () => {
    try {
      localStorage.removeItem('eilm_active_stage');
    } catch {}
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 sm:p-6 text-slate-900"
          dir="rtl"
        >
          <div className="max-w-md w-full bg-white rounded-3xl border border-amber-200/80 shadow-2xl p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8 text-amber-700" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                نعتذر، حدث تنبيه عابر في الجلسة
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                تم حفظ تقدمك المعرفي بأمان في المتصفح. يمكنك استئناف رحلتك التعليمية فوراً باختيار أحد الخيارات أدناه:
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>إعادة المحاولة والاستئناف</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetToHome}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold text-sm hover:bg-amber-100 transition cursor-pointer"
              >
                <Home className="w-4 h-4 text-amber-800" />
                <span>العودة للرئيسية</span>
              </button>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100">
              منصة عِلم | ILM — محتوى موثوق ومحمي
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
