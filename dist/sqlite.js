"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAdmin = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const db = new sqlite3_1.default.Database('./Clients.db');
exports.default = db;
//get all Admin
const getAllAdmin = (callback) => {
    db.all("SELECT * FROM Admin", (err, rows) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, rows);
    });
};
exports.getAllAdmin = getAllAdmin;
