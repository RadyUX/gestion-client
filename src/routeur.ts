import express, {Express} from "express"
import { checkAdmin, authAdmin } from "./sesseur"
import { getAllClients } from "./sqlite";
import parser from "./parseur";
import db from "./sqlite";
// import parseur.ts 
const router = express.Router()

//connecter ?non page de connexion si oui acceuil
router.get('/', (req, res) => {
   
    if (req.session.adminId) {
       
        res.redirect('/acceuil');
    } else {
     
        res.render('login');
    }
});

// login admin
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    authAdmin(username, password, (err, admin) => {
        if (err || !admin) {
            res.status(401).render("login", { error: "Invalid credentials" });
        } else {
            // Stocker l'ID et le username de l'admin dans la session
            req.session.adminId = admin.id;
            req.session.adminName = admin.username; // Ajoutez cette ligne pour stocker le username dans la session
            res.redirect("/acceuil");
        }
    });
});

// page d'acceuil 
router.get('/acceuil', checkAdmin, (req, res) => {
    res.render('acceuil', { adminName: req.session.adminName }); 
});




router.get("/logout", checkAdmin, (req, res) => {
    req.session!.destroy(() => {
        res.redirect("/login");
    });
});
// Route principal Dashboard admin
router.get("/dashboard", checkAdmin, (req, res) => {
    getAllClients((err: any, clients: any) => {
        if (err) {
            res.status(500).send("Database error");
        } else {
            res.render("dashboard", { clients });
        }
    });
});

router.get("/update/:id", checkAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.get("SELECT * FROM Client WHERE id = ?", [id], (err: Error | null, client: any) => {
        if (err || !client) {
            res.status(404).send("Client not found");
        } else {
            res.render("updatePage", { client });
        }
    });
});




//operation route sur client

router.get("/del/:id", checkAdmin, (req, res)=>{
  const id = parseInt(req.params.id, 10)
  db.get("SELECT * FROM Client WHERE id = ?",[id], (err: Error | null, client: null)=>{
    if (err || !client) {
        res.status(404).send("Client not found");
    } else {
        res.render("deletePage", { client });
    }
  })
})
export default router