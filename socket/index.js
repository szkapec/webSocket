const socketPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(socketPort);

console.log('listen in ', socketPort)

const wsWServer = new webSocketServer({
  httpServer: server
});

const getUniqueId = () => {
  const s4 = () => Math.floor((1+ Math.random())  * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

const clients = {}

wsWServer.on('request', function (request) {
  let userId = getUniqueId();
  console.log(`reguest.oriigin`, request.origin);

  const connection = request.accept(null, request.origin);
  clients[userId] = connection;
  console.log(`userId`, userId, clients)

  connection.on('message', function(message) {
    if(message.type === 'utf8') {
      console.log(`message.utf8Data`, message.utf8Data)

      for(key in clients) {
        clients[key].sendUTF(message.utf8Data);
        console.log(`clients[key]`, clients[key])
      }
    }
  })
})