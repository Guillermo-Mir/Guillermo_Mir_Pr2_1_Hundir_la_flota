function generarId() {
  return Math.random().toString(36).substr(2, 9);
}
    async function guardarPartida(nombreJugador) {
    const partida = {
      id:     generarId(),
      jugador: nombreJugador,
      tableroJugador: tableroUsuario.serialize(),
      tableroIA:      tableroIA.serialize()
    };
  
    const resp = await fetch("http://localhost:3000/partidas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partida)
    });
  
    if (!resp.ok) {
      alert("Error guardando la partida");
      return;
    }
  
    const data = await resp.json();
    alert(`Partida guardada con ID: ${data.id}`);

    try {
      const response = await fetch("http://localhost:3000/partidas", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(partida)
      });

      if (!response.ok) throw new Error("Error al guardar la partida");

      const data = await response.json();
      console.log("Partida guardada con éxito:", data);
      return data.id; // ID de la partida
  } catch (err) {
      console.error("Error:", err);
  }
  }
  
  async function cargarPartida(id) {
    try {
      const response = await fetch(`http://localhost:3000/partidas/${id}`);
      if (!response.ok) throw new Error("No se encontró la partida");

      const data = await response.json();
      console.log("Partida cargada:", data);
      return data;
  } catch (err) {
      console.error("Error:", err);
  }
}

// Asociar eventos a botones de guardar y cargar partida
document.getElementById("btnGuardar").addEventListener("click", () => {
  const nombre = prompt("¿Cómo te llamas?");
  if (nombre) guardarPartida(nombre);
});

document.getElementById("btnCargar").addEventListener("click", async () => { 
  const id = prompt("Introduce el ID de la partida:");
  const partida = await cargarPartida(id); // <<<<< AQUI EL CAMBIO: poner "await"

  if (partida) {
    recuperaTablerosApi(partida);
  } else {
    alert("No se pudo cargar la partida.");
  }
});

function recuperaTablerosApi(partida) {
  // 1) Restaurar lista de barcos colocados y dirección
  barcosColocados = Array.isArray(partida.barcosColocados)
      ? partida.barcosColocados
      : [];
  direccionBarco = partida.direccionBarco || 'H';

  // 2) Parsear los tableros si vienen como string
  const dataJugador = typeof partida.tableroJugador === 'string'
      ? JSON.parse(partida.tableroJugador)
      : partida.tableroJugador;
  const dataIA = typeof partida.tableroIA === 'string'
      ? JSON.parse(partida.tableroIA)
      : partida.tableroIA;

  // 3) Helper para determinar el estado real de la celda
  const getEstado = (cell) => {
      // Si en tu JSON usas "ocupada": true/false, lo convertimos a 'barco' o 'agua'
      if (cell.estadoCelda) return cell.estadoCelda;
      return cell.ocupada ? 'barco' : 'agua';
  };

  // 4) Reconstruir matriz de celdas del usuario
  if (dataJugador && Array.isArray(dataJugador.casillas)) {
      tableroUsuario.tablero = dataJugador.casillas.map(fila =>
          fila.map(celda =>
              new Celda(
                  getEstado(celda),
                  false,
                  celda.x,
                  celda.y,
                  celda.nombreBarco || ''
              )
          )
      );
  } else {
      console.error('Formato inválido de tableroJugador:', dataJugador);
  }

  // 5) Reconstruir matriz de celdas de la IA
  if (dataIA && Array.isArray(dataIA.casillas)) {
      tableroIA.tablero = dataIA.casillas.map(fila =>
          fila.map(celda =>
              new Celda(
                  getEstado(celda),
                  false,
                  celda.x,
                  celda.y,
                  celda.nombreBarco || ''
              )
          )
      );
  } else {
      console.error('Formato inválido de tableroIA:', dataIA);
  }

  // 6) Redibujar ambos tableros
  tableroUsuario.mostrarTablero('contenedor2');
  tableroIA.mostrarTablero('contenedor1');

  // 7) Mostrar formulario de disparo
  formDisparo.style.display = 'block';
}





    
  