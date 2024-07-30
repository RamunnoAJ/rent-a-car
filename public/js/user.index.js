const $errors = document.querySelectorAll(".notification.is-danger");
if ($errors) {
    $errors.forEach(error => {
        setTimeout(() => error.classList.add("is-hidden"), 3000);
    });
}
const $deleteButtons = document.querySelectorAll(".btn-delete");

$deleteButtons.forEach(button => {
    button.addEventListener("click", e => {
        const id = e.target.id.split("-")[1];
        deleteUser(id);
    });
});

/**
 * @param {string} id
 */
async function deleteUser(id) {
    fetch(`/users/delete/${id}`, {
        method: "DELETE"
    });

    window.location.reload();
}
