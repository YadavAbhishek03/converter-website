// Currency Elements
const currencyFrom = document.getElementById("fromCurrency");
const currencyTo = document.getElementById("toCurrency");
const currencyResult = document.getElementById("currencyResult");
const currencyAmount = document.getElementById("currencyAmount");

// Currency Converter
async function convertCurrency() {
    const from = currencyFrom.value;
    const to = currencyTo.value;
    const amount = currencyAmount.value;

    if (!amount || isNaN(amount)) {
        currencyResult.innerText = "Please enter a valid amount.";
        return;
    }

    try {
        const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.result !== undefined) {
            currencyResult.innerText = 
                `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
        } else {
            currencyResult.innerText = "Conversion not available.";
        }
    } catch (error) {
        currencyResult.innerText = "Error fetching conversion data.";
        console.error("Error:", error);
    }
}

// Quick Convert Buttons
function quickConvert(from, to) {
    currencyAmount.value = 1;
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
