import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';

interface BottomNavProps {
    // อัปเดต Type ให้ตรงกับที่เรียกใช้จริง
    activeTab?: 'home' | 'quest' | 'alarm' | 'shop' | 'user' | 'setting';
}

export default function BottomNav({ activeTab = 'home' }: BottomNavProps) {
    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity 
                style={activeTab === 'home' ? styles.navItemActive : styles.navItem} 
                onPress={() => router.push('/homescreen' as any)}
            >
                <FontAwesome6 name="house" size={16} color={activeTab === 'home' ? '#2475ed' : '#888'} />
                <Text style={activeTab === 'home' ? styles.navTextActive : styles.navText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={activeTab === 'quest' ? styles.navItemActive : styles.navItem} 
                onPress={() => router.push('/quest' as any)}
            >
                <FontAwesome6 name="book-open" size={16} color={activeTab === 'quest' ? '#2475ed' : '#888'} />
                <Text style={activeTab === 'quest' ? styles.navTextActive : styles.navText}>Quest</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={activeTab === 'alarm' ? styles.navItemActive : styles.navItem} 
                onPress={() => router.push('/alarm' as any)}
            >
                <FontAwesome6 name="bell" size={16} color={activeTab === 'alarm' ? '#2475ed' : '#888'} />
                <Text style={activeTab === 'alarm' ? styles.navTextActive : styles.navText}>Alarm</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={activeTab === 'shop' ? styles.navItemActive : styles.navItem} 
                onPress={() => router.push('/shop' as any)}
            >
                <FontAwesome6 name="cart-shopping" size={16} color={activeTab === 'shop' ? '#2475ed' : '#888'} />
                <Text style={activeTab === 'shop' ? styles.navTextActive : styles.navText}>Shop</Text>
            </TouchableOpacity>

            <TouchableOpacity
    style={
        activeTab === 'user' || activeTab === 'setting'
            ? styles.navItemActive
            : styles.navItem
    }
    onPress={() => router.push('/Profile' as any)}
>
    <FontAwesome6
        name="user"
        size={16}
        color={
            activeTab === 'user' || activeTab === 'setting'
                ? '#2475ed'
                : '#888'
        }
    />

    <Text
        style={
            activeTab === 'user' || activeTab === 'setting'
                ? styles.navTextActive
                : styles.navText
        }
    >
        Profile
    </Text>
</TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    navItemActive: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E3EEFF',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    navText: {
        color: '#888888',
        fontSize: 10,
        marginTop: 3,
    },
    navTextActive: {
        color: '#2475ed',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 3,
    },
});