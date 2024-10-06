import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import {AboutSection} from "./AboutSection.tsx";
import {ReviewsSection} from "./ReviewsSection.tsx";
import {PlaceholderSection} from "./PlaceholderSection.tsx"; // Для зірочок рейтингу



export const RestaurantFinal = () => {
    const [activeTab, setActiveTab] = useState('Про заклад');

    const tabs = ['Про заклад', 'Меню', 'Відгуки', 'Популярна їжа'];

    const renderContent = () => {
        switch (activeTab) {
            case 'Про заклад':
                return <AboutSection />;
            case 'Відгуки':
                return <ReviewsSection />;
            // Додайте інші секції або заглушки
            default:
                return <PlaceholderSection />;
        }
    };

    return (
        <View style={styles.container}>
            {/* Зображення на всю ширину */}
            <Image source={{ uri: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg' }} style={styles.image} />

            {/* Назва ресторану */}
            <Text style={styles.restaurantName}>Назва Ресторану</Text>

            {/* Табуляція */}
            <View style={styles.tabsContainer}>
                {tabs.map(tab => (
                    <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabItem, activeTab === tab && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Вміст активної секції */}
            {renderContent()}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 200,
    },
    restaurantName: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 22,
        fontWeight: '700',
        lineHeight: 28,
        textAlign: 'left',
        color: '#1C170D',
        padding: 16,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    tabItem: {
        paddingVertical: 12,
    },
    tabText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        color: '#1C170D',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: '#996E4D',
    },
    activeTabText: {
        color: '#996E4D',
    },
    sectionContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 22,
        fontWeight: '700',
        lineHeight: 28,
        textAlign: 'left',
        color: '#1C170D',
        marginBottom: 8,
    },
    description: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        textAlign: 'left',
        color: '#1C170D',
        marginBottom: 16,
    },
    featuresContainer: {
        marginBottom: 16,
    },
    featuresTitle: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 24,
        color: '#1C170D',
        marginBottom: 4,
    },
    featuresText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: '#1C170D',
        marginBottom: 8,
    },
    infoContainer: {
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        color: '#1C170D',
        marginLeft: 8,
    },
    reserveButton: {
        width: 358,
        height: 48,
        backgroundColor: '#009963',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 16,
    },
    reserveButtonText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    overallRatingContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    overallRatingText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 20,
        fontWeight: '700',
        color: '#1C170D',
    },
    ratingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingTitle: {
        flex: 1,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        color: '#1C170D',
    },
    starsContainer: {
        flexDirection: 'row',
    },
    ratingValue: {
        marginLeft: 8,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        color: '#1C170D',
    },
    reviewItem: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
    },
    reviewUser: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '700',
        color: '#1C170D',
    },
    reviewComment: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        color: '#1C170D',
    },
    placeholderText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        color: '#1C170D',
        textAlign: 'center',
        marginTop: 20,
    },
});


