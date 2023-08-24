"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require('./POSTGRESQL/database/index');
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = (0, socket_io_1.default)(server);
app.use(express_1.default.json());
app.use(routes_1.default);
io.on('connection', (socket) => {
    console.log('A user has connected with socket id: [%s]', socket.id);
    socket.on('join', (data) => {
        console.log("Usuário [%s] tentando entrar com nome [%s] na sala com nome [%s]", socket.id, data.name, data.roomName);
    });
    socket.on('disconnect', () => {
        console.log("A use has disconnected...");
    });
});
const testPort = process.env.TEST_PORT;
server.listen(testPort, () => {
    console.log('######################################');
    console.log('######## SERVER UP: PORT %s ########\n', testPort);
    console.log('THIS IS A SERVER FOR TESTS\nFeel free to Overdue stuff!');
    console.log('\n######################################');
    console.log('######################################\n');
});
