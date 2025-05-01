// Generador simple de ID si no tienes otro
function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  async function guardarPartida(nombreJugador) {
    const payload = {
      id:     generateId(),
      jugador: nombreJugador,
      tableroJugador: tableroUsuario.serialize(),
      tableroIA:      tableroIA.serialize()
    };
  
    const resp = await fetch("http://localhost:3000/partidas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  
    if (!resp.ok) {
      alert("Error guardando la partida");
      return;
    }
  
    const data = await resp.json();
    alert(`Partida guardada con ID: ${data.id}`);
  }
  
  async function cargarPartida() {
    const id = prompt("Introduce el ID de la partida:");
    if (!id) return;
  
    const resp = await fetch(`http://localhost:3000/partidas/${id}`);
    if (!resp.ok) {
      alert("Partida no encontrada");
      return;
    }
  
    const data = await resp.json();
    // Reconstruir tableros
    reconstruirTablero(tableroUsuario, data.tableroJugador);
    reconstruirTablero(tableroIA,      data.tableroIA);
  
    tableroUsuario.mostrarTablero("contenedor2");
    tableroIA.mostrarTablero("contenedor1");
  }
  
  // Dada la estructura { tamaño, casillas: [[{x,y,estadoCelda,nombreBarco},…],…] }
  function reconstruirTablero(tableroObj, serialized) {
    serialized.casillas.forEach((fila, x) => {
      fila.forEach(c => {
        tableroObj.tablero[x][c.y].estadoCelda = c.estadoCelda;
        tableroObj.tablero[x][c.y].nombreBarco  = c.nombreBarco || null;
      });
    });
  }
  