"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClient = exports.deleteClient = exports.addClient = exports.getClientbyId = exports.getAllClients = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db = new sqlite3_1.default.Database('./Clients.db');
exports.default = db;
const saltRounds = 10; // You can adjust the number of rounds based on security and performance requirements
function hashPassword(password) {
    return bcrypt_1.default.hashSync(password, saltRounds);
}
//CRUD CLIENT
//get list client
const getAllClients = (callback) => {
    db.all("SELECT * FROM Client", (err, row) => {
        callback(err, row);
    });
};
exports.getAllClients = getAllClients;
//get client by id
const getClientbyId = (id, callback) => {
    db.get("SELECT * FROM Client WHERE id = ?", [id], (err, row) => {
        callback(err, row);
    });
};
exports.getClientbyId = getClientbyId;
//add client
const addClient = (client, callback) => {
    const hashpassword = hashPassword(client.password);
    db.run("INSERT INTO Client (nom, prenom, email, telephone, adresse, password VALUES (?, ?, ?, ?, ?, ?)", [client.nom, client.prenom, client.email, client.telephone, client.adresse, hashpassword], (err) => {
        callback(err);
    });
};
exports.addClient = addClient;
//delete client
const deleteClient = (id, callback) => {
    db.run("DELETE FROM Client WHERE id = ?", [id], (err) => {
        callback(err);
    });
};
exports.deleteClient = deleteClient;
//update client
const updateClient = (id, client, callback) => {
    const hashpassword = hashPassword(client.password);
    db.run("UPDATE Client SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ?, password = ? WHERE id = ?", [client.nom, client.prenom, client.email, client.telephone, client.adresse, hashpassword, client.id], (err) => {
        callback(err);
    });
};
exports.updateClient = updateClient;
//# sourceMappingURL=sqlite.js.map