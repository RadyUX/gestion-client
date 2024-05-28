import bcrypt from "bcrypt";
import sqlite3 from "sqlite3";
import {faker} from "@faker-js/faker"

const db = new sqlite3.Database('Clients.db');

const adminPassword = bcrypt.hashSync("Rady1234.", 10);

const adminData = {
    id: 1,
    username: "Rafaele",
    password: adminPassword  
};


db.run("INSERT INTO Admin (id, username, password) VALUES (?, ?, ?)", 
    [adminData.id, adminData.username, adminData.password], 
    function(err) {
        if (err) {
            console.error("Error inserting admin data: ", err.message);
        } else {
            console.log("Admin inserted successfully");
        }
    }
);


const clientData = Array.from({length: 5}, (_, index)=>({
    id: index +2,
    nom: faker.name.lastName(),
    prenom: faker.name.firstName(),
    email: faker.internet.email(),
    adresse: faker.address.streetAddress(),
    telephone: parseInt(faker.phone.number("########")),
    password: bcrypt.hashSync(faker.internet.password(), 10)
}))
