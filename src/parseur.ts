import express, {Express} from "express"
import csvParser from "csv-parser"
import { getAllClients, getClientbyId, addClient, updateClient, deleteClient } from "./sqlite"
import { checkAdmin } from "./sesseur"
import fs from 'fs'

const parser = express.Router()

parser.use(express.urlencoded({extended: true}))



//update
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

// delete
parser.post("/dashboard/delete/:id", checkAdmin,(req, res) => {
    const id = parseInt(req.params.id, 10);
    deleteClient(id, (err: any) => {
        if (err) {
            res.status(500).send("Database error");
        } else {
            res.redirect("/dashboard");
        }
    });
});


export default parser