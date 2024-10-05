export type RestaurantLocation = {
    latitude: number;
    longitude: number;
    name: string;
    id: number;
    features: string[];
};


export type Restaurant ={
    id: number;
    name: string;
    imageUrl: string;
    rating: number;
    cuisineType: string;
    distanceFromUser: number; // у кілометрах
    averagePrice: number; // середня ціна за людину
    features: string[];
}
