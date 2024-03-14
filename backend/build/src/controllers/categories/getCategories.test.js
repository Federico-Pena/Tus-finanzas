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
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const getCategories_1 = require("./getCategories");
const category_1 = require("../../models/category");
const constants_1 = require("../../constants");
const databaseTest_1 = require("../../databaseTest");
const testConst_1 = require("../testConst");
const authorization_1 = __importDefault(require("../../middleware/authorization"));
const user_1 = __importDefault(require("../../models/user"));
let app;
let token;
const url = constants_1.RUTES.CATEGORIES.getCategories;
(0, vitest_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get(constants_1.RUTES.CATEGORIES.getCategories, authorization_1.default, getCategories_1.getCategories);
    yield (0, databaseTest_1.dbTestConnect)();
    const user = new user_1.default({
        username: 'Usuario de Prueba',
        email: 'EmailDePrueba@gmail.com',
        password: 'passwordDePrueba'
    });
    const newUser = yield user.save();
    token = (0, testConst_1.generateValidToken)(newUser.username, 'admin');
    app.set('Authorization', `Bearer ${token}`);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, databaseTest_1.dbTestDisconnect)();
}));
(0, vitest_1.describe)('getCategories controller', () => {
    (0, vitest_1.it)('should return error 404 when not found categories and error message should be "No se encontraron categorías"', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .get(url)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .then((res) => {
            const { error } = res.body;
            (0, vitest_1.expect)(error).toBe('No se encontraron categorías.');
        });
    }));
    (0, vitest_1.it)('should return all categories in te database', () => __awaiter(void 0, void 0, void 0, function* () {
        yield category_1.Category.insertMany(testConst_1.mockCategories);
        yield (0, supertest_1.default)(app)
            .get(url)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then((res) => {
            const { data } = res.body;
            (0, vitest_1.expect)(data[0]).toMatchObject(testConst_1.mockCategories[0]);
            (0, vitest_1.expect)(data[1]).toMatchObject(testConst_1.mockCategories[1]);
        });
    }));
    (0, vitest_1.it)('should return error 500 when a server error occurred message should be "Error interno del servidor"', () => __awaiter(void 0, void 0, void 0, function* () {
        vi.spyOn(category_1.Category, 'find').mockImplementationOnce(() => {
            throw new Error('Simulated internal server error');
        });
        yield (0, supertest_1.default)(app)
            .get(url)
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
            .then((res) => {
            const { error } = res.body;
            (0, vitest_1.expect)(error).toBe('Error interno del servidor.');
        });
    }));
});
