const $form = document.querySelector("form");

$form.addEventListener("submit", handleSubmit);

/** @param {SubmitEvent} e  */
async function handleSubmit(e) {
    const $errorContainer = document.querySelector("#errors-container");
    const $errors = document.querySelector("#errors");
    $errors.innerHTML = "";
    if (!$errorContainer.className.includes("is-hidden")) {
        $errorContainer.classList.add("is-hidden");
    }

    const brand = e.target.brand.value;
    const model = e.target.model.value;
    const year = e.target.year.value;
    const kms = e.target.kms.value;
    const color = e.target.color.value;
    const airConditioning = Number(e.target["air-conditioning"].value);
    const seats = e.target.seats.value;
    const transmission = e.target.transmission.value;
    const price = e.target.price.value;

    const isValid = validateForm({
        brand,
        model,
        year,
        kms,
        color,
        airConditioning,
        seats,
        transmission,
        price
    });

    if (!isValid) {
        return;
    }
}

/**
 * @param {object} formData
 * @returns {boolean}
 */
function validateForm(formData) {
    const {
        brand,
        model,
        year,
        kms,
        color,
        airConditioning,
        seats,
        transmission,
        price
    } = formData;

    const errors = [];

    if (!brand) {
        errors.push("Brand is required.");
    }

    if (!model) {
        errors.push("Model is required.");
    }

    if (!year) {
        errors.push("Year is required.");
    }

    if (!kms) {
        errors.push("Kms are required.");
    }

    if (!color) {
        errors.push("Color is required.");
    }

    if (!airConditioning) {
        errors.push("Select air conditioning.");
    }

    if (!seats) {
        errors.push("Seats are required.");
    }

    if (!transmission) {
        errors.push("Select transmission.");
    }

    if (!price) {
        errors.push("Price is required.");
    }

    if (year <= 0) {
        errors.push("Year is not valid.");
    }

    if (kms < 0) {
        errors.push("Kilometers are not valid.");
    }

    if (price <= 0) {
        errors.push("Price is not valid.");
    }

    if (errors.length > 0) {
        showErrors(errors);
        return true;
    }

    return false;
}

/** @param {Array<string>} errors  */
function showErrors(errors) {
    const $errorContainer = document.querySelector("#errors-container");
    const $errors = document.querySelector("#errors");

    $errorContainer.classList.remove("is-hidden");

    errors.forEach(e => {
        const $error = document.createElement("li");
        $error.textContent = e;
        $errors.appendChild($error);
    });
}
