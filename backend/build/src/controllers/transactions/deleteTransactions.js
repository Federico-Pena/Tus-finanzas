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
exports.deleteTransactions = void 0;
const response_1 = require("../../utils/response");
const transaction_1 = require("../../models/transaction");
const user_1 = __importDefault(require("../../models/user"));
const deleteTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactionId = req.params.id;
        const { name } = JSON.parse(req.params.token);
        const user = yield user_1.default.findOne({ username: name });
        if (user === null) {
            return (0, response_1.sendResponse)(res, 404, {
                error: 'El usuario no existe.'
            });
        }
        const transaction = yield transaction_1.Transaction.findOne({ _id: transactionId, user: user._id });
        if (transaction === null) {
            return (0, response_1.sendResponse)(res, 404, {
                error: 'Transacción no encontrada o no pertenece al usuario.'
            });
        }
        const transactionDeleted = yield transaction_1.Transaction.findByIdAndDelete(transactionId);
        if (transactionDeleted === null) {
            return (0, response_1.sendResponse)(res, 500, {
                error: 'Error al borrar la transacción.'
            });
        }
        (0, response_1.sendResponse)(res, 200, {
            data: transactionDeleted,
            message: 'Transacción eliminada con éxito.'
        });
    }
    catch (error) {
        (0, response_1.sendResponse)(res, 500, { error: 'Error interno del servidor.' });
    }
});
exports.deleteTransactions = deleteTransactions;
