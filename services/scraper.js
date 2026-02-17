const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio = require('cheerio');
const axios = require('axios');
const NodeCache = require('node-cache');

// Add stealth plugin
puppeteer.use(StealthPlugin());

// Cache for 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

class QuickCommerceScraper {
  constructor() {
    this.browser = null;
    this.userAgents = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ];
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: "new",
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-blink-features=AutomationControlled',
          '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          '--window-size=1920,1080',
          '--disable-extensions',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ]
      });
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async setupStealthPage(browser) {
    const page = await browser.newPage();
    
    // Enhanced anti-detection setup
    await page.setUserAgent(this.getRandomUserAgent());
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Override navigator properties
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
      window.chrome = {
        runtime: {},
      };
    });
    
    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    
    return page;
  }

  async scrapeZepto(query, location = null) {
    try {
      const locationKey = location ? `_${location.pincode || location.city || ''}` : '';
      const cacheKey = `zepto_${query.toLowerCase()}${locationKey}`;
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('Returning cached Zepto data');
        return cached;
      }

      const browser = await this.initBrowser();
      const page = await this.setupStealthPage(browser);
      
      // Set location cookie if available (Zepto uses cookies for location)
      if (location && location.pincode) {
        await page.setCookie({
          name: 'pincode',
          value: location.pincode,
          domain: '.zepto.com',
          path: '/'
        });
        console.log(`📍 Set Zepto location cookie: ${location.pincode}`);
      }
      
      // Navigate to Zepto search
      const searchUrl = `https://www.zepto.com/search?q=${encodeURIComponent(query)}`;
      console.log(`Scraping Zepto: ${searchUrl}`);
      
      await page.goto(searchUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      // Wait for page to load and products to appear
      await this.delay(3000); // Wait for dynamic content to load
      
      // Handle location modal if it appears
      if (location && location.pincode) {
        try {
          // Try to set location via JavaScript if modal appears
          await page.evaluate((pincode) => {
            // Try to find and interact with location modal
            const locationInput = document.querySelector('input[placeholder*="pincode"], input[placeholder*="Pincode"], input[type="text"][name*="pincode"]');
            if (locationInput) {
              locationInput.value = pincode;
              locationInput.dispatchEvent(new Event('input', { bubbles: true }));
              locationInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            // Try to click confirm/apply button
            const confirmBtn = document.querySelector('button:has-text("Confirm"), button:has-text("Apply"), button[type="submit"]');
            if (confirmBtn) {
              confirmBtn.click();
            }
          }, location.pincode);
          await this.delay(2000); // Wait for location to be applied
        } catch (e) {
          console.log('Location modal handling skipped:', e.message);
        }
      }
      
      // Debug: Check page title and URL
      const pageTitle = await page.title();
      const currentUrl = page.url();
      console.log(`Zepto page loaded - Title: ${pageTitle}, URL: ${currentUrl}`);
      
      // Debug: Check for location modal or blocking elements
      const pageContent = await page.evaluate(() => {
        return {
          bodyText: document.body?.textContent?.substring(0, 500) || '',
          hasLocationModal: document.querySelector('[class*="location"], [class*="Location"], [id*="location"]') !== null,
          hasProducts: document.querySelectorAll('[class*="product"], [class*="Product"], [data-testid*="product"]').length
        };
      });
      console.log(`Zepto page content check:`, pageContent);
      
      // Try multiple selectors for product cards
      try {
        await page.waitForSelector('[data-testid="product-card"], .product-card, .ProductCard, [class*="ProductCard"], [class*="product"], article, [class*="item"]', { timeout: 15000 });
      } catch (e) {
        console.log('Product cards selector not found, trying to extract from page anyway');
      }
      
      const products = await page.evaluate(() => {
        // Try multiple selectors to find product containers
        const selectors = [
          '[data-testid="product-card"]',
          '.product-card',
          '.ProductCard',
          '[class*="ProductCard"]',
          '[class*="product-card"]',
          '[class*="Product"]',
          'article',
          '[class*="item"]',
          '[class*="Item"]'
        ];
        
        let productCards = [];
        for (const selector of selectors) {
          const cards = document.querySelectorAll(selector);
          if (cards.length > 0) {
            productCards = Array.from(cards);
            break;
          }
        }
        
        // If no cards found, try to find any container with price and name
        if (productCards.length === 0) {
          const allDivs = document.querySelectorAll('div, article, section');
          productCards = Array.from(allDivs).filter(div => {
            const text = div.textContent || '';
            const hasPrice = /₹|Rs|INR|\d+\.\d{2}/.test(text);
            const hasName = text.length > 10 && text.length < 200;
            return hasPrice && hasName;
          }).slice(0, 20);
        }
        
        const results = [];
        
        productCards.forEach((card, index) => {
          try {
            // Try multiple selectors for name
            const nameSelectors = [
              '[data-testid="product-name"]',
              '.product-name',
              '.ProductName',
              '[class*="ProductName"]',
              '[class*="product-name"]',
              'h1', 'h2', 'h3', 'h4',
              '[class*="title"]',
              '[class*="Title"]'
            ];
            
            let nameElement = null;
            for (const sel of nameSelectors) {
              nameElement = card.querySelector(sel);
              if (nameElement) break;
            }
            
            // Try multiple selectors for price
            const priceSelectors = [
              '[data-testid="product-price"]',
              '.price',
              '.Price',
              '[class*="Price"]',
              '[class*="price"]',
              '[class*="amount"]',
              '[class*="Amount"]'
            ];
            
            let priceElement = null;
            for (const sel of priceSelectors) {
              priceElement = card.querySelector(sel);
              if (priceElement) break;
            }
            
            // If no price element found, search in card text
            if (!priceElement) {
              const cardText = card.textContent || '';
              const priceMatch = cardText.match(/₹\s*(\d+(?:\.\d{2})?)|Rs\s*(\d+(?:\.\d{2})?)|(\d+(?:\.\d{2})?)\s*₹/);
              if (priceMatch) {
                priceElement = { textContent: priceMatch[0] };
              }
            }
            
            const imageElement = card.querySelector('img');
            
            if (nameElement && priceElement) {
              const name = nameElement.textContent?.trim();
              const priceText = priceElement.textContent?.trim();
              const price = parseFloat(priceText?.replace(/[^\d.]/g, '')) || 0;
              const image = imageElement?.src || imageElement?.getAttribute('data-src') || '';
              const category = 'General';
              
              if (name && name.length > 3 && price > 0) {
                results.push({
                  id: `zepto_${index}`,
                  name: name.substring(0, 100), // Limit name length
                  price,
                  originalPrice: price * 1.1,
                  image,
                  category,
                  platform: 'zepto',
                  deliveryTime: '10-15 mins',
                  deliveryFee: 0,
                  availability: true,
                  brand: 'Zepto'
                });
              }
            }
          } catch (error) {
            // Silently continue
          }
        });
        
        return results;
      });
      
      await page.close();
      
      const result = {
        platform: 'zepto',
        products: products.slice(0, 10), // Limit to 10 products
        total: products.length,
        scrapedAt: new Date().toISOString()
      };
      
      cache.set(cacheKey, result);
      console.log(`✅ Zepto: Found ${products.length} products`);
      if (products.length === 0) {
        console.log(`⚠️  Zepto: No products found. This could be due to location selection required or page structure changes.`);
      }
      return result;
      
    } catch (error) {
      console.error('❌ Zepto scraping error:', error.message);
      console.error('Error stack:', error.stack);
      return {
        platform: 'zepto',
        products: [],
        error: error.message,
        scrapedAt: new Date().toISOString()
      };
    }
  }

  async scrapeSwiggy(query, location = null) {
    try {
      const locationKey = location ? `_${location.pincode || location.city || ''}` : '';
      const cacheKey = `swiggy_${query.toLowerCase()}${locationKey}`;
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('Returning cached Swiggy data');
        return cached;
      }

      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      await page.setUserAgent(this.getRandomUserAgent());
      await page.setViewport({ width: 1366, height: 768 });
      
      // Set location cookie if available
      if (location && location.coordinates) {
        await page.setCookie({
          name: 'lat',
          value: location.coordinates.latitude.toString(),
          domain: '.swiggy.com',
          path: '/'
        });
        await page.setCookie({
          name: 'lng',
          value: location.coordinates.longitude.toString(),
          domain: '.swiggy.com',
          path: '/'
        });
        console.log(`📍 Set Swiggy location: ${location.coordinates.latitude}, ${location.coordinates.longitude}`);
      }
      
      // Navigate to Swiggy Instamart search
      const searchUrl = `https://www.swiggy.com/instamart/search?q=${encodeURIComponent(query)}`;
      console.log(`Scraping Swiggy: ${searchUrl}`);
      
      await page.goto(searchUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await this.delay(3000);
      
      try {
        await page.waitForSelector('[data-testid="product-card"], .product-card, .ProductCard, [class*="ProductCard"], [class*="product"], article, [class*="item"]', { timeout: 15000 });
      } catch (e) {
        console.log('Product cards selector not found for Swiggy, trying to extract anyway');
      }
      
      const products = await page.evaluate(() => {
        const selectors = [
          '[data-testid="product-card"]',
          '.product-card',
          '.ProductCard',
          '[class*="ProductCard"]',
          '[class*="product-card"]',
          '[class*="Product"]',
          'article',
          '[class*="item"]'
        ];
        
        let productCards = [];
        for (const selector of selectors) {
          const cards = document.querySelectorAll(selector);
          if (cards.length > 0) {
            productCards = Array.from(cards);
            break;
          }
        }
        
        if (productCards.length === 0) {
          const allDivs = document.querySelectorAll('div, article, section');
          productCards = Array.from(allDivs).filter(div => {
            const text = div.textContent || '';
            const hasPrice = /₹|Rs|INR|\d+\.\d{2}/.test(text);
            const hasName = text.length > 10 && text.length < 200;
            return hasPrice && hasName;
          }).slice(0, 20);
        }
        
        const results = [];
        
        productCards.forEach((card, index) => {
          try {
            const nameSelectors = [
              '[data-testid="product-name"]',
              '.product-name',
              '.ProductName',
              '[class*="ProductName"]',
              'h1', 'h2', 'h3', 'h4',
              '[class*="title"]'
            ];
            
            let nameElement = null;
            for (const sel of nameSelectors) {
              nameElement = card.querySelector(sel);
              if (nameElement) break;
            }
            
            const priceSelectors = [
              '[data-testid="product-price"]',
              '.price',
              '.Price',
              '[class*="Price"]',
              '[class*="price"]',
              '[class*="amount"]'
            ];
            
            let priceElement = null;
            for (const sel of priceSelectors) {
              priceElement = card.querySelector(sel);
              if (priceElement) break;
            }
            
            if (!priceElement) {
              const cardText = card.textContent || '';
              const priceMatch = cardText.match(/₹\s*(\d+(?:\.\d{2})?)|Rs\s*(\d+(?:\.\d{2})?)|(\d+(?:\.\d{2})?)\s*₹/);
              if (priceMatch) {
                priceElement = { textContent: priceMatch[0] };
              }
            }
            
            const imageElement = card.querySelector('img');
            
            if (nameElement && priceElement) {
              const name = nameElement.textContent?.trim();
              const priceText = priceElement.textContent?.trim();
              const price = parseFloat(priceText?.replace(/[^\d.]/g, '')) || 0;
              const image = imageElement?.src || imageElement?.getAttribute('data-src') || '';
              
              if (name && name.length > 3 && price > 0) {
                results.push({
                  id: `swiggy_${index}`,
                  name: name.substring(0, 100),
                  price,
                  originalPrice: price * 1.15,
                  image,
                  category: 'General',
                  platform: 'swiggy',
                  deliveryTime: '20-30 mins',
                  deliveryFee: 0,
                  availability: true,
                  brand: 'Swiggy'
                });
              }
            }
          } catch (error) {
            // Continue
          }
        });
        
        return results;
      });
      
      await page.close();
      
      const result = {
        platform: 'swiggy',
        products: products.slice(0, 10),
        total: products.length,
        scrapedAt: new Date().toISOString()
      };
      
      cache.set(cacheKey, result);
      console.log(`Scraped ${products.length} products from Swiggy`);
      return result;
      
    } catch (error) {
      console.error('Swiggy scraping error:', error.message);
      return {
        platform: 'swiggy',
        products: [],
        error: error.message,
        scrapedAt: new Date().toISOString()
      };
    }
  }

  async scrapeBlinkit(query, location = null) {
    try {
      const locationKey = location ? `_${location.pincode || location.city || ''}` : '';
      const cacheKey = `blinkit_${query.toLowerCase()}${locationKey}`;
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('Returning cached Blinkit data');
        return cached;
      }

      const browser = await this.initBrowser();
      const page = await this.setupStealthPage(browser);
      
      // Set location cookie if available (Blinkit uses cookies for location)
      if (location && location.pincode) {
        await page.setCookie({
          name: 'pincode',
          value: location.pincode,
          domain: '.blinkit.com',
          path: '/'
        });
        console.log(`📍 Set Blinkit location cookie: ${location.pincode}`);
      }
      
      // Navigate to Blinkit search
      const searchUrl = `https://blinkit.com/s/?q=${encodeURIComponent(query)}`;
      console.log(`Scraping Blinkit: ${searchUrl}`);
      
      await page.goto(searchUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      // Wait for page to load and products to appear
      await this.delay(3000);
      
      // Handle location modal if it appears
      if (location && location.pincode) {
        try {
          await page.evaluate((pincode) => {
            const locationInput = document.querySelector('input[placeholder*="pincode"], input[placeholder*="Pincode"]');
            if (locationInput) {
              locationInput.value = pincode;
              locationInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            const confirmBtn = document.querySelector('button:has-text("Confirm"), button:has-text("Apply")');
            if (confirmBtn) confirmBtn.click();
          }, location.pincode);
          await this.delay(2000);
        } catch (e) {
          console.log('Blinkit location modal handling skipped:', e.message);
        }
      }
      
      // Try multiple selectors for product cards
      try {
        await page.waitForSelector('[data-testid="product-card"], .product-card, .ProductCard, [class*="ProductCard"], [class*="product"], article, [class*="item"]', { timeout: 15000 });
      } catch (e) {
        console.log('Product cards selector not found for Blinkit, trying to extract from page anyway');
      }
      
      const products = await page.evaluate(() => {
        // Try multiple selectors to find product containers
        const selectors = [
          '[data-testid="product-card"]',
          '.product-card',
          '.ProductCard',
          '[class*="ProductCard"]',
          '[class*="product-card"]',
          '[class*="Product"]',
          'article',
          '[class*="item"]',
          '[class*="Item"]'
        ];
        
        let productCards = [];
        for (const selector of selectors) {
          const cards = document.querySelectorAll(selector);
          if (cards.length > 0) {
            productCards = Array.from(cards);
            break;
          }
        }
        
        // If no cards found, try to find any container with price and name
        if (productCards.length === 0) {
          const allDivs = document.querySelectorAll('div, article, section');
          productCards = Array.from(allDivs).filter(div => {
            const text = div.textContent || '';
            const hasPrice = /₹|Rs|INR|\d+\.\d{2}/.test(text);
            const hasName = text.length > 10 && text.length < 200;
            return hasPrice && hasName;
          }).slice(0, 20);
        }
        
        const results = [];
        
        productCards.forEach((card, index) => {
          try {
            // Try multiple selectors for name
            const nameSelectors = [
              '[data-testid="product-name"]',
              '.product-name',
              '.ProductName',
              '[class*="ProductName"]',
              '[class*="product-name"]',
              'h1', 'h2', 'h3', 'h4',
              '[class*="title"]',
              '[class*="Title"]'
            ];
            
            let nameElement = null;
            for (const sel of nameSelectors) {
              nameElement = card.querySelector(sel);
              if (nameElement) break;
            }
            
            // Try multiple selectors for price
            const priceSelectors = [
              '[data-testid="product-price"]',
              '.price',
              '.Price',
              '[class*="Price"]',
              '[class*="price"]',
              '[class*="amount"]',
              '[class*="Amount"]'
            ];
            
            let priceElement = null;
            for (const sel of priceSelectors) {
              priceElement = card.querySelector(sel);
              if (priceElement) break;
            }
            
            // If no price element found, search in card text
            if (!priceElement) {
              const cardText = card.textContent || '';
              const priceMatch = cardText.match(/₹\s*(\d+(?:\.\d{2})?)|Rs\s*(\d+(?:\.\d{2})?)|(\d+(?:\.\d{2})?)\s*₹/);
              if (priceMatch) {
                priceElement = { textContent: priceMatch[0] };
              }
            }
            
            const imageElement = card.querySelector('img');
            
            if (nameElement && priceElement) {
              const name = nameElement.textContent?.trim();
              const priceText = priceElement.textContent?.trim();
              const price = parseFloat(priceText?.replace(/[^\d.]/g, '')) || 0;
              const image = imageElement?.src || imageElement?.getAttribute('data-src') || '';
              const category = 'General';
              
              if (name && name.length > 3 && price > 0) {
                results.push({
                  id: `blinkit_${index}`,
                  name: name.substring(0, 100),
                  price,
                  originalPrice: price * 1.1,
                  image,
                  category,
                  platform: 'blinkit',
                  deliveryTime: '10-15 mins',
                  deliveryFee: 0,
                  availability: true,
                  brand: 'Blinkit'
                });
              }
            }
          } catch (error) {
            // Silently continue
          }
        });
        
        return results;
      });
      
      await page.close();
      
      const result = {
        platform: 'blinkit',
        products: products.slice(0, 10),
        total: products.length,
        scrapedAt: new Date().toISOString()
      };
      
      cache.set(cacheKey, result);
      console.log(`Scraped ${products.length} products from Blinkit`);
      return result;
      
    } catch (error) {
      console.error('Blinkit scraping error:', error.message);
      return {
        platform: 'blinkit',
        products: [],
        error: error.message,
        scrapedAt: new Date().toISOString()
      };
    }
  }

  async scrapeBigBasket(query, location = null) {
    try {
      const locationKey = location ? `_${location.pincode || location.city || ''}` : '';
      const cacheKey = `bigbasket_${query.toLowerCase()}${locationKey}`;
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('Returning cached BigBasket data');
        return cached;
      }

      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      await page.setUserAgent(this.getRandomUserAgent());
      await page.setViewport({ width: 1366, height: 768 });
      
      // Set location cookie if available
      if (location && location.pincode) {
        await page.setCookie({
          name: 'pincode',
          value: location.pincode,
          domain: '.bigbasket.com',
          path: '/'
        });
        console.log(`📍 Set BigBasket location cookie: ${location.pincode}`);
      }
      
      // Navigate to BigBasket search
      const searchUrl = `https://www.bigbasket.com/ps/?q=${encodeURIComponent(query)}`;
      console.log(`Scraping BigBasket: ${searchUrl}`);
      
      await page.goto(searchUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await this.delay(3000);
      
      try {
        await page.waitForSelector('[data-testid="product-card"], .product-card, .ProductCard, [class*="ProductCard"], [class*="product"], article, [class*="item"]', { timeout: 15000 });
      } catch (e) {
        console.log('Product cards selector not found for BigBasket, trying to extract anyway');
      }
      
      const products = await page.evaluate(() => {
        const selectors = [
          '[data-testid="product-card"]',
          '.product-card',
          '.ProductCard',
          '[class*="ProductCard"]',
          '[class*="product-card"]',
          '[class*="Product"]',
          'article',
          '[class*="item"]'
        ];
        
        let productCards = [];
        for (const selector of selectors) {
          const cards = document.querySelectorAll(selector);
          if (cards.length > 0) {
            productCards = Array.from(cards);
            break;
          }
        }
        
        if (productCards.length === 0) {
          const allDivs = document.querySelectorAll('div, article, section');
          productCards = Array.from(allDivs).filter(div => {
            const text = div.textContent || '';
            const hasPrice = /₹|Rs|INR|\d+\.\d{2}/.test(text);
            const hasName = text.length > 10 && text.length < 200;
            return hasPrice && hasName;
          }).slice(0, 20);
        }
        
        const results = [];
        
        productCards.forEach((card, index) => {
          try {
            const nameSelectors = [
              '[data-testid="product-name"]',
              '.product-name',
              '.ProductName',
              '[class*="ProductName"]',
              'h1', 'h2', 'h3', 'h4',
              '[class*="title"]'
            ];
            
            let nameElement = null;
            for (const sel of nameSelectors) {
              nameElement = card.querySelector(sel);
              if (nameElement) break;
            }
            
            const priceSelectors = [
              '[data-testid="product-price"]',
              '.price',
              '.Price',
              '[class*="Price"]',
              '[class*="price"]',
              '[class*="amount"]'
            ];
            
            let priceElement = null;
            for (const sel of priceSelectors) {
              priceElement = card.querySelector(sel);
              if (priceElement) break;
            }
            
            if (!priceElement) {
              const cardText = card.textContent || '';
              const priceMatch = cardText.match(/₹\s*(\d+(?:\.\d{2})?)|Rs\s*(\d+(?:\.\d{2})?)|(\d+(?:\.\d{2})?)\s*₹/);
              if (priceMatch) {
                priceElement = { textContent: priceMatch[0] };
              }
            }
            
            const imageElement = card.querySelector('img');
            
            if (nameElement && priceElement) {
              const name = nameElement.textContent?.trim();
              const priceText = priceElement.textContent?.trim();
              const price = parseFloat(priceText?.replace(/[^\d.]/g, '')) || 0;
              const image = imageElement?.src || imageElement?.getAttribute('data-src') || '';
              
              if (name && name.length > 3 && price > 0) {
                results.push({
                  id: `bigbasket_${index}`,
                  name: name.substring(0, 100),
                  price,
                  originalPrice: price * 1.2,
                  image,
                  category: 'General',
                  platform: 'bigbasket',
                  deliveryTime: '30-45 mins',
                  deliveryFee: 0,
                  availability: true,
                  brand: 'BigBasket'
                });
              }
            }
          } catch (error) {
            // Continue
          }
        });
        
        return results;
      });
      
      await page.close();
      
      const result = {
        platform: 'bigbasket',
        products: products.slice(0, 10),
        total: products.length,
        scrapedAt: new Date().toISOString()
      };
      
      cache.set(cacheKey, result);
      console.log(`Scraped ${products.length} products from BigBasket`);
      return result;
      
    } catch (error) {
      console.error('BigBasket scraping error:', error.message);
      return {
        platform: 'bigbasket',
        products: [],
        error: error.message,
        scrapedAt: new Date().toISOString()
      };
    }
  }

  async scrapeAllPlatforms(query, location = null) {
    console.log(`Starting scraping for query: ${query}`);
    if (location) {
      console.log(`📍 Using location: ${location.city || 'Unknown'}, ${location.pincode || 'N/A'}`);
    } else {
      console.log(`⚠️  No location provided - platforms may use default location`);
    }
    
    try {
      // Run all scrapers in parallel with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Scraping timeout')), 60000)
      );
      
      const scrapingPromise = Promise.allSettled([
        this.scrapeZepto(query, location),
        this.scrapeBlinkit(query, location),
        this.scrapeSwiggy(query, location),
        this.scrapeBigBasket(query, location)
      ]);
      
      const results = await Promise.race([scrapingPromise, timeoutPromise]);
      
      // Process results
      const successfulResults = results
        .filter(result => result.status === 'fulfilled' && !result.value.error)
        .map(result => result.value);
      
      const failedResults = results
        .filter(result => result.status === 'rejected' || result.value.error)
        .map(result => {
          if (result.status === 'rejected') {
            return { platform: 'unknown', error: result.reason?.message || String(result.reason) };
          } else {
            return { platform: result.value.platform, error: result.value.error };
          }
        });
      
      // Log detailed results
      console.log(`\n📊 Scraping Results Summary:`);
      console.log(`   ✅ Successful platforms: ${successfulResults.length}`);
      successfulResults.forEach(r => {
        console.log(`      - ${r.platform}: ${r.products?.length || 0} products`);
      });
      console.log(`   ❌ Failed platforms: ${failedResults.length}`);
      failedResults.forEach(r => {
        console.log(`      - ${r.platform}: ${r.error}`);
      });
      
      // Combine all products
      const allProducts = successfulResults.flatMap(result => result.products || []);
      
      // Group by product name for comparison
      const productMap = new Map();
      allProducts.forEach(product => {
        const key = product.name.toLowerCase().trim();
        if (!productMap.has(key)) {
          productMap.set(key, {
            id: product.id,
            name: product.name,
            category: product.category,
            brand: product.brand,
            image: product.image,
            prices: []
          });
        }
        productMap.get(key).prices.push({
          platform: product.platform,
          price: product.price,
          originalPrice: product.originalPrice,
          deliveryTime: product.deliveryTime,
          deliveryFee: product.deliveryFee,
          availability: product.availability
        });
      });
      
      const finalProducts = Array.from(productMap.values());
      
      console.log(`\n✅ Scraping completed: ${finalProducts.length} unique products from ${successfulResults.length} platforms`);
      
      if (finalProducts.length === 0) {
        console.log(`⚠️  No products found. Possible reasons:`);
        console.log(`   1. Location selection required on platforms`);
        console.log(`   2. Anti-bot protection blocking requests`);
        console.log(`   3. Page structure changed (selectors need update)`);
        console.log(`   4. Network/timeout issues`);
      }
      
      return {
        success: finalProducts.length > 0,
        products: finalProducts,
        platforms: successfulResults.map(r => r.platform),
        failedPlatforms: failedResults,
        totalScraped: allProducts.length,
        scrapedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Scraping failed:', error.message);
      return {
        success: false,
        products: [],
        error: error.message,
        scrapedAt: new Date().toISOString()
      };
    }
  }

}

module.exports = QuickCommerceScraper;
