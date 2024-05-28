import bcrypt from "bcrypt";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database('Clients.db');

const adminPassword = bcrypt.hashSync("Rady1234.", 10);

const adminData = {
    id: 1,
    username: "Rafaele",
    password: adminPassword  // Utiliser camelCase pour les clés de l'objet
};

// Assurez-vous que les noms des colonnes correspondent et corrigez le nombre de placeholders
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



