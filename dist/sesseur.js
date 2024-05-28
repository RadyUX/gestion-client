"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAdmin = exports.checkAdmin = exports.createAdmin = exports.hashPwd = void 0;
const express_session_1 = __importDefault(require("express-session"));
const sqlite_1 = __importDefault(require("./sqlite"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//session
const sesseur = (0, express_session_1.default)({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
});
//sécurité: hasher le mdp
const hashPwd = (password) => {
    const salt = 10;
    return bcrypt_1.default.hashSync(password, salt);
};
exports.hashPwd = hashPwd;
const createAdmin = (username, password, callback) => {
    const hashedPassword = (0, exports.hashPwd)(password);
    sqlite_1.default.run("INSERT INTO Admin (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
        if (err) {
            callback(err);
        }
        else {
            sqlite_1.default.get("SELECT * FROM Admin WHERE username = ?", [username], (err, row) => {
                callback(err, row);
            });
        }
    });
};
exports.createAdmin = createAdmin;
// LOGIN
//check si l'utilisateur EST un admin sinon login
const checkAdmin = (req, res, next) => {
    if (req.session && req.session.adminId) {
        next();
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
exports.checkAdmin = checkAdmin;
//check les information de l'admin 
const authAdmin = (username, password, callback) => {
    // recherche dans notre db
    console.log("Recherche pour l'username:", username);
    sqlite_1.default.get('SELECT * FROM Admin WHERE username = ?', [username], (err, row) => {
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
        const isPasswordValid = bcrypt_1.default.compareSync(password, row.password);
        if (!isPasswordValid) {
            callback(new Error("invalid password"));
            return;
        }
        // si ça match alors on renvoie l'objet admin
        const admin = {
            id: row.id,
            username: row.username,
            password: row.password
        };
        callback(null, admin);
    });
};
exports.authAdmin = authAdmin;
exports.default = sesseur;
