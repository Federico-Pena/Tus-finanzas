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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config.js");
const response_1 = require("../../utils/response");
const user_1 = __importDefault(require("../../models/user"));
const secretKey = process.env.JWT_SECRET;
const adminUserIds = (_a = process.env.ADMIN_USER_IDS) !== null && _a !== void 0 ? _a : '';
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usernameOrEmail, password } = req.body;
        const userToFind = usernameOrEmail.trim();
        const user = yield user_1.default.findOne({
            $or: [{ username: userToFind }, { email: userToFind }]
        });
        if (user === null) {
            return (0, response_1.sendResponse)(res, 400, { error: 'Credenciales incorrectas.' });
        }
        const passwordMatch = yield (0, bcrypt_1.compare)(password, user.password);
        if (!passwordMatch) {
            return (0, response_1.sendResponse)(res, 400, { error: 'Credenciales incorrectas.' });
        }
        const isAdmin = adminUserIds.includes(user._id.toString());
        let token;
        let role;
        if (isAdmin) {
            token = jsonwebtoken_1.default.sign({ name: user.username, role: 'admin' }, secretKey, {
                expiresIn: '7h'
            });
            role = 'admin';
        }
        else {
            token = jsonwebtoken_1.default.sign({ name: user.username, role: 'user' }, secretKey, {
                expiresIn: '7h'
            });
            role = 'user';
        }
        return (0, response_1.sendResponse)(res, 200, {
            data: { token, user: { name: user.username, role } },
            message: `Hola otra vez ${user.username}`
        });
    }
    catch (e) {
        (0, response_1.sendResponse)(res, 500, { error: 'Error interno del servidor.' });
    }
});
exports.login = login;
