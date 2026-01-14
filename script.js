// =============================
// Shipping Calculator Script (Updated: Reset on Refresh, Keep on Navigation)
// =============================

// ---------- Config ----------
const VOLUMETRIC_DIVISOR = 500;
const HISTORY_KEY = "shipping_calc_history_v1";
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

const historyTableBody = document.getElementById("history-body");
const historyClearBtn = document.getElementById("history-clear");

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
    },
    cn: {
        app_title_logo: "🚚 运费计算器",
        nav_table: "表格",
        nav_calc: "计算器",
        nav_history: "历史记录",
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
        btn_add_row: "+ 添加行"
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
    // 1. อ่านข้อมูลเดิมที่มีอยู่ใน SessionStorage ออกมาก่อน
    // เพื่อกันไม่ให้ข้อมูลของหน้าอื่น (เช่น Calculator) หายไปเมื่อเราอยู่หน้า Table
    let state = {};
    try {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        if (stored) state = JSON.parse(stored);
    } catch (e) {
        state = {};
    }

    // 2. อัปเดต/บันทึกทับ เฉพาะ Input ที่มีอยู่ในหน้าปัจจุบัน
    document.querySelectorAll('input, select').forEach(el => {
        if (!el.id) return;
        if (el.type === 'checkbox' || el.type === 'radio') {
            state[el.id] = el.checked;
        } else {
            state[el.id] = el.value;
        }
    });

    // 3. บันทึกกลับลงไป
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

    localStorage.setItem(LANG_KEY, lang);

    currentLang = lang;

    if (btnEn) btnEn.classList.toggle('active', lang === 'en');
    if (btnTh) btnTh.classList.toggle('active', lang === 'th');
    if (btnCn) btnCn.classList.toggle('active', lang === 'cn');

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

    // [แก้ไข] เปลี่ยนตัวเลขด้านหลังเป็น 1 (ทศนิยม 1 ตำแหน่ง)
    setIfElement(totalNetWeightInput, totalNet ? formatNum(totalNet, 1) : "");

    return totalNet; // ส่งค่ากลับเป็นตัวเลขจริง (3 ตำแหน่ง) เพื่อไปคำนวณต่อได้แม่นยำ
}

function updateVolumeFromWeight() {
    const totalKg = toNum(manualGrossWeightInput?.value) || toNum(totalWeightInput?.value);
    const vendor = vendorSelect?.value || "";
    const divisor = toNum(volumetricDivisorInput?.value) || 500;
    let m3 = 0;

    // Logic เดิมของ Sea (v01199)
    if (vendor === 'v01199') {
        if (divisor > 0) {
            m3 = totalKg / divisor;
        }
    }
    // Logic ใหม่: Auto convert
    else {
        m3 = (totalKg * divisor) / 1_000_000;
    }

    // [แก้ไขตรงนี้] เปลี่ยนจาก formatNum(m3, 3) เป็น formatNum(m3, 1)
    setIfElement(volumeFromWeightOutput, totalKg ? formatNum(m3, 1) : "");
}

// ค้นหา function updateWeightTotals() แล้วแก้ส่วนล่างของฟังก์ชันดังนี้ครับ

function updateWeightTotals() {
    const totalNet = updateTotalNetWeight();
    const pkg = toNum(addWeightInput?.value);
    const pkgQty = Math.max(1, toNum(packagingQtyInput?.value) || 1);
    const totalPkg = pkg * pkgQty;

    // [แก้ไข] เปลี่ยนตัวเลขด้านหลังเป็น 1 (ทศนิยม 1 ตำแหน่ง)
    setIfElement(totalPackagingWeightInput, totalPkg ? formatNum(totalPkg, 1) : "");

    const radioInclude = document.getElementById("box-include");
    const isIncludeBox = radioInclude && radioInclude.checked;

    let grandTotal = 0;
    if (isIncludeBox) grandTotal = totalNet;
    else grandTotal = totalNet + totalPkg;

    // ส่วน Gross Weight ยังคง 1 ตำแหน่งตามเดิม
    if (grandTotal > 0) {
        grandTotal = Math.ceil(grandTotal * 2) / 2;
    }
    setIfElement(totalWeightInput, grandTotal ? formatNum(grandTotal, 1) : "");

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

// Logic for displaying Grand Volume (kg)
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

    // [แก้ไขตรงนี้] เปลี่ยนเลข 3 เป็น 1
    setIfElement(grandVolumeInput, grandKg ? formatNum(grandKg, 1) : "");
}

function updateVolumes() {
    const gw = toNum(grossWInput?.value);
    const gl = toNum(grossLInput?.value);
    const gh = toNum(grossHInput?.value);

    // cm3
    const grossCm3 = gw * gl * gh;
    // m3
    const grossM3 = grossCm3 / 1_000_000;

    setIfElement(grossVolumeInput, grossCm3 ? formatNum(grossM3, 1) : "");

    const qty = Math.max(1, toNum(dimensionQtyInput?.value) || 1);
    let totalM3 = grossM3 * qty;

    // Round up to nearest 0.5
    if (totalM3 > 0) {
        totalM3 = Math.ceil(totalM3 * 2) / 2;
    }

    setIfElement(totalVolumeInput, totalM3 ? formatNum(totalM3, 1) : "");

    // [แก้ไข] เอา Comment ออก เพื่อให้คำนวณ Auto ทันทีที่ Dimension เปลี่ยน
    updateGrandVolumeDisplay();
}

function calculateShipping() {
    const vendor = vendorSelect?.value || "";

    // ตัวแปรสำหรับเก็บค่าที่จะแสดงในช่อง Chargeable (ค่าที่ชนะการเปรียบเทียบ)
    let finalChargeable = 0;

    if (!vendor) {
        // Clear ค่าถ้าไม่ได้เลือก Vendor
        setIfElement(chargeableInput, "");
        if (resultBoxOrigin) resultBoxOrigin.value = "";
        if (resultBoxDest) resultBoxDest.value = "";
        if (pricePerPieceInput) pricePerPieceInput.value = "";
        if (fuelAmountInput) fuelAmountInput.value = "";
        return;
    }

    // 1. Get Weight (Common) - น้ำหนักจริงจาก Gross Weight
    const weightVal = toNum(manualGrossWeightInput?.value) || toNum(totalWeightInput?.value);

    let baseCost = 0;

    // ==========================================
    // Vendor Logic: v01199 (Sea)
    // ==========================================
    if (vendor === 'v01199') {
        // 1. Ensure Volume from Weight is updated
        updateVolumeFromWeight();

        // 2. Determine x (Volume)
        // x = Max(Volume from Weight, Grand Dimensions)
        const valVolWeight = toNum(volumeFromWeightOutput?.value); // Volume (m³)
        const valGrandDim = toNum(totalVolumeInput?.value);        // Grand Dimensions (m³)

        // เปรียบเทียบหาค่าที่มากกว่า (m³)
        const x = Math.max(valVolWeight, valGrandDim);

        // เก็บค่า x ไว้แสดงในช่อง Chargeable
        finalChargeable = x;

        // 3. Get Constants a and b from Table
        // a = Price for 1 m3 (Key: "1.0")
        // b = Other (Key: "other")
        const rates = loadRates();
        const vRates = rates[vendor] || {};

        const a = toNum(vRates["1.0"]);
        const b = toNum(vRates["other"]);

        // 4. Calculate Base Cost: ax + b
        baseCost = (a * x) + b;
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

        // เปรียบเทียบหาค่าที่มากกว่า (kg) ระหว่าง Gross Weight กับ Volumetric Weight
        const chargeable = Math.max(weightVal, volKg);

        // เก็บค่า chargeable ไว้แสดงในช่อง Chargeable
        finalChargeable = chargeable;

        // 3. Lookup Rate
        const lookupValue = chargeable;
        // เปลี่ยนบรรทัดนี้เพื่อรองรับ Logic ใหม่
        let customRate = getRateFromStorage(vendor, lookupValue);

        // [เพิ่มใหม่] ตรวจสอบ Checkbox Special
        // หากติ๊กถูก ให้พยายามหาราคาจาก Key "special" ในตาราง (รองรับ v01198 หรือ Vendor อื่นที่มีแถวชื่อ special)
        if (isSpecialCheckbox && isSpecialCheckbox.checked) {
            const rates = loadRates();
            if (rates[vendor] && rates[vendor]["special"]) {
                const specialPrice = toNum(rates[vendor]["special"]);
                if (specialPrice > 0) {
                    // ถ้าเจอราคา Special ให้ใช้ราคานั้นเป็นแบบต่อหน่วย (Price per Unit) ทันที
                    customRate = { type: 'per_unit', price: specialPrice };
                }
            }
        }

        if (customRate) {
            baseCost = (customRate.type === 'fixed') ? customRate.price : (lookupValue * customRate.price);
        } else {
            // Fallbacks กรณีไม่มี Rate ในตาราง
            if (vendor === "v01198") { // Land fallback logic
                let p = 10;
                if (chargeable <= 10) p = 13;
                else if (chargeable <= 45) p = 12;
                else if (chargeable <= 100) p = 11;
                baseCost = chargeable * p;
            } else { // Air fallback logic
                const mul = (vendor === 'dhl') ? 1.15 : (vendor === 'fedex') ? 1.1 : 1.0;
                baseCost = chargeable * 50 * mul;
            }
        }
    }

    // ==========================================
    // Update Chargeable Display (แสดง 1 ตำแหน่ง)
    // ==========================================
    setIfElement(chargeableInput, formatNum(finalChargeable, 1));

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

// Listener for Multiplier Input
volumetricMultiplierInput?.addEventListener("input", () => {
    // [แก้ไข] เอา Comment ออก
    updateGrandVolumeDisplay();

    calculateShipping();
});

// เพื่อให้เมื่อแก้ Divisor แล้ว Volume และ Grand Volume เปลี่ยนทันที
volumetricDivisorInput?.addEventListener("input", () => {
    updateVolumeFromWeight();      // คำนวณ Volume (m3) ใหม่
    updateGrandVolumeDisplay();    // คำนวณ Grand Volume (kg) ใหม่
    calculateShipping();           // คำนวณราคาใหม่
});

vendorSelect?.addEventListener("change", () => {
    updateVolumeFromWeight();

    // [แก้ไข] เอา Comment ออก เพื่อให้คำนวณ Grand Volume (kg) ใหม่ตามสูตรของ Vendor นั้นๆ
    updateGrandVolumeDisplay();

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
// document.getElementById("btn-convert-vol")?.addEventListener("click", function () {
//     const totalKg = toNum(manualGrossWeightInput?.value) || toNum(totalWeightInput?.value);
//     const m3 = (totalKg * VOLUMETRIC_DIVISOR) / 1_000_000;
//     setIfElement(volumeFromWeightOutput, totalKg ? formatNum(m3, 3) : "");
// });

// document.getElementById("btn-convert-dim")?.addEventListener("click", function () {
//     // [UPDATED] Use centralized function logic
//     updateGrandVolumeDisplay();
// });

// Language Button Listeners
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

// Input Focus Logic
const allInputs = document.querySelectorAll('input[type="text"], input[type="number"]');
const textFields = ["goods-name", "part-number"]; // Fields to exclude from number formatting

allInputs.forEach(el => {
    el.addEventListener("focus", function () {
        if (this.value && !textFields.includes(this.id)) { // Only strip commas if NOT a text field
            this.value = this.value.replace(/,/g, '');
        }
        this.select();
    });

    // ค้นหา Event Listener ของ blur ในช่วงท้ายไฟล์ แล้วแทนที่ด้วยโค้ดชุดนี้ครับ

    // ค้นหาและแทนที่ Logic ภายใน blur event ด้วยโค้ดนี้ครับ

    el.addEventListener("blur", function () {
        if (this.value && !this.readOnly && !textFields.includes(this.id)) {
            const v = toNum(this.value);

            // 1. กลุ่ม 0 ตำแหน่ง (Dimensions)
            const isDim = this.id.includes("width") || this.id.includes("length") || this.id.includes("height");

            // 2. [แก้ไข] กลุ่ม 3 ตำแหน่ง (Volume, Gross Weight input, และเพิ่ม Net/Add Weight กลับเข้ามา)
            const isThreeDecimal = this.id.includes("Volume") ||
                this.id.includes("dimensions") ||
                this.id.includes("gross-weight") ||
                this.id === "net-weight" ||   // <--- เพิ่ม
                this.id === "add-weight";     // <--- เพิ่ม

            // กำหนดทศนิยม: ถ้าไม่ใช่ Dim และไม่ใช่กลุ่ม 3 ตำแหน่ง ให้เป็น 2 ตำแหน่ง (เช่น ราคา)
            const decimals = isDim ? 0 : (isThreeDecimal ? 3 : 2);

            // บังคับ 0 ทศนิยมสำหรับ Gross Volume (cm³)
            if (this.id === "gross-volume") {
                this.value = formatNum(v, 1);
            } else {
                const isIntField = this.id.includes("qty") || this.id.includes("divisor") || this.id.includes("multiplier");
                this.value = isIntField ? formatNum(v, 0) : formatNum(v, decimals);
            }
        }
    });
});

// Init
document.addEventListener("DOMContentLoaded", () => {
    setLanguage(localStorage.getItem(LANG_KEY) || "en");
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