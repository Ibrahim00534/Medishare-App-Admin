import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { dummyDeliveries } from './dummyDeliveries';
import L from 'leaflet';
import { Table, Button } from 'react-bootstrap';
import Deliveries from './Deliveries';

// Marker Icon Setup
const icon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
});

const LiveDeliveryMap = () => {
  const [deliveries, setDeliveries] = useState(dummyDeliveries);
  const [showMap, setShowMap] = useState(true); // State to toggle map view

  // Simulate Live Tracking Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) => ({
          ...delivery,
          currentLocation: {
            lat: delivery.currentLocation.lat + (Math.random() * 0.01 - 0.005),
            lng: delivery.currentLocation.lng + (Math.random() * 0.01 - 0.005),
          },
        }))
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Toggle the visibility of the map
  const toggleView = () => {
    setShowMap((prev) => !prev);
  };

  return (
    <div>
      <Button onClick={toggleView}>
        {showMap ? 'View All Deliveries' : 'Back to Map'}
      </Button>

      {showMap ? (
        <MapContainer center={[33.6844, 73.0479]} zoom={7} style={{ height: '80vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {deliveries.map((delivery) => (
            <Marker
              key={delivery.id}
              position={[delivery.currentLocation.lat, delivery.currentLocation.lng]}
              icon={icon}
            >
              <Popup>
                <div>
                  <strong>Donation ID:</strong> {delivery.donationId} <br />
                  <strong>Delivery Person:</strong> {delivery.deliveryPerson} <br />
                  <strong>Destination:</strong> {delivery.destination}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <Deliveries />
      )}
    </div>
  );
};

export default LiveDeliveryMap;
