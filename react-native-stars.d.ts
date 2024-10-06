declare module 'react-native-stars' {
    import { Component } from 'react';
    import { StyleProp, ViewStyle } from 'react-native';

    interface StarsProps {
        count?: number;
        default?: number;
        update?: (value: number) => void;
        half?: boolean;
        starSize?: number;
        fullStar?: React.ReactNode;
        emptyStar?: React.ReactNode;
        halfStar?: React.ReactNode;
        disabled?: boolean;
        spacing?: number;
        backingColor?: string;
        fullStarColor?: string;
        emptyStarColor?: string;
        halfStarColor?: string;
        reversed?: boolean;
        containerStyle?: StyleProp<ViewStyle>;
    }

    export default class Stars extends Component<StarsProps> {}
}
