const { writeFileSync, readFileSync } = require("fs");
const Rooms = require("./services/rooms");
const Users = require("./services/users");
const Room = require("./models/room");
const User = require("./models/user");

const Utils = module.exports = {}

const DB_PERSIST_INTERVAL = 5000

// Transforma um texto qualquer em um texto "safe" em HTML
// https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
Utils.escapeHTML = function escapeHtml(unsafe) {
    return unsafe && unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Persiste o banco de dados em um arquivo periodicamente
// TODO -> usar banco de ddos kkk isso é só uma contingencia muito barata!
Utils.persistDatabasePeriodically = function (path) {
    console.log("Will persist the database on file [%s] every [%d] MS", path, DB_PERSIST_INTERVAL)

    setInterval(() => {
        console.debug(`Persisting database to [${path}]`)
        writeFileSync(path, JSON.stringify({
            rooms: Rooms.getRooms(),
            users: Users.getUsers()
        }))
    }, DB_PERSIST_INTERVAL)
}

Utils.loadDatabaseFromFile = function (path) {
    console.log("Loading database from file [%s]", path)

    try {
        const fileContents = readFileSync(path).toString()

        const data = JSON.parse(fileContents || `{}`)
    
        Users.setUsers(data.users.map(u => new User(u)))
        Rooms.setRooms(data.rooms.map(r => new Room(r)))

        console.log("Restored rooms: ", Rooms.getRooms()) 
        console.log("Restored users: ", Users.getUsers())
    } catch (e) {
        console.error(e)
        return
    }

}