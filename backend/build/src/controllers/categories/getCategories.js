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
exports.getCategories = void 0;
require("dotenv/config.js");
const category_1 = require("../../models/category");
const response_1 = require("../../utils/response");
const user_1 = __importDefault(require("../../models/user"));
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, name } = JSON.parse(req.params.token);
        const isAdmin = role === 'admin';
        if (!isAdmin) {
            const user = yield user_1.default.findOne({ username: name });
            if (user === null) {
                return (0, response_1.sendResponse)(res, 404, { error: 'Usuario no encontrado.' });
            }
            const categories = yield findUserOrDefaultCategories(user._id);
            return categories.length > 0
                ? (0, response_1.sendResponse)(res, 200, { data: categories })
                : (0, response_1.sendResponse)(res, 404, { error: 'No se encontraron categorías.' });
        }
        const categories = yield category_1.Category.find().sort({ name: 1 }).populate('user', 'username');
        if (categories.length === 0) {
            return (0, response_1.sendResponse)(res, 404, { error: 'No se encontraron categorías.' });
        }
        (0, response_1.sendResponse)(res, 200, { data: categories });
    }
    catch (e) {
        (0, response_1.sendResponse)(res, 500, { error: 'Error interno del servidor.' });
    }
});
exports.getCategories = getCategories;
const findUserOrDefaultCategories = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield category_1.Category.find({
        $or: [{ user: userId }, { isDefault: true }]
    })
        .sort({ name: 1 })
        .populate('user', 'username');
});
