// ===== Virtus.io – Simulador de Inscripción | Siguiendo con el FE anteriormente hecho =====

// Catálogo
const CURSOS = [
    { id: 1, nombre: "Intro a Web3", precioUSD: 0 }, // gratuito en principio
    { id: 2, nombre: "DeFi Essentials", precioUSD: 80 },
    { id: 3, nombre: "Smart Contracts", precioUSD: 120 },
    { id: 4, nombre: "NFTs y DAOs", precioUSD: 100 },
  ];
  const DESCUENTO_VOL = 0.1; // 10% si total de unidades >= 3
  const RECARGO_3_CUOTAS = 0.15; // 15% para 3 cuotas
  const OPCIONES_CUOTAS = [1, 3];
  
  let carrito = [];
  
  // Utilidad
  function entero(val) {
    const n = parseInt(val, 10);
    return Number.isInteger(n) ? n : NaN;
  }
  
  function listarCursos() {
    console.clear();
    console.log("=== Catálogo Virtus.io ===");
    CURSOS.forEach((c) => {
      const precio = c.precioUSD === 0 ? "GRATIS" : `USD ${c.precioUSD}`;
      console.log(`${c.id}) ${c.nombre} — ${precio}`);
    });
    console.log("==========================");
  }
  
  // 1) ENTRADA
  function seleccionarCursos() {
    let seguir = true;
    while (seguir) {
      listarCursos();
      const inId = prompt(
        "Ingresá el ID del curso (1-4)y luego Enter | Cancelar para terminar."
      );
      if (inId === null || inId.trim() === "") break;
  
      const id = entero(inId);
      const curso = CURSOS.find((c) => c.id === id);
      if (!curso) {
        alert("⚠️ ID inválido. Probá de nuevo (1-4).");
        continue;
      }
  
      const inCant = prompt(
        `Elegiste "${curso.nombre}". ¿Cuántas unidades? (Ingresa por favor un número entero ≥ 1)`
      );
      const cant = entero(inCant);
      if (!Number.isInteger(cant) || cant < 1) {
        alert("⚠️ Cantidad inválida.");
        continue;
      }
  
      carrito.push({ ...curso, cantidad: cant });
      seguir = confirm("✅ Agregado. ¿Querés sumar otro curso?");
    }
  }
  
  // 2) PROCESO
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
  
  // 3) SALIDA
  function imprimirResumen(r, cuotas) {
    console.log("=== Resumen de Inscripción ===");
    carrito.forEach((it) => {
      const p = it.precioUSD === 0 ? "GRATIS" : `USD ${it.precioUSD}`;
      console.log(`- ${it.nombre} x${it.cantidad} — ${p}`);
    });
    console.log("------------------------------");
    console.log(`Unidades: ${r.unidades}`);
    console.log(`Subtotal: USD ${r.subtotal.toFixed(2)}`);
    console.log(
      `Descuento: USD ${r.descuento.toFixed(2)} ${
        r.aplicaDesc ? "(volumen)" : "(no aplica)"
      }`
    );
    console.log(
      `Recargo cuotas: USD ${r.recargo.toFixed(2)} ${
        r.aplicaRecargo ? "(3 cuotas)" : "(1 cuota)"
      }`
    );
    console.log(`TOTAL: USD ${r.total.toFixed(2)} en ${cuotas} cuota(s)`);
    console.log(
      "Certificado: los cursos pagos otorgan certificado NFT verificable al completar."
    );
    console.log("==============================");
  
    alert(
      "✅ Inscripción simulada.\n\n" +
        `Unidades: ${r.unidades}\n` +
        `Subtotal: USD ${r.subtotal.toFixed(2)}\n` +
        `Descuento: USD ${r.descuento.toFixed(2)}\n` +
        `Recargo: USD ${r.recargo.toFixed(2)}\n` +
        `TOTAL: USD ${r.total.toFixed(2)} en ${cuotas} cuota(s)\n\n` +
        "Revisá la consola para el detalle."
    );
  }
  
  // Orquestador
  function simulador() {
    alert("👋 Bienvenidos a la Inscripción y Selección de cursos de Virtus.io.");
    seleccionarCursos();
  
    if (carrito.length === 0) {
      alert("No agregaste cursos. Fin del simulador.");
      console.warn("Carrito vacío; no hay cálculo.");
      return;
    }
  
    const inCuotas = prompt(`¿Cuotas? Opciones: ${OPCIONES_CUOTAS.join(" / ")}`);
    const cuotas = entero(inCuotas);
    const cuotasValidas = OPCIONES_CUOTAS.includes(cuotas) ? cuotas : 1;
    if (!OPCIONES_CUOTAS.includes(cuotas))
      alert("⚠️ Opción inválida. Se usará 1 cuota.");
  
    const r = calcular(carrito, cuotasValidas);
    imprimirResumen(r, cuotasValidas);
  
    if (confirm("¿Querés reiniciar y simular otra inscripción?")) {
      carrito = [];
      simulador();
    } else {
      alert("¡Gracias por probar Virtus.io! 🚀");
    }
  }
  
  // Auto inicio
  simulador();
  