"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = require("express");
const constants_1 = require("../constants");
const sendExpoNotification_1 = require("../controllers/notifications/sendExpoNotification");
exports.notificationRoutes = (0, express_1.Router)();
exports.notificationRoutes.get(constants_1.ROUTES.NOTIFICATIONS.getCronNotifications, sendExpoNotification_1.sendNotification);
