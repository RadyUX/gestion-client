import express, { Express } from 'express';
import  path from 'path'
import url from 'url'
//import routeur from './routeur.ts'
//import sesseur from './sesseur.ts'


const app: Express = express()

// config serveur
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});


//middleware

//route
