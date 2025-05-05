
    async function guardarPartida(nombreJugador) {
    const partida = {
      id:     generateId(),
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
    
  