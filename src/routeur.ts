import express, {Express} from "express"
import { checkAdmin, authAdmin } from "./sesseur"
import { getAllClients } from "./sqlite";
import db from "./sqlite";
import multer from "multer";
import { importClients } from "./parseur";

const upload = multer({ dest: 'uploads/' });

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
       
        res.redirect('/dashboard');
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
            res.redirect("dashboard")
        }
    });
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
            const adminName = req.session.adminName
            res.render("dashboard", { clients, adminName });
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
router.put("/dashboard/update/:id", checkAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const client = req.body;

    console.log('Received update request for client:', id);
    console.log('Client data:', client);

    updateClient(id, client, (err: any) => {
        if (err) {
            res.status(500).send("Database error");
            console.log(err);
        } else {
            res.redirect("/");
            console.log('Client updated successfully');
        }
    });
});


// 

// operation suppression du client
router.delete("/delete/:id", checkAdmin,(req, res) => {
    const id = parseInt(req.params.id, 10);
    const adminName = req.session.adminName
    deleteClient(id, (err: any) => {
        if (err) {
            res.status(500).json({ error: "Database error" });
        } else {
            res.status(200).json({ success: true });
         console.log()
        }
    });
});


//operation d'ajout
router.post("/dashboard/add", checkAdmin, (req, res) => {
    const client: Client = req.body;
    addClient(client, (err: any) => {
        if (err) {
            res.status(500).send("Database error");
            console.log(err)
        } else {
            res.redirect("/");
        }
    });
});

//formulaire d'ajout route
router.get("/dashboard/addPage", checkAdmin, (req, res) => {
    res.render("addPage");
});

//operation de recherche
router.get("/dashboard/find", checkAdmin, (req, res) => {
    const query = req.query.query as string;


    db.all("SELECT * FROM Client WHERE nom LIKE ? OR prenom LIKE ?", [`%${query}%`], (err: Error | null, clients: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json({ clients });
        }
    });
});


//formulaire de recherche
router.get("/dashboard/searchForm", checkAdmin, (req, res) => {
    res.render("searchForm"); 
});


router.get("/dashboard/export", checkAdmin, (req, res) => {
    getAllClients((err: any, clients: any[]) => {
        if (err) {
            res.status(500).send("Database error");
        } else {
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

router.post('/dashboard/import', checkAdmin, upload.single('csvFile'), importClients);
export default router