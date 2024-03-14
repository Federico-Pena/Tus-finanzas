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
exports.getTransactions = void 0;
const response_1 = require("../../utils/response");
const transaction_1 = require("../../models/transaction");
const user_1 = __importDefault(require("../../models/user"));
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name } = JSON.parse(req.params.token);
        const page = (_a = parseInt(req.query.page)) !== null && _a !== void 0 ? _a : 1;
        const limit = 20;
        const skipIndex = (page - 1) * limit;
        const user = yield user_1.default.findOne({ username: name });
        if (user === null) {
            return (0, response_1.sendResponse)(res, 404, { error: 'El usuario no existe.' });
        }
        const totalCount = yield transaction_1.Transaction.countDocuments({
            user: user._id
        });
        const transactions = yield transaction_1.Transaction.find({
            user: user._id
        })
            .populate('category')
            .populate('user', 'username')
            .sort({ date: -1 })
            .limit(limit)
            .skip(skipIndex)
            .exec();
        const totalPages = Math.ceil(totalCount / limit);
        if (transactions.length > 0) {
            (0, response_1.sendResponse)(res, 200, {
                data: { transactions, page, totalCount, totalPages }
            });
        }
        else {
            (0, response_1.sendResponse)(res, 404, { error: 'No se encontraron transacciones.' });
        }
    }
    catch (error) {
        (0, response_1.sendResponse)(res, 500, {
            error: 'Error interno del servidor.'
        });
    }
});
exports.getTransactions = getTransactions;
