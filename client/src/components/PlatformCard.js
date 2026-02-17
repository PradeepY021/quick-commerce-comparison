import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Clock, Truck } from 'lucide-react';

const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const PlatformHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PlatformLogo = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.color};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
`;

const PlatformInfo = styled.div`
  flex: 1;
`;

const PlatformName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const PlatformTagline = styled.p`
  color: #64748b;
  font-size: 0.875rem;
`;

const PlatformStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const StatIcon = styled.div`
  color: ${props => props.color || '#64748b'};
`;

const DeliveryTime = styled.div`
  background: #f0fdf4;
  color: #16a34a;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  margin-top: 1rem;
`;

const ClickIndicator = styled.div`
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  margin-top: 0.5rem;
  opacity: 0.8;
`;

function PlatformCard({ platform, delay = 0 }) {
  const platformUrls = {
    'Zepto': 'https://www.zepto.com',
    'Swiggy': 'https://www.swiggy.com',
    'Blinkit': 'https://www.blinkit.com',
    'BigBasket': 'https://www.bigbasket.com'
  };

  const handlePlatformClick = () => {
    const url = platformUrls[platform.name];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      onClick={handlePlatformClick}
    >
      <PlatformHeader>
        <PlatformLogo color={platform.color}>
          {platform.name.charAt(0)}
        </PlatformLogo>
        <PlatformInfo>
          <PlatformName>{platform.name}</PlatformName>
          <PlatformTagline>Quick Commerce Platform</PlatformTagline>
        </PlatformInfo>
      </PlatformHeader>

      <PlatformStats>
        <Stat>
          <StatIcon color="#3b82f6">
            <Clock size={16} />
          </StatIcon>
          <span>Fast Delivery</span>
        </Stat>
        <Stat>
          <StatIcon color="#10b981">
            <Truck size={16} />
          </StatIcon>
          <span>Reliable</span>
        </Stat>
      </PlatformStats>

      <DeliveryTime>
        {platform.deliveryTime} delivery
      </DeliveryTime>

      <ClickIndicator>
        Click to visit {platform.name}
      </ClickIndicator>
    </Card>
  );
}

export default PlatformCard;
