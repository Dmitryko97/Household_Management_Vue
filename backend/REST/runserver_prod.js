let mysql = require("mysql");

let connection = mysql.createConnection({
  host: 'mysql.stud.iie.ntnu.no',
  user: 'g_tdat2003_t01',
  password: '0YfHKz2G',
  database: 'g_tdat2003_t01'
});

connection.connect();

let server = require("./server");

server.listen(9000, function(){
  console.log("STARTED PROD rest server! :)");
});


require("./runserver.js")(connection, server);