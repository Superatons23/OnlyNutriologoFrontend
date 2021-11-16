const formNutriologo = document.getElementById("formNutriologo");

formNutriologo.addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log("click en form");

  const formData = new FormData(formNutriologo);
  console.log(Object.fromEntries(formData));
  // console.log(JSON.stringify(Object.fromEntries(formData)));
  const response = await fetch("http://localhost:3000/api/nutriologo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const result = await response.json();

  if (result == "El email ya esta registrado") {
    const alert = document.getElementById("alertNutriologo");
    alert.style.display = "block";
  } else {
    window.open("/src/views/index.html", "_self");
  }
});
