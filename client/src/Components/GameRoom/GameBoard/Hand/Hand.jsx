import React, { memo } from 'react'
import './Hand.css'
import { useState, useEffect } from 'react'
import Card from '../Card/Card'
import AllCards from '../../../allCards' 
import { useContext, useMemo } from 'react'
import GameContext from '../../GameContext/GameContext'
import Constants from '../../../../Constants'
import socket from '../../../socket'


function Hand () {
    console.log('renderizando Componente Hand')

    const { roomData, amICurrentPlayer, myPlayer, currentPlayer } = useContext(GameContext)
    const cardsArray = AllCards()
    const canRedrawCards = useMemo(() => 
        roomData 
            && (
                roomData.state == Constants.RoomStates.PICKING_PROMPT
                || (roomData.state == Constants.RoomStates.SELECTING_CARDS && !currentPlayer.selectedCard)
             ))

    const redrawHand = () => {
        console.log("Recomprando cartas! :)")
        socket.emit('redraw', (error) => {
            if (error) {
                return alert(error)
            }            
        })
    }

    //ENCONTRAR UMA FORMA MAIS EFICIÊNTE DE FAZER ISSO!
    const renderCards = () => {   
        if(roomData.myHand !== []){
            const getCardInfo = cardInput => cardsArray.find(card => card.cardTitle === cardInput)
            return roomData.myHand.map((card, index) => {            
                let cardInfo = getCardInfo(card)
                console.log('hand card', cardInfo)
                return (
                    <Card 
                        type="hand"
                        key={index} 
                        class={"hand"}
                        id={cardInfo.cardTitle}
                        src={cardInfo.src} 
                        alt={`Imagem da carta: ${cardInfo.cardTitle}`}
                    />                        
                )            
            })              
        }
          
    }

    
    return(
        <React.Fragment>
        <div className={"player-hand " + (amICurrentPlayer && roomData.state == Constants.RoomStates.PICKING_PROMPT ? 'iAmPickingPrompt' : '') }>
            <a onClick={redrawHand} className={`player-hand-redraw ${canRedrawCards ? 'enabled' : 'disabled'}`}>RECOMPRAR MÃO</a>
                {renderCards()}
        </div>            
        </React.Fragment>
    )
}

export default React.memo(Hand)