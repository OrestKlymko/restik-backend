import React, {useEffect, useState} from 'react';
import {
    View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Modal, TextInput, Alert
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import {launchImageLibrary} from 'react-native-image-picker';
import AddOfferModal from "../components/AddOfferModal.tsx";
import AddLastChanceModal from "../components/AddLastChanceModal.tsx"; // Image picker
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import AddBusinessLunchModal from "../components/AddBusinessLunchModal.tsx"; // Українська локалізація

export default function BenefitsScreen({route, navigation}) {
    const {restaurantId} = route.params || {};
    const [activeTab, setActiveTab] = useState<'Lunch' | 'Offers' | 'LastChance'>('Lunch');
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [lastChanceModal, setLastChanceModal] = useState(false);
    const [businessLunchModal,setBusinessLanchModal]=useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [addType, setAddType] = useState<'Lunch' | 'Offers' | 'LastChance' | null>(null);
    const [businessLunches, setBusinessLunches] = useState([]);
    const [offers, setOffers] = useState([]);
    const [lastChance, setLastChance] = useState([]);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "dd MMMM HH:mm", { locale: uk });
    };

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
    };

    useEffect(() => {
        if (!location) {
            getCurrentLocation();
        }
        if (restaurantId) {
            fetchSpecialOffers(restaurantId);
        } else if (location) {
            fetchSpecialOffersByLocation(location);
        }
    }, [location, restaurantId]);

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const {latitude, longitude} = position.coords;
                setLocation({latitude, longitude});
            },
            (error) => {
                console.log('Geolocation error', error);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
    };

    const fetchSpecialOffers = (restaurantId) => {
        let businessLunchUrl = `http://localhost:8089/api/special-offers/business-lunch/${restaurantId}`;
        let offersUrl = `http://localhost:8089/api/special-offers/${restaurantId}`;
        let lastChanceUrl = `http://localhost:8089/api/special-offers/last-chance/${restaurantId}`;
        fetch(businessLunchUrl).then(response => response.json()).then(data => setBusinessLunches(data));
        fetch(offersUrl).then(response => response.json()).then(data => {
            setOffers(data)
        });
        fetch(lastChanceUrl).then(response => response.json()).then(data => setLastChance(data));
    };

    const fetchSpecialOffersByLocation = (location) => {
        let businessLunchUrl = `http://localhost:8089/api/special-offers/business-lunch/${location.longitude}/${location.latitude}`;
        let offersUrl = `http://localhost:8089/api/special-offers/${location.longitude}/${location.latitude}`;
        let lastChanceUrl = `http://localhost:8089/api/special-offers/last-chance/${location.longitude}/${location.latitude}`;

        fetch(businessLunchUrl).then(response => response.json()).then(data =>{
            setBusinessLunches(data)});

        fetch(offersUrl).then(response => response.json()).then(data => {
            setOffers(data)
        });
        fetch(lastChanceUrl).then(response => response.json()).then(data => setLastChance(data));
    };

    const handleDelete = (id: number) => {
        const deleteUrl = `http://localhost:8089/api/special-offers/${id}`;
        fetch(deleteUrl, {method: 'DELETE'})
            .then(() => {
                if (activeTab === 'Lunch') {
                    setBusinessLunches(prev => prev.filter(item => item.id !== id));
                } else if (activeTab === 'Offers') {
                    setOffers(prev => prev.filter(item => item.id !== id));
                } else if (activeTab === 'LastChance') {
                    setLastChance(prev => prev.filter(item => item.id !== id));
                }
            })
            .catch(error => {
                console.log('Error deleting item:', error);
            });
    };

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            {restaurantId && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(data.item.id)}
                >
                    <Text style={styles.deleteButtonText}>Видалити</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {!restaurantId && <Text style={styles.title}>Кращі пропозиції</Text>}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Lunch' && styles.activeTab]}
                    onPress={() => setActiveTab('Lunch')}
                >
                    <Text style={[styles.tabText, activeTab === 'Lunch' && styles.activeTabText]}>Бізнес ланчі</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Offers' && styles.activeTab]}
                    onPress={() => setActiveTab('Offers')}
                >
                    <Text style={[styles.tabText, activeTab === 'Offers' && styles.activeTabText]}>Пропозиції</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'LastChance' && styles.activeTab]}
                    onPress={() => setActiveTab('LastChance')}
                >
                    <Text style={[styles.tabText, activeTab === 'LastChance' && styles.activeTabText]}>Останній
                        шанс</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'Lunch' && (
                <SwipeListView
                    data={businessLunches}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => handleOpenModal(item)}
                        >
                            <Image source={{uri: item.imageUrl}} style={styles.image}/>
                            <View style={styles.cardContent}>
                                <Text style={styles.lunchName}>{item.title}</Text>
                                <Text style={styles.restaurantName}>{item.restaurant}</Text>
                                <Text style={styles.restaurantName}>{item.price} грн.</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-75}
                    disableLeftSwipe={!!restaurantId}
                    disableRightSwipe
                />
            )}

            {activeTab === 'Offers' && (
                <SwipeListView
                    data={offers}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => handleOpenModal(item)}
                        >
                            <Image source={{uri: item.imageUrl}} style={styles.image}/>
                            <View style={styles.cardContent}>
                                <Text style={styles.lunchName}>{item.title}</Text>
                                <Text style={styles.restaurantName}>{item.restaurant}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-75}
                    disableRightSwipe
                    disableLeftSwipe={!restaurantId}
                />
            )}

            {activeTab === 'LastChance' && (
                <SwipeListView
                    data={lastChance}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => handleOpenModal(item)}
                        >
                            <Image source={{uri: item.imageUrl}} style={styles.image}/>
                            <View style={styles.cardContent}>
                                <Text style={styles.lunchName}>{item.title}</Text>
                                <Text style={styles.restaurantName}>{item.restaurant}</Text>
                                <Text style={styles.oldPrice}>Ціна: {item.oldPrice} грн.</Text>
                                <Text style={styles.dateNew}>Діє до: {formatDate(item.timeTo)}</Text>
                                <Text style={styles.newPrice}>{item.price} грн.</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-75}
                    disableRightSwipe
                />
            )}

            {restaurantId && (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalAddVisible(true)}
                >
                    <Icon name="add" size={30} color="#fff"/>
                </TouchableOpacity>
            )}

            {/* Детальна модалка */}
            {selectedItem && (
                <Modal visible={showDetailModal} transparent={true} animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                            <Text style={styles.modalDescription}>{selectedItem.description}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.showRestaurantButton}
                                    onPress={() => {
                                        if (!restaurantId) {
                                            // Якщо restaurantId відсутній, переходимо на SearchScreen
                                            navigation.navigate('Пошук', {
                                                chosenRestaurant: selectedItem.addressId, // Передаємо обраний ресторан
                                            });
                                            setModalVisible(false);
                                            setShowDetailModal(false);
                                            setSelectedItem(null)
                                        } else {
                                            setModalVisible(false);
                                            setShowDetailModal(false);
                                            setSelectedItem(null)
                                        }
                                    }}

                                >
                                    <Text style={styles.showRestaurantText}>Показати ресторан</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={handleCloseModal}
                                >
                                    <Text style={styles.cancelButtonText}>Закрити</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginVertical: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#A1824A',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    activeTabText: {
        color: '#A1824A',
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
    image: {
        width: 100,
        height: 100,
        borderRadius: 12,
    },
    cardContent: {
        flex: 1,
        marginLeft: 16,
    },
    lunchName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C170D',
    },
    restaurantName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#A1824A',
    },
    oldPrice: {
        fontSize: 14,
        color: '#666',
        textDecorationLine: 'line-through',
    },
    newPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#008000',
    },
    dateNew: {
        fontSize: 14,
        marginTop: 5,
        marginBottom: 5,
        fontWeight: '400',
        color: '#000',
    },
    showRestaurantButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
        marginRight: 10,
        flex: 1,
    },
    showRestaurantText: {
        color: '#fff',
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C170D',
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 16,
        marginBottom: 10,
    },
    modalPrice: {
        fontSize: 18,
        fontWeight: '600',
        color: '#008000',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
        width: '100%',
        justifyContent: 'space-between',
    },
});

