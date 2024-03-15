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
const register_1 = require("./register");
const user_1 = __importDefault(require("../../models/user"));
const testConst_1 = require("../testConst");
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post(constants_1.ROUTES.USER.registerUser, register_1.register);
    yield (0, databaseTest_1.dbTestConnect)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, databaseTest_1.dbTestDisconnect)();
}));
describe('register  controller', () => {
    it('It should give an error if the username is less than 3 or more than 12 characters message should be "El nombre de usuario debe tener entre 3 y 12 caracteres."', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .post(constants_1.ROUTES.USER.registerUser)
            .send(testConst_1.userTest)
            .expect(400)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('El nombre de usuario debe tener entre 3 y 12 caracteres.');
        });
    }));
    it('It should give an error if the email is not valid email message should be "El formato del correo electrónico es inválido."', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            username: 'pepeExample',
            email: 'pepeExample.com',
            password: 'password'
        };
        yield (0, supertest_1.default)(app)
            .post(constants_1.ROUTES.USER.registerUser)
            .send(user)
            .expect(400)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('El formato del correo electrónico es inválido.');
        });
    }));
    it('It should give an error if the password is not valid password message should be "La contraseña debe tener entre 8 y 12 caracteres y contener al menos una letra mayúscula, una letra minúscula y un número."', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            username: 'pepeExample',
            email: 'pepe@example.com',
            password: 'password'
        };
        yield (0, supertest_1.default)(app)
            .post(constants_1.ROUTES.USER.registerUser)
            .send(user)
            .expect(400)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('La contraseña debe tener entre 8 y 12 caracteres y contener al menos una letra mayúscula, una letra minúscula y un número.');
        });
    }));
    it('It should create a new user message should be "Usuario registrado exitosamente, ahora inicie sesión."', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            username: 'PepeExample',
            email: 'pepe@example.com',
            password: 'Password8'
        };
        yield (0, supertest_1.default)(app)
            .post(constants_1.ROUTES.USER.registerUser)
            .send(user)
            .expect(200)
            .then((response) => {
            const { message } = response.body;
            expect(message).toBe('Usuario registrado exitosamente, ahora inicie sesión.');
        });
    }));
    it('It should give an error if username or email already is associated in another account message should be "El nombre de usuario o email esta asociado a otra cuenta."', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            username: 'PepeExample',
            email: 'pepe@example.com',
            password: 'Password8'
        };
        yield (0, supertest_1.default)(app)
            .post(constants_1.ROUTES.USER.registerUser)
            .send(user)
            .expect(400)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('El nombre de usuario o email esta asociado a otra cuenta.');
        });
    }));
    it('should return error 500 when a server error occurred message should be "Error interno del servidor""', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            username: 'PepeExample',
            email: 'pepe@example.com',
            password: 'Password8'
        };
        vi.spyOn(user_1.default.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Simulated internal server error');
        });
        yield (0, supertest_1.default)(app)
            .post(constants_1.ROUTES.USER.registerUser)
            .send(user)
            .expect(500)
            .then((response) => {
            const { error } = response.body;
            expect(error).toBe('Error interno del servidor.');
        });
    }));
});
