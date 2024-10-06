import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Stars from 'react-native-stars';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface ReviewModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    handleAddReview: (review: { atmosphere: number; food: number; staff: number; comment: string; date: string; user: string }) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ modalVisible, setModalVisible, handleAddReview }) => {
    const [atmosphereRating, setAtmosphereRating] = useState<number>(0);
    const [foodRating, setFoodRating] = useState<number>(0);
    const [staffRating, setStaffRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    const submitReview = () => {
        handleAddReview({
            atmosphere: atmosphereRating,
            food: foodRating,
            staff: staffRating,
            comment: comment,
            date: new Date().toLocaleDateString(),
            user: 'User Name' // Replace with actual user name
        });
        setModalVisible(false);
        setAtmosphereRating(0);
        setFoodRating(0);
        setStaffRating(0);
        setComment('');
    };

    return (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Твій відгук важливий для нас!</Text>

                    {/* Star ratings for each parameter */}
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingLabel}>Атмосфера</Text>
                        <Stars
                            default={0}
                            count={5}
                            half={true}
                            update={(val: number) => setAtmosphereRating(val)}
                            fullStar={<FontAwesome5 name={'star'} size={30} color={'#ffd700'} />}
                            emptyStar={<FontAwesome5 name={'star'} size={30} color={'#ccc'} />}
                            halfStar={<FontAwesome5 name={'star-half-alt'} size={30} color={'#ffd700'} />}
                        />
                    </View>

                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingLabel}>Їжа</Text>
                        <Stars
                            default={0}
                            count={5}
                            half={true}
                            update={(val: number) => setFoodRating(val)}
                            fullStar={<FontAwesome5 name={'star'} size={30} color={'#ffd700'} />}
                            emptyStar={<FontAwesome5 name={'star'} size={30} color={'#ccc'} />}
                            halfStar={<FontAwesome5 name={'star-half-alt'} size={30} color={'#ffd700'} />}
                        />
                    </View>

                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingLabel}>Персонал</Text>
                        <Stars
                            default={0}
                            count={5}
                            half={true}
                            update={(val: number) => setStaffRating(val)}
                            fullStar={<FontAwesome5 name={'star'} size={30} color={'#ffd700'} />}
                            emptyStar={<FontAwesome5 name={'star'} size={30} color={'#ccc'} />}
                            halfStar={<FontAwesome5 name={'star-half-alt'} size={30} color={'#ffd700'} />}
                        />
                    </View>

                    {/* Comment Input */}
                    <TextInput
                        style={styles.textArea}
                        placeholder="Тут було надзвичайно смачно..."
                        value={comment}
                        onChangeText={setComment}
                        multiline={true}
                    />

                    {/* Submit Review */}
                    <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
                        <Text style={styles.submitButtonText}>Надіслати відгук</Text>
                    </TouchableOpacity>

                    {/* Close Modal */}
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeModalText}>Відмінити</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1C170D',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    ratingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C170D',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        height: 80,
        textAlignVertical: 'top',
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
    closeModalText: {
        color: '#ff0000',
        textAlign: 'center',
        marginTop: 10,
    },
});
