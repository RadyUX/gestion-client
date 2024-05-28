import express, {Express} from "express"
import { checkAdmin, authAdmin } from "./sesseur"
import { getAllClients } from "./sqlite";

// import parseur.ts 
const router = express.Router()

//page de connexion
router.get('/login', (req, res) => {
    res.render('login');
});


// login admin
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    authAdmin(username, password, (err, admin) => {
        if (err || !admin) {
            res.status(401).render("login", {error: "Invalid credentials" });
        } else {
            req.session.adminId = admin.id;
            res.redirect("/dashboard");
        }
    });
});

router.get('/dashboard', checkAdmin, (req, res) => {
    getAllClients((err: Error, clients: any) => {
        if (err) {
            return res.status(500).send("Erreur lors de la récupération des clients");
        }
        res.render('dashboard', { clients });
    });
});


export default router