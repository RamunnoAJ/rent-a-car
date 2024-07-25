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

    const email = e.target.email.value;
    const password = e.target.password.value;

    const isValid = validateForm({
        email,
        password
    });

    if (!isValid) {
        return;
    }
}

function validateForm({ email, password }) {}
