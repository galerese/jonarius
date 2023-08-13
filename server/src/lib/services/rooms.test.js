const Room = require('../models/room');
const User = require('../models/user');
const Rooms = require('./rooms');

describe('room score calculation', () => {
    it('should calculate properly when everybody picks the right card :)', () => {

        Rooms.sendSystemMessageToRoom = () => {}

        const user1 = new User({
            id: 1,
            name: 'User1'
        })
        const user2 = new User({
            id: 2,
            name: 'User2'
        })
        const user3 = new User({
            id: 3,
            name: 'User3'
        })

        const { room } = Rooms.createRoom({
            roomName: 'test',
            hostPlayer: user1
        })
        Rooms.addUserToRoom({ room, user: user2 })
        Rooms.addUserToRoom({ room, user: user3 })
        Rooms.toggleDeck('dixit', room)

        Rooms.startGame({ user: user1, room })

        const player1 = room.getPlayerForUser(user1)
        const player2 = room.getPlayerForUser(user2)
        const player3 = room.getPlayerForUser(user3)

        // Set fixed player order
        room.players = [
            player1, player2, player3
        ]

        expect(player1.score).toBe(0)
        expect(player2.score).toBe(0)
        expect(player3.score).toBe(0)


        //
        // Round 1 - All players voted on the right card
        //
        expect(room.players[room.currentPlayerIndex]).toBe(player1)
        Rooms.setPromptForUser({ user: user1, prompt: "Test", room})

        Rooms.setSelectedCardForUser(user1, room, player1.hand[0])
        Rooms.setSelectedCardForUser(user2, room, player2.hand[0])
        Rooms.setSelectedCardForUser(user3, room, player3.hand[0])

        expect(room.state).toBe(Room.States.VOTING)

        Rooms.setVotedCardForUser({ user: user2, room, card: player1.selectedCard })
        Rooms.setVotedCardForUser({ user: user3, room, card: player1.selectedCard })

        expect(player1.score).toBe(0)
        expect(player2.score).toBe(2)
        expect(player3.score).toBe(2)

        //
        // Round 2 - No one voted on the right  card
        //
        expect(room.players[room.currentPlayerIndex]).toBe(player2)
        expect(room.state).toBe(Room.States.PICKING_PROMPT)
        Rooms.setPromptForUser({ user: user2, prompt: "Test", room})

        Rooms.setSelectedCardForUser(user1, room, player1.hand[0])
        Rooms.setSelectedCardForUser(user2, room, player2.hand[0])
        Rooms.setSelectedCardForUser(user3, room, player3.hand[0])

        // All players voted on the right card
        Rooms.setVotedCardForUser({ user: user1, room, card: player3.selectedCard })
        Rooms.setVotedCardForUser({ user: user3, room, card: player1.selectedCard })
        
        expect(player1.score).toBe(3)
        expect(player2.score).toBe(2)
        expect(player3.score).toBe(5)

        //
        // Round 3 - Some votes on the right cards
        //
        expect(room.players[room.currentPlayerIndex]).toBe(player3)
        expect(room.state).toBe(Room.States.PICKING_PROMPT)
        Rooms.setPromptForUser({ user: user3, prompt: "Test", room})

        Rooms.setSelectedCardForUser(user1, room, player1.hand[0])
        Rooms.setSelectedCardForUser(user2, room, player2.hand[0])
        Rooms.setSelectedCardForUser(user3, room, player3.hand[0])

        // All players voted on the right card
        Rooms.setVotedCardForUser({ user: user1, room, card: player3.selectedCard })
        Rooms.setVotedCardForUser({ user: user2, room, card: player1.selectedCard })
        
        expect(player1.score).toBe(7)
        expect(player2.score).toBe(2)
        expect(player3.score).toBe(8)

        //
        // Round 4 - Some votes on the right cards
        //
        expect(room.players[room.currentPlayerIndex]).toBe(player1)
        expect(room.state).toBe(Room.States.PICKING_PROMPT)
        Rooms.setPromptForUser({ user: user1, prompt: "Test", room})

        Rooms.setSelectedCardForUser(user1, room, player1.hand[0])
        Rooms.setSelectedCardForUser(user2, room, player2.hand[0])
        Rooms.setSelectedCardForUser(user3, room, player3.hand[0])

        // All players voted on the right card
        Rooms.setVotedCardForUser({ user: user2, room, card: player1.selectedCard })
        Rooms.setVotedCardForUser({ user: user3, room, card: player2.selectedCard })
        
        expect(player1.score).toBe(10)
        expect(player2.score).toBe(6)
        expect(player3.score).toBe(8)

        //
        // Round 5 - All votes wrong
        //
        expect(room.players[room.currentPlayerIndex]).toBe(player2)
        expect(room.state).toBe(Room.States.PICKING_PROMPT)
        Rooms.setPromptForUser({ user: user2, prompt: "Test", room})

        Rooms.setSelectedCardForUser(user1, room, player1.hand[0])
        Rooms.setSelectedCardForUser(user2, room, player2.hand[0])
        Rooms.setSelectedCardForUser(user3, room, player3.hand[0])

        // All players voted on the right card
        Rooms.setVotedCardForUser({ user: user1, room, card: player3.selectedCard })
        Rooms.setVotedCardForUser({ user: user3, room, card: player1.selectedCard })
        
        expect(player1.score).toBe(13)
        expect(player2.score).toBe(6)
        expect(player3.score).toBe(11)

    })
});