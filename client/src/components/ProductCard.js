import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Star, Clock, ShoppingCart, TrendingUp } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 100px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 3rem;
`;

const Badge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: ${props => props.color || '#3b82f6'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductCategory = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CurrentPrice = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #94a3b8;
  text-decoration: line-through;
`;

const Discount = styled.span`
  background: #fef3c7;
  color: #d97706;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const PlatformInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Platform = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const PlatformIcon = styled.div`
  width: 20px;
  height: 20px;
  background: ${props => props.color || '#3b82f6'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
`;

const DeliveryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const PlatformPrices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const PlatformPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem;
  background: ${props => props.selected ? '#eff6ff' : '#f8fafc'};
  border-radius: 6px;
  border: 2px solid ${props => props.selected ? '#3b82f6' : '#e2e8f0'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const PlatformDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PlatformName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: capitalize;
`;

const PlatformPriceValue = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #059669;
`;

const DeliveryTime = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.125rem;
`;

const StarIcon = styled(Star)`
  width: 16px;
  height: 16px;
  color: ${props => props.filled ? '#fbbf24' : '#d1d5db'};
  fill: ${props => props.filled ? '#fbbf24' : 'none'};
`;

const RatingText = styled.span`
  color: #64748b;
  font-size: 0.875rem;
  margin-left: 0.5rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const CompareButton = styled(ActionButton)`
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

const AddToCartButton = styled(ActionButton)`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
  }
`;

function ProductCard({ product, delay = 0 }) {
  const {
    name,
    category,
    image,
    prices = [],
    rating = 4.5,
    reviews = 128
  } = product;

  const { addToCart } = useCart();
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  // Get the best price (lowest)
  const bestPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : 0;
  const originalPrice = prices.length > 0 ? Math.max(...prices.map(p => p.originalPrice || p.price)) : 0;
  const discount = originalPrice > bestPrice ? Math.round(((originalPrice - bestPrice) / originalPrice) * 100) : 0;
  const bestPlatform = prices.length > 0 ? prices.find(p => p.price === bestPrice)?.platform : 'zepto';

  // Set default selected platform to best price platform
  useEffect(() => {
    if (prices.length > 0 && !selectedPlatform) {
      setSelectedPlatform(prices.find(p => p.price === bestPrice) || prices[0]);
    }
  }, [prices, bestPrice, selectedPlatform]);

  const platformColors = {
    zepto: '#3b82f6',
    swiggy: '#f59e0b',
    blinkit: '#10b981',
    bigbasket: '#8b5cf6'
  };

  const handleAddToCart = () => {
    // If selected platform has a searchUrl, redirect to platform
    if (selectedPlatform?.searchUrl) {
      window.open(selectedPlatform.searchUrl, '_blank', 'noopener,noreferrer');
      toast.success(`Opening ${selectedPlatform.platform} to add to cart...`, {
        duration: 3000,
        icon: '🔗'
      });
      return;
    }

    // Fallback to product-level searchUrl
    if (product.searchUrl) {
      toast.success(`Visit ${product.platform} to see real-time prices and add to cart!`, {
        duration: 3000,
        icon: '🔗'
      });
      window.open(product.searchUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!selectedPlatform) {
      toast.error('Please select a platform first');
      return;
    }

    addToCart(product, selectedPlatform);
    toast.success(`${name} added to cart from ${selectedPlatform.platform}!`);
  };

  const handlePlatformSelect = (platform) => {
    // If platform price has a searchUrl, clicking platform redirects directly
    if (platform.searchUrl) {
      window.open(platform.searchUrl, '_blank', 'noopener,noreferrer');
      toast.success(`Opening ${platform.platform} search results...`);
      return;
    }
    
    // Fallback to product-level searchUrl
    if (product.searchUrl) {
      window.open(product.searchUrl, '_blank', 'noopener,noreferrer');
      toast.success(`Opening ${product.platform} search results...`);
      return;
    }
    
    setSelectedPlatform(platform);
  };

  const handleCardClick = () => {
    // If product has a searchUrl, clicking card redirects to platform
    if (product.searchUrl) {
      window.open(product.searchUrl, '_blank', 'noopener,noreferrer');
      toast.success(`Opening ${product.platform} search results...`);
    }
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

  return (
    <Card
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      onClick={product.searchUrl ? handleCardClick : undefined}
    >
      <ImageContainer>
        {image ? (
          <ProductImage src={image} alt={name} />
        ) : (
          <PlaceholderImage>
            <ShoppingCart size={48} />
          </PlaceholderImage>
        )}
        {discount > 0 && (
          <Badge color="#ef4444">
            {discount}% OFF
          </Badge>
        )}
      </ImageContainer>

      <Content>
        <ProductName>{name}</ProductName>
        <ProductCategory>{category}</ProductCategory>

        <PriceContainer>
          {bestPrice > 0 ? (
            <>
              <CurrentPrice>₹{bestPrice}</CurrentPrice>
              {originalPrice > bestPrice && (
                <>
                  <OriginalPrice>₹{originalPrice}</OriginalPrice>
                  <Discount>{discount}% off</Discount>
                </>
              )}
            </>
          ) : (
            <CurrentPrice style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Click to view prices on {bestPlatform}
            </CurrentPrice>
          )}
        </PriceContainer>

        {/* Show all platform prices */}
        <PlatformPrices>
          {prices.map((price, index) => (
            <PlatformPrice 
              key={index}
              selected={selectedPlatform?.platform === price.platform}
              onClick={() => handlePlatformSelect(price)}
            >
              <PlatformIcon color={platformColors[price.platform]}>
                {price.platform?.charAt(0).toUpperCase()}
              </PlatformIcon>
              <PlatformDetails>
                <PlatformName>{price.platform}</PlatformName>
                <PlatformPriceValue>₹{price.price}</PlatformPriceValue>
                <DeliveryTime>{price.deliveryTime}</DeliveryTime>
              </PlatformDetails>
            </PlatformPrice>
          ))}
        </PlatformPrices>

        <Rating>
          <Stars>{renderStars(rating)}</Stars>
          <RatingText>({reviews})</RatingText>
        </Rating>

        <Actions>
          {selectedPlatform?.searchUrl || product.searchUrl ? (
            <>
              <CompareButton onClick={() => {
                if (selectedPlatform?.searchUrl) {
                  window.open(selectedPlatform.searchUrl, '_blank', 'noopener,noreferrer');
                } else if (product.searchUrl) {
                  window.open(product.searchUrl, '_blank', 'noopener,noreferrer');
                }
              }}>
                <TrendingUp size={16} />
                View on Platform
              </CompareButton>
              <AddToCartButton onClick={handleAddToCart}>
                <ShoppingCart size={16} />
                {selectedPlatform ? `Visit ${selectedPlatform.platform?.charAt(0).toUpperCase() + selectedPlatform.platform?.slice(1)}` : 'Add to Cart'}
              </AddToCartButton>
            </>
          ) : (
            <>
              <CompareButton>
                <TrendingUp size={16} />
                Compare
              </CompareButton>
              <AddToCartButton onClick={handleAddToCart}>
                <ShoppingCart size={16} />
                Add to Cart
              </AddToCartButton>
            </>
          )}
        </Actions>
      </Content>
    </Card>
  );
}

export default ProductCard;
