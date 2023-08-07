const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const fs = require('fs');
const session = require("express-session")
const FileStore = require('session-file-store')(session);

const app = express();
const server = http.createServer(app)

const sessionStorePath = process.env.SESSION_STORE_PATH || './sessions'
console.log("Using session store path [%s]", sessionStorePath)

const socketIOPath = process.env.SOCKET_IO_PATH || "/socket.io"
console.log("Initializing socket server with path [%s]", socketIOPath)

const io = socketio(server, {
  path: socketIOPath
});

//
// MIDDLEWARES
//

//
// Implementação de sessões no socket e no servidor express :)
//
const cookieAge = 12 * 30 * 24 * 60 * 60 // age in seconds
const sessionMiddleware = session({
  secret: "agentequerboleteyesok123",
  resave: true,
  saveUninitialized: true,
  cookie: {
    // Cookie expira em um ano :), em millisegundos
    maxAge: cookieAge * 1000,
  },
  store: new FileStore(
    {
      path: sessionStorePath,
      ttl: cookieAge
    }
  )

})

// Gambiarra para colocar cookie de sessão no socketio
// --------
// Isso intercepta cada request e faz a sessão antes do express e do socketIO terem
// a chance de fazer qualquer coisa :)
var listeners = server.listeners('request').slice(0);
server.removeAllListeners('request');
server.on('request', (req, res) => {
  sessionMiddleware(req, res, () => {
    listeners.forEach((listener) => {
      listener.call(this, req, res)
    })
  })
})
// Debugging cookies that are sent :)
// var oldWriteHead = http.ServerResponse.prototype.writeHead
// http.ServerResponse.prototype.writeHead = function() {
//   console.log("WRITING HEAD!", this.getHeader('Set-Cookie'))
//   console.log("WRITING HEAD!", arguments)
//   oldWriteHead.apply(this, arguments)
// }

// Outros modulos do servidor
app.use(cors());

// Colocando middleware para parsear o body em objeto e o query string também
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/test', (req, res) => {
  res.send("<h1>Hello from Docker!!!</h1>")
})

//
// ROTEAMENTO
//

// Roteamento de coisas com lógica customizada
app.use(routes) 

module.exports = { io, server, app }