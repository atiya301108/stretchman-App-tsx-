import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import BottomNav from './components/BottomNav';
import CustomHeader from './components/CustomHeader';

const hotspotsData = [
    { id: 'neck', label: 'คอ', top: '17%', left: '50%' },
    { id: 'shoulder-left', label: 'ไหล่ซ้าย', top: '22%', left: '40%' },
    { id: 'shoulder-right', label: 'ไหล่ขวา', top: '22%', left: '60%' },
    { id: 'upper-back', label: 'หลังส่วนบน', top: '27%', left: '50%' },
    { id: 'lower-back', label: 'หลังส่วนล่าง', top: '37%', left: '50%' },
    { id: 'waist', label: 'เอว', top: '45%', left: '50%' },
    { id: 'knee-left', label: 'เข่าซ้าย', top: '72%', left: '44%' },
    { id: 'knee-right', label: 'เข่าขวา', top: '72%', left: '56%' },
];

export default function PainScreen() {
    const [selectedArea, setSelectedArea] = useState<string | null>(null);

    const handleNext = () => {
        if (!selectedArea) {
            alert('กรุณาเลือกบริเวณที่ปวดก่อนครับ');
            return;
        }

        router.push({
            pathname: '/record',
            params: {
                area: selectedArea,
            },
        } as any);
    };

    return (
        <View style={styles.container}>
            {/* แก้ไขตรง onBack ให้พาร์ทเป็นตัวพิมพ์เล็กทั้งหมด */}
            <CustomHeader 
                title="Choose Pain Area" 
                subtitle="เลือกบริเวณที่คุณรู้สึกปวด"
                onBack={() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        // ปรับเป็น /homescreen (ตัวเล็ก)
                        router.replace('/homescreen');
                    }
                }}
            />

            {/* Body Map Section */}
            <View style={styles.bodyMapContainer}>
                <Image 
                    source={require('../../assets/images/back.png')} 
                    style={styles.bodyImage} 
                    resizeMode="contain" 
                />
                
                {/* Hotspots */}
                {hotspotsData.map((spot) => (
                    <TouchableOpacity
                        key={spot.id}
                        style={[
                            styles.hotspot, 
                            { top: spot.top, left: spot.left } as any,
                            selectedArea === spot.label && styles.hotspotSelected
                        ]}
                        onPress={() => setSelectedArea(spot.label)}
                    >
                        <View style={styles.hotspotInner} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* ส่วนล่าง: Card แสดงผล + ปุ่มถัดไป + เมนูด้านล่าง */}
            <View style={styles.bottomSection}>
                <View style={styles.selectedAreaCard}>
                    <Text style={styles.labelSmall}>บริเวณที่เลือก</Text>
                    <Text style={styles.selectedText}>{selectedArea || 'ยังไม่ได้เลือก'}</Text>
                </View>

                <TouchableOpacity onPress={handleNext} style={styles.nextButtonWrap}>
                    <LinearGradient
                        colors={['#237FFF', '#A8CCFF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextText}>ถัดไป</Text>
                        <FontAwesome6 name="arrow-right" size={16} color="white" />
                    </LinearGradient>
                </TouchableOpacity>

                {/* แถบเมนูด้านล่าง */}
                <BottomNav activeTab="home" />
            </View>
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
    bodyMapContainer: {
        flex: 1,
        width: '100%',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
    },
    bodyImage: {
        width: '100%',
        height: '100%',
    },
    hotspot: {
        position: 'absolute',
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(33, 72, 192, 0.55)',
        borderWidth: 3,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -14,
        marginTop: -14,
    },
    hotspotInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    hotspotSelected: {
        backgroundColor: '#ff4d67',
        borderColor: 'white',
    },
    bottomSection: {
        gap: 12,
    },
    selectedAreaCard: {
        backgroundColor: 'white',
        borderRadius: 22,
        padding: 15,
    },
    labelSmall: {
        fontSize: 12,
        color: '#777',
    },
    selectedText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2148C0',
        marginTop: 2,
    },
    nextButtonWrap: {
        width: '100%',
    },
    nextButton: {
        height: 52,
        borderRadius: 26,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    nextText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});