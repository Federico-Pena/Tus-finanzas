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
const deleteAccount_1 = require("./deleteAccount");
const bcrypt_1 = require("bcrypt");
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.delete(constants_1.ROUTES.USER.deleteUserAccount, deleteAccount_1.deleteAccount);
    yield (0, databaseTest_1.dbTestConnect)();
    const userPassword = 'Password88';
    const saltRounds = 10;
    const hashedPassword = yield (0, bcrypt_1.hash)(userPassword, saltRounds);
    const newUser = new user_1.default({
        username: 'PepeExample',
        email: 'pepeExample@example.com',
        password: hashedPassword
    });
    yield newUser.save();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, databaseTest_1.dbTestDisconnect)();
}));
describe('login  controller', () => {
    it('It should give an error if the user not exists message should be "El usuario no existe."', () => __awaiter(void 0, void 0, void 0, function* () {
        const userName = 'PepeExample88';
        yield (0, supertest_1.default)(app)
            .delete(constants_1.ROUTES.USER.deleteUserAccount.replace(':username', userName))
            .expect(404)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('El usuario no existe.');
        });
    }));
    it('should return error 500 when findByIdAndDelete return null message should be "Error al eliminar el usuario."', () => __awaiter(void 0, void 0, void 0, function* () {
        const userName = 'PepeExample';
        vi.spyOn(user_1.default, 'findByIdAndDelete').mockResolvedValueOnce(null);
        yield (0, supertest_1.default)(app)
            .delete(constants_1.ROUTES.USER.deleteUserAccount.replace(':username', userName))
            .expect(500)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('Error al eliminar el usuario.');
        });
    }));
    it('should return error 500 when a server error occurred message should be "Error interno del servidor"', () => __awaiter(void 0, void 0, void 0, function* () {
        const userName = 'PepeExample';
        vi.spyOn(user_1.default, 'findByIdAndDelete').mockImplementationOnce(() => {
            throw new Error('Simulated internal server error');
        });
        yield (0, supertest_1.default)(app)
            .delete(constants_1.ROUTES.USER.deleteUserAccount.replace(':username', userName))
            .expect(500)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('Error interno del servidor.');
        });
    }));
    it('The user should be able to delete the account message should be "Usuario eliminado con éxito."', () => __awaiter(void 0, void 0, void 0, function* () {
        const userName = 'PepeExample';
        yield (0, supertest_1.default)(app)
            .delete(constants_1.ROUTES.USER.deleteUserAccount.replace(':username', userName))
            .expect(200)
            .then((response) => {
            const { message } = response.body;
            expect(message).toBe('Usuario eliminado con éxito.');
        });
    }));
});
