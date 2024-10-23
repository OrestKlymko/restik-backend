import React, {useState, useRef, useMemo, useEffect} from 'react';
import MapView, {MapPressEvent, Marker, Region} from 'react-native-maps';
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Modal,
    Button,
    PermissionsAndroid,
    Platform
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Restaurant} from '../types/types.ts';
import FilterComponent from '../components/Filter.tsx';
import Ionicons from "react-native-vector-icons/Ionicons";
import RestaurantCard from "../components/RestaurantCard.tsx";
import {RestaurantFinal} from "../components/final/RestaurantFinal.tsx";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import axios from "axios";

const typeToIcon: Record<string, string> = {
    'Кафе': 'coffee',
    'Ресторан': 'utensils',
    'Бар': 'beer',
    'Паб': 'glass-martini-alt',
    'Кав\'ярня': 'mug-hot',
    'Фастфуд': 'hamburger',
    'Кафе-кондитерська': 'birthday-cake',
    'Суші бар': 'utensils',
};

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [restaurants, setRestaurants] = useState<Restaurant[]>();
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [chosenRestaurant, setChosenRestaurant] = useState<Restaurant | null>(null);
    const [suggestionsVisible, setSuggestionsVisible] = useState(true);
    const [showSearchBar, setShowSearchBar] = useState(true);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const mapRef = useRef<MapView | null>(null);
    const opacity = useRef(new Animated.Value(0.5)).current;

    // Оновлюємо snapPoints, щоб додати 50%
    const snapPoints = useMemo(() => ['25%', '70%', '100%'], []);

    const [selectedFilters, setSelectedFilters] = useState({
        kitchenTypes: [],
        restaurantTypes: [],
        features: []
    });

    useEffect(() => {
        requestLocationPermission();
    }, []);

    useEffect(() => {
        if (location) {
            axios.get(`http://localhost:8089/address/coordinates?lat=${location.latitude}&lon=${location.longitude}`).then((response) => {
                setRestaurants(response.data);
            });
        }
    }, [location]);
    const requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'ios') {
                const authorization = await Geolocation.requestAuthorization('whenInUse');
                if (authorization === 'granted') {
                    getCurrentLocation();
                } else {
                    setShowModal(true);
                }
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'We need access to your location to show nearby restaurants.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    setShowModal(true);
                }
            }
        } catch (err) {
            console.warn('Error requesting location permission:', err);
        }
    };


    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const {latitude, longitude} = position.coords;
                setLocation({latitude, longitude});
                console.log('User location:', latitude, longitude);
            },
            (error) => {
                console.log('Geolocation error', error);
                setShowModal(true);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
    };

    const handleCitySelect = (city: { latitude: number, longitude: number }) => {
        setLocation(city);
        setShowModal(false);
    };

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
            bottomSheetRef.current?.snapToIndex(1);
        }
    }, [chosenRestaurant]);


    const onApplyFilters = (filter) => {
        console.log(filter);
        if (location && selectedFilters.length > 0) {
            const find = selectedFilters.find(filter => filter === "Відчинено зараз");
            if (find) {
                axios.get(`http://localhost:8089/address/coordinates?lat=${location.latitude}&lon=${location.longitude}&openNow=true&features=${selectedFilters.join(',')}`).then((response) => {
                    setRestaurants(response.data);
                });
            } else {
                axios.get(`http://localhost:8089/address/coordinates?lat=${location.latitude}&lon=${location.longitude}&features=${selectedFilters.join(',')}`).then((response) => {
                    setRestaurants(response.data);
                });
            }

        } else {
            axios.get(`http://localhost:8089/address/coordinates?features=${selectedFilters.join(',')}`).then((response) => {
                setRestaurants(response.data);
            });
        }
        setFilterVisible(false);
    }
    const clearFilters = () => {
        setSelectedFilters({
            kitchenTypes: [],
            restaurantTypes: [],
            features: []
        });
        if (location) {
            axios.get(`http://localhost:8089/address/coordinates?lat=${location.latitude}&lon=${location.longitude}`).then((response) => {
                setRestaurants(response.data);
            });
        }
    };

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        setSuggestionsVisible(text !== '');
    };

    const renderSuggestion = ({item}: { item: Restaurant }) => (
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

    const handleBottomSheetChange = (index: number) => {
        if (index === 2 && (chosenRestaurant || isFilterVisible)) {
            fadeOut();
        } else {
            fadeIn();
        }
    };


    return (
        <View style={styles.container}>
            {showSearchBar && (
                <Animated.View style={[styles.searchContainer, {opacity}]}>
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon}/>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Назва закладу"
                            value={searchQuery}
                            onChangeText={handleSearchChange}
                        />
                    </View>
                    {suggestionsVisible && searchQuery.length > 0 && restaurants && (
                        <FlatList
                            data={restaurants.filter(restaurant =>
                                restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )}
                            renderItem={renderSuggestion}
                            keyExtractor={(item) => item.id.toString()}
                            style={styles.suggestionsList}
                            ItemSeparatorComponent={() => <View style={styles.separator}/>}
                            keyboardShouldPersistTaps="handled"
                        />
                    )}
                </Animated.View>
            )}

            {showSearchBar && (
                <Animated.View style={[styles.filterButton, {opacity}]}>
                    <TouchableOpacity onPress={() => {
                        setFilterVisible(true);
                        setSearchQuery('');
                        bottomSheetRef.current?.snapToIndex(2);
                    }}>
                        <Text style={styles.filterButtonText}>
                            <Ionicons name="filter" size={22}/>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {location && <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                onPress={(event: MapPressEvent) => {
                    if (event.nativeEvent.action !== 'marker-press') {
                        setChosenRestaurant(null);
                        setFilterVisible(false);
                        setSearchQuery('');
                        bottomSheetRef.current?.snapToIndex(0);
                    }
                }}
            >
                {restaurants && restaurants.map((restaurant) => (
                    <Marker
                        key={restaurant.addressId}
                        coordinate={{latitude: restaurant.latitude, longitude: restaurant.longitude}}
                        title={restaurant.name}
                        onPress={() => {
                            setFilterVisible(false);
                            setChosenRestaurant(restaurant);
                            bottomSheetRef.current?.snapToIndex(1);
                        }}
                    >
                        <FontAwesome5 name={typeToIcon[restaurant.type] || 'utensils'} size={30} color="#A1824A"/>
                    </Marker>
                ))}
            </MapView>}

            <Modal visible={showModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Виберіть місто</Text>
                        <Button
                            title="Київ"
                            onPress={() => handleCitySelect({latitude: 50.4501, longitude: 30.5234})}
                        />
                        <Button
                            title="Львів"
                            onPress={() => handleCitySelect({latitude: 49.8397, longitude: 24.0297})}
                        />
                    </View>
                </View>
            </Modal>

            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={0}
                onChange={handleBottomSheetChange}
                enablePanDownToClose={false}
                style={styles.bottomSheet}
            >
                {isFilterVisible ? (
                    <BottomSheetScrollView
                        style={styles.listOfSrollViewOnAdvert}
                        keyboardShouldPersistTaps="handled"
                    >
                        <FilterComponent
                            onApplyFilters={onApplyFilters}
                            onClearFilters={clearFilters}
                        />
                    </BottomSheetScrollView>
                ) : chosenRestaurant ? (
                    <BottomSheetScrollView
                        style={styles.listOfSrollViewOnAdvert}
                        keyboardShouldPersistTaps="handled"
                    >
                        <RestaurantFinal addressId={chosenRestaurant.addressId} location={location}/>
                    </BottomSheetScrollView>
                ) : (
                    <BottomSheetScrollView
                        style={styles.listOfSrollView}
                        keyboardShouldPersistTaps="handled"
                    >
                        {restaurants &&
                            restaurants.map((restaurant) => (
                                <TouchableOpacity
                                    key={restaurant.addressId}
                                    onPress={() => setChosenRestaurant(restaurant)}
                                >
                                    <RestaurantCard restaurant={restaurant}/>
                                </TouchableOpacity>
                            ))}
                    </BottomSheetScrollView>
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
        top: 17,
        left: 20,
        right: 20,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 19,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.2,
        shadowRadius: 5,
        width: '75%',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 19,
        padding: 10,
    },
    searchIcon: {
        marginRight: 5,
    },
    searchInput: {
        fontSize: 16,
        flex: 1,
    },
    suggestionsList: {
        marginTop: 5,
        borderBottomLeftRadius: 19,
        borderBottomRightRadius: 19,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    suggestionItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    suggestionText: {
        fontSize: 16,
        color: '#333',
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 5,
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
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    filterButtonText: {
        color: 'white',
        fontSize: 18,
    },
    bottomSheet: {
        paddingTop: 10,
        zIndex: 2,
    },

    listOfSrollView: {
        paddingTop: 35,
        marginBottom:105
    },

    listOfSrollViewOnAdvert: {
        paddingTop: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
    },
});
