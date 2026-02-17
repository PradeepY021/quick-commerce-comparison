# All Scraping Functions - Complete Examples

## Overview
This document shows all platform scraping functions in `/Users/pradeepyadav/quick-commerce-comparison/services/scraper.js`

---

## Main Coordinator Function

### `scrapeAllPlatforms(query)` - Lines 780-881

**Purpose**: Runs all 4 platform scrapers in parallel and combines results

**How it works**:
1. Runs all scrapers in parallel using `Promise.allSettled()`
2. Sets a 60-second timeout
3. Processes results: filters successful vs failed
4. Combines all products from all platforms
5. Groups products by name (case-insensitive) to compare prices across platforms
6. Returns formatted results with products grouped by name and their prices from each platform

**Example Usage**:
```javascript
const scraper = new QuickCommerceScraper();
const results = await scraper.scrapeAllPlatforms("milk");
// Returns: { success: true, products: [...], platforms: [...], failedPlatforms: [...] }
```

**Return Format**:
```javascript
{
  success: true/false,
  products: [
    {
      id: "zepto_0",
      name: "Amul Fresh Milk 500ml",
      category: "General",
      brand: "Zepto",
      image: "https://...",
      prices: [
        { platform: "zepto", price: 50, deliveryTime: "10-15 mins" },
        { platform: "blinkit", price: 52, deliveryTime: "10-15 mins" }
      ]
    }
  ],
  platforms: ["zepto", "blinkit"],
  failedPlatforms: [],
  totalScraped: 10,
  scrapedAt: "2025-11-06T20:34:52.628Z"
}
```

---

## Platform Scraping Functions

### 1. `scrapeZepto(query)` - Lines 99-286

**URL Pattern**: `https://www.zepto.com/search?q={query}`

**Example**: `https://www.zepto.com/search?q=milk`

**Delivery Time**: 10-15 mins

**How it works**:
1. Checks cache first (5-minute TTL)
2. Opens browser with stealth mode (anti-detection) using `setupStealthPage()`
3. Navigates to Zepto search URL
4. Waits for page to load (3 seconds + selector wait)
5. Extracts product data using multiple selector strategies
6. Finds product name, price, image
7. Returns up to 10 products with metadata
8. Caches results for 5 minutes

**Key Features**:
- Uses enhanced stealth mode (`setupStealthPage()`)
- Debug logging for page title, URL, and location modals
- Multiple fallback selectors for product cards
- Regex-based price extraction if selectors fail

**Return Format**:
```javascript
{
  platform: "zepto",
  products: [
    {
      id: "zepto_0",
      name: "Amul Fresh Milk 500ml",
      price: 50,
      originalPrice: 55,
      image: "https://...",
      category: "General",
      platform: "zepto",
      deliveryTime: "10-15 mins",
      deliveryFee: 0,
      availability: true,
      brand: "Zepto"
    }
  ],
  total: 10,
  scrapedAt: "2025-11-06T20:34:52.628Z"
}
```

---

### 2. `scrapeBlinkit(query)` - Lines 449-617

**URL Pattern**: `https://blinkit.com/s/?q={query}`

**Example**: `https://blinkit.com/s/?q=milk`

**Delivery Time**: 10-15 mins

**How it works**:
1. Checks cache first (5-minute TTL)
2. Opens browser with stealth mode using `setupStealthPage()`
3. Navigates to Blinkit search URL
4. Waits for page to load (3 seconds)
5. Extracts products using multiple selector strategies
6. Returns up to 10 products
7. Caches results for 5 minutes

**Key Features**:
- Uses enhanced stealth mode (`setupStealthPage()`)
- Same extraction logic as Zepto
- Multiple fallback selectors

**Return Format**: Same as Zepto (with `platform: "blinkit"`)

---

### 3. `scrapeSwiggy(query)` - Lines 288-447

**URL Pattern**: `https://www.swiggy.com/instamart/search?q={query}`

**Example**: `https://www.swiggy.com/instamart/search?q=milk`

**Delivery Time**: 20-30 mins

**How it works**:
1. Checks cache first (5-minute TTL)
2. Opens browser with basic user agent (not stealth mode)
3. Navigates to Swiggy Instamart search URL
4. Waits for page to load (3 seconds)
5. Extracts products using multiple selector strategies
6. Returns up to 10 products
7. Caches results for 5 minutes

**Key Features**:
- Uses `browser.newPage()` with basic user agent (not stealth)
- Same extraction logic as other platforms
- Original price calculated as `price * 1.15`

**Return Format**: Same as Zepto (with `platform: "swiggy"`, `deliveryTime: "20-30 mins"`)

---

### 4. `scrapeBigBasket(query)` - Lines 619-778

**URL Pattern**: `https://www.bigbasket.com/ps/?q={query}`

**Example**: `https://www.bigbasket.com/ps/?q=milk`

**Delivery Time**: 30-45 mins

**How it works**:
1. Checks cache first (5-minute TTL)
2. Opens browser with basic user agent (not stealth mode)
3. Navigates to BigBasket search URL
4. Waits for page to load (3 seconds)
5. Extracts products using multiple selector strategies
6. Returns up to 10 products
7. Caches results for 5 minutes

**Key Features**:
- Uses `browser.newPage()` with basic user agent (not stealth)
- Same extraction logic as other platforms
- Original price calculated as `price * 1.2`

**Return Format**: Same as Zepto (with `platform: "bigbasket"`, `deliveryTime: "30-45 mins"`)

---

## Common Pattern Across All Scrapers

### 1. Cache Check
```javascript
const cacheKey = `{platform}_${query.toLowerCase()}`;
const cached = cache.get(cacheKey);
if (cached) {
  return cached; // Return cached data if available
}
```

### 2. Browser Initialization
```javascript
const browser = await this.initBrowser();
const page = await this.setupStealthPage(browser); // For Zepto & Blinkit
// OR
const page = await browser.newPage(); // For Swiggy & BigBasket
```

### 3. Navigation
```javascript
const searchUrl = `{PLATFORM_URL}?q=${encodeURIComponent(query)}`;
await page.goto(searchUrl, { 
  waitUntil: 'domcontentloaded',
  timeout: 30000 
});
```

### 4. Wait for Content
```javascript
await this.delay(3000); // Wait 3 seconds for dynamic content
await page.waitForSelector('[data-testid="product-card"], ...', { timeout: 15000 });
```

### 5. Product Extraction
```javascript
const products = await page.evaluate(() => {
  // Try multiple selectors to find product containers
  const selectors = [
    '[data-testid="product-card"]',
    '.product-card',
    '.ProductCard',
    // ... more fallback selectors
  ];
  
  // Find product cards
  // Extract name, price, image
  // Return array of products
});
```

### 6. Result Formatting
```javascript
const result = {
  platform: '{platform}',
  products: products.slice(0, 10), // Limit to 10
  total: products.length,
  scrapedAt: new Date().toISOString()
};

cache.set(cacheKey, result); // Cache for 5 minutes
return result;
```

---

## Helper Functions

### `initBrowser()` - Lines 23-46
Initializes Puppeteer browser with anti-detection settings

### `setupStealthPage(browser)` - Lines 63-97
Creates a page with enhanced anti-detection:
- Random user agent
- Viewport settings
- Navigator property overrides
- Extra HTTP headers

### `delay(ms)` - Lines 59-61
Simple delay utility for waiting

### `closeBrowser()` - Lines 48-53
Closes the browser instance

---

## URL Patterns Summary

| Platform | Function | URL Pattern | Example |
|----------|----------|-------------|---------|
| Zepto | `scrapeZepto()` | `https://www.zepto.com/search?q={query}` | `https://www.zepto.com/search?q=milk` |
| Blinkit | `scrapeBlinkit()` | `https://blinkit.com/s/?q={query}` | `https://blinkit.com/s/?q=milk` |
| Swiggy | `scrapeSwiggy()` | `https://www.swiggy.com/instamart/search?q={query}` | `https://www.swiggy.com/instamart/search?q=milk` |
| BigBasket | `scrapeBigBasket()` | `https://www.bigbasket.com/ps/?q={query}` | `https://www.bigbasket.com/ps/?q=milk` |

---

## Differences Between Platforms

### Stealth Mode
- **Zepto & Blinkit**: Use `setupStealthPage()` (enhanced anti-detection)
- **Swiggy & BigBasket**: Use `browser.newPage()` with basic user agent

### Price Calculation
- **Zepto**: `originalPrice = price * 1.1`
- **Blinkit**: `originalPrice = price * 1.1`
- **Swiggy**: `originalPrice = price * 1.15`
- **BigBasket**: `originalPrice = price * 1.2`

### Delivery Times
- **Zepto & Blinkit**: 10-15 mins
- **Swiggy**: 20-30 mins
- **BigBasket**: 30-45 mins

---

## Example: Searching for "milk"

When you search for "milk", the system:

1. **Calls** `scrapeAllPlatforms("milk")`
2. **Runs in parallel**:
   - `scrapeZepto("milk")` → `https://www.zepto.com/search?q=milk`
   - `scrapeBlinkit("milk")` → `https://blinkit.com/s/?q=milk`
   - `scrapeSwiggy("milk")` → `https://www.swiggy.com/instamart/search?q=milk`
   - `scrapeBigBasket("milk")` → `https://www.bigbasket.com/ps/?q=milk`
3. **Combines results** and groups by product name
4. **Returns** products with prices from all platforms

---

## Error Handling

All scrapers return a consistent error format:
```javascript
{
  platform: "{platform}",
  products: [],
  error: "Error message",
  scrapedAt: "2025-11-06T20:34:52.628Z"
}
```

The main `scrapeAllPlatforms()` function:
- Catches timeouts (60 seconds)
- Logs detailed results summary
- Returns `failedPlatforms` array with error details
- Provides helpful debugging messages when no products found

---

## Caching

- **TTL**: 5 minutes (300 seconds)
- **Cache Key Format**: `{platform}_{query.toLowerCase()}`
- **Example**: `zepto_milk`, `blinkit_milk`

Cache is shared across all scraping functions using `NodeCache`.

---

## Debugging

Enhanced logging includes:
- Page title and URL after navigation
- Location modal detection
- Product count per platform
- Detailed success/failure summary
- Error stack traces

Check server console for detailed logs when scraping.

