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
exports.updateUser = exports.getUser = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../DB/models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = require("cloudinary");
function generateJwtToken(userId, email, type, secretKey) {
    const payload = { userId, email, type };
    const options = { expiresIn: "6h" };
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
}
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "email already exists",
                err: "email",
            });
        }
        console.log(name);
        const user = new userModel_1.default({ name, email, password });
        yield user.save();
        const token = generateJwtToken(user._id.toString(), user.email, "user", process.env.JWT_SECRET);
        res.status(200).json({
            message: "user saved successfully",
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "user not found",
                err: "user",
            });
        }
        const token = generateJwtToken(user._id.toString(), user.email, "user", process.env.JWT_SECRET);
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            console.log('problem is ti match the password');
            return res.status(400).json({
                message: "incorrect password",
                err: "password",
            });
        }
        else {
            res.status(200).json({
                message: "login successful",
                token,
                user
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({
            message: "token not found",
            err: "token",
        });
    }
    const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const findUser = yield userModel_1.default.findOne({ _id: payload.userId });
    if (!findUser) {
        return res.status(400).json({
            message: "user not found",
            err: "user",
        });
    }
    else {
        res.status(200).json({
            message: "user found",
            user: findUser
        });
    }
});
exports.getUser = getUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const tokenPayload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = tokenPayload.userId;
        const { _name, _email, _oldPassword, _newPassword, _profilePic } = req.body;
        const user = yield userModel_1.default.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (_newPassword) {
            const isMatch = yield bcrypt_1.default.compare(_oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect password" });
            }
            user.password = _newPassword;
        }
        user.name = _name || user.name;
        user.email = _email || user.email;
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
exports.updateUser = updateUser;
