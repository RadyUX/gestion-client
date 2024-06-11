import express, { Express } from 'express';
import  path from 'path'
import url from 'url'
import router from "./routeur"
import sesseur from './sesseur'

import methodOverride from 'method-override';

const app: Express = express()

// config serveur
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});


//middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sesseur);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use('/', router)
