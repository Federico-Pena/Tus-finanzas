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
exports.register = void 0;
const bcrypt_1 = require("bcrypt");
const response_1 = require("../../utils/response");
const user_1 = __importDefault(require("../../models/user"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const name = username.trim();
        const userEmail = email.trim();
        const userPassword = password.trim();
        if (name.length < 3 || name.length > 12) {
            return (0, response_1.sendResponse)(res, 400, {
                error: 'El nombre de usuario debe tener entre 3 y 12 caracteres.'
            });
        }
        if (!isValidEmail(userEmail)) {
            return (0, response_1.sendResponse)(res, 400, { error: 'El formato del correo electrónico es inválido.' });
        }
        if (!isValidPassword(userPassword)) {
            return (0, response_1.sendResponse)(res, 400, {
                error: 'La contraseña debe tener entre 8 y 12 caracteres y contener al menos una letra mayúscula, una letra minúscula y un número.'
            });
        }
        const saltRounds = 10;
        const hashedPassword = yield (0, bcrypt_1.hash)(userPassword, saltRounds);
        const newUser = new user_1.default({
            username: name,
            email: userEmail,
            password: hashedPassword
        });
        yield newUser.save();
        return (0, response_1.sendResponse)(res, 200, {
            message: 'Usuario registrado exitosamente, ahora inicie sesión.'
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return (0, response_1.sendResponse)(res, 400, {
                error: 'El nombre de usuario o email esta asociado a otra cuenta.'
            });
        }
        (0, response_1.sendResponse)(res, 500, { error: 'Error interno del servidor.' });
    }
});
exports.register = register;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};
const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}$/;
    return passwordRegex.test(password.trim());
};
