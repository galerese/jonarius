const uuid = require('uuid')
const User = require('../models/user')
let users = [];

module.exports = class Users {

  static createUser = () => {
    console.debug("Criando um novo usuário!")

    const userId = uuid.v4()

    const user = new User({ id: userId, name: "Usuário ainda sem nome" });

    users.push(user);
    console.debug("Novo usuário criado: %s", user)
    console.info("Usuário adicionado, agora temos [%s] usuário(s)", users.length)

    return { user };
  }

  static linkSocketToUser = ({socket, user}) => {
    console.info("Ligando o usuário [%s] ao socket [%s]", user, socket.id)
    if (user.hasSocket(socket.id)) {
      console.warn("Usuário [%s] já está ligado ao socket [%s], ignorando!", user, socket.id)
      return
    }

    user.socketIds.push(socket.id)
    console.debug("Usuário [%s] ligado ao socket [%s], agora ele tem [%s] socket(s)", user, socket.id, user.socketIds.length)
  }

  static removeSocketFromUser = ({socket, user}) => {
    console.info("Removendo a socket [%s] do usuário [%s]", socket.id, user)
    if (!user.hasSocket(socket.id)) {
      console.warn("Usuário [%s] não está ligado ao socket [%s], ignorando!", user, socket.id)
      return
    }

    user.socketIds.splice(user.socketIds.indexOf(socket.id), 1)
    console.debug("Usuário [%s] desligado do socket [%s], agora ele tem [%s] socket(s)", user, socket.id, user.socketIds.length)
  }

  // const addUser = ({ id, name, room }) => {
  //   console.debug("Tentando adicionar usuário com nome [%s] com socket [%s] na sala [%s]", name, id, room)
  //   name = name.trim().toLowerCase();
  //   room = room.trim().toLowerCase();

  //   const existingUser = users.find((user) => user.room === room && user.name === name);
  //   console.debug("Procurando nome de usuário existente [%s]", existingUser == undefined ? "Nome disponível" : "Nome indisponível")

  //   if(!name || !room) {
  //     console.debug("Usuário tentou entrar sem nome ou sala");
  //     return { error: 'Username and room are required.' };
  //   }

  //   if(existingUser) {
  //     console.debug("Usuário tentando entrar com nome que já existe [%s] na sala [%s]", name, room);
  //     return { error: 'Username is taken.' };
  //   }

  //   const user = { id, name, room };

  //   users.push(user);
  //   console.info("Usuário adicionado [%s], agora temos [%s] usuário(s)", user, users.length)

  //   return user;
  // }

  static removeUser = (id) => {
    console.info("Removendo usuário com socket.id = [%s]", id)
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) return users.splice(index, 1)[0] ;
  }

  static getUser = (id) => {
    // console.debug("Buscando usuário com id [%s]", id)
    // console.debug("Usuários disponíveis: ", users)
    return users.find((user) => user.id === id);
  }
  // Pedro diz: acho que essa função tá desatualizada, não funcional.
  // porque não existe user.room
  static getUsersInRoom = (room) => {
    console.debug("Buscando usuários da sala [%s]", room)
    return users.filter((user) => user.room === room);
  }

  static getUsers = () => {
    return users
  }

  static setUsers = (u) => {
    users = u || []
  }

  static changeUserName = (user, name) => {
    console.log(`Usuário [${user.id}] trocou o nome de [${user.name}] para [${name}]`)
    user.name = name
  }
}