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