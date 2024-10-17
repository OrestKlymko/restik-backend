export type Restaurant ={
    id: number;
    name: string;
    imageUrl: string;
    type: string;
    latitude: number;
    longitude: number;
    distanceFromUser: number; // у кілометрах
    features: string[];
    cuisineType: string[];
    addressId: number;
    rating: number;
}

export type RestaurantFinalType ={
    title: string;
    description: string;
    photo: string;
    features: string[];
    imagesRest: string[];
    menuLink: string;
    address: string;
    phoneNumber: string;
    openFrom: string;
    openTo: string;
}

export type Review ={
    id: number;
    user: string;
    date: string;
    comment: string;
    atmosphere: number;
    food: number;
    staff: number;
}
