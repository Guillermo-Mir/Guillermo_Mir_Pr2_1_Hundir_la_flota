export class Celda {
    constructor(estadoCelda, estadoBarco, y, x, nombreBarco) {
        this.estadoCelda = estadoCelda;
        this.estadoBarco = estadoBarco;
        this.x = x;
        this.y = y;
        this.nombreBarco = nombreBarco;
    }
    
    toJSON() {
        return {
            x: this.x,
            y: this.y,
            estadoCelda: this.estadoCelda,
            nombreBarco: this.nombreBarco || "",
        };
    }
}
