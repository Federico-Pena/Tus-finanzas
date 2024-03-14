"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config.js");
const url = process.env.URL_DB;
const connectToDatabase = () => {
    mongoose_1.default
        .connect(url)
        .then(() => console.log(`Conexión exitosa a la base de datos: ${mongoose_1.default.connection.name}`))
        .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    });
};
exports.connectToDatabase = connectToDatabase;
