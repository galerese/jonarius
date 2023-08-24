"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RoomController = require('./POSTGRESQL/controllers/RoomController');
const UserController = require('./POSTGRESQL/controllers/UserController');
const routes = express_1.default.Router();
routes.post('/rooms', RoomController.store);
routes.get('/rooms', RoomController.list);
routes.post('/users', UserController.store);
routes.get('/users', UserController.list);
routes.get("/", (req, res) => {
    res.send({ response: "Server is up and running." }).status(200);
});
exports.default = routes;
