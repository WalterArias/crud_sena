// interacciones con la tabla aprendiz
let contenido = document.querySelector("#contenido");

let nombre = document.querySelector("#nombre");
let apellido = document.querySelector("#apellido");
let email = document.querySelector("#email");
let password = document.querySelector("#password");
// llamamos el metodo de creacion modal de bootstrap
const frmCrearAprendiz = new bootstrap.Modal(
  document.getElementById("frmCrearAprendiz")
);
let frmAprendiz = document.querySelector("#frmAprendiz");
let btnNuevo = document.querySelector("#btnNuevo");
let api = "http://localhost:4100/api/aprendiz/";

let accion = "";

/*
funcion necesaria para capturar el evento click por cada 
fila de una tabla 
y obtener el id
element : elemento html
event : evento que desencadena (el evento en si mismo)
selector : id o clase del elemento
handler : manejor del evento (click, onclick)
*/
const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};
//boton nuevo
btnNuevo.addEventListener("click", () => {
  //blanqueamos los inputs
  frmCrearAprendiz.show();
  accion = "crear";
});

function listartodos() {
  fetch(api + "listartodos" + "?pagina=2" + "&&limite=10")
    .then((res) => res.json())
    .then((res) => {
      res.aprendiz.forEach((aprendiz) => {
        let fila = `<tr> 
          <td>${aprendiz.id}</td> 
          <td>${aprendiz.nombre}</td> 
          <td>${aprendiz.apellido}</td>
          <td>${aprendiz.email}</td> 
          <td> <button class="btnBorrar btn btn-danger"><i class="bi bi-trash"></i></button></td> 
          <td> <button class="btnEditar btn btn-secondary" ><i class="bi bi-pencil-square"></i></button></td>
        </tr>`;
        contenido.innerHTML += fila;
      });
    });
}
// envia datos por el formulario, el request lleva una payload que es la data de los formularios,
// metodo post
listartodos();

// METODO
frmAprendiz.addEventListener("submit", (e) => {
  // previene el evento por defecto de los formularios que hace submit automatico
  // evitamos enviar espacios vacios y controlamos el envio desde el boton enviar
  e.preventDefault();
  // ACCION CREAR NUEVO
  if (accion === "crear") {
    fetch(api + "crear", {
      method: "POST",
      // configuramos que la cabecera, header de peticion lleve una configuracion: contiene un archivo json
      headers: {
        "Content-Type": "application/json",
      },
      //carga o payload del request o peticion, serializar un objeto JS  a JSON
      body: JSON.stringify({
        nombre: nombre.value,
        apellido: apellido.value,
        email: email.value,
        password: password.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.status, res.respuesta);
        //alert("exito");
        location.reload();
      });
  }
  //fin de crear

  //ACCION EDITAR UN REGISTRO
  if (accion === "editar") {
    fetch(api + "editarporid/" + idform, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      //carga o payload del request o peticion, serializar un objeto JS  a JSON
      body: JSON.stringify({
        nombre: nombre.value,
        apellido: apellido.value,
        email: email.value,
        password: password.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.status, res.respuesta);
        alert("exito");
        location.reload();
      });
  }

  frmCrearAprendiz.hide();
});

//METODO BORRAR
on(document, "click", ".btnBorrar", (e) => {
  //console.log("click en mi !");
  let fila = e.target.parentNode.parentNode.parentNode;
  let idform = fila.firstElementChild.innerText;
  let respuesta = window.confirm(
    `Seguro que desea borrar el registro con id: ${idform}`
  );
  //console.log(respuesta);

  if (respuesta) {
    fetch(api + "borrarporid/" + idform, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        location.reload();
      });
  }
});

let idform = 0;
//METODO EDITAR
on(document, "click", ".btnEditar", (e) => {
  //console.log("click en mi !");
  let fila = e.target.parentNode.parentNode.parentNode;
  idform = fila.firstElementChild.innerText;

  //valores del formulario
  const nombreFrm = fila.children[1].innerText;
  const apellidosFrm = fila.children[2].innerHTML;
  const emailFrm = fila.children[3].innerHTML;
  nombre.value = nombreFrm;
  apellido.value = apellidosFrm;
  email.value = emailFrm;
  accion = "editar";
  frmCrearAprendiz.show();
});
