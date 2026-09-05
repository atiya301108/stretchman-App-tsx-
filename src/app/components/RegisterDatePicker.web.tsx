import React, { useState } from 'react';

interface RegisterDatePickerProps {
    value: Date;
    onChange: (date: Date) => void;
    maximumDate?: Date;
    onDone?: () => void;
}

export default function RegisterDatePickerWeb({
    value,
    onChange,
    maximumDate,
    onDone,
}: RegisterDatePickerProps) {

    // ป้องกัน value เป็น undefined
    const safeValue =
        value instanceof Date
            ? value
            : new Date();

    const [selectedDay, setSelectedDay] =
        useState(safeValue.getDate());

    const [selectedMonth, setSelectedMonth] =
        useState(safeValue.getMonth() + 1);

    const [selectedYear, setSelectedYear] =
        useState(safeValue.getFullYear());


    // ==========================================
    // MONTHS
    // ==========================================

    const months = [
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม',
    ];


    // ==========================================
    // YEARS
    // ==========================================

    const currentYear =
        maximumDate instanceof Date
            ? maximumDate.getFullYear()
            : new Date().getFullYear();

    const years = Array.from(
        { length: 101 },
        (_, index) =>
            currentYear - index
    );


    // ==========================================
    // DAYS IN MONTH
    // ==========================================

    const getDaysInMonth = (
        year: number,
        month: number
    ) => {
        return new Date(
            year,
            month,
            0
        ).getDate();
    };


    const daysInMonth =
        getDaysInMonth(
            selectedYear,
            selectedMonth
        );


    // ==========================================
    // CREATE DATE
    // ==========================================

    const makeDate = (
        day: number,
        month: number,
        year: number
    ) => {

        const maxDay =
            getDaysInMonth(
                year,
                month
            );

        const safeDay =
            Math.min(day, maxDay);

        return new Date(
            year,
            month - 1,
            safeDay
        );
    };


    // ==========================================
    // DAY
    // ==========================================

    const handleDayChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const day =
            Number(event.target.value);

        setSelectedDay(day);

        onChange(
            makeDate(
                day,
                selectedMonth,
                selectedYear
            )
        );
    };


    // ==========================================
    // MONTH
    // ==========================================

    const handleMonthChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const month =
            Number(event.target.value);

        const maxDay =
            getDaysInMonth(
                selectedYear,
                month
            );

        const safeDay =
            Math.min(
                selectedDay,
                maxDay
            );

        setSelectedMonth(month);
        setSelectedDay(safeDay);

        onChange(
            makeDate(
                safeDay,
                month,
                selectedYear
            )
        );
    };


    // ==========================================
    // YEAR
    // ==========================================

    const handleYearChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const year =
            Number(event.target.value);

        const maxDay =
            getDaysInMonth(
                year,
                selectedMonth
            );

        const safeDay =
            Math.min(
                selectedDay,
                maxDay
            );

        setSelectedYear(year);
        setSelectedDay(safeDay);

        onChange(
            makeDate(
                safeDay,
                selectedMonth,
                year
            )
        );
    };


    // ==========================================
    // SAVE
    // ==========================================

    const handleDone = () => {

        const finalDate =
            makeDate(
                selectedDay,
                selectedMonth,
                selectedYear
            );

        onChange(finalDate);

        if (onDone) {
            onDone();
        }
    };


    // ==========================================
    // UI
    // ==========================================

    return (
        <div style={styles.overlay}>

            <div style={styles.container}>

                <h2 style={styles.title}>
                    เลือกวันเกิด
                </h2>

                <p style={styles.subtitle}>
                    เลือกวัน เดือน และปี แล้วกดบันทึก
                </p>


                <div style={styles.selectRow}>

                    {/* วัน */}
                    <div style={styles.selectGroup}>
                        <label style={styles.label}>
                            วัน
                        </label>

                        <select
                            value={selectedDay}
                            onChange={handleDayChange}
                            style={styles.select}
                        >
                            {Array.from(
                                {
                                    length: daysInMonth,
                                },
                                (_, index) =>
                                    index + 1
                            ).map((day) => (

                                <option
                                    key={day}
                                    value={day}
                                >
                                    {String(day).padStart(2, '0')}
                                </option>

                            ))}
                        </select>
                    </div>


                    {/* เดือน */}
                    <div style={styles.selectGroup}>
                        <label style={styles.label}>
                            เดือน
                        </label>

                        <select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            style={styles.select}
                        >
                            {months.map(
                                (month, index) => (

                                    <option
                                        key={index + 1}
                                        value={index + 1}
                                    >
                                        {month}
                                    </option>

                                )
                            )}
                        </select>
                    </div>


                    {/* ปี */}
                    <div
                        style={{
                            ...styles.selectGroup,
                            flex: 1.2,
                        }}
                    >
                        <label style={styles.label}>
                            ปี
                        </label>

                        <select
                            value={selectedYear}
                            onChange={handleYearChange}
                            style={styles.select}
                        >
                            {years.map((year) => (

                                <option
                                    key={year}
                                    value={year}
                                >
                                    {year}
                                </option>

                            ))}
                        </select>
                    </div>

                </div>


                {/* PREVIEW */}

                <div style={styles.preview}>
                    {String(selectedDay).padStart(2, '0')}
                    /
                    {String(selectedMonth).padStart(2, '0')}
                    /
                    {selectedYear}
                </div>


                {/* SAVE */}

                <button
                    onClick={handleDone}
                    style={styles.saveButton}
                >
                    บันทึก
                </button>

            </div>

        </div>
    );
}


// ======================================================
// STYLES
// ======================================================

const styles: {
    [key: string]: React.CSSProperties;
} = {

    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },

    container: {
        width: '360px',
        maxWidth: '90%',
        backgroundColor: '#111827',
        borderRadius: '20px',
        padding: '24px',
        boxSizing: 'border-box',
        boxShadow:
            '0 10px 35px rgba(0,0,0,0.35)',
    },

    title: {
        color: '#ffffff',
        fontSize: '20px',
        textAlign: 'center',
        margin: 0,
        marginBottom: '6px',
    },

    subtitle: {
        color: '#9CA3AF',
        fontSize: '12px',
        textAlign: 'center',
        marginTop: 0,
        marginBottom: '22px',
    },

    selectRow: {
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-end',
    },

    selectGroup: {
        flex: 1,
    },

    label: {
        display: 'block',
        color: '#D1D5DB',
        fontSize: '12px',
        fontWeight: 600,
        marginBottom: '7px',
    },

    select: {
        width: '100%',
        height: '44px',
        borderRadius: '8px',
        border: '1px solid #374151',
        backgroundColor: '#1F2937',
        color: '#ffffff',
        padding: '0 8px',
        fontSize: '13px',
        outline: 'none',
        boxSizing: 'border-box',
        cursor: 'pointer',
    },

    preview: {
        textAlign: 'center',
        color: '#60A5FA',
        fontSize: '20px',
        fontWeight: 'bold',
        marginTop: '22px',
        marginBottom: '18px',
    },

    saveButton: {
        width: '100%',
        height: '46px',
        border: 'none',
        borderRadius: '10px',
        backgroundColor: '#3B82F6',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
};