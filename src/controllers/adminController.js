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
exports.deleteUser = exports.editUser = exports.addUser = exports.getAllUsers = exports.adminLogin = void 0;
const userModel_1 = __importDefault(require("../DB/models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = require("cloudinary");
const express_validator_1 = require("express-validator");
function generateJwtToken(userId, email, type, secretKey) {
    const payload = { userId, email, type };
    const options = { expiresIn: "6h" };
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
}
const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const admin = yield userModel_1.default.findOne({ email, isAdmin: true });
        if (!admin) {
            return res.status(400).json({
                message: "admin not found",
                err: "admin",
            });
        }
        const token = generateJwtToken(admin._id.toString(), admin.email, "admin", process.env.JWT_SECRET);
        const isMatch = yield bcrypt_1.default.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "incorrect password",
                err: "password",
            });
        }
        res.status(200).json({
            message: "login successful",
            admin,
            token
        });
    }
    catch (error) {
        next(error);
    }
});
exports.adminLogin = adminLogin;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find({ isAdmin: false });
        res.status(200).json({
            users
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { _name, _email, _password, _profilePic } = req.body;
        const existingUser = yield userModel_1.default.findOne({ email: _email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new userModel_1.default({
            name: _name,
            email: _email,
            password: _password,
        });
        if (_profilePic) {
            try {
                const uploadResponse = yield cloudinary_1.v2.uploader.upload(_profilePic, {
                    folder: 'user_profiles',
                });
                newUser.profileImg = uploadResponse.secure_url;
            }
            catch (error) {
                return res.status(500).json({ message: 'Error uploading image' });
            }
        }
        yield newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.addUser = addUser;
const editUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    const { _name, _email, _oldPassword, _newPassword, _profilePic } = req.body;
    try {
        const user = yield userModel_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.name = _name || user.name;
        user.email = _email || user.email;
        if (_newPassword) {
            const isMatch = yield bcrypt_1.default.compare(_oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect password" });
            }
            user.password = _newPassword;
        }
        if (_profilePic) {
            try {
                const result = yield cloudinary_1.v2.uploader.upload(_profilePic, {
                    resource_type: "auto",
                });
                user.profileImg = result.secure_url;
            }
            catch (error) {
                console.log(error);
            }
        }
        yield user.save();
        res.status(200).json({
            message: "user updated successfully",
            user
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editUser = editUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield userModel_1.default.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
