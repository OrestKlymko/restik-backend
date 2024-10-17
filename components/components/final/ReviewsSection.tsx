import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from "react-native";
import Stars from 'react-native-stars';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ReviewModal} from './ReviewModal';
import {Review} from "../../types/types.ts";  // Importing the modal component


interface ReviewsSectionProps {
    reviews?: Review[]
}

export const ReviewsSection = ({reviews}: ReviewsSectionProps) => {
    console.log(reviews);
    const [averageRating, setAverageRating] = useState(5);
    useEffect(() => {
        if (reviews) {
            if (reviews.length > 0) {
                const avg = (reviews[0].atmosphere + reviews[0].food + reviews[0].staff) / 3;
                setAverageRating(avg);
            } else {
                setAverageRating(5);
            }
        }
    }, [reviews]);


    const ratings: Record<string, number> = {
        'Атмосфера': reviews && reviews.length > 0 ? reviews[0].atmosphere : 5,
        'Їжа': reviews && reviews.length > 0 ? reviews[0].food : 5,
        'Персонал': reviews && reviews.length > 0 ? reviews[0].staff : 5,
    };

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const handleAddReview = (newReview: Omit<Review, 'id'>) => {
        console.log(newReview);
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
                {reviews?.map(item => (
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
