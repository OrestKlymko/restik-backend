import {FlatList, StyleSheet, Text, View} from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

export const ReviewsSection = () => {
    // Приклад даних для відгуків
    const reviews = [
        { id: 1, user: 'Іван', comment: 'Дуже сподобалось!' },
        { id: 2, user: 'Олена', comment: 'Смачна їжа та приємна атмосфера.' },
        // Додайте більше відгуків за потребою
    ];

    // Середні оцінки
    const averageRating = 4.5;
    const ratings:Record<string, number> = {
        'Атмосфера': 4.7,
        'Їжа': 4.6,
        'Персонал': 4.8,
    };

    return (
        <View style={styles.sectionContainer}>
            {/* Загальна середня оцінка */}
            <View style={styles.overallRatingContainer}>
                <Text style={styles.overallRatingText}>Середня оцінка: {averageRating.toFixed(1)}</Text>
            </View>

            {/* Оцінки за секціями */}
            {Object.keys(ratings).map(section => (
                <View key={section} style={styles.ratingItem}>
                    <Text style={styles.ratingTitle}>{section}</Text>
                    <View style={styles.starsContainer}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <FontAwesome5Icon
                                key={index}
                                name={index < Math.round(ratings[section]) ? 'star' : 'star-o'}
                                size={20}
                                color="#ffd700"
                            />
                        ))}
                    </View>
                    <Text style={styles.ratingValue}>{ratings[section].toFixed(1)}</Text>
                </View>
            ))}

            {/* Список відгуків */}
            {/*<FlatList*/}
            {/*    data={reviews}*/}
            {/*    keyExtractor={item => item.id.toString()}*/}
            {/*    renderItem={({ item }) => (*/}
            {/*        <View style={styles.reviewItem}>*/}
            {/*            <Text style={styles.reviewUser}>{item.user}</Text>*/}
            {/*            <Text style={styles.reviewComment}>{item.comment}</Text>*/}
            {/*        </View>*/}
            {/*    )}*/}
            {/*/>*/}
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
        borderColor: '#1C170D',
    },
    activeTabText: {
        fontWeight: '700',
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

