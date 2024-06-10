"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importClients = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const sqlite_1 = require("./sqlite");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const importClients = (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file was uploaded.");
    }
    const results = [];
    fs_1.default.createReadStream(req.file.path)
        .pipe((0, csv_parser_1.default)())
        .on('data', (data) => results.push(data))
        .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            for (const client of results) {
                yield new Promise((resolve, reject) => {
                    (0, sqlite_1.addClient)(client, (err) => {
                        if (err) {
                            console.error('Erreur lors de l\'ajout du client :', err);
                            reject(err);
                        }
                        else {
                            console.log('Client ajouté avec succès.');
                            resolve();
                        }
                    });
                });
            }
            res.send('Import successful');
        }
        catch (error) {
            res.status(500).send("Erreur lors de l'importation des clients");
        }
    }))
        .on('error', error => {
        console.error('Error processing CSV:', error);
        res.status(500).send('Failed to process CSV');
    });
};
exports.importClients = importClients;
//# sourceMappingURL=parseur.js.map