import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import BottomNav from './components/BottomNav';
import CustomHeader from './components/CustomHeader'; // ดึง CustomHeader มาใช้งาน

interface ExerciseItem {
    name: string;
    description: string;
    time: string;
}

// ฐานข้อมูลท่ายืดตามจุดที่ปวด
const exercisesDatabase: Record<string, ExerciseItem[]> = {
    'คอ': [
        {
            name: 'ยืดกล้ามเนื้อคอด้านข้าง',
            description: 'ค่อย ๆ เอียงศีรษะไปด้านข้าง',
            time: '20 วินาที',
        },
        {
            name: 'ยืดคอด้านหน้า',
            description: 'ค่อย ๆ เงยหน้าและยืดกล้ามเนื้อ',
            time: '15 วินาที',
        },
        {
            name: 'หมุนคอเบา ๆ',
            description: 'หมุนศีรษะช้า ๆ อย่างนุ่มนวล',
            time: '30 วินาที',
        },
    ],
    'ไหล่ซ้าย': [
        {
            name: 'ยืดไหล่แบบพาดแขน',
            description: 'ใช้แขนอีกข้างช่วยดึงเบา ๆ',
            time: '20 วินาที',
        },
        {
            name: 'ยืดไหล่ด้านข้าง',
            description: 'ยกแขนและยืดออกด้านข้าง',
            time: '20 วินาที',
        },
    ],
    'ไหล่ขวา': [
        {
            name: 'ยืดไหล่แบบพาดแขน',
            description: 'ใช้แขนอีกข้างช่วยดึงเบา ๆ',
            time: '20 วินาที',
        },
        {
            name: 'ยืดไหล่ด้านข้าง',
            description: 'ยกแขนและยืดออกด้านข้าง',
            time: '20 วินาที',
        },
    ],
    'หลังส่วนบน': [
        {
            name: 'ยืดหลังส่วนบน',
            description: 'ประสานมือและดันแขนไปด้านหน้า',
            time: '20 วินาที',
        },
        {
            name: 'ท่ายืดหลังแบบกอดตัวเอง',
            description: 'กอดตัวเองและดันหลังออก',
            time: '20 วินาที',
        },
    ],
    'หลัง': [
        {
            name: 'ยืดหลัง',
            description: 'ยืดกล้ามเนื้อหลังอย่างช้า ๆ',
            time: '20 วินาที',
        },
        {
            name: 'ท่า Cat-Cow',
            description: 'ขยับกระดูกสันหลังอย่างนุ่มนวล',
            time: '30 วินาที',
        },
    ],
    'หลังส่วนล่าง': [
        {
            name: 'ยืดหลังส่วนล่าง',
            description: 'ดึงเข่าเข้าหาลำตัวอย่างเบา ๆ',
            time: '20 วินาที',
        },
        {
            name: "ท่า Child's Pose",
            description: 'นั่งพับตัวเพื่อผ่อนคลายหลัง',
            time: '30 วินาที',
        },
    ],
    'เอว': [
        {
            name: 'ยืดเอวด้านข้าง',
            description: 'เอียงลำตัวไปด้านข้างอย่างช้า ๆ',
            time: '20 วินาที',
        },
    ],
    'สะโพก': [
        {
            name: 'ยืดสะโพก',
            description: 'ยืดกล้ามเนื้อบริเวณสะโพก',
            time: '20 วินาที',
        },
    ],
    'หน้าอก': [
        {
            name: 'ยืดหน้าอก',
            description: 'เปิดไหล่และยืดกล้ามเนื้อหน้าอก',
            time: '20 วินาที',
        },
    ],
    'ท้อง': [
        {
            name: 'ยืดลำตัวด้านหน้า',
            description: 'ยืดกล้ามเนื้อบริเวณด้านหน้าของลำตัว',
            time: '15 วินาที',
        },
    ],
    'เข่าซ้าย': [
        {
            name: 'ยืดต้นขาด้านหน้า',
            description: 'จับข้อเท้าและดึงเข้าหาตัวเบา ๆ',
            time: '20 วินาที',
        },
    ],
    'เข่าขวา': [
        {
            name: 'ยืดต้นขาด้านหน้า',
            description: 'จับข้อเท้าและดึงเข้าหาตัวเบา ๆ',
            time: '20 วินาที',
        },
    ],
};

const defaultExercises: ExerciseItem[] = [
    {
        name: 'ยืดกล้ามเนื้อเบื้องต้น',
        description: 'ยืดกล้ามเนื้ออย่างนุ่มนวล',
        time: '20 วินาที',
    },
    {
        name: 'ยืดตัวเบา ๆ',
        description: 'เคลื่อนไหวร่างกายอย่างช้า ๆ',
        time: '30 วินาที',
    },
];

export default function ExerciseScreen() {
    const params = useLocalSearchParams();
    const painArea = typeof params.area === 'string' ? params.area : 'คอ';
    const painLevel = typeof params.level === 'string' ? params.level : '-';
    const painType = typeof params.type === 'string' ? params.type : '-';

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const recommendedExercises = exercisesDatabase[painArea] || defaultExercises;

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/record' as any);
        }
    };

    const handleStart = () => {
        if (selectedIndex === null) {
            Alert.alert('ยังไม่ได้เลือกท่ายืด', 'กรุณาเลือกท่ายืดก่อนครับ');
            return;
        }

        router.push('/stretch' as any);
    };

    return (
        <View style={styles.container}>
            {/* ใช้ CustomHeader ควบคุมส่วนหัว */}
            <CustomHeader
                title="ท่ายืดที่แนะนำ"
                subtitle="Stretchman แนะนำให้คุณ"
                onBack={handleBack}
                rightComponent={
                    <View style={styles.headerIcon}>
                        <FontAwesome6 name="person-running" size={18} color="white" />
                    </View>
                }
            />

            {/* Selected Info */}
            <View style={styles.selectedInfo}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>จุดที่ปวด</Text>
                    <Text style={styles.infoValue}>{painArea}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>ระดับความปวด</Text>
                    <Text style={styles.infoValue}>{painLevel !== '-' ? `${painLevel}/5` : '-'}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>อาการ</Text>
                    <Text style={styles.infoValue}>{painType}</Text>
                </View>
            </View>

            {/* Recommend Title */}
            <View style={styles.recommendTitle}>
                <Text style={styles.recommendTitleText}>ท่าที่เหมาะกับคุณ</Text>
                <Text style={styles.recommendSubtitleText}>ลองเลือกท่าที่คุณต้องการทำ</Text>
            </View>

            {/* Exercise List */}
            <ScrollView
                style={styles.exerciseList}
                contentContainerStyle={styles.exerciseListContent}
                showsVerticalScrollIndicator={false}
            >
                {recommendedExercises.map((exercise, index) => {
                    const isSelected = selectedIndex === index;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.exerciseCard,
                                isSelected && styles.exerciseCardSelected,
                            ]}
                            onPress={() => setSelectedIndex(index)}
                        >
                            <View style={styles.exerciseImage}>
                                <FontAwesome6 name="person-running" size={28} color="#6d99ed" />
                            </View>

                            <View style={styles.exerciseContent}>
                                <Text style={styles.exerciseName}>{exercise.name}</Text>
                                <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                                <View style={styles.exerciseTime}>
                                    <FontAwesome6 name="clock" size={12} color="#5d86dd" />
                                    <Text style={styles.exerciseTimeText}>{exercise.time}</Text>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.exerciseCheck,
                                    isSelected && styles.exerciseCheckSelected,
                                ]}
                            >
                                {isSelected && <FontAwesome6 name="check" size={12} color="white" />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Start Button */}
            <TouchableOpacity style={styles.saveButtonWrap} onPress={handleStart}>
                <LinearGradient
                    colors={['#237FFF', '#A8CCFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveText}>เริ่มยืดกล้ามเนื้อ</Text>
                    <FontAwesome6 name="arrow-right" size={16} color="white" style={{ marginLeft: 8 }} />
                </LinearGradient>
            </TouchableOpacity>

            <BottomNav activeTab="home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1638AE',
        paddingHorizontal: 20,
        paddingTop: 10,
        justifyContent: 'space-between',
        paddingBottom: 15,
    },
    headerIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedInfo: {
        flexDirection: 'row',
        gap: 7,
        marginTop: 10,
        marginBottom: 10,
    },
    infoItem: {
        flex: 1,
        minHeight: 65,
        padding: 8,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoLabel: {
        fontSize: 9,
        color: 'rgba(255,255,255,0.7)',
    },
    infoValue: {
        marginTop: 3,
        fontSize: 13,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    recommendTitle: {
        marginBottom: 8,
    },
    recommendTitleText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    recommendSubtitleText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        marginTop: 2,
    },
    exerciseList: {
        flex: 1,
        marginBottom: 8,
    },
    exerciseListContent: {
        gap: 10,
        paddingBottom: 5,
    },
    exerciseCard: {
        minHeight: 90,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    exerciseCardSelected: {
        borderColor: '#66a0ff',
        backgroundColor: '#eef4ff',
    },
    exerciseImage: {
        width: 72,
        height: 72,
        borderRadius: 15,
        backgroundColor: '#dce9ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    exerciseContent: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#153c91',
    },
    exerciseDescription: {
        fontSize: 10,
        color: '#777',
        marginVertical: 3,
    },
    exerciseTime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    exerciseTimeText: {
        fontSize: 10,
        color: '#5d86dd',
    },
    exerciseCheck: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        borderWidth: 2,
        borderColor: '#8eb0f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    exerciseCheckSelected: {
        backgroundColor: '#2360e8',
        borderColor: '#2360e8',
    },
    saveButtonWrap: {
        width: '100%',
        marginTop: 3,
        marginBottom: 12,
    },
    saveButton: {
        height: 52,
        borderRadius: 27,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});