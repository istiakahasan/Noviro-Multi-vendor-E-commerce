"use client";

import React, { useCallback, useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  height: "500px",
  width: "100%",
};

const defaultCenter = {
  lat: 50.8695,  // Central Germany (near Erfurt)
  lng: 11.0990,
};

interface MapViewProps {
  lat?: number;
  lng?: number;
}

const MapView = ({ lat, lng }: MapViewProps) => {
  const [position, setPosition] = useState(lat && lng ? { lat, lng } : defaultCenter);
  
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setPosition({ lat: newLat, lng: newLng });
    }
  };

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div>
      <div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={position}
          zoom={13}
          onLoad={onMapLoad}
          options={{
            zoomControl: true,          
            mapTypeControl: false,      
            scaleControl: false,        
            streetViewControl: false,   
            rotateControl: false,       
            fullscreenControl: false,   
            draggable: true,            
            scrollwheel: true,          
            disableDoubleClickZoom: false, 
            gestureHandling: "auto",    
            keyboardShortcuts: false,  
          }}
        >
          <Marker
            position={position}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapView;