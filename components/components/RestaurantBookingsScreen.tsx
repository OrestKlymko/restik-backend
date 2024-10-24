import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const RestaurantBookingsScreen = ({route}) => {
    const [bookings, setBookings] = useState([]);
    const {restaurantId} = route.params || {};
    const [token, setToken] = useState<string | null>()

    useEffect(() => {
        AsyncStorage.getItem('token').then(setToken);
    }, []);

    useEffect(() => {
        if (token) {
            axios.get(`http://localhost:8089/api/reservation/restaurant/${restaurantId}`, {
                headers: {
                    'Authorization': `Bearer ${token?.trim()}`
                }
            })
                .then(response => {
                    console.log(response.data);
                    setBookings(response.data);
                })
                .catch(error => {
                    console.error('Error fetching bookings:', error);
                });
        }
    }, [token]);

    const handleConfirm = (id) => {
        axios.get(`http://localhost:8089/api/reservation/confirm/${id}`, {
            headers: {
                'Authorization': `Bearer ${token?.trim()}`
            }
        })
            .then(() => {
                setBookings(prev => prev.map(booking => booking.id === id ? {
                    ...booking,
                    state: 'CONFIRMED'
                } : booking));
            })
            .catch(error => {
                console.error('Error confirming reservation:', error);
            });
    };

    const handleCancel = (id) => {
        axios.get(`http://localhost:8089/api/reservation/cancel/${id}`, {
            headers: {
                'Authorization': `Bearer ${token?.trim()}`
            }
        })
            .then(() => {
                setBookings(prev => prev.map(booking => booking.id === id ? {
                    ...booking,
                    state: 'CANCELLED'
                } : booking));
            })
            .catch(error => {
                console.error('Error cancelling reservation:', error);
            });
    };

    const renderBooking = ({item}) => (
        <View style={styles.bookingCard}>
            <Text style={styles.guestName}>{item.username}</Text>
            <Text style={styles.phoneNumber}>{item.userPhone}</Text>
            <Text style={styles.reservationTime}>Дата та
                час: {new Date(item.reservationTime).toLocaleDateString()} {new Date(item.reservationTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })}</Text>
            <Text style={styles.guestCount}>Кількість гостей: {item.guestCount}</Text>
            {item.comment ? <Text style={styles.comment}>Коментар: {item.comment}</Text> : null}
            <Text style={[styles.status, getStatusStyle(item.state)]}>Статус: {getStatusText(item.state)}</Text>

            {item.state === 'CONSIDER' && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirm(item.id)}>
                        <Text style={styles.buttonText}>Підтвердити</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item.id)}>
                        <Text style={styles.buttonText}>Скасувати</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    const getStatusText = (status) => {
        switch (status) {
            case 'CONSIDER':
                return 'На розгляді';
            case 'CONFIRMED':
                return 'Підтверджено';
            case 'CANCELLED':
                return 'Скасовано';
            default:
                return 'Невідомий статус';
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CONSIDER':
                return {color: '#FFA500'}; // Orange
            case 'CONFIRMED':
                return {color: '#009963'}; // Green
            case 'CANCELLED':
                return {color: '#FF3B30'}; // Red
            default:
                return {color: '#000'}; // Default black
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Бронювання ресторану</Text>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderBooking}
                ListEmptyComponent={<Text>Немає бронювань</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#996E4D',
        marginBottom: 20,
        textAlign: 'center',
    },
    bookingCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 16,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    guestName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    phoneNumber: {
        fontSize: 16,
        color: '#666',
        marginVertical: 5,
    },
    reservationTime: {
        fontSize: 16,
        color: '#996E4D',
    },
    guestCount: {
        fontSize: 16,
        marginVertical: 5,
    },
    comment: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
    status: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    confirmButton: {
        backgroundColor: '#009963',
        padding: 10,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
        padding: 10,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default RestaurantBookingsScreen;
