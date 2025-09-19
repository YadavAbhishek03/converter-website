/* script.js - Currency (exchangerate.host), Unit conversions, EMI/SIP calculators
   Place in /assets/script.js and make sure index.html loads it.
*/

const popularCurrencies = [
  "USD","EUR","GBP","INR","JPY","AUD","CAD","CHF","CNY","HKD",
  "NZD","SEK","KRW","SGD","NOK","MXN","BRL","RUB","ZAR","TRY"
];

/* ---------- Init currency selects ---------- */
function populateCurrencySelects() {
  const from = document.getElementById("fromCurrency");
  const to = document.getElementById("toCurrency");
  for (const code of popularCurrencies) {
    const optionFrom = document.createElement("option"); optionFrom.value = code; optionFrom.textContent = code;
    const optionTo = document.createElement("option"); optionTo.value = code; optionTo.textContent = code;
    from.appendChild(optionFrom); to.appendChild(optionTo);
  }
  // sensible defaults
  from.value = "USD"; to.value = "INR";
}
populateCurrencySelects();

/* ---------- Currency Conversion (ExchangeRate.host) ---------- */
async function convertCurrencyAPI(amount, from, to) {
  // ExchangeRate.host free endpoint (no key)
  const url = `https://api.exchangerate.host/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network response not ok');
  const data = await res.json();
  return data;
}

async function convertCurrency() {
  const amount = parseFloat(document.getElementById("currencyAmount").value) || 0;
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;
  const resultBox = document.getElementById("currencyResult");
  resultBox.textContent = "Converting...";
  try {
    const data = await convertCurrencyAPI(amount, from, to);
    if (data && data.result !== undefined) {
      resultBox.textContent = `${amount} ${from} = ${Number(data.result).toLocaleString(undefined, {maximumFractionDigits:2})} ${to}`;
    } else {
      resultBox.textContent = "Conversion not available.";
    }
  } catch (err) {
    console.error("Currency error:", err);
    resultBox.textContent = "Error fetching conversion data. Check console.";
  }
}

function quickConvert(from, to, amount=1) {
  document.getElementById("fromCurrency").value = from;
  document.getElementById("toCurrency").value = to;
  document.getElementById("currencyAmount").value = amount;
  convertCurrency();
}

document.getElementById("convertCurrencyBtn").addEventListener("click", convertCurrency);

/* ---------- Unit converter ---------- */
const unitOptions = {
  length: {
    base: 'm',
    units: { m:1, cm:0.01, mm:0.001, km:1000, in:0.0254, ft:0.3048, yd:0.9144, mi:1609.344 }
  },
  weight: {
    base: 'kg',
    units: { kg:1, g:0.001, mg:0.000001, lb:0.45359237, oz:0.0283495231 }
  },
  volume: {
    base: 'l',
    units: { l:1, ml:0.001, cup:0.24, floz:0.0295735, m3:1000 }
  },
  temperature: {
    units: ['C','F','K'] // special handling
  },
  speed: {
    base: 'm/s',
    units: { 'm/s':1, 'km/h':(1/3.6), 'mph':0.44704, 'knot':0.514444 }
  }
};

function updateUnitOptions() {
  const type = document.getElementById("unitType").value;
  const from = document.getElementById("fromUnit");
  const to = document.getElementById("toUnit");
  from.innerHTML = ""; to.innerHTML = "";

  if (type === 'temperature') {
    ['C','F','K'].forEach(u => { from.appendChild(new Option(u,u)); to.appendChild(new Option(u,u)); });
    return;
  }

  const list = Object.keys(unitOptions[type].units);
  list.forEach(u => { from.appendChild(new Option(u,u)); to.appendChild(new Option(u,u)); });

  // defaults
  if (type==='length'){ from.value='m'; to.value='ft' }
  if (type==='weight'){ from.value='kg'; to.value='lb' }
}
updateUnitOptions();

function convertUnit() {
  const type = document.getElementById("unitType").value;
  const fromU = document.getElementById("fromUnit").value;
  const toU = document.getElementById("toUnit").value;
  let value = parseFloat(document.getElementById("unitValue").value);
  const out = document.getElementById("unitResult");
  out.textContent = "Converting...";

  if (isNaN(value)) { out.textContent = "Enter a numeric value."; return; }

  if (type === 'temperature') {
    let res;
    if (fromU==='C' && toU==='F') res = (value * 9/5) + 32;
    else if (fromU==='F' && toU==='C') res = (value - 32) * 5/9;
    else if (fromU==='C' && toU==='K') res = value + 273.15;
    else if (fromU==='K' && toU==='C') res = value - 273.15;
    else if (fromU==='F' && toU==='K') res = (value - 32) * 5/9 + 273.15;
    else if (fromU==='K' && toU==='F') res = (value - 273.15) * 9/5 + 32;
    else res = value;
    out.textContent = `${value} ${fromU} = ${Number(res).toFixed(2)} ${toU}`;
    return;
  }

  const units = unitOptions[type].units;
  const base = unitOptions[type].base;
  const inBase = value * units[fromU];        // convert to base
  const converted = inBase / units[toU];      // convert from base to target
  out.textContent = `${value} ${fromU} = ${Number(converted).toFixed(6)} ${toU}`;
}

document.getElementById("convertUnitBtn").addEventListener("click", convertUnit);

/* ---------- EMI & SIP calculators ---------- */
function calculateEMI() {
  const P = Number(document.getElementById("loanAmount").value) || 0;
  const annualRate = Number(document.getElementById("interestRate").value) || 0;
  const nMonths = Number(document.getElementById("loanTerm").value) || 0;
  const outEMI = document.getElementById("resultValueEMI");
  const outInterest = document.getElementById("resultValueInterest");
  const outTotal = document.getElementById("resultValueTotal");

  if (P<=0 || annualRate<=0 || nMonths<=0) {
    outEMI.textContent = "Enter valid inputs";
    outInterest.textContent = "-";
    outTotal.textContent = "-";
    return;
  }

  const monthlyRate = annualRate/100/12;
  const emi = (P * monthlyRate * Math.pow(1+monthlyRate, nMonths)) / (Math.pow(1+monthlyRate, nMonths) - 1);
  const totalPayment = emi * nMonths;
  const totalInterest = totalPayment - P;

  outEMI.textContent = Number(emi).toLocaleString(undefined,{maximumFractionDigits:2});
  outInterest.textContent = Number(totalInterest).toLocaleString(undefined,{maximumFractionDigits:2});
  outTotal.textContent = Number(totalPayment).toLocaleString(undefined,{maximumFractionDigits:2});
}

document.getElementById("calculateEMIBtn").addEventListener("click", calculateEMI);

function calculateSIP() {
  const monthly = Number(document.getElementById("sipAmount").value) || 0;
  const annual = Number(document.getElementById("sipInterest").value) || 0;
  const years = Number(document.getElementById("sipTerm").value) || 0;
  const out = document.getElementById("sipResult");
  if (monthly<=0 || annual<=0 || years<=0){ out.textContent = "Enter valid inputs"; return; }

  const r = annual/100/12; // monthly rate
  const n = years*12;
  // future value of series formula: FV = P * [ ( (1+r)^n - 1 ) / r ] * (1+r)
  const fv = monthly * ( (Math.pow(1+r, n) - 1) / r ) * (1 + r);
  out.innerHTML = `<strong>Future Value:</strong> ${Number(fv).toLocaleString(undefined,{maximumFractionDigits:2})}`;
}

document.getElementById("calculateSIPBtn").addEventListener("click", calculateSIP);

/* ---------- EMI/SIP UI toggle ---------- */
document.getElementById("emiToggle").addEventListener("click", () => {
  document.getElementById("emiToggle").classList.add("active");
  document.getElementById("sipToggle").classList.remove("active");
  document.getElementById("emiSection").style.display = "block";
  document.getElementById("sipSection").style.display = "none";
});
document.getElementById("sipToggle").addEventListener("click", () => {
  document.getElementById("sipToggle").classList.add("active");
  document.getElementById("emiToggle").classList.remove("active");
  document.getElementById("emiSection").style.display = "none";
  document.getElementById("sipSection").style.display = "block";
});

/* ---------- DOM ready improvements ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // focus defaults
  document.getElementById("currencyAmount").value = document.getElementById("currencyAmount").value || 1;
});
