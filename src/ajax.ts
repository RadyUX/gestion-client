

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

   
    const search = document.getElementById('searchInput') as HTMLInputElement;
    search.addEventListener('input', async () => {
        const query = search.value;
        const clientData = await searchClient(query);
        if (clientData && clientData.clients) {
            updateClientTable(clientData.clients);
            console.log(clientData.clients);
        } else {
            console.log('No clients found or error in fetching clients.');
        }
    });
});

const uploadForm = document.getElementById('uploadForm') as HTMLFormElement;
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(uploadForm);

    const response = await fetch('/dashboard/import', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const newClients = await response.json();
        updateClientTable(newClients);
    } else {
        console.error('Erreur lors de l\'importation du fichier CSV');
    }
});

const searchClient = async (query: string) => {
    const res = await fetch(`/dashboard/find?query=${encodeURIComponent(query)}`);
    if (res.ok) {
        const clientData = await res.json();
        return clientData;
    } else {
        console.error('Error fetching clients:', res.statusText);
        return { clients: [] };
    }
}
// Fonction pour mettre à jour la table des clients avec les résultats de la recherche
function updateClientTable(clients: any[]) {
    const tbody = document.querySelector('table tbody');
    if (tbody) {
        tbody.innerHTML = ''; // Clear the table body

        clients.forEach(client => {
            const row = document.createElement('tr');
            row.classList.add('client');
            row.innerHTML = `
                <td>${client.nom}</td>
                <td>${client.prenom}</td>
                <td>${client.email}</td>
                <td>${client.telephone}</td>
                <td>${client.adresse}</td>
                <td class="btn-container">
                    <button class="delete-btn" data-id="${client.id}">delete</button>
                    <form action="/update/${client.id}" method="get" class="delete">
                        <button type="submit" class="update-btn">update</button>
                    </form>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}