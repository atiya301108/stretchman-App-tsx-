import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from './components/BottomNav';

export default function ShopScreen() {
    const [coins, setCoins] = useState(0);

    // โหลดจำนวน Coins จากเครื่อง
    const loadCoins = async () => {
        try {
            // รองรับทั้งคีย์ 'stretchmanCoins' และ 'coins' เพื่อความเข้ากันได้กับระบบอื่น ๆ
            const storedCoins = await AsyncStorage.getItem('stretchmanCoins');
            const fallbackCoins = await AsyncStorage.getItem('coins');
            
            const totalCoins = storedCoins || fallbackCoins;
            if (totalCoins) {
                setCoins(parseInt(totalCoins, 10) || 0);
            }
        } catch (error) {
            console.log('Failed to load coins', error);
        }
    };

    // อัปเดตข้อมูลเหรียญทุกครั้งที่ผู้ใช้เปิดเข้ามาหน้านี้
    useFocusEffect(
        useCallback(() => {
            loadCoins();
        }, [])
    );

    return (
        <View style={styles.container}>
            {/* เพิ่ม style={styles.scrollView} เพื่อแก้ปัญหาเส้นขอบขาวด้านขวาบนเว็บ */}
            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.shopPage} 
                showsVerticalScrollIndicator={false}
            >
                
                {/* =========================
                    HEADER
                ========================= */}
                <View style={styles.shopHeader}>
                    <View>
                        <Text style={styles.headerTitle}>Shop</Text>
                        <Text style={styles.headerSubtitle}>ร้านค้าของ Stretchman</Text>
                    </View>

                    {/* COINS DISPLAY */}
                    <View style={styles.coinDisplay}>
                        <FontAwesome6 name="coins" size={18} color="#ffd42a" />
                        <Text style={styles.coinText}>{coins.toLocaleString()}</Text>
                    </View>
                </View>

                {/* =========================
                    SHOP CONTENT
                ========================= */}
                <View style={styles.shopContent}>
                    <View style={styles.emptyShop}>
                        <View style={styles.shopIcon}>
                            <FontAwesome6 name="store" size={34} color="#2477ed" />
                        </View>

                        <Text style={styles.emptyShopTitle}>ร้านค้ากำลังเตรียมตัว</Text>
                        <Text style={styles.emptyShopDesc}>ตอนนี้ยังไม่มีไอเทมในร้านค้า</Text>
                        <Text style={styles.emptyShopSpan}>
                            ไว้ระบบเกมพร้อมแล้ว เราจะเพิ่มไอเทมให้คุณ
                        </Text>
                    </View>
                </View>

            </ScrollView>

            {/* =========================
                BOTTOM NAV (ครอบด้วย View เพื่อจัดระยะขอบซ้าย-ขวาให้ตรงกับหน้าอื่น)
            ========================= */}
            <View style={styles.bottomNavContainer}>
                <BottomNav activeTab="shop" />
            </View>
        </View>
    );
}

// ======================================================
// STYLES
// ======================================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1638AE',
    },
    scrollView: {
        flex: 1,
        width: '100%', // ป้องกันไม่ให้ ScrollView หดและเกิดเส้นขาวด้านขวาบนเว็บ
    },
    bottomNavContainer: {
        paddingHorizontal: 20, // ทำให้เมนูด้านล่างเว้นขอบซ้าย-ขวาตรงกันทุกหน้า
        marginBottom: 15,
    },
    shopPage: {
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 20,
        flexGrow: 1,
    },
    shopHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '600',
        color: '#ffffff',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#ffffff',
        opacity: 0.8,
        marginTop: 4,
    },
    coinDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        backgroundColor: '#ffffff',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
    },
    coinText: {
        fontWeight: '600',
        color: '#222222',
        fontSize: 16,
    },
    shopContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 400,
    },
    emptyShop: {
        width: '100%',
        maxWidth: 350,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 25,
        paddingVertical: 40,
        paddingHorizontal: 25,
    },
    shopIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyShopTitle: {
        fontSize: 21,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyShopDesc: {
        fontSize: 15,
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyShopSpan: {
        fontSize: 12,
        color: '#ffffff',
        opacity: 0.7,
        textAlign: 'center',
        lineHeight: 18,
    },
});