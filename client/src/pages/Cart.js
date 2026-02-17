import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ExternalLink } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const CartContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
`;

const CartContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const CartHeader = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  flex: 1;
`;

const CartItemsContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
`;

const EmptyCartIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #f8fafc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #94a3b8;
`;

const EmptyCartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
`;

const EmptyCartText = styled.p`
  margin-bottom: 2rem;
`;

const CartItem = styled(motion.div)`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  background: #f8fafc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
`;

const ItemImageContent = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const ItemCategory = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const PlatformBadge = styled.span`
  display: inline-block;
  background: ${props => props.color || '#3b82f6'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-right: 0.5rem;
`;

const DeliveryInfo = styled.span`
  color: #64748b;
  font-size: 0.875rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
`;

const QuantityButton = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

const Quantity = styled.span`
  font-weight: 600;
  color: #1e293b;
  min-width: 24px;
  text-align: center;
`;

const ItemPrice = styled.div`
  text-align: right;
  margin-left: 1rem;
  min-width: 100px;
`;

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 0.25rem;
`;

const PriceDetail = styled.div`
  font-size: 0.75rem;
  color: #64748b;
`;

const RemoveButton = styled.button`
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  color: #dc2626;
  transition: all 0.2s ease;
  margin-left: 0.5rem;

  &:hover {
    background: #fecaca;
    border-color: #fca5a5;
  }
`;

const CartSummary = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: #64748b;
  font-size: 0.875rem;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-top: 2px solid #e2e8f0;
  margin-top: 0.5rem;
`;

const TotalLabel = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
`;

const TotalAmount = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #059669;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const platformColors = {
  zepto: '#3b82f6',
  swiggy: '#f59e0b',
  blinkit: '#10b981',
  bigbasket: '#8b5cf6'
};

const platformUrls = {
  zepto: 'https://www.zepto.com',
  swiggy: 'https://www.swiggy.com',
  blinkit: 'https://www.blinkit.com',
  bigbasket: 'https://www.bigbasket.com'
};

function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const total = getCartTotal();
  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Get unique platforms from cart items
  const getUniquePlatforms = () => {
    return [...new Set(cartItems.map(item => item.platform))];
  };

  // Get the dominant platform (platform with most items)
  const getDominantPlatform = () => {
    if (cartItems.length === 0) return null;
    
    const platformCounts = {};
    cartItems.forEach(item => {
      platformCounts[item.platform] = (platformCounts[item.platform] || 0) + item.quantity;
    });
    
    return Object.keys(platformCounts).reduce((a, b) => 
      platformCounts[a] > platformCounts[b] ? a : b
    );
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const uniquePlatforms = getUniquePlatforms();
    
    if (uniquePlatforms.length === 1) {
      // All items from same platform - redirect directly
      const platform = uniquePlatforms[0];
      const platformUrl = platformUrls[platform];
      
      if (platformUrl) {
        toast.success(`Redirecting to ${platform}...`);
        // Open in new tab
        window.open(platformUrl, '_blank', 'noopener,noreferrer');
      } else {
        toast.error(`Platform ${platform} not supported`);
      }
    } else {
      // Items from multiple platforms - show dialog to choose
      const dominantPlatform = getDominantPlatform();
      const dominantPlatformUrl = platformUrls[dominantPlatform];
      
      const message = `Your cart contains items from multiple platforms:\n${uniquePlatforms.join(', ')}\n\nRedirect to ${dominantPlatform} (most items) or split cart?`;
      
      if (window.confirm(message)) {
        // Redirect to dominant platform
        if (dominantPlatformUrl) {
          toast.success(`Redirecting to ${dominantPlatform}...`);
          window.open(dominantPlatformUrl, '_blank', 'noopener,noreferrer');
        }
      } else {
        // Show platform selection
        showPlatformSelection();
      }
    }
  };

  const showPlatformSelection = () => {
    const uniquePlatforms = getUniquePlatforms();
    if (uniquePlatforms.length === 1) {
      handleCheckout();
      return;
    }
    
    const platformList = uniquePlatforms.map(p => `- ${p.charAt(0).toUpperCase() + p.slice(1)}`).join('\n');
    const selectedPlatform = window.prompt(
      `Select platform to checkout:\n\n${platformList}\n\nEnter platform name:`,
      uniquePlatforms[0]
    );
    
    if (selectedPlatform) {
      const platform = selectedPlatform.toLowerCase();
      const platformUrl = platformUrls[platform];
      
      if (platformUrl && uniquePlatforms.includes(platform)) {
        toast.success(`Redirecting to ${platform}...`);
        window.open(platformUrl, '_blank', 'noopener,noreferrer');
      } else {
        toast.error('Invalid platform selected');
      }
    }
  };

  const handleRedirectToPlatform = (platform) => {
    const platformUrl = platformUrls[platform];
    
    if (platformUrl) {
      // Filter items for this platform
      const platformItems = cartItems.filter(item => item.platform === platform);
      const message = `Redirecting to ${platform} with ${platformItems.length} item(s)...`;
      
      toast.success(message);
      window.open(platformUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error(`Platform ${platform} not supported`);
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  return (
    <CartContainer>
      <CartContent>
        <CartHeader>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </BackButton>
          <Title>Shopping Cart ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})</Title>
          {cartItems.length > 0 && (
            <BackButton onClick={handleClearCart}>
              <Trash2 size={20} />
              Clear Cart
            </BackButton>
          )}
        </CartHeader>

        {cartItems.length === 0 ? (
          <CartItemsContainer>
            <EmptyCart>
              <EmptyCartIcon>
                <ShoppingCart size={40} />
              </EmptyCartIcon>
              <EmptyCartTitle>Your cart is empty</EmptyCartTitle>
              <EmptyCartText>Add some products to get started!</EmptyCartText>
              <BackButton onClick={() => navigate('/')}>
                <ArrowLeft size={20} />
                Continue Shopping
              </BackButton>
            </EmptyCart>
          </CartItemsContainer>
        ) : (
          <>
            <CartItemsContainer>
              {cartItems.map((item, index) => (
                <CartItem
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ItemImage>
                    {item.productImage ? (
                      <ItemImageContent src={item.productImage} alt={item.productName} />
                    ) : (
                      <ShoppingCart size={32} color="#94a3b8" />
                    )}
                  </ItemImage>
                  <ItemDetails>
                    <ItemName>{item.productName}</ItemName>
                    <ItemCategory>{item.category}</ItemCategory>
                    <div>
                      <PlatformBadge color={platformColors[item.platform]}>
                        {item.platform}
                      </PlatformBadge>
                      <DeliveryInfo>Delivers in {item.deliveryTime}</DeliveryInfo>
                    </div>
                  </ItemDetails>
                  <QuantityControls>
                    <QuantityButton
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus size={16} />
                    </QuantityButton>
                    <Quantity>{item.quantity}</Quantity>
                    <QuantityButton
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus size={16} />
                    </QuantityButton>
                  </QuantityControls>
                  <ItemPrice>
                    <Price>₹{(item.price * item.quantity).toFixed(2)}</Price>
                    <PriceDetail>₹{item.price} each</PriceDetail>
                    {item.deliveryFee > 0 && (
                      <PriceDetail>+ ₹{item.deliveryFee} delivery</PriceDetail>
                    )}
                  </ItemPrice>
                  <RemoveButton onClick={() => handleRemove(item.id)}>
                    <Trash2 size={18} />
                  </RemoveButton>
                </CartItem>
              ))}
            </CartItemsContainer>

            <CartSummary>
              <SummaryTitle>Order Summary</SummaryTitle>
              <SummaryRow>
                <span>Items ({itemsCount})</span>
                <span>₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Delivery Fees</span>
                <span>₹{cartItems.reduce((sum, item) => sum + (item.deliveryFee || 0), 0).toFixed(2)}</span>
              </SummaryRow>
              <SummaryTotal>
                <TotalLabel>Total</TotalLabel>
                <TotalAmount>₹{total.toFixed(2)}</TotalAmount>
              </SummaryTotal>
              <CheckoutButton onClick={handleCheckout}>
                {(() => {
                  const uniquePlatforms = getUniquePlatforms();
                  if (uniquePlatforms.length === 1) {
                    return `Checkout on ${uniquePlatforms[0].charAt(0).toUpperCase() + uniquePlatforms[0].slice(1)}`;
                  } else {
                    return 'Proceed to Checkout';
                  }
                })()}
                <ExternalLink size={20} />
              </CheckoutButton>
            </CartSummary>
          </>
        )}
      </CartContent>
    </CartContainer>
  );
}

export default Cart;

