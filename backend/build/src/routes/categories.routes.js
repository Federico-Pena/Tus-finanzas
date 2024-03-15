"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRoutes = void 0;
const express_1 = require("express");
const constants_1 = require("../constants");
const getCategories_1 = require("../controllers/categories/getCategories");
const postCategories_1 = require("../controllers/categories/postCategories");
const putCategories_1 = require("../controllers/categories/putCategories");
const deleteCategories_1 = require("../controllers/categories/deleteCategories");
const authorization_1 = __importDefault(require("../middleware/authorization"));
exports.categoriesRoutes = (0, express_1.Router)();
// Ruta para obtener todas las categorías asociadas a un usuario específico y las predeterminadas.
exports.categoriesRoutes.get(constants_1.ROUTES.CATEGORIES.getCategories, authorization_1.default, getCategories_1.getCategories);
// Ruta para crear una nueva categoría para un usuario específico.
exports.categoriesRoutes.post(constants_1.ROUTES.CATEGORIES.postCategories, authorization_1.default, postCategories_1.postCategories);
// Ruta para actualizar una categoría existente para un usuario específico.
exports.categoriesRoutes.put(constants_1.ROUTES.CATEGORIES.putCategories, authorization_1.default, putCategories_1.putCategories);
// Ruta para eliminar una categoría existente para un usuario específico.
exports.categoriesRoutes.delete(constants_1.ROUTES.CATEGORIES.deleteCategories, authorization_1.default, deleteCategories_1.deleteCategories);
