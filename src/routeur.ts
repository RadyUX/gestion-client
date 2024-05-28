import express, {Express} from "express"
import { checkAdmin, authAdmin } from "./sesseur"
// import parseur.ts 
const router = express.Router()
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    authAdmin(username, password, (err, admin) => {
        if (err || !admin) {
            res.status(401).render('login', { message: 'Invalid credentials' });
            return;
        }

        req.session.adminId = admin.id;
    
    });
});

export default router