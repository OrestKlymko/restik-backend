declare module 'react-native-modal-dropdown' {
    import { Component } from 'react';
    import { StyleProp, ViewStyle, TextStyle } from 'react-native';

    interface ModalDropdownProps {
        options: string[] | any[];
        defaultValue?: string;
        onSelect?: (index: string | number, value: any) => void;
        style?: StyleProp<ViewStyle>;
        textStyle?: StyleProp<TextStyle>;
        dropdownStyle?: StyleProp<ViewStyle>;
        dropdownTextStyle?: StyleProp<TextStyle>;
    }

    export default class ModalDropdown extends Component<ModalDropdownProps> {}
}
