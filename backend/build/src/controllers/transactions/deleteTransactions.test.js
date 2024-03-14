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
const constants_1 = require("../../constants");
const supertest_1 = __importDefault(require("supertest"));
const databaseTest_1 = require("../../databaseTest");
const user_1 = __importDefault(require("../../models/user"));
const testConst_1 = require("../testConst");
const deleteTransactions_1 = require("./deleteTransactions");
const transaction_1 = require("../../models/transaction");
const authorization_1 = __importDefault(require("../../middleware/authorization"));
let app;
let token;
const url = `${constants_1.RUTES.TRANSACTIONS.deleteTransactions.replace(':id', '')}`;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.delete(constants_1.RUTES.TRANSACTIONS.deleteTransactions, authorization_1.default, deleteTransactions_1.deleteTransactions);
    yield (0, databaseTest_1.dbTestConnect)();
    const newUser = new user_1.default(testConst_1.mockUsers[0]);
    const newUser2 = new user_1.default(testConst_1.mockUsers[1]);
    const usersSaved = yield user_1.default.insertMany([newUser, newUser2]);
    testConst_1.mockTransactions[0].user = usersSaved[0]._id.toString();
    yield transaction_1.Transaction.insertMany(testConst_1.mockTransactions);
    token = (0, testConst_1.generateValidToken)(usersSaved[0].username, 'user');
    app.set('Authorization', `Bearer ${token}`);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, databaseTest_1.dbTestDisconnect)();
}));
describe('deleteTransactions controller', () => {
    it('should return error 500 when findByIdAndDelete fail message should be "Error al borrar la transacción.', () => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = yield transaction_1.Transaction.find();
        const transactionIdToDelete = transactions[0]._id.toString();
        const urlWithId = url + transactionIdToDelete;
        vi.spyOn(transaction_1.Transaction, 'findByIdAndDelete').mockResolvedValueOnce(null);
        yield (0, supertest_1.default)(app)
            .delete(urlWithId)
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('Error al borrar la transacción.');
        });
    }));
    it('should return error 404 when user not found message should be "El usuario no existe."', () => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = yield transaction_1.Transaction.find();
        const transactionIdToDelete = transactions[0]._id.toString();
        const urlWithId = url + transactionIdToDelete;
        const userName = 'Juan pedro';
        const falseToken = (0, testConst_1.generateValidToken)(userName, 'user');
        yield (0, supertest_1.default)(app)
            .delete(urlWithId)
            .set('Authorization', `Bearer ${falseToken}`)
            .expect(404)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('El usuario no existe.');
        });
    }));
    it('should return error 404 when transaction not found or does not belong to the user message should be "Transacción no encontrada o no pertenece al usuario."', () => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = yield transaction_1.Transaction.find();
        const transactionIdToDelete = transactions[1]._id.toString();
        const urlWithId = url + transactionIdToDelete;
        yield (0, supertest_1.default)(app)
            .delete(urlWithId)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('Transacción no encontrada o no pertenece al usuario.');
        });
    }));
    it('should return error 500 when a server error occurred message should be "Error interno del servidor"', () => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = yield transaction_1.Transaction.find();
        const transactionIdToDelete = transactions[0]._id.toString();
        const urlWithId = url + transactionIdToDelete;
        vi.spyOn(transaction_1.Transaction, 'findByIdAndDelete').mockImplementationOnce(() => {
            throw new Error('Simulated internal server error');
        });
        yield (0, supertest_1.default)(app)
            .delete(urlWithId)
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('Error interno del servidor.');
        });
    }));
    it('should delete a transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = yield transaction_1.Transaction.find();
        const transactionIdToDelete = transactions[0]._id.toString();
        const urlWithId = url + transactionIdToDelete;
        yield (0, supertest_1.default)(app)
            .delete(urlWithId)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then((res) => {
            const { data, message } = res.body;
            expect(data.user).toBe(transactions[0].user.toString());
            expect(data.amount).toBe(transactions[0].amount);
            expect(data.description).toBe(transactions[0].description);
            expect(data.isPayment).toBe(transactions[0].isPayment);
            expect(data.notificationEnabled).toBe(transactions[0].notificationEnabled);
            expect(data.category).toBe(transactions[0].category.toString());
            expect(message).toBe('Transacción eliminada con éxito.');
        });
    }));
});
