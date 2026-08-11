import {
    PoseLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/+esm";


/* =========================
   ELEMENTS
========================= */

const video =
    document.getElementById("camera");

const canvas =
    document.getElementById("poseCanvas");

const ctx =
    canvas.getContext("2d");

const startBtn =
    document.getElementById("startBtn");

const startIcon =
    document.getElementById("startIcon");

const startText =
    document.getElementById("startText");

const resetBtn =
    document.getElementById("resetBtn");

const skipBtn =
    document.getElementById("skipBtn");

const completeBtn =
    document.getElementById("completeBtn");

const backBtn =
    document.getElementById("backBtn");

const aiStatus =
    document.getElementById("aiStatus");

const trackingMessage =
    document.getElementById(
        "trackingMessage"
    );

const timerElement =
    document.getElementById("timer");

const exampleImage =
    document.getElementById(
        "exampleImage"
    );

const examplePlaceholder =
    document.getElementById(
        "examplePlaceholder"
    );

const exerciseName =
    document.getElementById(
        "exerciseName"
    );


/* =========================
   DATA FROM PREVIOUS PAGE
========================= */

const savedName =
    localStorage.getItem(
        "exerciseName"
    );

const savedImage =
    localStorage.getItem(
        "exerciseImage"
    );

const savedTime =
    localStorage.getItem(
        "exerciseTime"
    );


if (savedName) {

    exerciseName.textContent =
        savedName;

}


if (savedImage) {

    exampleImage.src =
        savedImage;

    exampleImage.style.display =
        "block";

    examplePlaceholder.style.display =
        "none";

}


if (savedTime) {

    const match =
        savedTime.match(/\d+/);

    if (match) {

        totalSeconds =
            parseInt(match[0]);

    }

}


/* =========================
   TIMER
========================= */

let totalSeconds = 20;

let remainingSeconds =
    totalSeconds;

let timerInterval = null;

let timerRunning = false;


/* =========================
   CAMERA
========================= */

let stream = null;

let poseLandmarker = null;

let cameraRunning = false;

let animationFrame = null;


/* =========================
   MEDIAPIPE
========================= */

async function createPoseTracker() {

    try {

        trackingMessage.textContent =
            "กำลังโหลด AI Motion Tracking...";

        const vision =
            await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
            );


        poseLandmarker =
            await PoseLandmarker.createFromOptions(
                vision,
                {
                    baseOptions: {

                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"

                    },

                    runningMode: "VIDEO",

                    numPoses: 1,

                    minPoseDetectionConfidence: 0.5,

                    minPosePresenceConfidence: 0.5,

                    minTrackingConfidence: 0.5
                }
            );


        aiStatus.classList.add("ready");

        trackingMessage.textContent =
            "AI พร้อมแล้ว กดเปิดกล้อง";


        return true;

    } catch (error) {

        console.error(error);

        trackingMessage.textContent =
            "โหลด AI ไม่สำเร็จ";

        return false;

    }

}


/* =========================
   CAMERA
========================= */

async function startCamera() {

    try {

        if (!poseLandmarker) {

            const loaded =
                await createPoseTracker();

            if (!loaded) return;

        }


        stream =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode: "user",

                    width: {
                        ideal: 720
                    },

                    height: {
                        ideal: 1280
                    }

                },

                audio: false

            });


        video.srcObject =
            stream;


        await video.play();


        cameraRunning = true;


        startIcon.className =
            "fa-solid fa-pause";

        startText.textContent =
            "หยุด";


        trackingMessage.textContent =
            "กำลังค้นหาท่าทาง...";


        resizeCanvas();


        detectPose();


    } catch (error) {

        console.error(error);

        trackingMessage.textContent =
            "ไม่สามารถเปิดกล้องได้";

        aiStatus.classList.remove(
            "ready"
        );

    }

}


/* =========================
   STOP CAMERA
========================= */

function stopCamera() {

    cameraRunning = false;


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

    }


    if (stream) {

        stream
            .getTracks()
            .forEach(track =>
                track.stop()
            );

        stream = null;

    }


    video.srcObject = null;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    stopTimer();


    startIcon.className =
        "fa-solid fa-camera";

    startText.textContent =
        "เปิดกล้อง";


    trackingMessage.textContent =
        "กล้องหยุดแล้ว";

}


/* =========================
   CANVAS
========================= */

function resizeCanvas() {

    canvas.width =
        video.videoWidth ||
        video.clientWidth;

    canvas.height =
        video.videoHeight ||
        video.clientHeight;

}


/* =========================
   POSE DETECTION
========================= */

function detectPose() {

    if (!cameraRunning) return;


    if (
        video.readyState <
        HTMLMediaElement.HAVE_ENOUGH_DATA
    ) {

        animationFrame =
            requestAnimationFrame(
                detectPose
            );

        return;

    }


    resizeCanvas();


    try {

        const result =
            poseLandmarker.detectForVideo(
                video,
                performance.now()
            );


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        if (
            result.landmarks &&
            result.landmarks.length > 0
        ) {

            const landmarks =
                result.landmarks[0];


            drawPose(
                landmarks
            );


            checkPose(
                landmarks
            );

        } else {

            trackingMessage.textContent =
                "ไม่พบร่างกาย — ขยับเข้ากล้องอีกนิด";

            trackingMessage.className =
                "tracking-message warning";

            stopTimer();

        }

    } catch (error) {

        console.error(error);

    }


    animationFrame =
        requestAnimationFrame(
            detectPose
        );

}


/* =========================
   DRAW SKELETON
========================= */

const connections = [

    [11, 12],

    [11, 13],
    [13, 15],

    [12, 14],
    [14, 16],

    [11, 23],
    [12, 24],

    [23, 24],

    [23, 25],
    [25, 27],

    [24, 26],
    [26, 28]

];


function drawPose(landmarks) {

    const width =
        canvas.width;

    const height =
        canvas.height;


    ctx.lineWidth = 5;

    ctx.lineCap = "round";

    ctx.strokeStyle =
        "#43a5ff";


    connections.forEach(
        ([start, end]) => {

            const a =
                landmarks[start];

            const b =
                landmarks[end];


            if (!a || !b) return;


            if (
                a.visibility < 0.5 ||
                b.visibility < 0.5
            ) return;


            ctx.beginPath();

            ctx.moveTo(
                a.x * width,
                a.y * height
            );

            ctx.lineTo(
                b.x * width,
                b.y * height
            );

            ctx.stroke();

        }
    );


    landmarks.forEach(
        point => {

            if (
                point.visibility < 0.5
            ) return;


            ctx.beginPath();

            ctx.arc(
                point.x * width,
                point.y * height,
                5,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#ffffff";

            ctx.fill();

        }
    );

}


/* =========================
   BASIC POSE CHECK
========================= */

function checkPose(landmarks) {

    /*
        ตัวอย่างระบบตรวจเบื้องต้น

        ตรวจว่าไหล่ซ้าย/ขวา
        และสะโพกซ้าย/ขวา
        ถูกตรวจพบหรือไม่
    */


    const leftShoulder =
        landmarks[11];

    const rightShoulder =
        landmarks[12];

    const leftHip =
        landmarks[23];

    const rightHip =
        landmarks[24];


    if (
        !leftShoulder ||
        !rightShoulder ||
        !leftHip ||
        !rightHip
    ) {

        trackingMessage.textContent =
            "กำลังหาตำแหน่งร่างกาย...";

        stopTimer();

        return;

    }


    const visible =
        leftShoulder.visibility > 0.6 &&
        rightShoulder.visibility > 0.6 &&
        leftHip.visibility > 0.6 &&
        rightHip.visibility > 0.6;


    if (!visible) {

        trackingMessage.textContent =
            "ขยับให้เห็นตัวชัดขึ้น";

        trackingMessage.className =
            "tracking-message warning";

        stopTimer();

        return;

    }


    /*
       ตอนนี้ถือว่า
       AI ตรวจพบร่างกายแล้ว
    */


    trackingMessage.textContent =
        "✓ ตรวจพบร่างกายแล้ว";

    trackingMessage.className =
        "tracking-message good";


    /*
       เริ่ม Timer
       เมื่อระบบตรวจพบร่างกาย
    */

    if (!timerRunning) {

        startTimer();

    }

}


/* =========================
   TIMER START
========================= */

function startTimer() {

    if (timerRunning) return;


    timerRunning = true;


    timerInterval =
        setInterval(() => {

            remainingSeconds--;

            updateTimer();


            if (
                remainingSeconds <= 0
            ) {

                finishTimer();

            }

        }, 1000);

}


/* =========================
   TIMER STOP
========================= */

function stopTimer() {

    if (!timerRunning) return;


    timerRunning = false;


    clearInterval(
        timerInterval
    );

    timerInterval = null;

}


/* =========================
   TIMER RESET
========================= */

function resetTimer() {

    stopTimer();


    remainingSeconds =
        totalSeconds;


    updateTimer();


    trackingMessage.textContent =
        "พร้อมเริ่ม";


    trackingMessage.className =
        "tracking-message";

}


/* =========================
   TIMER UPDATE
========================= */

function updateTimer() {

    timerElement.textContent =
        remainingSeconds;

}


/* =========================
   TIMER FINISH
========================= */

function finishTimer() {

    stopTimer();


    remainingSeconds = 0;

    updateTimer();


    trackingMessage.textContent =
        "🎉 ทำครบเวลาแล้ว!";


    trackingMessage.className =
        "tracking-message good";


    localStorage.setItem(
        "exerciseCompleted",
        "true"
    );

}


/* =========================
   BUTTONS
========================= */

startBtn.addEventListener(
    "click",
    () => {

        if (cameraRunning) {

            stopCamera();

        } else {

            startCamera();

        }

    }
);


resetBtn.addEventListener(
    "click",
    resetTimer
);


skipBtn.addEventListener(
    "click",
    () => {

        stopCamera();

        window.location.href =
            "exercise.html";

    }
);


completeBtn.addEventListener(
    "click",
    () => {

        localStorage.setItem(
            "exerciseCompleted",
            "true"
        );


        stopCamera();


        window.location.href =
            "exercise.html";

    }
);


backBtn.addEventListener(
    "click",
    () => {

        stopCamera();

        window.location.href =
            "exercise.html";

    }
);


/* =========================
   INITIALIZE
========================= */

updateTimer();

trackingMessage.textContent =
    "กดเปิดกล้องเพื่อเริ่ม";


// โหลด AI ล่วงหน้า
createPoseTracker();