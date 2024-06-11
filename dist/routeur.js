"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sesseur_1 = require("./sesseur");
const sqlite_1 = require("./sqlite");
const sqlite_2 = __importDefault(require("./sqlite"));
const multer_1 = __importDefault(require("multer"));
const parseur_1 = require("./parseur");
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const sqlite_3 = require("./sqlite");
const router = express_1.default.Router();
//connecter ?non page de connexion si oui acceuil
router.get('/', (req, res) => {
    if (req.session.adminId) {
        res.redirect('/dashboard');
    }
    else {
        res.render('login');
    }
});
router.get('/login', (req, res) => {
    res.render('login');
});
// login admin
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    (0, sesseur_1.authAdmin)(username, password, (err, admin) => {
        if (err || !admin) {
            res.status(401).render("login", { error: "Invalid credentials" });
        }
        else {
            // Stocker l'ID et le username de l'admin dans la session
            req.session.adminId = admin.id;
            req.session.adminName = admin.username; // Ajoutez cette ligne pour stocker le username dans la session
            res.redirect("dashboard");
        }
    });
});
// page d'acceuil 
router.get('/acceuil', sesseur_1.checkAdmin, (req, res) => {
    res.render('acceuil', { adminName: req.session.adminName });
});
router.get("/logout", sesseur_1.checkAdmin, (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});
// Route principal Dashboard admin
router.get("/dashboard", sesseur_1.checkAdmin, (req, res) => {
    (0, sqlite_1.getAllClients)((err, clients) => {
        if (err) {
            res.status(500).send("Database error");
        }
        else {
            const adminName = req.session.adminName;
            res.render("dashboard", { clients, adminName });
        }
    });
});
// route vers page de operation update 
router.get("/update/:id", sesseur_1.checkAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    sqlite_2.default.get("SELECT * FROM Client WHERE id = ?", [id], (err, client) => {
        if (err || !client) {
            res.status(404).send("Client not found");
        }
        else {
            res.render("updatePage", { client });
        }
    });
});
// methode update du client specifique
router.post("/dashboard/update/:id", sesseur_1.checkAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const client = req.body;
    (0, sqlite_3.updateClient)(id, client, (err) => {
        if (err) {
            res.status(500).send("Database error");
        }
        else {
            res.redirect("/dashboard");
        }
    });
});
// 
// operation suppression du client
router.delete("/delete/:id", sesseur_1.checkAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const adminName = req.session.adminName;
    (0, sqlite_3.deleteClient)(id, (err) => {
        if (err) {
            res.status(500).json({ error: "Database error" });
        }
        else {
            res.status(200).json({ success: true });
            console.log();
        }
    });
});
//operation d'ajout
router.post("/dashboard/add", sesseur_1.checkAdmin, (req, res) => {
    const client = req.body;
    (0, sqlite_3.addClient)(client, (err) => {
        if (err) {
            res.status(500).send("Database error");
        }
        else {
            res.redirect("/dashboard");
        }
    });
});
//formulaire d'ajout route
router.get("/dashboard/addPage", sesseur_1.checkAdmin, (req, res) => {
    res.render("addPage");
});
//operation de recherche
router.get("/dashboard/find", sesseur_1.checkAdmin, (req, res) => {
    const query = req.query.query;
    sqlite_2.default.all("SELECT * FROM Client WHERE nom LIKE ? OR prenom LIKE ?", [`%${query}%`], (err, clients) => {
        if (err) {
            console.error(err);
            res.status(500).send("Database error");
        }
        else {
            res.render("dashboard", { clients, adminName: req.session.adminName });
        }
    });
});
//formulaire de recherche
router.get("/dashboard/searchForm", sesseur_1.checkAdmin, (req, res) => {
    res.render("searchForm");
});
router.get("/dashboard/export", sesseur_1.checkAdmin, (req, res) => {
    (0, sqlite_1.getAllClients)((err, clients) => {
        if (err) {
            res.status(500).send("Database error");
        }
        else {
            const csv = clients.map(client => [
                client.id,
                client.prenom,
                client.nom,
                client.email,
                client.adresse,
                client.telephone,
                client.password
            ].join(",")).join("\n");
            res.header("Content-Type", "text/csv");
            res.attachment("clients.csv");
            res.send(csv);
        }
    });
});
router.post('/dashboard/import', sesseur_1.checkAdmin, upload.single('csvFile'), parseur_1.importClients);
exports.default = router;
//# sourceMappingURL=routeur.js.map