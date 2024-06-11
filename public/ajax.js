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
            const clientId = event.target.getAttribute('data-id');
            if (clientId) {
                try {
                    console.log('request send');
                    const response = yield fetch(`/delete/${clientId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        // Remove the row from the table
                        const row = event.target.closest('tr');
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
});
//# sourceMappingURL=ajax.js.map