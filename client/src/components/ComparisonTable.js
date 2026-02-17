import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ShoppingCart, Clock, Star, TrendingUp, ExternalLink } from 'lucide-react';

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const HeaderRow = styled.tr``;

const HeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ProductHeaderCell = styled(HeaderCell)`
  width: 40%;
`;

const PlatformHeaderCell = styled(HeaderCell)`
  width: 20%;
  text-align: center;
`;

const TableBody = styled.tbody``;

const ProductRow = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ProductCell = styled.td`
  padding: 1.5rem 1rem;
  vertical-align: top;
`;

const ProductInfo = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const ProductImage = styled.div`
  width: 60px;
  height: 60px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  flex-shrink: 0;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
  line-height: 1.4;
`;

const ProductCategory = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.125rem;
`;

const StarIcon = styled(Star)`
  width: 14px;
  height: 14px;
  color: ${props => props.filled ? '#fbbf24' : '#d1d5db'};
  fill: ${props => props.filled ? '#fbbf24' : 'none'};
`;

const RatingText = styled.span`
  color: #64748b;
  font-size: 0.75rem;
  margin-left: 0.25rem;
`;

const PlatformCell = styled.td`
  padding: 1.5rem 1rem;
  text-align: center;
  vertical-align: top;
`;

const PlatformInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const PlatformLogo = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.color};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
`;

const PlatformName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const CurrentPrice = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
`;

const OriginalPrice = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
  text-decoration: line-through;
`;

const Discount = styled.div`
  background: #fef3c7;
  color: #d97706;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const DeliveryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #64748b;
  font-size: 0.75rem;
  margin-top: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : '#f8fafc'};
  color: ${props => props.primary ? 'white' : '#475569'};
  border: ${props => props.primary ? 'none' : '1px solid #e2e8f0'};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.primary ? '0 10px 15px -3px rgba(59, 130, 246, 0.4)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'};
  }
`;

const BestDealBadge = styled.div`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`;

const SavingsInfo = styled.div`
  color: #10b981;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.25rem;
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
`;

function ComparisonTable({ products }) {
  if (!products || products.length === 0) {
    return (
      <TableContainer>
        <EmptyState>
          <EmptyIcon>
            <TrendingUp size={32} />
          </EmptyIcon>
          <EmptyTitle>No products to compare</EmptyTitle>
          <EmptyDescription>
            Search for products to see price comparisons
          </EmptyDescription>
        </EmptyState>
      </TableContainer>
    );
  }

  const platformColors = {
    zepto: '#3b82f6',
    swiggy: '#f59e0b',
    bigbasket: '#8b5cf6'
  };

  const platformNames = {
    zepto: 'Zepto',
    swiggy: 'Swiggy',
    bigbasket: 'BigBasket'
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          filled={i < fullStars || (i === fullStars && hasHalfStar)}
        />
      );
    }
    return stars;
  };

  const findBestDeal = (product) => {
    if (!product.prices || product.prices.length === 0) return null;
    
    const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);
    return sortedPrices[0];
  };

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <HeaderRow>
            <ProductHeaderCell>Product</ProductHeaderCell>
            <PlatformHeaderCell>Zepto</PlatformHeaderCell>
            <PlatformHeaderCell>Swiggy</PlatformHeaderCell>
            <PlatformHeaderCell>BigBasket</PlatformHeaderCell>
          </HeaderRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => {
            const bestDeal = findBestDeal(product);
            const prices = product.prices || [];
            
            // Create a map of platform prices for easy lookup
            const priceMap = {};
            prices.forEach(price => {
              priceMap[price.platform] = price;
            });

            return (
              <ProductRow key={product.id || index}>
                <ProductCell>
                  <ProductInfo>
                    <ProductImage>
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      ) : (
                        <ShoppingCart size={24} />
                      )}
                    </ProductImage>
                    <ProductDetails>
                      <ProductName>{product.name}</ProductName>
                      <ProductCategory>{product.category}</ProductCategory>
                      <ProductRating>
                        <Stars>{renderStars(product.rating || 4.5)}</Stars>
                        <RatingText>({product.reviews || 128})</RatingText>
                      </ProductRating>
                    </ProductDetails>
                  </ProductInfo>
                </ProductCell>

                {['zepto', 'swiggy', 'bigbasket'].map(platform => {
                  const price = priceMap[platform];
                  const isBestDeal = bestDeal && price && price.platform === bestDeal.platform;
                  
                  return (
                    <PlatformCell key={platform}>
                      <PlatformInfo>
                        <PlatformLogo color={platformColors[platform]}>
                          {platform.charAt(0).toUpperCase()}
                        </PlatformLogo>
                        <PlatformName>{platformNames[platform]}</PlatformName>
                        
                        {price ? (
                          <>
                            {isBestDeal && <BestDealBadge>Best Deal</BestDealBadge>}
                            <PriceInfo>
                              <CurrentPrice>₹{price.price}</CurrentPrice>
                              {price.originalPrice && price.originalPrice > price.price && (
                                <>
                                  <OriginalPrice>₹{price.originalPrice}</OriginalPrice>
                                  <Discount>
                                    {Math.round(((price.originalPrice - price.price) / price.originalPrice) * 100)}% off
                                  </Discount>
                                </>
                              )}
                            </PriceInfo>
                            <DeliveryInfo>
                              <Clock size={12} />
                              {price.deliveryTime || '10-15 mins'}
                            </DeliveryInfo>
                            {price.deliveryFee > 0 && (
                              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                +₹{price.deliveryFee} delivery
                              </div>
                            )}
                            <ActionButton primary={isBestDeal}>
                              <ShoppingCart size={14} />
                              {isBestDeal ? 'Buy Now' : 'View'}
                            </ActionButton>
                          </>
                        ) : (
                          <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                            Not available
                          </div>
                        )}
                      </PlatformInfo>
                    </PlatformCell>
                  );
                })}
              </ProductRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ComparisonTable;
