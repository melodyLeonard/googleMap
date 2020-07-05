import React from 'react'

const LocateMe = ({ panTo }) => {

    const findMe = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        }, (err) => {
            console.error(err)
        })
    }

    return (
        <button className="locate" onClick={findMe}>
            Find Me
        </button>
    )
}

export default LocateMe
