import sqlite3 from "sqlite3"

const db = new sqlite3.Database('./Clients.db')

export default db