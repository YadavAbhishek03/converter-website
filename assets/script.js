document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("converter-form");
  const result = document.getElementById("result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = document.getElementById("amount").value;
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;

    if (!amount) {
      result.textContent = "Please enter an amount.";
      return;
    }

    try {
      const res = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
      const data = await res.json();
      result.textContent = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
    } catch (error) {
      result.textContent = "Error fetching conversion data.";
    }
  });
});
