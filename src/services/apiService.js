const API_BASE_URL = 'https://api.quotable.io';

// Cache for API responses to reduce API calls
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback quotes for when API is unavailable
const FALLBACK_QUOTES = [
  "The quick brown fox jumps over the lazy dog. This is a classic typing test sentence.",
  "Programming is the process of creating instructions for computers to follow. It requires logical thinking and attention to detail.",
  "Technology has changed the way we live, work, and communicate with each other in unprecedented ways.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do and practice consistently.",
  "Innovation distinguishes between a leader and a follower in any field of endeavor.",
  "Quality is not an act, it is a habit. Strive for excellence in everything you do.",
  "Your time is limited, so do not waste it living someone else's life.",
  "The future belongs to those who believe in the beauty of their dreams and work towards them.",
  "Simplicity is the ultimate sophistication in design and development."
];

class ApiService {
  constructor() {
    this.cache = apiCache;
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  // Helper function to retry failed requests
  async retryFetch(url, attempts = this.retryAttempts) {
    for (let i = 0; i < attempts; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          return response;
        }
        if (response.status >= 500) {
          // Server error, retry
          if (i < attempts - 1) {
            await new Promise(resolve => setTimeout(resolve, this.retryDelay * (i + 1)));
            continue;
          }
        }
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        if (i === attempts - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (i + 1)));
      }
    }
  }

  // Get random quote from Quotable API with fallback
  async getRandomQuote(minLength = 50, maxLength = 200) {
    const cacheKey = `quote_${minLength}_${maxLength}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    try {
      const response = await this.retryFetch(
        `${API_BASE_URL}/random?minLength=${minLength}&maxLength=${maxLength}`,
        this.retryAttempts
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      // Validate response has content
      if (!data.content) {
        throw new Error('Invalid API response structure');
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: data.content,
        timestamp: Date.now()
      });

      return data.content;
    } catch (error) {
      console.warn('Failed to fetch quote from API:', error);
      // Return a random fallback quote
      return this.getRandomFallbackQuote();
    }
  }

  // Get multiple quotes for variety
  async getMultipleQuotes(count = 3, minLength = 50, maxLength = 200) {
    try {
      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push(this.getRandomQuote(minLength, maxLength));
      }

      const results = await Promise.all(promises);
      const validResults = results.filter(quote => quote !== null && quote !== undefined);
      
      // If we got some results, return them; otherwise fallback
      return validResults.length > 0 ? validResults : [this.getRandomFallbackQuote()];
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      return [this.getRandomFallbackQuote()];
    }
  }

  // Get tech/programming related quotes (using tags)
  async getTechQuote() {
    const cacheKey = 'tech_quote';

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    try {
      // Try different tech-related tags
      const techTags = ['technology', 'science', 'famous-quotes', 'inspirational'];
      const randomTag = techTags[Math.floor(Math.random() * techTags.length)];

      const response = await this.retryFetch(
        `${API_BASE_URL}/random?tags=${randomTag}&minLength=60&maxLength=150`,
        this.retryAttempts
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.content) {
        throw new Error('Invalid API response structure');
      }

      this.cache.set(cacheKey, {
        data: data.content,
        timestamp: Date.now()
      });

      return data.content;
    } catch (error) {
      console.warn('Failed to fetch tech quote from API:', error);
      return this.getRandomFallbackQuote();
    }
  }

  // Get quotes by length category for difficulty levels
  async getQuoteByDifficulty(difficulty) {
    let minLength, maxLength;

    switch (difficulty.toLowerCase()) {
      case 'easy':
      case 'beginner':
        minLength = 30;
        maxLength = 80;
        break;
      case 'medium':
      case 'intermediate':
        minLength = 80;
        maxLength = 120;
        break;
      case 'hard':
      case 'pro':
        minLength = 120;
        maxLength = 180;
        break;
      case 'expert':
        minLength = 180;
        maxLength = 300;
        break;
      default:
        minLength = 50;
        maxLength = 150;
    }

    try {
      return await this.getRandomQuote(minLength, maxLength);
    } catch (error) {
      console.error(`Error fetching quote for difficulty ${difficulty}:`, error);
      return this.getRandomFallbackQuote();
    }
  }

  // Get random fallback quote when API is unavailable
  getRandomFallbackQuote() {
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  }

  // Clear cache (useful for testing or manual refresh)
  clearCache() {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Health check for API
  async checkAPIHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/random?maxLength=1`);
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
