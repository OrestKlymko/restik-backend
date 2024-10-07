import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Modal} from 'react-native';

// Симуляція даних для бізнес-ланчів
const businessLunches = [
    {
        id: 1,
        restaurantName: 'La Piazza',
        imageUrl: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg',
        lunchName: 'Бізнес-ланч №1',
        price: 150,
        time: '12:00 - 15:00',
        distanceFromUser: 1.2,
        description: 'Смачний обід із 3 страв. Суп, основне і десерт.',
    },
    {
        id: 2,
        restaurantName: 'Sushi World',
        imageUrl: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg',
        lunchName: 'Бізнес-ланч №2',
        time: '11:00 - 14:00',
        price: 150,
        distanceFromUser: 3.5,
        description: 'Обід із суші сету та місо супу.',
    },
];

// Симуляція даних для пропозицій
const offers = [
    {
        id: 1,
        restaurantName: 'La Piazza',
        imageUrl: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg',
        offerName: 'Знижка 20% на піцу',
        validUntil: '31 грудня 2023',
        distanceFromUser: 1.2,
        description: 'Отримайте знижку 20% на всі види піци.',
        happyHours: '16:00 - 18:00',
    },
    {
        id: 2,
        restaurantName: 'Sushi World',
        imageUrl: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg',
        offerName: '2 за ціною 1 на суші',
        validUntil: '15 січня 2024',
        distanceFromUser: 3.5,
        description: 'Акція на суші: отримай другий сет безкоштовно.',
    },
];

// Симуляція даних для останнього шансу
const lastChance = [
    {
        id: 1,
        restaurantName: 'Sushi World',
        productName: 'Сирники',
        imageUrl: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg',
        validUntil: '20:00',
        distanceFromUser: 2.5,
        oldPrice: 120,
        newPrice: 80,
    },
    {
        id: 2,
        productName: 'Бургер',
        restaurantName: 'Sushi World',
        imageUrl: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg',
        validUntil: '22:00',
        distanceFromUser: 1.5,
        oldPrice: 150,
        newPrice: 100,
    },
];

// Функція для перевірки, чи поточний час входить у вказаний діапазон
const isInTimeRange = (timeRange: string) => {
    const [start, end] = timeRange.split(' - ').map(t => t.split(':'));
    const current = new Date();
    const startTime = new Date(current);
    startTime.setHours(parseInt(start[0]), parseInt(start[1]), 0);
    const endTime = new Date(current);
    endTime.setHours(parseInt(end[0]), parseInt(end[1]), 0);

    return current >= startTime && current <= endTime;
};

export default function BenefitsScreen() {
    const [activeTab, setActiveTab] = useState<'Lunch' | 'Offers' | 'LastChance'>('Lunch');
    const [selectedItem, setSelectedItem] = useState<any | null>(null); // Обране для модалки
    const [modalVisible, setModalVisible] = useState(false); // Контроль модалки

    const renderBusinessLunchCard = ({item}: { item: any }) => {
        const isActive = isInTimeRange(item.time);

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => {
                    setSelectedItem(item);
                    setModalVisible(true); // Відкриваємо модальне вікно
                }}
            >
                <View style={styles.imageBlock}>
                    <Image source={{uri: item.imageUrl}} style={styles.image}/>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.lunchName}>{item.lunchName}</Text>
                    <Text style={styles.restaurantName}>{item.restaurantName}</Text>
                    <Text style={styles.restaurantName}>{item.price} грн.</Text>
                    <Text style={[styles.time, isActive ? styles.timeActive : styles.timeInactive]}>
                        {item.time}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderOfferCard = ({item}: { item: any }) => {
        const isActive = item.happyHours ? isInTimeRange(item.happyHours) : true;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => {
                    setSelectedItem(item);
                    setModalVisible(true); // Відкриваємо модальне вікно
                }}
            >
                <Image source={{uri: item.imageUrl}} style={styles.image}/>
                <View style={styles.cardContent}>
                    <Text style={styles.lunchName}>{item.offerName}</Text>
                    <Text style={styles.restaurantName}>{item.restaurantName}</Text>
                    <Text style={[styles.time, isActive ? styles.timeActive : styles.timeInactive]}>
                        {item.happyHours || `Діє до: ${item.validUntil}`}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderLastChanceCard = ({item}: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                setSelectedItem(item);
                setModalVisible(true); // Відкриваємо модальне вікно
            }}
        >
            <Image source={{uri: item.imageUrl}} style={styles.image}/>
            <View style={styles.cardContent}>
                <Text style={styles.lunchName}>{item.productName}</Text>
                <Text style={styles.restaurantName}>{item.restaurantName}</Text>
                <Text style={styles.oldPrice}>Ціна: {item.oldPrice} грн</Text>
                <Text style={styles.newPrice}>Ціна до {item.validUntil} - {item.newPrice} грн</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Кращі пропозиції</Text>
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
                <FlatList
                    data={businessLunches}
                    renderItem={renderBusinessLunchCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {activeTab === 'Offers' && (
                <FlatList
                    data={offers}
                    renderItem={renderOfferCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {activeTab === 'LastChance' && (
                <FlatList
                    data={lastChance}
                    renderItem={renderLastChanceCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {/* Модальне вікно */}
            {selectedItem && (
                <Modal visible={modalVisible} transparent={true} animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Image source={{uri: selectedItem.imageUrl}} style={styles.modalImage}/>
                            <Text
                                style={styles.modalTitle}>{selectedItem.lunchName || selectedItem.offerName || selectedItem.productName}</Text>
                            <Text style={styles.modalDescription}>{selectedItem.description}</Text>
                            {(selectedItem.price || selectedItem.newPrice) && (
                                <Text
                                    style={styles.modalPrice}>Ціна: {selectedItem.price || selectedItem.newPrice} грн</Text>)
                            }
                            <View style={styles.buttonModal}>
                            <TouchableOpacity
                                style={styles.showRestaurantButton}
                                onPress={() => setModalVisible(false)} // Закриваємо модальне вікно
                            >
                                <Text style={styles.showRestaurantText}>Показати заклад</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.showRestaurantButton}
                                onPress={() => setModalVisible(false)} // Закриваємо модальне вікно
                            >
                                <Text style={styles.showRestaurantText}>Закрити</Text>
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
    imageBlock: {
        flexDirection: 'column',
        alignItems: 'center',
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
    restaurantName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#A1824A',
        marginTop: 4,
        marginBottom: 4,
    },
    lunchName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C170D',
    },
    time: {
        fontSize: 14,
        marginTop: 4,
    },
    timeActive: {
        color: '#008000', // зелений, якщо активний
    },
    timeInactive: {
        color: '#ff0000', // червоний, якщо не активний
    },
    description: {
        fontSize: 14,
        color: '#333',
        marginTop: 8,
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
    showRestaurantButton: {
        backgroundColor: '#A1824A',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },

    buttonModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    showRestaurantText: {
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
    modalImage: {
        width: 200,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C170D',
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    modalPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#A1824A',
    },
});
