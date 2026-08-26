// ========================================
// SLOT MACHINE
// Probability Project
// ========================================


// ------------------------------
// ตัวแปรวงล้อ
// ------------------------------

const slot1 = document.getElementById("slot1");
const slot2 = document.getElementById("slot2");
const slot3 = document.getElementById("slot3");

const spinButton = document.getElementById("spinButton");

const result = document.getElementById("result");

const spinCountText = document.getElementById("spinCount");
const jackpotCountText = document.getElementById("jackpotCount");


// ------------------------------
// เสียง
// ------------------------------

// ใส่ไฟล์เสียงของคุณไว้ในโฟลเดอร์ sounds

const spinSound = new Audio("sounds/spin.mp3");
const jackpotSound = new Audio("sounds/jackpot.mp3");


// ------------------------------
// ตัวแปรสถิติ
// ------------------------------

let spinCount = 0;
let jackpotCount = 0;


// ------------------------------
// สุ่มเลข 1 - 7
// ------------------------------

function randomNumber() {

    return Math.floor(Math.random() * 7) + 1;

}


// ------------------------------
// หน่วงเวลา
// ------------------------------

function delay(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}


// ------------------------------
// หมุนวงล้อ
// ------------------------------

async function spinReel(reel, duration) {

    reel.classList.add("spinning");

    const startTime = Date.now();

    let number;


    while (Date.now() - startTime < duration) {

        number = randomNumber();

        reel.textContent = number;

        await delay(70);

    }


    // เลขสุดท้ายหลังหยุด
    number = randomNumber();

    reel.textContent = number;

    reel.classList.remove("spinning");


    return number;

}


// ------------------------------
// ปุ่ม SPIN
// ------------------------------

spinButton.addEventListener("click", async function () {


    // ป้องกันกดซ้ำ
    spinButton.disabled = true;


    // ล้างผลลัพธ์เดิม
    result.textContent = "กำลังสุ่ม...";

    result.classList.remove("jackpot");


    // เล่นเสียงหมุน
    spinSound.currentTime = 0;

    spinSound.play().catch(() => {});


    // เพิ่มจำนวนครั้ง
    spinCount++;

    spinCountText.textContent = spinCount;


    // ------------------------------
    // เริ่มหมุนทั้ง 3 วง
    // ------------------------------

    const reel1 = spinReel(slot1, 1500);

    const reel2 = spinReel(slot2, 2000);

    const reel3 = spinReel(slot3, 2500);


    // รอให้ทั้งสามวงหยุด
    const numbers = await Promise.all([
        reel1,
        reel2,
        reel3
    ]);


    const number1 = numbers[0];
    const number2 = numbers[1];
    const number3 = numbers[2];


    // หยุดเสียงหมุน
    spinSound.pause();

    spinSound.currentTime = 0;


    // ------------------------------
    // ตรวจสอบ JACKPOT
    // ------------------------------

    if (
        number1 === number2 &&
        number2 === number3
    ) {

        // JACKPOT
        result.textContent = "🎉 JACKPOT! 🎉";

        result.classList.add("jackpot");


        // เพิ่มจำนวน Jackpot
        jackpotCount++;

        jackpotCountText.textContent = jackpotCount;


        // เล่นเสียงรางวัล
        jackpotSound.currentTime = 0;

        jackpotSound.play().catch(() => {});

        startJackpotEffect();

    } else {

        // ไม่ตรงกัน
        result.textContent =
            `${number1} - ${number2} - ${number3}`;

    }


    // เปิดปุ่มให้เล่นใหม่
    spinButton.disabled = false;

});

// ========================================
// JACKPOT VISUAL EFFECT
// ========================================

function startJackpotEffect() {

    // ------------------------------
    // ไฟสีเขียวรอบหน้าจอ
    // ------------------------------

    const effect = document.getElementById("jackpotEffect");

    effect.classList.remove("active");

    // บังคับให้ animation เริ่มใหม่
    void effect.offsetWidth;

    effect.classList.add("active");


    // ------------------------------
    // สร้างฝนเหรียญ
    // ------------------------------

    const coinAmount = 750;


    for (let i = 0; i < coinAmount; i++) {

        setTimeout(() => {

            const coin = document.createElement("div");

            coin.classList.add("coin");


            // ตำแหน่งสุ่มบนหน้าจอ
            coin.style.left =
                Math.random() * 100 + "vw";


            // ขนาดสุ่ม
            const size =
                Math.random() * 20 + 25;

            coin.style.width = size + "px";
            coin.style.height = size + "px";


            // ความเร็วตกสุ่ม
            const duration =
                Math.random() * 1.5 + 2;


            coin.style.animationDuration =
                duration + "s";


            // เพิ่มเหรียญเข้าเว็บ
            document.body.appendChild(coin);


            // ลบเหรียญหลังตกพ้นหน้าจอ
            setTimeout(() => {

                coin.remove();

            }, duration * 1000 + 500);


        }, i * 35);

    }

}