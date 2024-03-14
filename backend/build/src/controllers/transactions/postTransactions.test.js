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
const postTransactions_1 = require("./postTransactions");
const authorization_1 = __importDefault(require("../../middleware/authorization"));
const transaction_1 = require("../../models/transaction");
let app;
let token;
const url = constants_1.RUTES.TRANSACTIONS.postTransactions;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post(constants_1.RUTES.TRANSACTIONS.postTransactions, authorization_1.default, postTransactions_1.postTransactions);
    yield (0, databaseTest_1.dbTestConnect)();
    const newUser = new user_1.default(testConst_1.mockUsers[0]);
    const userSaved = yield newUser.save();
    testConst_1.mockCategories[1].user = userSaved._id;
    yield category_1.Category.insertMany(testConst_1.mockCategories);
    token = (0, testConst_1.generateValidToken)(userSaved.username, 'user');
    app.set('Authorization', `Bearer ${token}`);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, databaseTest_1.dbTestDisconnect)();
}));
describe('postTransactions  controller', () => {
    it('Should create new transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield user_1.default.find();
        const categories = yield category_1.Category.find();
        const userId = users[0]._id.toString();
        const categoryName = categories[0].name;
        testConst_1.mockTransactions[0].user = userId;
        testConst_1.mockTransactions[0].category = categoryName;
        yield (0, supertest_1.default)(app)
            .post(url)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.mockTransactions[0])
            .expect(200)
            .then((response) => {
            const { data } = response.body;
            expect(data.user._id).toBe(userId);
            expect(data.category.name).toBe(testConst_1.mockTransactions[0].category);
            expect(data.amount).toBe(testConst_1.mockTransactions[0].amount);
            expect(data.description).toBe(testConst_1.mockTransactions[0].description);
            expect(data.isPayment).toBe(testConst_1.mockTransactions[0].isPayment);
            expect(data.paymentDueDate).toBe(testConst_1.mockTransactions[0].paymentDueDate);
            expect(data.notificationEnabled).toBe(testConst_1.mockTransactions[0].notificationEnabled);
        });
    }));
    it('should return error 404 when user not exist message should be "El usuario no existe."', () => __awaiter(void 0, void 0, void 0, function* () {
        const categories = yield category_1.Category.find();
        const categoryName = categories[0].name;
        const userName = 'Juan Pedro';
        testConst_1.mockTransactions[0].category = categoryName;
        const tokenUser = (0, testConst_1.generateValidToken)(userName, 'user');
        yield (0, supertest_1.default)(app)
            .post(url)
            .set('Authorization', `Bearer ${tokenUser}`)
            .send(testConst_1.mockTransactions[0])
            .expect(404)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('El usuario no existe.');
        });
    }));
    it('should return error 404 when category not exist message should be "La categoría no existe."', () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield user_1.default.find();
        const userId = users[0]._id.toString();
        const categoryName = 'False category';
        testConst_1.mockTransactions[0].user = userId;
        testConst_1.mockTransactions[0].category = categoryName;
        yield (0, supertest_1.default)(app)
            .post(url)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.mockTransactions[0])
            .expect(404)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('La categoría no existe.');
        });
    }));
    it('should return error 500 when a server error occurred message should be "Error interno del servidor"', () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield user_1.default.find();
        const categories = yield category_1.Category.find();
        const userId = users[0]._id.toString();
        const categoryName = categories[0].name;
        testConst_1.mockTransactions[0].user = userId;
        testConst_1.mockTransactions[0].category = categoryName;
        vi.spyOn(transaction_1.Transaction.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Simulated internal server error');
        });
        yield (0, supertest_1.default)(app)
            .post(url)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.mockTransactions[0])
            .expect(500)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('Error interno del servidor.');
        });
    }));
});
