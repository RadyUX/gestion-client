import sqlite3 from "sqlite3"
import bcrypt from "bcrypt"

import { hashPwd } from "./sesseur"
const db = new sqlite3.Database('./Clients.db')

 interface Client{
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    password: string;
}
export default db

const saltRounds = 10; // You can adjust the number of rounds based on security and performance requirements

function hashPassword(password: string) {
    return bcrypt.hashSync(password, saltRounds);
}
 
//CRUD CLIENT

//get list client
export const getAllClients = (callback: Function)=>{
    db.all("SELECT * FROM Client", (err, row)=>{
        callback(err, row)
    })
}

//get client by id
export const getClientbyId = (id: number, callback: Function) =>{
 db.get("SELECT * FROM Client WHERE id = ?", [id], (err, row) =>{
    callback(err,row);
 })
}


//add client
export const addClient = (client: Client, callback: Function) =>{
const hashpassword = hashPassword(client.password)
db.run("INSERT INTO Client (nom, prenom, email, telephone, adresse, password VALUES (?, ?, ?, ?, ?, ?)",
[client.nom, client.prenom, client.email, client.telephone, client.adresse, hashpassword],
(err) => {
    callback(err)
}
)
}

//delete client
export const deleteClient = (id: number, callback: Function) => {
    db.run("DELETE FROM Client WHERE id = ?", [id], (err) => {
        callback(err);
    });
};

//update client
export const updateClient = (id: number, client: Client, callback: Function) => {
    db.run("UPDATE Client SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ? WHERE id = ?",
        [client.nom, client.prenom, client.email, client.telephone, client.adresse,  id],
        (err) => {
            callback(err);
        }
    );
};

