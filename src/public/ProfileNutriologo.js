window.onload = function () {
  let nombre = document.getElementById("p-nombre");
  let edad = document.getElementById("p-edad");
  let correo = document.getElementById("p-correo");
  let genero = document.getElementById("p-genero");
  let username = document.getElementById("username");

  let nutriologo = localStorage.getObject("nutriologo");

  username.innerHTML = nutriologo.nombre;

  nombre.innerHTML = nutriologo.nombre;
  edad.innerHTML = nutriologo.edad;
  correo.innerHTML = nutriologo.email;
  genero.innerHTML = nutriologo.genero;
};

Storage.prototype.getObject = function (key) {
  var value = this.getItem(key);
  return value && JSON.parse(value);
};
