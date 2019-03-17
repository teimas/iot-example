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
