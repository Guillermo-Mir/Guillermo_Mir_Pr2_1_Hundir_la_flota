
const hundirLaFlotaJSON = 
`[{
    { "name": "Portaaviones", "size": 5 },
    { "name": "Acorazado", "size": 4 },
    { "name": "Crucero", "size": 3 },
    { "name": "Submarino", "size": 3 },
    { "name": "Destructor", "size": 2 }
}]`
let arrayBarcos = JSON.parse(hundirLaFlotaJSON);

class Tablero{
    constructor(celdas, barcos){
        this.celdas = celdas
        this.barcos = barcos

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

 
