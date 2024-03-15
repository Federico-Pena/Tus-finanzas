"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const constants_1 = require("../constants");
const login_1 = require("../controllers/user/login");
const register_1 = require("../controllers/user/register");
const deleteAccount_1 = require("../controllers/user/deleteAccount");
const postTokenPushNotification_1 = require("../controllers/user/postTokenPushNotification");
const authorization_1 = __importDefault(require("../middleware/authorization"));
exports.userRoutes = (0, express_1.Router)();
exports.userRoutes.post(constants_1.ROUTES.USER.loginUser, login_1.login);
exports.userRoutes.post(constants_1.ROUTES.USER.registerUser, register_1.register);
exports.userRoutes.delete(constants_1.ROUTES.USER.deleteUserAccount, deleteAccount_1.deleteAccount);
exports.userRoutes.post(constants_1.ROUTES.USER.postPushNotificationToken, authorization_1.default, postTokenPushNotification_1.postTokenPushNotification);
