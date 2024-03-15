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
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const databaseTest_1 = require("../../databaseTest");
const constants_1 = require("../../constants");
const user_1 = __importDefault(require("../../models/user"));
const testConst_1 = require("../testConst");
const category_1 = require("../../models/category");
const transaction_1 = require("../../models/transaction");
const putTransactions_1 = require("./putTransactions");
const authorization_1 = __importDefault(require("../../middleware/authorization"));
let app;
let token;
const url = constants_1.ROUTES.TRANSACTIONS.putTransactions.replace(':id', '');
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.put(constants_1.ROUTES.TRANSACTIONS.putTransactions, authorization_1.default, putTransactions_1.putTransactions);
    yield (0, databaseTest_1.dbTestConnect)();
    const newUser = new user_1.default(testConst_1.mockUsers[0]);
    const userSaved = yield newUser.save();
    testConst_1.mockCategories[1].user = userSaved._id;
    const newCategory = new category_1.Category(testConst_1.mockCategories[1]);
    const category = yield newCategory.save();
    testConst_1.mockTransactions[1].user = userSaved._id.toString();
    testConst_1.mockTransactions[1].category = category._id.toString();
    const newTransaction = new transaction_1.Transaction(testConst_1.mockTransactions[1]);
    yield newTransaction.save();
    token = (0, testConst_1.generateValidToken)(userSaved.username, 'user');
    app.set('Authorization', `Bearer ${token}`);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, databaseTest_1.dbTestDisconnect)();
}));
describe('putTransactions  controller', () => {
    it('Should update transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield user_1.default.find();
        const transactions = yield transaction_1.Transaction.find();
        const userId = users[0]._id.toString();
        const transactionsId = transactions[0]._id.toString();
        testConst_1.mockTransactions[0].category = 'Categories 2';
        testConst_1.mockTransactions[0].paymentDueDate = '2023-01-20 10:00';
        const urlWhitId = url + transactionsId;
        yield (0, supertest_1.default)(app)
            .put(urlWhitId)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.mockTransactions[0])
            .expect(200)
            .then((response) => {
            const { data, message } = response.body;
            expect(data.user._id).toBe(userId);
            expect(data.category.name).toBe(testConst_1.mockTransactions[0].category);
            expect(data.amount).toBe(testConst_1.mockTransactions[0].amount);
            expect(data.description).toBe(testConst_1.mockTransactions[0].description);
            expect(data.isPayment).toBe(testConst_1.mockTransactions[0].isPayment);
            expect(data.paymentDueDate).toBe(new Date('2023-01-20 10:00').toISOString());
            expect(data.notificationEnabled).toBe(testConst_1.mockTransactions[0].notificationEnabled);
            expect(message).toBe('Transacción actualizada con éxito.');
        });
    }));
    it('should return error 404 when user not exist message should be "El usuario no existe."', () => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = yield transaction_1.Transaction.find();
        const userName = 'Juan pedro';
        const transactionsId = transactions[0]._id.toString();
        testConst_1.mockTransactions[0].category = 'Categories 2';
        const urlWhitId = url + transactionsId;
        const tokenWhitId = (0, testConst_1.generateValidToken)(userName, 'user');
        yield (0, supertest_1.default)(app)
            .put(urlWhitId)
            .set('Authorization', `Bearer ${tokenWhitId}`)
            .send(testConst_1.mockTransactions[0])
            .expect(404)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('El usuario no existe.');
        });
    }));
    it('should return error 404 when transaction not exist message should be "La categoría no existe."', () => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = yield transaction_1.Transaction.find();
        const transactionsId = transactions[0]._id.toString();
        testConst_1.mockTransactions[0].category = 'False Category';
        const urlWhitId = url + transactionsId;
        yield (0, supertest_1.default)(app)
            .put(urlWhitId)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.mockTransactions[0])
            .expect(404)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('La categoría no existe.');
        });
    }));
    it('should return error 404 when transaction not exist or does not belong to the user message should be "Transacción no encontrada o no pertenece al usuario."', () => __awaiter(void 0, void 0, void 0, function* () {
        const transactionsId = '5f77cbbf8c1d663f14475064';
        testConst_1.mockTransactions[0].category = 'Categories 2';
        const urlWhitId = url + transactionsId;
        yield (0, supertest_1.default)(app)
            .put(urlWhitId)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.mockTransactions[0])
            .expect(404)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('Transacción no encontrada o no pertenece al usuario.');
        });
    }));
    it('should return error 500 when a server error occurred message should be "Error interno del servidor"', () => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = yield transaction_1.Transaction.find();
        const transactionsId = transactions[0]._id.toString();
        testConst_1.mockTransactions[0].category = 'Categories 2';
        const urlWhitId = url + transactionsId;
        vi.spyOn(transaction_1.Transaction.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Simulated internal server error');
        });
        yield (0, supertest_1.default)(app)
            .put(urlWhitId)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.mockTransactions[0])
            .expect(500)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('Error interno del servidor.');
        });
    }));
});
