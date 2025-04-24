import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Button from '../UI/Button';
import * as Location from 'expo-location';

const MapScreen = ({ navigation, route }) => {
  const { latitude, longitude, adres } = route.params ?? { latitude: 37.78825, longitude: -122.4324, adres: null };
  
  const [regionLat, setRegionLat] = useState(latitude);
  const [regionLong, setRegionLong] = useState(longitude);
  const [adress, setAddress] = useState(null);
  const mapRef = useRef(null);

  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const [region, setRegion] = useState(initialRegion);

  const focusHandler = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  };

  // Fetch address using reverse geocoding
  useEffect(() => {
    const getLocation = async () => {
      try {
        const response = await Location.reverseGeocodeAsync({
          latitude: regionLat,
          longitude: regionLong,
        });

        if (response.length > 0) {
          const item = response[0];
          setAddress(`${item.street}, ${item.city}, ${item.region}`);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    };

    getLocation();
  }, [regionLat, regionLong]);

  const doneHandler = () => {
    if (adres) {
      adres(adress);
    }
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
     
      <Text style={{ textAlign: 'center', color: '#560C42' }}>
        {adress ?? 'Fetching address...'}
      </Text>

      <MapView
        style={{ width: '100%', height: 550 }}
        showsMyLocationButton
        showsUserLocation
        ref={mapRef}
        initialRegion={initialRegion}
        onRegionChangeComplete={(newRegion) => {
          setRegion(newRegion);
          setRegionLat(newRegion.latitude);
          setRegionLong(newRegion.longitude);
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Initial Location"
        />
        <Marker
          coordinate={{ latitude: regionLat, longitude: regionLong }}
          pinColor="green"
          title="Current Location"
        />
      </MapView>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
        <Button onPress={focusHandler}>Focus</Button>
        <Button onPress={doneHandler}>Done</Button>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </View>
    </View>
  );
};

export default MapScreen;
