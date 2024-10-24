import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native';
import {format} from 'date-fns';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const MyBookingsScreen = () => {
    const [bookings, setBookings] = useState<null | any>();  // Using mock data
    const [token, setToken] = useState<null | string>(null)
    useEffect(() => {
        AsyncStorage.getItem('token').then(setToken)
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('token').then(token => {
            axios.get("http://localhost:8089/api/reservation/user", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                setBookings(response.data)

            })
        });


    }, []);

    const handleCancelBooking = (id) => {
        Alert.alert('Підтвердження', 'Ви впевнені, що хочете скасувати бронювання?', [
            {text: 'Ні', style: 'cancel'},
            {
                text: 'Так',
                onPress: () => {
                    axios.get(`http://localhost:8089/api/reservation/cancel/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token?.trim()}`
                        }
                    }).then(res => {
                        Alert.alert('Успіх', 'Ваше бронювання скасовано.');
                    })
                }
            }
        ]);
    };

    const renderBooking = ({item}) => {
        return (item && <View style={styles.bookingCard}>
            <Text style={styles.restaurantName}>{item.title}</Text>
            <Text style={styles.dateText}>Дата та
                час: {format(new Date(item.reservationTime), 'dd.MM.yyyy HH:mm')}</Text>
            <Text style={styles.guestText}>Кількість гостей: {item.guestCount}</Text>
            <Text style={styles.commentText}>Коментар: {item.comment || 'Без коментаря'}</Text>
            <Text
                style={[styles.statusText, item.status === 'CONFIRMED' ? styles.statusConfirmed : styles.statusCancelled]}>
                Статус: {item.status === 'CONFIRMED' ? 'Підтверджено' : item.status === 'CANCELED' ? 'Скасовано' : 'В очікуванні'}
            </Text>

            <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBooking(item.id)}>
                <Text style={styles.cancelButtonText}>Скасувати бронювання</Text>
            </TouchableOpacity>

        </View>)
            ;
    };

    return (
        bookings && <View style={styles.container}>
            <Text style={styles.title}>Ваші бронювання</Text>
            {bookings.length > 0 ? (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderBooking}
                />
            ) : (
                <Text style={styles.noBookingsText}>У вас немає бронювань</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
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
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 3,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    guestText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    commentText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    statusText: {
        fontSize: 16,
        marginBottom: 8,
    },
    statusConfirmed: {
        color: '#28a745',
    },
    statusCancelled: {
        color: '#dc3545',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    noBookingsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
});

export default MyBookingsScreen;
