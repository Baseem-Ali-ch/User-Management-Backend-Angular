"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.send('hello');
});
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.get('/user', userController_1.getUser);
router.put('/updateUser', userController_1.updateUser);
exports.default = router;
