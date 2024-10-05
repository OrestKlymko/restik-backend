import React, { useState, useRef, useMemo, useEffect } from 'react';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Animated, Image, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Restaurant, RestaurantLocation } from '../types/types.ts';
import FilterComponent from '../components/Filter.tsx';
import Ionicons from "react-native-vector-icons/Ionicons";
import RestaurantCard from "../components/RestaurantCard.tsx";

const restaurants: RestaurantLocation[] = [
    { id: 1, name: 'Restaurant 1', latitude: 37.78825, longitude: -122.4324, features: ['WiFi', 'Outdoor Seating'] },
    { id: 2, name: 'Restaurant 2', latitude: 37.78845, longitude: -122.4358, features: ['Parking'] },
    { id: 3, name: 'Restaurant 3', latitude: 37.78925, longitude: -122.4314, features: ['WiFi', 'Parking', 'Outdoor Seating'] },
];

const restaurantsInBottomSheet: Restaurant[] = [
    {
        id: 1,
        name: 'La Piazza',
        imageUrl: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg',
        rating: 4.5,
        cuisineType: 'Italian',
        distanceFromUser: 1.2,
        averagePrice: 25,
        features: ['WiFi', 'Outdoor Seating', 'Parking'],
    },
    {
        id: 2,
        name: 'Sushi World',
        imageUrl: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg',
        rating: 4.7,
        cuisineType: 'Japanese',
        distanceFromUser: 3.5,
        averagePrice: 40,
        features: ['Parking', 'Family Friendly'],
    },
    {
        id: 3,
        name: 'Burger Heaven',
        imageUrl: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg',
        rating: 4.3,
        cuisineType: 'American',
        distanceFromUser: 0.8,
        averagePrice: 15,
        features: ['WiFi', 'Pet Friendly'],
    },
];

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [visibleRestaurants, setVisibleRestaurants] = useState<RestaurantLocation[]>(restaurants);
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [chosenRestaurant, setChosenRestaurant] = useState<RestaurantLocation | null>(null);
    const [suggestionsVisible, setSuggestionsVisible] = useState(true);
    const [showSearchBar, setShowSearchBar] = useState(true);
    const [isScrollEnabled, setScrollEnabled] = useState(true);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const mapRef = useRef<MapView | null>(null);
    const opacity = useRef(new Animated.Value(0.5)).current;

    const snapPoints = useMemo(() => ['25%', '100%'], []);

    const fadeOut = () => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setShowSearchBar(false));
    };

    const fadeIn = () => {
        setShowSearchBar(true);
        Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        if (chosenRestaurant) {
            const region: Region = {
                latitude: chosenRestaurant.latitude,
                longitude: chosenRestaurant.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            mapRef.current?.animateToRegion(region, 1000);
            bottomSheetRef.current?.snapToIndex(0);
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

    const handleScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;
        if (y <= 0) {
            setScrollEnabled(false);
        } else {
            setScrollEnabled(true);
        }
    };

    const handleBottomSheetChange = (index: number) => {
        // Відновлюємо можливість скролу, коли BottomSheet відкривається
        if (index === 0) {
            setScrollEnabled(true);
        }

        if (index === 1) {
            fadeOut();
        } else {
            fadeIn();
        }
    };

    return (
        <View style={styles.container}>
            {showSearchBar && (
                <Animated.View style={[styles.searchContainer, { opacity }]}>
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
                </Animated.View>
            )}
            {showSearchBar && (
                <Animated.View style={[styles.filterButton, { opacity }]}>
                    <TouchableOpacity onPress={() => setFilterVisible(true)}>
                        <Text style={styles.filterButtonText}>
                            <Ionicons name="filter" size={22}/>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            <MapView
                ref={mapRef}
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
                            setChosenRestaurant(restaurant);
                        }}
                    >
                        <Image
                            source={require('../../assets/images/burger-marker-svgrepo-com.png')}
                            style={{ width: 50, height: 50 }}
                        />
                    </Marker>
                ))}
            </MapView>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={0}
                onChange={handleBottomSheetChange}  // Викликаємо обробник зміни стану
                enablePanDownToClose={false} // Не закриваємо повністю, коли свайпаємо вниз
                style={styles.bottomSheet}
            >
                {isFilterVisible ? (
                    <FilterComponent
                        availableFilters={['WiFi', 'Parking', 'Outdoor Seating']}
                        selectedFilters={selectedFilters}
                        toggleFilter={toggleFilter}
                    />
                ) : chosenRestaurant ? (
                    <View style={styles.bottomSheetContent}>
                        <Text style={styles.restaurantName}>{chosenRestaurant.name}</Text>
                    </View>
                ) : (
                    <ScrollView
                        onScroll={handleScroll}
                        scrollEnabled={isScrollEnabled}
                        scrollEventThrottle={16}
                    >
                        {restaurantsInBottomSheet.map((restaurant) => <RestaurantCard restaurant={restaurant} key={restaurant.id} />)}
                    </ScrollView>
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
        top: 20,
        left: 20,
        right: 20,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 19,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        width: '75%',
    },
    searchInput: {
        borderRadius: 19,
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
        top: 20,
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
    bottomSheet: {
        paddingTop: 16,
        zIndex: 2,
    },
});
