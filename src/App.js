import React, { useState, useCallback, useRef } from 'react';
import './App.css';
import Spinner from './components/spinner/Spinner'
import mapStyles from './mapStypes'
import Search from './components/Search'
import LocateMe from './components/LocateMe'


import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from '@react-google-maps/api'

import { formatRelative } from 'date-fns'

const libraries = ['places']

const mapContainerStyle = {
  width: '100vw',
  height: '100vh'
}
const center = {
  lat: 5.49424,
  lng: 7.03339
}

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true
}


function App() {

  const [markers, setMarkers] = useState([]);

  const [selected, setSelected] = useState(null)

  const onMapClick = useCallback((e) => {
    setMarkers(current => [...current, {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      time: new Date()
    }])
  },
    [])

  const mapRef = useRef()

  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map
    },
    [],
  )

  const panTo = useCallback(
    ({ lat, lng }) => {
      mapRef.current.panTo({ lat, lng })
      mapRef.current.setZoom(20)
    },
    [],
  )

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries
  })



  if (loadError) return "There was an error trying to load map"
  if (!isLoaded) return <Spinner />
  return (
    <div className="App">
      <h1>Leo's Map</h1>
      <Search panTo={panTo} />
      <LocateMe panTo={panTo} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.map(marker => <Marker
          key={marker.time.toISOString()}
          onClick={() => {
            setSelected(marker);
          }}
          position={{ lat: marker.lat, lng: marker.lng }}
        />)}

        {
          selected ?
            (<InfoWindow
              position={{
                lat: selected.lat,
                lng: selected.lng
              }}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <h2>This is {`${selected.lat} ${selected.long}`}</h2>
                <p>Marker set on {formatRelative(selected.time, new Date())}</p>
              </div>
            </InfoWindow>) :
            null
        }
      </GoogleMap>

    </div>
  );
}

export default App;
