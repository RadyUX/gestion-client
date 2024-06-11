document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            console.log('click detected');
            const target = event.target as HTMLElement;
            console.log(target);
            const clientId = (event.target as HTMLElement).getAttribute('data-id');
            console.log(clientId);
            if (clientId) {
                try {
                    console.log('request sent');
                    const response = await fetch(`/delete/${clientId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        // Remove the row from the table
                        const buttonElement = event.target as HTMLElement;
                        const row = buttonElement.closest('tr');
                        if (row) {
                            row.remove();
                        }
                    } else {
                        console.error('Erreur lors de la suppression du client');
                    }
                } catch (error) {
                    console.error('Erreur réseau', error);
                }
            }
        });
    });
});


