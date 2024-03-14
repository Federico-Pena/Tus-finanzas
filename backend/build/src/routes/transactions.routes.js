"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsRoutes = void 0;
const express_1 = require("express");
const constants_1 = require("../constants");
const getTransactions_1 = require("../controllers/transactions/getTransactions");
const postTransactions_1 = require("../controllers/transactions/postTransactions");
const deleteTransactions_1 = require("../controllers/transactions/deleteTransactions");
const putTransactions_1 = require("../controllers/transactions/putTransactions");
const authorization_1 = __importDefault(require("../middleware/authorization"));
exports.transactionsRoutes = (0, express_1.Router)();
// Ruta para obtener todas las transacciones asociadas a un usuario específico.
exports.transactionsRoutes.get(constants_1.RUTES.TRANSACTIONS.getTransactions, authorization_1.default, getTransactions_1.getTransactions);
// Ruta para crear una nueva transacción para un usuario específico.
exports.transactionsRoutes.post(constants_1.RUTES.TRANSACTIONS.postTransactions, authorization_1.default, postTransactions_1.postTransactions);
// Ruta para actualizar una transacción existente para un usuario específico.
exports.transactionsRoutes.put(constants_1.RUTES.TRANSACTIONS.putTransactions, authorization_1.default, putTransactions_1.putTransactions);
// Ruta para eliminar una transacción existente para un usuario específico.
exports.transactionsRoutes.delete(constants_1.RUTES.TRANSACTIONS.deleteTransactions, authorization_1.default, deleteTransactions_1.deleteTransactions);
