"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sesseur_1 = require("./sesseur");
const sqlite_1 = require("./sqlite");
// import parseur.ts 
const router = express_1.default.Router();
//page de connexion
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
            req.session.adminId = admin.id;
            res.redirect("/dashboard");
        }
    });
});
router.get('/dashboard', sesseur_1.checkAdmin, (req, res) => {
    res.send('Bienvenue dans le tableau de bord admin!');
});
router.get('/admins', (req, res) => {
    (0, sqlite_1.getAllAdmin)((err, admins) => {
        if (err) {
            res.status(500).send("Erreur lors de la récupération des administrateurs");
            return;
        }
        res.render('admin', { admins });
    });
});
exports.default = router;
