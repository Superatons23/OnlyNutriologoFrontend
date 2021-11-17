const formLogin = document.getElementById("login");

formLogin.addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log("click en form");

  const formData = new FormData(formLogin);
  console.log(Object.fromEntries(formData));

  const response = await fetch("http://localhost:3000/api/nutriologo/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const result = await response.json();

  if (
    result == "El email no esta registrado" ||
    result == "Contraseña incorrecta"
  ) {
    const response = await fetch("http://localhost:3000/api/cliente/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    const result = await response.json();

    if (
      result == "El email no esta registrado" ||
      result == "Contraseña incorrecta"
    ) {
      const alert = document.getElementById("alertLogin");
      alert.style.display = "block";
    } else {
      localStorage.setItem("token", result.token);
      localStorage.setObject("nutriologo", result);
      window.open("/src/views/ProfilePaciente.html", "_self");
    }
  } else {
    localStorage.setItem("token", result.token);
    localStorage.setObject("nutriologo", result);

    window.open("/src/views/ProfileNutriologo.html", "_self");
  }
});
Storage.prototype.setObject = function (key, value) {
  this.setItem(key, JSON.stringify(value));
};
