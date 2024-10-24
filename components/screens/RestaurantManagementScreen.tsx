import React, {useState, useEffect} from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    SafeAreaView,
    Platform,
} from 'react-native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import axios from 'axios'; // Commented out for now

interface Restaurant {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
    address: string;
}

export const RestaurantManagementScreen = ({navigation}: any) => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        AsyncStorage.getItem('token').then(setToken);
    }, []);
    useEffect(() => {
        // Commenting out the API call for now
        if (token == null) return;
        axios.get('http://localhost:8089/api/restaurants/user', {headers: {Authorization: `Bearer ${token}`}})
            .then((response) => {
                setRestaurants(response.data);
            }).catch(error => {
            Alert.alert('Error', 'Failed to load restaurants');
        });

    }, [token]);

    const renderRestaurantItem = ({item}: { item: Restaurant }) => (
        <TouchableOpacity
            style={styles.restaurantCard}
            onPress={() => {
                // Navigation to restaurant details (or any other screen)
                navigation.navigate('Керування рестораном', {restaurantId: item.id});
            }}
        >
            <Image source={{uri: item.imageUrl}} style={styles.restaurantImage}/>
            <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantTitle}>{item.title}</Text>
                <Text style={styles.restaurantDescription}>
                    {item.description.length > 50
                        ? item.address.substring(0, 50) + '...'
                        : item.address}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>

            {restaurants.length > 0 ? (
                <FlatList
                    data={restaurants}
                    renderItem={renderRestaurantItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Список ресторанів пустий</Text>
                </View>
            )}

            {/* Floating action button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('Реєстрація закладу')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 16,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 40 : 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    list: {
        paddingTop: 16,
    },
    restaurantCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        padding: 10,
    },
    restaurantImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 12,
    },
    restaurantInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    restaurantTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    restaurantDescription: {
        fontSize: 14,
        color: '#666',
    },
    addButton: {
        backgroundColor: '#000',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 20,
        bottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    addButtonText: {
        fontSize: 40,
        color: '#fff',
        fontWeight: 'regular',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
    },
});
