// dashboard.ts
document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const clientId = this.getAttribute('data-id');
            if (!clientId) {
                console.error('Client ID is missing');
                return;
            }
            fetch(`/dashboard/delete/${clientId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                if (response.ok) {
                    return response.text();
                }
                else {
                    throw new Error('Failed to delete client');
                }
            }).then(() => {
                const row = this.closest('tr');
                if (row) {
                    row.remove();
                }
            }).catch(error => console.error('Error:', error));
        });
    });
});
alert("grosse tcjoin");
//# sourceMappingURL=script.js.map