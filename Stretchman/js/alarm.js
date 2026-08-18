/* =========================================
   STRETCHMAN ALARM SYSTEM
========================================= */

const alarmTime =
    document.getElementById("alarmTime");

const alarmLabel =
    document.getElementById("alarmLabel");

const addAlarmBtn =
    document.getElementById("addAlarmBtn");

const alarmList =
    document.getElementById("alarmList");

const emptyAlarm =
    document.getElementById("emptyAlarm");

const alarmCount =
    document.getElementById("alarmCount");

const dayButtons =
    document.querySelectorAll(".day-btn");


/* =========================================
   DATA
========================================= */

let alarms =
    JSON.parse(
        localStorage.getItem("stretchmanAlarms")
    ) || [];


/*
    วันอาทิตย์ = 0
    จันทร์ = 1
    ...
*/

let selectedDays = [];


/* =========================================
   DAY SELECT
========================================= */

dayButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const day =
                Number(
                    button.dataset.day
                );


            if (
                selectedDays.includes(day)
            ) {

                selectedDays =
                    selectedDays.filter(
                        d => d !== day
                    );

                button.classList.remove(
                    "selected"
                );

            } else {

                selectedDays.push(day);

                button.classList.add(
                    "selected"
                );

            }

        }
    );

});


/* =========================================
   ADD ALARM
========================================= */

addAlarmBtn.addEventListener(
    "click",
    () => {

        const time =
            alarmTime.value.trim();

        const label =
            alarmLabel.value.trim();


        if (!time) {

            alert(
                "กรุณาเลือกเวลา"
            );

            return;

        }


        /*
            ถ้าไม่ได้เลือกวัน
            ให้ถือว่าเตือนทุกวัน
        */

        let days =
            [...selectedDays];


        if (days.length === 0) {

            days =
                [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                ];

        }


        const newAlarm = {

            id:
                Date.now(),

            time:
                time,

            label:
                label ||
                "เวลายืดกล้ามเนื้อ",

            days:
                days,

            enabled:
                true

        };


        alarms.push(
            newAlarm
        );


        saveAlarms();

        renderAlarms();


        /*
            ล้างช่อง
        */

        alarmTime.value = "";

        alarmLabel.value = "";

        selectedDays = [];


        dayButtons.forEach(
            button => {

                button.classList.remove(
                    "selected"
                );

            }
        );


        alert(
            "เพิ่มการแจ้งเตือนเรียบร้อยแล้ว 🔔"
        );

    }
);


/* =========================================
   SAVE
========================================= */

function saveAlarms() {

    localStorage.setItem(
        "stretchmanAlarms",
        JSON.stringify(alarms)
    );

}


/* =========================================
   DAY TEXT
========================================= */

function getDayText(days) {

    if (
        days.length === 7
    ) {

        return "ทุกวัน";

    }


    const names = {

        0: "อา",

        1: "จ",

        2: "อ",

        3: "พ",

        4: "พฤ",

        5: "ศ",

        6: "ส"

    };


    return days
        .sort((a, b) => a - b)
        .map(day => names[day])
        .join(" • ");

}


/* =========================================
   RENDER
========================================= */

function renderAlarms() {

    alarmList.innerHTML = "";


    alarmCount.textContent =
        `${alarms.length} รายการ`;


    if (
        alarms.length === 0
    ) {

        emptyAlarm.style.display =
            "flex";

        return;

    }


    emptyAlarm.style.display =
        "none";


    /*
        เรียงตามเวลา
    */

    const sortedAlarms =
        [...alarms].sort(
            (a, b) =>
                a.time.localeCompare(
                    b.time
                )
        );


    sortedAlarms.forEach(
        alarm => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "alarm-card";


            card.innerHTML = `

                <div class="alarm-icon">

                    <i class="fa-solid fa-bell"></i>

                </div>


                <div class="alarm-info">

                    <div class="alarm-time">
                        ${alarm.time}
                    </div>

                    <div class="alarm-label">
                        ${escapeHTML(alarm.label)}
                    </div>

                    <div class="alarm-days">
                        ${getDayText([...alarm.days])}
                    </div>

                </div>


                <label class="alarm-switch">

                    <input
                        type="checkbox"
                        ${alarm.enabled ? "checked" : ""}
                        data-id="${alarm.id}">

                    <span class="alarm-slider"></span>

                </label>


                <button
                    class="delete-alarm"
                    data-delete="${alarm.id}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            `;


            alarmList.appendChild(
                card
            );

        }
    );


    /*
        เปิด / ปิด Alarm
    */

    document
        .querySelectorAll(
            ".alarm-switch input"
        )
        .forEach(
            toggle => {

                toggle.addEventListener(
                    "change",
                    () => {

                        const id =
                            Number(
                                toggle.dataset.id
                            );


                        const alarm =
                            alarms.find(
                                item =>
                                    item.id === id
                            );


                        if (alarm) {

                            alarm.enabled =
                                toggle.checked;

                            saveAlarms();

                        }

                    }
                );

            }
        );


    /*
        ลบ Alarm
    */

    document
        .querySelectorAll(
            ".delete-alarm"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.delete
                            );


                        alarms =
                            alarms.filter(
                                alarm =>
                                    alarm.id !== id
                            );


                        saveAlarms();

                        renderAlarms();

                    }
                );

            }
        );

}


/* =========================================
   SECURITY
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


/* =========================================
   CHECK ALARM
========================================= */

let lastTriggeredAlarm = "";


function checkAlarms() {

    const now =
        new Date();


    const currentDay =
        now.getDay();


    const currentHour =
        String(
            now.getHours()
        ).padStart(2, "0");


    const currentMinute =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    const currentTime =
        `${currentHour}:${currentMinute}`;


    alarms.forEach(
        alarm => {

            if (!alarm.enabled) {
                return;
            }


            if (
                !alarm.days.includes(
                    currentDay
                )
            ) {

                return;

            }


            const triggerKey =
                `${alarm.id}-${currentTime}-${currentDay}`;


            if (
                alarm.time === currentTime &&
                lastTriggeredAlarm !== triggerKey
            ) {

                lastTriggeredAlarm =
                    triggerKey;


                showAlarmNotification(
                    alarm
                );

            }

        }
    );

}


/* =========================================
   NOTIFICATION
========================================= */

function showAlarmNotification(alarm) {

    /*
        แจ้งเตือนใน Browser
    */

    if (
        "Notification" in window
    ) {

        if (
            Notification.permission ===
            "granted"
        ) {

            new Notification(
                "Stretchman 🔔",
                {
                    body:
                        `${alarm.label}\nถึงเวลายืดกล้ามเนื้อแล้ว`
                }
            );

        }

    }


    /*
        แจ้งเตือนบนหน้าเว็บ
    */

    alert(
        `🔔 ${alarm.label}\nถึงเวลายืดกล้ามเนื้อแล้ว!`
    );

}


/* =========================================
   REQUEST NOTIFICATION
========================================= */

function requestNotificationPermission() {

    if (
        "Notification" in window &&
        Notification.permission === "default"
    ) {

        Notification.requestPermission();

    }

}


/* =========================================
   START CHECKER
========================================= */

setInterval(
    checkAlarms,
    1000
);


/* =========================================
   INITIALIZE
========================================= */

renderAlarms();

requestNotificationPermission();