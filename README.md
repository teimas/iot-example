# Taller UDC. Ejemplo IoT.

Se enumeran a continuación todos los pasos para crear el código de la aplicación.
Es necesario tener instalado [node](https://nodejs.org/es/) y Git.

[Presentación con parte de Hardware](https://docs.google.com/presentation/d/1K1axSov3aGIXjKj72IZzQJNc23MQ0woEpP4gFWOsa-w/export/pdf?id=1K1axSov3aGIXjKj72IZzQJNc23MQ0woEpP4gFWOsa-w&pageid=g3425c6e7eb_1_29)

## Inicializamos el repositorio

```
mkdir iot-example
cd iot-example
git init
echo **/node_modules/** >> .gitignore
echo **/build/** >> .gitignore
git add .gitignore
git commit -m "First commit"
```

## Creamos la aplicación cliente

```
npm init -y
npm install create-react-app --save
./node_modules/.bin/create-react-app client --use-npm
cd client
npm install react-d3-speedometer --save
```

### Modificamos `App.js` para que contenga lo siguiente
```
import React, { Component } from 'react';
import ReactSpeedometer from "react-d3-speedometer"

class App extends Component {

  // En el constructor sólo inicializamos el estado
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: 50
    };
  }

  // Esta es la función que pide el valor presente en el servidor
  // y actualiza el estado
  tick() {
    fetch("/value").then(response => {
      response.text().then((s) => {
        var n = parseInt(s, 10);
        if (this.state.value !== n) {
          this.setState({ value: n })
        }
      });
    });
  }

  // Al inicializar el componente, configuramos la ejecución en bucle
  componentDidMount() {
    this.tick();
    this.timer = setInterval(this.tick.bind(this), 100);
  }

  // Dejamos la ejecución en bucle si se desmonta el componente
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // Esto es lo que se muestra y regenera cuando cambia el estado.
  render() {
    return (
      <ReactSpeedometer maxValue={100} minValue={0} value={this.state.value} />
    );
  }
}

export default App;
```
### Añadimos lo realizado al repositorio
```
cd ..
git add client
git add package*
git commit -m "Client added"
```
## Creamos la aplicación servidor
```
mkdir server
cd server
npm init -y
npm install express --save
npm install --save-dev nodemon
```
### Modificamos `package.json` para que contenga este código (sólo se cambia una porción)
```
  "scripts": {
    "dev": "nodemon index.js",
    "build-client": "cd ../client && npm run build && cd - && cp -R ../client/build ."
  },
```

### Creamos el fichero `index.js` para que contenga este código
```
// Cargamos librería express
const express = require('express');
const app = express();

// Iniciamos el servidor en el puerto 8000
const port = 8000;
app.listen(port, () => {
  console.log('We are live on ' + port);
});

// Se sirve la parte cliente en la carpeta build
app.use(express.static('build'));

// Configuración básica de los header para evitar problemas
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Inicializamos unos valores intermedios
var max = 55;
var min = 45;
var percentage = 0;

// Establecemos lo que devuelve /value
app.get("/value", function(req, res) {
  res.send(parseInt(percentage, 10).toString());
});

// Esta función recalibra las variables según el máximo y el mínimo
// que se va estableciendo
calibrate = (v) => {
  max = (v > max) ? v : max;
  min = (v < min) ? v : min;
  percentage = (v - min) / (max - min) * 100;
}

// Establecemos lo que hace el servidor cuando se actualiza el valor
app.get("/value/:value", function(req, res) {
  calibrate(parseInt(req.params.value, 10));
  res.sendStatus(200);
});
```

### Añadimos lo realizado al repositorio
```
cd ..
git add server
git commit -m "Server added"
```

## Ejecución
```
cd server
npm run build-client
npm run dev
```
En otra ventana...
```
ssh -R 80:localhost:8000 udc-iot@ssh.localhost.run
```
