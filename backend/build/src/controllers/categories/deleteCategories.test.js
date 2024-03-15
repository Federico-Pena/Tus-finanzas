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
const deleteCategories_1 = require("./deleteCategories");
const supertest_1 = __importDefault(require("supertest"));
const databaseTest_1 = require("../../databaseTest");
const category_1 = require("../../models/category");
const user_1 = __importDefault(require("../../models/user"));
const testConst_1 = require("../testConst");
const authorization_1 = __importDefault(require("../../middleware/authorization"));
let app;
let token;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.delete(constants_1.ROUTES.CATEGORIES.deleteCategories, authorization_1.default, deleteCategories_1.deleteCategories);
    yield (0, databaseTest_1.dbTestConnect)();
    const user = new user_1.default({
        username: 'Usuario de Prueba',
        email: 'EmailDePrueba@gmail.com',
        password: 'passwordDePrueba'
    });
    const newUser = yield user.save();
    testConst_1.mockCategories[1].user = newUser._id;
    token = (0, testConst_1.generateValidToken)(newUser.username, 'user');
    app.set('Authorization', `Bearer ${token}`);
    yield category_1.Category.insertMany(testConst_1.mockCategories);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, databaseTest_1.dbTestDisconnect)();
}));
describe('deleteCategories controller', () => {
    it('should return error 500 when findByIdAndDelete fail message should be "Error al borrar la categoría"', () => __awaiter(void 0, void 0, void 0, function* () {
        const categories = yield category_1.Category.find();
        const categoryIdToDelete = categories[1]._id.toString();
        const url = `${constants_1.ROUTES.CATEGORIES.deleteCategories.replace(':id', categoryIdToDelete)}`;
        vi.spyOn(category_1.Category, 'findByIdAndDelete').mockResolvedValueOnce(null);
        yield (0, supertest_1.default)(app)
            .delete(url)
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('Error al borrar la categoría.');
        });
    }));
    it('should return error 404 when user not found message should be "El usuario no existe."', () => __awaiter(void 0, void 0, void 0, function* () {
        const categories = yield category_1.Category.find();
        const categoryIdToDelete = categories[1]._id.toString();
        const userName = 'PepeExample';
        const url = `${constants_1.ROUTES.CATEGORIES.deleteCategories.replace(':id', categoryIdToDelete)}`;
        const falseToken = (0, testConst_1.generateValidToken)(userName, 'user');
        yield (0, supertest_1.default)(app)
            .delete(url)
            .set('Authorization', `Bearer ${falseToken}`)
            .expect(404)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('El usuario no existe.');
        });
    }));
    it('should return error 404 when category is default or does not belong to the user message should be "Categoría no encontrada, no pertenece al usuario o no puede eliminarla."', () => __awaiter(void 0, void 0, void 0, function* () {
        const categories = yield category_1.Category.find();
        const categoryIdToDelete = categories[0]._id.toString();
        const url = `${constants_1.ROUTES.CATEGORIES.deleteCategories.replace(':id', categoryIdToDelete)}`;
        yield (0, supertest_1.default)(app)
            .delete(url)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('Categoría no encontrada, no pertenece al usuario.');
        });
    }));
    it('should return error 403 when category default delete  fails, only admin users can edit default categories', () => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_1.Category.find();
        const user = yield user_1.default.find();
        const idUser = user[0]._id.toString();
        category[0].user = idUser;
        const newCategory = yield category[0].save();
        const idString = newCategory._id.toString();
        const url = `${constants_1.ROUTES.CATEGORIES.deleteCategories.replace(':id', idString)}`;
        yield (0, supertest_1.default)(app)
            .delete(url)
            .expect(403)
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('No tienes permisos para eliminar esta esta categoría.');
        });
    }));
    it('should return error 500 when a server error occurred message should be "Error interno del servidor"', () => __awaiter(void 0, void 0, void 0, function* () {
        const categories = yield category_1.Category.find();
        const categoryIdToDelete = categories[1]._id.toString();
        const url = `${constants_1.ROUTES.CATEGORIES.deleteCategories.replace(':id', categoryIdToDelete)}`;
        vi.spyOn(category_1.Category, 'findByIdAndDelete').mockImplementationOnce(() => {
            throw new Error('Simulated internal server error');
        });
        yield (0, supertest_1.default)(app)
            .delete(url)
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
            .then((res) => {
            const { error } = res.body;
            expect(error).toBe('Error interno del servidor.');
        });
    }));
    it('should delete a category when id in request is correct', () => __awaiter(void 0, void 0, void 0, function* () {
        const categories = yield category_1.Category.find();
        const categoryIdToDelete = categories[1]._id.toString();
        const url = `${constants_1.ROUTES.CATEGORIES.deleteCategories.replace(':id', categoryIdToDelete)}`;
        yield (0, supertest_1.default)(app)
            .delete(url)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then((res) => {
            const { data, message } = res.body;
            expect(data).toMatchObject(testConst_1.mockCategories[1]);
            expect(message).toBe('Categoría borrada con éxito.');
        });
    }));
});
