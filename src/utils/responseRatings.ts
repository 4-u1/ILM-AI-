export interface ResponseRating {
  messageId: string;
  rating: 'up' | 'down';
  timestamp: number;
}

const RATINGS_KEY = 'eilm_response_ratings';

export function getResponseRatings(): ResponseRating[] {
  try {
    const saved = localStorage.getItem(RATINGS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveResponseRating(messageId: string, rating: 'up' | 'down') {
  try {
    const ratings = getResponseRatings();
    const existingIndex = ratings.findIndex((r) => r.messageId === messageId);
    
    if (existingIndex !== -1) {
      // Don't allow changing rating to prevent duplicate voting
      return;
    }
    
    const newRating: ResponseRating = {
      messageId,
      rating,
      timestamp: Date.now()
    };
    
    localStorage.setItem(RATINGS_KEY, JSON.stringify([...ratings, newRating]));
    
    // Dispatch event to update AdminDashboard dynamically
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('eilm_ratings_updated'));
    }
  } catch (e) {
    console.error('Error saving message rating:', e);
  }
}

export function getMessageRating(messageId: string): 'up' | 'down' | null {
  const ratings = getResponseRatings();
  const found = ratings.find((r) => r.messageId === messageId);
  return found ? found.rating : null;
}

export function getRatingsSummary() {
  const ratings = getResponseRatings();
  const up = ratings.filter((r) => r.rating === 'up').length;
  const down = ratings.filter((r) => r.rating === 'down').length;
  return { up, down, total: ratings.length };
}
