const areaTitle = document.getElementById("areaTitle");
const painImage = document.getElementById("painImage");
const painPoint = document.getElementById("painPoint");
const painLevels = document.querySelectorAll(".pain-level");
const symptomButtons = document.querySelectorAll(".symptom-button");
const saveBtn = document.getElementById("saveBtn");
const backBtn = document.getElementById("backBtn");
const infoBtn = document.getElementById("infoBtn");

/* =====================================
   GET SELECTED PAIN & SIDE
===================================== */
const selectedPain = localStorage.getItem("selectedPain");
const bodySide = localStorage.getItem("bodySide"); // ดึงค่าฝั่งที่เลือกมา

if (!selectedPain) {
    areaTitle.textContent = "ยังไม่ได้เลือก";
} else {
    areaTitle.textContent = selectedPain;
}

/* =====================================
   CHANGE BODY IMAGE & PAIN POINT
===================================== */
function setupPainArea(area, side) {
    
    // ควบคุมการเปลี่ยนรูปภาพ หน้า / หลัง ตามที่ผู้ใช้เลือกมาตรงๆ
    if (side === "back") {
        painImage.src = "images/back.png";
    }

    // กำหนดพิกัดจุดแดงตามชื่อบริเวณ
    switch (area) {

        case "คอ":
            painPoint.style.left = "49.9%";
            painPoint.style.top = "15%";
            break;

        case "ไหล่ซ้าย":
            painPoint.style.left = "42%";
            painPoint.style.top = "17%";
            break;

        case "ไหล่ขวา":
            painPoint.style.left = "58%";
            painPoint.style.top = "17%";
            break;

        case "หลังส่วนบน":
            painPoint.style.left = "50%";
            painPoint.style.top = "30%";
            break;

        case "หลังส่วนล่าง":
            painPoint.style.left = "50%";
            painPoint.style.top = "37%";
            break;

        case "หน้าอก":
            painPoint.style.left = "50%";
            painPoint.style.top = "42%";
            break;

        case "เอว":
            painPoint.style.left = "50%";
            painPoint.style.top = "45%";
            break;

        case "เข่าซ้าย":
            painPoint.style.left = "45%";
            painPoint.style.top = "70%";
            break;

        case "เข่าขวา":
            painPoint.style.left = "55%";
            painPoint.style.top = "70%";
            break;

        default:
            painPoint.style.left = "50%";
            painPoint.style.top = "50%";
    }
}

setupPainArea(selectedPain, bodySide);

/* =====================================
   PAIN LEVEL
===================================== */
let selectedLevel = localStorage.getItem("painLevel");

if (selectedLevel) {
    painLevels.forEach((button) => {
        if (button.dataset.level === selectedLevel) {
            button.classList.add("selected");
        }
    });
}

painLevels.forEach((button) => {
    button.addEventListener("click", () => {
        painLevels.forEach((item) => {
            item.classList.remove("selected");
        });
        button.classList.add("selected");
        selectedLevel = button.dataset.level;
    });
});

/* =====================================
   SYMPTOM
===================================== */
let selectedSymptom = localStorage.getItem("painType");

if (selectedSymptom) {
    symptomButtons.forEach((button) => {
        if (button.dataset.symptom === selectedSymptom) {
            button.classList.add("selected");
        }
    });
}

symptomButtons.forEach((button) => {
    button.addEventListener("click", () => {
        symptomButtons.forEach((item) => {
            item.classList.remove("selected");
        });
        button.classList.add("selected");
        selectedSymptom = button.dataset.symptom;
    });
});

/* =====================================
   SAVE
===================================== */
saveBtn.addEventListener("click", () => {
    if (!selectedLevel) {
        alert("กรุณาเลือกระดับความปวดก่อน");
        return;
    }

    if (!selectedSymptom) {
        alert("กรุณาเลือกประเภทอาการก่อน");
        return;
    }

    localStorage.setItem("selectedPain", selectedPain);
    localStorage.setItem("bodySide", bodySide);
    localStorage.setItem("painLevel", selectedLevel);
    localStorage.setItem("painType", selectedSymptom);

    window.location.href = "exercise.html";
});

/* =====================================
   BACK
===================================== */
backBtn.addEventListener("click", () => {
    window.location.href = "pain.html";
});

/* =====================================
   INFO
===================================== */
infoBtn.addEventListener("click", () => {
    alert("เลือกบริเวณที่ปวด ระดับความปวด และประเภทอาการ เพื่อให้ Stretchman แนะนำท่ายืดที่เหมาะสม");
});