window.onload = function () {
  let username = document.getElementById("username");
  let dietaForm = document.getElementById("dietaForm");
  let addButton = document.getElementById("addButton");
  let clienteDropdown = document.getElementById("cliente-dropdown");
  $("#editDietaForm").on("hidden.bs.modal", function () {
    document.getElementById("comidas-table-body").innerHTML = "";
  });

  let nutriologo = localStorage.getObject("nutriologo");

  username.innerHTML = nutriologo.nombre;

  let table = document.getElementById("dietas-table-body");

  let clientList = [];
  nutriologo.clientes.forEach((cliente) => {
    fetch(`http://localhost:3000/api/cliente/${cliente}`)
      .then((res) => res.json())
      .then((cliente) => {
        clientList.push(cliente);
        cliente.dietas.forEach((dieta) => {
          fetch(`http://localhost:3000/api/dieta/${dieta}`)
            .then((res) => res.json())
            .then((dieta) => {
              table.appendChild(crearElemento(cliente, dieta));
            });
        });
      });
  });

  addButton.addEventListener("click", () => {
    populateClientDropdown(clientList);
  });

  const populateClientDropdown = (clients) => {
    let clientDropdown = document.getElementById("cliente-dropdown");
    clients.forEach((client) => {
      let option = document.createElement("option");
      option.value = client._id;
      option.innerHTML = client.nombre;
      clientDropdown.appendChild(option);
    });
  };

  dietaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let caloriasDiarias = document.getElementById("numCalorias").value;
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;

    let cliente = document.getElementById("cliente-dropdown").value;

    dieta = {
      caloriasDia: caloriasDiarias,
      inicioFecha: fechaInicio,
      finFecha: fechaFin,
    };
    fetch("http://localhost:3000/api/dieta", {
      method: "POST",
      body: JSON.stringify(dieta),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((dieta) => {
        console.log(dieta);
        fetch(`http://localhost:3000/api/nutriologo/dieta/`, {
          method: "POST",
          body: JSON.stringify({
            idNutriologo: nutriologo._id,
            idDieta: dieta._id,
            idCliente: cliente,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((nutriologo) => {
            // window.location.reload();
          });
      });
  });
};
const handleVer = (id, clienteNombre, clienteId) => {
  fetch(`http://localhost:3000/api/dieta/${id}`)
    .then((res) => res.json())
    .then((dieta) => {
      document.getElementById("numCalorias1").value = dieta.caloriasDia;
      document.getElementById("fechaInicio1").valueAsDate = new Date(
        dieta.inicioFecha
      );
      document.getElementById("fechaFin1").valueAsDate = new Date(
        dieta.finFecha
      );
      let clientDropdown = document.getElementById("cliente-dropdown1");
      let option = document.createElement("option");
      option.value = clienteId;
      option.innerHTML = clienteNombre;
      clientDropdown.appendChild(option);

      document
        .getElementById("addButtonComida")
        .addEventListener("click", () => {
          document
            .getElementById("btnGuardarComida")
            .addEventListener("click", () => {
              let comida = {
                nombre: document.getElementById("nombreComida").value,
                descripcion: document.getElementById("descripcionComida").value,
                dia: document.getElementById("dia-dropdown").value,
                tipoComida: document.getElementById("tipoComida").value,
                evidencia: "url",
              };
              fetch("http://localhost:3000/api/comida", {
                method: "POST",
                body: JSON.stringify(comida),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((res) => res.json())
                .then((comida) => {
                  fetch(`http://localhost:3000/api/dieta/comida`, {
                    method: "POST",
                    body: JSON.stringify({
                      idDieta: id,
                      idComida: comida._id,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then((res) => res.json())
                    .then((dieta) => {
                      window.location.reload();
                    });
                });
            });
        });
    });

  fetch(`http://localhost:3000/api/dieta/${id}`)
    .then((res) => res.json())
    .then((dieta) => {
      console.log(dieta);
      dieta.comidas.forEach((comida) => {
        fetch(`http://localhost:3000/api/comida/${comida}`)
          .then((res) => res.json())
          .then((comida) => {
            document
              .getElementById("comidas-table-body")
              .appendChild(crearComidaElemento(comida));
          });
      });
    });
};
const crearElemento = (cliente, dieta) => {
  let elem = document.createElement("tr");
  elem.id = dieta._id;
  elem.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${formatDate(dieta.inicioFecha)}</td>
                <td>${formatDate(dieta.finFecha)}</td>
                <td>${dieta.caloriasDia}</td>
                <td>
                  <button type="button"
                class="btn btn-primary"
                onClick="handleVer('${dieta._id}','${cliente.nombre}','${
    cliente._id
  }')"
                data-toggle="modal" data-target="#editDietaForm"
                name='btn-ver'
                data-arg1='${dieta._id}'>Editar</button>
                <button type="button"
                class="btn btn-danger"
                onClick="handleEliminar();"
                name='btn-eliminar'
                data-arg1='${dieta._id}'>Eliminar</button>
                </td>
        `;
  return elem;
};

const crearComidaElemento = (comida) => {
  let elem = document.createElement("tr");
  elem.innerHTML = `
                <td>${comida.dia}</td>
                <td>${comida.nombre}</td>
                <td>${comida.tipoComida}</td>
                <td>
                <button type="button"
                class="btn btn-primary"
                onClick="handleComida();"
                data-toggle="modal" data-target="#editComidaForm"
                name='btn-comida'
                >Editar</button>
                </td>
        `;
  return elem;
};

Storage.prototype.getObject = function (key) {
  var value = this.getItem(key);
  return value && JSON.parse(value);
};

const formatDate = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let fecha = new Date(date);
  return fecha.toLocaleDateString("es-ES", options);
};

const formatDate2 = (date) => {
  let fecha = new Date(date);
  let dia = fecha.getDate();
  let mes = fecha.getMonth() + 1;
  let anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
};
