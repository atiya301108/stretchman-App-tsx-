import React, {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Switch,
    TextInput,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Platform,
} from 'react-native';

import { FontAwesome6 } from '@expo/vector-icons';

import {
    useRouter,
    useLocalSearchParams,
} from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';


// ======================================================
// CONSTANTS
// ======================================================

const ITEM_HEIGHT = 50;

const CONTAINER_HEIGHT = 180;

const PADDING_VERTICAL =
    (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;


// ======================================================
// INTERFACE
// ======================================================

interface DayItem {
    id: string;
    label: string;
}

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


// ======================================================
// DAYS
// ======================================================

const DAYS: DayItem[] = [
    {
        id: 'sun',
        label: 'อา',
    },
    {
        id: 'mon',
        label: 'จ',
    },
    {
        id: 'tue',
        label: 'อ',
    },
    {
        id: 'wed',
        label: 'พ',
    },
    {
        id: 'thu',
        label: 'พฤ',
    },
    {
        id: 'fri',
        label: 'ศ',
    },
    {
        id: 'sat',
        label: 'ส',
    },
];


// ======================================================
// COMPONENT
// ======================================================

export default function AddAlarmScreen() {

    const router = useRouter();

    // ==================================================
    // GET ID FROM ROUTE
    // ==================================================

    const { id } =
        useLocalSearchParams<{
            id?: string;
        }>();

    const isEditMode =
        typeof id === 'string' &&
        id.length > 0;


    // ==================================================
    // TIME LIST
    // ==================================================

    const hoursList = Array.from(
        { length: 24 },
        (_, i) =>
            String(i).padStart(2, '0')
    );

    const minutesList = Array.from(
        { length: 60 },
        (_, i) =>
            String(i).padStart(2, '0')
    );


    // ==================================================
    // STATES
    // ==================================================

    const [
        selectedHour,
        setSelectedHour,
    ] = useState('06');

    const [
        selectedMinute,
        setSelectedMinute,
    ] = useState('00');

    const [
        alarmName,
        setAlarmName,
    ] = useState('');

    const [
        selectedDays,
        setSelectedDays,
    ] = useState<string[]>([
        'sun',
        'mon',
        'tue',
        'wed',
        'thu',
        'fri',
        'sat',
    ]);

    const [
        soundOn,
        setSoundOn,
    ] = useState(true);

    const [
        vibrateOn,
        setVibrateOn,
    ] = useState(true);

    const [
        snoozeOn,
        setSnoozeOn,
    ] = useState(true);


    // ==================================================
    // REFS
    // ==================================================

    const hourScrollRef =
        useRef<ScrollView>(null);

    const minuteScrollRef =
        useRef<ScrollView>(null);


    // ==================================================
    // LOAD ALARM WHEN EDITING
    // ==================================================

    useEffect(() => {

        if (!isEditMode) {
            return;
        }

        const loadAlarmForEdit =
            async () => {

                try {

                    const stored =
                        await AsyncStorage.getItem(
                            'stretchmanAlarms'
                        );

                    if (!stored) {
                        return;
                    }

                    const alarms: AlarmItem[] =
                        JSON.parse(stored);

                    const alarm =
                        alarms.find(
                            (item) =>
                                item.id === id
                        );

                    if (!alarm) {
                        return;
                    }


                    // ==================================
                    // TIME
                    // ==================================

                    const [
                        hour,
                        minute,
                    ] = alarm.time.split(':');

                    setSelectedHour(
                        hour || '06'
                    );

                    setSelectedMinute(
                        minute || '00'
                    );


                    // ==================================
                    // NAME
                    // ==================================

                    setAlarmName(
                        alarm.exercise || ''
                    );


                    // ==================================
                    // DAYS
                    // ==================================

                    setSelectedDays(
                        alarm.days || []
                    );


                    // ==================================
                    // SETTINGS
                    // ==================================

                    setSoundOn(
                        alarm.soundEnabled ??
                        true
                    );

                    setVibrateOn(
                        alarm.vibrationEnabled ??
                        true
                    );

                    setSnoozeOn(
                        alarm.snoozeEnabled ??
                        true
                    );

                } catch (error) {

                    console.log(
                        'Failed to load alarm for editing:',
                        error
                    );

                }
            };

        loadAlarmForEdit();

    }, [id, isEditMode]);


    // ==================================================
    // MOVE PICKER TO CURRENT TIME
    // ==================================================

    useEffect(() => {

        if (!isEditMode) {
            return;
        }

        const timer =
            setTimeout(() => {

                const hourIndex =
                    hoursList.indexOf(
                        selectedHour
                    );

                const minuteIndex =
                    minutesList.indexOf(
                        selectedMinute
                    );


                if (hourIndex >= 0) {

                    hourScrollRef.current?.scrollTo({
                        y:
                            hourIndex *
                            ITEM_HEIGHT,

                        animated: false,
                    });

                }


                if (minuteIndex >= 0) {

                    minuteScrollRef.current?.scrollTo({
                        y:
                            minuteIndex *
                            ITEM_HEIGHT,

                        animated: false,
                    });

                }

            }, 150);

        return () =>
            clearTimeout(timer);

    }, [
        isEditMode,
        selectedHour,
        selectedMinute,
    ]);


    // ==================================================
    // INITIAL POSITION FOR NEW ALARM
    // ==================================================

    useEffect(() => {

        if (isEditMode) {
            return;
        }

        const timer =
            setTimeout(() => {

                hourScrollRef.current?.scrollTo({
                    y: 6 * ITEM_HEIGHT,
                    animated: false,
                });

                minuteScrollRef.current?.scrollTo({
                    y: 0,
                    animated: false,
                });

            }, 100);

        return () =>
            clearTimeout(timer);

    }, [isEditMode]);


    // ==================================================
    // DAY SELECTION
    // ==================================================

    const toggleDaySelection =
        (dayId: string) => {

            setSelectedDays(
                (current) => {

                    if (
                        current.includes(
                            dayId
                        )
                    ) {

                        return current.filter(
                            (day) =>
                                day !== dayId
                        );

                    }

                    return [
                        ...current,
                        dayId,
                    ];

                }
            );

        };


    // ==================================================
    // SNAP PICKER
    // ==================================================

    const handleScrollEnd = (
        e: NativeSyntheticEvent<NativeScrollEvent>,
        list: string[],
        setter: (
            value: string
        ) => void,
        scrollRef: React.RefObject<
            ScrollView | null
        >
    ) => {

        const offsetY =
            e.nativeEvent.contentOffset.y;


        let index =
            Math.round(
                offsetY / ITEM_HEIGHT
            );


        index = Math.max(
            0,
            Math.min(
                index,
                list.length - 1
            )
        );


        const targetY =
            index * ITEM_HEIGHT;


        setter(
            list[index]
        );


        if (
            Math.abs(
                offsetY - targetY
            ) > 0.5
        ) {

            scrollRef.current?.scrollTo({
                y: targetY,
                animated: true,
            });

        }

    };


    // ==================================================
    // SAVE / UPDATE ALARM
    // ==================================================

    const handleSaveAlarm =
        async () => {

            try {

                const stored =
                    await AsyncStorage.getItem(
                        'stretchmanAlarms'
                    );

                const currentAlarms: AlarmItem[] =
                    stored
                        ? JSON.parse(stored)
                        : [];


                // =====================================
                // CREATE ALARM DATA
                // =====================================

                const alarmData = {

                    time:
                        `${selectedHour}:${selectedMinute}`,

                    period:
                        Number(selectedHour) >= 12
                            ? 'PM'
                            : 'AM',

                    exercise:
                        alarmName.trim() ||
                        'ยืดเหยียดร่างกาย',

                    days:
                        selectedDays,

                    soundEnabled:
                        soundOn,

                    vibrationEnabled:
                        vibrateOn,

                    snoozeEnabled:
                        snoozeOn,

                };


                // =====================================
                // EDIT EXISTING ALARM
                // =====================================

                if (isEditMode) {

                    const updatedAlarms =
                        currentAlarms.map(
                            (alarm) =>

                                alarm.id === id
                                    ? {
                                        ...alarm,
                                        ...alarmData,
                                        id: id,
                                    }
                                    : alarm
                        );


                    await AsyncStorage.setItem(
                        'stretchmanAlarms',
                        JSON.stringify(
                            updatedAlarms
                        )
                    );


                    router.back();

                    return;
                }


                // =====================================
                // CREATE NEW ALARM
                // =====================================

                const newAlarmItem:
                    AlarmItem = {

                    id:
                        Date.now().toString(),

                    ...alarmData,

                    enabled:
                        true,

                };


                const updatedAlarms = [
                    ...currentAlarms,
                    newAlarmItem,
                ];


                await AsyncStorage.setItem(
                    'stretchmanAlarms',
                    JSON.stringify(
                        updatedAlarms
                    )
                );


                router.back();

            } catch (error) {

                console.log(
                    'Failed to save alarm:',
                    error
                );

            }

        };


    // ==================================================
    // FORMAT SELECTED DAYS
    // ==================================================

    const getSelectedDaysText =
        () => {

            if (
                selectedDays.length === 7
            ) {

                return 'ทุกวัน';

            }


            if (
                selectedDays.length === 0
            ) {

                return 'ไม่เลือกวัน';

            }


            return DAYS
                .filter(
                    (day) =>
                        selectedDays.includes(
                            day.id
                        )
                )
                .map(
                    (day) =>
                        day.label
                )
                .join(' · ');

        };


    // ==================================================
    // UI
    // ==================================================

    return (

        <View style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.contentContainer
                }
            >

                {/* ==========================================
                    HEADER
                ========================================== */}

                <View
                    style={styles.header}
                >

                    <TouchableOpacity
                        style={
                            styles.headerButton
                        }
                        onPress={() =>
                            router.back()
                        }
                    >

                        <FontAwesome6
                            name="arrow-left"
                            size={18}
                            color="white"
                        />

                    </TouchableOpacity>


                    <View
                        style={
                            styles.headerTitleArea
                        }
                    >

                        <Text
                            style={
                                styles.headerTitle
                            }
                        >
                            {isEditMode
                                ? 'แก้ไขการเตือน'
                                : 'ตั้งปลุก'}
                        </Text>

                        <Text
                            style={
                                styles.headerSubtitle
                            }
                        >
                            {isEditMode
                                ? 'แก้ไขรายละเอียดการแจ้งเตือน'
                                : 'ตั้งเวลาเตือนการยืดกล้ามเนื้อ'}
                        </Text>

                    </View>

                </View>


                {/* ==========================================
                    TIME PREVIEW
                ========================================== */}

                <View
                    style={
                        styles.timePreview
                    }
                >

                    <Text
                        style={
                            styles.timePreviewText
                        }
                    >
                        {selectedHour}:
                        {selectedMinute}
                    </Text>

                    <Text
                        style={
                            styles.timePreviewSub
                        }
                    >
                        เวลาที่ตั้งไว้
                    </Text>

                </View>


                {/* ==========================================
                    TIME PICKER
                ========================================== */}

                <View
                    style={
                        styles.wheelContainer
                    }
                >

                    <View
                        style={
                            styles.selectedHighlightBar
                        }
                        pointerEvents="none"
                    />


                    {/* HOURS */}

                    <View
                        style={
                            styles.wheelColumn
                        }
                    >

                        <ScrollView
                            ref={
                                hourScrollRef
                            }
                            showsVerticalScrollIndicator={
                                false
                            }
                            snapToInterval={
                                ITEM_HEIGHT
                            }
                            snapToAlignment="start"
                            decelerationRate="fast"
                            disableIntervalMomentum={
                                true
                            }
                            overScrollMode="never"
                            onMomentumScrollEnd={(
                                e
                            ) =>
                                handleScrollEnd(
                                    e,
                                    hoursList,
                                    setSelectedHour,
                                    hourScrollRef
                                )
                            }
                            contentContainerStyle={{
                                paddingVertical:
                                    PADDING_VERTICAL,
                            }}
                        >

                            {hoursList.map(
                                (hour) => (

                                    <View
                                        key={hour}
                                        style={
                                            styles.wheelItemContainer
                                        }
                                    >

                                        <Text
                                            style={[
                                                styles.wheelItem,
                                                selectedHour ===
                                                    hour &&
                                                styles.wheelItemActive,
                                            ]}
                                        >
                                            {hour}
                                        </Text>

                                    </View>

                                )
                            )}

                        </ScrollView>

                    </View>


                    {/* COLON */}

                    <Text
                        style={
                            styles.wheelColon
                        }
                    >
                        :
                    </Text>


                    {/* MINUTES */}

                    <View
                        style={
                            styles.wheelColumn
                        }
                    >

                        <ScrollView
                            ref={
                                minuteScrollRef
                            }
                            showsVerticalScrollIndicator={
                                false
                            }
                            snapToInterval={
                                ITEM_HEIGHT
                            }
                            snapToAlignment="start"
                            decelerationRate="fast"
                            disableIntervalMomentum={
                                true
                            }
                            overScrollMode="never"
                            onMomentumScrollEnd={(
                                e
                            ) =>
                                handleScrollEnd(
                                    e,
                                    minutesList,
                                    setSelectedMinute,
                                    minuteScrollRef
                                )
                            }
                            contentContainerStyle={{
                                paddingVertical:
                                    PADDING_VERTICAL,
                            }}
                        >

                            {minutesList.map(
                                (minute) => (

                                    <View
                                        key={minute}
                                        style={
                                            styles.wheelItemContainer
                                        }
                                    >

                                        <Text
                                            style={[
                                                styles.wheelItem,
                                                selectedMinute ===
                                                    minute &&
                                                styles.wheelItemActive,
                                            ]}
                                        >
                                            {minute}
                                        </Text>

                                    </View>

                                )
                            )}

                        </ScrollView>

                    </View>

                </View>


                {/* ==========================================
                    SETTINGS CARD
                ========================================== */}

                <View
                    style={
                        styles.cardContainer
                    }
                >

                    {/* DAYS HEADER */}

                    <View
                        style={
                            styles.sectionHeader
                        }
                    >

                        <View>

                            <Text
                                style={
                                    styles.sectionTitle
                                }
                            >
                                วัน
                            </Text>

                            <Text
                                style={
                                    styles.sectionSubtitle
                                }
                            >
                                {
                                    getSelectedDaysText()
                                }
                            </Text>

                        </View>

                        <FontAwesome6
                            name="calendar"
                            size={18}
                            color="#94a3b8"
                        />

                    </View>


                    {/* DAYS */}

                    <View
                        style={
                            styles.daysRow
                        }
                    >

                        {DAYS.map(
                            (day) => {

                                const selected =
                                    selectedDays.includes(
                                        day.id
                                    );

                                return (

                                    <TouchableOpacity
                                        key={
                                            day.id
                                        }
                                        activeOpacity={
                                            0.7
                                        }
                                        onPress={() =>
                                            toggleDaySelection(
                                                day.id
                                            )
                                        }
                                        style={[
                                            styles.dayBadge,
                                            selected &&
                                            styles.dayBadgeActive,
                                        ]}
                                    >

                                        <Text
                                            style={[
                                                styles.dayText,
                                                selected &&
                                                styles.dayTextActive,
                                            ]}
                                        >
                                            {
                                                day.label
                                            }
                                        </Text>

                                    </TouchableOpacity>

                                );

                            }
                        )}

                    </View>


                    {/* ==========================================
                        ALARM NAME
                    ========================================== */}

                    <View
                        style={
                            styles.inputGroup
                        }
                    >

                        <FontAwesome6
                            name="pen"
                            size={15}
                            color="#64748b"
                        />

                        <TextInput
                            style={
                                styles.inputText
                            }
                            value={
                                alarmName
                            }
                            onChangeText={
                                setAlarmName
                            }
                            placeholder="ชื่อการเตือน"
                            placeholderTextColor="#64748b"
                            returnKeyType="done"
                        />

                    </View>


                    {/* ==========================================
                        SOUND
                    ========================================== */}

                    <View
                        style={
                            styles.settingRow
                        }
                    >

                        <View
                            style={
                                styles.settingLeft
                            }
                        >

                            <View
                                style={
                                    styles.settingIcon
                                }
                            >

                                <FontAwesome6
                                    name="volume-high"
                                    size={15}
                                    color="#ff9800"
                                />

                            </View>

                            <View>

                                <Text
                                    style={
                                        styles.settingLabel
                                    }
                                >
                                    เสียง
                                </Text>

                                <Text
                                    style={
                                        styles.settingSub
                                    }
                                >
                                    เปิดเสียงเมื่อถึงเวลา
                                </Text>

                            </View>

                        </View>

                        <Switch
                            value={
                                soundOn
                            }
                            onValueChange={
                                setSoundOn
                            }
                            trackColor={{
                                false: '#334155',
                                true: '#ff9800',
                            }}
                            thumbColor="#ffffff"
                        />

                    </View>


                    {/* ==========================================
                        VIBRATION
                    ========================================== */}

                    <View
                        style={
                            styles.settingRow
                        }
                    >

                        <View
                            style={
                                styles.settingLeft
                            }
                        >

                            <View
                                style={
                                    styles.settingIcon
                                }
                            >

                                <FontAwesome6
                                    name="mobile-screen-button"
                                    size={15}
                                    color="#ff9800"
                                />

                            </View>

                            <View>

                                <Text
                                    style={
                                        styles.settingLabel
                                    }
                                >
                                    ระบบสั่น
                                </Text>

                                <Text
                                    style={
                                        styles.settingSub
                                    }
                                >
                                    สั่นเมื่อถึงเวลา
                                </Text>

                            </View>

                        </View>

                        <Switch
                            value={
                                vibrateOn
                            }
                            onValueChange={
                                setVibrateOn
                            }
                            trackColor={{
                                false: '#334155',
                                true: '#ff9800',
                            }}
                            thumbColor="#ffffff"
                        />

                    </View>


                    {/* ==========================================
                        SNOOZE
                    ========================================== */}

                    <View
                        style={
                            styles.settingRow
                        }
                    >

                        <View
                            style={
                                styles.settingLeft
                            }
                        >

                            <View
                                style={
                                    styles.settingIcon
                                }
                            >

                                <FontAwesome6
                                    name="clock"
                                    size={15}
                                    color="#ff9800"
                                />

                            </View>

                            <View>

                                <Text
                                    style={
                                        styles.settingLabel
                                    }
                                >
                                    เลื่อนปลุก
                                </Text>

                                <Text
                                    style={
                                        styles.settingSub
                                    }
                                >
                                    เลื่อนออกไป 5 นาที
                                </Text>

                            </View>

                        </View>

                        <Switch
                            value={
                                snoozeOn
                            }
                            onValueChange={
                                setSnoozeOn
                            }
                            trackColor={{
                                false: '#334155',
                                true: '#ff9800',
                            }}
                            thumbColor="#ffffff"
                        />

                    </View>

                </View>

            </ScrollView>


            {/* ==========================================
                BOTTOM ACTION
            ========================================== */}

            <View
                style={
                    styles.bottomActions
                }
            >

                <TouchableOpacity
                    style={
                        styles.cancelBtn
                    }
                    activeOpacity={0.7}
                    onPress={() =>
                        router.back()
                    }
                >

                    <Text
                        style={
                            styles.cancelText
                        }
                    >
                        ยกเลิก
                    </Text>

                </TouchableOpacity>


                <View
                    style={
                        styles.dividerVertical
                    }
                />


                <TouchableOpacity
                    style={
                        styles.saveBtn
                    }
                    activeOpacity={0.7}
                    onPress={
                        handleSaveAlarm
                    }
                >

                    <FontAwesome6
                        name="check"
                        size={15}
                        color="#ff9800"
                    />

                    <Text
                        style={
                            styles.saveText
                        }
                    >
                        {isEditMode
                            ? 'บันทึกการแก้ไข'
                            : 'บันทึก'}
                    </Text>

                </TouchableOpacity>

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
        backgroundColor: '#121212',
    },

    contentContainer: {
        paddingBottom: 120,
    },

    // ==================================================
    // HEADER
    // ==================================================

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop:
            Platform.OS === 'ios'
                ? 55
                : 25,
        paddingBottom: 5,
    },

    headerButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#23232f',
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerTitleArea: {
        marginLeft: 12,
    },

    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },

    headerSubtitle: {
        color: '#64748b',
        fontSize: 11,
        marginTop: 2,
    },

    // ==================================================
    // TIME
    // ==================================================

    timePreview: {
        alignItems: 'center',
        marginTop: 12,
    },

    timePreviewText: {
        color: '#ffffff',
        fontSize: 42,
        fontWeight: '300',
        letterSpacing: 2,
    },

    timePreviewSub: {
        color: '#64748b',
        fontSize: 11,
        marginTop: 2,
    },

    // ==================================================
    // WHEEL
    // ==================================================

    wheelContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: CONTAINER_HEIGHT,
        marginTop: 5,
        position: 'relative',
    },

    selectedHighlightBar: {
        position: 'absolute',
        height: ITEM_HEIGHT,
        left: 55,
        right: 55,
        backgroundColor:
            'rgba(255,255,255,0.07)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor:
            'rgba(255,255,255,0.05)',
    },

    wheelColumn: {
        width: 85,
        height: CONTAINER_HEIGHT,
    },

    wheelItemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },

    wheelItem: {
        fontSize: 32,
        color: '#475569',
        fontWeight: '300',
    },

    wheelItemActive: {
        color: '#ffffff',
        fontSize: 38,
        fontWeight: 'bold',
    },

    wheelColon: {
        fontSize: 36,
        color: '#ffffff',
        fontWeight: 'bold',
        marginHorizontal: 7,
        marginBottom: 3,
    },

    // ==================================================
    // CARD
    // ==================================================

    cardContainer: {
        backgroundColor: '#181820',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 22,
        paddingTop: 22,
        paddingBottom: 15,
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },

    sectionTitle: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },

    sectionSubtitle: {
        color: '#64748b',
        fontSize: 11,
        marginTop: 3,
    },

    // ==================================================
    // DAYS
    // ==================================================

    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    dayBadge: {
        width: 39,
        height: 39,
        borderRadius: 20,
        backgroundColor: '#23232f',
        justifyContent: 'center',
        alignItems: 'center',
    },

    dayBadgeActive: {
        backgroundColor: '#ff9800',
    },

    dayText: {
        color: '#94a3b8',
        fontSize: 11,
        fontWeight: '600',
    },

    dayTextActive: {
        color: '#ffffff',
        fontWeight: 'bold',
    },

    // ==================================================
    // INPUT
    // ==================================================

    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a38',
        paddingBottom: 10,
        marginBottom: 5,
    },

    inputText: {
        flex: 1,
        color: '#ffffff',
        fontSize: 14,
    },

    // ==================================================
    // SETTINGS
    // ==================================================

    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#23232f',
    },

    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    settingIcon: {
        width: 35,
        height: 35,
        borderRadius: 18,
        backgroundColor:
            'rgba(255,152,0,0.10)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 11,
    },

    settingLabel: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },

    settingSub: {
        color: '#64748b',
        fontSize: 10,
        marginTop: 3,
    },

    // ==================================================
    // BOTTOM
    // ==================================================

    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        flexDirection: 'row',
        backgroundColor: '#0b0b0e',
        borderTopWidth: 1,
        borderTopColor: '#22222e',
    },

    cancelBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    cancelText: {
        color: '#94a3b8',
        fontSize: 15,
        fontWeight: '600',
    },

    dividerVertical: {
        width: 1,
        backgroundColor: '#22222e',
        marginVertical: 15,
    },

    saveBtn: {
        flex: 1,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    saveText: {
        color: '#ff9800',
        fontSize: 15,
        fontWeight: 'bold',
    },

});