const $form = document.querySelector("form");
document
    .querySelectorAll("input, select")
    .forEach(input => input.addEventListener("change", getTotalPrice));

let days;

function calculateDifference() {
    const date1Str = document.getElementById("from-date").value;
    const date2Str = document.getElementById("to-date").value;

    if (!date1Str || !date2Str) return;

    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);

    const diffInMillis = Math.abs(date2 - date1);

    days = Math.ceil(diffInMillis / (1000 * 60 * 60 * 24));

    document.getElementById("days").value = days;
}

document
    .querySelectorAll('input[type="date"]')
    .forEach(input => input.addEventListener("change", calculateDifference));

function getTotalPrice() {
    const carPrice = Number(
        document
            .querySelectorAll("#car > option:checked")[0]
            .textContent.split("$")[1]
    );

    if (!days || !carPrice) return;

    let price = carPrice * days;

    const hasBabyChair = document.querySelector("#baby-chair").value === "1";
    const hasSnowChain = document.querySelector("#snow-chain").value === "1";
    const paymentMethod = document.querySelector("#payment-method").value;
    if (hasBabyChair) price += 10000;
    if (hasSnowChain) price += 30000;

    switch (paymentMethod) {
        case "debit":
            price *= 1.05;
        case "credit":
            price *= 1.15;
        case "cash":
            price *= 0.9;
        default:
            price;
    }

    document.querySelector("#result").textContent = price.toFixed(2);
}
