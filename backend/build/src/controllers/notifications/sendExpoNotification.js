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
const expo_server_sdk_1 = require("expo-server-sdk");
const node_cron_1 = __importDefault(require("node-cron"));
const notification_1 = __importDefault(require("../../models/notification"));
const expo = new expo_server_sdk_1.Expo();
const sendExpoNotification = ({ to, title, body }) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
        to,
        title,
        body
    };
    yield expo.sendPushNotificationsAsync([message]);
});
node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Verificando notificaciones pendientes...');
    const notifications = yield notification_1.default.find({
        sendAt: { $lte: new Date() }
    });
    for (const notification of notifications) {
        try {
            yield sendExpoNotification({
                to: notification.to,
                title: notification.title,
                body: notification.body
            });
            yield notification_1.default.findByIdAndDelete({ _id: notification._id });
            console.log('Notificación enviada y eliminada');
        }
        catch (error) {
            console.error('Error al enviar notificación', error);
        }
    }
}));
