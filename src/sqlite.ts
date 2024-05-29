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


 const hashedPwd = (password: string)=>{
    const hashPwd = bcrypt.hashSync(password, 10)
    return hashPwd
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
const hashpassword = hashedPwd(client.password);
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
    const hashpassword = hashedPwd(client.password);
    db.run("UPDATE Client SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ?, password = ? WHERE id = ?",
        [client.nom, client.prenom, client.email, client.telephone, client.adresse, hashpassword, id],
        (err) => {
            callback(err);
        }
    );
};

