import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from './components/BottomNav';
import { getTasksApi } from '../services/api'; // 1. Import API มาใช้งาน

export default function QuestScreen() {
    const router = useRouter();
    const [xp, setXP] = useState(0);
    const [coins, setCoins] = useState(0);
    
    // 2. เพิ่ม State สำหรับเก็บข้อมูลเควสต์และสถานะการโหลด
    const [quests, setQuests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    // 3. ฟังก์ชันดึงภารกิจจากฐานข้อมูล
    const loadTasks = async () => {
        setIsLoading(true);
        try {
            const data = await getTasksApi();
            setQuests(data);
        } catch (error) {
            console.log('Failed to load tasks', error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadQuestRewards();
            loadTasks(); // เรียกใช้ตอนเปิดหน้านี้
        }, [])
    );

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.questPage} 
                showsVerticalScrollIndicator={false}
            >
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
                    DAILY QUEST (อัปเดตให้ดึงจาก Backend)
                ========================= */}
                <View style={styles.questSection}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Daily Quest</Text>
                            <Text style={styles.sectionSubtitle}>ภารกิจประจำวัน</Text>
                        </View>
                        <FontAwesome6 name="calendar-day" size={20} color="rgba(255,255,255,0.8)" />
                    </View>

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#ffffff" style={{ marginVertical: 30 }} />
                    ) : quests.length === 0 ? (
                        // ถ้าไม่มีภารกิจ จะโชว์ UI ดีไซน์เดิมของโชค
                        <View style={styles.emptyQuest}>
                            <View style={styles.emptyIcon}>
                                <FontAwesome6 name="list-check" size={24} color="#2563eb" />
                            </View>
                            <Text style={styles.emptyTitle}>ยังไม่มีภารกิจ</Text>
                            <Text style={styles.emptyDesc}>ภารกิจประจำวันจะแสดงที่นี่</Text>
                        </View>
                    ) : (
                        // ถ้ามีภารกิจ จะสร้างการ์ดขึ้นมาแสดงผล
                        quests.map((quest, index) => (
                            <View key={index} style={styles.taskCard}>
                                <View style={styles.taskIconWrap}>
                                    <FontAwesome6 name="gift" size={20} color="#2563eb" />
                                </View>
                                <View style={styles.taskInfo}>
                                    <Text style={styles.taskTitle}>{quest.title}</Text>
                                    <Text style={styles.taskDesc}>{quest.description}</Text>
                                </View>
                                <TouchableOpacity 
                                style={styles.taskActionBtn}
                                onPress={() => router.push({ pathname: '/stretch', params: { taskId: quest.id } })}>

                                    <Text style={styles.taskActionText}>เริ่ม</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
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
                        <FontAwesome6 name="calendar-week" size={20} color="rgba(255,255,255,0.8)" />
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
            <View style={styles.bottomNavContainer}>
                <BottomNav activeTab="quest" />
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
        width: '100%',
    },
    questPage: {
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 20,
    },
    bottomNavContainer: {
        paddingHorizontal: 20,
        marginBottom: 15,
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
        color: '#ffffff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 5,
    },
    questHeaderIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
        shadowOpacity: 0.1,
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
        color: '#ffffff',
    },
    sectionSubtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 3,
    },
    emptyQuest: {
        minHeight: 180,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
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
    // สไตล์เพิ่มเติมสำหรับการ์ดภารกิจที่มีข้อมูล
    taskCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    taskIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#eef4ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    taskInfo: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 4,
    },
    taskDesc: {
        fontSize: 13,
        color: '#64748b',
    },
    taskActionBtn: {
        backgroundColor: '#2563eb',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginLeft: 10,
    },
    taskActionText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
    }
});