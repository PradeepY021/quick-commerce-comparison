import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Clock, Shield, Star, ArrowRight, MapPin } from 'lucide-react';
import ComparisonTable from '../components/ComparisonTable';
import ProductCard from '../components/ProductCard';

const ComparisonContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem 0;
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchContainer = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem 1rem 3.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  width: 20px;
  height: 20px;
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
  }
`;

const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const LocationInput = styled.input`
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  width: 200px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const LocationIcon = styled(MapPin)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  width: 16px;
  height: 16px;
`;

const LocationWrapper = styled.div`
  position: relative;
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
  flex-wrap: wrap;
  gap: 1rem;
`;

const ResultsCount = styled.p`
  color: #64748b;
  font-size: 1rem;
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
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;

  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f8fafc'};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
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

const FeaturesSection = styled.section`
  padding: 4rem 0;
  background: white;
  margin-top: 4rem;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1e293b;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: #f8fafc;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
`;

const FeatureDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
`;

function Comparison() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState({ city: 'Mumbai', pincode: '400001' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/comparison/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: searchQuery.trim(),
          location
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.results || []);
      } else {
        throw new Error(data.error || 'Failed to compare products');
      }
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <TrendingUp size={32} />,
      title: 'Real-time Price Comparison',
      description: 'Compare prices across Zepto, Swiggy, and BigBasket instantly and find the best deals.'
    },
    {
      icon: <Clock size={32} />,
      title: 'Delivery Time Tracking',
      description: 'See delivery times for each platform and choose the fastest option for your needs.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Trusted & Reliable',
      description: 'Get accurate, up-to-date information from verified sources to make informed decisions.'
    }
  ];

  return (
    <ComparisonContainer>
      <Header>
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Compare Prices
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Find the best deals across all quick-commerce platforms
        </Subtitle>

        <SearchContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <form onSubmit={handleSearch}>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search for products to compare..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton type="submit">
              Compare Prices
              <ArrowRight size={20} />
            </SearchButton>
          </form>
        </SearchContainer>

        <LocationContainer>
          <LocationWrapper>
            <LocationIcon />
            <LocationInput
              type="text"
              placeholder="City"
              value={location.city}
              onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
            />
          </LocationWrapper>
          <LocationInput
            type="text"
            placeholder="Pincode"
            value={location.pincode}
            onChange={(e) => setLocation(prev => ({ ...prev, pincode: e.target.value }))}
          />
        </LocationContainer>
      </Header>

      <ResultsContainer>
        {products.length > 0 && (
          <ResultsHeader>
            <ResultsCount>
              {products.length} products found
            </ResultsCount>
            <ViewToggle>
              <ViewButton
                active={viewMode === 'table'}
                onClick={() => setViewMode('table')}
              >
                <TrendingUp size={16} />
                Table View
              </ViewButton>
              <ViewButton
                active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
              >
                <Star size={16} />
                Grid View
              </ViewButton>
            </ViewToggle>
          </ResultsHeader>
        )}

        {loading && (
          <LoadingContainer>
            <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTop: '3px solid #3b82f6', borderRadius: '50%' }} />
            <span style={{ marginLeft: '1rem' }}>Comparing prices...</span>
          </LoadingContainer>
        )}

        {error && (
          <EmptyState>
            <EmptyIcon>
              <TrendingUp size={32} />
            </EmptyIcon>
            <EmptyTitle>Comparison Error</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
            <RetryButton onClick={() => setSearchQuery('')}>
              Try Again
            </RetryButton>
          </EmptyState>
        )}

        {!loading && !error && products.length === 0 && searchQuery && (
          <EmptyState>
            <EmptyIcon>
              <Search size={32} />
            </EmptyIcon>
            <EmptyTitle>No products found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search terms or location
            </EmptyDescription>
            <RetryButton onClick={() => setSearchQuery('')}>
              Clear Search
            </RetryButton>
          </EmptyState>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            {viewMode === 'table' ? (
              <ComparisonTable products={products} />
            ) : (
              <ProductsGrid>
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id || index}
                    product={product}
                    delay={index * 0.1}
                  />
                ))}
              </ProductsGrid>
            )}
          </>
        )}

        {!loading && !error && !searchQuery && (
          <EmptyState>
            <EmptyIcon>
              <TrendingUp size={32} />
            </EmptyIcon>
            <EmptyTitle>Start Comparing Prices</EmptyTitle>
            <EmptyDescription>
              Search for products to see price comparisons across all platforms
            </EmptyDescription>
          </EmptyState>
        )}
      </ResultsContainer>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Why Compare with Us?</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>
    </ComparisonContainer>
  );
}

export default Comparison;
