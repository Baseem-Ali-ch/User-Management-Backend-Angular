"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminController_2 = require("../controllers/adminController");
const adminRouter = express_1.default.Router();
adminRouter.post('/login', adminController_1.adminLogin);
adminRouter.get('/users', adminController_1.getAllUsers);
adminRouter.post('/users', adminController_1.addUser);
adminRouter.delete('/deleteUser/:id', adminController_2.deleteUser);
adminRouter.put('/updateUser/:id', adminController_2.editUser);
exports.default = adminRouter;
