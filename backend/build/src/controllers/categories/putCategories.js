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
exports.putCategories = void 0;
require("dotenv/config.js");
const response_1 = require("../../utils/response");
const category_1 = require("../../models/category");
const user_1 = __importDefault(require("../../models/user"));
const putCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        const { role, name: userName } = JSON.parse(req.params.token);
        const isAdmin = role === 'admin';
        const { name, iconName, isDefault } = req.body;
        const categoryName = name === null || name === void 0 ? void 0 : name.trim();
        const categoryIconName = iconName === null || iconName === void 0 ? void 0 : iconName.trim();
        const invalidContent = categoryName === undefined ||
            categoryName.length === 0 ||
            categoryIconName === undefined ||
            categoryIconName.length === 0;
        if (invalidContent) {
            return (0, response_1.sendResponse)(res, 400, {
                error: 'Nombre de categoría e icono son requeridos.'
            });
        }
        const user = yield user_1.default.findOne({ username: userName });
        if (user === null) {
            return (0, response_1.sendResponse)(res, 404, {
                error: 'El usuario no existe.'
            });
        }
        const categoryToUpdate = yield category_1.Category.findOne({
            _id: categoryId,
            user: user._id
        });
        if (categoryToUpdate === null) {
            return (0, response_1.sendResponse)(res, 404, {
                error: 'Categoría no encontrada, no pertenece al usuario.'
            });
        }
        if (!isAdmin && isDefault) {
            return (0, response_1.sendResponse)(res, 403, {
                error: 'No tienes permisos para editar esta categoría.'
            });
        }
        categoryToUpdate.name = name !== null && name !== void 0 ? name : categoryToUpdate.name;
        categoryToUpdate.iconName = iconName !== null && iconName !== void 0 ? iconName : categoryToUpdate.iconName;
        categoryToUpdate.isDefault = isDefault !== null && isDefault !== void 0 ? isDefault : categoryToUpdate.isDefault;
        const updatedCategory = yield categoryToUpdate.save();
        if (updatedCategory !== null) {
            const categoryToSend = yield category_1.Category.findOne({
                _id: updatedCategory._id,
                user: user._id
            }).populate('user', 'username');
            (0, response_1.sendResponse)(res, 200, {
                data: categoryToSend,
                message: `Categoría actualizada con éxito ${updatedCategory.name}.`
            });
        }
        else {
            (0, response_1.sendResponse)(res, 500, {
                error: 'Error al editar la categoría.'
            });
        }
    }
    catch (error) {
        if (error.code === 11000) {
            return (0, response_1.sendResponse)(res, 400, {
                error: 'Esta categoría ya existe.'
            });
        }
        (0, response_1.sendResponse)(res, 500, {
            error: 'Error interno del servidor.'
        });
    }
});
exports.putCategories = putCategories;
