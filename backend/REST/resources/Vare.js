let util = require('../util');

module.exports = function(connection, server) {
  // Legg til en ny vare
  server.post('rest/vare/', function (req, res, next) {
    connection.connection.query('INSERT INTO Vare VALUE ?', req.body, function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(rows);
      return next();
    });
  });

  // Hent en vare
  server.get('rest/vare/:vare_id', function (req, res, next) {
    connection.connection.query('SELECT * FROM Vare WHERE vare_id=?', req.params.vare_id, function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(rows);
      return next();
    });
  });

  // Hent varer til en liste
  server.get('rest/varer/:handleliste_id', function (req, res, next) {
    connection.connection.query('SELECT * FROM Vare WHERE handleliste_id=?', req.params.handleliste_id, function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(rows);
      return next();
    });
  });

  // Oppdater en vare
  server.put('rest/vare/:vare_id', function (req, res, next) {
    connection.connection.query('UPDATE Vare SET ? WHERE vare_id=?', [req.body, req.params.vare_id], function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(rows);
      return next();
    });
  });

  // Slett en vare
  server.del('rest/vare/:vare_id', function (req, res, next) {
    connection.connection.query('DELETE FROM Vare WHERE vare_id=?', req.params.vare_id, function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(rows);
      return next();
    });
  });
};
