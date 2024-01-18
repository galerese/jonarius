

// Esse módulo representa um jogador em uma sala, com várias informações sobre o jogo

const Users = require("../services/users")
const User = require("./user")

// além do prórpio usuário 
module.exports = class RoomPlayer {
    constructor({
        user,
        score,
        turnScore,
        hand,
        mySelectedCard,
        selectedCard,
        votedCard,
        lastRedrawTurn
    }){
        this.user = user instanceof User ? user : Users.getUser(user.id)
        this.score = score || 0
        this.turnScore = turnScore || 0
        this.hand = hand || []
        this.lastRedrawTurn = lastRedrawTurn || null
        this.mySelectedCard = mySelectedCard || null
        this.selectedCard = selectedCard || null
        this.votedCard = votedCard || null
    }
}