const os = require('os');

const Ip = function (ipv4) {
  let object = os.networkInterfaces();
  object[Object.keys(object)[1]].forEach(function (element) {
    if (element.family === 'IPv4'){
      ipv4(element.address);
    }
  })
}

module.exports = {
  SECRETE_OR_KEY: "S3V3RT3ST3",
  'Ip': '',
  'Port': '3306',
  'User': 'root',
  'Password': '10189727Jv!10189727Jv1ct0r10189727Jv1ct0r10189727Jv!',
  'GetIp': function () {
    let this_ = this;
    Ip( ip => {
      this_.Ip = ip;
    })
  }
}
