/* =====================================
   GET ELEMENTS
===================================== */

const painArea =
    document.getElementById("painArea");

const levelButtons =
    document.querySelectorAll(".level-button");

const continueBtn =
    document.getElementById("continueBtn");

const backBtn =
    document.getElementById("backBtn");


/* =====================================
   GET PAIN AREA
===================================== */

const selectedPain =
    localStorage.getItem("selectedPain");


if (selectedPain) {

    painArea.textContent =
        selectedPain;

} else {

    painArea.textContent =
        "ยังไม่ได้เลือก";

}


/* =====================================
   PAIN LEVEL
===================================== */

let selectedLevel = null;


levelButtons.forEach((button) => {

    button.addEventListener("click", () => {


        /* เอา selected ออกจากทุกปุ่ม */

        levelButtons.forEach((item) => {

            item.classList.remove("selected");

        });


        /* เลือกปุ่มนี้ */

        button.classList.add("selected");


        /* เก็บระดับ */

        selectedLevel =
            button.dataset.level;


    });

});


/* =====================================
   CONTINUE
===================================== */

continueBtn.addEventListener("click", () => {


    if (!selectedLevel) {

        alert(
            "กรุณาเลือกระดับความปวดก่อน"
        );

        return;

    }


    /* บันทึกระดับความปวด */

    localStorage.setItem(
        "painLevel",
        selectedLevel
    );


    /* ไปหน้าถัดไป */

    window.location.href =
        "exercise.html";

});


/* =====================================
   BACK
===================================== */

backBtn.addEventListener("click", () => {

    window.location.href =
        "pain.html";

});