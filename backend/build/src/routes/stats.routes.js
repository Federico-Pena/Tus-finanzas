"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsRoutes = void 0;
const express_1 = require("express");
const constants_1 = require("../constants");
const authorization_1 = __importDefault(require("../middleware/authorization"));
const categoriesStats_1 = require("../controllers/stats/categoriesStats");
const categoriesYear_1 = require("../controllers/stats/categoriesYear");
const categoriesMonth_1 = require("../controllers/stats/categoriesMonth");
exports.statsRoutes = (0, express_1.Router)();
exports.statsRoutes.get(constants_1.RUTES.STATS.getCategoriesStats, authorization_1.default, categoriesStats_1.categoriesStats);
exports.statsRoutes.get(constants_1.RUTES.STATS.getCategoriesStatsYear, authorization_1.default, categoriesYear_1.transactionStatsByYear);
exports.statsRoutes.get(constants_1.RUTES.STATS.getCategoriesStatsMonth, authorization_1.default, categoriesMonth_1.categoriesMonth);
