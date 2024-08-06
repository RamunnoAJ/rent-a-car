const $errors = document.querySelectorAll(".notification.is-danger");
if ($errors) {
    $errors.forEach(error => {
        setTimeout(() => error.classList.add("is-hidden"), 3000);
    });
}

const $messages = document.querySelectorAll(".notification.is-success");
if ($messages) {
    $messages.forEach(message => {
        setTimeout(() => message.classList.add("is-hidden"), 3000);
    });
}

const $deleteButtons = document.querySelectorAll(".btn-delete");

$deleteButtons.forEach(button => {
    button.addEventListener("click", e => {
        const id = e.target.id.split("-")[1];
        deleteReservation(id);
    });
});

/**
 * @param {string} id
 */
async function deleteReservation(id) {
    fetch(`/reservations/delete/${id}`, {
        method: "DELETE"
    });

    window.location.reload();
}
