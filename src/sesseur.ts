import session, { Store } from 'express-session'
import { Request, Response, NextFunction } from "express";
import db from "./sqlite"
import bcrypt from "bcrypt"
import Admin  from "./types"
import connectSqlite3 from 'connect-sqlite3';

//session


const SQLiteStore: any = connectSqlite3(session)

const sesseur = session({
    store: new SQLiteStore({
      dir: '../',
      db: 'Clients.db',
      table: 'session'
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto', maxAge: 3600000 }
  });
  


declare module "express-session" {
    interface SessionData {
        adminId?: number;
        adminName?: string;
    }
}

//sécurité: hasher le mdp
export const hashPwd = (password: string) =>{
    const salt = 10
    return bcrypt.hashSync(password, salt)
}

export const createAdmin = (username: string, password: string, callback: (err: Error | null, admin?: Admin) => void) => {
    const hashedPassword = hashPwd(password);
    db.run("INSERT INTO Admin (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
        if (err) {
            callback(err);
        } else {
            db.get("SELECT * FROM Admin WHERE username = ?", [username], (err, row) => {
                callback(err, row as Admin);
            });
        }
    });
};


// LOGIN

//check si l'utilisateur EST un admin sinon pas authoriser
export const checkAdmin = (req: Request, res: Response, next: NextFunction) =>{
    if(req.session && req.session.adminId){
        next()
    } else{
        res.status(401).json({message: 'Unauthorized'})
    }
}
 
//check les information de l'admin 
export const authAdmin = (username: string, password: string, callback: (err: Error | null, admin?: Admin | undefined) => void) =>{
// recherche dans notre db
console.log("Recherche pour l'username:", username);
db.get<Admin>('SELECT * FROM Admin WHERE username = ?', [username], (err, row)=>{
    if (err) {
        console.error("Database error:", err.message);
        callback(new Error("Database error"));
        return;
    }
    if (!row) {
        console.error("Admin not found");
        console.log(row);
        callback(new Error("Invalid credentials"));
        return;
    }

//comparer le mdp
const isPasswordValid = bcrypt.compareSync(password, row.password)
if(!isPasswordValid){
    callback(new Error("invalid password"))
    return
}
// si ça match alors on renvoie l'objet admin
const admin: Admin = {
    id: row.id,
    username: row.username,
    password: row.password
};
callback(null, admin)
}
)


}  



export default sesseur