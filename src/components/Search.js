import React from 'react'

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng
} from 'use-places-autocomplete'

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption
} from "@reach/combobox"


const Search = ({ panTo }) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions
    } = usePlacesAutocomplete({
        requestOptions: {
            location: {
                lat: () => 5.49424,
                lng: () => 7.03339
            },
            radius: 700 * 1000,
        }
    })
    return (
        <div className="search">
            <Combobox onSelect={async (address) => {
                setValue(address, false)
                clearSuggestions()
                try {
                    const results = await getGeocode({ address })
                    const { lat, lng } = await getLatLng(results[0])
                    panTo({ lat, lng })
                } catch (err) {
                    console.error(err)
                }
            }}>
                <ComboboxInput
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                    disabled={!ready}
                    placeholder="Search an address"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" && data.map(({ id, description }) => (
                            <ComboboxOption key={id} value={description} />
                        ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    )
}

export default Search
