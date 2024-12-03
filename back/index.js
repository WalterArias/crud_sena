// instancia de express : sirve para crear api rest
const express = require("express");
// CONFIGURACION DE .ENV
require("dotenv").config();
// activamos cors
const cors = require("cors");
// instanciamos la conexion a la bd

const app = express(); // invocamos el metodo constructor de la clase express
const puerto = process.env.PORT || 4100;

/* let permitidas = {
  origin: "http://127.0.0.1:5500"
}; */

app.use(cors());
app.use(express.json()); // serializar los request y response

app.use("/", require("./src/aprendiz.js"));

app.listen(puerto, () => {
  console.log(`Api rest encendida en el puerto ${puerto}`);
});

// PRINCIPIO DISEÑO SRP :
