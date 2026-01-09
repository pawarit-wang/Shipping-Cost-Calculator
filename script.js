// =============================
// Shipping Calculator Script (Updated: Reset on Refresh, Keep on Navigation)
// =============================

// ---------- Config ----------
const VOLUMETRIC_DIVISOR = 500;
const HISTORY_KEY = "shipping_calc_history_v1";
const RATES_KEY = "shipping_calc_rates_v1";
const ROW_CONFIG_KEY = "shipping_calc_rows_config_v1";
const FORM_STATE_KEY = "shipping_calc_form_state_v1";

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

const resultBoxOrigin = document.getElementById("result-origin");
const costLabelOrigin = document.querySelector('label[for="result-origin"]');

const resultBoxDest = document.getElementById("result-destination");
const costLabelDest = document.querySelector('label[for="result-destination"]');

const pricePerPieceInput = document.getElementById("price-per-piece");
const fuelPercentInput = document.getElementById("fuel-percent");
const fuelAmountInput = document.getElementById("fuel-amount");
const otherInput = document.getElementById("other-charges");
const isSpecialCheckbox = document.getElementById("is-special");

const historyTableBody = document.getElementById("history-body");
const historyClearBtn = document.getElementById("history-clear");

const btnEn = document.getElementById("lang-en");
const btnTh = document.getElementById("lang-th");

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
        nav_table: "Table",
        nav_calc: "Calculator",
        nav_history: "History",
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
        btn_add_row: "+ Add Row"
    },
    th: {
        app_title_logo: "🚚 โปรแกรมคำนวณค่าขนส่ง",
        nav_table: "ตาราง",
        nav_calc: "คำนวณราคา",
        nav_history: "ประวัติ",
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
        btn_add_row: "+ เพิ่มแถว"
    }
};

// =============================
// Helpers
// =============================
const toNum = (v) => {
    if (!v) return 0;
    return Number.parseFloat(String(v).replace(/,/g, '')) || 0;
};

const formatNum = (n, decimals = 2) => {
    if (n === "" || n === null || n === undefined || isNaN(n)) return "";
    return Number(n).toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
};

const round2 = (n) => Math.round(n * 100) / 100;
const round3 = (n) => Math.round(n * 1000) / 1000;

function setIfElement(el, value) {
    if (el) el.value = value;
}

function formatDateTime(d = new Date()) {
    const pad = (x) => String(x).padStart(2, "0");
    const yy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${yy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
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
// LocalStorage: History
// =============================
function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
}
function saveHistory(hist) { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(hist)); } catch { } }
function addHistoryEntry(entry) {
    const hist = loadHistory();
    hist.unshift(entry);
    if (hist.length > 500) hist.length = 500;
    saveHistory(hist);
    renderHistory();
}
function clearHistory() { saveHistory([]); renderHistory(); }
function renderHistory() {
    if (!historyTableBody) return;
    const hist = loadHistory();
    historyTableBody.innerHTML = "";
    for (const h of hist) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${h.time}</td>
      <td>${h.origin || "-"}</td>
      <td>${h.destination || "-"}</td>
      <td>${h.vendor || "-"}</td>
      <td class="text-right">${formatNum(h.actualKg, 3)}</td>
      <td class="text-right">${formatNum(h.volumetricKg, 3)}</td>
      <td class="text-right">${formatNum(h.chargeableKg, 3)}</td>
      <td class="text-right">${formatNum(h.totalVolume, 0)}</td>
      <td class="text-right">${h.currency} ${formatNum(h.cost, 2)}</td>
    `;
        historyTableBody.appendChild(tr);
    }
}

// =============================
// LocalStorage: Row Configuration
// =============================
function getInitialRowConfig() {
    const airRows = [];
    for (let w = 0.5; w <= 30.0; w += 0.5) airRows.push(w.toFixed(1));
    airRows.push("30.1-70", "70.1-300", "71-299", "300-1000", "300.1-99,999");
    const seaRows = ["1.0", "other"];
    const landRows = ["0 - 10.0", "10.1 - 45.0", "45.1 - 100.0", "100.1 - 300.0", ">300", "special"];
    return { air: airRows, sea: seaRows, land: landRows };
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

function addNewRow(type) {
    const config = loadRowConfig();
    const newKey = "New Row " + (config[type].length + 1);
    config[type].push(newKey);
    saveRowConfig(config);
    refreshTableByType(type);
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
// DRAG & DROP LOGIC
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
    div.style.alignItems = "center";
    const dragHandle = document.createElement("span");
    dragHandle.innerHTML = "&#10294;";
    dragHandle.className = "drag-handle";
    dragHandle.title = "Drag to reorder";
    dragHandle.addEventListener('mouseenter', () => { if (tr) tr.setAttribute('draggable', 'true'); });
    dragHandle.addEventListener('mouseleave', () => { if (tr) tr.setAttribute('draggable', 'false'); });
    dragHandle.addEventListener('touchstart', () => { if (tr) tr.setAttribute('draggable', 'true'); });
    div.appendChild(dragHandle);
    const btnDel = document.createElement("button");
    btnDel.textContent = "X";
    btnDel.className = "btn-delete";
    btnDel.title = "Delete";
    btnDel.onclick = () => deleteRow(type, index);
    div.appendChild(btnDel);
    return div;
}

// =============================
// Table Generators
// =============================
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

// Helper to refresh table
function refreshTableByType(type) {
    if (type === 'air') generateAirTableRows("tbody-air");
    else if (type === 'sea') generateV01199Rows("tbody-v01199");
    else if (type === 'land') generateV01198Rows("tbody-v01198");
}

// Helper to get vendors
function getVendorsByType(type) {
    if (type === 'air') return ['dhl', 'fedex', 'ups', 'sf'];
    if (type === 'sea') return ['v01199'];
    if (type === 'land') return ['v01198'];
    return [];
}

// =============================
// LocalStorage: Rates
// =============================
function loadRates() {
    try { return JSON.parse(localStorage.getItem(RATES_KEY)) || {}; } catch { return {}; }
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
// SessionStorage: Form State (Modified)
// =============================
function saveFormState() {
    const state = {};
    document.querySelectorAll('input, select').forEach(el => {
        if (!el.id) return;
        if (el.type === 'checkbox' || el.type === 'radio') {
            state[el.id] = el.checked;
        } else {
            state[el.id] = el.value;
        }
    });
    // Changed to sessionStorage for session-only persistence
    sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(state));
}

function loadFormState() {
    // 1. Check if the page was reloaded
    const navEntry = performance.getEntriesByType("navigation")[0];
    const navType = navEntry ? navEntry.type : "";
    // Fallback for older browsers
    const isReload = navType === 'reload' || (window.performance && window.performance.navigation && window.performance.navigation.type === 1);

    if (isReload) {
        // If Reload -> Clear data and return (Reset)
        sessionStorage.removeItem(FORM_STATE_KEY);
        return;
    }

    // 2. If not reload (e.g. Navigation), load data
    const raw = sessionStorage.getItem(FORM_STATE_KEY);
    if (!raw) return;

    const state = JSON.parse(raw);
    for (const id in state) {
        const el = document.getElementById(id);
        if (el) {
            if (el.type === 'checkbox' || el.type === 'radio') {
                el.checked = state[id];
            } else {
                el.value = state[id];
            }
        }
    }
    // Trigger Recalculations
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
    currentLang = lang;

    if (btnEn) btnEn.classList.toggle('active', lang === 'en');
    if (btnTh) btnTh.classList.toggle('active', lang === 'th');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            const text = translations[lang][key];
            if (el.tagName === 'INPUT') {
                el.type === 'button' ? el.value = text : el.placeholder = text;
            } else if (el.tagName === 'OPTGROUP') {
                el.label = text;
            } else {
                el.textContent = text;
            }
        }
    });
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

// Helper for total weights
function updateTotalNetWeight() {
    const net = toNum(netWeightInput?.value);
    const qty = Math.max(1, toNum(weightQtyInput?.value) || 1);
    const totalNet = net * qty;
    setIfElement(totalNetWeightInput, totalNet ? formatNum(totalNet, 3) : "");
    return totalNet;
}

function updateVolumeFromWeight() {
    const totalKg = toNum(manualGrossWeightInput?.value) || toNum(totalWeightInput?.value);
    const vendor = vendorSelect?.value || "";
    let m3 = 0;

    // [NEW LOGIC] Sea: Volume = Gross Weight / Manual Divisor
    if (vendor === 'v01199') {
        const divisor = toNum(volumetricDivisorInput?.value) || 500;
        m3 = totalKg / divisor;
        setIfElement(volumeFromWeightOutput, totalKg ? formatNum(m3, 3) : "");
    }

    // For other vendors, we DO NOT auto-update volume display (as per previous request)
}

function updateWeightTotals() {
    const totalNet = updateTotalNetWeight();
    const pkg = toNum(addWeightInput?.value);
    const pkgQty = Math.max(1, toNum(packagingQtyInput?.value) || 1);
    const totalPkg = pkg * pkgQty;

    setIfElement(totalPackagingWeightInput, totalPkg ? formatNum(totalPkg, 3) : "");

    const radioInclude = document.getElementById("box-include");
    const isIncludeBox = radioInclude && radioInclude.checked;

    let grandTotal = 0;
    if (isIncludeBox) grandTotal = totalNet;
    else grandTotal = totalNet + totalPkg;

    setIfElement(totalWeightInput, grandTotal ? formatNum(grandTotal, 3) : "");

    // Trigger logic for Sea
    updateVolumeFromWeight();
}

function updateGrossDimensions() {
    const w = toNum(netWInput?.value) + toNum(addWInput?.value);
    const l = toNum(netLInput?.value) + toNum(addLInput?.value);
    const h = toNum(netHInput?.value) + toNum(addHInput?.value);

    // เปลี่ยน formatNum(..., 2) เป็น formatNum(..., 0)
    setIfElement(grossWInput, (w || w === 0) ? formatNum(w, 0) : "");
    setIfElement(grossLInput, (l || l === 0) ? formatNum(l, 0) : "");
    setIfElement(grossHInput, (h || h === 0) ? formatNum(h, 0) : "");
    updateVolumes();
}

// [NEW FUNCTION] Logic for displaying Grand Volume (kg)
function updateGrandVolumeDisplay() {
    const vendor = vendorSelect?.value || "";
    // Priority: Manual Input > Calculated Total Volume
    const m3 = toNum(manualTotalVolumeInput?.value) || toNum(totalVolumeInput?.value);

    let grandKg = 0;

    if (vendor === 'v01198') {
        // [NEW LOGIC] Land: m3 * Multiplier
        const multiplier = toNum(volumetricMultiplierInput?.value) || 200; // Default 200
        grandKg = m3 * multiplier;
    } else {
        // [OLD LOGIC] Air/Other: (m3 * 1,000,000) / Divisor
        const divisor = toNum(volumetricDivisorInput?.value) || 500; // Default 500
        if (divisor > 0) {
            grandKg = (m3 * 1_000_000) / divisor;
        }
    }

    setIfElement(grandVolumeInput, grandKg ? formatNum(grandKg, 3) : "");
}

function updateVolumes() {
    const gw = toNum(grossWInput?.value);
    const gl = toNum(grossLInput?.value);
    const gh = toNum(grossHInput?.value);

    // cm3
    const grossCm3 = gw * gl * gh;
    // m3
    const grossM3 = grossCm3 / 1_000_000;

    setIfElement(grossVolumeInput, grossCm3 ? formatNum(grossM3, 3) : ""); // บรรทัดนี้คงไว้ 3 ตามเดิม (Gross Dimensions m3)

    const qty = Math.max(1, toNum(dimensionQtyInput?.value) || 1);
    let totalM3 = grossM3 * qty;

    // [MODIFIED] Round up to nearest 0.5
    if (totalM3 > 0) {
        totalM3 = Math.ceil(totalM3 * 2) / 2;
    }

    // แก้ไขตรงนี้: เปลี่ยนเลข 3 เป็น 1
    // จากเดิม: setIfElement(totalVolumeInput, totalM3 ? formatNum(totalM3, 3) : "");
    setIfElement(totalVolumeInput, totalM3 ? formatNum(totalM3, 1) : "");

    // [ลบหรือ Comment บรรทัดนี้ออก] เพื่อไม่ให้คำนวณ Auto
    // updateGrandVolumeDisplay(); 
}

function calculateShipping() {
    const vendor = vendorSelect?.value || "";
    if (!vendor) return;

    // 1. Get Weight (Common)
    const weightVal = toNum(manualGrossWeightInput?.value) || toNum(totalWeightInput?.value);

    let baseCost = 0;

    // ==========================================
    // Vendor Logic: v01199 (Sea) - NEW FORMULA
    // ==========================================
    if (vendor === 'v01199') {
        // 1. Ensure Volume from Weight is updated
        updateVolumeFromWeight();

        // 2. Determine x (Volume)
        // x = Max(Volume from Weight, Grand Dimensions)
        const valVolWeight = toNum(volumeFromWeightOutput?.value); // Volume (m³)
        const valGrandDim = toNum(totalVolumeInput?.value);        // Grand Dimensions (m³)

        const x = Math.max(valVolWeight, valGrandDim);

        // 3. Get Constants a and b from Table
        // a = Price for 1 m3 (Key: "1.0")
        // b = Other (Key: "other")
        const rates = loadRates();
        const vRates = rates[vendor] || {};

        const a = toNum(vRates["1.0"]);
        const b = toNum(vRates["other"]);

        // 4. Calculate Base Cost: a(x-1) + a + b => ax + b
        baseCost = (a * x) + b;

        // Debug log (optional)
        console.log(`v01199: x=${x}, a=${a}, b=${b}, Cost=${baseCost}`);

    }
    // ==========================================
    // Vendor Logic: Others (Air, Land, v01198)
    // ==========================================
    else {
        // 1. Determine Volume (m3)
        // Use Manual Grand Dimensions if available, otherwise Auto
        let calcM3 = toNum(manualTotalVolumeInput?.value) || toNum(totalVolumeInput?.value);

        // 2. Determine Chargeable Weight
        const totalCm3 = calcM3 * 1_000_000;
        let volKg = 0;

        if (vendor === 'v01198') {
            // Land: m3 * Multiplier
            const multiplier = toNum(volumetricMultiplierInput?.value) || 200;
            volKg = calcM3 * multiplier;
        } else {
            // Air: (m3 * 1,000,000) / Divisor
            const divisor = toNum(volumetricDivisorInput?.value) || VOLUMETRIC_DIVISOR;
            if (divisor > 0) volKg = totalCm3 / divisor;
        }

        const chargeable = Math.max(weightVal, volKg);

        // 3. Lookup Rate
        const lookupValue = chargeable;
        const customRate = getRateFromStorage(vendor, lookupValue);

        if (customRate) {
            baseCost = (customRate.type === 'fixed') ? customRate.price : (lookupValue * customRate.price);
        } else {
            // Fallbacks
            if (vendor === "v01198") { // Land fallback
                let p = 10;
                if (chargeable <= 10) p = 13;
                else if (chargeable <= 45) p = 12;
                else if (chargeable <= 100) p = 11;
                baseCost = chargeable * p;
            } else { // Air fallback
                const mul = (vendor === 'dhl') ? 1.15 : (vendor === 'fedex') ? 1.1 : 1.0;
                baseCost = chargeable * 50 * mul;
            }
        }
    }

    // ==========================================
    // Final Calculation (Common)
    // ==========================================
    const exchange = toNum(rateInput?.value) || 1;
    const fuel = baseCost * (toNum(fuelPercentInput?.value) / 100);
    const other = toNum(otherInput?.value); // Manual Other Charge field

    setIfElement(fuelAmountInput, formatNum(fuel));
    const finalCost = (baseCost + fuel + other) * exchange;

    if (resultBoxOrigin) resultBoxOrigin.value = formatNum(baseCost);
    if (resultBoxDest) resultBoxDest.value = formatNum(finalCost);

    const qty = Math.max(1, toNum(weightQtyInput?.value) || 1);
    setIfElement(pricePerPieceInput, formatNum(finalCost / qty));
}

// =============================
// Events
// =============================
const inputsToWatch = [netWeightInput, weightQtyInput, addWeightInput, packagingQtyInput, manualGrossWeightInput, volumetricDivisorInput];
inputsToWatch.forEach(el => el?.addEventListener("input", () => {
    updateWeightTotals();
    calculateShipping();
}));

const dimInputs = [netWInput, netLInput, netHInput, addWInput, addLInput, addHInput, grossWInput, grossLInput, grossHInput, dimensionQtyInput, manualTotalVolumeInput];
dimInputs.forEach(el => el?.addEventListener("input", () => {
    updateGrossDimensions();
    calculateShipping();
}));

// [NEW] Listener for Multiplier Input
volumetricMultiplierInput?.addEventListener("input", () => {
    // [ลบหรือ Comment บรรทัดนี้ออก]
    // updateGrandVolumeDisplay(); 

    calculateShipping();
});

vendorSelect?.addEventListener("change", () => {
    updateVolumeFromWeight();

    // [ลบหรือ Comment บรรทัดนี้ออก]
    // updateGrandVolumeDisplay(); 

    calculateShipping();
});

rateInput?.addEventListener("input", calculateShipping);
fuelPercentInput?.addEventListener("input", calculateShipping);
otherInput?.addEventListener("input", calculateShipping);
document.getElementById("is-special")?.addEventListener("change", calculateShipping);

originCountrySelect?.addEventListener("change", () => { updateCostLabels(); calculateShipping(); });
destinationCountrySelect?.addEventListener("change", () => {
    if (rateInput) rateInput.value = getRateByDestination(destinationCountrySelect.value);
    updateCostLabels(); calculateShipping();
});
historyClearBtn?.addEventListener("click", clearHistory);

// Manual Convert Button (General Case)
document.getElementById("btn-convert-vol")?.addEventListener("click", function () {
    const totalKg = toNum(manualGrossWeightInput?.value) || toNum(totalWeightInput?.value);
    const m3 = (totalKg * VOLUMETRIC_DIVISOR) / 1_000_000;
    setIfElement(volumeFromWeightOutput, totalKg ? formatNum(m3, 3) : "");
});

document.getElementById("btn-convert-dim")?.addEventListener("click", function () {
    // [UPDATED] Use centralized function logic
    updateGrandVolumeDisplay();
});

// Language Button Listeners
if (btnEn) btnEn.addEventListener("click", (e) => { e.preventDefault(); setLanguage("en"); });
if (btnTh) btnTh.addEventListener("click", (e) => { e.preventDefault(); setLanguage("th"); });

if (tableVendorSelect) {
    tableVendorSelect.addEventListener("change", function () {
        [tablePlaceholder, viewAir, viewSea, viewLand].forEach(el => el?.classList.add("hidden"));
        if (this.value === "") tablePlaceholder?.classList.remove("hidden");
        else if (this.value === "air") { viewAir?.classList.remove("hidden"); generateAirTableRows("tbody-air"); }
        else if (this.value === "sea") { viewSea?.classList.remove("hidden"); generateV01199Rows("tbody-v01199"); }
        else if (this.value === "land") { viewLand?.classList.remove("hidden"); generateV01198Rows("tbody-v01198"); }
    });
}

// Input Focus Logic
const allInputs = document.querySelectorAll('input[type="text"], input[type="number"]');
const textFields = ["goods-name", "part-number", "hs-code"]; // Fields to exclude from number formatting

allInputs.forEach(el => {
    el.addEventListener("focus", function () {
        if (this.value && !textFields.includes(this.id)) { // Only strip commas if NOT a text field
            this.value = this.value.replace(/,/g, '');
        }
        this.select();
    });

    el.addEventListener("blur", function () {
        if (this.value && !this.readOnly && !textFields.includes(this.id)) {
            const v = toNum(this.value);

            // [เพิ่ม] ตรวจสอบว่าเป็นช่อง Dimension หรือไม่ (width, length, height)
            const isDim = this.id.includes("width") || this.id.includes("length") || this.id.includes("height");

            // [แก้ไข] logic การเลือกทศนิยม
            const isVol = this.id.includes("Volume") || this.id.includes("dimensions") || this.id.includes("gross-weight") || this.id.includes("net-weight") || this.id.includes("add-weight");

            // ถ้าเป็น Dim ให้ใช้ 0, ถ้าไม่ใช่ดูว่าเป็น Vol ไหม (3), ถ้าไม่ใช่เลยใช้ 2
            const decimals = isDim ? 0 : (isVol ? 3 : 2);

            // บังคับ 0 ทศนิยมสำหรับ Gross Volume (cm³) ด้วย
            if (this.id === "gross-volume") {
                this.value = formatNum(v, 0);
            } else {
                this.value = this.id.includes("qty") || this.id.includes("divisor") || this.id.includes("multiplier") ? formatNum(v, 0) : formatNum(v, decimals);
            }
        }
    });
});

// Init
document.addEventListener("DOMContentLoaded", () => {
    setLanguage("en");
    renderHistory();
    // [NEW] Load saved form state immediately (with Refresh check)
    loadFormState();

    // [NEW] Prevent dragging on all inputs/selects (Fix for index_new to prevent accidental drags)
    document.querySelectorAll('input, select').forEach(el => {
        el.setAttribute('draggable', 'false');
        el.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });

        // [NEW] Attach Auto-Save listeners to everything
        el.addEventListener('change', saveFormState);
        el.addEventListener('input', saveFormState); // Optional: save on every keystroke
    });
});