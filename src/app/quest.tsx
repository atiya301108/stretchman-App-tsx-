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

export default function QuestScreen() {
    const [xp, setXP] = useState(0);
    const [coins, setCoins] = useState(0);

    // โหลดข้อมูล XP และ Coins จากเครื่อง
    const loadQuestRewards = async () => {
        try {
            const storedXP = await AsyncStorage.getItem('stretchmanXP');
            const storedCoins = await AsyncStorage.getItem('stretchmanCoins');
            if (storedXP) setXP(parseInt(storedXP, 10) || 0);
            if (storedCoins) setCoins(parseInt(storedCoins, 10) || 0);
        } catch (error) {
            console.log('Failed to load quest rewards', error);
        }
    };

    // อัปเดตข้อมูลเมื่อผู้ใช้กลับมาหน้านี้ (เทียบเท่า window.addEventListener("focus"))
    useFocusEffect(
        useCallback(() => {
            loadQuestRewards();
        }, [])
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.questPage} showsVerticalScrollIndicator={false}>
                
                {/* =========================
                    HEADER
                ========================= */}
                <View style={styles.questHeader}>
                    <View>
                        <Text style={styles.headerTitle}>Quest</Text>
                        <Text style={styles.headerSubtitle}>ภารกิจของคุณ</Text>
                    </View>
                    <View style={styles.questHeaderIcon}>
                        <FontAwesome6 name="scroll" size={22} color="white" />
                    </View>
                </View>

                {/* =========================
                    XP / COINS
                ========================= */}
                <View style={styles.rewardSummary}>
                    <View style={[styles.rewardCard, styles.xpCard]}>
                        <View style={[styles.rewardIcon, styles.xpIconBg]}>
                            <Text style={{ fontSize: 20 }}>⭐</Text>
                        </View>
                        <View>
                            <Text style={styles.rewardLabel}>XP</Text>
                            <Text style={styles.rewardValue}>{xp}</Text>
                        </View>
                    </View>

                    <View style={[styles.rewardCard, styles.coinCard]}>
                        <View style={[styles.rewardIcon, styles.coinIconBg]}>
                            <Text style={{ fontSize: 20 }}>🪙</Text>
                        </View>
                        <View>
                            <Text style={styles.rewardLabel}>Coins</Text>
                            <Text style={styles.rewardValue}>{coins}</Text>
                        </View>
                    </View>
                </View>

                {/* =========================
                    DAILY QUEST
                ========================= */}
                <View style={styles.questSection}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Daily Quest</Text>
                            <Text style={styles.sectionSubtitle}>ภารกิจประจำวัน</Text>
                        </View>
                        <FontAwesome6 name="calendar-day" size={20} color="rgba(0,0,0,0.6)" />
                    </View>

                    <View style={styles.emptyQuest}>
                        <View style={styles.emptyIcon}>
                            <FontAwesome6 name="list-check" size={24} color="#2563eb" />
                        </View>
                        <Text style={styles.emptyTitle}>ยังไม่มีภารกิจ</Text>
                        <Text style={styles.emptyDesc}>ภารกิจประจำวันจะแสดงที่นี่</Text>
                    </View>
                </View>

                {/* =========================
                    WEEKLY QUEST
                ========================= */}
                <View style={styles.questSection}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Weekly Quest</Text>
                            <Text style={styles.sectionSubtitle}>ภารกิจประจำสัปดาห์</Text>
                        </View>
                        <FontAwesome6 name="calendar-week" size={20} color="rgba(0,0,0,0.6)" />
                    </View>

                    <View style={styles.emptyQuest}>
                        <View style={styles.emptyIcon}>
                            <FontAwesome6 name="trophy" size={24} color="#2563eb" />
                        </View>
                        <Text style={styles.emptyTitle}>ยังไม่มีภารกิจ</Text>
                        <Text style={styles.emptyDesc}>ภารกิจประจำสัปดาห์จะแสดงที่นี่</Text>
                    </View>
                </View>

            </ScrollView>

            {/* =========================
                BOTTOM NAV
            ========================= */}
            <BottomNav activeTab="quest" />
        </View>
    );
}

// ======================================================
// STYLES
// ======================================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    questPage: {
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 100,
    },
    questHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1e293b',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 5,
    },
    questHeaderIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rewardSummary: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 25,
    },
    rewardCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 18,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    xpCard: {},
    coinCard: {},
    rewardIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    xpIconBg: {
        backgroundColor: '#fff3cd',
    },
    coinIconBg: {
        backgroundColor: '#e8f5e9',
    },
    rewardLabel: {
        fontSize: 12,
        color: '#64748b',
    },
    rewardValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
        marginTop: 2,
    },
    questSection: {
        marginBottom: 22,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 3,
    },
    emptyQuest: {
        minHeight: 180,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#d8dce5',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
    },
    emptyIcon: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#eef4ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    emptyDesc: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 7,
        textAlign: 'center',
    },
});