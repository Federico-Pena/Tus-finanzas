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
exports.deleteCategories = void 0;
require("dotenv/config.js");
const response_1 = require("../../utils/response");
const category_1 = require("../../models/category");
const user_1 = __importDefault(require("../../models/user"));
const transaction_1 = require("../../models/transaction");
const deleteCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        const { role, name } = JSON.parse(req.params.token);
        const isAdmin = role === 'admin';
        const user = yield user_1.default.findOne({ username: name });
        if (user === null) {
            return (0, response_1.sendResponse)(res, 404, {
                error: 'El usuario no existe.'
            });
        }
        const category = yield category_1.Category.findOne({ _id: categoryId, user: user._id });
        if (category === null) {
            return (0, response_1.sendResponse)(res, 404, {
                error: 'Categoría no encontrada, no pertenece al usuario.'
            });
        }
        if (!isAdmin && category.isDefault) {
            return (0, response_1.sendResponse)(res, 403, {
                error: 'No tienes permisos para eliminar esta esta categoría.'
            });
        }
        const categoryDeleted = yield category_1.Category.findByIdAndDelete(categoryId);
        yield transaction_1.Transaction.deleteMany({ category: categoryId, user: user._id });
        if (categoryDeleted !== null) {
            return (0, response_1.sendResponse)(res, 200, {
                data: categoryDeleted,
                message: 'Categoría borrada con éxito.'
            });
        }
        else {
            (0, response_1.sendResponse)(res, 500, {
                error: 'Error al borrar la categoría.'
            });
        }
    }
    catch (error) {
        (0, response_1.sendResponse)(res, 500, {
            error: 'Error interno del servidor.'
        });
    }
});
exports.deleteCategories = deleteCategories;
