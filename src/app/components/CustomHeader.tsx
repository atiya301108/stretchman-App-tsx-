import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';

interface CustomHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    rightComponent?: React.ReactNode;
}

export default function CustomHeader({
    title,
    subtitle,
    onBack,
    rightComponent,
}: CustomHeaderProps) {
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/pain' as any);
        }
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <FontAwesome6 name="arrow-left" size={18} color="#2148C0" />
            </TouchableOpacity>

            <View style={styles.headerText}>
                <Text style={styles.headerTitle}>{title}</Text>
                {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
            </View>

            {rightComponent && <View>{rightComponent}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginTop: 10,
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        flex: 1,
        marginLeft: 12,
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 14,
        marginTop: 2,
    },
});