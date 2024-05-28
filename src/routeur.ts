import express, {Express} from "express"
import { checkAdmin, authAdmin } from "./sesseur"
import { getAllAdmin } from "./sqlite";
// import parseur.ts 
const router = express.Router()

router.get('/login', (req, res) => {
    res.render('login');
});

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


router.get('/dashboard', (req, res) => {
    res.send('Bienvenue dans le tableau de bord admin!');
});


router.get('/admins',  (req, res) => {
    getAllAdmin((err, admins) => {
        if (err) {
            res.status(500).send("Erreur lors de la récupération des administrateurs");
            return;
        }
        res.render('admin', { admins });
    });
});

export default router