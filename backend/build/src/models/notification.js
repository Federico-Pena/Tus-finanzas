"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    to: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    sendAt: { type: Date, required: true }
});
const Notification = mongoose_1.default.model('Notification', notificationSchema);
exports.default = Notification;
