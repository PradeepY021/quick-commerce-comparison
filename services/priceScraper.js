const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

class PriceScraper {
  constructor() {
    this.browser = null;
    this.platforms = {
      zepto: {
        baseUrl: 'https://www.zeptonow.com',
        searchEndpoint: '/search',
        name: 'Zepto',
        color: '#3b82f6',
        deliveryTime: '10-15 mins',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      },
      swiggy: {
        baseUrl: 'https://www.swiggy.com',
        searchEndpoint: '/instamart',
        name: 'Swiggy Instamart',
        color: '#f59e0b',
        deliveryTime: '20-30 mins',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      },
      bigbasket: {
        baseUrl: 'https://www.bigbasket.com',
        searchEndpoint: '/search',
        name: 'BigBasket',
        color: '#8b5cf6',
        deliveryTime: '30-45 mins',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      }
    };
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async scrapeProduct(productName, location = { city: 'Mumbai', pincode: '400001' }) {
    const results = {};
    
    try {
      // Scrape from each platform
      const promises = Object.keys(this.platforms).map(platform => 
        this.scrapeFromPlatform(platform, productName, location)
      );
      
      const platformResults = await Promise.allSettled(promises);
      
      platformResults.forEach((result, index) => {
        const platform = Object.keys(this.platforms)[index];
        if (result.status === 'fulfilled') {
          results[platform] = result.value;
        } else {
          console.error(`Error scraping ${platform}:`, result.reason);
          results[platform] = { error: result.reason.message };
        }
      });
      
      return results;
    } catch (error) {
      console.error('Scraping error:', error);
      throw error;
    }
  }

  async scrapeFromPlatform(platform, productName, location) {
    const config = this.platforms[platform];
    
    try {
      if (platform === 'zepto') {
        return await this.scrapeZepto(productName, location);
      } else if (platform === 'swiggy') {
        return await this.scrapeSwiggy(productName, location);
      } else if (platform === 'bigbasket') {
        return await this.scrapeBigBasket(productName, location);
      }
    } catch (error) {
      console.error(`Error scraping ${platform}:`, error);
      return { error: error.message };
    }
  }

  async scrapeZepto(productName, location) {
    const page = await this.browser.newPage();
    
    try {
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
      await page.goto('https://www.zeptonow.com', { waitUntil: 'networkidle2' });
      
      // Set location if needed
      // This would need to be implemented based on Zepto's location selection
      
      // Search for product
      await page.type('input[placeholder*="search"]', productName);
      await page.keyboard.press('Enter');
      await page.waitForSelector('.product-card', { timeout: 10000 });
      
      const products = await page.evaluate(() => {
        const productCards = document.querySelectorAll('.product-card');
        return Array.from(productCards).slice(0, 5).map(card => {
          const name = card.querySelector('.product-name')?.textContent?.trim();
          const price = card.querySelector('.price')?.textContent?.trim();
          const originalPrice = card.querySelector('.original-price')?.textContent?.trim();
          const image = card.querySelector('img')?.src;
          
          return {
            name,
            price: price ? parseFloat(price.replace(/[^\d.]/g, '')) : null,
            originalPrice: originalPrice ? parseFloat(originalPrice.replace(/[^\d.]/g, '')) : null,
            image,
            deliveryTime: '10-15 mins',
            deliveryFee: 0
          };
        }).filter(p => p.name && p.price);
      });
      
      return products;
    } finally {
      await page.close();
    }
  }

  async scrapeSwiggy(productName, location) {
    // Swiggy Instamart has a more complex API structure
    // This is a simplified version - in production, you'd need to handle their API properly
    try {
      const response = await axios.get('https://www.swiggy.com/instamart/api/v1/search', {
        headers: this.platforms.swiggy.headers,
        params: {
          query: productName,
          lat: location.latitude || 19.0760,
          lng: location.longitude || 72.8777
        }
      });
      
      // Parse Swiggy's response structure
      const products = response.data?.data?.cards?.[0]?.card?.card?.itemCards || [];
      
      return products.slice(0, 5).map(item => ({
        name: item.card?.info?.name,
        price: item.card?.info?.price || item.card?.info?.finalPrice,
        originalPrice: item.card?.info?.originalPrice,
        image: item.card?.info?.image,
        deliveryTime: '20-30 mins',
        deliveryFee: 0
      })).filter(p => p.name && p.price);
    } catch (error) {
      console.error('Swiggy scraping error:', error);
      return [];
    }
  }


  async scrapeBigBasket(productName, location) {
    const page = await this.browser.newPage();
    
    try {
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
      await page.goto('https://www.bigbasket.com', { waitUntil: 'networkidle2' });
      
      // Search for product
      await page.type('input[placeholder*="search"]', productName);
      await page.keyboard.press('Enter');
      await page.waitForSelector('.product-item', { timeout: 10000 });
      
      const products = await page.evaluate(() => {
        const productItems = document.querySelectorAll('.product-item');
        return Array.from(productItems).slice(0, 5).map(item => {
          const name = item.querySelector('.product-name')?.textContent?.trim();
          const price = item.querySelector('.price')?.textContent?.trim();
          const originalPrice = item.querySelector('.original-price')?.textContent?.trim();
          const image = item.querySelector('img')?.src;
          
          return {
            name,
            price: price ? parseFloat(price.replace(/[^\d.]/g, '')) : null,
            originalPrice: originalPrice ? parseFloat(originalPrice.replace(/[^\d.]/g, '')) : null,
            image,
            deliveryTime: '30-45 mins',
            deliveryFee: 0
          };
        }).filter(p => p.name && p.price);
      });
      
      return products;
    } finally {
      await page.close();
    }
  }
}

module.exports = PriceScraper;
