"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const response_1 = require("../utils/response");
const secretKey = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '';
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
    const invalidRequest = token === undefined || token.trim().length === 0;
    if (invalidRequest) {
        return (0, response_1.sendResponse)(res, 401, {
            error: 'No hay token, autorización denegada.'
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.params.token = JSON.stringify(decoded);
        next();
    }
    catch (error) {
        return (0, response_1.sendResponse)(res, 401, {
            error: 'Su sesión expiró, inicie sesión nuevamente.'
        });
    }
};
exports.default = authMiddleware;
