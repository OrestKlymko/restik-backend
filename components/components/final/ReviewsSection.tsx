import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import Stars from 'react-native-stars';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const ReviewsSection = () => {
    const [reviews, setReviews] = useState([
        { id: 1, user: 'Іван', date: '10 жовтня 2023', comment: 'Дуже сподобалось!' },
        { id: 2, user: 'Олена', date: '8 жовтня 2023', comment: 'Смачна їжа та приємна атмосфера.' },
        { id: 3, user: 'Петро', date: '5 жовтня 2023', comment: 'Швидке обслуговування, рекомендую.' },
    ]);

    const averageRating = 4.6;
    const ratings: Record<string, number> = {
        'Атмосфера': 4.7,
        'Їжа': 4.6,
        'Персонал': 4.8,
    };

    const [newReview, setNewReview] = useState('');
    const [newUserName, setNewUserName] = useState('');

    const handleAddReview = () => {
        if (newReview && newUserName) {
            const newReviewEntry = {
                id: reviews.length + 1,
                user: newUserName,
                date: new Date().toLocaleDateString(),
                comment: newReview,
            };
            setReviews([...reviews, newReviewEntry]);
            setNewReview('');
            setNewUserName('');
        }
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
                        fullStar={<FontAwesome5 name={'star'} size={30} color={'#ffd700'}/>}
                        emptyStar={<FontAwesome5 name={'star'} size={30} color={'#ccc'} />}
                        halfStar={<FontAwesome5 name={'star-half-alt'} size={30} color={'#ffd700'} />}
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
                                fullStar={<FontAwesome5 name={'star'} size={20} color={'#ffd700'} />}
                                emptyStar={<FontAwesome5 name={'star'} size={20} color={'#ccc'} />}
                                halfStar={<FontAwesome5 name={'star-half-alt'} size={20} color={'#ffd700'} />}
                                disabled={true}
                            />
                        </View>
                    ))}
                </View>
            </View>

            {/* Список відгуків */}


            {/* Форма для додавання нового відгуку */}
            <View style={styles.reviewForm}>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Ваш відгук"
                    value={newReview}
                    onChangeText={setNewReview}
                    multiline={true}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleAddReview}>
                    <Text style={styles.submitButtonText}>Залишити відгук</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={reviews}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.reviewItem}>
                        <Text style={styles.reviewUser}>{item.user} </Text>
                            <Text style={styles.reviewDate}>{item.date}</Text>
                        <Text style={styles.reviewComment}>{item.comment}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        padding: 16,
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
        flex: 1, // Makes sure left container takes space equally with the right container
    },
    averageRating: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#1C170D',
        marginRight: 10, // Adds space between number and star
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
        color: '#1C170D',
        fontWeight: '400',
    },
    ratingValue: {
        fontSize: 10,
        color: '#1C170D',
        marginLeft: 10,
    },
    reviewSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    reviewItem: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
    },
    reviewUser: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1C170D',
    },
    reviewDate: {
        fontWeight: '400',
        fontSize: 14,
        color: '#666',
    },
    reviewComment: {
        fontSize: 16,
        color: '#1C170D',
    },
    reviewForm: {
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 10,
        marginBottom: 12,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#009963',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
