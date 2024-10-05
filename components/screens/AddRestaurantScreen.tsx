import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import axios from 'axios';

const AddRestaurantScreen = ({navigation}: any): React.JSX.Element => {
    const [restaurantName, setRestaurantName] = useState('');
    const [address, setAddress] = useState('');

    const handleAddRestaurant = () => {
        const restaurant = {
            name: restaurantName,
            address,
        };

        // Відправка даних на сервер
        axios.post('http://localhost:8082/addRestaurant', restaurant)
            .then((response) => {
                console.log('Restaurant added:', response.status);
                navigation.goBack(); // Повернення до попереднього екрану
            })
            .catch(console.log);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Restaurant</Text>

            <TextInput
                style={styles.input}
                placeholder="Restaurant Name"
                value={restaurantName}
                onChangeText={setRestaurantName}
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
            />

            <Button title="Add Restaurant" onPress={handleAddRestaurant}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default AddRestaurantScreen;
