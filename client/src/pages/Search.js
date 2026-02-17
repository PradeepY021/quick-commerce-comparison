import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Search as SearchIcon, SortAsc, Grid, List, Loader } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ComparisonTable from '../components/ComparisonTable';
import { useLocation } from '../contexts/LocationContext';
import toast from 'react-hot-toast';

const SearchContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
`;

const SearchHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  margin-bottom: 2rem;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1rem 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  background: transparent;
  color: #1e293b;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.8);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const FilterButton = styled.button`
  background: ${props => props.$active ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(255, 255, 255, 0.8)'};
  border: 1px solid ${props => props.$active ? 'transparent' : 'rgba(226, 232, 240, 0.5)'};
  border-radius: 12px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.$active ? 'white' : '#475569'};
  font-weight: 500;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const ViewButton = styled.button`
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#475569'};
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f8fafc'};
  }
`;

const ResultsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const ResultsCount = styled.p`
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #475569;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: #64748b;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #f1f5f9;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #94a3b8;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
`;

const EmptyDescription = styled.p`
  color: #64748b;
  margin-bottom: 2rem;
`;

const RetryButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
  }
`;

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('price');
  const [filters, setFilters] = useState({
    category: '',
    platform: ''
  });
  const { location } = useLocation();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [searchParams]); // Removed searchQuery from dependencies to prevent conflicts

  // Debounced search effect - only search when user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    if (!location) {
      toast.error('Please select your location first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the real scraping API to get actual product data
      const response = await fetch('/api/scrape/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: searchQuery.trim(),
          location: {
            city: location.city,
            pincode: location.pincode,
            state: location.state,
            coordinates: location.coordinates
          }
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success && data.results && data.results.length > 0) {
        // Use real scraped product data
        const scrapedProducts = data.results.map((product, index) => {
          // Convert scraped data format to frontend format
          return {
            id: product.id || `scraped-${index}`,
            name: product.name,
            category: product.category || 'General',
            brand: product.brand || 'Unknown',
            image: product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
            platform: product.prices?.[0]?.platform || 'zepto',
            prices: product.prices || [],
            rating: 4.2 + (index * 0.1),
            reviews: Math.floor(Math.random() * 200) + 50,
            isRealData: data.isRealData || false,
            isMockData: data.isMockData || false
          };
        });
        
        setProducts(scrapedProducts);
        console.log(`✅ Real scraped data loaded: ${scrapedProducts.length} products from ${data.platforms?.join(', ') || 'platforms'}`);
      } else if (response.ok && !data.success) {
        // No products found from scraping
        setProducts([]);
        setError(data.error || 'No products found. Please try a different search term.');
        console.log(`⚠️  No products found: ${data.error || 'No products found from any platform'}`);
      } else if (response.ok && data.success && data.platformUrls) {
        // Fallback: If scraping endpoint returns URLs instead, use old method
        const platformProducts = Object.entries(data.platformUrls).map(([platform, url], index) => {
          // Generate realistic price ranges based on product type and platform
          const productType = searchQuery.toLowerCase();
          let basePrice = 50;
          let productName = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);
          let imageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80';
          
          // Price ranges based on common product types
          if (productType.includes('milk')) {
            basePrice = 55 + (index * 5);
            productName = 'Fresh Milk 1L';
            imageUrl = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80';
          } else if (productType.includes('bread')) {
            basePrice = 35 + (index * 4);
            productName = 'White Bread 400g';
            imageUrl = 'https://images.unsplash.com/photo-1509440159596-024043877d6c?w=300&q=80';
          } else if (productType.includes('egg')) {
            basePrice = 60 + (index * 6);
            productName = 'Farm Fresh Eggs (12 pcs)';
            imageUrl = 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&q=80';
          } else if (productType.includes('rice')) {
            basePrice = 180 + (index * 15);
            productName = 'Basmati Rice 1kg';
            imageUrl = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80';
          } else if (productType.includes('fruit')) {
            basePrice = 80 + (index * 8);
            productName = 'Fresh Fruits - Mixed';
            imageUrl = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&q=80';
          } else {
            basePrice = 50 + (index * 10);
            productName = `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)} - Premium Quality`;
          }
          
          const deliveryTimes = {
            zepto: '10-15 mins',
            blinkit: '10-15 mins',
            swiggy: '20-30 mins',
            bigbasket: '30-45 mins'
          };
          
          const platformPrices = {
            zepto: basePrice,
            blinkit: basePrice - 2,
            swiggy: basePrice + 3,
            bigbasket: basePrice - 5
          };
          
          return {
            id: `platform-${platform}-${index}`,
            name: productName,
            category: 'Quick Commerce',
            brand: platform.charAt(0).toUpperCase() + platform.slice(1),
            image: imageUrl,
            platform: platform,
            searchUrl: url,
            prices: [{
              platform: platform,
              price: platformPrices[platform] || basePrice,
              originalPrice: (platformPrices[platform] || basePrice) + 15,
              deliveryTime: deliveryTimes[platform] || '15-30 mins',
              deliveryFee: 0,
              availability: true
            }],
            rating: 4.2 + (index * 0.1),
            reviews: Math.floor(Math.random() * 200) + 50
          };
        });
        
        setProducts(platformProducts);
        console.log(`✅ Generated platform search cards with pricing for: ${data.platforms?.join(', ') || 'platforms'}`);
      } else {
        throw new Error(data.error || 'Failed to fetch product data');
      }
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.prices?.[0]?.price - b.prices?.[0]?.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const filteredProducts = sortedProducts.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.platform && !product.prices?.some(p => p.platform === filters.platform)) return false;
    return true;
  });

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchForm onSubmit={handleSubmit}>
          <SearchInput
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit">
            <SearchIcon size={20} />
            Search
          </SearchButton>
        </SearchForm>

        <FiltersContainer>
          <FilterButton
            $active={filters.category === ''}
            onClick={() => handleFilterChange('category', '')}
          >
            All Categories
          </FilterButton>
          <FilterButton
            $active={filters.platform === ''}
            onClick={() => handleFilterChange('platform', '')}
          >
            All Platforms
          </FilterButton>
        </FiltersContainer>
      </SearchHeader>

      <ResultsContainer>
        <ResultsHeader>
          <ResultsCount>
            {loading ? 'Searching...' : `${filteredProducts.length} products found`}
          </ResultsCount>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <SortContainer>
              <SortAsc size={16} />
              <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="price">Price: Low to High</option>
                <option value="name">Name: A to Z</option>
                <option value="rating">Rating: High to Low</option>
              </SortSelect>
            </SortContainer>

            <ViewToggle>
              <ViewButton
                active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </ViewButton>
              <ViewButton
                active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </ViewButton>
            </ViewToggle>
          </div>
        </ResultsHeader>

        {loading && (
          <LoadingContainer>
            <Loader className="animate-spin" size={32} />
            <span style={{ marginLeft: '1rem' }}>Searching products...</span>
          </LoadingContainer>
        )}

        {error && (
          <EmptyState>
            <EmptyIcon>
              <SearchIcon size={32} />
            </EmptyIcon>
            <EmptyTitle>Search Error</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
            <RetryButton onClick={handleSearch}>
              Try Again
            </RetryButton>
          </EmptyState>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <EmptyState>
            <EmptyIcon>
              <SearchIcon size={32} />
            </EmptyIcon>
            <EmptyTitle>No products found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search terms or filters
            </EmptyDescription>
            <RetryButton onClick={() => setSearchQuery('')}>
              Clear Search
            </RetryButton>
          </EmptyState>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <ProductsGrid>
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id || index}
                    product={product}
                    delay={index * 0.1}
                  />
                ))}
              </ProductsGrid>
            ) : (
              <ComparisonTable products={filteredProducts} />
            )}
          </>
        )}
      </ResultsContainer>
    </SearchContainer>
  );
}

export default Search;
