import React, { Component } from 'react'
import Pagination from 'react-js-pagination'
//require("bootstrap/less/bootstrap.less");

class App extends Component {
    constructor() {
        super()
        this.state = {
            title: '',    
            tasks: [],           
        }
        this.buscar_actualizaciones = this.buscar_actualizaciones.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }
    componentDidMount() {
        //this.todos_sensores()
        //this.devolver_acciones()
    }
    handleChange() {
       // this.todos_sensores()
        //this.devolver_acciones()
    }
    buscar_actualizaciones() {
        console.log('Se llama a la funcion jajaja')
       
        console.log('a ver si llega')
        fetch('/buscar_notificaciones')
            .then(res => res.json())
            .then(data => {
                console.log('HAY ACTUALIZACIONES::')
                console.log(data.cambio)
                var hay = data.cambio
                if (hay) {
                    console.log('Se han encontrado actualizaciones en los datos de los sensores')
                } else {
                }
                this.forceUpdate()
            })
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
                                <form onSubmit={this.insertar_accion}>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input name="nombre_accion" onChange={this.handleChange} value={this.state.nombre_accion} type="text" placeholder="Accion Title" autoFocus />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn light-blue darken-4">
                                        Insertar a lista
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>                  
            </div>
        )
    }
}


export default App
