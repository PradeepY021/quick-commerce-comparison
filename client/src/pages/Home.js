import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, Star, ArrowRight, Loader } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import PlatformCard from '../components/PlatformCard';
import { useLocation } from '../contexts/LocationContext';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 0;
  color: white;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchContainer = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto 4rem;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.25rem 1.5rem 1.25rem 3.5rem;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    transform: translateY(-2px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  width: 24px;
  height: 24px;
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-50%) translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1e293b;
`;

const PlatformsSection = styled.section`
  padding: 4rem 0;
  background: #f8fafc;
`;

const PlatformsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const PlatformsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const TrendingSection = styled.section`
  padding: 4rem 0;
  background: white;
`;

const TrendingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const TrendingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const CTA = styled(motion.div)`
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, #1e293b, #334155);
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const CTADescription = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.4);
  }
`;

const ProductsSection = styled.section`
  padding: 4rem 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
`;

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ViewAllButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
  }
`;

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { location } = useLocation();

  const fetchRealTimeProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Popular search terms to show on landing page
      const popularSearches = ['milk', 'bread', 'eggs'];
      const allProducts = [];
      
      // Fetch real-time data for each popular search term
      for (const searchTerm of popularSearches) {
        try {
          const response = await fetch('/api/scrape/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              searchQuery: searchTerm,
              location: location ? {
                city: location.city,
                pincode: location.pincode,
                state: location.state,
                coordinates: location.coordinates
              } : null
            })
          });
          
          const data = await response.json();
          
          // Handle both real scraped data and mock data fallback
          if (response.ok && data.success && data.results && data.results.length > 0) {
            // Convert scraped/mock data to product format
            const scrapedProducts = data.results.map((product, index) => ({
              id: product.id || `scraped-${searchTerm}-${index}`,
              name: product.name,
              category: product.category || 'General',
              brand: product.brand || 'Multiple Platforms',
              image: product.image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80`,
              prices: product.prices || [],
              rating: product.rating || (4.0 + (Math.random() * 0.5)), // Use product rating or random
              reviews: product.reviews || Math.floor(Math.random() * 200) + 50
            }));
            
            allProducts.push(...scrapedProducts);
          } else if (response.ok && !data.success && data.isMockData === false) {
            // API returned an error but not mock data - log it
            console.log(`No products for ${searchTerm}: ${data.error || 'Unknown error'}`);
          }
        } catch (err) {
          console.error(`Error fetching data for ${searchTerm}:`, err);
          // Continue with other searches even if one fails
        }
      }
      
      if (allProducts.length > 0) {
        setProducts(allProducts);
        console.log(`✅ Landing page loaded ${allProducts.length} products`);
      } else {
        // If no products found, don't show error - just show empty state
        setProducts([]);
        setError(null); // Don't show error, let users search
      }
    } catch (err) {
      console.error('Error fetching real-time products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealTimeProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const platforms = [
    { name: 'Zepto', color: '#3b82f6', deliveryTime: '10-15 mins' },
    { name: 'Swiggy', color: '#f59e0b', deliveryTime: '20-30 mins' },
    { name: 'Blinkit', color: '#10b981', deliveryTime: '10-15 mins' },
    { name: 'BigBasket', color: '#8b5cf6', deliveryTime: '30-45 mins' }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>
            Find the Best Deals
            <br />
            Across All Platforms
          </HeroTitle>
          <HeroSubtitle>
            Compare prices from Zepto, Swiggy, Blinkit, and BigBasket in one place. 
            Save money and time on your grocery shopping.
          </HeroSubtitle>
        </motion.div>

        <SearchContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSearch}>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton type="submit">
              Search
              <ArrowRight size={20} />
            </SearchButton>
          </form>
        </SearchContainer>
      </HeroSection>

      <ProductsSection>
        <ProductsContainer>
          <SectionTitle>Available Products with Price Comparison</SectionTitle>
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              padding: '4rem',
              color: '#64748b'
            }}>
              <Loader className="animate-spin" size={32} />
              <span style={{ marginLeft: '1rem' }}>Loading real-time products...</span>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
              <p>Error loading products: {error}</p>
              <button 
                onClick={fetchRealTimeProducts}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  marginTop: '1rem',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              <p>No products found. Try searching for a product above.</p>
            </div>
          ) : (
            <>
              <ProductsGrid>
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    delay={index * 0.1}
                  />
                ))}
              </ProductsGrid>
              <div style={{ textAlign: 'center' }}>
                <ViewAllButton onClick={() => navigate('/search')}>
                  View All Products
                  <ArrowRight size={20} />
                </ViewAllButton>
              </div>
            </>
          )}
        </ProductsContainer>
      </ProductsSection>

      <PlatformsSection>
        <PlatformsContainer>
          <SectionTitle>Compare Across All Platforms</SectionTitle>
          <PlatformsGrid>
            {platforms.map((platform, index) => (
              <PlatformCard
                key={platform.name}
                platform={platform}
                delay={index * 0.1}
              />
            ))}
          </PlatformsGrid>
        </PlatformsContainer>
      </PlatformsSection>

      <TrendingSection>
        <TrendingContainer>
          <SectionTitle>Trending Searches</SectionTitle>
          <TrendingGrid>
            {/* This would be populated with actual trending products */}
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              <Star size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>Trending products will appear here</p>
            </div>
          </TrendingGrid>
        </TrendingContainer>
      </TrendingSection>

      <CTA>
        <CTATitle>Ready to Start Saving?</CTATitle>
        <CTADescription>
          Join thousands of users who save money every day with our price comparison tool.
        </CTADescription>
        <CTAButton onClick={() => navigate('/comparison')}>
          Start Comparing
          <ArrowRight size={20} />
        </CTAButton>
      </CTA>
    </HomeContainer>
  );
}

export default Home;
