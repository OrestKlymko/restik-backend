import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, View, TouchableOpacity, ScrollView} from "react-native";
import Stars from 'react-native-stars';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ReviewModal} from './ReviewModal';  // Importing the modal component

interface Review {
    id: number;
    user: string;
    date: string;
    comment: string;
    atmosphere: number;
    food: number;
    staff: number;
}

export const ReviewsSection: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: 1,
            user: 'Іван',
            date: '10 жовтня 2023',
            comment: 'Дуже сподобалось!',
            atmosphere: 4.7,
            food: 4,
            staff: 4.8
        },
        {
            id: 2,
            user: 'Олена',
            date: '8 жовтня 2023',
            comment: 'Смачна їжа та приємна атмосфера.',
            atmosphere: 4.6,
            food: 4.6,
            staff: 4.7
        },
        {
            id: 3,
            user: 'Петро',
            date: '5 жовтня 2023',
            comment: 'Швидке обслуговування, рекомендую.',
            atmosphere: 4.8,
            food: 4.7,
            staff: 4.9
        },
    ]);

    const averageRating = 4.6;
    const ratings: Record<string, number> = {
        'Атмосфера': 4.7,
        'Їжа': 4.6,
        'Персонал': 4.8,
    };

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const handleAddReview = (newReview: Omit<Review, 'id'>) => {
        const reviewWithId: Review = {
            ...newReview,
            id: reviews.length + 1,  // Assign a new id
        };
        setReviews([...reviews, reviewWithId]);
    };

    return (
        <View style={styles.sectionContainer}>
            <View style={styles.overallRatingContainer}>
                <View style={styles.leftRatingContainer}>
                    <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
                    <Stars
                        default={averageRating}
                        count={1}
                        half={true}
                        starSize={30}
                        fullStar={<FontAwesome5 name={'star'} size={30} color={'#A1824A'}/>}
                        emptyStar={<FontAwesome5 name={'star'} size={30} color={'#ccc'}/>}
                        halfStar={<FontAwesome5 name={'star-half-alt'} size={30} color={'#A1824A'}/>}
                        disabled={true}
                    />
                </View>

                <View style={styles.rightRatingContainer}>
                    {Object.keys(ratings).map(section => (
                        <View key={section} style={styles.ratingItem}>
                            <Text style={styles.ratingTitle}>{section}</Text>
                            <Stars
                                default={ratings[section]}
                                count={5}
                                half={true}
                                starSize={20}
                                fullStar={<FontAwesome5 name={'star'} size={20} color={'#A1824A'}/>}
                                emptyStar={<FontAwesome5 name={'star'} size={20} color={'#ccc'}/>}
                                halfStar={<FontAwesome5 name={'star-half-alt'} size={20} color={'#A1824A'}/>}
                                disabled={true}
                            />
                        </View>
                    ))}
                </View>
            </View>

            {/* Button to open the review modal */}
            <TouchableOpacity style={styles.submitButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.submitButtonText}>Залишити відгук</Text>
            </TouchableOpacity>

            {/* Display reviews */}
            <ScrollView>
                {reviews.map(item => (
                    <View style={styles.reviewItem} key={item.id}>
                        <Text style={styles.reviewUser}>{item.user}</Text>
                        <Text style={styles.reviewDate}>{item.date}</Text>
                        <Text style={styles.reviewComment}>{item.comment}</Text>
                    </View>))}
            </ScrollView>

            {/* Review modal */}
            <ReviewModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                handleAddReview={handleAddReview}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    overallRatingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    leftRatingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    averageRating: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'black', // Golden-brown color for average rating
        marginRight: 10,
    },
    rightRatingContainer: {
        flex: 2,
        paddingLeft: 20,
    },
    ratingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingTitle: {
        flex: 1,
        fontSize: 14,
        color: 'black', // Golden-brown color for rating titles
        fontWeight: '600',
        textAlign: 'left', // Ensure text alignment
    },
    reviewItem: {
        borderBottomWidth: 1,
        borderColor: '#A1824A',  // Divider color
        paddingVertical: 8,
        marginBottom: 16, // Space between each review
    },
    reviewUser: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1C170D',
        marginBottom: 2,
    },
    reviewDate: {
        fontWeight: '400',
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    ratingsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingLabel: {
        width: 90, // Ensures all labels are aligned on the same level
        fontSize: 14,
        fontWeight: '600',
        color: 'black',  // Golden-brown color for labels
        marginRight: 6,
    },
    reviewComment: {
        fontSize: 16,
        color: '#1C170D',
        marginTop: 10, // Space before the comment
        marginBottom: 10, // Add space after comment
    },
    submitButton: {
        backgroundColor: '#009963',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
