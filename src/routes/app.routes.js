const express = require('express');
const router = express.Router();
const request = require('request');
const Clasificacion = require('../models/model.js');


router.get('/historial', async (req, res) => {
    var his = await Clasificacion.find();

    res.json({ historial : his })
});

router.post('/insertar_weka', async (req, res) => {
    console.log('ENTRA EN EL ROUTER CORRECTO');

     var cuerpo = req.body;
     var sep_long= cuerpo.sep_long;
     var sep_anch= cuerpo.sep_anch;
     var pet_long= cuerpo.pet_long;
     var pet_anch= cuerpo.pet_anch;
     var cadena_prueba = sep_long +","+sep_anch+","+pet_long+","+pet_anch+",?";

    var fs = require('fs');
    var archivo = `@RELATION iris\n@ATTRIBUTE sepallength REAL\n@ATTRIBUTE sepalwidth REAL\n@ATTRIBUTE petallength REAL\n@ATTRIBUTE petalwidth	REAL\n@ATTRIBUTE class {Iris-setosa,Iris-versicolor,Iris-virginica}\n@DATA\n`;
    console.log("El archivo por ahora es : ");
    console.log(archivo);

    /*
    await fs.writeFile('mynewfile1.arff','', function (err) {
        if (err) throw err;
        console.log('File deleted!');
      });
   */

     await fs.appendFile('weka/datosRecibidos.arff', archivo, function (err) {
        if (err) throw err;
        console.log('Saved1 !');
      });

     await fs.appendFile('weka/datosRecibidos.arff', cadena_prueba, function (err) {
        if (err) throw err;
        console.log('Saved 2!');
      });

      console.log(cadena_prueba);
      var path = require('path');
    var arffFile = path.resolve("weka/datosRecibidos.arff");
    var modelFile = path.resolve("weka/model.model");
    var wekaFile = path.resolve("weka/weka.jar");
    var rutaRelativa = 'E:/Program Files/Weka-3-8/weka.jar';

    //var consulta = 'java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -T C:/Users/"Marcos Lupion"/Documents/LPS_Weka/mynewfile1.arff -l C:/Users/"Marcos Lupion"/Desktop/modelo.model -p 0';
    var consulta = 'java -classpath '
                    + wekaFile
                    + ' weka.classifiers.trees.J48 -T '
                    + arffFile + ' -l '
                    + modelFile
                    + ' -p 0';

    console.log(consulta);



    var exec = require('child_process').exec;

    var child;
    child =  exec(consulta,  function (error, stdout, stderr) {

        fs.writeFile('weka/datosRecibidos.arff','', function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });

        /*
        fs.unlink('weka/datosRecibidos.arff', function(err) {
            if (err) throw err;
            console.log('File deleted!');
        });
        */
        //console.log(error);
        console.log(stdout);
        //console.log(stderr);
        var array = stdout.split("\n");

        console.log(array);

        var nuevaLinea = array[5];
        console.log(nuevaLinea);
        var nuevoArray = nuevaLinea.split(" ");
        console.log(nuevoArray);
        var resultado = nuevoArray[14];
        console.log(resultado);
        var resultadoArray = resultado.split(":");
        var resultado = resultadoArray[1];

        console.log("EL PUTO RESULTADO PARSEADO ES PUTO: ");
        console.log(resultado);
        var devolver ;
        console.log(res);
        if(resultado == "Iris-vir"){
            devolver = "Iris Virginica";
        }else if(resultado == "Iris-set"){
            devolver = "Iris Setosa";
        }else{
            devolver = "Iris Versicolor";
        }
        var fecha_parseada = new Date();


        var dia = ""+fecha_parseada.getDate()<10 ? "0"+fecha_parseada.getDate() : fecha_parseada.getDate();
        var mes = ""+fecha_parseada.getMonth()<10 ? ""+fecha_parseada.getMonth()+1 : fecha_parseada.getMonth()+1;
        var año = fecha_parseada.getFullYear();
        var hora = ""+fecha_parseada.getHours()<10 ? "0"+fecha_parseada.getHours() : fecha_parseada.getHours();
        var minuto = ""+fecha_parseada.getMinutes()<10 ? "0"+fecha_parseada.getMinutes() : fecha_parseada.getMinutes();
        var segundo = ""+fecha_parseada.getSeconds()<10 ? "0"+fecha_parseada.getSeconds() : fecha_parseada.getSeconds();
        var mili =      fecha_parseada.getMilliseconds();
        console.log(fecha_parseada);
        var fecha_parseada_string = dia+"/"+mes+"/"+año+" "+hora+":"+minuto+":"+segundo+"."+mili;
        console.log(fecha_parseada_string);

        const data = { sep_long: sep_long, sep_anch : sep_anch , pet_long : pet_long ,pet_anch : pet_anch ,  clasificacion : devolver, hora : fecha_parseada, fecha_parseada : fecha_parseada_string };
        var clas = new Clasificacion(data);  
        /*      
        clas.sep_long = sep_long ;  
        clas.sep_anch = sep_anch ;  
        clas.pet_long = pet_long ;  
        clas.pet_anch = pet_anch ;  
        clas.clasificacion = devolver ;  
        clas.hora = new Date();
        */
        clas.save();
       

        res.json({clase : devolver});


    
    });

      

});
/*
java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -l C:/Users/"Marcos Lupion"/Desktop/model.model -T C:/Users/"Marcos Lupion"/Documents/LPS_Weka/iris.arff

//esto genera la clasificacion inicial a partir de la bd de iris.arff
java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -t C:/Users/"Marcos Lupion"/Documents/LPS_Weka/iris.arff

java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -T C:/Users/"Marcos Lupion"/Desktop/prediccion.arff -l C:/Users/"Marcos Lupion"/Desktop/model.model

//esto se seupone que es para ver de qe clase es usandoel modelo
java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -T C:/Users/"Marcos Lupion"/Desktop/prediccion.arff -l C:/Users/"Marcos Lupion"/Desktop/model.model

//esto hace prediccion correcta sobre el conjunto de datos de entrenamiento
java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -T C:/Users/"Marcos Lupion"/Desktop/prediccion.arff -t C:/Users/"Marcos Lupion"/Desktop/iris.arff -p 0

/correcto el modelo que raliza la prediccion
java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -T C:/Users/"Marcos Lupion"/Desktop/prediccion.arff -l C:/Users/"Marcos Lupion"/Desktop/modelo.model -p 0

*/

    //See Weka Documentation
    
            
    
    //res.json({ status: 'Accion guardada' })


module.exports = router;
