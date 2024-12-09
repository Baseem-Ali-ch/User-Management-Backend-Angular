"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const dotenv_1 = require("dotenv");
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const connect_1 = __importDefault(require("./DB/connection/connect"));
const cloudinary_1 = require("cloudinary");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
(0, dotenv_1.config)();
(0, connect_1.default)();
const port = 8001;
const app = (0, express_1.default)();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
app.use(express_1.default.json({ limit: "100mb" }));
app.use(express_1.default.urlencoded({ limit: "100mb", extended: true, parameterLimit: 50000 }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    limits: { fileSize: 2 * 1024 * 1024 },
}));
app.use((0, cors_1.default)({ origin: 'http://localhost:4200', credentials: true }));
app.use('/', userRoute_1.default);
app.use('/admin', adminRoutes_1.default);
app.listen(port, () => {
    console.log('server running');
});
