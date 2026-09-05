import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

interface RegisterDatePickerProps {
    value: Date;
    onChange: (date: Date) => void;
    maximumDate?: Date;
}

export default function RegisterDatePicker({
    value,
    onChange,
    maximumDate,
}: RegisterDatePickerProps) {

    return (
        <DateTimePicker
            value={value}
            mode="date"
            display="default"
            maximumDate={maximumDate}
            onChange={(event, date) => {

                if (date) {
                    onChange(date);
                }

            }}
        />
    );
}