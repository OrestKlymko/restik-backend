import React, {useState, useRef, useMemo} from 'react';
import {View, Text, FlatList, StyleSheet, Image, TouchableOpacity} from 'react-native';
import MapView, {MapPressEvent, Marker} from 'react-native-maps';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Swipeable} from 'react-native-gesture-handler';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {Restaurant} from '../types/types';
import {RestaurantFinal} from "./final/RestaurantFinal.tsx";

// Симуляція улюблених закладів
const favoriteRestaurants: Restaurant[] = [
    {
        id: 1,
        name: 'La Piazza',
        imageUrl: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg',
        rating: 4.5,
        cuisineType: 'Italian',
        distanceFromUser: 1.2,
        type: 'Кафе',
        averagePrice: 25,
        features: ['WiFi', 'Outdoor Seating', 'Parking'],
        latitude: 37.78825,
        longitude: -122.4324,
    },
    {
        id: 2,
        name: 'Sushi World',
        imageUrl: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg',
        rating: 4.7,
        cuisineType: 'Japanese',
        distanceFromUser: 3.5,
        type: 'Ресторан',
        averagePrice: 40,
        features: ['Parking', 'Family Friendly'],
        latitude: 37.78845,
        longitude: -122.4358,
    },
    {
        id: 3,
        name: 'Burger Heaven',
        imageUrl: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg',
        rating: 4.3,
        type: 'Бар',
        cuisineType: 'American',
        distanceFromUser: 0.8,
        averagePrice: 15,
        features: ['WiFi', 'Pet Friendly'],
        latitude: 37.78925,
        longitude: -122.4314,
    },
];

const typeToIcon: Record<string, string> = {
    'Кафе': 'coffee',
    'Ресторан': 'utensils',
    'Бар': 'beer',
};

export default function FavoriteScreen() {
    const [activeTab, setActiveTab] = useState<'List' | 'Map'>('List');
    const [chosenRestaurant, setChosenRestaurant] = useState<Restaurant | null>(null);
    const [restaurants, setRestaurants] = useState(favoriteRestaurants); // Додаємо стейт для управління списком
    const bottomSheetRef = useRef<BottomSheet>(null);
    const mapRef = useRef<MapView | null>(null);
    const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

    const deleteRestaurant = (id: number) => {
        setRestaurants(prevRestaurants => prevRestaurants.filter(r => r.id !== id));
    };

    const renderRestaurantCard = ({item}: { item: Restaurant }) => (
        <Swipeable
            renderRightActions={() => (
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRestaurant(item.id)}>
                    <Text style={styles.deleteButtonText}>Видалити</Text>
                </TouchableOpacity>
            )}
        >
            <View style={styles.card}>
                <View style={styles.leftPart}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.details}>
                        {item.rating} / 5 • {item.distanceFromUser} km away
                    </Text>
                    <View style={styles.featuresContainer}>
                        {item.features.slice(0, 3).map((feature, index) => (
                            <Text key={index} style={styles.featureBadge}>{feature}</Text>
                        ))}
                    </View>
                </View>
                <Image source={{uri: item.imageUrl}} style={styles.image}/>
            </View>
        </Swipeable>
    );

    const handleMarkerPress = (restaurant: Restaurant) => {
        setChosenRestaurant(restaurant);
        bottomSheetRef.current?.expand();
    };

    return (
        <View style={styles.container}>
            {/* Заголовок */}
            <Text style={styles.title}>Мої ТОП заклади</Text>

            {/* Таби */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'List' && styles.activeTab]}
                    onPress={() => setActiveTab('List')}
                >
                    <Text style={[styles.tabText, activeTab === 'List' && styles.activeTabText]}>Список</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Map' && styles.activeTab]}
                    onPress={() => setActiveTab('Map')}
                >
                    <Text style={[styles.tabText, activeTab === 'Map' && styles.activeTabText]}>Мапа</Text>
                </TouchableOpacity>
            </View>

            {/* Вміст в залежності від таба */}
            {activeTab === 'List' ? (
                <FlatList
                    data={restaurants}
                    renderItem={renderRestaurantCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
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
                            bottomSheetRef.current?.snapToIndex(0);
                        }
                    }}
                >
                    {restaurants.map((restaurant) => (
                        <Marker
                            key={restaurant.id}
                            coordinate={{latitude: restaurant.latitude, longitude: restaurant.longitude}}
                            title={restaurant.name}
                            onPress={() => handleMarkerPress(restaurant)}
                        >
                            <FontAwesome5 name={typeToIcon[restaurant.type] || 'utensils'} size={30} color="#A1824A"/>
                        </Marker>
                    ))}
                </MapView>
            )}

            {/* Bottom Sheet для мапи */}
            {activeTab === 'Map' && chosenRestaurant && (
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    index={0}
                    enablePanDownToClose={false}
                    style={styles.bottomSheet}>
                    <BottomSheetScrollView
                        style={styles.listOfSrollViewOnAdvert}
                        keyboardShouldPersistTaps="handled"
                    >
                        <RestaurantFinal/>
                    </BottomSheetScrollView>
                </BottomSheet>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listOfSrollViewOnAdvert: {
        paddingTop: 15,
    },
    bottomSheet: {
        paddingTop: 10,
        zIndex: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginVertical: 16,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    tab: {
        paddingVertical: 10,
        flex: 1,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: 'transparent',
    },
    activeTab: {
        borderColor: '#A1824A',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    activeTabText: {
        color: '#A1824A',
    },
    listContent: {
        paddingHorizontal: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        padding: 16,
    },
    leftPart: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    details: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    featureBadge: {
        fontSize: 12,
        color: '#A1824A',
        borderColor: '#A1824A',
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        marginRight: 5,
        marginBottom: 5,
        backgroundColor: 'transparent',
    },
    image: {
        width: 130,
        height: 93,
        borderRadius: 10,
    },
    deleteButton: {
        backgroundColor: '#ff0000',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    map: {
        flex: 1,
    },
});
