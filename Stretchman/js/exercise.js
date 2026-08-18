/* =====================================
   GET DATA
===================================== */

const painArea =
    localStorage.getItem("selectedPain");

const painLevel =
    localStorage.getItem("painLevel");

const painType =
    localStorage.getItem("painType");


/* =====================================
   ELEMENTS
===================================== */

const areaElement =
    document.getElementById("painArea");

const levelElement =
    document.getElementById("painLevel");

const typeElement =
    document.getElementById("painType");

const exerciseList =
    document.getElementById("exerciseList");

const startBtn =
    document.getElementById("startBtn");

const backBtn =
    document.getElementById("backBtn");


/* =====================================
   SHOW USER DATA
===================================== */

if (areaElement) {

    areaElement.textContent =
        painArea || "-";

}


if (levelElement) {

    levelElement.textContent =
        painLevel
            ? `${painLevel}/5`
            : "-";

}


if (typeElement) {

    typeElement.textContent =
        painType || "-";

}


/* =====================================
   EXERCISE DATABASE
===================================== */

const exercises = {

    "คอ": [

        {
            name: "ยืดกล้ามเนื้อคอด้านข้าง",
            description: "ค่อย ๆ เอียงศีรษะไปด้านข้าง",
            time: "20 วินาที",
            image: "images/exercises/neck-side.png"
        },

        {
            name: "ยืดคอด้านหน้า",
            description: "ค่อย ๆ เงยหน้าและยืดกล้ามเนื้อ",
            time: "15 วินาที",
            image: "images/exercises/neck-front.png"
        },

        {
            name: "หมุนคอเบา ๆ",
            description: "หมุนศีรษะช้า ๆ อย่างนุ่มนวล",
            time: "30 วินาที",
            image: "images/exercises/neck-rotate.png"
        }

    ],


    "ไหล่ซ้าย": [

        {
            name: "ยืดไหล่แบบพาดแขน",
            description: "ใช้แขนอีกข้างช่วยดึงเบา ๆ",
            time: "20 วินาที",
            image: "images/exercises/shoulder.png"
        },

        {
            name: "ยืดไหล่ด้านข้าง",
            description: "ยกแขนและยืดออกด้านข้าง",
            time: "20 วินาที",
            image: "images/exercises/shoulder-side.png"
        }

    ],


    "ไหล่ขวา": [

        {
            name: "ยืดไหล่แบบพาดแขน",
            description: "ใช้แขนอีกข้างช่วยดึงเบา ๆ",
            time: "20 วินาที",
            image: "images/exercises/shoulder.png"
        },

        {
            name: "ยืดไหล่ด้านข้าง",
            description: "ยกแขนและยืดออกด้านข้าง",
            time: "20 วินาที",
            image: "images/exercises/shoulder-side.png"
        }

    ],


    "หลังส่วนบน": [

        {
            name: "ยืดหลังส่วนบน",
            description: "ประสานมือและดันแขนไปด้านหน้า",
            time: "20 วินาที",
            image: "images/exercises/upper-back.png"
        },

        {
            name: "ท่ายืดหลังแบบกอดตัวเอง",
            description: "กอดตัวเองและดันหลังออก",
            time: "20 วินาที",
            image: "images/exercises/back-hug.png"
        }

    ],


    "หลัง": [

        {
            name: "ยืดหลัง",
            description: "ยืดกล้ามเนื้อหลังอย่างช้า ๆ",
            time: "20 วินาที",
            image: "images/exercises/back.png"
        },

        {
            name: "ท่า Cat-Cow",
            description: "ขยับกระดูกสันหลังอย่างนุ่มนวล",
            time: "30 วินาที",
            image: "images/exercises/cat-cow.png"
        }

    ],


    "หลังส่วนล่าง": [

        {
            name: "ยืดหลังส่วนล่าง",
            description: "ดึงเข่าเข้าหาลำตัวอย่างเบา ๆ",
            time: "20 วินาที",
            image: "images/exercises/lower-back.png"
        },

        {
            name: "ท่า Child's Pose",
            description: "นั่งพับตัวเพื่อผ่อนคลายหลัง",
            time: "30 วินาที",
            image: "images/exercises/child-pose.png"
        }

    ],


    "เอว": [

        {
            name: "ยืดเอวด้านข้าง",
            description: "เอียงลำตัวไปด้านข้างอย่างช้า ๆ",
            time: "20 วินาที",
            image: "images/exercises/waist.png"
        }

    ],


    "สะโพก": [

        {
            name: "ยืดสะโพก",
            description: "ยืดกล้ามเนื้อบริเวณสะโพก",
            time: "20 วินาที",
            image: "images/exercises/hip.png"
        }

    ],


    "หน้าอก": [

        {
            name: "ยืดหน้าอก",
            description: "เปิดไหล่และยืดกล้ามเนื้อหน้าอก",
            time: "20 วินาที",
            image: "images/exercises/chest.png"
        }

    ],


    "ท้อง": [

        {
            name: "ยืดลำตัวด้านหน้า",
            description: "ยืดกล้ามเนื้อบริเวณด้านหน้าของลำตัว",
            time: "15 วินาที",
            image: "images/exercises/abs.png"
        }

    ],


    "เข่าซ้าย": [

        {
            name: "ยืดต้นขาด้านหน้า",
            description: "จับข้อเท้าและดึงเข้าหาตัวเบา ๆ",
            time: "20 วินาที",
            image: "images/exercises/quadriceps.png"
        }

    ],


    "เข่าขวา": [

        {
            name: "ยืดต้นขาด้านหน้า",
            description: "จับข้อเท้าและดึงเข้าหาตัวเบา ๆ",
            time: "20 วินาที",
            image: "images/exercises/quadriceps.png"
        }

    ]

};


/* =====================================
   DEFAULT EXERCISES
===================================== */

const defaultExercises = [

    {
        name: "ยืดกล้ามเนื้อเบื้องต้น",
        description: "ยืดกล้ามเนื้ออย่างนุ่มนวล",
        time: "20 วินาที",
        image: "images/exercises/general.png"
    },

    {
        name: "ยืดตัวเบา ๆ",
        description: "เคลื่อนไหวร่างกายอย่างช้า ๆ",
        time: "30 วินาที",
        image: "images/exercises/general-2.png"
    }

];


/* =====================================
   GET EXERCISES
===================================== */

let recommendedExercises =
    exercises[painArea] ||
    defaultExercises;


/* =====================================
   RENDER
===================================== */

function renderExercises() {

    if (!exerciseList) {
        return;
    }


    exerciseList.innerHTML = "";


    recommendedExercises.forEach(
        (exercise, index) => {

            const card =
                document.createElement("div");


            card.className =
                "exercise-card";


            card.dataset.index =
                index;


            card.innerHTML = `

                <div class="exercise-image">

                    <img
                        src="${exercise.image}"
                        alt="${exercise.name}"
                        onerror="
                            this.style.display='none';
                            this.nextElementSibling.style.display='block';
                        "
                    >

                    <i
                        class="fa-solid fa-person-running exercise-placeholder"
                        style="display:none;">
                    </i>

                </div>


                <div class="exercise-content">

                    <h3>
                        ${exercise.name}
                    </h3>

                    <p>
                        ${exercise.description}
                    </p>

                    <div class="exercise-time">

                        <i class="fa-regular fa-clock"></i>

                        ${exercise.time}

                    </div>

                </div>


                <div class="exercise-check">

                    <i class="fa-solid fa-check"></i>

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".exercise-card"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    card.classList.add(
                        "selected"
                    );


                    localStorage.setItem(
                        "selectedExercise",
                        index
                    );

                }
            );


            exerciseList.appendChild(
                card
            );

        }
    );

}


renderExercises();


/* =====================================
   START EXERCISE
===================================== */

if (startBtn) {

    startBtn.addEventListener(
    "click",
    () => {

        const selectedExercise =
            localStorage.getItem(
                "selectedExercise"
            );


        if (
            selectedExercise === null
        ) {

            alert(
                "กรุณาเลือกท่ายืดก่อน"
            );

            return;

        }


        /* =========================
           RESET REWARD SESSION
        ========================= */

        resetRewardSession();


        /* =========================
           GO STRETCH
        ========================= */

        window.location.href =
            "stretch.html";

    }
);
}

/* =====================================
   BACK
===================================== */

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "record.html";

        }
    );

}