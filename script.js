const API_URL = "https://script.google.com/macros/s/AKfycbzQMWLxwViit19P3T_0CY6XyY3JN5B_KmSar9Wga7RFurFMjZWbP6qYTDRDp8i-m34-Ew/exec";

async function cariPassport() {

    const keyword = document.getElementById("search").value.trim().toUpperCase();
    const result = document.getElementById("result");

    if (keyword === "") {

        result.innerHTML =
        "<span style='color:red'>Sila masukkan No. Resit atau No. Kad Pengenalan.</span>";

        return;

    }

    result.innerHTML = "🔍 Sedang mencari...";

    try {

        const response = await fetch(
            API_URL + "?search=" + encodeURIComponent(keyword)
        );

        const data = await response.json();

        if (data.found) {

            result.innerHTML = `

<div class="info-card">

<h2>Maklumat Passport</h2>

<div class="info-row">

<div class="icon">

<span class="material-icons">sell</span>

</div>

<div>

<div class="label">

No. Tag

</div>

<div class="value">

${data.tag}

</div>

</div>

</div>

<div class="info-row">

<div class="icon">

<span class="material-icons">verified</span>

</div>

<div>

<div class="label">

Status

</div>

<div class="value status">

${data.status}

</div>

</div>

</div>

<div class="info-row">

<div class="icon">

<span class="material-icons">event</span>

</div>

<div>

<div class="label">

Tarikh Diserah

</div>

<div class="value">

${data.tarikh
? new Date(data.tarikh).toLocaleDateString("ms-MY")
: "-"}

</div>

</div>

</div>

<div class="info-row">

<div class="icon">

<span class="material-icons">chat</span>

</div>

<div>

<div class="label">

Catatan

</div>

<div class="value">

${
String(data.catatan).trim() === "1" ? "PMA lama rosak" :
String(data.catatan).trim() === "2" ? "Dokumen tidak lengkap" :
String(data.catatan).trim() === "3" ? "Pemohon tidak hadir" :
String(data.catatan).trim() === "4" ? "Lain-lain" :
data.catatan || "-"
}

</div>

</div>

</div>
${
data.status === "SEDIA UNTUK PENGAMBILAN"
? `

<div class="action-panel">

<button class="btn-success"
onclick="telahDiserah()">

✅ Serah Pasport

</button>

<button class="btn-danger"
onclick="tidakDiserah()">

❌ Tidak Dapat Diserah

</button>

</div>

`

:

`

<div class="action-info">

Tiada tindakan diperlukan.

</div>

`

}

<div id="statusMsg" style="margin-top:20px;"></div>

</div>

`;

        } else {

            result.innerHTML = `
            <div class="info-card">

                <h2 style="color:#dc3545;">
                ❌ Rekod Tidak Dijumpai
                </h2>

                <p>
                Tiada rekod ditemui bagi nombor yang dimasukkan.
                </p>

            </div>
            `;

        }

    } catch (err) {

        console.log(err);

        result.innerHTML = `
        <div class="info-card">

            <h2 style="color:#dc3545;">
            ❌ Ralat Sambungan
            </h2>

            <p>
            Tidak dapat menyambung ke Google Sheet.
            </p>

        </div>
        `;

    }

}
async function telahDiserah() {

    const keyword = document.getElementById("search").value.trim();

    const response = await fetch(
        API_URL +
        "?action=update" +
        "&search=" + encodeURIComponent(keyword) +
        "&status=" + encodeURIComponent("TELAH DISERAHKAN") +
        "&catatan=" + encodeURIComponent("Pasport telah diserah")
    );

    const data = await response.json();

    if (data.success) {

        document.getElementById("statusMsg").innerHTML = `
        <div class="success-message">
            <span class="material-icons">check_circle</span>
            Status berjaya dikemaskini.
        </div>`;

        setTimeout(function () {

            document.getElementById("search").value = "";
            document.getElementById("result").innerHTML = "";
            document.getElementById("search").focus();

        }, 2500);

    } else {

        alert("❌ Gagal mengemaskini.");

    }

}

async function tidakDiserah() {

    const sebab = prompt(
`Sebab tidak dapat diserah

1. PMA lama rosak
2. Dokumen tidak lengkap
3. Pemohon tidak hadir
4. Lain-lain`
    );

    if (!sebab) return;

    const pilihanSebab = {
        "1": "PMA lama rosak",
        "2": "Dokumen tidak lengkap",
        "3": "Pemohon tidak hadir",
        "4": "Lain-lain"
    };

    let catatan = pilihanSebab[sebab.trim()];

    if (!catatan) {

        alert("Sila masukkan nombor 1, 2, 3 atau 4 sahaja.");

        return;

    }

    if (sebab.trim() === "4") {

        const sebabLain = prompt("Sila nyatakan sebab lain:");

        if (!sebabLain || !sebabLain.trim()) return;

        catatan = sebabLain.trim();

    }

    const keyword = document.getElementById("search").value.trim();

    const response = await fetch(
        API_URL +
        "?action=update" +
        "&search=" + encodeURIComponent(keyword) +
        "&status=" + encodeURIComponent("PENYERAHAN TIDAK BERJAYA") +
        "&catatan=" + encodeURIComponent(catatan)
    );

    const data = await response.json();

    if (data.success) {

        document.getElementById("statusMsg").innerHTML = `
        <div class="success-message">
            <span class="material-icons">check_circle</span>
            Status berjaya dikemaskini.
        </div>`;

        setTimeout(function () {

            document.getElementById("search").value = "";
            document.getElementById("result").innerHTML = "";
            document.getElementById("search").focus();

        }, 2500);

    } else {

        alert("❌ Gagal mengemaskini.");

    }

}

// ===============================
// Auto Focus + Barcode + Manual Entry
// ===============================

window.onload = function () {

    const input = document.getElementById("search");

    input.focus();

    let timer;

    input.addEventListener("input", function () {

        clearTimeout(timer);

        timer = setTimeout(function () {

            if (input.value.trim() !== "") {

                cariPassport();

            }

        }, 250);

    });

    input.addEventListener("keydown", function (e) {

        if (e.key === "Enter") {

            e.preventDefault();

            cariPassport();

        }

    });

};
