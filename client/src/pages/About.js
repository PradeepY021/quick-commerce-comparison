import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Shield, Users, Target, Zap } from 'lucide-react';

const AboutContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem 0;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 4rem;
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

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Section = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1e293b;
  text-align: center;
`;

const SectionContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Card = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const CardIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
`;

const CardDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.875rem;
`;

const TeamSection = styled.section`
  background: white;
  padding: 4rem 0;
  margin: 4rem 0;
  border-radius: 16px;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const TeamMember = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
`;

const MemberAvatar = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 2rem;
  font-weight: 700;
`;

const MemberName = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const MemberRole = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const MemberBio = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const CTA = styled(motion.div)`
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, #1e293b, #334155);
  color: white;
  border-radius: 16px;
  margin: 4rem 0;
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

function About() {
  const features = [
    {
      icon: <TrendingUp size={32} />,
      title: 'Real-time Price Comparison',
      description: 'Compare prices across Zepto, Swiggy, and BigBasket instantly. Our advanced algorithms ensure you always get the most accurate and up-to-date pricing information.'
    },
    {
      icon: <Clock size={32} />,
      title: 'Delivery Time Optimization',
      description: 'Not just price comparison - we also help you find the fastest delivery options. See delivery times for each platform and choose what works best for your schedule.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Trusted & Reliable',
      description: 'We partner directly with platforms to ensure data accuracy. Our system is built with reliability and user trust as core principles.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Lightning Fast',
      description: 'Get comparison results in seconds, not minutes. Our optimized infrastructure ensures quick responses even during peak usage times.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Products Compared' },
    { number: '10K+', label: 'Happy Users' },
    { number: '₹2M+', label: 'Money Saved' },
    { number: '99.9%', label: 'Uptime' }
  ];

  const team = [
    {
      name: 'Pradeep Yadav',
      role: 'Founder & CEO',
      bio: 'Passionate about making shopping more efficient and cost-effective for everyone.'
    },
    {
      name: 'Tech Team',
      role: 'Development Team',
      bio: 'Building the future of price comparison with cutting-edge technology.'
    }
  ];

  return (
    <AboutContainer>
      <HeroSection>
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About QuickCommerce Compare
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We're revolutionizing how people shop online by making price comparison simple, fast, and reliable.
        </HeroSubtitle>
      </HeroSection>

      <ContentContainer>
        <Section>
          <SectionTitle>Our Mission</SectionTitle>
          <Card
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <CardIcon>
              <Target size={32} />
            </CardIcon>
            <CardTitle>Empowering Smart Shopping</CardTitle>
            <CardDescription>
              Our mission is to empower consumers with the information they need to make smart shopping decisions. 
              We believe that everyone deserves access to the best prices and deals, regardless of which platform they prefer. 
              By providing real-time price comparisons across major quick-commerce platforms, we help users save money and time on their everyday purchases.
            </CardDescription>
          </Card>
        </Section>

        <Section>
          <SectionTitle>What We Do</SectionTitle>
          <SectionContent>
            {features.map((feature, index) => (
              <Card
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CardIcon>{feature.icon}</CardIcon>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </Card>
            ))}
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Our Impact</SectionTitle>
          <StatsContainer>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsContainer>
        </Section>

        <TeamSection>
          <SectionTitle>Our Team</SectionTitle>
          <TeamGrid>
            {team.map((member, index) => (
              <TeamMember
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MemberAvatar>
                  {member.name.charAt(0)}
                </MemberAvatar>
                <MemberName>{member.name}</MemberName>
                <MemberRole>{member.role}</MemberRole>
                <MemberBio>{member.bio}</MemberBio>
              </TeamMember>
            ))}
          </TeamGrid>
        </TeamSection>

        <CTA
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <CTATitle>Ready to Start Saving?</CTATitle>
          <CTADescription>
            Join thousands of users who save money every day with our price comparison tool.
          </CTADescription>
          <CTAButton onClick={() => window.location.href = '/comparison'}>
            <TrendingUp size={20} />
            Start Comparing Now
          </CTAButton>
        </CTA>
      </ContentContainer>
    </AboutContainer>
  );
}

export default About;
