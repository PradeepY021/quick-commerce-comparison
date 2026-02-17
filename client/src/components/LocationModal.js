import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useLocation } from '../contexts/LocationContext';
import { MapPin, X, Loader, Search, Target } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;
  color: #666;

  &:hover {
    background: #f5f5f5;
  }
`;

const LocationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border: 2px solid ${props => props.primary ? '#3b82f6' : '#e5e7eb'};
  background: ${props => props.primary ? '#3b82f6' : 'white'};
  color: ${props => props.primary ? 'white' : '#1a1a1a'};
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background: ${props => props.primary ? '#2563eb' : '#f9fafb'};
    border-color: ${props => props.primary ? '#2563eb' : '#d1d5db'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ManualInputSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 16px;
  color: #9ca3af;
  pointer-events: none;
  z-index: 1;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
  z-index: 1;

  &:hover {
    background: #f3f4f6;
    color: #6b7280;
  }
`;

const Input = styled.input`
  padding: 12px 16px 12px 48px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
  padding-right: ${props => props.hasValue ? '48px' : '16px'};
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SuggestionsList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: -1px;
`;

const SuggestionItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px dotted #e5e7eb;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const SuggestionIcon = styled.div`
  color: #6b7280;
  flex-shrink: 0;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SuggestionContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SuggestionName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
  line-height: 1.4;
`;

const SuggestionDetails = styled.div`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  margin-top: 2px;
`;

const LoadingText = styled.div`
  padding: 12px 16px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingSpinner = styled(Loader)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

function LocationModal() {
  const { updateLocation, showLocationModal, closeLocationModal } = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Popular Indian cities for quick selection
  const popularCities = [
    { name: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
    { name: 'Delhi', pincode: '110001', state: 'Delhi' },
    { name: 'Bangalore', pincode: '560001', state: 'Karnataka' },
    { name: 'Hyderabad', pincode: '500001', state: 'Telangana' },
    { name: 'Chennai', pincode: '600001', state: 'Tamil Nadu' },
    { name: 'Kolkata', pincode: '700001', state: 'West Bengal' },
    { name: 'Pune', pincode: '411001', state: 'Maharashtra' },
    { name: 'Ahmedabad', pincode: '380001', state: 'Gujarat' }
  ];

  const getCurrentLocation = () => {
    setLoading(true);
    setError('');
    setCity(''); // Clear any previous search input

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    console.log('📍 Requesting geolocation...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`📍 Got coordinates: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`);
          
          // Use high-precision coordinates from Chrome's geolocation
          const preciseLat = latitude;
          const preciseLon = longitude;
          
          // Reverse geocoding with more detailed parameters for better accuracy
          // Using Nominatim with addressdetails=1 and zoom=18 for maximum precision
          // Using Chrome's precise lat/long coordinates
          console.log('🌐 Fetching address from geocoding service...');
          
          let data;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${preciseLat}&lon=${preciseLon}&zoom=18&addressdetails=1&extratags=1&namedetails=1`,
              {
                headers: {
                  'User-Agent': 'QuickCommerce-App/1.0',
                  'Accept-Language': 'en'
                }
              }
            );
            
            if (!response.ok) {
              throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
            }
            
            data = await response.json();
            console.log('🌐 Geocoding response:', data);
          } catch (fetchError) {
            console.error('❌ Fetch error:', fetchError);
            // If geocoding fails, still save the location with precise coordinates from Chrome
            updateLocation({
              city: 'Current Location',
              pincode: '',
              state: '',
              coordinates: {
                latitude: preciseLat,
                longitude: preciseLon
              },
              address: `Lat: ${preciseLat.toFixed(6)}, Lon: ${preciseLon.toFixed(6)}`,
              displayName: `Current Location (${preciseLat.toFixed(6)}, ${preciseLon.toFixed(6)})`
            });
            setLoading(false);
            setError('Location detected but could not fetch address details. You can search for your address manually.');
            return;
          }
          
          if (data && data.address) {
            const address = data.address;
            
            // More precise city extraction - try multiple fields in order of specificity
            const cityName = address.city || 
                            address.town || 
                            address.municipality ||
                            address.village || 
                            address.suburb ||
                            address.county || 
                            address.district ||
                            'Unknown';
            
            const pincodeValue = address.postcode || '';
            const stateName = address.state || address.state_district || '';
            
            // Build a more precise and detailed location name
            const locationParts = [];
            
            // Add specific location details in order of precision
            if (address.house_number && address.road) {
              locationParts.push(`${address.house_number} ${address.road}`);
            } else if (address.road) {
              locationParts.push(address.road);
            }
            
            if (address.neighbourhood && !locationParts.includes(address.neighbourhood)) {
              locationParts.push(address.neighbourhood);
            }
            
            if (address.suburb && address.suburb !== cityName) {
              locationParts.push(address.suburb);
            }
            
            if (address.city_district && address.city_district !== cityName) {
              locationParts.push(address.city_district);
            }
            
            if (cityName && cityName !== 'Unknown') {
              locationParts.push(cityName);
            }
            
            if (stateName) {
              locationParts.push(stateName);
            }
            
            // Use the full display_name from Nominatim if available, otherwise build from parts
            let displayName = data.display_name || locationParts.join(', ');
            
            // If we have a very specific address, use it; otherwise use the built one
            if (data.display_name && data.display_name.split(',').length > 2) {
              displayName = data.display_name;
            } else if (locationParts.length > 0) {
              displayName = locationParts.join(', ');
            } else {
              displayName = data.display_name || `${cityName}${stateName ? ', ' + stateName : ''}`;
            }
            
            // Ensure we have meaningful location data
            if (cityName === 'Unknown' && !pincodeValue) {
              throw new Error('Could not determine precise location');
            }
            
            console.log('✅ Location determined:', { cityName, pincodeValue, stateName, displayName });
            
            updateLocation({
              city: cityName,
              pincode: pincodeValue,
              state: stateName,
              coordinates: {
                latitude: preciseLat,
                longitude: preciseLon
              },
              address: data.display_name || displayName,
              displayName: displayName
            });
            
            setLoading(false);
          } else {
            // Fallback: use coordinates if reverse geocoding fails
            throw new Error('No address data received from geocoding service');
          }
        } catch (err) {
          console.error('❌ Geocoding error:', err);
          setError(`Could not determine your precise location: ${err.message}. Please search for your address manually.`);
          setLoading(false);
        }
      },
      (err) => {
        console.error('❌ Geolocation error:', err);
        let errorMessage = 'Could not access your location. ';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings or enter manually.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable. Please try again or enter manually.';
            break;
          case err.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again or enter manually.';
            break;
          default:
            errorMessage += 'Please enter your location manually.';
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true, // Request high-accuracy GPS coordinates from Chrome
        timeout: 20000, // Increased timeout for high-accuracy GPS
        maximumAge: 0 // Always get fresh location, don't use cached
      }
    );
  };

  const selectPopularCity = (cityData) => {
    updateLocation({
      city: cityData.name,
      pincode: cityData.pincode,
      state: cityData.state,
      coordinates: null,
      address: `${cityData.name}, ${cityData.state}`,
      displayName: `${cityData.name}, ${cityData.state} - ${cityData.pincode}`
    });
  };

  // Debounced function to fetch location suggestions
  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    try {
      // Using OpenStreetMap Nominatim API for location search
      // Try multiple query variations to handle typos and get more results
      const queryLower = query.toLowerCase();
      const hasLocationSuffix = queryLower.includes('india') || 
                                queryLower.includes('karnataka') || 
                                queryLower.includes('bangalore') ||
                                queryLower.includes('bengaluru');
      
      // Build multiple query variations to try
      const queryVariations = [];
      
      // 1. Original query with India suffix (if not already present)
      if (!hasLocationSuffix) {
        queryVariations.push(`${query}, India`);
      }
      
      // 2. Original query as-is
      queryVariations.push(query);
      
      // 3. Try common spelling corrections for known places
      // Fix common typos for Koramangala
      if (queryLower.includes('kormangal') || queryLower.includes('koramangal')) {
        queryVariations.push('Koramangala, Bangalore, India');
        queryVariations.push('Koramangala, Karnataka, India');
        queryVariations.push('Koramangala');
      }
      
      // 4. Try without country restriction (broader search)
      queryVariations.push(`${query}, Karnataka`);
      queryVariations.push(`${query}, Bangalore`);
      
      console.log(`🔍 Trying ${queryVariations.length} query variations for "${query}"`);
      
      // Try all variations in parallel - first try with India restriction, then without
      const searchPromises = queryVariations.flatMap((searchQuery, index) => [
        // With India country restriction
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=15&addressdetails=1&extratags=1&namedetails=1&dedupe=1`,
          {
            headers: {
              'User-Agent': 'QuickCommerce-App/1.0',
              'Accept-Language': 'en'
            }
          }
        )
        .then(res => res.json())
        .then(results => {
          console.log(`  Variation ${index + 1}a (with IN restriction, "${searchQuery}"): ${results.length} results`);
          return { results, restricted: true };
        })
        .catch(err => {
          console.log(`  Variation ${index + 1}a failed:`, err.message);
          return { results: [], restricted: true };
        }),
        // Without country restriction (broader search)
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=15&addressdetails=1&extratags=1&namedetails=1&dedupe=1`,
          {
            headers: {
              'User-Agent': 'QuickCommerce-App/1.0',
              'Accept-Language': 'en'
            }
          }
        )
        .then(res => res.json())
        .then(results => {
          console.log(`  Variation ${index + 1}b (no restriction, "${searchQuery}"): ${results.length} results`);
          return { results, restricted: false };
        })
        .catch(err => {
          console.log(`  Variation ${index + 1}b failed:`, err.message);
          return { results: [], restricted: false };
        })
      ]);
      
      // Wait for all searches to complete
      const allSearchResults = await Promise.all(searchPromises);
      
      // Prioritize restricted (India-only) results, but include unrestricted if needed
      const restrictedResults = [];
      const unrestrictedResults = [];
      
      for (const { results, restricted } of allSearchResults) {
        if (restricted) {
          restrictedResults.push(...results);
        } else {
          unrestrictedResults.push(...results);
        }
      }
      
      console.log(`📊 Restricted (IN only) results: ${restrictedResults.length}`);
      console.log(`📊 Unrestricted results: ${unrestrictedResults.length}`);
      
      // Use restricted results if we have enough, otherwise combine both
      let combinedResults = restrictedResults.length >= 5 ? restrictedResults : [...restrictedResults, ...unrestrictedResults];
      
      // Remove duplicates based on display_name and coordinates
      const seen = new Set();
      const unique = [];
      for (const item of combinedResults) {
        if (!item.display_name) continue;
        const key = `${item.display_name}_${item.lat}_${item.lon}`;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(item);
        }
      }
      
      // Filter to India locations if we have unrestricted results mixed in
      let data = unique;
      if (unrestrictedResults.length > 0) {
        const indiaResults = unique.filter(item => {
          const addr = item.address || {};
          const displayName = (item.display_name || '').toLowerCase();
          return displayName.includes('india') || 
                 displayName.includes('karnataka') || 
                 displayName.includes('bangalore') ||
                 displayName.includes('bengaluru') ||
                 addr.country_code === 'in';
        });
        
        if (indiaResults.length > 0) {
          data = indiaResults;
          console.log(`🇮🇳 Filtered to ${data.length} India-specific results`);
        } else {
          console.log(`🌍 No India-specific results found, using all ${data.length} results`);
        }
      } else {
        console.log(`✅ Using ${data.length} India-restricted results`);
      }
      
      // Limit to top 20 by importance
      data = data
        .sort((a, b) => (b.importance || 0) - (a.importance || 0))
        .slice(0, 20);
      
      console.log(`✅ Final: ${data.length} unique results after deduplication and filtering`);
      
      const formattedSuggestions = data.map((item) => {
        const addr = item.address || {};
        const displayName = item.display_name || '';
        
        // Extract primary name - try to get a meaningful name
        // Priority: name > house_number + road > city
        let primaryName = '';
        if (item.name) {
          primaryName = item.name;
        } else if (addr.house_number && addr.road) {
          primaryName = `${addr.house_number} ${addr.road}`;
        } else if (addr.road) {
          primaryName = addr.road;
        } else if (addr.neighbourhood) {
          primaryName = addr.neighbourhood;
        } else if (addr.suburb) {
          primaryName = addr.suburb;
        } else if (addr.city_district) {
          primaryName = addr.city_district;
        } else if (addr.city || addr.town || addr.village) {
          primaryName = addr.city || addr.town || addr.village;
        } else {
          // Fallback to first part of display name
          primaryName = displayName.split(',')[0] || '';
        }
        
        return {
          displayName: displayName,
          primaryName: primaryName.trim(),
          city: addr.city || addr.town || addr.village || addr.county || '',
          state: addr.state || '',
          pincode: addr.postcode || '',
          coordinates: item.lat && item.lon ? {
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon)
          } : null,
          fullAddress: displayName,
          type: item.type || '',
          importance: item.importance || 0
        };
      })
      // Less strict filter - keep results that have a valid display name or location data
      .filter(item => {
        const isValid = item.displayName && item.displayName.length > 0;
        if (!isValid) {
          console.log(`🚫 Filtered out invalid item:`, item);
        }
        return isValid;
      })
      // Sort by importance (higher importance first) to show most relevant results
      .sort((a, b) => (b.importance || 0) - (a.importance || 0));
      
      console.log(`✅ Formatted ${formattedSuggestions.length} unique suggestions for "${query}"`);
      console.log(`📝 Suggestions list:`, formattedSuggestions.map(s => s.primaryName));
      setSuggestions(formattedSuggestions);
      setShowSuggestions(formattedSuggestions.length > 0);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Debounce timer ref
  const debounceTimer = useRef(null);

  // Handle city input change with debouncing
  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setError('');
    
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300); // 300ms delay
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    // Always save the location when a suggestion is selected
    const cityName = suggestion.city || suggestion.displayName.split(',')[0];
    const pincodeValue = suggestion.pincode || '';
    
    updateLocation({
      city: cityName,
      pincode: pincodeValue,
      state: suggestion.state || '',
      coordinates: suggestion.coordinates,
      address: suggestion.fullAddress,
      displayName: suggestion.displayName
    });
    
    // Clear the input and suggestions
    setCity('');
    setSuggestions([]);
    setShowSuggestions(false);
    setError('');
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSuggestions && !event.target.closest('.suggestions-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);


  if (!showLocationModal) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && closeLocationModal()}>
      <ModalContent>
        <ModalHeader>
          <Title>
            <MapPin size={24} />
            Your Location
          </Title>
          <CloseButton onClick={closeLocationModal}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <InputWrapper className="suggestions-container" style={{ marginBottom: '16px' }}>
          <SearchInputContainer>
            <SearchIconWrapper>
              <Search size={20} />
            </SearchIconWrapper>
            <Input
              type="text"
              placeholder="Search a new address"
              value={city}
              onChange={handleCityChange}
              onFocus={() => {
                if (suggestions.length > 0 || city.length >= 2) {
                  setShowSuggestions(true);
                }
              }}
              autoComplete="off"
              hasValue={city.length > 0}
            />
            {city.length > 0 && (
              <ClearButton
                onClick={() => {
                  setCity('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                  setError('');
                }}
                type="button"
              >
                <X size={16} />
              </ClearButton>
            )}
          </SearchInputContainer>
          {showSuggestions && (
            <SuggestionsList>
              {loadingSuggestions ? (
                <LoadingText>Searching locations...</LoadingText>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => {
                  // Use primaryName if available, otherwise extract from displayName
                  const primaryName = suggestion.primaryName || suggestion.city || suggestion.displayName.split(',')[0] || 'Location';
                  // Full address is the complete display name
                  const fullAddress = suggestion.displayName || suggestion.fullAddress || '';
                  
                  return (
                    <SuggestionItem
                      key={index}
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <SuggestionIcon>
                        <MapPin size={18} strokeWidth={2} />
                      </SuggestionIcon>
                      <SuggestionContent>
                        <SuggestionName>
                          {primaryName}
                        </SuggestionName>
                        <SuggestionDetails>
                          {fullAddress}
                        </SuggestionDetails>
                      </SuggestionContent>
                    </SuggestionItem>
                  );
                })
              ) : city.length >= 2 ? (
                <LoadingText>No locations found</LoadingText>
              ) : null}
            </SuggestionsList>
          )}
        </InputWrapper>

        <LocationButton 
          onClick={getCurrentLocation} 
          disabled={loading}
          style={{ 
            width: '100%', 
            marginBottom: '16px',
            backgroundColor: loading ? '#f3f4f6' : 'white',
            color: loading ? '#9ca3af' : '#ef4444',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontWeight: 500,
            padding: '14px 16px'
          }}
        >
          {loading ? (
            <>
              <LoadingSpinner size={20} />
              Detecting location...
            </>
          ) : (
            <>
              <Target size={20} style={{ color: '#ef4444' }} />
              Use My Current Location
            </>
          )}
        </LocationButton>

        {error && (
          <ErrorMessage style={{ marginTop: '8px', marginBottom: '16px' }}>
            <X size={16} />
            {error}
          </ErrorMessage>
        )}

        <ManualInputSection>
          <Label style={{ marginBottom: '12px' }}>Or select a popular city:</Label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {popularCities.map((cityData) => (
              <LocationButton
                key={cityData.name}
                onClick={() => selectPopularCity(cityData)}
                style={{ fontSize: '14px', padding: '12px' }}
              >
                {cityData.name}
              </LocationButton>
            ))}
          </div>
        </ManualInputSection>
      </ModalContent>
    </ModalOverlay>
  );
}

export default LocationModal;

