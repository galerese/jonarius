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
const socketA = socket_io_client_1.default.connect(`http://localhost:${testPort}/`);
const socketB = socket_io_client_1.default.connect(`http://localhost:${testPort}/`);
const socketsArray = [
    { socket: socketA, isCoupled: true },
    { socket: socketB, isCoupled: true }
];
const socketAEmits = (event, data, latency) => {
    console.log('Initializing connection for socketA:\n---> waiting %s ms', latency);
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                socketA.emit(event, data);
                resolve(`socketA emit event ${event}!\n`);
            }, latency);
        }
        catch (_a) {
            reject('Something went wrong on connecting socketA\n');
        }
    });
};
const socketAListens = (event) => {
    socketA.on(event, (data) => {
        console.debug('SOCKET A RECEIVING DATA FROM SERVER:');
        console.debug(data);
    });
};
const socketBEmits = (event, data, latency) => {
    console.log('Initializing connection for socketB:\n---> waiting %s ms', latency);
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                socketB.emit(event, data);
                resolve(`socketB emit event ${event}!\n`);
            }, latency);
        }
        catch (_a) {
            reject('Something went wrong on connecting socketB\n');
        }
    });
};
const socketBListens = (event) => {
    socketB.on(event, (data) => {
        console.debug('SOCKET B RECEIVING DATA FROM SERVER:');
        console.debug(data);
    });
};
const disconnectAllCoupledSockets = () => {
    return new Promise((resolve, reject) => {
        try {
            // force socket to disconnect after 5 seconds!
            setTimeout(() => {
                socketsArray.forEach(socketObject => {
                    if (socketObject.isCoupled === true) {
                        socketObject.socket.disconnect();
                    }
                });
                resolve('All Coupled Sockets hava been Disconnected!');
            }, 5000);
        }
        catch (_a) {
            reject('Something went wrong on disconnecting sockets');
        }
    });
};
function pipeline() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataA = { name: "Socket Bombabdo", roomName: "Sala DO PIPO" };
        const dataB = { name: "Socket Maratonado", roomName: "Sala DO PIPÃO" };
        yield socketAEmits('join', dataA, 3000)
            .then(console.log)
            .catch(console.log);
        yield socketBEmits('join', dataB, 3000)
            .then(console.log)
            .catch(console.log);
        yield disconnectAllCoupledSockets()
            .then(console.log)
            .catch(console.log);
    });
}
// pipeline()
socketA.on('connect', () => {
    pipeline();
});
socketAListens('roomData');
socketBListens('roomData');
