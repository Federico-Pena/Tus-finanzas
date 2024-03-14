"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, { data, message, error }) => {
    const payload = {};
    if (data !== undefined) {
        payload.data = data;
    }
    if (message !== undefined) {
        payload.message = message;
    }
    if (error !== undefined) {
        payload.error = error;
    }
    payload.status = statusCode;
    res.status(statusCode).json(payload);
};
exports.sendResponse = sendResponse;
