"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
let userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt_1.default.hash(user.password, 10, function (err, hash) {
        if (err)
            return next(err);
        user.password = hash;
        next();
    });
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
