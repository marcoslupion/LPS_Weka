import React, { Component } from 'react'
import Pagination from 'react-js-pagination'
//require("bootstrap/less/bootstrap.less");

class App extends Component {
    constructor() {
        super()
        this.state = {
            sep_long: '',
            sep_anch: '',
            pet_long: '',
            pet_anch: '',
            clase: '',
            historial: [],
        }
        this.handleChange = this.handleChange.bind(this)
        this.insertar_datos_weka = this.insertar_datos_weka.bind(this)
        this.obtener_historial = this.obtener_historial.bind(this)
    }
    componentDidMount() {
        this.obtener_historial()
    }
    handleChange(e) {
        const { name, value } = e.target
        this.setState({
            [name]: value,
        })
        //console.log(this.state.name);
    }
    obtener_historial() {
        fetch('/historial')
        .then(res => res.json())
        .then(data => {
            this.state.historial = data.historial;
            console.log("Historial recibido");      

            this.forceUpdate()
        })
    }
    insertar_datos_weka(e) {
        e.preventDefault()
        console.log('a ver si llega')
        if (this.state.sep_long != '' && this.state.sep_anch != '' && this.state.pet_long != '' && this.state.pet_anch != '' && this.state.pet_anch != '') {
            //habria que comprobar que son numeros solamente
            var sep_long = parseFloat(sep_long)
            var sep_anch = parseFloat(sep_anch)
            var pet_long = parseFloat(pet_long)
            var pet_anch = parseFloat(pet_anch)

            fetch('/insertar_weka', {
                method: 'POST',
                body: JSON.stringify({
                    sep_long: parseFloat(this.state.sep_long),
                    sep_anch: parseFloat(this.state.sep_anch),
                    pet_long: parseFloat(this.state.pet_long),
                    pet_anch: parseFloat(this.state.pet_anch),
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then(res => res.json())
                .then(data => {
                    console.log('Entra en la funcion de la ruta')
                    console.log(data.clase)
                    this.state.clase = data.clase
                    this.obtener_historial();
                    this.forceUpdate()
                    M.toast({ html: 'Se ha obtenido la clase : ' + data.clase, classes: 'toast' })
                })
        } else {
            alert('Debes introducir numeros ya sean decimales o enteros')
        }
    }

    devolver_notificaciones_siguientes(id_sensor, saltadas) {
        fetch(`/notificaciones/${id_sensor}/${saltadas}`)
            .then(res => res.json())
            .then(data => {
                console.log('ESTO ES LO QUE TIENE LA VARIABLE DE notificaciones devuelta:')
                console.log(data.notificaciones)
                //this.setState({ not: data.notificaciones })

                this.forceUpdate()
            })
    }

    render() {
        return (
            <div>
                <h4>Clasificar</h4>
                {/* NAVIGATION */}
                <div className="col s12">
                    <div className="card paginator">
                        <h5>Insertar acción</h5>
                        <div className="card-content">
                            <form onSubmit={this.insertar_datos_weka}>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input name="sep_long" onChange={this.handleChange} value={this.state.sep_long} type="number" placeholder="Introduce la longitud del sepalo" autoFocus />
                                    </div>
                                    <div className="input-field col s12">
                                        <input name="sep_anch" onChange={this.handleChange} value={this.state.sep_anch} type="number" placeholder="Introduce la anchura del sepalo" autoFocus />
                                    </div>
                                    <div className="input-field col s12">
                                        <input name="pet_long" onChange={this.handleChange} value={this.state.pet_long} type="number" placeholder="Introduce la longitud del petalo" autoFocus />
                                    </div>
                                    <div className="input-field col s12">
                                        <input name="pet_anch" onChange={this.handleChange} value={this.state.pet_anch} type="number" placeholder="Introduce la anchura del petalo" autoFocus />
                                    </div>
                                </div>
                                <button type="submit" className="btn light-blue darken-4">
                                    Insertar a lista
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col s12">
                    <h4>Clase de la instancia introducida</h4>
                    <h6>{this.state.clase}</h6>
                </div>
                <div className="col s12">
                    <h4>Historial</h4>
                    {Object.keys(this.state.historial).map(clave => (
                        <div >{this.state.historial[clave].hora}   {this.state.historial[clave].clasificacion}</div>
                    ))}
                </div>
            </div>
        )
    }
}

export default App
