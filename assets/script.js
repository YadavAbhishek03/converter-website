// Currency API: https://api.exchangerate.host/latest

const currencyFrom = document.getElementById("currency-from");
const currencyTo = document.getElementById("currency-to");
const currencyResult = document.getElementById("currency-result");

// Populate currency dropdowns dynamically
async function loadCurrencies() {
  try {
    const res = await fetch("https://api.exchangerate.host/symbols");
    const data = await res.json();
    const symbols = data.symbols;

    for (let code in symbols) {
      let option1 = document.createElement("option");
      option1.value = code;
      option1.text = `${code} - ${symbols[code].description}`;

      let option2 = option1.cloneNode(true);

      currencyFrom.appendChild(option1);
      currencyTo.appendChild(option2);
    }

    // Default selections
    currencyFrom.value = "USD";
    currencyTo.value = "INR";
  } catch (error) {
    console.error("Error loading currencies:", error);
  }
}
loadCurrencies();

// Currency Converter
async function convertCurrency() {
  const amount = document.getElementById("currency-amount").value;
  const from = currencyFrom.value;
  const to = currencyTo.value;

  if (amount === "" || amount <= 0) {
    currencyResult.innerText = "Please enter a valid amount!";
    return;
  }

  try {
    const res = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
    const data = await res.json();

    if (data.result) {
      currencyResult.innerText = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
    } else {
      currencyResult.innerText = "Error fetching conversion data.";
    }
  } catch (error) {
    currencyResult.innerText = "Error fetching conversion data.";
  }
}

// Quick Convert Buttons
function quickConvert(from, to) {
  document.getElementById("currency-amount").value = 1;
  currencyFrom.value = from;
  currencyTo.value = to;
  convertCurrency();
}

// Unit Converter
function convertUnit() {
  const type = document.getElementById("unit-type").value;
  const value = parseFloat(document.getElementById("unit-value").value);
  const result = document.getElementById("unit-result");

  if (isNaN(value)) {
    result.innerText = "Please enter a value.";
    return;
  }

  switch (type) {
    case "length":
      result.innerText = `${value} meters = ${(value / 1000).toFixed(2)} kilometers`;
      break;
    case "weight":
      result.innerText = `${value} kg = ${(value * 1000).toFixed(2)} grams`;
      break;
    case "temp":
      result.innerText = `${value} °C = ${((value * 9/5) + 32).toFixed(2)} °F`;
      break;
    default:
      result.innerText = "Conversion not available.";
  }
}

// EMI Calculator
function calculateEMI() {
  const P = parseFloat(document.getElementById("loan-amount").value);
  const r = parseFloat(document.getElementById("interest-rate").value) / 12 / 100;
  const n = parseFloat(document.getElementById("loan-term").value);

  if (isNaN(P) || isNaN(r) || isNaN(n)) {
    document.getElementById("emi-result").innerText = "Please enter valid inputs.";
    return;
  }

  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  document.getElementById("emi-result").innerText = `Monthly EMI = ₹${emi.toFixed(2)}`;
}

// SIP Calculator
function calculateSIP() {
  const P = parseFloat(document.getElementById("sip-amount").value);
  const r = parseFloat(document.getElementById("sip-rate").value) / 12 / 100;
  const n = parseFloat(document.getElementById("sip-years").value) * 12;

  if (isNaN(P) || isNaN(r) || isNaN(n)) {
    document.getElementById("sip-result").innerText = "Please enter valid inputs.";
    return;
  }

  const maturity = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  document.getElementById("sip-result").innerText = `Maturity Value = ₹${maturity.toFixed(2)}`;
}
