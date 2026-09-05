import React from 'react';
import { Platform } from 'react-native';

import WebDatePicker from './RegisterDatePicker.web';
import NativeDatePicker from './RegisterDatePicker.native';

interface RegisterDatePickerProps {
    value: Date;
    onChange: (date: Date) => void;
    maximumDate?: Date;
    onDone?: () => void;
}

export default function RegisterDatePicker(
    props: RegisterDatePickerProps
) {
    if (Platform.OS === 'web') {
        return <WebDatePicker {...props} />;
    }

    return <NativeDatePicker {...props} />;
}