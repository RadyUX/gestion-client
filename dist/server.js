"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routeur_1 = __importDefault(require("./routeur"));
const sesseur_1 = __importDefault(require("./sesseur"));
const method_override_1 = __importDefault(require("method-override"));
const app = (0, express_1.default)();
// config serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
//middleware
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, method_override_1.default)('_method'));
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(sesseur_1.default);
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../views"));
app.use('/', routeur_1.default);
//# sourceMappingURL=server.js.map