const express = require('express')
const router = express.Router()
const request = require('request')
const weka = require('node-weka/mi_libreria12');

const arff = require('arff');


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

router.get('/insertar_weka', async (req, res) => {
    console.log('ENTRA EN EL ROUTER CORRECTO')
  
  /*
  // find out some info about the field "age"
  var oldest = data.max('age');
  var youngest = data.min('age');
  var mostcommon = data.mode('age');
  var average = data.mean('age');

  // normalize the data (scale all numeric values so that they are between 0 and 1)
  data.normalize();

  // randomly sort the data
  //data.randomize();
  */

  /*
 var options = {
    //'classifier': 'weka.classifiers.bayes.NaiveBayes',
    'classifier': 'weka.classifiers.trees.J48',
    'params'    : ''
    };

    var testData = {
        sepalwidth    : 3,
        petallength      : 1,
        petalwidth: 30,
        sepallength   : 2,
        /*
        class       : 'no' // last is class attribute
        
    };
    console.log("WEKA : ")
  
    console.log(weka);
    console.log("El test es : " + testData)
    weka.predict('C:/Users/"Marcos Lupion"/Desktop/iris-model.model', testData, options, function (err, result) {
        console.log("El resultado es : ")
        console.log(result);
        console.log(err);
        */
    res.json({ status: "hola bro" })

    var fs = require('fs');
    var archivo = `@RELATION iris\n@ATTRIBUTE sepallength REAL\n@ATTRIBUTE sepalwidth REAL\n@ATTRIBUTE petallength REAL\n@ATTRIBUTE petalwidth	REAL\n@ATTRIBUTE class {Iris-setosa,Iris-versicolor,Iris-virginica}\n@DATA\n`
    console.log("El archivo por ahora es : ");
    console.log(archivo);

    fs.appendFile('mynewfile1.txt', archivo, function (err) {
        if (err) throw err;
        console.log('Saved1 !');
      });

    fs.appendFile('mynewfile1.txt', '5.1,3.5,1.4,100,?', function (err) {
        if (err) throw err;
        console.log('Saved 2!');
      });


    var consulta = 'java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -T C:/Users/"Marcos Lupion"/Desktop/prediccion.arff -l C:/Users/"Marcos Lupion"/Desktop/modelo.model -p 0';

    var exec = require('child_process').exec;

    var child;
    child = exec(consulta,function (error, stdout, stderr) {
        //console.log(error);
        console.log(stdout);
        //console.log(stderr);

    
    });

    fs.unlink('mynewfile1.txt', function (err) {
        if (err) throw err;
        console.log('File deleted!');
      });

})
/*
java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -l C:/Users/"Marcos Lupion"/Desktop/iris-model.model -T C:/Users/"Marcos Lupion"/Documents/LPS_Weka/iris.arff

//esto genera la clasificacion inicial a partir de la bd de iris.arff
java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -t C:/Users/"Marcos Lupion"/Documents/LPS_Weka/iris.arff

java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -T C:/Users/"Marcos Lupion"/Desktop/prediccion.arff -l C:/Users/"Marcos Lupion"/Desktop/iris-model.model

//esto se seupone que es para ver de qe clase es usandoel modelo
java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -T C:/Users/"Marcos Lupion"/Desktop/prediccion.arff -l C:/Users/"Marcos Lupion"/Desktop/iris-model.model

//esto hace prediccion correcta sobre el conjunto de datos de entrenamiento
java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -T C:/Users/"Marcos Lupion"/Desktop/prediccion.arff -t C:/Users/"Marcos Lupion"/Desktop/iris.arff -p 0

/correcto el modelo que raliza la prediccion
java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -T C:/Users/"Marcos Lupion"/Desktop/prediccion.arff -l C:/Users/"Marcos Lupion"/Desktop/modelo.model -p 0

*/

    //See Weka Documentation
    
            
    
    //res.json({ status: 'Accion guardada' })





router.post('/todos_sensores_v2', async (req, res) => {  
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
  

module.exports = router
