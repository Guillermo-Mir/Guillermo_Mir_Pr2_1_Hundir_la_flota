
const hundirLaFlotaJSON = 
`[{
    { "name": "Portaaviones", "size": 5 },
    { "name": "Acorazado", "size": 4 },
    { "name": "Crucero", "size": 3 },
    { "name": "Submarino", "size": 3 },
    { "name": "Destructor", "size": 2 }
}]`
//let arrayBarcos = JSON.parse(hundirLaFlotaJSON);


class Tablero{
    constructor(celdas, barcos){
        this.celdas = celdas
        this.barcos = barcos

    }

    crearTableroVacio() {
        let tablero = []
        for (let i = 0; i < 10; i++) {
          let nuevaFila = new Array(10)
          nuevaFila.fill(this.celdas)
          tablero.push(nuevaFila)
        }
        return tablero
      }
      
      
}



class Barco{
    constructor(nombre, tamanyo, posicion, tocadas){
        this.nombre = nombre
        this.tamanyo = tamanyo
        this.posicion = posicion
        this.tocadas = tocadas
        this.hundidio = false
    }
}

class Celda{
    constructor(estadoTablero, estadoBarco,nombreBarco){
        this.estadoTablero = estadoTablero //array de celdas
        this.estadoBarco = estadoBarco //array de barcos
        this.nombreBarco = nombreBarco

    }

}
 
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




