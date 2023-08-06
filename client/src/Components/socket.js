import openSocket from 'socket.io-client'
import React from "react";
import Constants, { apiAddress, apiSocketPath } from '../Constants'

console.log("Opening socket with target [%s] and path [%s]", apiAddress, apiSocketPath)
export const socket = openSocket(Constants.apiAddress, {
    path: apiSocketPath
});
export default socket;