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
const getTransactions_1 = require("./getTransactions");
const testConst_1 = require("../testConst");
const transaction_1 = require("../../models/transaction");
const authorization_1 = __importDefault(require("../../middleware/authorization"));
const category_1 = require("../../models/category");
let app;
let token;
const url = constants_1.ROUTES.TRANSACTIONS.getTransactions.replace(':user', '');
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get(constants_1.ROUTES.TRANSACTIONS.getTransactions, authorization_1.default, getTransactions_1.getTransactions);
    yield (0, databaseTest_1.dbTestConnect)();
    const newUser = new user_1.default(testConst_1.mockUsers[0]);
    const newUser2 = new user_1.default(testConst_1.mockUsers[1]);
    const mockCategoriesSaved = yield category_1.Category.insertMany(testConst_1.mockCategories);
    const usersSaved = yield user_1.default.insertMany([newUser, newUser2]);
    testConst_1.mockTransactions[0].user = usersSaved[0]._id.toString();
    testConst_1.mockTransactions[0].category = mockCategoriesSaved[0]._id.toString();
    testConst_1.mockTransactions[1].user = usersSaved[0]._id.toString();
    testConst_1.mockTransactions[1].category = mockCategoriesSaved[1]._id.toString();
    yield transaction_1.Transaction.insertMany(testConst_1.mockTransactions);
    token = (0, testConst_1.generateValidToken)(usersSaved[0].username, 'user');
    app.set('Authorization', `Bearer ${token}`);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, databaseTest_1.dbTestDisconnect)();
}));
describe('getTransactions  controller', () => {
    it('It should return transactions of the user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .get(url)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then((response) => {
            const { transactions } = response.body.data;
            expect(transactions[0].user._id).toBe(testConst_1.mockTransactions[0].user);
            expect(transactions[0].category._id).toBe(testConst_1.mockTransactions[0].category);
            expect(transactions[1].user._id).toBe(testConst_1.mockTransactions[0].user);
            expect(transactions[1].category._id).toBe(testConst_1.mockTransactions[1].category);
        });
    }));
    it('It should return error 404 if user not have transactions', () => __awaiter(void 0, void 0, void 0, function* () {
        const usersSaved = yield user_1.default.find();
        const falseToken = (0, testConst_1.generateValidToken)(usersSaved[1].username, 'user');
        yield (0, supertest_1.default)(app)
            .get(url)
            .set('Authorization', `Bearer ${falseToken}`)
            .expect(404)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('No se encontraron transacciones.');
        });
    }));
    it('should return error 500 when a server error occurred message should be "Error interno del servidor"', () => __awaiter(void 0, void 0, void 0, function* () {
        vi.spyOn(transaction_1.Transaction, 'find').mockImplementationOnce(() => {
            throw new Error('Simulated internal server error');
        });
        yield (0, supertest_1.default)(app)
            .get(url)
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('Error interno del servidor.');
        });
    }));
});
