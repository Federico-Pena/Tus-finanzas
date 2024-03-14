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
const vitest_1 = require("vitest");
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const constants_1 = require("../../constants");
const postCategories_1 = require("./postCategories");
const databaseTest_1 = require("../../databaseTest");
const category_1 = require("../../models/category");
const user_1 = __importDefault(require("../../models/user"));
const testConst_1 = require("../testConst");
const authorization_1 = __importDefault(require("../../middleware/authorization"));
let app;
let token;
const url = constants_1.RUTES.CATEGORIES.postCategories;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post(constants_1.RUTES.CATEGORIES.postCategories, authorization_1.default, postCategories_1.postCategories);
    yield (0, databaseTest_1.dbTestConnect)();
    const user = new user_1.default(testConst_1.userTest);
    const newUser = yield user.save();
    token = (0, testConst_1.generateValidToken)(newUser.username, 'user');
    app.set('Authorization', `Bearer ${token}`);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, databaseTest_1.dbTestDisconnect)();
}));
(0, vitest_1.describe)('postCategories controller', () => {
    (0, vitest_1.it)('should return error 404 when user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const userName = 'Juancito';
        const falseToken = (0, testConst_1.generateValidToken)(userName, 'user');
        yield (0, supertest_1.default)(app)
            .post(url)
            .set('Authorization', `Bearer ${falseToken}`)
            .send(testConst_1.categoryUpdate)
            .expect(404)
            .then((res) => {
            const { error } = res.body;
            (0, vitest_1.expect)(error).toBe('El usuario no existe.');
        });
    }));
    (0, vitest_1.it)('should return error 400 when category creation fails, name and iconName required', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .post(url)
            .set('Authorization', `Bearer ${token}`)
            .send({
            description: 'Test Description',
            iconName: 'Test Icon'
        })
            .expect(400)
            .then((res) => {
            const { error } = res.body;
            (0, vitest_1.expect)(error).toBe('Nombre de categoría, icono y usuario son requeridos.');
        });
    }));
    (0, vitest_1.it)('should return error 403 when category creation fails, only admin users can create default categories', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .post(url)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.categoryDataDefault)
            .expect(403)
            .then((res) => {
            const { error } = res.body;
            (0, vitest_1.expect)(error).toBe('No tienes permisos para crear una categoría predeterminada.');
        });
    }));
    (0, vitest_1.it)('should create a category successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .post(url)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.categoryUpdate)
            .expect(200)
            .then((res) => {
            const { data, message } = res.body;
            (0, vitest_1.expect)(data).toMatchObject(testConst_1.categoryUpdate);
            (0, vitest_1.expect)(message).toBe(`Categoría creada con éxito ${testConst_1.categoryUpdate.name}.`);
        });
    }));
    (0, vitest_1.it)('should return error 400 when category or icon name already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .post(url)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.categoryUpdate)
            .expect(400)
            .then((res) => {
            const { error } = res.body;
            (0, vitest_1.expect)(error).toBe('La categoría ya existe.');
        });
    }));
    (0, vitest_1.it)('should return error 500 when a server error occurred message should be "Error interno del servidor"', () => __awaiter(void 0, void 0, void 0, function* () {
        vi.spyOn(category_1.Category.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Simulated internal server error');
        });
        yield (0, supertest_1.default)(app)
            .post(url)
            .set('Authorization', `Bearer ${token}`)
            .send({
            name: 'Test Category 2',
            description: 'Test Description 2',
            iconName: 'Test Icon 2'
        })
            .expect(500)
            .then((res) => {
            const { error } = res.body;
            (0, vitest_1.expect)(error).toBe('Error interno del servidor.');
        });
    }));
});
