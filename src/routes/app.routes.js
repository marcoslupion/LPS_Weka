const express = require('express')
const router = express.Router()
const Sensor = require('../models/Sensor.js')
const Notificacion = require('../models/Notificacion.js')
const Accion = require('../models/Accion.js')
const NotificacionAccion = require('../models/NotificacionAccion.js')
const request = require('request')

router.get('/sensores_insertados', async (req, res) => {
    var json_respuesta = {}
    var json_sensores = {}
    var json_arrays = {}
    var sensores = await Sensor.find()
    for (j in sensores) {
        var sensor = sensores[j]
        var indice_sensor = sensor._id

        var notificaciones = await Notificacion.find({ sensor: indice_sensor })
            .sort({ fecha_creada: -1 })
            .limit(6)
        var num_notificaciones = await Notificacion.find({ sensor: indice_sensor }).count()
        console.log('Antes de meterse en el json')
        console.log(sensor)
        json_respuesta[sensor._id] = notificaciones
        console.log('Despues')
        console.log(json_respuesta[sensor])
        json_sensores[sensor._id] = sensor.nombre

        var json_sensor = {}
        json_sensor['nombre'] = sensor.nombre
        json_sensor['pagina_actual'] = 1
        json_sensor['elementos_saltados'] = 0
        json_sensor['num_notificaciones'] = num_notificaciones
        json_sensores[sensor._id] = json_sensor
    }

    json_arrays['0'] = json_sensores
    json_arrays['1'] = json_respuesta

    res.json(json_arrays)
    console.log('ESTO ES LO QUE DEVUELVE A LA VISTA')
    console.log(json_respuesta)
})

router.get('/notificaciones/:indice/:saltadas', async (req, res) => {
    var indice = req.params.indice
    var saltadas = req.params.saltadas
    const notificaciones = await Notificacion.find({ sensor: indice })
        .sort({ fecha_creada: -1 })
        .skip(parseInt(saltadas))
        .limit(6)
    //var total_acciones  = await Accion.find().count();

    res.json({ notificaciones: notificaciones })
})

router.get('/acciones/:saltadas', async (req, res) => {
    var pagina = req.params.saltadas
    const acciones = await Accion.find()
        .skip(parseInt(pagina))
        .limit(6)
    var total_acciones = await Accion.find().count()

    res.json({ acciones: acciones, total: total_acciones })
})

router.post('/insertar_accion_notificaciones', async (req, res) => {
    console.log('ENTRA EN EL ROUTER CORRECTO')
    console.log(req.body)
    //res.json('received');
    const { accion, notificaciones } = req.body
    const id_accion = req.body.accion
    //const data2 = {nombre:nombre_accion};
    //var accion = new Accion(data2);

    //await accion.save();

    for (elemento in notificaciones) {
        var id = notificaciones[elemento]._id

        var noA = new NotificacionAccion()
        noA.notificacion = id
        noA.accion = id_accion
        noA.fecha_creada = new Date()
        await noA.save()
    }

    res.json({ status: 'Accion guardada' })
})

router.post('/insertar_accion', async (req, res) => {
    console.log('ENTRA EN EL ROUTER CORRECTO')
    console.log(req.body)
    //res.json('received');

    const nombre = req.body.accion
    const data2 = { nombre: nombre }
    var acc = await Accion.find(data2);
    if (acc.length > 0){
        console.log("Entra porque")
        console.log(acc);
        console.log(acc.length);
        res.json({ status: 'No se puede insertar una accion existente' });
        return;
    }
    console.log("LLega despues porque no es duplicada")
    var accion = new Accion(data2)

    await accion.save()

    res.json({status: 'Accion guardada' })
})

router.get('/buscar_notificaciones', async (req, res) => {

    var options = {
        uri: 'http://192.168.0.106:8083/ZAutomation/api/v1/login',
        method: 'POST',
        json: true,
        body: { login: 'admin', password: 'contrasenia' },
    }
    await request(options, async function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Print the shortened url.
            var cookie = request.cookie('ZWAYSession=' + body.data.sid)
            var ultima_notificacion = await Notificacion.find()
                .sort({ valor_actualizacion: -1 })
                .limit(1)
            var desde = 0;
            if (ultima_notificacion.length > 0) {
                desde = ultima_notificacion[0].valor_actualizacion +1;
            }
            console.log("Desde");
            console.log(desde);
            var options2 = {
                url: 'http://192.168.0.106:8083/ZAutomation/api/v1/notifications?since=' + desde,
                method: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookie,
                },
            }
            request(options2, async function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("SE HAN BUSCADO LAS NOTIFICACIONES")
                    console.log('Se ha hecho correctamente la consulta de los dispositivos');
                    var obj = JSON.parse(body);
                    console.log('Parseado');
                    console.log(obj.data.notifications);
                    var notificaciones = obj.data.notifications;
                    var cambio = false;
                    if(notificaciones.length > 0){
                        cambio = true;
                    }
                    var json_respuesta = {}
                    json_respuesta["cambio"] = cambio;     
                    console.log("La respuesta es : ");       
                    console.log(json_respuesta);
                    res.json(json_respuesta)
                    //res.json(await Sensor.find());
                } else {
                    console.log('Error en la segunda consulta')
                    console.log(body)
                    console.log(error)
                }
            })
        } else {
            res.json({ status: 'Error en login' })
        }
    })
})
        function a(){
            return "Hola";
        }
        

        async function iniciar_sesion(){
            var cookie = 'predetermiando';
        var options = {
            uri: 'http://192.168.0.106:8083/ZAutomation/api/v1/login',
            method: 'POST',
            json: true,
            body: { login: 'admin', password: 'contrasenia' },
        }        
            await request(options, async function(error, response, body) {  
            if (!error && response.statusCode == 200) {
                console.log("Ebntra a cambiar la cookie;")
                cookie = body.data.sid;
            }
        })
        console.log("Se devuelve : ");
        console.log(cookie);
        return cookie;   
        };
   
router.get('/todos_sensores_v2', async (req, res) => {  
    console.log("Entra para buscar todos los sensores");
    
    //inicio de sesión
    var options = {
        uri: 'http://192.168.0.106:8083/ZAutomation/api/v1/login',
        method: 'POST',
        json: true,
        body: { login: 'admin', password: 'contrasenia' },
    }
    await request(options, async function(error, response, body) {
        if (!error && response.statusCode == 200) {
        }else{
            res.json({status : "Error en el login"});
            return;
    }
            //console.log(body) // Print the shortened url.
            var cookie = request.cookie('ZWAYSession=' + body.data.sid)
            var ultima_notificacion = await Notificacion.find().sort({ valor_actualizacion: -1 }).limit(1)
            var desde = 0
            if (ultima_notificacion.length > 0) {
                desde = ultima_notificacion[0].valor_actualizacion+1;
            }
            /*
            console.log("EL VALOR DESDE ES:");
            console.log(desde);
            */
            var options2 = {
                url: 'http://192.168.0.106:8083/ZAutomation/api/v1/notifications?since=' + desde,
                method: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookie,
                },
            }
             request(options2, async function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var conditions = { nueva: true } , update = { nueva: false } ,options = { multi: true };
                    await Notificacion.update(conditions, update, options);
                    /*
                    console.log('Se ha hecho correctamente la consulta de los dispositivos') 
                    */                   
                    var obj = JSON.parse(body)
                    console.log('Parseado')
                    console.log(obj.data.notifications)
                    var notificaciones = obj.data.notifications
                    for (i in obj.data.notifications) {
                        var elemento = obj.data.notifications[i]
                        var id = elemento.id
                        var timestamp = elemento.timestamp
                        var dev = elemento.message.dev
                        var level = elemento.message.l
                        //buscar el sensor a ver si está por el nombre
                        const buscar = await Sensor.find({ nombre: dev })
                        /*
                        console.log('La consulta es esta:')
                        console.log(buscar)
                        */
                        var sensor
                        if (buscar.length > 0) {
                            sensor = buscar[0]
                            console.log('ACTUALIZACION')
                        }else{
                            console.log('SE INTRODUCE UNO NUEVO')
                            const data2 = { nombre: dev }
                            sensor = new Sensor(data2)
                            sensor.save()
                        }
                                              
                        var fecha1 = new Date(timestamp)
                        console.log("Fecha sin modificar")
                        console.log(fecha1);  
                        var fecha_parseada = new Date(timestamp);
                        console.log("Fecha parseada") 
                        var dia = ""+fecha_parseada.getDate()<10 ? "0"+fecha_parseada.getDate() : fecha_parseada.getDate();
                        var mes = ""+fecha_parseada.getMonth()<10 ? ""+fecha_parseada.getMonth()+1 : fecha_parseada.getMonth()+1;
                        var año = fecha_parseada.getFullYear();
                        var hora = ""+fecha_parseada.getHours()<10 ? "0"+fecha_parseada.getHours() : fecha_parseada.getHours();
                        var minuto = ""+fecha_parseada.getMinutes()<10 ? "0"+fecha_parseada.getMinutes() : fecha_parseada.getMinutes();
                        var segundo = ""+fecha_parseada.getSeconds()<10 ? "0"+fecha_parseada.getSeconds() : fecha_parseada.getSeconds();
                        var mili =      fecha_parseada.getMilliseconds(); 
                        console.log(fecha_parseada); 
                        /*          
                        if(hora!=0){
                            console.log("Entra")
                            hora = hora-1;
                        }
                        */
                        var fecha_parseada_string = dia+"/"+mes+"/"+año+" "+hora+":"+minuto+":"+segundo+"."+mili;
                        console.log(fecha_parseada_string);
                        const data = { valor: level,fecha_creada_parseada : fecha_parseada_string, fecha_creada: fecha1, sensor: sensor, valor_actualizacion: parseInt(id),nueva:true }
                        const not = new Notificacion(data)
                        not.save();
                    }
                    var json_respuesta = {}
                    var json_sensores = {}
                    var json_arrays = {}
                    var sensores = await Sensor.find()
                    for (j in sensores) {
                        var sensor = sensores[j]
                        var indice_sensor = sensor._id
                        var notificaciones = await Notificacion.find({ sensor: indice_sensor })
                            .sort({ fecha_creada: -1 })
                            .limit(6)
                        var num_notificaciones = await Notificacion.find({ sensor: indice_sensor }).count()
                        /*
                        console.log('Antes de meterse en el json')
                        console.log(sensor)
                        */
                        json_respuesta[sensor._id] = notificaciones
                        /*
                        console.log('Despues')
                        console.log(json_respuesta[sensor])
                        */
                        json_sensores[sensor._id] = sensor.nombre
                        var json_sensor = {}
                        json_sensor['nombre'] = sensor.nombre
                        json_sensor['pagina_actual'] = 1
                        json_sensor['elementos_saltados'] = 0
                        json_sensor['num_notificaciones'] = num_notificaciones
                        json_sensores[sensor._id] = json_sensor
                    }
                    json_arrays['0'] = json_sensores
                    json_arrays['1'] = json_respuesta
                    res.json(json_arrays)
                    /*
                    console.log('ESTO ES LO QUE DEVUELVE A LA VISTA')
                    console.log(json_respuesta)
                    */
                                }else {
                                    console.log('Error en la segunda consulta')
                                    console.log(body)
                                    console.log(error)
                                }
                            })

            });            
        
    });
  
router.get('/todos_sensores', async (req, res) => {
    var resultado
    var options = {
        uri: 'http://192.168.0.106:8083/ZAutomation/api/v1/login',
        method: 'POST',
        json: true,
        body: { login: 'admin', password: 'contrasenia' },
    }
    await request(options, async function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Print the shortened url.
            var cookie = request.cookie('ZWAYSession=' + body.data.sid)
            var ultima_notificacion = await Notificacion.find()
                .sort({ valor_actualizacion: -1 })
                .limit(1)
            var desde = 0
            if (ultima_notificacion.length > 0) {
                desde = ultima_notificacion[0].valor_actualizacion
            }

            var options2 = {
                url: 'http://192.168.0.106:8083/ZAutomation/api/v1/notifications?since=' + desde,
                method: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookie,
                },
            }
            request(options2, async function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('Se ha hecho correctamente la consulta de los dispositivos')
                    console.log(body) // Print the shortened url.

                    var obj = JSON.parse(body)
                    console.log('Parseado')
                    console.log(obj.data.notifications[0])
                    var notificaciones = obj.data.notifications
                    for (i in obj.data.notifications) {
                        var elemento = obj.data.notifications[i]
                        var id = elemento.id
                        var timestamp = elemento.timestamp
                        var dev = elemento.message.dev
                        var level = elemento.message.l
                        //buscar el sensor a ver si está por el nombre
                        const buscar = await Sensor.find({ nombre: dev })
                        console.log('La consulta es esta:')
                        console.log(buscar)
                        var sensor
                        if (buscar.length > 0) {
                            sensor = buscar[0]
                            console.log('ACTUALIZACION')
                        } else {
                            console.log('SE INTRODUCE UNO NUEVO')
                            const data2 = { nombre: dev }
                            sensor = new Sensor(data2)
                            sensor.save()
                        }
                        // "2018-12-18T16:51:14.690Z"
                        var fecha1 = new Date(timestamp)
                        const data = { valor: level, fecha_creada: fecha1, sensor: sensor, valor_actualizacion: parseInt(id) }
                        const not = new Notificacion(data)
                        not.save()
                        //se meteria enla bd los datos ya aqui
                    }
                    var json_respuesta = {}
                    var json_sensores = {}
                    var json_arrays = {}
                    var sensores = await Sensor.find()
                    for (j in sensores) {
                        var sensor = sensores[j]
                        var indice_sensor = sensor._id

                        var notificaciones = await Notificacion.find({ sensor: indice_sensor }).limit(6)
                        var num_notificaciones = await Notificacion.find({ sensor: indice_sensor }).count()
                        console.log('Antes de meterse en el json')
                        console.log(sensor)
                        json_respuesta[sensor._id] = notificaciones
                        console.log('Despues')
                        console.log(json_respuesta[sensor])
                        //hace falta probarlo
                        /*
                        var json_sensor = {};
                        json_sensor["nombre"] = sensor.nombre;
                        json_sensor["pagina_actual"] = 0;
                        json_sensor["num_notificaciones"] = num_notificaciones;
                        json_sensores[sensor._id] = json_sensor;
                        */
                    }

                    json_arrays['0'] = json_sensores
                    json_arrays['1'] = json_respuesta

                    res.json(json_arrays)
                    console.log('ESTO ES LO QUE DEVUELVE A LA VISTA')
                    console.log(json_respuesta)
                    //res.json(await Sensor.find());
                } else {
                    console.log('Error en la segunda consulta')
                    console.log(body)
                    console.log(error)
                }
            })
        } else {
            res.json({ status: 'Error en login' })
        }
    })

    /*
    Extracts the cookie and places it in 'cookie.txt'.
Sends a second request to switch on device ZWayVDev_zway_6-0-37 passing in the stored cookie.
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{"form":true,"login":"admin","password":"admin","keepme":false,"default_ui":1}' http://192.168.0.62:8083/ZAutomation/api/v1/login -c cookie.txt
                    Authorization: "Basic " + new Buffer("---API credentials---").toString("base64")

    */

    //return resultado;
})

module.exports = router
