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
exports.putTransactions = void 0;
const response_1 = require("../../utils/response");
const transaction_1 = require("../../models/transaction");
const user_1 = __importDefault(require("../../models/user"));
const category_1 = require("../../models/category");
const notification_1 = __importDefault(require("../../models/notification"));
const putTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const transactionId = req.params.id;
        const { name } = JSON.parse(req.params.token);
        const { category, amount, description, isPayment, date, paymentDueDate, notificationEnabled } = req.body;
        const user = yield user_1.default.findOne({ username: name });
        if (user === null) {
            return (0, response_1.sendResponse)(res, 404, {
                error: 'El usuario no existe.'
            });
        }
        const categorySaved = yield category_1.Category.findOne({ name: category });
        if (categorySaved === null) {
            return (0, response_1.sendResponse)(res, 404, {
                error: 'La categoría no existe.'
            });
        }
        const transaction = yield transaction_1.Transaction.findOne({ _id: transactionId, user: user._id });
        if (transaction === null) {
            return (0, response_1.sendResponse)(res, 404, {
                error: 'Transacción no encontrada o no pertenece al usuario.'
            });
        }
        if (notificationEnabled === true && paymentDueDate !== undefined) {
            const notificationDate = new Date(paymentDueDate);
            const bodyMessage = `${String(description)}, $${Number(amount)}.`;
            const title = `Recordatorio de ${isPayment === true ? 'Ingreso' : 'Gasto'}`;
            const notification = new notification_1.default({
                body: bodyMessage,
                title,
                to: user.pushToken,
                sendAt: notificationDate
            });
            yield notification.save();
        }
        transaction.category = (_a = categorySaved._id) !== null && _a !== void 0 ? _a : transaction.category;
        transaction.amount = amount !== null && amount !== void 0 ? amount : transaction.amount;
        transaction.description = description !== null && description !== void 0 ? description : transaction.description;
        transaction.date = date !== null && date !== void 0 ? date : transaction.date;
        transaction.isPayment = isPayment !== null && isPayment !== void 0 ? isPayment : transaction.isPayment;
        transaction.paymentDueDate = paymentDueDate !== null && paymentDueDate !== void 0 ? paymentDueDate : transaction.paymentDueDate;
        transaction.notificationEnabled = notificationEnabled !== null && notificationEnabled !== void 0 ? notificationEnabled : transaction.notificationEnabled;
        yield transaction.save();
        const transactionUpdated = yield transaction_1.Transaction.findById(transaction._id)
            .populate('category')
            .populate('user', 'username');
        (0, response_1.sendResponse)(res, 200, {
            message: 'Transacción actualizada con éxito.',
            data: transactionUpdated
        });
    }
    catch (error) {
        (0, response_1.sendResponse)(res, 500, { error: 'Error interno del servidor.' });
    }
});
exports.putTransactions = putTransactions;
