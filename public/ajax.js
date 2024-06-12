var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            console.log('click detected');
            const target = event.target;
            console.log(target);
            const clientId = event.target.getAttribute('data-id');
            console.log(clientId);
            if (clientId) {
                try {
                    console.log('request sent');
                    const response = yield fetch(`/delete/${clientId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        // Remove the row from the table
                        const buttonElement = event.target;
                        const row = buttonElement.closest('tr');
                        if (row) {
                            row.remove();
                        }
                    }
                    else {
                        console.error('Erreur lors de la suppression du client');
                    }
                }
                catch (error) {
                    console.error('Erreur réseau', error);
                }
            }
        }));
    });
    const search = document.getElementById('searchInput');
    search.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
        const query = search.value;
        const clientData = yield searchClient(query);
        if (clientData && clientData.clients) {
            updateClientTable(clientData.clients);
            console.log(clientData.clients);
        }
        else {
            console.log('No clients found or error in fetching clients.');
        }
    }));
});
const uploadForm = document.getElementById('uploadForm');
uploadForm.addEventListener('submit', (event) => __awaiter(this, void 0, void 0, function* () {
    event.preventDefault();
    const formData = new FormData(uploadForm);
    const response = yield fetch('/dashboard/import', {
        method: 'POST',
        body: formData
    });
    if (response.ok) {
        const newClients = yield response.json();
        updateClientTable(newClients);
    }
    else {
        console.error('Erreur lors de l\'importation du fichier CSV');
    }
}));
const searchClient = (query) => __awaiter(this, void 0, void 0, function* () {
    const res = yield fetch(`/dashboard/find?query=${encodeURIComponent(query)}`);
    if (res.ok) {
        const clientData = yield res.json();
        return clientData;
    }
    else {
        console.error('Error fetching clients:', res.statusText);
        return { clients: [] };
    }
});
// Fonction pour mettre à jour la table des clients avec les résultats de la recherche
function updateClientTable(clients) {
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
//# sourceMappingURL=ajax.js.map