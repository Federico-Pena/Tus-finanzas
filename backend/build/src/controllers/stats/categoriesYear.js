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
exports.transactionStatsByYear = void 0;
const response_1 = require("../../utils/response");
const transaction_1 = require("../../models/transaction");
const user_1 = __importDefault(require("../../models/user"));
const transactionStatsByYear = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year } = req.params;
        const { name } = JSON.parse(req.params.token);
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
        const user = yield user_1.default.findOne({ username: name });
        if (user === null) {
            return (0, response_1.sendResponse)(res, 404, {
                error: 'El usuario no existe.'
            });
        }
        const statsByMonth = yield transaction_1.Transaction.aggregate([
            {
                $match: {
                    user: user._id,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$date' },
                        category: '$category.name',
                        isPayment: '$isPayment'
                    },
                    amount: { $sum: '$amount' }
                }
            },
            {
                $sort: { '_id.month': 1 }
            }
        ]);
        (0, response_1.sendResponse)(res, 200, {
            data: statsByMonth
        });
    }
    catch (error) {
        console.error(error);
        (0, response_1.sendResponse)(res, 500, {
            error: 'Error interno del servidor.'
        });
    }
});
exports.transactionStatsByYear = transactionStatsByYear;
