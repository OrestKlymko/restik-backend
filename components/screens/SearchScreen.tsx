import React, { useState, useRef, useMemo, useEffect } from 'react';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { RestaurantLocation } from "../types/types.ts";
import FilterComponent from "../components/Filter.tsx";

const restaurants: RestaurantLocation[] = [
    { id: 1, name: 'Restaurant 1', latitude: 37.78825, longitude: -122.4324, features: ['WiFi', 'Outdoor Seating'] },
    { id: 2, name: 'Restaurant 2', latitude: 37.78845, longitude: -122.4358, features: ['Parking'] },
    { id: 3, name: 'Restaurant 3', latitude: 37.78925, longitude: -122.4314, features: ['WiFi', 'Parking', 'Outdoor Seating'] },
];

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [visibleRestaurants, setVisibleRestaurants] = useState<RestaurantLocation[]>(restaurants);
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [chosenRestaurant, setChosenRestaurant] = useState<RestaurantLocation | null>(null);
    const [suggestionsVisible, setSuggestionsVisible] = useState(true);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const mapRef = useRef<MapView | null>(null); // Додаємо реф для MapView

    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []); // Шторка трохи відкрита

    // Переміщення до обраного ресторану після вибору
    useEffect(() => {
        if (chosenRestaurant) {
            const region: Region = {
                latitude: chosenRestaurant.latitude,
                longitude: chosenRestaurant.longitude,
                latitudeDelta: 0.01, // Збільшили для кращого фокусу
                longitudeDelta: 0.01,
            };

            // Плавне переміщення карти
            mapRef.current?.animateToRegion(region, 1000);

            // Робимо шторку привідкритою
            bottomSheetRef.current?.snapToIndex(0); // Встановлюємо привідкритий стан (15%)
        }
    }, [chosenRestaurant]);

    const toggleFilter = (filter: string) => {
        if (selectedFilters.includes(filter)) {
            setSelectedFilters(selectedFilters.filter(f => f !== filter));
        } else {
            setSelectedFilters([...selectedFilters, filter]);
        }
    };

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        setSuggestionsVisible(text !== '');
    };

    const renderSuggestion = ({ item }: { item: RestaurantLocation }) => (
        <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => {
                setSearchQuery(item.name);
                setSuggestionsVisible(false);
                setChosenRestaurant(item);
            }}
        >
            <Text style={styles.suggestionText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Пошуковий бар зверху */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for a restaurant"
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                />
                {suggestionsVisible && searchQuery.length > 0 && (
                    <FlatList
                        data={visibleRestaurants.filter(restaurant =>
                            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )}
                        renderItem={renderSuggestion}
                        keyExtractor={(item) => item.id.toString()}
                        style={styles.suggestionsList}
                        keyboardShouldPersistTaps="handled"
                    />
                )}
            </View>
            <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
                <Text style={styles.filterButtonText}>F</Text>
            </TouchableOpacity>

            {/* Карта з маркерами ресторанів */}
            <MapView
                ref={mapRef} // Прив'язуємо реф до MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onPress={(event: MapPressEvent) => {
                    if (event.nativeEvent.action !== 'marker-press') {
                        setChosenRestaurant(null);
                        setFilterVisible(false);
                    }
                }}
            >
                {visibleRestaurants.map((restaurant) => (
                    <Marker
                        key={restaurant.id}
                        coordinate={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
                        title={restaurant.name}
                        onPress={() => {
                            setFilterVisible(false);
                            setChosenRestaurant(restaurant)
                        }}
                    />
                ))}
            </MapView>

            {/* BottomSheet для фільтрів або деталей ресторанів */}
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={0} // Шторка трохи відкрита
            >
                {isFilterVisible ? (
                    <FilterComponent
                        availableFilters={['WiFi', 'Parking', 'Outdoor Seating']}
                        selectedFilters={selectedFilters}
                        toggleFilter={toggleFilter}
                    />
                ) : (
                    chosenRestaurant && (
                        <View style={styles.bottomSheetContent}>
                            <Text style={styles.restaurantName}>{chosenRestaurant.name}</Text>
                        </View>
                    )
                )}
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    searchContainer: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    searchInput: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: 'white',
    },
    suggestionsList: {
        marginTop: 10,
        maxHeight: 150,
        borderWidth: 1,
        borderRadius: 8,
    },
    suggestionItem: {
        padding: 10,
    },
    suggestionText: {
        fontSize: 16,
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    filterButtonText: {
        color: 'white',
        fontSize: 18,
    },
    bottomSheetContent: {
        padding: 16,
    },
    restaurantName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
