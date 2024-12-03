const express = require("express");
const bd = require("./bd.js");
const aprendiz = express();
const bcrypt = require("bcryptjs");

// multer, fs, path




//rutas con consulta  a la base de datos
aprendiz.get("/api/aprendiz/listartodos", (req, res) => {
  //parametros que llegan en la consulta
  // const { pagina, limite } = req.query;
  const pagina = req.query.pagina; // pagina de inicio para mostrar los registros
  const limite = parseInt(req.query.limite); //numero de registros por bloque
  const offset = (pagina - 1) * limite; //bloque de data a mostrar
  bd.query("SELECT count(*) AS total FROM aprendiz", (error, data) => {
    bd.query(
      "SELECT * FROM aprendiz  limit ? offset ?",
      [limite, offset],
      (error, data2) => {
        res.send({
          totalRegistros: data,
          aprendiz: data2,
        });
      }
    );
  });
});

// listar por id
aprendiz.get("/api/aprendiz/listarporid/:id", (req, res) => {
  // recibimos el parametro
  let id = req.params.id; // express : request  params: extrae parametro de la peticion = id

  // hacemos la consulta
  let consulta = "SELECT * FROM aprendiz where id = ? ";

  bd.query(consulta, [id], (error, aprendiz) => {
    if (error) {
      res.send({
        status: "error",
        mensaje: "ocurrio un error en la consulta !",
        error: error,
      });
    } else {
      res.send({
        status: "ok",
        mensaje: "consulta exitosa",
        aprendiz: aprendiz,
      });
    }
  });
});

//consulta por apellido

aprendiz.get("/api/aprendiz/listarporapellido/:apellido", (req, res) => {
  // recibimos el parametro
  let apellido = req.params.apellido; // express : request  params: extrae parametro de la peticion = id

  // hacemos la consulta
  let consulta = "SELECT * FROM aprendiz where apellido  = ? ";

  bd.query(consulta, [apellido], (error, aprendiz) => {
    if (error) {
      res.send({
        status: "error",
        mensaje: "ocurrio un error en la consulta !",
        error: error,
      });
    } else {
      res.send({
        status: "ok",
        mensaje: "consulta exitosa",
        aprendiz: aprendiz,
      });
    }
  });
});
// eliminar un aprendiz
aprendiz.delete("/api/aprendiz/borrarporid/:id", (req, res) => {
  // recibimos el parametro
  let id = req.params.id; // express : request  params: extrae parametro de la peticion = id

  // hacemos la consulta
  let consulta = "DELETE  FROM aprendiz where id = ? ";

  bd.query(consulta, [id], (error, aprendiz) => {
    if (error) {
      res.send({
        status: "error",
        mensaje: "ocurrio un error en la consulta !",
        error: error,
      });
    } else {
      res.send({
        status: "ok",
        mensaje: "Registro Borrado con exito !",
        aprendiz: aprendiz,
      });
    }
  });
});

// crear un aprendiz  : usa el metodo post

aprendiz.post("/api/aprendiz/crear", (req, res) => {
  // recibimos la data enviada desde el formulario
  var salt = bcrypt.genSaltSync(10);
  let frmDatos = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt),
  };
  // hacemos la consulta
  let consulta = "INSERT INTO aprendiz SET ?";
  bd.query(consulta, [frmDatos], (error, respuesta) => {
    if (error) {
      res.send({
        status: "error",
        mensaje: "ocurrio un error en la consulta !",
        error: error,
      });
    } else {
      res.send({
        status: "ok",
        mensaje: "inserción exitosa",
        respuesta: respuesta,
      });
    }
  });
});

//editar un aprendiz
aprendiz.put("/api/aprendiz/editarporid/:id", (req, res) => {
  // recibimos la data enviada desde el formulario
  let id = req.params.id;
  let frmDatos = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    password: req.body.password,
  };
  // hacemos la consulta
  let consulta = "UPDATE aprendiz SET ? WHERE id = ?";
  bd.query(consulta, [frmDatos, id], (error, aprendiz) => {
    if (error) {
      res.send({
        status: "error",
        mensaje: "ocurrio un error en la consulta !",
        error: error,
      });
    } else {
      res.send({
        status: "ok",
        mensaje: "Actualizacion exitosa !",
        aprendiz: aprendiz,
      });
    }
  });
});

// login del aprendiz
aprendiz.post("/api/aprendiz/login", (req, res) => {
  //datos de la peticion (body)
  let email = req.body.email;
  let password = req.body.password;

  //validamos que la data esté completa
  if (!email || !password) {
    res.status(400).send({
      consulta: "error",
      mensaje: "faltan datos por enviar del formulario ! ",
    });
  } else {
    let correo;
    let pass;
    let apellido;
    let nombre;
    // buscar en la bd el usuario  y validar
    bd.query(
      "SELECT nombre, apellido, email, password FROM aprendiz WHERE email like ?",
      [email],
      (error, consulta) => {
        consulta.forEach((apren) => {
          //seteamos las variables con el resultado de la consulta
          pass = apren.password;
          correo = apren.email;
          nombre = apren.nombre;
          apellido = apren.apellido;
        });
        // validacion 1: email existe
        if (correo == null) {
          res.status(400).send({
            status: "error",
            mensaje: "Usuario no existe en la BD",
          });
        } else {
          let pwd = bcrypt.compareSync(password, pass);

          if (!pwd) {
            res.status(400).send({
              status: "error",
              mensaje: "Pwd Incorrecto !",
            });
          } else {
            res.status(200).send({
              consulta: "ok",
              mensaje: "Ingreso exitoso al sistema!",
              user: nombre + " " + apellido,
              email: email,
            });
          }
        }
      }
    );
  }
});

module.exports = aprendiz;
