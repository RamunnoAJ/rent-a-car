const $deleteButtons = document.querySelectorAll(".btn-delete");

$deleteButtons.forEach(button => {
    button.addEventListener("click", e => {
        const id = e.target.id.split("-")[1];
        console.log(id, e.target.id);
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
