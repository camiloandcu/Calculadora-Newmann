class UnidadDeControl {
  constructor() {
    this._memoria = new Memoria();
    this._registro = new Registro();
    this._alu = new ALU();
    this._contador = 0;
  }

  ejecutar(instruccion) {
    this._registro.escribir('Instrucciones', instruccion);
    this._contador++;
    this._alu.ejecutar(this.registro);
  }
}

class Memoria {
  constructor() {
    this._memoria = [];
  }

  leer(direccion) {
    return this._memoria[direccion];
  }

  escribir(direccion, dato) {
    this._memoria[direccion] = dato;
  }
}

class Registro {
  constructor() {
    this._registros = {};
  }

  leer(registro) {
    return this._registros[registro];
  }

  escribir(registro, dato) {
    this._registros[registro] = dato;
  }
}

class Instruccion {
  constructor(operacion, operacion1, operacion2) {
    this._operacion = operacion;
    this._operando1 = operacion1;
    this._operando2 = operacion2;
  }
}

class ALU {
    constructor() {
        this._acumulador = 0;
    }
    
    ejecutar(instruccion) {
        switch (instruccion._operacion) {
        case 'ADD':
            this._resultado = instruccion._operando1 + instruccion._operando2;
            break;
        case 'SUB':
            this._resultado = instruccion._operando1 - instruccion._operando2;
            break;
        case 'MUL':
            this._resultado = instruccion._operando1 * instruccion._operando2;
            break;
        case 'DIV':
            this._resultado = instruccion._operando1 / instruccion._operando2;
            break;
        }
    }
}