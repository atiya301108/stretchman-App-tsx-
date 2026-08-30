import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from './components/BottomNav';

interface HistoryItem {
    date: string;
    title?: string;
    xp?: number;
}

export default function StreakHistoryScreen() {
    const router = useRouter();
    const [currentStreak, setCurrentStreak] = useState<number>(0);
    const [bestStreak, setBestStreak] = useState<number>(0);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    // โหลดข้อมูล Streak และประวัติจาก AsyncStorage
    const loadData = async () => {
        try {
            const userDataStr = await AsyncStorage.getItem('stretchmanUserData') || await AsyncStorage.getItem('stretchmanUser');
            let streak = 0;
            if (userDataStr) {
                const parsed = JSON.parse(userDataStr);
                streak = Number(parsed.streak) || 0;
            }
            setCurrentStreak(streak);

            const savedBest = Number(await AsyncStorage.getItem('stretchmanBestStreak') || 0);
            const best = Math.max(savedBest, streak);
            setBestStreak(best);
            await AsyncStorage.setItem('stretchmanBestStreak', best.toString());

            const historyStr = await AsyncStorage.getItem('stretchmanStreakHistory');
            if (historyStr) {
                setHistory(JSON.parse(historyStr));
            } else {
                setHistory([]);
            }
        } catch (error) {
            console.log('Error loading streak history data:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    // การคำนวณปฏิทิน
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const firstDay = new Date(year, month, 1);
    let startDay = firstDay.getDay();
    // ปรับให้วันจันทร์ = 0 (ตามต้นฉบับ HTML)
    startDay = startDay === 0 ? 6 : startDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const formatDateString = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const formatThaiDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        const months = [
            "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
            "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
        ];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
    };

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.historyPage} showsVerticalScrollIndicator={false}>
                
                {/* HEADER */}
                <View style={styles.historyHeader}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <FontAwesome6 name="arrow-left" size={20} color="#17324d" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitle}>Streak History</Text>
                        <Text style={styles.headerSubtitle}>ประวัติการยืดกล้ามเนื้อ</Text>
                    </View>
                </View>

                {/* CURRENT STREAK CARD */}
                <View style={styles.currentStreakCard}>
                    <View style={styles.fireIcon}>
                        <FontAwesome6 name="fire" size={27} color="#ff9f1c" />
                    </View>
                    <View style={styles.streakInfo}>
                        <Text style={styles.labelSpan}>Streak ปัจจุบัน</Text>
                        <Text style={styles.streakValue}>{currentStreak} วัน</Text>
                    </View>
                    <View style={styles.bestStreak}>
                        <Text style={styles.labelSpan}>ดีที่สุด</Text>
                        <Text style={styles.bestValue}>{bestStreak} วัน</Text>
                    </View>
                </View>

                {/* CALENDAR SECTION */}
                <View style={styles.calendarSection}>
                    <View style={styles.calendarTitleContainer}>
                        <TouchableOpacity style={styles.monthNavBtn} onPress={prevMonth}>
                            <FontAwesome6 name="chevron-left" size={14} color="#329ce8" />
                        </TouchableOpacity>
                        <Text style={styles.monthTitleText}>
                            {monthNames[month]} {year + 543}
                        </Text>
                        <TouchableOpacity style={styles.monthNavBtn} onPress={nextMonth}>
                            <FontAwesome6 name="chevron-right" size={14} color="#329ce8" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.weekdays}>
                        {['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map((dayName, idx) => (
                            <Text key={idx} style={styles.weekdayText}>{dayName}</Text>
                        ))}
                    </View>

                    <View style={styles.calendarGrid}>
                        {/* ช่องว่างต้นเดือน */}
                        {Array.from({ length: startDay }).map((_, idx) => (
                            <View key={`empty-${idx}`} style={[styles.calendarDay, styles.emptyDay]} />
                        ))}

                        {/* วันในเดือน */}
                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                            const day = idx + 1;
                            const thisDate = new Date(year, month, day);
                            const dateStr = formatDateString(thisDate);
                            const isCompleted = history.some(item => item.date === dateStr);
                            const today = new Date();
                            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

                            return (
                                <View
                                    key={`day-${day}`}
                                    style={[
                                        styles.calendarDay,
                                        isCompleted && styles.completedDay,
                                        isToday && styles.todayOutline,
                                        isCompleted && isToday && styles.completedTodayDay
                                    ]}
                                >
                                    <Text style={[
                                        styles.calendarDayText,
                                        isCompleted && styles.completedDayText,
                                        isCompleted && isToday && styles.completedTodayText
                                    ]}>
                                        {day}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>

                    <View style={styles.calendarLegend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, styles.legendCompleted]} />
                            <Text style={styles.legendText}>วันที่ยืดแล้ว</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, styles.legendToday]} />
                            <Text style={styles.legendText}>วันนี้</Text>
                        </View>
                    </View>
                </View>

                {/* HISTORY SECTION */}
                <View style={styles.historySection}>
                    <View style={styles.sectionTitle}>
                        <Text style={styles.sectionTitleText}>ประวัติการยืด</Text>
                        <Text style={styles.sectionTitleSpan}>{history.length} ครั้ง</Text>
                    </View>

                    {history.length === 0 ? (
                        <View style={styles.emptyHistory}>
                            <FontAwesome6 name="calendar-xmark" size={40} color="#8b9cab" />
                            <Text style={styles.emptyTitle}>ยังไม่มีประวัติ</Text>
                            <Text style={styles.emptyDesc}>เริ่มต้นยืดกล้ามเนื้อวันนี้ เพื่อสร้าง Streak ของคุณ</Text>
                        </View>
                    ) : (
                        <View style={styles.historyList}>
                            {sortedHistory.map((item, index) => (
                                <View key={index} style={styles.historyItem}>
                                    <View style={styles.historyIcon}>
                                        <FontAwesome6 name="check" size={16} color="#329ce8" />
                                    </View>
                                    <View style={styles.historyContent}>
                                        <Text style={styles.historyItemTitle}>{item.title || "ยืดกล้ามเนื้อ"}</Text>
                                        <Text style={styles.historyItemDate}>{formatThaiDate(item.date)}</Text>
                                    </View>
                                    <Text style={styles.historyXp}>+{item.xp || 15} XP</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

            </ScrollView>

            {/* BOTTOM NAV */}
            <BottomNav activeTab="setting" />
        </View>
    );
}

// ======================================================
// STYLES
// ======================================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eef9ff',
    },
    historyPage: {
        width: '100%',
        maxWidth: 430,
        alignSelf: 'center',
        minHeight: '100%',
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 110,
        gap: 15,
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 5,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#17324d',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#7890a5',
        marginTop: 2,
    },
    currentStreakCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        shadowColor: '#3c8cbe',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 25,
        elevation: 4,
    },
    fireIcon: {
        width: 55,
        height: 55,
        borderRadius: 16,
        backgroundColor: '#fff2d8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    streakInfo: {
        flex: 1,
    },
    labelSpan: {
        fontSize: 12,
        color: '#8297a9',
    },
    streakValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ff8b00',
    },
    bestStreak: {
        alignItems: 'flex-end',
    },
    bestValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#263d52',
    },
    calendarSection: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#3c8cbe',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
    },
    calendarTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    monthTitleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#263d52',
    },
    monthNavBtn: {
        width: 35,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#edf8ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekdays: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    weekdayText: {
        width: '14.28%',
        textAlign: 'center',
        fontSize: 11,
        color: '#91a3b2',
        fontWeight: '600',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarDay: {
        width: '14.28%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 6,
    },
    emptyDay: {
        visibility: 'hidden',
    },
    calendarDayText: {
        fontSize: 12,
        color: '#617487',
    },
    completedDay: {
        backgroundColor: '#dff3ff',
    },
    completedDayText: {
        color: '#2499df',
        fontWeight: '600',
    },
    todayOutline: {
        borderWidth: 2,
        borderColor: '#43a5ff',
    },
    completedTodayDay: {
        backgroundColor: '#43a5ff',
    },
    completedTodayText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    calendarLegend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#f0f4f8',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendCompleted: {
        backgroundColor: '#dff3ff',
    },
    legendToday: {
        backgroundColor: '#43a5ff',
    },
    legendText: {
        fontSize: 11,
        color: '#8297a9',
    },
    historySection: {
        marginTop: 5,
    },
    sectionTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitleText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#263d52',
    },
    sectionTitleSpan: {
        fontSize: 12,
        color: '#7e94a7',
    },
    historyList: {
        gap: 10,
    },
    historyItem: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    historyIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#e8f7ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyContent: {
        flex: 1,
    },
    historyItemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#31495e',
    },
    historyItemDate: {
        fontSize: 11,
        color: '#8b9cab',
        marginTop: 2,
    },
    historyXp: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ff9d19',
    },
    emptyHistory: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        borderRadius: 20,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#526b7f',
        marginTop: 10,
    },
    emptyDesc: {
        fontSize: 12,
        color: '#8b9cab',
        textAlign: 'center',
        marginTop: 5,
    },
});