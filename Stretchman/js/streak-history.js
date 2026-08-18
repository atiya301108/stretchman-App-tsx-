/* =========================================
   ELEMENTS
========================================= */

const calendar =
    document.getElementById("calendar");

const monthTitle =
    document.getElementById("monthTitle");

const historyList =
    document.getElementById("historyList");

const emptyHistory =
    document.getElementById("emptyHistory");

const totalSessions =
    document.getElementById("totalSessions");

const currentStreak =
    document.getElementById("currentStreak");

const bestStreak =
    document.getElementById("bestStreak");

const backBtn =
    document.getElementById("backBtn");

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");


/* =========================================
   MONTH
========================================= */

let currentDate = new Date();


/* =========================================
   GET USER DATA
========================================= */

function getStreakData() {

    try {

        const data =
            localStorage.getItem(
                "stretchmanUser"
            );

        if (data) {

            return JSON.parse(data);

        }

    } catch (error) {

        console.error(error);

    }


    return {

        xp: 0,

        coins: 0,

        streak: 0

    };

}


const user =
    getStreakData();


currentStreak.textContent =
    `${user.streak || 0} วัน`;


/* =========================================
   BEST STREAK
========================================= */

const savedBest =
    parseInt(
        localStorage.getItem(
            "stretchmanBestStreak"
        ) || "0"
    );


bestStreak.textContent =
    `${Math.max(
        savedBest,
        user.streak || 0
    )} วัน`;


/* =========================================
   GET HISTORY
========================================= */

function getHistory() {

    try {

        const saved =
            localStorage.getItem(
                "stretchmanStreakHistory"
            );

        if (saved) {

            return JSON.parse(saved);

        }

    } catch (error) {

        console.error(error);

    }


    return [];

}


const history =
    getHistory();


/* =========================================
   CALENDAR
========================================= */

function renderCalendar() {

    calendar.innerHTML = "";


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const monthNames = [

        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม"

    ];


    monthTitle.textContent =
        `${monthNames[month]} ${year + 543}`;


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    /*
        JavaScript:
        Sunday = 0

        เปลี่ยนให้
        Monday = 0
    */

    let startDay =
        firstDay.getDay();

    startDay =
        startDay === 0
            ? 6
            : startDay - 1;


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /* EMPTY DAYS */

    for (
        let i = 0;
        i < startDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "calendar-day empty";

        calendar.appendChild(empty);

    }


    /* DAYS */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const element =
            document.createElement("div");


        element.className =
            "calendar-day";


        element.textContent =
            day;


        const dateString =
            formatDate(
                new Date(
                    year,
                    month,
                    day
                )
            );


        if (
            history.some(
                item =>
                    item.date === dateString
            )
        ) {

            element.classList.add(
                "completed"
            );

        }


        const today =
            new Date();


        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            element.classList.add(
                "today"
            );

        }


        calendar.appendChild(
            element
        );

    }

}


/* =========================================
   DATE FORMAT
========================================= */

function formatDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* =========================================
   RENDER HISTORY
========================================= */

function renderHistory() {

    historyList.innerHTML = "";


    totalSessions.textContent =
        `${history.length} ครั้ง`;


    if (history.length === 0) {

        emptyHistory.style.display =
            "block";

        return;

    }


    emptyHistory.style.display =
        "none";


    const sortedHistory =
        [...history].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    sortedHistory.forEach(
        item => {

            const element =
                document.createElement("div");


            element.className =
                "history-item";


            element.innerHTML = `

                <div class="history-icon">

                    <i class="fa-solid fa-check"></i>

                </div>


                <div class="history-content">

                    <strong>
                        ${item.title || "ยืดกล้ามเนื้อ"}
                    </strong>

                    <span>
                        ${formatThaiDate(item.date)}
                    </span>

                </div>


                <div class="history-xp">

                    +${item.xp || 15} XP

                </div>

            `;


            historyList.appendChild(
                element
            );

        }
    );

}


/* =========================================
   THAI DATE
========================================= */

function formatThaiDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    const months = [

        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค."

    ];


    return `${date.getDate()} ${
        months[date.getMonth()]
    } ${date.getFullYear() + 543}`;

}


/* =========================================
   MONTH BUTTONS
========================================= */

prevMonth.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();

    }
);


nextMonth.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();

    }
);


/* =========================================
   BACK
========================================= */

backBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "leaderboard.html";

    }
);


/* =========================================
   INITIALIZE
========================================= */

renderCalendar();

renderHistory();