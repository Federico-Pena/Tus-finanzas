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
exports.postTransactions = void 0;
const response_1 = require("../../utils/response");
const transaction_1 = require("../../models/transaction");
const category_1 = require("../../models/category");
const user_1 = __importDefault(require("../../models/user"));
const notification_1 = __importDefault(require("../../models/notification"));
const postTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = JSON.parse(req.params.token);
        const { category, amount, description, isPayment, paymentDueDate, notificationEnabled, date } = req.body;
        const invalidContent = category === undefined ||
            category.length === 0 ||
            amount === undefined ||
            amount.length === 0 ||
            description === undefined ||
            description.length === 0;
        let notificationDateTransaction;
        if (invalidContent) {
            (0, response_1.sendResponse)(res, 400, { error: 'Faltan campos obligatorios para crear la transacción.' });
            return;
        }
        const categorySaved = yield category_1.Category.findOne({ name: category });
        if (categorySaved === null) {
            (0, response_1.sendResponse)(res, 404, { error: 'La categoría no existe.' });
            return;
        }
        const user = yield user_1.default.findOne({ username: name });
        if (user === null) {
            return (0, response_1.sendResponse)(res, 404, {
                error: 'El usuario no existe.'
            });
        }
        if (notificationEnabled === true && paymentDueDate !== undefined) {
            const notificationDate = new Date(paymentDueDate);
            notificationDateTransaction = notificationDate.toUTCString();
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
        const newTransaction = new transaction_1.Transaction({
            user: user._id,
            category: categorySaved._id,
            amount,
            description,
            date: new Date(date).toUTCString(),
            isPayment,
            paymentDueDate: notificationDateTransaction,
            notificationEnabled
        });
        const transaction = yield newTransaction.save();
        if (transaction === null) {
            (0, response_1.sendResponse)(res, 500, { error: 'Error al agregar la transacción' });
            return;
        }
        const transactionUpdated = yield transaction_1.Transaction.findById(transaction._id)
            .populate('category')
            .populate('user', 'username');
        (0, response_1.sendResponse)(res, 200, { data: transactionUpdated, message: 'Transacción creada con éxito' });
    }
    catch (error) {
        (0, response_1.sendResponse)(res, 500, { error: 'Error interno del servidor.' });
    }
});
exports.postTransactions = postTransactions;
