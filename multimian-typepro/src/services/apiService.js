const API_BASE_URL = 'https://api.quotable.io';

// Cache for API responses to reduce API calls
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class ApiService {
  constructor() {
    this.cache = apiCache;
  }

  // Get random quote from Quotable API
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
      const response = await fetch(`${API_BASE_URL}/random?minLength=${minLength}&maxLength=${maxLength}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      const data = await response.json();

      // Cache the result
      this.cache.set(cacheKey, {
        data: data.content,
        timestamp: Date.now()
      });

      return data.content;
    } catch (error) {
      console.warn('Failed to fetch quote from API:', error);
      return null;
    }
  }

  // Get multiple quotes for variety
  async getMultipleQuotes(count = 3, minLength = 50, maxLength = 200) {
    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(this.getRandomQuote(minLength, maxLength));
    }

    const results = await Promise.all(promises);
    return results.filter(quote => quote !== null);
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

      const response = await fetch(`${API_BASE_URL}/random?tags=${randomTag}&minLength=60&maxLength=150`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      const data = await response.json();

      this.cache.set(cacheKey, {
        data: data.content,
        timestamp: Date.now()
      });

      return data.content;
    } catch (error) {
      console.warn('Failed to fetch tech quote from API:', error);
      return null;
    }
  }

  // Get quotes by length category for difficulty levels
  async getQuoteByDifficulty(difficulty) {
    let minLength, maxLength;

    switch (difficulty.toLowerCase()) {
      case 'beginner':
        minLength = 30;
        maxLength = 80;
        break;
      case 'intermediate':
        minLength = 80;
        maxLength = 120;
        break;
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

    return await this.getRandomQuote(minLength, maxLength);
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
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
