import express, {Express} from "express"
import { checkAdmin, authAdmin } from "./sesseur"
import { getAllClients } from "./sqlite";
import parser from "./parseur";
import db from "./sqlite";

import { deleteClient, updateClient, addClient } from "./sqlite";
interface Client{
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    password: string;
}
const router = express.Router()

//connecter ?non page de connexion si oui acceuil
router.get('/', (req, res) => {
   
    if (req.session.adminId) {
       
        res.redirect('/acceuil');
    } else {
     
        res.render('login');
    }
});

router.get('/login', (req, res) => {
    res.render('login')
})

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

// route vers page de operation update 
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
// methode update du client specifique
parser.post("/dashboard/update/:id", checkAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const client = req.body;
    updateClient(id, client, (err: any) => {
        if (err) {
            res.status(500).send("Database error");
        } else {
            res.redirect("/dashboard");
        }
    });
});

// 

// operation suppression du client
router.post("/dashboard/delete/:id", checkAdmin,(req, res) => {
    const id = parseInt(req.params.id, 10);
    deleteClient(id, (err: any) => {
        if (err) {
            res.status(500).send("Database error");
        } else {
            res.redirect("/dashboard");
        }
    });
});
//route page de suppression de l'utilisateur specifique

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

//operation d'ajout
router.post("/dashboard/add", checkAdmin, (req, res) => {
    const client: Client = req.body;
    addClient(client, (err: any) => {
        if (err) {
            res.status(500).send("Database error");
        } else {
            res.redirect("/dashboard");
        }
    });
});

//formulaire d'ajout route
router.get("/dashboard/addPage", checkAdmin, (req, res) => {
    res.render("addPage");
});

//operation de recherche
router.get("/dashboard/findPage", checkAdmin, (req, res) => {
    const nom = req.query.nom as string;


    db.all("SELECT * FROM Client WHERE nom LIKE ?", [`%${nom}%`], (err: Error | null, clients: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).send("Database error");
        } else {
            res.render("findPage", { clients }); // Notez que nous passons `clients` à la vue
        }
    });
});


//formulaire de recherche
router.get("/dashboard/searchForm", checkAdmin, (req, res) => {
    res.render("searchForm"); // Assurez-vous que ce fichier s'appelle `searchForm.ejs`
});

//formulaire de recherche
export default router