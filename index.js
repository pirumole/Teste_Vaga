const http = require('http');
const middleware = require('./app');
const configs = require('./configs.js');
configs.GetIp();

const server = http.createServer(middleware);

// console.log(configs.Ip);
// server.listen(configs.Ip, '8080', function () {
//   console.log(`Server Open in http://${configs.Ip}:8080/`);
// });

// NÃO FOI NO IP POR CONTA DAS MINHAS REGRAS DE FIREWALL..
// TENSO MAS MINHA MAQUINA É LINUX.

server.listen('3000', function () {
  console.log(`Server Open in http://localhost:3000/`);
});
