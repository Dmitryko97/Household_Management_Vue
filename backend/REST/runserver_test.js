let server = require("./server");
let connection = require("./connection_test");

module.exports = function(callback){
  server.listen(9100, function(){
    console.log("STARTED TEST rest server! :)");
    if(typeof callback === 'function')
      callback();
  });
};

require("./runserver.js")(connection, server);
