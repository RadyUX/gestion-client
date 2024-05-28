import sqlite3 from "sqlite3"
import Admin  from './types';
const db = new sqlite3.Database('./Clients.db')

export default db

//get all Admin
export const getAllAdmin = (callback: (err: Error | null, rows?: Admin) => void) => {
    db.all("SELECT * FROM Admin", (err: Error, rows: Admin) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, rows);
    });
};