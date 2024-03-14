"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateValidToken = exports.mockTransactions = exports.mockUsers = exports.mockCategories = exports.userTest = exports.categoryDataDefault = exports.categoryUpdate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const mongoose_1 = require("mongoose");
exports.categoryUpdate = {
    name: 'Categories 1 update',
    iconName: 'Categories 1 icon update',
    isDefault: false
};
exports.categoryDataDefault = {
    name: 'Test Category Default',
    iconName: 'Test Icon Default',
    isDefault: true
};
exports.userTest = {
    username: 'Usuario de Prueba',
    email: 'EmailDePrueba@gmail.com',
    password: 'passwordDePrueba'
};
exports.mockCategories = [
    {
        name: 'Categories 1',
        iconName: 'Categories 1 icon',
        isDefault: true,
        user: new mongoose_1.Types.ObjectId('65d6155ede4b6e40b9c7494b')
    },
    {
        name: 'Categories 2',
        iconName: 'Categories 2 icon',
        isDefault: false,
        user: new mongoose_1.Types.ObjectId('65d6155ede4b6e40b9c7494b')
    }
];
exports.mockUsers = [
    { username: 'PepeExample', email: 'pepeExample@example.com', password: 'Password88' },
    {
        username: 'MarioExample',
        email: 'marioExample@example.com',
        password: 'Password88'
    }
];
exports.mockTransactions = [
    {
        user: '5f77cbbf8c1d663f14475064',
        category: '5f77cbdf91b7fe3f289e3e30',
        amount: 100,
        description: 'Venta de libros',
        date: new Date(),
        isPayment: false,
        notificationEnabled: false
    },
    {
        user: '5f77cbbf8c1d663f14475064',
        category: '5f77cbdf91b7fe3f289e3e30',
        amount: 50,
        description: 'Artículos de papelería',
        isPayment: true,
        date: new Date(),
        paymentDueDate: '2023-01-01 15:00',
        notificationEnabled: true
    },
    {
        user: '5f77cbbf8c1d663f14475064',
        category: '5f77cbdf91b7fe3f289e3e30',
        amount: 150,
        description: 'Venta de ropa',
        date: new Date(),
        isPayment: false,
        notificationEnabled: false
    }
];
const generateValidToken = (username, role) => {
    var _a;
    const secretKey = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '';
    const token = jsonwebtoken_1.default.sign({ name: username, role }, secretKey, { expiresIn: '1h' });
    return token;
};
exports.generateValidToken = generateValidToken;
