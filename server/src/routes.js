const express = require("express");
const fs = require('fs')
const Utils = require('./lib/utils')
const got = require('got')

const routes = express.Router();

// We will cache the index using HTTP when we first try to serve the dynamic index
let cachedIndexPage = undefined 

//
// Métodos helpers
//

// Esté método basicamente serve o index.html com a adição das informações de open graph
// (isso são informacoes para compartilhamento de link em plataformas como discord, etc)

// Mais detalhes aqui: https://ogp.me/
const serveIndexWithOpenGraph = async function (req, res) {

  if (!cachedIndexPage) {
    const {body} = await got(process.env.CLIENT_HTML_INDEX_URL)
    cachedIndexPage = body
    console.log("Just loaded index page: %s", body)
  }

  if (!cachedIndexPage) {
    res.send('Eita, deu ruim :o')
    return
  }

  console.log("FORWARDED FOR", req.headers['x-forwarded-for'])

  // Mais detalhes aqui: https://ogp.me/
  // Com esse esquema de "opengraph", plataformas como discord e facebook conseguem
  // dar mais informacoes para o usuário quando nosso link é compartilhado :)
  let roomName =  Utils.escapeHTML(req.params.roomName)

  var opengraphUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var opengraphImage = req.protocol + '://' + req.get('host') + '/opengraph-image.png';
  var opengraphTitle = roomName ? `Jonarius - Vem jogar na sala: ${roomName} :)` : `Jonarius - Vem jogar com a gente :)`
  var opengraphDescription = 'Jonarius é uma alternativa online ao jogo Dixit.. vem experimentar!'

  let opengraphData = `
  <meta property="og:title" content="${opengraphTitle}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${opengraphUrl}" />
<meta property="og:image" content="${opengraphImage}" />
<meta property="og:description" content="${opengraphDescription}" />
  `;

  res.send(cachedIndexPage.replace("<opengraph/>", opengraphData))
}


//
// Rotas
//


routes.get("/healthcheck", (req, res) => {
  res.send({ response: "Server is up and running. :)" }).status(200);
});

// Vamos renderizar o / com script e não estático, para poder
// mandar parametros de opengraph :)

if (process.env.CLIENT_HTML_INDEX_URL) {
  console.log("Serving OpenGraph contents in / and /GameRoom/:roomName and 404 pages from [%s]", process.env.CLIENT_HTML_INDEX_URL)
  routes.get("/", serveIndexWithOpenGraph)
  routes.get("/GameRoom/:roomName", serveIndexWithOpenGraph)
  // E servir o arquivo index.html em caso de 404,
  // que deve saber lidar com isso no frontend
  routes.use(serveIndexWithOpenGraph)
} else {
  console.log("NOT serving OpenGraph contents in / and /GameRoom/:roomName")
  
}


module.exports = routes;


