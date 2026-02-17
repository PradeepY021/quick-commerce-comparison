import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Search, Menu, X, ShoppingCart, TrendingUp, MapPin } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLocation } from '../contexts/LocationContext';
import toast from 'react-hot-toast';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #1e293b;
  font-weight: 700;
  font-size: 1.5rem;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  width: 20px;
  height: 20px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #3b82f6;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #475569;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: flex-start;
  justify-content: flex-end;
  padding: 1rem;
`;

const MobileMenuContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 300px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MobileMenuClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #475569;
`;

const MobileNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MobileNavLink = styled(Link)`
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    color: #3b82f6;
  }
`;

const CartLink = styled(Link)`
  position: relative;
  text-decoration: none;
  color: #475569;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    color: #3b82f6;
  }
`;

const CartBadge = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  border: 2px solid white;
`;

const LocationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #3b82f6;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const LocationText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const platformUrls = {
  zepto: 'https://www.zepto.com',
  swiggy: 'https://www.swiggy.com',
  blinkit: 'https://www.blinkit.com',
  bigbasket: 'https://www.bigbasket.com'
};

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { getCartItemsCount, cartItems } = useCart();
  const { location, openLocationModal } = useLocation();
  const cartCount = getCartItemsCount();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    
    // If cart is empty, navigate to cart page
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Get unique platforms from cart items
    const uniquePlatforms = [...new Set(cartItems.map(item => item.platform))];
    
    if (uniquePlatforms.length === 1) {
      // All items from same platform - redirect directly to platform
      const platform = uniquePlatforms[0];
      const platformUrl = platformUrls[platform];
      
      if (platformUrl) {
        toast.success(`Redirecting to ${platform}...`);
        window.open(platformUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Platform URL not found, navigate to cart page
        navigate('/cart');
      }
    } else {
      // Items from multiple platforms - navigate to cart page to choose
      navigate('/cart');
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <LogoIcon>QC</LogoIcon>
          QuickCommerce
        </Logo>

        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </SearchContainer>

        <Nav>
          {location && (
            <LocationButton onClick={openLocationModal} title="Change location">
              <MapPin size={16} />
              <LocationText>{location.displayName || `${location.city}${location.pincode ? ` - ${location.pincode}` : ''}${location.state ? `, ${location.state}` : ''}`}</LocationText>
            </LocationButton>
          )}
          <NavLink to="/">
            <TrendingUp size={20} />
            Home
          </NavLink>
          <NavLink to="/comparison">
            <TrendingUp size={20} />
            Compare
          </NavLink>
          <CartLink to="/cart" onClick={handleCartClick}>
            <ShoppingCart size={24} />
            {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
          </CartLink>
          <NavLink to="/about">About</NavLink>
        </Nav>

        <MobileMenuButton onClick={toggleMobileMenu}>
          <Menu size={24} />
        </MobileMenuButton>
      </HeaderContent>

      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileMenuContent>
          <MobileMenuHeader>
            <h3>Menu</h3>
            <MobileMenuClose onClick={toggleMobileMenu}>
              <X size={24} />
            </MobileMenuClose>
          </MobileMenuHeader>
          <MobileNav>
            {location && (
              <MobileNavLink as="button" onClick={() => {
                toggleMobileMenu();
                openLocationModal();
              }} style={{ border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <MapPin size={20} />
                {location.displayName || `${location.city}${location.pincode ? ` - ${location.pincode}` : ''}${location.state ? `, ${location.state}` : ''}`}
              </MobileNavLink>
            )}
            <MobileNavLink to="/" onClick={toggleMobileMenu}>
              <TrendingUp size={20} />
              Home
            </MobileNavLink>
            <MobileNavLink to="/comparison" onClick={toggleMobileMenu}>
              <TrendingUp size={20} />
              Compare
            </MobileNavLink>
            <MobileNavLink to="/cart" onClick={(e) => {
              toggleMobileMenu();
              handleCartClick(e);
            }}>
              <ShoppingCart size={20} />
              Cart {cartCount > 0 && `(${cartCount})`}
            </MobileNavLink>
            <MobileNavLink to="/about" onClick={toggleMobileMenu}>
              About
            </MobileNavLink>
          </MobileNav>
        </MobileMenuContent>
      </MobileMenu>
    </HeaderContainer>
  );
}

export default Header;
