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
const category_1 = require("../../models/category");
const putCategories_1 = require("./putCategories");
const constants_1 = require("../../constants");
const databaseTest_1 = require("../../databaseTest");
const user_1 = __importDefault(require("../../models/user"));
const testConst_1 = require("../testConst");
const authorization_1 = __importDefault(require("../../middleware/authorization"));
let app;
let token;
const url = `${constants_1.ROUTES.CATEGORIES.putCategories.replace(':id', '')}`;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.put(constants_1.ROUTES.CATEGORIES.putCategories, authorization_1.default, putCategories_1.putCategories);
    yield (0, databaseTest_1.dbTestConnect)();
    const user = new user_1.default(testConst_1.userTest);
    const newUser = yield user.save();
    testConst_1.mockCategories[1].user = newUser._id;
    token = (0, testConst_1.generateValidToken)(newUser.username, 'user');
    app.set('Authorization', `Bearer ${token}`);
    yield category_1.Category.insertMany(testConst_1.mockCategories);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, databaseTest_1.dbTestDisconnect)();
}));
describe('putCategories', () => {
    it('should return error 400 when name or iconName are not in the request message should be "Nombre de categoría e icono son requeridos"', () => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_1.Category.find();
        const idString = category[1]._id.toString();
        const urlWithId = url + idString;
        yield (0, supertest_1.default)(app)
            .put(urlWithId)
            .set('Authorization', `Bearer ${token}`)
            .send({
            description: 'Test Description',
            iconName: 'Test Icon update'
        })
            .expect(400)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('Nombre de categoría e icono son requeridos.');
        });
    }));
    it('should return error 404 when user not found message should be "El usuario no existe."', () => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_1.Category.find();
        const idString = category[0]._id.toString();
        const urlWithId = url + idString;
        const userName = 'Juan pedro';
        const falseToken = (0, testConst_1.generateValidToken)(userName, 'user');
        yield (0, supertest_1.default)(app)
            .put(urlWithId)
            .set('Authorization', `Bearer ${falseToken}`)
            .send(testConst_1.categoryUpdate)
            .expect(404)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('El usuario no existe.');
        });
    }));
    it('should return error 404 when category is default or does not belong to the user message should be  "Categoría no encontrada, no pertenece al usuario o no puede editarla."', () => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_1.Category.find();
        const idString = category[0]._id.toString();
        const urlWithId = url + idString;
        yield (0, supertest_1.default)(app)
            .put(urlWithId)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.categoryUpdate)
            .expect(404)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('Categoría no encontrada, no pertenece al usuario.');
        });
    }));
    it('should return error 403 when category default edit fails, only admin users can edit default categories', () => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_1.Category.find();
        const user = yield user_1.default.find();
        const idUser = user[0]._id.toString();
        category[0].user = idUser;
        const newCategory = yield category[0].save();
        const idString = newCategory._id.toString();
        const urlWithId = url + idString;
        yield (0, supertest_1.default)(app)
            .put(urlWithId)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.categoryDataDefault)
            .expect(403)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('No tienes permisos para editar esta categoría.');
        });
    }));
    it('should update category by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_1.Category.find();
        const idString = category[1]._id.toString();
        const urlWithId = url + idString;
        yield (0, supertest_1.default)(app)
            .put(urlWithId)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.categoryUpdate)
            .expect(200)
            .then((res) => {
            const { data, message } = res.body;
            expect(data).toMatchObject(testConst_1.categoryUpdate);
            expect(message).toBe(`Categoría actualizada con éxito ${testConst_1.categoryUpdate.name}.`);
        });
    }));
    it('should return error 400 when name of category already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_1.Category.find();
        const idString = category[1]._id.toString();
        const urlWithId = url + idString;
        const categoryUpdate = {
            name: category[0].name,
            iconName: 'Nuevo icono'
        };
        yield (0, supertest_1.default)(app)
            .put(urlWithId)
            .set('Authorization', `Bearer ${token}`)
            .send(categoryUpdate)
            .expect(400)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('Esta categoría ya existe.');
        });
    }));
    it('should return error 500 when save return null message should be "Error al editar la categoría"', () => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_1.Category.find();
        const idString = category[1]._id.toString();
        const urlWithId = url + idString;
        vi.spyOn(category_1.Category.prototype, 'save').mockResolvedValueOnce(null);
        yield (0, supertest_1.default)(app)
            .put(urlWithId)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.categoryUpdate)
            .expect(500)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('Error al editar la categoría.');
        });
    }));
    it('should return error 500 when a server error occurred message should be "Error interno del servidor"', () => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_1.Category.find();
        const idString = category[1]._id.toString();
        const urlWithId = url + idString;
        vi.spyOn(category_1.Category.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Simulated internal server error');
        });
        yield (0, supertest_1.default)(app)
            .put(urlWithId)
            .set('Authorization', `Bearer ${token}`)
            .send(testConst_1.categoryUpdate)
            .expect(500)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('Error interno del servidor.');
        });
    }));
});
