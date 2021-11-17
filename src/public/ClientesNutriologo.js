window.onload = function () {
  let username = document.getElementById("username");

  let nutriologo = localStorage.getObject("nutriologo");

  username.innerHTML = nutriologo.nombre;

  let cardDeck = document.getElementById("card-deck");

  nutriologo.clientes.forEach((cliente) => {
    fetch(`http://localhost:3000/api/cliente/${cliente}`)
      .then((res) => res.json())
      .then((cliente) => {
        cardDeck.appendChild(crearCard(cliente));
      });
  });

  let btnBuscar = document.getElementById("btnBuscar");
  btnBuscar.addEventListener("click", function () {
    let correo = document.getElementById("correo").value;
    fetch(`http://localhost:3000/api/cliente/`)
      .then((res) => res.json())
      .then((clientes) => {
        console.log(clientes);
        clientes.forEach((cliente) => {
          if (cliente.email == correo) {
            fetch(`http://localhost:3000/api/nutriologo/cliente/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                idNutriologo: nutriologo._id,
                idCliente: cliente._id,
              }),
            })
              .then((res) => res.json())
              .then((nutriologo) => {
                updateNutriologo(nutriologo);
                window.location.reload();
              });
          }
        });
      });
  });
};

const updateNutriologo = (nutriologo) => {
  localStorage.setObject("nutriologo", nutriologo);
};

const crearCard = (cliente) => {
  let card = document.createElement("div");
  card.innerHTML = `
  <div class="card profile" style="width: 18rem;">
            <img class="card-img-top" src="../assets/avatar.png" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title " id="p-nombre">Nombre: ${cliente.nombre}</h5>
              <p class="card-text" id="p-edad">Edad: ${cliente.edad}</p>
              <p class="card-text" id="p-genero">Genero: ${cliente.genero}</p>
              <p class="card-text" id="p-peso">Peso: ${cliente.peso}</p>
              <p class="card-text" id="p-estatura">Estatura: ${cliente.estatura}</p>
              <a href="#" class="btn btn-primary btn-block">Contactar</a>
          </div>
        `;
  return card;
};

Storage.prototype.getObject = function (key) {
  var value = this.getItem(key);
  return value && JSON.parse(value);
};
Storage.prototype.setObject = function (key, value) {
  this.setItem(key, JSON.stringify(value));
};
