// ===== Virtus.io – Proyecto Final: Simulador de Inscripción =====
// DOM + Eventos + Storage + Fetch(JSON) + SweetAlert2 + Toastify

// --------- Configuración general ---------
const DESCUENTO_VOL = 0.1;        // 10% si unidades >= 3
const RECARGO_3_CUOTAS = 0.15;    // 15% en 3 cuotas
const OPCIONES_CUOTAS = [1, 3];
const STORAGE_KEY = "virtus_simulador_v2";
const DATA_URL = "data/cursos.json";

// Catálogo (se cargará desde JSON)
let CURSOS = [];

// Estado
let carrito = []; // [{ id, nombre, precioUSD, cantidad }]
let cuotasSeleccionadas = 1;

// --------- Utilidades ---------
const entero = (v) => {
  const n = parseInt(v, 10);
  return Number.isInteger(n) ? n : NaN;
};

const getCurso = (id) => CURSOS.find((c) => c.id === id);

function showToast(message, type = "info") {
  if (typeof Toastify === "undefined") return;
  const colors = {
    success: "#16a34a",
    info: "#0ea5e9",
    error: "#dc2626",
    warning: "#f97316",
  };

  Toastify({
    text: message,
    duration: 2000,
    gravity: "top",
    position: "right",
    close: true,
    style: {
      background: colors[type] || colors.info,
      borderRadius: "999px",
      fontSize: "0.9rem",
    },
  }).showToast();
}

// --------- Storage ---------
function saveState() {
  const state = { carrito, cuotas: cuotasSeleccionadas };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { carrito: [], cuotas: 1 };
  try {
    const parsed = JSON.parse(raw);
    return {
      carrito: Array.isArray(parsed?.carrito) ? parsed.carrito : [],
      cuotas: OPCIONES_CUOTAS.includes(parsed?.cuotas) ? parsed.cuotas : 1,
    };
  } catch {
    return { carrito: [], cuotas: 1 };
  }
}

// --------- Lógica de negocio - Cálculos ---------
function calcular(carrito, cuotasSel) {
  let subtotal = 0;
  for (const item of carrito) subtotal += item.precioUSD * item.cantidad;

  const unidades = carrito.reduce((a, it) => a + it.cantidad, 0);
  const aplicaDesc = unidades >= 3;
  const descuento = aplicaDesc ? subtotal * DESCUENTO_VOL : 0;

  const base = subtotal - descuento;
  const aplicaRecargo = cuotasSel === 3;
  const recargo = aplicaRecargo ? base * RECARGO_3_CUOTAS : 0;

  const total = base + recargo;
  return {
    subtotal,
    descuento,
    recargo,
    total,
    unidades,
    aplicaDesc,
    aplicaRecargo,
  };
}

// --------- DOM refs ---------
const elCatalogo = document.getElementById("catalogo");
const elTbody = document.getElementById("tbody-carrito");
const elSubtotal = document.getElementById("subtotal");
const elDescuento = document.getElementById("descuento");
const elRecargo = document.getElementById("recargo");
const elTotal = document.getElementById("total");
const formAgregar = document.getElementById("form-agregar");
const inputId = document.getElementById("input-id");
const inputCant = document.getElementById("input-cant");
const msgForm = document.getElementById("msg-form");
const btnVaciar = document.getElementById("btn-vaciar");
const btnGuardar = document.getElementById("btn-guardar");
const btnCargar = document.getElementById("btn-cargar");
const resumen = document.getElementById("resumen");

// --------- Carga de catálogo (JSON + fetch) ---------
async function cargarCursos() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Formato de datos inválido");
    CURSOS = data;
  } catch (error) {
    if (window.Swal) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar el catálogo",
        text: "No se pudo cargar la lista de cursos. Reintenta más tarde.",
      });
    }
  }
}

// --------- Render catálogo ---------
function renderCatalogo() {
  elCatalogo.innerHTML = "";
  if (!CURSOS.length) {
    elCatalogo.innerHTML =
      '<p class="msg">No se pudo cargar el catálogo de cursos.</p>';
    return;
  }

  CURSOS.forEach((c) => {
    const card = document.createElement("div");
    card.className = "card producto";
    const precio = c.precioUSD === 0 ? "GRATIS" : `USD ${c.precioUSD}`;
    card.innerHTML = `
      <div>
        <strong>${c.nombre}</strong><br/>
        <span class="precio">${precio}</span> · <small>ID: ${c.id}</small>
      </div>
      <button data-id="${c.id}" class="btn-add">Agregar</button>
    `;
    elCatalogo.appendChild(card);
  });
}

// --------- Render carrito + totales + resumen ---------
function render() {
  // Carrito (tabla)
  elTbody.innerHTML = "";
  carrito.forEach((item) => {
    const tr = document.createElement("tr");
    const p = item.precioUSD === 0 ? "GRATIS" : `USD ${item.precioUSD}`;
    const sub = item.precioUSD * item.cantidad;

    tr.innerHTML = `
      <td>${item.nombre}</td>
      <td>${p}</td>
      <td>
        <input type="number" min="1" value="${item.cantidad}" class="inp-cant" data-id="${item.id}" />
      </td>
      <td>${item.precioUSD === 0 ? "USD 0" : `USD ${sub}`}</td>
      <td><button class="btn-del" data-id="${item.id}">✕</button></td>
    `;
    elTbody.appendChild(tr);
  });

  // Totales
  const r = calcular(carrito, cuotasSeleccionadas);
  elSubtotal.textContent = `USD ${r.subtotal.toFixed(2)}`;
  elDescuento.textContent = `USD ${r.descuento.toFixed(2)}`;
  elRecargo.textContent = `USD ${r.recargo.toFixed(2)}`;
  elTotal.textContent = `USD ${r.total.toFixed(2)}`;

  // Resumen textual
  const lines = carrito.map((it) => `• ${it.nombre} x${it.cantidad}`);
  resumen.innerHTML = `
    <h3>Resumen</h3>
    <p>${lines.length ? lines.join("<br/>") : "No hay cursos en el carrito."}</p>
    <p><strong>Unidades:</strong> ${r.unidades} · <strong>Cuotas:</strong> ${cuotasSeleccionadas}</p>
    <p><em>${r.aplicaDesc ? "Aplica descuento por volumen (≥3)." : "No aplica descuento por volumen."}
    ${r.aplicaRecargo ? " · Aplica recargo por 3 cuotas." : ""}</em></p>
  `;
}

// --------- Mutadores ---------
function agregarAlCarrito(curso, cantidad = 1) {
  const ex = carrito.find((i) => i.id === curso.id);
  if (ex) ex.cantidad += cantidad;
  else carrito.push({ ...curso, cantidad });
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter((i) => i.id !== id);
}

function actualizarCantidad(id, cantidad) {
  const it = carrito.find((i) => i.id === id);
  if (it) it.cantidad = Math.max(1, cantidad);
}

// --------- Eventos — catálogo (delegación) ---------
elCatalogo.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-add");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const curso = getCurso(id);
  if (!curso) return;
  agregarAlCarrito(curso, 1);
  render();
  showToast(`Agregado: ${curso.nombre}`, "success");
});

// --------- Eventos — tabla carrito ---------
elTbody.addEventListener("input", (e) => {
  const inp = e.target.closest(".inp-cant");
  if (!inp) return;
  const id = Number(inp.dataset.id);
  const cant = Number(inp.value);
  actualizarCantidad(id, cant);
  render();
});

elTbody.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-del");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  eliminarDelCarrito(id);
  render();
  showToast("Curso eliminado del carrito", "info");
});

// --------- Agregar por formulario ---------
formAgregar.addEventListener("submit", (e) => {
  e.preventDefault();
  msgForm.textContent = "";

  const id = entero(inputId.value);
  const cant = entero(inputCant.value);

  if (!Number.isInteger(id) || id <= 0) {
    msgForm.textContent = "Ingresá un ID válido.";
    return;
  }
  if (!Number.isInteger(cant) || cant <= 0) {
    msgForm.textContent = "Ingresá una cantidad válida.";
    return;
  }
  const curso = getCurso(id);
  if (!curso) {
    msgForm.textContent = `No existe curso con ID ${id}.`;
    return;
  }

  agregarAlCarrito(curso, cant);
  formAgregar.reset();
  inputCant.value = 1;
  render();
  showToast(`Agregado: ${curso.nombre} x${cant}`, "success");
});

// --------- Cuotas (radio buttons) ---------
document.querySelectorAll('input[name="cuotas"]').forEach((rb) => {
  rb.addEventListener("change", () => {
    const v = entero(rb.value);
    if (OPCIONES_CUOTAS.includes(v)) {
      cuotasSeleccionadas = v;
      render();
    }
  });
});

// --------- Acciones ---------
btnVaciar.addEventListener("click", () => {
  if (window.Swal) {
    Swal.fire({
      title: "¿Vaciar carrito?",
      text: "Se eliminarán todos los cursos seleccionados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = [];
        render();
        showToast("Carrito vacío", "info");
      }
    });
  } else {
    carrito = [];
    render();
  }
});

btnGuardar.addEventListener("click", () => {
  saveState();
  btnGuardar.disabled = true;
  showToast("Estado guardado en tu navegador", "success");
  setTimeout(() => (btnGuardar.disabled = false), 600);
});

btnCargar.addEventListener("click", () => {
  const state = loadState();
  if (!state.carrito.length) {
    showToast("No hay datos guardados para cargar", "warning");
    return;
  }
  carrito = state.carrito;
  cuotasSeleccionadas = state.cuotas;
  // setear radios visualmente
  document.querySelectorAll('input[name="cuotas"]').forEach((rb) => {
    rb.checked = Number(rb.value) === cuotasSeleccionadas;
  });
  render();
  showToast("Carrito cargado desde tu navegador", "info");
});

// --------- Init ---------
async function init() {
  await cargarCursos();
  renderCatalogo();

  const state = loadState();
  carrito = state.carrito;
  cuotasSeleccionadas = state.cuotas;

  document.querySelectorAll('input[name="cuotas"]').forEach((rb) => {
    rb.checked = Number(rb.value) === cuotasSeleccionadas;
  });

  render();
}

init();
