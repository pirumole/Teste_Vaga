const mysql = require('mysql');
const configs = require('../configs');

configs.GetIp();

const sql = mysql.createConnection({
    host: configs.Ip,
    port: configs.Port,
    user: configs.User,
    password: configs.Password
})

// exports.sql_login = function (obj, callback) {
//     sql.query(``, (error, result) => {
//         if(error){
//             callback(error, null);
//         }
//         let returned = JSON.stringify(result);
//         returned = JSON.parse(returned)[0]; 
//         callback(null, returned);
//     });
// }
var recebe_Data_return_JSON = function (o) {
  let returned = JSON.stringify(o);
  returned = JSON.parse(returned);
  return returned;
} 
exports.sql_login = function (obj) {
  console.log('entry');
  return new Promise(function (resolve, reject) {
    // console.log('lendo',obj);
    if ((obj.login || obj.user) || obj.senha){
      sql.query(`Select * from \`Teste_Vaga\`.\`view_Logins\` WHERE (\`Login\` = '${obj.login}');`, function (err, result) {
        if (err) {
          reject(err);
        } else {
          // console.log('retornou',returned);
          // const obj = {"Login": returned.Login, "Senha": returned.Senha};
          let returned = recebe_Data_return_JSON(result);
          resolve(returned);
        }
      })
    } else {
      resolve(false);
    }
  })
}
exports.sql_insert_login = function (obj) {
  // console.log('Insert');
  return new Promise(function (resolve, reject) {
    if (obj.login && obj.senha) {
      sql.query(`INSERT INTO \`Teste_Vaga\`.\`Logins\` (\`Id_Login\`, \`Login\`, \`Senha\`) VALUES (null, '${obj.login}', '${obj.senha}');`, function (err, result) {
        if(err){
          reject(err);
        } else {
          resolve(result);
        }
      });
    } else {
      reject(false);
    }
  })
}
exports.alterar_senha = function (obj) {
  return new Promise(function (resolve, reject) {
    if(obj.login && obj.senha && obj.senha_conf) {
      //
      if (obj.senha == obj.senha_conf){
        sql.query(`SELECT \`Logins\`.\`Id_Login\` FROM \`Teste_Vaga\`.\`Logins\` WHERE (\`Login\` = '${obj.login}');`, function (err, result) {
          if (err) {
            reject(err);
          } 
          console.log(result);
          sql.query(`UPDATE \`Teste_Vaga\`.\`Logins\` SET \`Senha\` = '${obj.senha}' WHERE (\`Teste_Vaga\`.\`Logins\`.\`Id_Login\` = ${recebe_Data_return_JSON(result)[0].Id_Login});`, function (err, result) {
            if (err) {
              reject(err);
            }
            resolve(true);
          })
        });
      }
      else {
        reject(false);
      }
    } else {
      reject(false);
    }
  })
}
exports.deletar_usuario = function (obj) {
  return new Promise(function (resolve, reject) {
    if (obj.login) {
      sql.query(`SELECT \`Logins\`.\`Id_Login\` FROM \`Teste_Vaga\`.\`Logins\` WHERE (\`Login\` = '${obj.login}');`, function (err, result) {
        if(err) {
          reject(err);
        }
        sql.query(`DELETE FROM \`Teste_Vaga\`.\`Logins\` WHERE \`Id_Login\` = ${recebe_Data_return_JSON(result)[0].Id_Login};`, function (err, result) {
          if (err) {
            reject(err);
          }
          resolve(true);
        })
      })
    } else {
      reject(false);
    }
  })
}