import React, { Component } from 'react'
import Pagination from 'react-js-pagination'
//require("bootstrap/less/bootstrap.less");

class App extends Component {
    constructor() {
        super()
        this.state = {
            title: '',
            nombre_accion: '',
            description: '',
            _id: '',
            tasks: [],
            sensores: [],
            notificaciones: [],
            accion: [],
            activePage: 1,
            acciones_mostradas: [],
            saltadas: 0,
            total_acciones: 0,
            accion_seleccionada: '',
            clase_actualizar: 'btn disabled',
        }
        this.nueva_notificacion = this.nueva_notificacion.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.seleccionar_accion = this.seleccionar_accion.bind(this)
        this.anadir_a_accion = this.anadir_a_accion.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.cambiar_pagina_sensor = this.cambiar_pagina_sensor.bind(this)
        this.devolver_acciones = this.devolver_acciones.bind(this)
        this.insertar_accion = this.insertar_accion.bind(this)
        this.myColor = this.myColor.bind(this)
        this.buscar_actualizaciones = this.buscar_actualizaciones.bind(this)

        //this.addTask = this.addTask.bind(this);
        this.insertar_accion_con_notificaciones = this.insertar_accion_con_notificaciones.bind(this)
    }
    componentDidMount() {
        this.todos_sensores();
        this.devolver_acciones();
        setInterval(this.buscar_actualizaciones, 1000);
    }
    buscar_actualizaciones() {
        console.log("Se llama a la funcion jajaja");
        if(this.state.clase_actualizar != 'btn disabled'){
            console.log("Se detecta una notificacion");
            return;
        }
        console.log("a ver si llega");
        fetch('/buscar_notificaciones')
        .then(res => res.json())
        .then(data => {
            console.log('HAY ACTUALIZACIONES::')
            console.log(data.cambio);
            var hay = data.cambio;
            if (hay) {
                console.log('Se han encontrado actualizaciones en los datos de los sensores');
                this.state.clase_actualizar = 'btn ';
            }else{
                this.state.clase_actualizar = 'btn disabled';
                
            }
            this.forceUpdate();
            
        })
        
    }

   


    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`)
        if (pageNumber > this.state.activePage) {
            this.state.saltadas = this.state.saltadas + 6
            console.log('Saltadas')
            console.log(this.state.saltadas)
        } else {
            this.state.saltadas = this.state.saltadas - 6
            console.log('Saltadas')
            console.log(this.state.saltadas)
        }
        this.setState({ activePage: pageNumber })
        this.devolver_acciones()
    }
    cambiar_pagina_sensor(indice_sensor, num_pagina) {
        console.log('ENTRA EN LA PAGINACION DE LOS SENSORES')
        console.log(this.state.sensores)
        console.log(indice_sensor)
        console.log(num_pagina)
        var sensor = this.state.sensores[indice_sensor.key]
        console.log('Sensor antes de calculos')
        console.log(sensor)
        if (num_pagina != sensor.pagina_actual) {
            var diferencia = Math.abs(Math.abs(num_pagina) - Math.abs(sensor.pagina_actual))
            if (num_pagina > sensor.pagina_actual) {
                sensor.pagina_actual = num_pagina
                sensor.elementos_saltados = sensor.elementos_saltados + diferencia * 6

                //this.state.saltadas = this.state.saltadas + 6;
                //console.log("Saltadas");
                //console.log(this.state.saltadas);
            } else {
                sensor.pagina_actual = num_pagina
                sensor.elementos_saltados = sensor.elementos_saltados - diferencia * 6
            }
            console.log('Sensor despues de calculos')
            console.log(this.state.sensores[indice_sensor.key])
            this.devolver_notificaciones_siguientes(indice_sensor.key, this.state.sensores[indice_sensor.key].elementos_saltados)
        }

        //this.setState({activePage: pageNumber});
        //this.devolver_acciones();
    }

    devolver_notificaciones_siguientes(id_sensor, saltadas) {
        fetch(`/notificaciones/${id_sensor}/${saltadas}`)
            .then(res => res.json())
            .then(data => {
                console.log('ESTO ES LO QUE TIENE LA VARIABLE DE notificaciones devuelta:')
                console.log(data.notificaciones)
                var not = this.state.notificaciones[id_sensor]
                this.setState({ not: data.notificaciones })
                this.setState({ description: 'hola' })
                this.state.notificaciones[id_sensor] = data.notificaciones
                console.log(this.state.notificaciones[id_sensor])
                this.forceUpdate()
            })
    }

    devolver_acciones() {
        fetch(`/acciones/${this.state.saltadas}`)
            .then(res => res.json())
            .then(data => {
                console.log('ESTO ES LO QUE TIENE LA VARIABLE DE acciones:')
                this.setState({ acciones_mostradas: data.acciones })
                this.setState({ total_acciones: data.total })
                console.log(this.state.acciones_mostradas)
                console.log(this.state.total_acciones)
                this.forceUpdate();
            })
    }

    todos_sensores() {
        fetch('/todos_sensores_v2')
            .then(res => res.json())
            .then(data => {
                console.log('ESTO ES LO QUE TIENE LA VARIABLE DE SENSORES:')
                if(data.status == 'Error en el login') {
                    console.log();
                    M.toast({ html: 'Error en el login', classes: 'toast' })
                } else {
                    this.setState({ sensores: data['0'] })
                    this.setState({ notificaciones: data['1'] })
                    console.log(this.state.sensores)
                    console.log(this.state.notificaciones)
                }
            })
            this.state.clase_actualizar = 'btn disabled';
            this.forceUpdate();
            M.toast({ html: 'Datos de sensores actualizados', classes: 'toast' })

    }
    handleChange(e) {
        const { name, value } = e.target
        this.setState({
            [name]: value,
        })
        console.log(this.state.nombre_accion)
    }
    anadir_a_accion(notificacion) {
        this.state.accion.push(notificacion)
        console.log('El array de notificaciones añadidas a la opcion es:')
        console.log(this.state.accion)
        this.forceUpdate()
        M.toast({ html: 'Notificación añadida a la acción', classes: 'toast' })
    }

    seleccionar_accion(id) {
        console.log('Se ha seleccionado la accion siguiente: ')
        this.setState({ accion_seleccionada: id })
        this.state.accion_seleccionada = id
        console.log(this.state.accion_seleccionada)

        M.toast({ html: 'Acción seleccionada', classes: 'toast' })
    }
    
    myColor(id) {
        if (id == this.state.accion_seleccionada) {
            return 'red'
        } else {
            return ''
        }
    }

    nueva_notificacion(nueva) {
        if (nueva == true) {
            return '#b9d1f7'
        } else {
            return ''
        }
    }

    insertar_accion_con_notificaciones(e) {
        e.preventDefault()
        console.log('Entra qui que es correcto')

        fetch('/insertar_accion_notificaciones', {
            method: 'POST',
            body: JSON.stringify({
                accion: this.state.accion_seleccionada,
                notificaciones: this.state.accion,
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ nombre_accion: '' })
                console.log('Se ha realizado la consulta perfectamente')
                console.log(data)
                M.toast({ html: 'Acción añadida', classes: 'toast' })
                this.state.accion = []
                this.state.accion_seleccionada = ''
                this.forceUpdate()
            })
    }

    insertar_accion(e) {
        e.preventDefault()
        console.log('Entra qui que es correcto')

        fetch('/insertar_accion', {
            method: 'POST',
            body: JSON.stringify({
                accion: this.state.nombre_accion,
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ nombre_accion: '' })
                console.log('Se ha realizado la consulta perfectamente')
                console.log(data)
                            
                M.toast({ html: data.status, classes: 'toast' })
                this.devolver_acciones();
                this.forceUpdate();
            })
    }

    render() {
        return (
            <div>
                <h4>Gestionar acciones</h4>
                {/* NAVIGATION */}
                <div className="row">
                    <div className="col s2">
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

                    <div className="col s5 contenedor_acciones">
                        <div className="contenedor_acciones row">
                            <h5>Seleccionar acción existente</h5>
                            {Object.keys(this.state.acciones_mostradas).map(clave => (
                                <div
                                    style={{ background: this.myColor(this.state.acciones_mostradas[clave]._id) }}
                                    key={this.state.acciones_mostradas[clave].nombre}
                                    className=" col s5 accion centrar_verticalmente"
                                    onClick={this.seleccionar_accion.bind(this, this.state.acciones_mostradas[clave]._id)}
                                >
                                    {this.state.acciones_mostradas[clave].nombre}
                                </div>
                            ))}
                        </div>
                        <div className="col s12">
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={6}
                                totalItemsCount={this.state.total_acciones}
                                pageRangeDisplayed={this.state.total_acciones / 6 + 1}
                                onChange={this.handlePageChange}
                            />
                        </div>
                    </div>

                    <div className="col s5 contenedor_acciones">
                        <div className="contenedor_acciones row">
                            <h5>Notificaciones seleccionadas</h5>
                            {Object.keys(this.state.accion).map(clave => (
                                <div key={this.state.accion[clave]._id} className=" col s11 accion">
                                    {this.state.sensores[this.state.accion[clave].sensor].nombre}
                                    &nbsp;&nbsp;<i class="tiny material-icons">today</i>
                                    {this.state.accion[clave].fecha_creada_parseada}
                                    
                                    {this.state.accion[clave].valor}
                                </div>
                            ))}
                            <button className="btn light-blue darken-4" onClick={this.insertar_accion_con_notificaciones.bind(this)}>
                                Añadir Acción
                            </button>
                        </div>
                    </div>
                </div>
                
                <h4>
                    Sensores conectados{' '}
                    <a class={this.state.clase_actualizar} onClick={this.todos_sensores.bind(this)}>
                        Actualizar datos
                    </a>
                </h4>
                <div className="">
                    <div className="row">
                        {Object.keys(this.state.notificaciones).map((key, index) => (
                            <div className=" col s4" key={key}>
                            <div className="card col s10">

                            
                                <div className="card-content ">
                                    <span className="card-title">{this.state.sensores[key].nombre}</span>
                                    <p>Aquí iria una descripcion del sensor(Más adelante se verá)</p>
                                </div>
                                <div className="card-action">
                                    <div id="row" className="contenedor_notificaciones">
                                        {Object.keys(this.state.notificaciones[key]).map(clave => (
                                            <div  style={{ background: this.nueva_notificacion(this.state.notificaciones[key][clave].nueva) }} className="accion" key={this.state.notificaciones[key][clave]._id} onClick={this.anadir_a_accion.bind(this, this.state.notificaciones[key][clave])}>
                                                <div className="col s7 centrar_verticalmente">
                                                    <i class="tiny material-icons">today</i>
                                                    {this.state.notificaciones[key][clave].fecha_creada_parseada}  
                                                    
                                                </div>
                                                <div className="col s5">Valor = {this.state.notificaciones[key][clave].valor}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col s12 paginator">
                                        <Pagination
                                            activePage={this.state.sensores[key].pagina_actual}
                                            itemsCountPerPage={6}
                                            totalItemsCount={this.state.sensores[key].num_notificaciones}
                                            pageRangeDisplayed={3}
                                            onChange={this.cambiar_pagina_sensor.bind(this, { key })}
                                        />
                                    </div>
                                </div>
                            </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

function Notificaciones(props) {
    //console.log("Eseto lo recibe la funcion.");
    //console.log(props.notificaciones);

    return (
        <div>
            soy gilipollas
            {props.notificaciones}
        </div>
    )
}

export default App
