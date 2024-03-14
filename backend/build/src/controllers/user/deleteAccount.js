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
exports.deleteAccount = void 0;
const response_1 = require("../../utils/response");
const user_1 = __importDefault(require("../../models/user"));
const transaction_1 = require("../../models/transaction");
const category_1 = require("../../models/category");
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.params.username;
        const name = username.trim();
        const userForDelete = yield user_1.default.findOne({ username: name });
        if (userForDelete === null) {
            return (0, response_1.sendResponse)(res, 404, { error: 'El usuario no existe.' });
        }
        const user = yield user_1.default.findByIdAndDelete(userForDelete._id);
        if (user === null) {
            return (0, response_1.sendResponse)(res, 500, { error: 'Error al eliminar el usuario.' });
        }
        yield transaction_1.Transaction.deleteMany({
            user: userForDelete._id
        });
        yield category_1.Category.deleteMany({
            user: userForDelete._id
        });
        return (0, response_1.sendResponse)(res, 200, {
            message: 'Usuario eliminado con éxito.'
        });
    }
    catch (e) {
        (0, response_1.sendResponse)(res, 500, { error: 'Error interno del servidor.' });
    }
});
exports.deleteAccount = deleteAccount;
