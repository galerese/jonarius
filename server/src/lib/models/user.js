// Esse módulo representa um usuário e suas informações
module.exports = class User {

    constructor({createdAt, socketIds, id, name}){
        this.createdAt = createdAt || new Date()
        this.id = id
        this.name = name
        this.socketIds = socketIds || []
    }

    hasSocket(id) {
        return this.socketIds.find((socketId) => socketId == id)
    }

    toString() {
        return this.id
    }

}