/*conexion a la base de datos*/
// instanciar la libreria mysql

const mysql = require("mysql2"); // principio de inmutabilidad

// cadena de conexion o string de conexion

const cnx = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/* connection.query("SELECT * FROM aprendiz", (err, results) => {
  console.log(results); // results contains rows returned by server
});
 */

cnx.connect((error) => {
  if (error) {
    console.log(`Error en la conexion: \n ${error}`);
    //throw "error en la conexion a la BD.";
  } else {
    console.log("conexion exitosa a la BD!");
  }
});

module.exports = cnx;
