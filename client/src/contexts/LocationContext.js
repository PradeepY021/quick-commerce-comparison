import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    // Load location from localStorage on initialization
    const savedLocation = localStorage.getItem('quickCommerceLocation');
    return savedLocation ? JSON.parse(savedLocation) : null;
  });
  
  const [showLocationModal, setShowLocationModal] = useState(() => {
    // Show modal if location is not set
    const savedLocation = localStorage.getItem('quickCommerceLocation');
    return !savedLocation;
  });

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (location) {
      localStorage.setItem('quickCommerceLocation', JSON.stringify(location));
      setShowLocationModal(false);
    }
  }, [location]);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
  };

  const openLocationModal = () => {
    setShowLocationModal(true);
  };

  const closeLocationModal = () => {
    setShowLocationModal(false);
  };

  const value = {
    location,
    updateLocation,
    showLocationModal,
    openLocationModal,
    closeLocationModal
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

