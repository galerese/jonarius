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
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const testPort = process.env.TEST_PORT || 9000;
const socketSemNome = socket_io_client_1.default.connect(`http://localhost:${testPort}/`);
const disconnectSocketSemNome = () => {
    return new Promise((resolve, reject) => {
        try {
            // force socket to disconnect after 5 seconds!
            setTimeout(() => {
                socketSemNome.disconnect();
                resolve('Socket Sem Nome hava been Disconnected!');
            }, 5000);
        }
        catch (_a) {
            reject('Something went wrong on disconnecting sockets');
        }
    });
};
function pipeline() {
    return __awaiter(this, void 0, void 0, function* () {
        yield disconnectSocketSemNome()
            .then(console.log)
            .catch(console.log);
    });
}
pipeline();
