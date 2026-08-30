import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from './components/BottomNav';

interface Alarm {
    id: number;
    time: string;
    label: string;
    days: number[];
    enabled: boolean;
}

const DAYS_CONFIG = [
    { id: 1, label: 'จ' },
    { id: 2, label: 'อ' },
    { id: 3, label: 'พ' },
    { id: 4, label: 'พฤ' },
    { id: 5, label: 'ศ' },
    { id: 6, label: 'ส' },
    { id: 0, label: 'อา' },
];

export default function AlarmScreen() {
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [alarmTime, setAlarmTime] = useState('');
    const [alarmLabel, setAlarmLabel] = useState('');
    const [selectedDays, setSelectedDays] = useState<number[]>([]);

    // โหลดข้อมูลการแจ้งเตือนจาก AsyncStorage
    const loadAlarms = async () => {
        try {
            const storedAlarms = await AsyncStorage.getItem('stretchmanAlarms');
            if (storedAlarms) {
                setAlarms(JSON.parse(storedAlarms));
            }
        } catch (error) {
            console.log('Failed to load alarms', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadAlarms();
        }, [])
    );

    // บันทึกข้อมูลการแจ้งเตือน
    const saveAlarms = async (updatedAlarms: Alarm[]) => {
        try {
            setAlarms(updatedAlarms);
            await AsyncStorage.setItem('stretchmanAlarms', JSON.stringify(updatedAlarms));
        } catch (error) {
            console.log('Failed to save alarms', error);
        }
    };

    // เลือก/ยกเลิกเลือกวัน
    const toggleDaySelection = (dayId: number) => {
        if (selectedDays.includes(dayId)) {
            setSelectedDays(selectedDays.filter((d) => d !== dayId));
        } else {
            setSelectedDays([...selectedDays, dayId]);
        }
    };

    // เพิ่มการแจ้งเตือนใหม่
    const handleAddAlarm = () => {
        if (!alarmTime.trim()) {
            Alert.alert('แจ้งเตือน', 'กรุณาเลือกเวลา');
            return;
        }

        let days = [...selectedDays];
        if (days.length === 0) {
            days = [0, 1, 2, 3, 4, 5, 6]; // ถ้าไม่ได้เลือกวัน ให้เตือนทุกวัน
        }

        const newAlarm: Alarm = {
            id: Date.now(),
            time: alarmTime.trim(),
            label: alarmLabel.trim() || 'เวลายืดกล้ามเนื้อ',
            days: days,
            enabled: true,
        };

        const updatedAlarms = [...alarms, newAlarm];
        saveAlarms(updatedAlarms);

        // ล้างช่องกรอกข้อมูล
        setAlarmTime('');
        setAlarmLabel('');
        setSelectedDays([]);

        Alert.alert('สำเร็จ', 'เพิ่มการแจ้งเตือนเรียบร้อยแล้ว 🔔');
    };

    // เปิด/ปิด สถานะ Alarm
    const handleToggleAlarm = (id: number, enabled: boolean) => {
        const updatedAlarms = alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, enabled } : alarm
        );
        saveAlarms(updatedAlarms);
    };

    // ลบ Alarm
    const handleDeleteAlarm = (id: number) => {
        const updatedAlarms = alarms.filter((alarm) => alarm.id !== id);
        saveAlarms(updatedAlarms);
    };

    // แปลงรหัสวันเป็นข้อความย่อ
    const getDayText = (days: number[]) => {
        if (days.length === 7) return 'ทุกวัน';
        const names: { [key: number]: string } = {
            0: 'อา',
            1: 'จ',
            2: 'อ',
            3: 'พ',
            4: 'พฤ',
            5: 'ศ',
            6: 'ส',
        };
        return days
            .sort((a, b) => a - b)
            .map((day) => names[day])
            .join(' • ');
    };

    // เรียงลำดับตามเวลา
    const sortedAlarms = [...alarms].sort((a, b) => a.time.localeCompare(b.time));

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.alarmPage} showsVerticalScrollIndicator={false}>
                
                {/* =========================
                    HEADER
                ========================= */}
                <View style={styles.alarmHeader}>
                    <View>
                        <Text style={styles.headerTitle}>Alarm</Text>
                        <Text style={styles.headerSubtitle}>ตั้งเวลาเตือนให้คุณยืดกล้ามเนื้อ</Text>
                    </View>
                    <View style={styles.alarmHeaderIcon}>
                        <FontAwesome6 name="bell" size={22} color="white" />
                    </View>
                </View>

                {/* =========================
                    ADD ALARM CARD
                ========================= */}
                <View style={styles.addAlarmCard}>
                    <View style={styles.cardTitle}>
                        <View style={styles.titleIcon}>
                            <FontAwesome6 name="plus" size={20} color="#3f7cff" />
                        </View>
                        <View>
                            <Text style={styles.cardTitleText}>เพิ่มเวลายืด</Text>
                            <Text style={styles.cardSubtitleText}>ตั้งเวลาที่ต้องการให้ Stretchman เตือน</Text>
                        </View>
                    </View>

                    <View style={styles.alarmForm}>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>เวลา</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="เช่น 08:00"
                                placeholderTextColor="#94a3b8"
                                value={alarmTime}
                                onChangeText={setAlarmTime}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>ชื่อการแจ้งเตือน</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="เช่น ยืดตอนเช้า"
                                placeholderTextColor="#94a3b8"
                                value={alarmLabel}
                                onChangeText={setAlarmLabel}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>วัน</Text>
                            <View style={styles.daySelector}>
                                {DAYS_CONFIG.map((day) => {
                                    const isSelected = selectedDays.includes(day.id);
                                    return (
                                        <TouchableOpacity
                                            key={day.id}
                                            style={[styles.dayBtn, isSelected && styles.dayBtnSelected]}
                                            onPress={() => toggleDaySelection(day.id)}
                                        >
                                            <Text style={[styles.dayBtnText, isSelected && styles.dayBtnTextSelected]}>
                                                {day.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <TouchableOpacity style={styles.addButton} onPress={handleAddAlarm}>
                            <FontAwesome6 name="plus" size={14} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.addButtonText}>เพิ่มการแจ้งเตือน</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* =========================
                    ALARM LIST SECTION
                ========================= */}
                <View style={styles.alarmListSection}>
                    <View style={styles.sectionTitleRow}>
                        <View>
                            <Text style={styles.sectionTitleText}>การแจ้งเตือนของคุณ</Text>
                            <Text style={styles.sectionSubtitleText}>ตั้งเวลาการยืดที่ต้องการ</Text>
                        </View>
                        <Text style={styles.alarmCountText}>{alarms.length} รายการ</Text>
                    </View>

                    {sortedAlarms.length === 0 ? (
                        <View style={styles.emptyAlarm}>
                            <FontAwesome6 name="bell-slash" size={45} color="#94a3b8" style={{ marginBottom: 8 }} />
                            <Text style={styles.emptyAlarmStrong}>ยังไม่มีการแจ้งเตือน</Text>
                            <Text style={styles.emptyAlarmSpan}>เพิ่มเวลายืดด้านบนเพื่อเริ่มต้น</Text>
                        </View>
                    ) : (
                        sortedAlarms.map((alarm) => (
                            <View key={alarm.id} style={styles.alarmCard}>
                                <View style={styles.alarmIcon}>
                                    <FontAwesome6 name="bell" size={20} color="#3f7cff" />
                                </View>

                                <View style={styles.alarmInfo}>
                                    <Text style={styles.alarmTimeText}>{alarm.time}</Text>
                                    <Text style={styles.alarmLabelText}>{alarm.label}</Text>
                                    <Text style={styles.alarmDaysText}>{getDayText(alarm.days)}</Text>
                                </View>

                                <Switch
                                    value={alarm.enabled}
                                    onValueChange={(val) => handleToggleAlarm(alarm.id, val)}
                                    trackColor={{ false: '#cbd2df', true: '#3f7cff' }}
                                    thumbColor={'#ffffff'}
                                />

                                <TouchableOpacity
                                    style={styles.deleteAlarmBtn}
                                    onPress={() => handleDeleteAlarm(alarm.id)}
                                >
                                    <FontAwesome6 name="trash" size={14} color="#e74c3c" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>

            </ScrollView>

            {/* =========================
                BOTTOM NAV
            ========================= */}
            <BottomNav activeTab="alarm" />
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
    alarmPage: {
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 110,
    },
    alarmHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    alarmHeaderIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: '#3f7cff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addAlarmCard: {
        backgroundColor: '#ffffff',
        borderRadius: 22,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 25,
        elevation: 3,
        marginBottom: 25,
    },
    cardTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    titleIcon: {
        width: 45,
        height: 45,
        borderRadius: 14,
        backgroundColor: '#eaf1ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitleText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    cardSubtitleText: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 3,
    },
    alarmForm: {},
    formGroup: {
        marginBottom: 17,
    },
    formLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#1e293b',
        marginBottom: 7,
    },
    input: {
        width: '100%',
        backgroundColor: '#f2f5fb',
        borderRadius: 12,
        padding: 13,
        fontSize: 14,
        color: '#1e293b',
    },
    daySelector: {
        flexDirection: 'row',
        gap: 7,
    },
    dayBtn: {
        width: 39,
        height: 39,
        borderRadius: 19.5,
        backgroundColor: '#edf1f7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayBtnSelected: {
        backgroundColor: '#3f7cff',
    },
    dayBtnText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#555555',
    },
    dayBtnTextSelected: {
        color: '#ffffff',
    },
    addButton: {
        width: '100%',
        borderRadius: 13,
        padding: 14,
        backgroundColor: '#3f7cff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    alarmListSection: {
        marginTop: 10,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitleText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    sectionSubtitleText: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
    },
    alarmCountText: {
        fontSize: 12,
        color: '#64748b',
    },
    emptyAlarm: {
        textAlign: 'center',
        paddingVertical: 45,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    emptyAlarmStrong: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#64748b',
    },
    emptyAlarmSpan: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 3,
    },
    alarmCard: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 17,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
        elevation: 2,
    },
    alarmIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#eaf1ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alarmInfo: {
        flex: 1,
    },
    alarmTimeText: {
        fontSize: 25,
        fontWeight: '600',
        color: '#1e293b',
    },
    alarmLabelText: {
        fontSize: 13,
        color: '#475569',
        marginTop: 2,
    },
    alarmDaysText: {
        fontSize: 11,
        color: '#94a3b8',
        marginTop: 4,
    },
    deleteAlarmBtn: {
        width: 38,
        height: 38,
        borderRadius: 11,
        backgroundColor: '#fff0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});