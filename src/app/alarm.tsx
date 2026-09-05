import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from './components/BottomNav';

interface AlarmItem {
    id: string;
    time: string;
    period: string;
    exercise: string;
    days: string[];
    enabled: boolean;

    soundEnabled?: boolean;
    vibrationEnabled?: boolean;
    snoozeEnabled?: boolean;
}

export default function AlarmScreen() {
    const router = useRouter();

    const [darkMode, setDarkMode] = useState(false);
    const [alarms, setAlarms] = useState<AlarmItem[]>([]);

    const loadData = async () => {
        try {
            const dark = await AsyncStorage.getItem('stretchmanDarkMode');
            if (dark !== null) {
                setDarkMode(dark === 'true');
            }

            const storedAlarms = await AsyncStorage.getItem('stretchmanAlarms');
            if (storedAlarms) {
                setAlarms(JSON.parse(storedAlarms));
            } else {
                setAlarms([]);
            }
        } catch (error) {
            console.log('Failed to load alarm data', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const handleToggleAlarm = async (id: string, value: boolean) => {
        try {
            const updated = alarms.map((alarm) =>
                alarm.id === id ? { ...alarm, enabled: value } : alarm
            );

            setAlarms(updated);
            await AsyncStorage.setItem('stretchmanAlarms', JSON.stringify(updated));
        } catch (error) {
            console.log('Failed to toggle alarm:', error);
        }
    };

    const handleOpenAlarm = (id: string) => {
        router.push({
            pathname: '/add-alarm',
            params: { id: id },
        } as any);
    };

    return (
        <View style={[styles.container, darkMode && styles.darkContainer]}>
            {/* =====================================================
                FIXED ADD ALARM BUTTON (อยู่มุมขวาบน ไม่เลื่อนตาม Scroll)
            ===================================================== */}
            <TouchableOpacity
                style={styles.addAlarmButton}
                activeOpacity={0.8}
                onPress={() => router.push('/add-alarm' as any)}
            >
                <FontAwesome6 name="plus" size={18} color="#ffffff" />
            </TouchableOpacity>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.alarmPage}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View style={styles.alarmHeader}>
                    <View style={styles.headerTitleRow}>
                        <Text style={[styles.headerTitle, darkMode && styles.darkText]}>
                            Alarm
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                Alert.alert(
                                    'คำแนะนำ',
                                    'ตั้งเวลาแจ้งเตือนเพื่อให้ร่างกายได้ยืดเหยียดตามเวลาที่กำหนด'
                                )
                            }
                        >
                            <FontAwesome6
                                name="circle-question"
                                size={18}
                                color="#ff9800"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.headerSubtitle}>
                        ปลุกร่างกายให้สดชื่นด้วยการยืดกล้ามเนื้อ
                    </Text>
                </View>

                {/* ALARM LIST */}
                {alarms.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <FontAwesome6 name="clock" size={48} color="#cbd5e1" />
                        <Text style={[styles.emptyText, darkMode && styles.darkText]}>
                            ยังไม่มีการตั้งเวลาปลุก
                        </Text>
                        <Text style={styles.emptySubText}>
                            กดปุ่มด้านล่างเพื่อเพิ่มเวลาแจ้งเตือนใหม่
                        </Text>
                    </View>
                ) : (
                    alarms.map((item) => (
                        <View
                            key={item.id}
                            style={[
                                styles.alarmCard,
                                darkMode && styles.darkCard,
                            ]}
                        >
                            <View style={styles.daysRow}>
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => {
                                    const isActive = item.days.includes(day);
                                    return (
                                        <Text
                                            key={idx}
                                            style={[
                                                styles.dayText,
                                                isActive && styles.activeDayText,
                                                darkMode && styles.darkText,
                                                darkMode && isActive && styles.darkActiveDayText,
                                            ]}
                                        >
                                            {day}
                                        </Text>
                                    );
                                })}
                            </View>

                            <View style={styles.alarmMainRow}>
                                <TouchableOpacity
                                    style={styles.alarmInfoTouchable}
                                    activeOpacity={0.75}
                                    onPress={() => handleOpenAlarm(item.id)}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                                        <Text style={[styles.alarmTimeText, darkMode && styles.darkText]}>
                                            {item.time}
                                        </Text>
                                        <Text style={styles.alarmPeriodText}>
                                            {item.period}
                                        </Text>
                                        <FontAwesome6
                                            name="pen-to-square"
                                            size={13}
                                            color="#94a3b8"
                                            style={{ marginLeft: 3 }}
                                        />
                                    </View>

                                    <Text style={styles.alarmExerciseText}>
                                        🏋️ {item.exercise}
                                    </Text>
                                    <Text style={styles.editHint}>
                                        แตะเพื่อแก้ไข
                                    </Text>
                                </TouchableOpacity>

                                <Switch
                                    value={item.enabled}
                                    onValueChange={(val) => handleToggleAlarm(item.id, val)}
                                    trackColor={{ false: '#d7dce2', true: '#ff9800' }}
                                    thumbColor="#ffffff"
                                />
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* BOTTOM NAV */}
            <View style={styles.bottomNavContainer}>
                <BottomNav activeTab="alarm" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    darkContainer: {
        backgroundColor: '#121212',
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    bottomNavContainer: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    alarmPage: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
    },
    alarmHeader: {
        marginBottom: 20,
    },
    headerTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1e293b',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#777777',
        marginTop: 5,
    },
    darkText: {
        color: '#ffffff',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#334155',
        marginTop: 12,
    },
    emptySubText: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 4,
    },
    alarmCard: {
        width: '100%',
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.05,
        shadowRadius: 18,
        elevation: 3,
    },
    darkCard: {
        backgroundColor: '#1e1e1e',
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    dayText: {
        fontSize: 12,
        color: '#b0b8c1',
        fontWeight: '600',
    },
    activeDayText: {
        color: '#1e293b',
        fontWeight: 'bold',
    },
    darkActiveDayText: {
        color: '#ff9800',
    },
    alarmMainRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    alarmInfoTouchable: {
        flex: 1,
        paddingRight: 10,
    },
    alarmTimeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    alarmPeriodText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    alarmExerciseText: {
        fontSize: 13,
        color: '#777777',
        marginTop: 4,
    },
    editHint: {
        fontSize: 10,
        color: '#94a3b8',
        marginTop: 4,
    },

    /* ==================================================
       FIXED ADD BUTTON STYLES
    ================================================== */
    addAlarmButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#ff9800',
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#ff9800',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
});