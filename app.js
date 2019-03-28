const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const configs = require('./configs');
const bodyParser = require('body-parser');
const connections = require('./connection');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const fs = require('fs');
const server = express();

const headers = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
const read = function (req, res, next ) {
  console.log(`Url: ${req.url}   Method: ${req.method}  Received`);
  next();
}

server.use(read);
server.use(headers);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true|false}));

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: configs.SECRETE_OR_KEY
}

const strategy = new JwtStrategy(opts,function (payload, done) {
  connections.sql_login(payload)
    .then(function(result) {
      if(result.Login){
        return done(null, result.Login);
      }
      else {
        return done(null, false);
      }
    })
    .catch(function (error) {
      return done(error, null);
    });
//   next(null, user);
});


passport.use(strategy);
server.use(passport.initialize());
// server.use(passport.transformAuthInfo());

server.get('/', function (req, res, nexxt) {
  if (req.isAuthenticated()){
    res.send('Hello');
  }else {
    res.redirect('/login');
    res.end();
  }
})
server.get('/login', function (req,res) {
  if (!req.isAuthenticated()){
    fs.readFile('./login.html', function(err,data) {
      if(!!err){
        console.log(err);
      }
      res.end(data);
    })
  }
})
server.post('/registerlogin', function (req, res) {
  if (req.body.login && req.body.senha) {
    connections.sql_insert_login(req.body)
    .then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.json(error);
    })
  }
});
server.put('/login', function (req, res) {
  if (req.body.login && req.body.senha) {
    connections.alterar_senha(req.body)
      .then(function (result) {
        res.end(result);
      })
      .catch(function (error) {
        res.json(error);
      })
  }
});
server.post('/login', function (req,res) {
  // console.log('recebido',req.body);
  if(req.body.login && req.body.senha){
    // const login = req.body.login;
    // const senha = req.body.senha;
    connections.sql_login(req.body)
      .then(function (result) {
        // console.log('result rota: ',result);
        if(req.body.login == result.Login && req.body.senha == result.Senha){
          // console.log('ha desgraça foi')
          // const resu = ;
          const payload = { user: result.Login};
          const token = jwt.sign(payload, configs.SECRETE_OR_KEY);
          // console.log('olha ele ai >',token);
          res.json({'token':'JWT'+token});
          // res.end();
          // res.redirect('/');
        }
      })
      .catch(function () {
        res.redirect('/login');
      })
  } else {
    res.redirect('/login');
  }
});
server.delete('/login', function(req, res){
  //
  connections.deletar_usuario(req.body)
    .then(function (result) {
      res.send(result);
    })
    .catch(function (error) {
      res.json(error);
    })
});

module.exports = server;