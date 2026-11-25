protegerPagina("ADMIN");

const resumen = document.getElementById("resumen");
const mensaje = document.getElementById("mensaje");

const formatearPesos = (n) => "$" + Number(n).toLocaleString("es-AR");

// ---------- CÁLCULOS ----------
// Una entrada "ocupa" lugar mientras el ticket no esté cancelado
const ocupaCupos = (ticket) => ticket.estado !== "Cancelado";

// Por cada evento: entradas vendidas, cupos libres y % de ocupación
const calcularOcupacion = (eventos, tickets) =>
  eventos.map((evento) => {
    const vendidas = tickets
      .filter((t) => String(t.eventId) === String(evento.id) && ocupaCupos(t))
      .reduce((suma, t) => suma + t.cantidad, 0);

    const capacidad = vendidas + evento.cuposDisponibles;
    const porcentaje = capacidad > 0 ? Math.round((vendidas / capacidad) * 100) : 0;

    return {
      titulo: evento.titulo,
      vendidas,
      disponibles: evento.cuposDisponibles,
      capacidad,
      porcentaje,
    };
  });

// Cantidad de entradas por estado
const contarPorEstado = (tickets) => {
  const conteo = { Confirmado: 0, Utilizado: 0, Cancelado: 0 };
  tickets.forEach((t) => {
    if (conteo[t.estado] !== undefined) conteo[t.estado] += t.cantidad;
  });
  return conteo;
};

// ---------- TARJETAS ----------
const crearTarjeta = (titulo, valor) => `
  <div class="col">
    <div class="card text-center h-100">
      <div class="card-body">
        <p class="text-muted mb-1">${titulo}</p>
        <p class="fs-3 fw-bold mb-0">${valor}</p>
      </div>
    </div>
  </div>`;

const renderResumen = (ocupacion, tickets) => {
  const totalVendidas = ocupacion.reduce((s, o) => s + o.vendidas, 0);
  const totalCapacidad = ocupacion.reduce((s, o) => s + o.capacidad, 0);
  const ocupacionGlobal = totalCapacidad > 0 ? Math.round((totalVendidas / totalCapacidad) * 100) : 0;
  const ingresos = tickets.filter(ocupaCupos).reduce((s, t) => s + Number(t.total), 0);

  resumen.innerHTML =
    crearTarjeta("Eventos", ocupacion.length) +
    crearTarjeta("Entradas vendidas", totalVendidas) +
    crearTarjeta("Ingresos", formatearPesos(ingresos)) +
    crearTarjeta("Ocupación global", ocupacionGlobal + "%");
};

// ---------- GRÁFICOS ----------
const dibujarGraficoOcupacion = (ocupacion) => {
  new Chart(document.getElementById("grafico-ocupacion"), {
    type: "bar",
    data: {
      labels: ocupacion.map((o) => o.titulo),
      datasets: [
        {
          label: "Vendidas",
          data: ocupacion.map((o) => o.vendidas),
          backgroundColor: "#0d6efd",
        },
        {
          label: "Disponibles",
          data: ocupacion.map((o) => o.disponibles),
          backgroundColor: "#dee2e6",
        },
      ],
    },
    options: {
      indexAxis: "y", // barras horizontales: se leen mejor los títulos largos
      scales: {
        x: { stacked: true, title: { display: true, text: "Entradas" } },
        y: { stacked: true },
      },
      plugins: {
        tooltip: {
          callbacks: {
            // Al pasar el mouse mostramos también el porcentaje de ocupación
            afterBody: (items) => `Ocupación: ${ocupacion[items[0].dataIndex].porcentaje}%`,
          },
        },
      },
    },
  });
};

const dibujarGraficoEstados = (conteo) => {
  new Chart(document.getElementById("grafico-estados"), {
    type: "doughnut",
    data: {
      labels: Object.keys(conteo),
      datasets: [
        {
          data: Object.values(conteo),
          backgroundColor: ["#198754", "#6c757d", "#dc3545"],
        },
      ],
    },
    options: {
      plugins: { legend: { position: "bottom" } },
    },
  });
};

// ---------- INICIO ----------
const iniciar = async () => {
  try {
    const [eventos, tickets] = await Promise.all([getEventos(), getTickets()]);

    const ocupacion = calcularOcupacion(eventos, tickets);
    renderResumen(ocupacion, tickets);
    dibujarGraficoOcupacion(ocupacion);
    dibujarGraficoEstados(contarPorEstado(tickets));
  } catch (error) {
    mensaje.className = "text-danger";
    mensaje.textContent = "No se pudo cargar el dashboard: " + error.message;
  }
};

iniciar();