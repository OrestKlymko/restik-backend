import React, { useState, useEffect } from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    View,
    Modal,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

interface Restaurant {
    id: number;
    title: string;
}

interface KitchenType {
    id: number;
    key: string;
    valueUa: string;
}

interface RestaurantType {
    typeRest: number;
    typeRestUa: string;
}

export const RestaurantStep = ({ navigation }: any) => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [restaurantTypes, setRestaurantTypes] = useState<RestaurantType[]>([]);
    const [kitchenTypes, setKitchenTypes] = useState<KitchenType[]>([]);
    const [query, setQuery] = useState('');
    const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [isNewRestaurant, setIsNewRestaurant] = useState(false);
    const [selectedRestaurantType, setSelectedRestaurantType] = useState<string>('');
    const [selectedKitchenType, setSelectedKitchenType] = useState<string>('');
    const [tempSelectedRestaurantType, setTempSelectedRestaurantType] = useState<string>('');
    const [tempSelectedKitchenType, setTempSelectedKitchenType] = useState<string>('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [buildingNumber, setBuildingNumber] = useState('');
    const [isRestaurantTypeModalVisible, setRestaurantTypeModalVisible] = useState(false);
    const [isKitchenTypeModalVisible, setKitchenTypeModalVisible] = useState(false);

    const scaleAnim = useState(new Animated.Value(1))[0];

    useEffect(() => {
        axios.get('http://localhost:8089/api/restaurants').then((response) => {
            setRestaurants(response.data);
        });

        axios.get('http://localhost:8089/api/restaurants/kitchen-types').then((response) => {
            setKitchenTypes(response.data);
        });

        axios.get('http://localhost:8089/api/restaurants/types').then((response) => {
            setRestaurantTypes(response.data);
        });
    }, []);

    const findRestaurant = (text: string) => {
        if (text) {
            const regex = new RegExp(`${text.trim()}`, 'i');
            const filtered = restaurants.filter((restaurant) => restaurant.title.search(regex) >= 0);
            setFilteredRestaurants(filtered);
            setIsNewRestaurant(filtered.length === 0);
        } else {
            setFilteredRestaurants([]);
            setIsNewRestaurant(false);
        }
    };

    const handleRestaurantSelect = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setQuery(restaurant.title);
        setFilteredRestaurants([]);
        setIsNewRestaurant(false);
    };

    const handleAddNewRestaurant = () => {
        let isValid = true;

        if (!city || !street || !buildingNumber) {
            Alert.alert('Помилка', 'Заповніть усі поля');
            isValid = false;
        }

        if (isValid) {
            const newRestaurantData = {
                name: query,
                restaurantType: selectedRestaurantType,
                kitchenType: selectedKitchenType,
                city,
                street,
                buildingNumber,
            };
            console.log('Додано новий ресторан:', newRestaurantData);
            navigation.navigate('Деталі закладу', { newRestaurantData });
        }
    };

    const handleConfirmRestaurantType = () => {
        setSelectedRestaurantType(tempSelectedRestaurantType);
        setRestaurantTypeModalVisible(false);
    };

    const handleConfirmKitchenType = () => {
        setSelectedKitchenType(tempSelectedKitchenType);
        setKitchenTypeModalVisible(false);
    };

    const animateButtonPress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(handleAddNewRestaurant);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Text style={styles.fieldLabel}>Назва ресторану</Text>
                <Autocomplete
                    data={filteredRestaurants}
                    defaultValue={query}
                    onChangeText={(text) => {
                        setQuery(text);
                        findRestaurant(text);
                        setSelectedRestaurant(null);
                    }}
                    placeholder="Введіть назву ресторану"
                    flatListProps={{
                        keyExtractor: (item) => item.id.toString(),
                        renderItem: ({ item }) => (
                            <TouchableOpacity onPress={() => handleRestaurantSelect(item)}>
                                <Text style={styles.itemText}>{item.title}</Text>
                            </TouchableOpacity>
                        ),
                    }}
                    style={styles.input}
                    inputContainerStyle={styles.inputContainer}
                    listContainerStyle={styles.listContainer}
                />



                {/* Поля для нового ресторану або заповнення тільки адреси для вибраного ресторану */}
                {isNewRestaurant ? (
                    <>
                        <Text style={styles.fieldLabel}>Тип ресторану</Text>
                        <TouchableOpacity
                            style={styles.dropdown}
                            onPress={() => setRestaurantTypeModalVisible(true)}
                        >
                            <Text style={styles.dropdownText}>
                                {selectedRestaurantType ? selectedRestaurantType : 'Оберіть тип ресторану'}
                            </Text>
                        </TouchableOpacity>

                        <Modal
                            visible={isRestaurantTypeModalVisible}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setRestaurantTypeModalVisible(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Оберіть тип ресторану</Text>
                                    <Picker
                                        selectedValue={tempSelectedRestaurantType}
                                        onValueChange={(itemValue) => setTempSelectedRestaurantType(itemValue)}
                                        style={styles.picker}
                                    >
                                        {restaurantTypes.map((type: RestaurantType) => (
                                            <Picker.Item key={type.typeRest} label={type.typeRestUa} value={type.typeRestUa} />
                                        ))}
                                    </Picker>
                                    <TouchableOpacity
                                        style={styles.confirmButton}
                                        onPress={handleConfirmRestaurantType}
                                    >
                                        <Text style={styles.confirmButtonText}>Підтвердити</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        <Text style={styles.fieldLabel}>Тип кухні</Text>
                        <TouchableOpacity
                            style={styles.dropdown}
                            onPress={() => setKitchenTypeModalVisible(true)}
                        >
                            <Text style={styles.dropdownText}>
                                {selectedKitchenType ? selectedKitchenType : 'Оберіть тип кухні'}
                            </Text>
                        </TouchableOpacity>

                        <Modal
                            visible={isKitchenTypeModalVisible}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setKitchenTypeModalVisible(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Оберіть тип кухні</Text>
                                    <Picker
                                        selectedValue={tempSelectedKitchenType}
                                        onValueChange={(itemValue) => setTempSelectedKitchenType(itemValue)}
                                        style={styles.picker}
                                    >
                                        {kitchenTypes.map((kitchen: KitchenType) => (
                                            <Picker.Item key={kitchen.id} label={kitchen.valueUa} value={kitchen.valueUa} />
                                        ))}
                                    </Picker>
                                    <TouchableOpacity
                                        style={styles.confirmButton}
                                        onPress={handleConfirmKitchenType}
                                    >
                                        <Text style={styles.confirmButtonText}>Підтвердити</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </>
                ) : null}

                {/* Поля для заповнення адреси */}
                <Text style={styles.fieldLabel}>Місто</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Місто"
                    value={city}
                    onChangeText={setCity}
                />

                <Text style={styles.fieldLabel}>Вулиця</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Вулиця"
                    value={street}
                    onChangeText={setStreet}
                />

                <Text style={styles.fieldLabel}>Номер будинку</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Номер будинку"
                    value={buildingNumber}
                    onChangeText={setBuildingNumber}
                />

                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity style={styles.nextButton} onPress={animateButtonPress}>
                        <Text style={styles.nextButtonText}>Продовжити</Text>
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#996E4D',
        marginBottom: 4,
        marginTop: 8,
    },
    input: {
        borderColor: '#996E4D',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
        color: '#000000',
    },
    inputContainer: {
        borderWidth: 0,
    },
    listContainer: {
        borderWidth: 0,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
    },
    itemText: {
        padding: 10,
        fontSize: 16,
        color: '#000000',
    },
    dropdown: {
        borderColor: '#996E4D',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
        backgroundColor: '#ffffff',
    },
    dropdownText: {
        fontSize: 16,
        color: '#000000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000000',
    },
    picker: {
        width: '100%',
    },
    confirmButton: {
        backgroundColor: '#996E4D',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    nextButton: {
        backgroundColor: '#996E4D',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
    },
    nextButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
