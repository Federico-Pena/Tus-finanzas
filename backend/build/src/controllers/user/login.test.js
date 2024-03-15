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
const login_1 = require("./login");
const user_1 = __importDefault(require("../../models/user"));
const bcrypt_1 = require("bcrypt");
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get(constants_1.ROUTES.USER.loginUser, login_1.login);
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
    it('It should give an error if the user not exists message should be "Credenciales incorrectas."', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            usernameOrEmail: 'PepeExample88',
            password: 'password'
        };
        yield (0, supertest_1.default)(app)
            .get(constants_1.ROUTES.USER.loginUser)
            .send(user)
            .expect(400)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('Credenciales incorrectas.');
        });
    }));
    it('It should give an error if password not match message should be "Credenciales incorrectas."', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            usernameOrEmail: 'PepeExample',
            password: 'password'
        };
        yield (0, supertest_1.default)(app)
            .get(constants_1.ROUTES.USER.loginUser)
            .send(user)
            .expect(400)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('Credenciales incorrectas.');
        });
    }));
    it('The user should log in, message should be "Hola otra vez PepeExample"', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            usernameOrEmail: 'PepeExample',
            password: 'Password88'
        };
        yield (0, supertest_1.default)(app)
            .get(constants_1.ROUTES.USER.loginUser)
            .send(user)
            .expect(200)
            .then((response) => {
            const { data, message } = response.body;
            expect(data.user.name).toEqual(user.usernameOrEmail);
            expect(message).toBe(`Hola otra vez ${user.usernameOrEmail}`);
        });
    }));
    it('should return error 500 when a server error occurred message should be "Error interno del servidor""', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            usernameOrEmail: 'PepeExample',
            password: 'Password88'
        };
        vi.spyOn(user_1.default, 'findOne').mockImplementationOnce(() => {
            throw new Error('Simulated internal server error');
        });
        yield (0, supertest_1.default)(app)
            .get(constants_1.ROUTES.USER.loginUser)
            .send(user)
            .expect(500)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('Error interno del servidor.');
        });
    }));
});
