
const barcosJSON = 
`[
    { "name": "Portaaviones", "size": 5 },
    { "name": "Acorazado", "size": 4 },
    { "name": "Crucero", "size": 3 },
    { "name": "Submarino", "size": 3 },
    { "name": "Destructor", "size": 2 }
]`

let arrayBarcos = JSON.parse(barcosJSON);
console.log(arrayBarcos)

class Tablero{
    constructor(celdas){
        this.celdas = celdas
        this.barcos = arrayBarcos
        this.tablero = this.crearTableroVacio()
        this.colocarBarcos()
    }

    colocarBarcos(){
      for (let barco of this.barcos) {
          let colocado = false;

          while (!colocado) {
              let x = Math.floor(Math.random() * 10);
              let y = Math.floor(Math.random() * 10);
              let direccion = Math.random() < 0.5 ? 'H' : 'V';

              if (this.verificarEspacio(x, y, barco.size, direccion)) {
                  this.ubicarBarco(x, y, barco.size, direccion, barco.name);
                  colocado = true;
              }
          }
      }
    }
    verificarEspacio(x, y, size, direccion) {
        if (direccion === 'H') {
            if (y + size > 10) return false;
            for (let i = 0; i < size; i++) {
                if (this.tablero[x][y + i].estadoCelda !== 'agua') return false;
            }
        } else {
            if (x + size > 10) return false;
            for (let i = 0; i < size; i++) {
                if (this.tablero[x + i][y].estadoCelda !== 'agua') return false;
            }
        }
        return true;
    }

    ubicarBarco(x, y, size, direccion, nombre) {
        for (let i = 0; i < size; i++) {
            if (direccion === 'H') {
                this.tablero[x][y + i].estadoCelda = 'barco';
                this.tablero[x][y + i].nombreBarco = nombre;
            } else {
                this.tablero[x + i][y].estadoCelda = 'barco';
                this.tablero[x + i][y].nombreBarco = nombre;
            }
        }
    }

      crearTableroVacio() {
        let tableroVacio = [];
        for (let x = 0; x < 10; x++) {
          let fila = [];
          for (let y = 0; y < 10; y++) {
            fila.push(new Celda('agua', false, x, y, null));
          }
          tableroVacio.push(fila);
        }
        return tableroVacio;
      }
                
}
 

class Barco{
    constructor(nombre, tamanyo, posicion){
        this.nombre = nombre
        this.tamanyo = tamanyo
        this.posicion = posicion
        this.tocado = 0
        this.hundidio = false
    }
}

class Celda{
    constructor(estadoCelda, estadoBarco, x, y, nombreBarco){
        this.estadoCelda = estadoCelda
        this.estadoBarco = estadoBarco
        this.x = x
        this.y = y
        this.nombreBarco = nombreBarco
    }

}
 /*
    function cambiarEstilosGeneral(Celda, Tablero){
        Celda.style.color = 'blue'
        Celda.style.backgroundColor = '##64B6D6'
        Celda.style.height = '50px'
        Celda.style.width = '50px'
        Celda.style.fontSize = '45px'
        Celda.style.textAlign = 'center'
        Celda.style.margin = '3px'
        Tablero.style.display = 'grid'
        Tablero.style.gridTemplateColumns = 'auto auto auto auto auto auto auto'
        Tablero.style.grid = '3'
        Tablero.style.width = '100px'
    }


*/

  const juego = new Tablero();
  console.log(juego.tablero); 
