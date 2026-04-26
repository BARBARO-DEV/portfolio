const form = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");
const lista = document.getElementById("lista-turnos");

// Mostrar turnos al cargar la página
document.addEventListener("DOMContentLoaded", mostrarTurnos);

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = form.elements[0].value.trim();
  const servicio = form.elements[1].value;
  const fecha = form.elements[2].value;

  const hoy = new Date().toISOString().split("T")[0];

  // ❌ Validación campos vacíos
  if (!nombre || !servicio || !fecha) {
    mensaje.textContent = "⚠️ Completá todos los campos";
    mensaje.style.color = "#facc15";
    return;
  }

  // verificar si es fecha pasada
  if (fecha < hoy) {
    mensaje.textContent = "⛔ No podés seleccionar una fecha pasada";
    mensaje.style.color = "#ef4444";
    return;
  }

  let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

  // duplicados
  const duplicado = turnos.some(t => 
    t.fecha === fecha && t.servicio === servicio
  );

  if (duplicado) {
    mensaje.textContent = "🚫 Ya existe un turno para ese servicio en esa fecha";
    mensaje.style.color = "#ef4444";
    return;
  }

  const turno = { nombre, servicio, fecha };

  turnos.push(turno);
  localStorage.setItem("turnos", JSON.stringify(turnos));

  mensaje.textContent = "✔️ Turno reservado correctamente";
  mensaje.style.color = "#4ade80";

  form.reset();

  mostrarTurnos();
});

function mostrarTurnos() {
  const turnos = JSON.parse(localStorage.getItem("turnos")) || [];

  lista.innerHTML = "";

  turnos.forEach((turno, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${turno.nombre} - ${turno.servicio} - ${turno.fecha}
      <button onclick="eliminarTurno(${index})">❌</button>
    `;

    lista.appendChild(li);
  });
}
function eliminarTurno(index) {
  let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

  turnos.splice(index, 1);

  localStorage.setItem("turnos", JSON.stringify(turnos));

  mostrarTurnos();
}