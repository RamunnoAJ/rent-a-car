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

    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const country = e.target.country.value;
    const address = e.target.address.value;
    const driverLicense = e.target["driver-license"].value;

    const isValid = validateForm({
        name,
        email,
        phone,
        country,
        address,
        driverLicense
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
    const { name, email, phone, country, address, driverLicense } = formData;

    const errors = [];

    if (!name) {
        errors.push("Name is required.");
    }

    if (!email) {
        errors.push("Email is required.");
    }

    if (!phone) {
        errors.push("Phone is required.");
    }

    if (!country) {
        errors.push("Country is required.");
    }

    if (!address) {
        errors.push("Address is required.");
    }

    if (!driverLicense) {
        errors.push("Driver license is required.");
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
