import React, { useState, useContext, useMemo, useEffect } from "react";
import './Join.css'
import { socket } from "../socket";
import SessionContext from '../SessionContext'
import { Redirect, useLocation } from "react-router";

const Join = () => {

    const location = useLocation()

    // Room name que veio com o link
    const roomNameFromLink = location && new URLSearchParams(location.search).get('roomName')

    const [name, setName] = useState('');
    const [room, setRoom] = useState(roomNameFromLink || '');
    const [existingRooms, setExistingRooms] = useState([])

    const { session, setSession } = useContext(SessionContext)

    const EnterRoom = (event) => {

        console.log(process.env.REACT_APP_API_ADDRESS)

        fetch(`${process.env.REACT_APP_API_ADDRESS}/test`)
            .then(res => res.text())
            .then(console.log)
            .catch(console.log)

        event.preventDefault()
        console.log("Tentando entrar na sala!")
        if (!socket || !socket.connected) {
            alert("Pera um segundinho que estamos conectando no servidor!")
            console.error("Pera um segundinho que estamos conectando no servidor!")
            return
        }


        if (!name || !room) {
            alert("Ei.. escreve um nome e uma sala!")
            console.log("Ainda faltaw nome ou sala.. esperando mais")
        } else {
            console.log("Entrando na sala!")
            CreateUser()
        }
    }

    const CreateUser = () => {
        socket.emit('join', { name, roomName: room }, (error, roomData) => {
            if (error) {
                alert(error);
                return
            }
            console.log("Entramos na sala! Aqui estão os detalhes :) Atualizando sessão", roomData)
            setSession({ user: session.user, roomData: roomData })
        });
        console.log('createUser() em Join.js disparou socket.emit("join")')
    }

    //
    // Loads available rooms every second
    //
    useEffect(() => {
        const id = setInterval(() => {
            LoadAvailableRooms()
        }, 5000);

        return () => {
            clearTimeout(id);
        };
    });


    const LoadAvailableRooms = () => {
        console.debug("Carregando salas disponíveis")

        socket.emit('getRooms', (error, rooms) => {
            if (error) {
                alert(error);
                return
            }
            console.debug("Salas disponíveis carregadas", rooms)
            setExistingRooms(rooms)
        });
    }

    // Redireciona usuário para GameRoom se já houver alguma sala
    if (session && session.roomData) {
        console.log("Já estamos em uma sala! Redirecionando para GameRoom", session.roomData)
        return <Redirect to={"/GameRoom/" + encodeURIComponent(session.roomData.name)} />
    }

    if (roomNameFromLink) {
        console.info("Renderizando com roomName do link [%s]", roomNameFromLink)
    }

    const renderContent = () => {
        return <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <div className="wordartblues"><span className="text">Jonarius!</span></div>
                <form onSubmit={event => EnterRoom(event)}>
                    <div><input autoFocus placeholder="Escreve um apelido maroto..." className="joinInput mt-20" type="text" onChange={(event) => setName(event.target.value)} autocorrect="off" autocapitalize="none" /></div>
                    <div><input placeholder="Qual o nome da sala?" className="joinInput mt-20" type="text" value={room} onChange={(event) => setRoom(event.target.value)} autocorrect="off" autocapitalize="none" /></div>
                    {/* <div>
                        Disponíveis:
                        <ul>

                            {
                                existingRooms
                                    .filter(r => r.state == "WAITING_FOR_PLAYERS")
                                    .map(r => <li>{r.name}</li>)
                            }
                        </ul>
                    </div> */}
                    <button className="button button-join mt-20" type="submit">Manda bala</button>
                </form>
            </div>
        </div>
    }

    return (
        <>
            {renderContent()}
        </>
    )
}

export default Join