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
exports.postCategories = void 0;
require("dotenv/config.js");
const response_1 = require("../../utils/response");
const category_1 = require("../../models/category");
const user_1 = __importDefault(require("../../models/user"));
const postCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, iconName, isDefault } = req.body;
        const { role, name: userName } = JSON.parse(req.params.token);
        const isAdmin = role === 'admin';
        const categoryName = name === null || name === void 0 ? void 0 : name.trim();
        const categoryIconName = iconName === null || iconName === void 0 ? void 0 : iconName.trim();
        const invalidContent = categoryName === undefined ||
            categoryName.length === 0 ||
            categoryIconName === undefined ||
            categoryIconName.length === 0;
        if (invalidContent) {
            return (0, response_1.sendResponse)(res, 400, {
                error: 'Nombre de categoría, icono y usuario son requeridos.'
            });
        }
        const user = yield user_1.default.findOne({ username: userName });
        if (user === null) {
            return (0, response_1.sendResponse)(res, 404, {
                error: 'El usuario no existe.'
            });
        }
        if (!isAdmin && isDefault) {
            return (0, response_1.sendResponse)(res, 403, {
                error: 'No tienes permisos para crear una categoría predeterminada.'
            });
        }
        const newCategory = new category_1.Category({
            name: categoryName,
            iconName: categoryIconName,
            user: user._id,
            isDefault: isDefault || false
        });
        const categoryCreated = yield newCategory.save();
        const categoryToSend = yield category_1.Category.findOne({
            _id: categoryCreated._id,
            user: user._id
        }).populate('user', 'username');
        return (0, response_1.sendResponse)(res, 200, {
            data: categoryToSend,
            message: `Categoría creada con éxito ${categoryCreated.name}.`
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return (0, response_1.sendResponse)(res, 400, {
                error: 'La categoría ya existe.'
            });
        }
        (0, response_1.sendResponse)(res, 500, {
            error: 'Error interno del servidor.'
        });
    }
});
exports.postCategories = postCategories;
