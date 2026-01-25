// =============================
// Shipping Calculator Script (FULL RESTORED VERSION)
// =============================

// =============================
// 1. Firebase Configuration & Imports
// =============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
    getDocs,
    where,
    startAt,
    endAt
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCSvGReWCatohjigRGVX3feyNB1d-zO8lg",
    authDomain: "shipping-calculator-e37ad.firebaseapp.com",
    projectId: "shipping-calculator-e37ad",
    storageBucket: "shipping-calculator-e37ad.firebasestorage.app",
    messagingSenderId: "408065703055",
    appId: "1:408065703055:web:d1a524be0dcdd91849c4fa",
    measurementId: "G-STV4L4D3HW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// ---------- Config Constants ----------
const VOLUMETRIC_DIVISOR = 500;
const RATES_KEY = "shipping_calc_rates_v1";
const ROW_CONFIG_KEY = "shipping_calc_rows_config_v1";
const FORM_STATE_KEY = "shipping_calc_form_state_v1";
const LANG_KEY = "shipping_calc_lang_v1";

// ---------- Element Selectors (Calculator Page) ----------
const netWeightInput = document.getElementById("net-weight");
const addWeightInput = document.getElementById("add-weight");
const weightQtyInput = document.getElementById("weight-qty");
const weightUnitSelect = document.getElementById("weight-unit");
const totalWeightInput = document.getElementById("total-weight");
const manualGrossWeightInput = document.getElementById("manual-gross-weight");

const totalNetWeightInput = document.getElementById("total-net-weight");
const packagingQtyInput = document.getElementById("packaging-qty");
const totalPackagingWeightInput = document.getElementById("total-packaging-weight");

const netWInput = document.getElementById("net-width");
const netLInput = document.getElementById("net-length");
const netHInput = document.getElementById("net-height");

const addWInput = document.getElementById("add-width");
const addLInput = document.getElementById("add-length");
const addHInput = document.getElementById("add-height");

const grossWInput = document.getElementById("gross-width");
const grossLInput = document.getElementById("gross-length");
const grossHInput = document.getElementById("gross-height");

const grossVolumeInput = document.getElementById("gross-volume");
const totalVolumeInput = document.getElementById("total-volume");
const manualTotalVolumeInput = document.getElementById("manual-grand-dimensions");

const dimensionQtyInput = document.getElementById("dimension-qty");
const dimensionUnitInput = document.getElementById("dimension-unit");

const volumeFromWeightOutput = document.getElementById("Volume");
const volumetricDivisorInput = document.getElementById("volumetric-divisor");
const volumetricMultiplierInput = document.getElementById("volumetric-multiplier");

const grandVolumeInput = document.getElementById("grand-volume");

const originCountrySelect = document.getElementById("origin-country");
const destinationCountrySelect = document.getElementById("destination-country");
const vendorSelect = document.getElementById("vendor");
const rateInput = document.getElementById("rate");

const chargeableInput = document.getElementById("chargeable-weight");

const resultBoxOrigin = document.getElementById("result-origin");
const costLabelOrigin = document.querySelector('label[for="result-origin"]');

const resultBoxDest = document.getElementById("result-destination");
const costLabelDest = document.querySelector('label[for="result-destination"]');

const pricePerPieceInput = document.getElementById("price-per-piece");
const fuelPercentInput = document.getElementById("fuel-percent");
const fuelAmountInput = document.getElementById("fuel-amount");
const otherInput = document.getElementById("other-charges");
const isSpecialCheckbox = document.getElementById("is-special");

const partImageInput = document.getElementById("part-image-input");
const imagePreview = document.getElementById("image-preview");
const cameraIcon = document.getElementById("camera-icon");

const historyTableBody = document.getElementById("history-body");

const btnEn = document.getElementById("lang-en");
const btnTh = document.getElementById("lang-th");
const btnCn = document.getElementById("lang-cn");

// ---------- Element Selectors (Table Page) ----------
const tableVendorSelect = document.getElementById("vendor-select");
const tablePlaceholder = document.getElementById("table-placeholder");
const viewAir = document.getElementById("view-air");
const viewSea = document.getElementById("view-sea");
const viewLand = document.getElementById("view-land");


// =============================
// Translations Data
// =============================
let currentLang = "en";
const translations = {
    en: {
        app_title_logo: "🚚 Shipping Cost Calculator",
        nav_table: "Table", nav_calc: "Calculator", nav_history: "History",
        app_title: "Shipping Cost Calculator",
        header_general_shipping: "General & Shipping Info",
        subheader_general: "General Information",
        subheader_vendor: "Vendor and Shipping Cost",
        header_weight_dims: "Weight & Dimensions",
        header_weight: "Weight",
        header_dims: "Dimensions",
        lbl_origin: "Origin Country",
        lbl_destination: "Destination Country",
        lbl_goods_name: "Goods Name",
        lbl_part_number: "Part Number",
        lbl_hs_code: "HS Code",
        lbl_vendor: "Vendor",
        lbl_chargeable: "Chargeable W./Vol.",
        lbl_cost_origin: "Shipping Cost (Origin)",
        lbl_cost_dest: "Shipping Cost (Destination)",
        lbl_shipping_cost: "Shipping Cost",
        lbl_price_per_piece: "Price / Piece",
        lbl_fuel: "Fuel",
        lbl_other: "Other",
        lbl_rate: "Exchange Rate",
        btn_calc: "Calculate Shipping Cost",
        btn_search: "Search",
        lbl_box_exclude: "Exclude Box",
        lbl_box_include: "Include Box",
        lbl_net_weight: "Net Weight (kg)",
        lbl_pack_weight: "Packaging Weight (kg)",
        lbl_gross_weight: "Gross Weight (kg)",
        lbl_total_weight: "Gross Weight (kg)",
        lbl_volume_m3: "Volume (m³)",
        lbl_net_dims: "Net Dimensions (cm)",
        lbl_pack_dims: "Packaging Dimensions (cm)",
        lbl_gross_dims: "Gross Dimensions (cm)",
        lbl_gross_dims_cm3: "Gross Dimensions (m³)",
        lbl_grand_dims: "Grand Dimensions (m³)",
        lbl_qty: "Quantity",
        lbl_unit: "Unit",
        lbl_grand_vol_kg: "Grand Volume (kg)",
        lbl_multiplier: "Multiplier",
        lbl_divisor: "Divisor",
        ph_qty: "Qty",
        ph_width: "Width",
        ph_length: "Length",
        ph_height: "Height",
        ph_total_net: "Total Net",
        ph_total_pkg: "Total Pkg",
        opt_select_country: "Select Country",
        opt_select_vendor: "Select Vendor",
        opt_unit: "Unit",
        country_china: "China",
        country_usa: "USA",
        country_japan: "Japan",
        country_thailand: "Thailand",
        country_germany: "Germany",
        unit_box: "Box",
        unit_bottle: "Bottle",
        unit_pack: "Pack",
        unit_carton: "Carton",
        unit_dozen: "Dozen",
        unit_piece: "Piece",
        alert_vendor: "Please select a Vendor first!",
        text_origin: "Origin",
        text_dest: "Destination",
        btn_save_history: "Save to History",
        btn_clear: "Clear Data",

        // Table Page
        lbl_transport_type: "Transport Type:",
        opt_select_type: "Select Transport Type",
        msg_select_type: "Please select a transport type to view rates.",
        header_air_table: "Air Rates Table",
        msg_edit_step: "* Edit the first column to change weight steps.",
        header_sea_table: "Sea Rate Table",
        header_land_table: "Land Rate Table",
        col_kg_edit: "KG (Edit)",
        col_vol_edit: "Volume (m³) (Edit)",
        col_range_edit: "Range (Edit)",
        col_price_yuan: "Price (Yuan)",
        col_action: "Action",
        btn_add_row: "+ Add Row",
        // History Page
        col_time: "Time / Date",
        col_box_option: "Box Option",
        col_qty: "Qty",
        col_unit: "Unit",
        col_net_weight: "Net W. (kg)",
        col_net_dims: "Net Dims (cm)",
        col_dims_qty: "Dims Qty",
        col_img: "Image",
        msg_loading: "Loading data from cloud...",
        msg_no_history: "No history found."
    },
    th: {
        app_title_logo: "🚚 โปรแกรมคำนวณค่าขนส่ง",
        nav_table: "ตาราง", nav_calc: "คำนวณราคา", nav_history: "ประวัติ",
        app_title: "โปรแกรมคำนวณค่าขนส่ง",
        header_general_shipping: "ข้อมูลทั่วไปและการจัดส่ง",
        subheader_general: "ข้อมูลทั่วไป",
        subheader_vendor: "ผู้ขนส่งและค่าบริการ",
        header_weight_dims: "น้ำหนักและขนาด",
        header_weight: "น้ำหนัก",
        header_dims: "ขนาด",
        lbl_origin: "ประเทศต้นทาง",
        lbl_destination: "ประเทศปลายทาง",
        lbl_goods_name: "ชื่อสินค้า",
        lbl_part_number: "รหัสสินค้า",
        lbl_hs_code: "หมายเลขศุลกากร",
        lbl_vendor: "บริษัทขนส่ง",
        lbl_chargeable: "นน./ปริมาตร ที่คิดเงิน",
        lbl_cost_origin: "ค่าขนส่ง (ต้นทาง)",
        lbl_cost_dest: "ค่าขนส่ง (ปลายทาง)",
        lbl_shipping_cost: "ค่าขนส่ง",
        lbl_price_per_piece: "ราคา / ชิ้น",
        lbl_fuel: "เชื้อเพลิง",
        lbl_other: "อื่นๆ",
        lbl_rate: "อัตราแลกเปลี่ยน",
        btn_calc: "คำนวณค่าขนส่ง",
        btn_search: "ค้นหา",
        lbl_box_exclude: "ยังไม่รวมกล่อง",
        lbl_box_include: "รวมกล่องแล้ว",
        lbl_net_weight: "น้ำหนักสุทธิ (kg)",
        lbl_pack_weight: "น้ำหนักหีบห่อ (kg)",
        lbl_gross_weight: "น้ำหนักรวม (kg)",
        lbl_total_weight: "น้ำหนักรวม (kg)",
        lbl_volume_m3: "ปริมาตร (m³)",
        lbl_net_dims: "ขนาดสุทธิ (cm)",
        lbl_pack_dims: "ขนาดหีบห่อ (cm)",
        lbl_gross_dims: "ขนาดรวม (cm)",
        lbl_gross_dims_cm3: "ปริมาตรรวม (m³)",
        lbl_grand_dims: "ขนาดรวมทั้งหมด (m³)",
        lbl_qty: "จำนวน",
        lbl_unit: "หน่วย",
        lbl_grand_vol_kg: "น้ำหนักตามปริมาตร (kg)",
        lbl_multiplier: "ตัวคูณ",
        lbl_divisor: "ตัวหาร",
        ph_qty: "จำนวน",
        ph_width: "กว้าง",
        ph_length: "ยาว",
        ph_height: "สูง",
        ph_total_net: "รวมสุทธิ",
        ph_total_pkg: "รวมหีบห่อ",
        opt_select_country: "เลือกประเทศ",
        opt_select_vendor: "เลือกบริษัทขนส่ง",
        opt_unit: "หน่วย",
        country_china: "จีน (China)",
        country_usa: "สหรัฐฯ (USA)",
        country_japan: "ญี่ปุ่น (Japan)",
        country_thailand: "ไทย (Thailand)",
        country_germany: "เยอรมนี (Germany)",
        unit_box: "กล่อง",
        unit_bottle: "ขวด",
        unit_pack: "แพ็ค",
        unit_carton: "ลัง",
        unit_dozen: "โหล",
        unit_piece: "ชิ้น",
        alert_vendor: "กรุณาเลือกบริษัทขนส่ง ก่อนคำนวณ!",
        text_origin: "ต้นทาง",
        text_dest: "ปลายทาง",
        btn_save_history: "บันทึกประวัติ",
        btn_clear: "ล้างข้อมูล",

        // Table Page
        lbl_transport_type: "ประเภทการขนส่ง:",
        opt_select_type: "เลือกประเภทการขนส่ง",
        msg_select_type: "กรุณาเลือกประเภทการขนส่งเพื่อดูตารางราคา",
        header_air_table: "ตารางราคา Air (เครื่องบิน)",
        msg_edit_step: "* แก้ไขคอลัมน์แรกเพื่อเปลี่ยนช่วงน้ำหนัก",
        header_sea_table: "ตารางราคา Sea (ทางเรือ)",
        header_land_table: "ตารางราคา Land (ทางบก)",
        col_kg_edit: "น้ำหนัก KG (แก้ไขได้)",
        col_vol_edit: "ปริมาตร m³ (แก้ไขได้)",
        col_range_edit: "ช่วงน้ำหนัก (แก้ไขได้)",
        col_price_yuan: "ราคา (หยวน)",
        col_action: "จัดการ",
        btn_add_row: "+ เพิ่มแถว",

        // History Page
        col_time: "วัน / เวลา",
        col_box_option: "ตัวเลือกกล่อง",
        col_qty: "จำนวน",
        col_unit: "หน่วย",
        col_net_weight: "น้ำหนักสุทธิ (kg)",
        col_net_dims: "ขนาดสุทธิ (cm)",
        col_dims_qty: "จำนวน (Dims)",
        col_img: "รูปภาพ",
        msg_loading: "กำลังโหลดข้อมูล...",
        msg_no_history: "ไม่พบประวัติการคำนวณ"
    },
    cn: {
        app_title_logo: "🚚 运费计算器",
        nav_table: "表格", nav_calc: "计算器", nav_history: "历史记录",
        app_title: "运费计算器",
        header_general_shipping: "常规与运输信息",
        subheader_general: "常规信息",
        subheader_vendor: "供应商与运费",
        header_weight_dims: "重量与尺寸",
        header_weight: "重量",
        header_dims: "尺寸",
        lbl_origin: "原产国",
        lbl_destination: "目的地国家",
        lbl_goods_name: "商品名称",
        lbl_part_number: "零件号",
        lbl_hs_code: "HS 编码",
        lbl_vendor: "供应商",
        lbl_chargeable: "计费重量/体积",
        lbl_cost_origin: "运费 (原产地)",
        lbl_cost_dest: "运费 (目的地)",
        lbl_shipping_cost: "运费",
        lbl_price_per_piece: "单价 / 件",
        lbl_fuel: "燃油费",
        lbl_other: "其他费用",
        lbl_rate: "汇率",
        btn_calc: "计算运费",
        btn_search: "搜索",
        lbl_box_exclude: "不含箱",
        lbl_box_include: "含箱",
        lbl_net_weight: "净重 (kg)",
        lbl_pack_weight: "包装重量 (kg)",
        lbl_gross_weight: "毛重 (kg)",
        lbl_total_weight: "总重量 (kg)",
        lbl_volume_m3: "体积 (m³)",
        lbl_net_dims: "净尺寸 (cm)",
        lbl_pack_dims: "包装尺寸 (cm)",
        lbl_gross_dims: "毛尺寸 (cm)",
        lbl_gross_dims_cm3: "毛尺寸 (m³)",
        lbl_grand_dims: "总尺寸 (m³)",
        lbl_qty: "数量",
        lbl_unit: "单位",
        lbl_grand_vol_kg: "总体积重 (kg)",
        lbl_multiplier: "乘数",
        lbl_divisor: "除数",
        ph_qty: "数量",
        ph_width: "宽",
        ph_length: "长",
        ph_height: "高",
        ph_total_net: "总净重",
        ph_total_pkg: "总包装",
        opt_select_country: "选择国家",
        opt_select_vendor: "选择供应商",
        opt_unit: "单位",
        country_china: "中国 (China)",
        country_usa: "美国 (USA)",
        country_japan: "日本 (Japan)",
        country_thailand: "泰国 (Thailand)",
        country_germany: "德国 (Germany)",
        unit_box: "箱",
        unit_bottle: "瓶",
        unit_pack: "包",
        unit_carton: "纸箱",
        unit_dozen: "打",
        unit_piece: "件",
        alert_vendor: "请先选择供应商！",
        text_origin: "原产地",
        text_dest: "目的地",
        btn_save_history: "保存到历史记录",
        btn_clear: "清除数据",

        // Table Page
        lbl_transport_type: "运输类型:",
        opt_select_type: "选择运输类型",
        msg_select_type: "请选择运输类型以查看费率。",
        header_air_table: "空运费率表",
        msg_edit_step: "* 编辑第一列以更改重量阶梯。",
        header_sea_table: "海运费率表",
        header_land_table: "陆运费率表",
        col_kg_edit: "KG (编辑)",
        col_vol_edit: "体积 m³ (编辑)",
        col_range_edit: "范围 (编辑)",
        col_price_yuan: "价格 (元)",
        col_action: "操作",
        btn_add_row: "+ 添加行",

        // History Page
        col_time: "时间 / 日期",
        col_box_option: "装箱选项",
        col_qty: "数量",
        col_unit: "单位",
        col_net_weight: "净重 (kg)",
        col_net_dims: "净尺寸 (cm)",
        col_dims_qty: "尺寸数量",
        col_img: "图片",
        msg_loading: "正在加载数据...",
        msg_no_history: "未找到历史记录"
    }
};

// =============================
// Helpers
// =============================
const toNum = (v) => Number.parseFloat(String(v).replace(/,/g, '')) || 0;
const formatNum = (n, d = 2) => (n === "" || n === undefined || isNaN(n)) ? "" : Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

function setIfElement(el, val) {
    if (el) el.value = val;
}

function formatDateTime(d = new Date()) {
    const pad = (x) => String(x).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function getCurrencyByDestination(dest) {
    switch (dest) {
        case "usa": return "USD";
        case "japan": return "JPY";
        case "germany": return "EUR";
        case "china": return "CNY";
        case "thailand": return "THB";
        default: return "";
    }
}

function getRateByDestination(dest) {
    switch (dest) {
        case "china": return 5;
        case "usa": return 34.5;
        case "japan": return 0.23;
        case "germany": return 37;
        case "thailand": return 1;
        default: return 1;
    }
}

// =============================
// Firebase History Logic
// =============================

// 1. ฟังก์ชัน Save ลง Firebase
window.saveCalculation = async function () {
    const finalCost = document.getElementById("result-destination")?.value;
    if (!finalCost) {
        alert("Please calculate shipping cost first!");
        return;
    }

    const boxOption = document.querySelector('input[name="box-option"]:checked')?.value || "-";
    const nw = document.getElementById("net-width").value || 0;
    const nl = document.getElementById("net-length").value || 0;
    const nh = document.getElementById("net-height").value || 0;
    const netDimsStr = `${nw} x ${nl} x ${nh}`;

    const imgPreview = document.getElementById("image-preview");
    let imageData = "";
    // เช็คว่ามีรูปจริงหรือไม่ (ต้องขึ้นต้นด้วย data:image)
    if (imgPreview && !imgPreview.classList.contains("hidden") && imgPreview.src.startsWith("data:image")) {
        imageData = imgPreview.src;
    }

    const entry = {
        timestamp: new Date(),
        partImage: imageData,
        origin: document.getElementById("origin-country").value,
        destination: document.getElementById("destination-country").value,
        vendor: document.getElementById("vendor").value,
        partNumber: document.getElementById("part-number").value,
        goodsName: document.getElementById("goods-name").value,
        boxOption: boxOption === 'include' ? 'Include Box' : 'Exclude Box',
        weightQty: document.getElementById("weight-qty").value,
        weightUnit: document.getElementById("weight-unit").value,
        dimsQty: document.getElementById("dimension-qty").value,
        netWeight: document.getElementById("net-weight").value,
        netDims: netDimsStr,
        actualKg: document.getElementById("manual-gross-weight")?.value || document.getElementById("total-weight").value,
        volumetricKg: document.getElementById("grand-volume").value,
        chargeableKg: document.getElementById("chargeable-weight").value,
        totalVolume: document.getElementById("total-volume").value,
        cost: toNum(finalCost),
        currency: getCurrencyByDestination(document.getElementById("destination-country").value)
    };

    await addHistoryEntry(entry);
    alert("Saved to History!");
};

// 2. ฟังก์ชันเพิ่มลง Database
window.addHistoryEntry = async function (entry) {
    try {
        await addDoc(collection(db, "history"), entry);
        console.log("History saved to Cloud!");
    } catch (e) {
        console.error("Error adding document: ", e);
        if (!e.message.includes("api-key")) {
            alert("Error saving history: " + e.message);
        }
    }
};

// 3. ฟังก์ชันดึงข้อมูล History
let allHistoryDocs = [];
let currentPage = 1;
const rowsPerPage = 10;

function initRealtimeHistory() {
    if (!document.getElementById("history-body")) return;

    try {
        const q = query(collection(db, "history"), orderBy("timestamp", "desc"));
        onSnapshot(q, (querySnapshot) => {
            allHistoryDocs = [];
            querySnapshot.forEach((doc) => {
                allHistoryDocs.push(doc.data());
            });
            renderHistoryPage(currentPage);
        }, (error) => {
            console.log("History load error:", error);
        });
    } catch (e) {
        console.log("Firestore not ready.");
    }
}

function renderHistoryPage(page) {
    const historyTableBody = document.getElementById("history-body");
    const paginationControls = document.getElementById("pagination-controls");
    if (!historyTableBody) return;

    const totalDocs = allHistoryDocs.length;
    const totalPages = Math.ceil(totalDocs / rowsPerPage) || 1;

    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;
    currentPage = page;

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageDocs = allHistoryDocs.slice(startIndex, endIndex);

    historyTableBody.innerHTML = "";
    if (pageDocs.length === 0) {
        const msg = translations[currentLang].msg_no_history || "No history found.";
        historyTableBody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 40px; color: #94a3b8;">${msg}</td></tr>`;
    } else {
        pageDocs.forEach((h) => {
            const timeStr = h.timestamp && h.timestamp.toDate ? formatDateTime(h.timestamp.toDate()) : h.time;

            // แปลงภาษา Box Option
            let boxText = h.boxOption || "-";
            if (h.boxOption === 'Include Box') boxText = translations[currentLang].lbl_box_include || "Include Box";
            if (h.boxOption === 'Exclude Box') boxText = translations[currentLang].lbl_box_exclude || "Exclude Box";

            const qty = parseFloat(String(h.weightQty).replace(/,/g, '')) || 1;
            const cost = parseFloat(h.cost) || 0;
            const pricePerPiece = cost / qty;

            let imgHtml = `<span style="color:#ccc;">-</span>`;
            if (h.partImage) {
                // สร้างรูปย่อ และใส่ onclick เพื่อเปิดดูรูปใหญ่
                imgHtml = `<img src="${h.partImage}" class="history-thumb" onclick="viewHistoryImage('${h.partImage}')" alt="img">`;
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td style="font-size: 0.8rem; color: #64748b; white-space: nowrap;">${timeStr}</td>
            <td>${h.partNumber || "-"}</td>
            <td>${h.goodsName || "-"}</td>
            <td>${boxText}</td>
            <td class="text-center">${h.weightQty || "-"}</td>
            <td>${h.weightUnit || "-"}</td>
            <td class="text-right">${h.netWeight || "-"}</td>
            <td style="font-size: 0.85rem; white-space: nowrap;">${h.netDims || "-"}</td>
            <td class="text-center">${h.dimsQty || "-"}</td>
            <td>${h.vendor === 'v01199' ? 'V 01-199' : (h.vendor === 'v01198' ? 'V 01-198' : (h.vendor || "-"))}</td>     
            <td>${h.origin || "-"}</td>

            <td class="text-right" style="font-weight: bold; color: #059669; white-space: nowrap;">
                ${h.currency || ""} ${formatNum(h.cost, 2)}
            </td>

            <td class="text-right" style="font-weight: bold; color: #0369a1; white-space: nowrap;">
                ${h.currency || ""} ${formatNum(pricePerPiece, 2)}
            </td>

            <td class="text-center">${imgHtml}</td>
            `;
            historyTableBody.appendChild(tr);
        });
    }

    if (paginationControls) {
        paginationControls.innerHTML = "";

        const prevBtn = document.createElement("button");
        prevBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;
        prevBtn.className = "page-btn";
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => renderHistoryPage(currentPage - 1);
        paginationControls.appendChild(prevBtn);

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
        if (startPage < 1) startPage = 1;

        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.onclick = () => renderHistoryPage(i);
            paginationControls.appendChild(btn);
        }

        const nextBtn = document.createElement("button");
        nextBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;
        nextBtn.className = "page-btn";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => renderHistoryPage(currentPage + 1);
        paginationControls.appendChild(nextBtn);
    }
}

// ฟังก์ชันล้างข้อมูล
window.clearFormData = function () {
    // 1. ถามยืนยัน
    const t = translations[currentLang];
    const confirmMsg = currentLang === 'th' ? "คุณแน่ใจหรือไม่ที่จะล้างข้อมูลทั้งหมด?" :
        currentLang === 'cn' ? "您确定要清除所有数据吗？" :
            "Are you sure you want to clear all data?";

    if (!confirm(confirmMsg)) return;

    // 2. ล้างค่าใน Input และ Select ส่วนใหญ่
    document.querySelectorAll('input, select').forEach(el => {
        if (el.type === 'button' || el.type === 'submit' || el.type === 'radio' || el.id === 'dimension-unit') return;

        if (el.id === 'volumetric-divisor') el.value = "500";
        else if (el.id === 'volumetric-multiplier') el.value = "200";
        else el.value = "";
    });

    // 3. จัดการช่อง Unit
    const unitEl = document.getElementById('dimension-unit');
    if (unitEl) {
        if (unitEl.tagName === 'SELECT') {
            unitEl.value = "box";
        } else {
            unitEl.value = translations[currentLang].unit_box || "Box";
        }
    }

    // 4. รีเซ็ต Radio Button
    const boxExclude = document.getElementById("box-exclude");
    if (boxExclude) boxExclude.checked = true;

    // 5. รีเซ็ต Checkbox
    const isSpecial = document.getElementById("is-special");
    if (isSpecial) isSpecial.checked = false;

    // +++ เพิ่มส่วนนี้: ล้างรูปภาพ +++
    if (partImageInput) partImageInput.value = ""; // ล้างไฟล์ใน input
    showImagePreview(null); // ซ่อนรูป preview
    // +++ จบส่วนที่เพิ่ม +++

    // 6. ลบ Session Storage และคำนวณใหม่
    sessionStorage.removeItem(FORM_STATE_KEY);

    updateWeightTotals();
    updateGrossDimensions();
    calculateShipping();
    updateCostLabels();
};

// =============================
// LocalStorage: Row Configuration
// =============================
function getInitialRates() {
    const rates = {};
    rates['dhl'] = { "0.5": 1837.60, "1.0": 2059.47, "1.5": 2281.34, "2.0": 2503.21, "2.5": 2777.72, "3.0": 2988.31, "3.5": 3198.90, "4.0": 3409.49, "4.5": 3620.08, "5.0": 3830.67, "5.5": 4017.44, "6.0": 4204.21, "6.5": 4390.98, "7.0": 4577.75, "7.5": 4764.52, "8.0": 4951.29, "8.5": 5138.06, "9.0": 5324.83, "9.5": 5511.60, "10.0": 5698.37, "10.5": 5717.17, "11.0": 5735.97, "11.5": 5754.77, "12.0": 5773.57, "12.5": 5792.37, "13.0": 5811.17, "13.5": 5829.97, "14.0": 5848.77, "14.5": 5867.57, "15.0": 5886.37, "15.5": 5905.17, "16.0": 5923.97, "16.5": 5942.77, "17.0": 5961.57, "17.5": 5980.37, "18.0": 5999.17, "18.5": 6017.97, "19.0": 6036.77, "19.5": 6055.57, "20.0": 6074.37, "20.5": 6179.67, "21.0": 6284.97, "21.5": 6390.27, "22.0": 6495.57, "22.5": 6600.87, "23.0": 6706.17, "23.5": 6811.47, "24.0": 6916.77, "24.5": 7022.07, "25.0": 7127.37, "25.5": 7232.67, "26.0": 7337.97, "26.5": 7443.27, "27.0": 7548.57, "27.5": 7653.87, "28.0": 7759.17, "28.5": 7864.47, "29.0": 7969.77, "29.5": 8075.07, "30.0": 8180.37, "31-44": 130.37, "45-70": 130.37, "71-99": 112.81, "100-299": 112.81, "> 300": 121.58 };
    rates['sf'] = { "0.5": 534.00, "1.0": 666.00, "1.5": 795.00, "2.0": 927.00, "2.5": 1056.00, "3.0": 1179.00, "3.5": 1299.00, "4.0": 1410.00, "4.5": 1530.00, "5.0": 1641.00, "5.5": 1755.00, "6.0": 1863.00, "6.5": 197.00, "7.0": 2085.00, "7.5": 2199.00, "8.0": 2307.00, "8.5": 2424.00, "9.0": 2529.00, "9.5": 2646.00, "10.0": 2754.00, "10.5": 2853.00, "11.0": 2958.00, "11.5": 3060.00, "12.0": 3162.00, "12.5": 3267.00, "13.0": 3366.00, "13.5": 3468.00, "14.0": 3573.00, "14.5": 3672.00, "15.0": 3777.00, "15.5": 3876.00, "16.0": 3975.00, "16.5": 4071.00, "17.0": 4170.00, "17.5": 4269.00, "18.0": 4368.00, "18.5": 4467.00, "19.0": 4563.00, "19.5": 4638.00, "20.0": 4740.00, "20.5": 4740.00, "21.0": 4977.00, "21.5": 4977.00, "22.0": 5214.00, "22.5": 5214.00, "23.0": 5451.00, "23.5": 5451.00, "24.0": 5688.00, "24.5": 5688.00, "25.0": 5925.00, "25.5": 5925.00, "26.0": 6162.00, "26.5": 6162.00, "27.0": 6399.00, "27.5": 6399.00, "28.0": 6636.00, "28.5": 6636.00, "29.0": 6873.00, "29.5": 6873.00, "30.0": 7110.00, "31-44": 237.00, "45-70": 237.00, "71-99": 234.00, "100-299": 234.00, "> 300": 222.00 };
    rates['ups'] = {}; rates['fedex'] = {};
    rates['v01199'] = { "1.0": 700, "other": 1000 };
    rates['v01198'] = { "0 - 10.0": 13, "10.1 - 45.0": 12, "45.1 - 100.0": 11, "100.1 - 300.0": 10, ">300": 9, "special": 18 };
    return rates;
}

function getInitialRowConfig() {
    const airRows = [];
    for (let w = 0.5; w <= 30.0; w += 0.5) airRows.push(w.toFixed(1));
    airRows.push("31-44", "45-70", "71-99", "100-299", "> 300");
    const seaRows = ["1.0", "other"];
    const landRows = ["0 - 10.0", "10.1 - 45.0", "45.1 - 100.0", "100.1 - 300.0", ">300", "special"];
    return { air: airRows, sea: seaRows, land: landRows };
}

function loadRates() {
    let rates = {};
    try {
        const stored = localStorage.getItem(RATES_KEY);
        if (stored) rates = JSON.parse(stored);
    } catch { rates = {}; }
    if (Object.keys(rates).length === 0) {
        rates = getInitialRates();
        localStorage.setItem(RATES_KEY, JSON.stringify(rates));
        saveRowConfig(getInitialRowConfig());
    }
    return rates;
}

function loadRowConfig() {
    try {
        const stored = localStorage.getItem(ROW_CONFIG_KEY);
        if (stored) return JSON.parse(stored);
    } catch { }
    const defaults = getInitialRowConfig();
    saveRowConfig(defaults);
    return defaults;
}

function saveRowConfig(config) {
    localStorage.setItem(ROW_CONFIG_KEY, JSON.stringify(config));
}

function saveRate(vendor, key, price) {
    if (!vendor) return;
    const rates = loadRates();
    if (!rates[vendor]) rates[vendor] = {};
    rates[vendor][key] = price;
    localStorage.setItem(RATES_KEY, JSON.stringify(rates));
}

function getRateFromStorage(vendor, val) {
    const rates = loadRates();
    if (!rates[vendor]) return null;
    const vendorRates = rates[vendor];
    for (const key in vendorRates) {
        if (key.includes("-")) {
            const parts = key.split("-").map(s => parseFloat(s.trim().replace(/,/g, '')));
            if (parts.length === 2 && val >= parts[0] && val <= parts[1]) {
                const priceVal = toNum(vendorRates[key]);
                if (!isNaN(priceVal)) return { type: 'per_unit', price: priceVal };
            }
        }
        if (key.includes(">")) {
            const limit = parseFloat(key.replace(/[^\d.]/g, ''));
            if (val > limit) {
                const priceVal = toNum(vendorRates[key]);
                if (!isNaN(priceVal)) return { type: 'per_unit', price: priceVal };
            }
        }
        if (key === String(val) || parseFloat(key) === val) {
            return { type: 'fixed', price: toNum(vendorRates[key]) };
        }
    }
    if (['dhl', 'fedex', 'ups', 'sf'].includes(vendor)) {
        let v = Math.ceil(val * 2) / 2;
        if (v < 0.5) v = 0.5;
        const lookupKey = v.toFixed(1);
        if (vendorRates[lookupKey]) return { type: 'fixed', price: toNum(vendorRates[lookupKey]) };
    }
    return null;
}

// =============================
// Table Generation & Drag/Drop
// =============================
function addDragEvents(tr, type, index) {
    tr.dataset.index = index;
    tr.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', String(index));
        e.dataTransfer.effectAllowed = 'move';
        requestAnimationFrame(() => this.classList.add('dragging'));
    });
    tr.addEventListener('dragend', function () {
        this.classList.remove('dragging');
        document.querySelectorAll('tr.drag-over').forEach(el => el.classList.remove('drag-over'));
        this.setAttribute('draggable', 'false');
    });
    tr.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('drag-over');
    });
    tr.addEventListener('dragleave', function () {
        this.classList.remove('drag-over');
    });
    tr.addEventListener('drop', function (e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
        const toIdx = parseInt(this.dataset.index);
        if (!isNaN(fromIdx) && !isNaN(toIdx) && fromIdx !== toIdx) {
            reorderRow(type, fromIdx, toIdx);
        }
    });
}

function createActionButtons(type, index, tr) {
    const div = document.createElement("div");
    div.className = "action-buttons";

    // Drag Handle
    const dragHandle = document.createElement("span");
    dragHandle.innerHTML = "&#9776;"; // Hamburger Icon
    dragHandle.className = "drag-handle";
    dragHandle.title = "Drag to reorder";
    dragHandle.addEventListener('mouseenter', () => { if (tr) tr.setAttribute('draggable', 'true'); });
    dragHandle.addEventListener('mouseleave', () => { if (tr) tr.setAttribute('draggable', 'false'); });
    dragHandle.addEventListener('touchstart', () => { if (tr) tr.setAttribute('draggable', 'true'); });
    div.appendChild(dragHandle);

    const btnDel = document.createElement("button");
    btnDel.textContent = "X";
    btnDel.className = "btn-delete";
    btnDel.onclick = () => deleteRow(type, index);
    div.appendChild(btnDel);
    return div;
}

function generateAirTableRows(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = "";
    const rates = loadRates();
    const config = loadRowConfig();
    const vendors = ['dhl', 'fedex', 'ups', 'sf'];
    config.air.forEach((rowKey, index) => {
        const tr = document.createElement("tr");
        const tdAction = document.createElement("td");
        tdAction.appendChild(createActionButtons('air', index, tr));
        addDragEvents(tr, 'air', index);

        const tdKg = document.createElement("td");
        tdKg.contentEditable = "true";
        tdKg.textContent = rowKey;
        tdKg.className = "row-key";
        tdKg.dataset.oldValue = rowKey;
        tdKg.addEventListener("focus", function () { this.dataset.oldValue = this.textContent.trim(); });
        tdKg.addEventListener("blur", function () {
            const newVal = this.textContent.trim();
            const oldVal = this.dataset.oldValue;
            if (newVal && newVal !== oldVal) {
                renameRowKey('air', oldVal, newVal);
                generateAirTableRows(tbodyId);
            }
        });
        tr.appendChild(tdKg);
        vendors.forEach(v => {
            const tdPrice = document.createElement("td");
            tdPrice.contentEditable = "true";
            const val = rates[v]?.[rowKey] || "";
            tdPrice.textContent = val ? formatNum(val, 2) : "";
            tdPrice.addEventListener("input", function () { saveRate(v, rowKey, this.textContent.trim()); });
            tr.appendChild(tdPrice);
        });
        tr.appendChild(tdAction);
        tbody.appendChild(tr);
    });
}

function generateV01198Rows(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = "";
    const vendor = "v01198";
    const rates = loadRates();
    const config = loadRowConfig();
    const vendorRates = rates[vendor] || {};
    config.land.forEach((rowKey, index) => {
        const tr = document.createElement("tr");
        const tdAction = document.createElement("td");
        tdAction.appendChild(createActionButtons('land', index, tr));
        addDragEvents(tr, 'land', index);

        const tdRange = document.createElement("td");
        tdRange.contentEditable = "true";
        tdRange.textContent = rowKey;
        tdRange.className = "row-key";
        tdRange.dataset.oldValue = rowKey;
        tdRange.addEventListener("focus", function () { this.dataset.oldValue = this.textContent.trim(); });
        tdRange.addEventListener("blur", function () {
            const newVal = this.textContent.trim();
            const oldVal = this.dataset.oldValue;
            if (newVal && newVal !== oldVal) {
                renameRowKey('land', oldVal, newVal);
                generateV01198Rows(tbodyId);
            }
        });
        tr.appendChild(tdRange);
        const tdPrice = document.createElement("td");
        tdPrice.contentEditable = "true";
        let storedVal = vendorRates[rowKey];
        tdPrice.textContent = storedVal ? formatNum(storedVal, 2) : "";
        tdPrice.addEventListener("input", function () { saveRate(vendor, rowKey, this.textContent.trim()); });
        tr.appendChild(tdPrice);
        tr.appendChild(tdAction);
        tbody.appendChild(tr);
    });
}

function generateV01199Rows(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = "";
    const vendor = "v01199";
    const rates = loadRates();
    const config = loadRowConfig();
    const vendorRates = rates[vendor] || {};
    config.sea.forEach((rowKey, index) => {
        const tr = document.createElement("tr");
        const tdAction = document.createElement("td");
        tdAction.appendChild(createActionButtons('sea', index, tr));
        addDragEvents(tr, 'sea', index);

        const tdLabel = document.createElement("td");
        tdLabel.contentEditable = "true";
        tdLabel.textContent = rowKey;
        tdLabel.className = "row-key";
        tdLabel.dataset.oldValue = rowKey;
        tdLabel.addEventListener("focus", function () { this.dataset.oldValue = this.textContent.trim(); });
        tdLabel.addEventListener("blur", function () {
            const newVal = this.textContent.trim();
            const oldVal = this.dataset.oldValue;
            if (newVal && newVal !== oldVal) {
                renameRowKey('sea', oldVal, newVal);
                generateV01199Rows(tbodyId);
            }
        });
        tr.appendChild(tdLabel);
        const tdPrice = document.createElement("td");
        tdPrice.contentEditable = "true";
        let displayPrice = vendorRates[rowKey];
        tdPrice.textContent = displayPrice ? formatNum(displayPrice, 2) : "";
        tdPrice.addEventListener("input", function () { saveRate(vendor, rowKey, this.textContent.trim()); });
        tr.appendChild(tdPrice);
        tr.appendChild(tdAction);
        tbody.appendChild(tr);
    });
}

function refreshTableByType(type) {
    if (type === 'air') generateAirTableRows("tbody-air");
    else if (type === 'sea') generateV01199Rows("tbody-v01199");
    else if (type === 'land') generateV01198Rows("tbody-v01198");
}

function getVendorsByType(type) {
    if (type === 'air') return ['dhl', 'fedex', 'ups', 'sf'];
    if (type === 'sea') return ['v01199'];
    if (type === 'land') return ['v01198'];
    return [];
}

window.addNewRow = function (type) {
    const config = loadRowConfig();
    const newKey = "New Row " + (config[type].length + 1);
    config[type].push(newKey);
    saveRowConfig(config);
    refreshTableByType(type);
}

function renameRowKey(type, oldKey, newKey) {
    if (oldKey === newKey) return;
    const config = loadRowConfig();
    const index = config[type].indexOf(oldKey);
    if (index !== -1) {
        config[type][index] = newKey;
        saveRowConfig(config);
    }
    const rates = loadRates();
    let vendors = getVendorsByType(type);
    vendors.forEach(v => {
        if (rates[v] && rates[v][oldKey] !== undefined) {
            rates[v][newKey] = rates[v][oldKey];
            delete rates[v][oldKey];
        }
    });
    localStorage.setItem(RATES_KEY, JSON.stringify(rates));
}

function deleteRow(type, index) {
    if (!confirm("Are you sure you want to delete this row?")) return;
    const config = loadRowConfig();
    const keyToRemove = config[type][index];
    config[type].splice(index, 1);
    saveRowConfig(config);
    const rates = loadRates();
    let vendors = getVendorsByType(type);
    vendors.forEach(v => {
        if (rates[v]) delete rates[v][keyToRemove];
    });
    localStorage.setItem(RATES_KEY, JSON.stringify(rates));
    refreshTableByType(type);
}

function reorderRow(type, fromIndex, toIndex) {
    const config = loadRowConfig();
    const list = config[type];
    if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) return;
    const [movedItem] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, movedItem);
    saveRowConfig(config);
    refreshTableByType(type);
}

// =============================
// SessionStorage
// =============================
function saveFormState() {
    let state = {};
    try {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        if (stored) state = JSON.parse(stored);
    } catch (e) { state = {}; }

    document.querySelectorAll('input, select').forEach(el => {
        if (!el.id) return;

        // +++ เพิ่มบรรทัดนี้ครับ: เพื่อบอกว่า "ไม่ต้องจำค่าของ vendor-select" +++
        if (el.id === 'vendor-select') return;

        if (el.type === 'checkbox' || el.type === 'radio') state[el.id] = el.checked;
        else state[el.id] = el.value;
    });
    sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(state));
}

function loadFormState() {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const navType = navEntry ? navEntry.type : "";
    const isReload = navType === 'reload' || (window.performance && window.performance.navigation && window.performance.navigation.type === 1);
    if (isReload) { sessionStorage.removeItem(FORM_STATE_KEY); return; }

    const raw = sessionStorage.getItem(FORM_STATE_KEY);
    if (!raw) return;
    const state = JSON.parse(raw);
    for (const id in state) {
        if (id === 'vendor-select') continue;

        // ข้ามข้อมูลรูปภาพใน loop นี้ (เราจัดการแยกด้านล่าง)
        if (id === 'part-image-data') continue;

        const el = document.getElementById(id);
        if (el) {
            if (el.type === 'checkbox' || el.type === 'radio') el.checked = state[id];
            else el.value = state[id];
        }
    }

    // +++ เพิ่มส่วนนี้: โหลดรูปภาพกลับมาแสดง +++
    if (state['part-image-data']) {
        showImagePreview(state['part-image-data']);
    }
    // +++ จบส่วนที่เพิ่ม +++

    updateWeightTotals();
    updateGrossDimensions();
    updateVolumeFromWeight();
    updateGrandVolumeDisplay();
    calculateShipping();
    updateCostLabels();
}

// =============================
// Language Handling
// =============================
function setLanguage(lang) {
    if (!translations[lang]) return;
    localStorage.setItem(LANG_KEY, lang);
    currentLang = lang;

    document.querySelectorAll('.lang-switch a').forEach(el => {
        el.classList.toggle('active', el.id === `lang-${lang}`);
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT') el.type === 'button' ? el.value = translations[lang][key] : el.placeholder = translations[lang][key];
            else if (el.tagName === 'OPTGROUP') el.label = translations[lang][key];
            else el.textContent = translations[lang][key];
        }
    });

    // Re-render history table to apply translations to body content
    if (document.getElementById("history-body")) {
        renderHistoryPage(currentPage);
    }
    updateCostLabels();
}

function updateCostLabels() {
    const t = translations[currentLang];
    const origin = originCountrySelect?.value || "";
    const originCurr = getCurrencyByDestination(origin);
    if (costLabelOrigin) costLabelOrigin.textContent = originCurr ? `${t.lbl_shipping_cost} (${originCurr})` : t.lbl_cost_origin;
    const dest = destinationCountrySelect?.value || "";
    const destCurr = getCurrencyByDestination(dest);
    if (costLabelDest) costLabelDest.textContent = destCurr ? `${t.lbl_shipping_cost} (${destCurr})` : t.lbl_cost_dest;
}

// =============================
// Main Calculations
// =============================
function updateTotalNetWeight() {
    const net = toNum(netWeightInput?.value);
    const qty = Math.max(1, toNum(weightQtyInput?.value) || 1);
    const totalNet = net * qty;
    setIfElement(totalNetWeightInput, totalNet ? formatNum(totalNet, 1) : "");
    return totalNet;
}

function updateVolumeFromWeight() {
    const totalKg = toNum(manualGrossWeightInput?.value) || toNum(totalWeightInput?.value);
    const vendor = vendorSelect?.value || "";
    const divisor = toNum(volumetricDivisorInput?.value) || 500;
    let m3 = 0;

    if (vendor === 'v01199') {
        if (divisor > 0) {
            m3 = totalKg / divisor;
            // [แก้ไข] ปัดเศษขึ้นในทศนิยมตำแหน่งที่ 1 (เช่น 1.24 -> 1.3)
            m3 = Math.ceil(m3 * 10) / 10;
        }
    } else {
        m3 = (totalKg * divisor) / 1_000_000;
    }

    setIfElement(volumeFromWeightOutput, totalKg ? formatNum(m3, 1) : "");
}
function updateWeightTotals() {
    const totalNet = updateTotalNetWeight();
    const pkg = toNum(addWeightInput?.value);
    const pkgQty = Math.max(1, toNum(packagingQtyInput?.value) || 1);
    const totalPkg = pkg * pkgQty;
    setIfElement(totalPackagingWeightInput, totalPkg ? formatNum(totalPkg, 1) : "");
    const radioInclude = document.getElementById("box-include");
    const isIncludeBox = radioInclude && radioInclude.checked;
    let grandTotal = isIncludeBox ? totalNet : totalNet + totalPkg;
    if (grandTotal > 0) grandTotal = Math.ceil(grandTotal * 2) / 2;
    setIfElement(totalWeightInput, grandTotal ? formatNum(grandTotal, 1) : "");
    updateVolumeFromWeight();
}

function updateGrossDimensions() {
    const w = toNum(netWInput?.value) + toNum(addWInput?.value);
    const l = toNum(netLInput?.value) + toNum(addLInput?.value);
    const h = toNum(netHInput?.value) + toNum(addHInput?.value);
    setIfElement(grossWInput, (w || w === 0) ? formatNum(w, 0) : "");
    setIfElement(grossLInput, (l || l === 0) ? formatNum(l, 0) : "");
    setIfElement(grossHInput, (h || h === 0) ? formatNum(h, 0) : "");
    updateVolumes();
}

function updateGrandVolumeDisplay() {
    const vendor = vendorSelect?.value || "";
    const m3 = toNum(manualTotalVolumeInput?.value) || toNum(totalVolumeInput?.value);
    let grandKg = 0;
    if (vendor === 'v01198') {
        const multiplier = toNum(volumetricMultiplierInput?.value) || 200;
        grandKg = m3 * multiplier;
    } else {
        const divisor = toNum(volumetricDivisorInput?.value) || 500;
        if (divisor > 0) grandKg = (m3 * 1_000_000) / divisor;
    }
    setIfElement(grandVolumeInput, grandKg ? formatNum(grandKg, 1) : "");
}

function updateVolumes() {
    const gw = toNum(grossWInput?.value);
    const gl = toNum(grossLInput?.value);
    const gh = toNum(grossHInput?.value);
    const grossCm3 = gw * gl * gh;
    const grossM3 = grossCm3 / 1_000_000;
    setIfElement(grossVolumeInput, grossCm3 ? formatNum(grossM3, 1) : "");
    const qty = Math.max(1, toNum(dimensionQtyInput?.value) || 1);
    let totalM3 = grossM3 * qty;
    if (totalM3 > 0) totalM3 = Math.ceil(totalM3 * 2) / 2;
    setIfElement(totalVolumeInput, totalM3 ? formatNum(totalM3, 1) : "");
    updateGrandVolumeDisplay();
}

function calculateShipping() {
    const vendor = vendorSelect?.value || "";
    let finalChargeable = 0;

    // เตรียมตัวแปรสำหรับข้อความที่มา
    let sourceMsg = "";
    const t = translations[currentLang] || translations['en'];
    const sourceDiv = document.getElementById("chargeable-source");

    // Element ที่เป็นคู่แข่งกัน (Input Fields)
    const elTotalWeight = document.getElementById("total-weight");      // Gross Weight
    const elGrandVolKg = document.getElementById("grand-volume");      // Grand Volume (kg)
    const elVolFromWt = document.getElementById("Volume");            // Volume from Weight (m3)
    const elTotalVolM3 = document.getElementById("total-volume");      // Grand Dimensions (m3)

    // ฟังก์ชันช่วยเคลียร์สีเดิมออกก่อนคำนวณใหม่
    const clearHighlights = () => {
        [elTotalWeight, elGrandVolKg, elVolFromWt, elTotalVolM3].forEach(el => {
            if (el) {
                el.classList.remove("input-winner", "input-loser");
            }
        });
    };
    clearHighlights();

    if (!vendor) {
        setIfElement(chargeableInput, "");
        if (sourceDiv) sourceDiv.textContent = "";
        if (resultBoxOrigin) resultBoxOrigin.value = "";
        if (resultBoxDest) resultBoxDest.value = "";
        if (pricePerPieceInput) pricePerPieceInput.value = "";
        if (fuelAmountInput) fuelAmountInput.value = "";
        return;
    }

    const weightVal = toNum(manualGrossWeightInput?.value) || toNum(totalWeightInput?.value);
    let baseCost = 0;

    // --- CASE 1: Sea (v01199) ---
    if (vendor === 'v01199') {
        updateVolumeFromWeight();
        const valVolWeight = toNum(volumeFromWeightOutput?.value); // m3 (จากน้ำหนัก)
        let valGrandDim = toNum(totalVolumeInput?.value);          // m3 (จากขนาด)

        if (valGrandDim < 1) valGrandDim = 1;

        // เทียบหาค่ามากสุด
        let rawMax = Math.max(valVolWeight, valGrandDim);

        // ตรวจสอบที่มา และ ไฮไลท์ช่อง Input
        if (valVolWeight > valGrandDim) {
            sourceMsg = t.text_src_weight;
            // Winner: Volume (m3) ช่องบน, Loser: Grand Dimensions (m3) ช่องล่าง
            if (elVolFromWt) elVolFromWt.classList.add("input-winner");
            if (elTotalVolM3) elTotalVolM3.classList.add("input-loser");
        } else {
            sourceMsg = t.text_src_vol;
            // Winner: Grand Dimensions (m3) ช่องล่าง, Loser: Volume (m3) ช่องบน
            if (elTotalVolM3) elTotalVolM3.classList.add("input-winner");
            if (elVolFromWt) elVolFromWt.classList.add("input-loser");
        }

        // Logic ปัดเศษ 0.5
        finalChargeable = Math.ceil(rawMax * 2) / 2;

        const rates = loadRates();
        const vRates = rates[vendor] || {};
        const a = toNum(vRates["1.0"]);
        const b = toNum(vRates["other"]);
        baseCost = (a * finalChargeable) + b;

        // --- CASE 2: Air / Land ---
    } else {
        let calcM3 = toNum(manualTotalVolumeInput?.value) || toNum(totalVolumeInput?.value);
        const totalCm3 = calcM3 * 1_000_000;
        let volKg = 0;

        if (vendor === 'v01198') { // Land
            const multiplier = toNum(volumetricMultiplierInput?.value) || 200;
            volKg = calcM3 * multiplier;
        } else { // Air
            const divisor = toNum(volumetricDivisorInput?.value) || VOLUMETRIC_DIVISOR;
            if (divisor > 0) volKg = totalCm3 / divisor;
        }

        // เทียบหาค่ามากสุด
        const chargeable = Math.max(weightVal, volKg);

        // ตรวจสอบที่มา และ ไฮไลท์ช่อง Input
        if (weightVal >= volKg) {
            sourceMsg = t.text_src_gross;
            // Winner: Gross Weight, Loser: Grand Volume (kg)
            if (elTotalWeight) elTotalWeight.classList.add("input-winner");
            if (elGrandVolKg) elGrandVolKg.classList.add("input-loser");
        } else {
            sourceMsg = t.text_src_vol_weight;
            // Winner: Grand Volume (kg), Loser: Gross Weight
            if (elGrandVolKg) elGrandVolKg.classList.add("input-winner");
            if (elTotalWeight) elTotalWeight.classList.add("input-loser");
        }

        finalChargeable = chargeable;
        const lookupValue = chargeable;

        let customRate = getRateFromStorage(vendor, lookupValue);

        if (isSpecialCheckbox && isSpecialCheckbox.checked) {
            const rates = loadRates();
            if (rates[vendor] && rates[vendor]["special"]) {
                const specialPrice = toNum(rates[vendor]["special"]);
                if (specialPrice > 0) customRate = { type: 'per_unit', price: specialPrice };
            }
        }

        if (customRate) {
            baseCost = (customRate.type === 'fixed') ? customRate.price : (lookupValue * customRate.price);
        } else {
            if (vendor === "v01198") {
                let p = 10;
                if (chargeable <= 10) p = 13;
                else if (chargeable <= 45) p = 12;
                else if (chargeable <= 100) p = 11;
                baseCost = chargeable * p;
            } else {
                const mul = (vendor === 'dhl') ? 1.15 : (vendor === 'fedex') ? 1.1 : 1.0;
                baseCost = chargeable * 50 * mul;
            }
        }
    }

    // อัปเดต UI
    if (sourceDiv) sourceDiv.textContent = sourceMsg;
    setIfElement(chargeableInput, formatNum(finalChargeable, 1));

    const exchange = toNum(rateInput?.value) || 1;
    const fuel = baseCost * (toNum(fuelPercentInput?.value) / 100);
    const other = toNum(otherInput?.value);

    setIfElement(fuelAmountInput, formatNum(fuel));

    const finalCost = (baseCost + fuel + other) * exchange;

    if (resultBoxOrigin) resultBoxOrigin.value = formatNum(baseCost);
    if (resultBoxDest) resultBoxDest.value = formatNum(finalCost);

    const qty = Math.max(1, toNum(weightQtyInput?.value) || 1);
    setIfElement(pricePerPieceInput, formatNum(finalCost / qty));
}

// Events
const inputsToWatch = [netWeightInput, weightQtyInput, addWeightInput, packagingQtyInput, manualGrossWeightInput, volumetricDivisorInput];
inputsToWatch.forEach(el => el?.addEventListener("input", () => { updateWeightTotals(); calculateShipping(); }));
const dimInputs = [netWInput, netLInput, netHInput, addWInput, addLInput, addHInput, grossWInput, grossLInput, grossHInput, dimensionQtyInput, manualTotalVolumeInput];
dimInputs.forEach(el => el?.addEventListener("input", () => { updateGrossDimensions(); calculateShipping(); }));
volumetricMultiplierInput?.addEventListener("input", () => { updateGrandVolumeDisplay(); calculateShipping(); });
volumetricDivisorInput?.addEventListener("input", () => { updateVolumeFromWeight(); updateGrandVolumeDisplay(); calculateShipping(); });
vendorSelect?.addEventListener("change", () => { updateVolumeFromWeight(); updateGrandVolumeDisplay(); calculateShipping(); });
rateInput?.addEventListener("input", calculateShipping);
fuelPercentInput?.addEventListener("input", calculateShipping);
otherInput?.addEventListener("input", calculateShipping);
document.getElementById("is-special")?.addEventListener("change", calculateShipping);
originCountrySelect?.addEventListener("change", () => { updateCostLabels(); calculateShipping(); });
destinationCountrySelect?.addEventListener("change", () => { if (rateInput) rateInput.value = getRateByDestination(destinationCountrySelect.value); updateCostLabels(); calculateShipping(); });

if (btnEn) btnEn.addEventListener("click", (e) => { e.preventDefault(); setLanguage("en"); });
if (btnTh) btnTh.addEventListener("click", (e) => { e.preventDefault(); setLanguage("th"); });
if (btnCn) btnCn.addEventListener("click", (e) => { e.preventDefault(); setLanguage("cn"); });

if (tableVendorSelect) {
    tableVendorSelect.addEventListener("change", function () {
        [tablePlaceholder, viewAir, viewSea, viewLand].forEach(el => el?.classList.add("hidden"));
        if (this.value === "") tablePlaceholder?.classList.remove("hidden");
        else if (this.value === "air") { viewAir?.classList.remove("hidden"); generateAirTableRows("tbody-air"); }
        else if (this.value === "sea") { viewSea?.classList.remove("hidden"); generateV01199Rows("tbody-v01199"); }
        else if (this.value === "land") { viewLand?.classList.remove("hidden"); generateV01198Rows("tbody-v01198"); }
    });
}

const allInputs = document.querySelectorAll('input[type="text"], input[type="number"]');
const textFields = ["goods-name", "part-number", "hs-code"];
allInputs.forEach(el => {
    el.addEventListener("focus", function () {
        if (this.value && !textFields.includes(this.id)) this.value = this.value.replace(/,/g, '');
        this.select();
    });
    el.addEventListener("blur", function () {
        if (this.value && !this.readOnly && !textFields.includes(this.id)) {
            const v = toNum(this.value);
            const isDim = this.id.includes("width") || this.id.includes("length") || this.id.includes("height");
            const isThreeDecimal = this.id.includes("Volume") || this.id.includes("dimensions") || this.id.includes("gross-weight") || this.id === "net-weight" || this.id === "add-weight";
            const decimals = isDim ? 0 : (isThreeDecimal ? 3 : 2);
            if (this.id === "gross-volume") this.value = formatNum(v, 1);
            else {
                const isIntField = this.id.includes("qty") || this.id.includes("divisor") || this.id.includes("multiplier");
                this.value = isIntField ? formatNum(v, 0) : formatNum(v, decimals);
            }
        }
    });
});

// =========================================
// [แก้ไข] ฟังก์ชันค้นหา Part Number และเติมข้อมูล
// =========================================
async function searchAndFillByPartNumber() {
    const partNumberInput = document.getElementById("part-number");
    const pNum = partNumberInput.value.trim();

    // ถ้าไม่มีข้อมูล ไม่ต้องทำอะไร
    if (!pNum) return;

    try {
        // 1. ค้นหาใน Firebase collection 'history' โดยหา Part Number ที่ตรงกัน
        const q = query(collection(db, "history"), where("partNumber", "==", pNum));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No history found for this Part Number.");
            return;
        }

        // 2. หาข้อมูลล่าสุด
        let docs = [];
        querySnapshot.forEach((doc) => {
            docs.push(doc.data());
        });

        // เรียงลำดับจากวันที่ล่าสุดไปเก่าสุด
        docs.sort((a, b) => {
            const timeA = a.timestamp && a.timestamp.seconds ? a.timestamp.seconds : 0;
            const timeB = b.timestamp && b.timestamp.seconds ? b.timestamp.seconds : 0;
            return timeB - timeA;
        });

        const latestData = docs[0];

        // 3. เติมข้อมูลลงฟอร์มทันที (Uncommented & Active)
        console.log("Found data, filling form...", latestData); // เช็คใน Console
        fillFormWithData(latestData);

    } catch (error) {
        console.error("Error searching part number:", error);
    }
}

// =========================================
// [เพิ่มใหม่] Part Number Autocomplete Logic
// =========================================
let debounceTimer;

function setupPartNumberAutocomplete() {
    const input = document.getElementById("part-number");
    const suggestionBox = document.getElementById("suggestion-box");

    if (!input || !suggestionBox) return;

    // 1. ดักจับการพิมพ์ (Input Event)
    input.addEventListener("input", function () {
        const text = this.value.trim();

        // Clear Timeout เดิม (Debounce: รอให้หยุดพิมพ์แป๊บนึงค่อยหา)
        clearTimeout(debounceTimer);

        if (text.length < 1) {
            suggestionBox.classList.add("hidden");
            suggestionBox.innerHTML = "";
            return;
        }

        debounceTimer = setTimeout(() => fetchSuggestions(text), 300);
    });

    // 2. ซ่อนเมื่อคลิกที่อื่น
    document.addEventListener("click", function (e) {
        if (e.target !== input && e.target !== suggestionBox) {
            suggestionBox.classList.add("hidden");
        }
    });
}

async function fetchSuggestions(text) {
    const suggestionBox = document.getElementById("suggestion-box");

    try {
        // ค้นหาคำที่ "ขึ้นต้นด้วย" text (ใช้เทคนิค str + '\uf8ff')
        const q = query(
            collection(db, "history"),
            orderBy("partNumber"),
            startAt(text),
            endAt(text + "\uf8ff"),
            limit(10) // เอาแค่ 10 รายการ
        );

        const querySnapshot = await getDocs(q);
        const uniqueParts = new Set();
        const suggestions = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.partNumber && !uniqueParts.has(data.partNumber)) {
                uniqueParts.add(data.partNumber);
                suggestions.push(data);
            }
        });

        renderSuggestions(suggestions);

    } catch (error) {
        console.error("Autocomplete error:", error);
    }
}

function renderSuggestions(list) {
    const suggestionBox = document.getElementById("suggestion-box");
    suggestionBox.innerHTML = "";

    // [แก้ไข] กรณีไม่เจอข้อมูล: ให้แสดงข้อความว่า "ไม่พบข้อมูล"
    if (list.length === 0) {
        const li = document.createElement("li");

        // ตกแต่งให้ดูเป็นข้อความแจ้งเตือน (สีเทา, กดไม่ได้)
        li.style.color = "#94a3b8";
        li.style.cursor = "default";
        li.style.justifyContent = "center";
        li.style.fontStyle = "italic";

        // ใช้คำแปลที่มีอยู่แล้วในระบบ (msg_no_history)
        // TH: "ไม่พบประวัติการคำนวณ", EN: "No history found."
        const msg = translations[currentLang]?.msg_no_history || "No Data";
        li.textContent = msg;

        suggestionBox.appendChild(li);
        suggestionBox.classList.remove("hidden"); // บังคับให้กล่องแสดงผล
        return;
    }

    // กรณีเจอข้อมูล (โค้ดเดิม)
    list.forEach(item => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="suggestion-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <span>${item.partNumber}</span> <span style="font-size:0.8em; color:#94a3b8; margin-left:auto;">(${item.goodsName || '-'})</span>
        `;

        li.addEventListener("click", () => {
            document.getElementById("part-number").value = item.partNumber;
            suggestionBox.classList.add("hidden");
            fillFormWithData(item);
        });

        suggestionBox.appendChild(li);
    });

    suggestionBox.classList.remove("hidden");
}

// ฟังก์ชันช่วยเติมข้อมูลลงฟอร์ม (รวมถึงรูปภาพ)
function fillFormWithData(data) {
    // 1. General Info
    if (data.goodsName) document.getElementById("goods-name").value = data.goodsName;
    if (data.origin) document.getElementById("origin-country").value = data.origin;
    if (data.destination) {
        document.getElementById("destination-country").value = data.destination;
        if (document.getElementById("rate")) document.getElementById("rate").value = getRateByDestination(data.destination);
    }

    // 2. Vendor
    if (data.vendor) document.getElementById("vendor").value = data.vendor;

    // 3. Box Option
    if (data.boxOption) {
        // รองรับทั้งค่าแบบ Text เก่าและ value ใหม่
        if (data.boxOption === 'Include Box' || data.boxOption === 'include') {
            document.getElementById("box-include").checked = true;
        } else {
            document.getElementById("box-exclude").checked = true;
        }
    }

    // 4. Weight & Qty
    if (data.netWeight) document.getElementById("net-weight").value = data.netWeight;
    if (data.weightQty) document.getElementById("weight-qty").value = data.weightQty;
    if (data.weightUnit) document.getElementById("weight-unit").value = data.weightUnit;

    // 5. Dimensions (แยก string "WxLxH" กลับเป็นช่องๆ)
    if (data.netDims) {
        const parts = data.netDims.split("x").map(s => s.trim());
        if (parts.length === 3) {
            document.getElementById("net-width").value = parts[0];
            document.getElementById("net-length").value = parts[1];
            document.getElementById("net-height").value = parts[2];
        }
    }

    // 6. Dims Qty
    if (data.dimsQty) document.getElementById("dimension-qty").value = data.dimsQty;

    // ==================================================
    // 7. ส่วนจัดการรูปภาพ (Image Handling) - แก้ไขล่าสุด
    // ==================================================
    const imgPreview = document.getElementById("image-preview");
    const cameraIcon = document.getElementById("camera-icon");
    const partImageInput = document.getElementById("part-image-input");

    if (data.partImage) {
        // กรณีมีรูปใน History: ให้แสดงรูปและซ่อนไอคอนกล้อง
        if (imgPreview) {
            imgPreview.src = data.partImage;
            imgPreview.classList.remove("hidden");
        }
        if (cameraIcon) cameraIcon.classList.add("hidden");

        // บันทึกลง Session Storage (เพื่อให้รูปอยู่ต่อ ถ้าเผลอ Refresh หน้า)
        try {
            let state = JSON.parse(sessionStorage.getItem(FORM_STATE_KEY) || "{}");
            state['part-image-data'] = data.partImage;
            sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(state));
        } catch (err) {
            console.log("Storage error", err);
        }

    } else {
        // กรณีไม่มีรูปใน History: ให้เคลียร์รูปเก่าออก (ถ้ามี) เพื่อไม่ให้สับสน
        if (imgPreview) {
            imgPreview.src = "";
            imgPreview.classList.add("hidden");
        }
        if (cameraIcon) cameraIcon.classList.remove("hidden");
        if (partImageInput) partImageInput.value = ""; // ล้างค่าไฟล์ input

        // ลบออกจาก Session Storage ด้วย
        try {
            let state = JSON.parse(sessionStorage.getItem(FORM_STATE_KEY) || "{}");
            delete state['part-image-data'];
            sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(state));
        } catch (err) { }
    }
    // ==================================================

    // 8. สั่งคำนวณตัวเลขใหม่ทั้งหมดตามข้อมูลที่เพิ่งใส่
    updateWeightTotals();
    updateGrossDimensions();
    calculateShipping();
    updateCostLabels();
}

// =============================
// Image Upload Handling
// =============================
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const base64String = event.target.result;

            // แสดงรูป
            showImagePreview(base64String);

            // บันทึกลง Session Storage (เพื่อให้รูปอยู่ต่อ แม้ Refresh หน้า)
            try {
                let state = JSON.parse(sessionStorage.getItem(FORM_STATE_KEY) || "{}");
                state['part-image-data'] = base64String;
                sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(state));
            } catch (err) {
                console.log("Storage full or error", err);
            }
        };
        reader.readAsDataURL(file);
    }
}

function showImagePreview(src) {
    if (src) {
        imagePreview.src = src;
        imagePreview.classList.remove("hidden");
        cameraIcon.classList.add("hidden");
    } else {
        imagePreview.src = "";
        imagePreview.classList.add("hidden");
        cameraIcon.classList.remove("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. ตั้งค่าภาษาเริ่มต้น
    setLanguage(localStorage.getItem(LANG_KEY) || "en");

    // 2. โหลด History และสถานะฟอร์ม
    initRealtimeHistory();
    loadFormState();

    // 3. ป้องกันการลาก Input และบันทึกสถานะ
    document.querySelectorAll('input, select').forEach(el => {
        el.setAttribute('draggable', 'false');
        el.addEventListener('dragstart', (e) => { e.preventDefault(); });
        el.addEventListener('change', saveFormState);
        el.addEventListener('input', saveFormState);
    });

    // 4. ฟังชั่น Radio Button
    const radioButtons = document.querySelectorAll('input[name="box-option"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            updateWeightTotals();
            calculateShipping();
            saveFormState();
        });
    });

    // 5. เมนู Hamburger
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    // 6. เชื่อมต่อฟังก์ชันค้นหา Part Number
    const partNumberInput = document.getElementById("part-number");
    if (partNumberInput) {
        partNumberInput.addEventListener("change", searchAndFillByPartNumber);
    }

    // 7. เริ่มระบบ Autocomplete
    setupPartNumberAutocomplete();

    // +++ เพิ่มส่วนนี้: Event Listener สำหรับการอัปโหลดรูป +++
    if (partImageInput) {
        partImageInput.addEventListener("change", handleImageUpload);
    }
    // +++ จบส่วนที่เพิ่ม +++

    // 8. กด Enter เพื่อไปช่องถัดไป
    document.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;

        const target = e.target;
        const isInput = target.tagName === "INPUT" || target.tagName === "SELECT";
        const isReadOnly = target.hasAttribute("readonly");
        const isButton = target.type === "button" || target.type === "submit";

        if (isInput && !isReadOnly && !isButton) {
            e.preventDefault();
            const focusableElements = Array.from(
                document.querySelectorAll("input:not([type='hidden']):not([disabled]):not([readonly]), select:not([disabled])")
            );

            const index = focusableElements.indexOf(target);
            if (index > -1 && index < focusableElements.length - 1) {
                const nextElement = focusableElements[index + 1];
                nextElement.focus();
                if (nextElement.select && nextElement.type !== "checkbox" && nextElement.type !== "radio") {
                    nextElement.select();
                }
            }
        }
    });
});

// =============================
// Image Viewer Logic (With Zoom)
// =============================
let currentZoom = 1;

window.viewHistoryImage = function (src) {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");

    if (modal && modalImg) {
        modalImg.src = src;
        modal.classList.remove("hidden");

        // รีเซ็ตค่าซูมทุกครั้งที่เปิดรูปใหม่
        currentZoom = 1;
        updateImageZoom();
    }
};

window.closeImageModal = function () {
    const modal = document.getElementById("image-modal");
    if (modal) modal.classList.add("hidden");
};

window.adjustZoom = function (delta) {
    currentZoom += delta;

    // จำกัดการซูม (ต่ำสุด 0.5x, สูงสุด 5x)
    if (currentZoom < 0.5) currentZoom = 0.5;
    if (currentZoom > 5.0) currentZoom = 5.0;

    updateImageZoom();
};

window.resetZoom = function () {
    currentZoom = 1;
    updateImageZoom();
};

function updateImageZoom() {
    const img = document.getElementById("modal-img");
    if (img) {
        img.style.transform = `scale(${currentZoom})`;
    }
}

// เพิ่มฟังก์ชันใช้ Mouse Wheel หมุนเพื่อซูม
document.addEventListener("DOMContentLoaded", () => {
    // ... (Existing DOMContentLoaded code) ...

    // หา element รูปภาพใน Modal เพื่อดักจับ Mouse Wheel
    const modalImg = document.getElementById("modal-img");
    if (modalImg) {
        modalImg.addEventListener("wheel", function (e) {
            e.preventDefault(); // ป้องกันหน้าเว็บเลื่อน

            // ถ้าหมุนขึ้น (deltaY < 0) ให้ซูมเข้า, หมุนลงให้ซูมออก
            const delta = e.deltaY < 0 ? 0.1 : -0.1;
            window.adjustZoom(delta);
        });
    }
});

// =============================
// Export PDF Logic
// =============================
window.exportHistoryToPDF = function () {
    // ตรวจสอบว่ามี Library หรือไม่
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        alert("PDF Library not loaded yet. Please refresh.");
        return;
    }

    // สร้าง PDF แนวนอน (Landscape) เพื่อให้มีที่พอสำหรับคอลัมน์เยอะๆ
    const doc = new jsPDF('l', 'mm', 'a4');

    // 1. หัวกระดาษ
    doc.setFontSize(16);
    doc.text("Shipping Cost History Report", 14, 15);

    doc.setFontSize(10);
    const dateStr = new Date().toLocaleString();
    doc.text(`Exported on: ${dateStr}`, 14, 22);

    // 2. เตรียมข้อมูล (ดึงจาก allHistoryDocs ที่เราโหลดมาจาก Firebase)
    // หมายเหตุ: allHistoryDocs คือตัวแปร Global ในไฟล์นี้ที่คุณมีอยู่แล้ว
    if (!allHistoryDocs || allHistoryDocs.length === 0) {
        alert("No data to export!");
        return;
    }

    // 3. กำหนดหัวตาราง
    const head = [[
        "Date/Time",
        "Part No.",
        "Goods Name",
        "Box Option",
        "Qty",
        "N.W (kg)",
        "Vendor",
        "Origin -> Dest",
        "Cost",
        "Price/Pc"
    ]];

    // 4. แปลงข้อมูลลงแถว
    const body = allHistoryDocs.map(h => {
        // แปลงเวลา
        const timeStr = h.timestamp && h.timestamp.toDate ?
            formatDateTime(h.timestamp.toDate()) : (h.time || "-");

        // แปลง Box Option เป็นข้อความสั้นๆ
        let boxTxt = "Ex";
        if (h.boxOption && (h.boxOption.includes('Include') || h.boxOption === 'include')) boxTxt = "In";

        // คำนวณราคาต่อชิ้น
        const costVal = parseFloat(h.cost) || 0;
        const qtyVal = parseFloat(String(h.weightQty).replace(/,/g, '')) || 1;
        const pricePerPiece = costVal / qtyVal;

        // จัดรูปแบบประเทศ Origin -> Dest
        const route = `${getCountryShort(h.origin)} -> ${getCountryShort(h.destination)}`;

        return [
            timeStr,
            h.partNumber || "-",
            h.goodsName || "-",
            boxTxt,
            h.weightQty || "-",
            h.netWeight || "-",
            h.vendor || "-",
            route,
            formatNum(costVal),
            formatNum(pricePerPiece)
        ];
    });

    // 5. สร้างตารางอัตโนมัติ
    doc.autoTable({
        head: head,
        body: body,
        startY: 30,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [15, 23, 42] }, // สีหัวตาราง (Dark Slate)
        alternateRowStyles: { fillColor: [248, 250, 252] }, // สีสลับแถว
        columnStyles: {
            0: { cellWidth: 35 }, // Date
            1: { cellWidth: 30 }, // Part No
            2: { cellWidth: 35 }, // Goods Name
            // ปรับขนาดคอลัมน์อื่นๆ ตามความเหมาะสม
            8: { halign: 'right' }, // Cost ชิดขวา
            9: { halign: 'right' }  // Price/Pc ชิดขวา
        }
    });

    // 6. บันทึกไฟล์
    doc.save("shipping_history.pdf");
};

// ฟังก์ชันช่วยย่อชื่อประเทศให้สั้นลงใน PDF
function getCountryShort(c) {
    if (!c) return "-";
    if (c === 'china') return 'CN';
    if (c === 'thailand') return 'TH';
    if (c === 'usa') return 'US';
    if (c === 'japan') return 'JP';
    if (c === 'germany') return 'DE';
    return c.toUpperCase().substring(0, 3);
}