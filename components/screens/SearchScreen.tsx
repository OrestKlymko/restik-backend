import React, { useState, useRef, useMemo } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

import { RestaurantLocation } from "../types/types.ts";

export default function SearchScreen() {
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantLocation | null>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

    const restaurants = [
        { id: 1, name: 'Restaurant 1', latitude: 37.78825, longitude: -122.4324 },
        { id: 2, name: 'Restaurant 2', latitude: 37.78845, longitude: -122.4358 },
        { id: 3, name: 'Restaurant 3', latitude: 37.78925, longitude: -122.4314 },
    ];

    const openBottomSheet = (restaurant: RestaurantLocation) => {
        setSelectedRestaurant(restaurant);
        bottomSheetRef.current?.expand();
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onPress={() => {
                    setSelectedRestaurant(null);
                    bottomSheetRef.current?.close();
                }}
            >
                {restaurants.map((restaurant) => (
                    <Marker
                        key={restaurant.id}
                        coordinate={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
                        title={restaurant.name}
                        onPress={() => openBottomSheet(restaurant)}
                    />
                ))}
            </MapView>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1} // Initially closed
                snapPoints={snapPoints}
            >
                <View style={styles.bottomSheetContent}>
                    {selectedRestaurant ? (
                        <Text>{selectedRestaurant.name}</Text>
                    ) : (
                        <Text>Select a marker to see details</Text>
                    )}
                </View>
            </BottomSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    bottomSheetContent: {
        backgroundColor: 'white',
        padding: 16,
        height: 300,
    },
});
