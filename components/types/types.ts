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


export type BusinessLunch= {
    id: number;
    restaurantName: string;
    imageUrl: string;
    lunchName: string;
    price: number;
    time: string;
    distanceFromUser: number;
    description: string;
}

// Тип для пропозицій
export type Offer= {
    id: number;
    restaurantName: string;
    imageUrl: string;
    offerName: string;
    validUntil: string;
    distanceFromUser: number;
    description: string;
    happyHours?: string; // Оскільки не всі пропозиції мають happyHours
}

// Тип для останнього шансу
export type LastChance= {
    id: number;
    restaurantName: string;
    productName: string;
    imageUrl: string;
    validUntil: string;
    distanceFromUser: number;
    oldPrice: number;
    newPrice: number;
}
