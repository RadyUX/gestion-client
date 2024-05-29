import express, {Express} from "express"
import csvParser from "csv-parser"
import { getAllClients, getClientbyId, addClient, updateClient, deleteClient } from "./sqlite"
import { checkAdmin } from "./sesseur"
import fs from 'fs'
import multer from "multer"

const upload = multer({ dest: 'uploads/' });


export const importClients = (req: express.Request, res: express.Response) => {
    if (!req.file) {
        return res.status(400).send("No file was uploaded.");
    }

    const results: any[] = [];
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                for (const client of results) {
                    await new Promise<void>((resolve, reject) => {
                        addClient(client, (err: any) => {
                            if (err) {
                                console.error('Erreur lors de l\'ajout du client :', err);
                                reject(err);
                            } else {
                                console.log('Client ajouté avec succès.');
                                resolve();
                            }
                        });
                    });
                }
                res.send('Import successful');
            } catch (error) {
                res.status(500).send("Erreur lors de l'importation des clients");
            }
        })
        .on('error', error => {
            console.error('Error processing CSV:', error);
            res.status(500).send('Failed to process CSV');
        });
};




