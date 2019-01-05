const express = require('express')
const router = express.Router()
const request = require('request')
const Clasificacion = require('../models/model.js')


router.get('/historial', async (req, res) => {
    var his = await Clasificacion.find();

    res.json({ historial : his })
})

router.post('/insertar_weka', async (req, res) => {
    console.log('ENTRA EN EL ROUTER CORRECTO')

     var cuerpo = req.body;
     var sep_long= cuerpo.sep_long;
     var sep_anch= cuerpo.sep_anch;
     var pet_long= cuerpo.pet_long;
     var pet_anch= cuerpo.pet_anch;
     var cadena_prueba = sep_long +","+sep_anch+","+pet_long+","+pet_anch+",?";

    var fs = require('fs');
    var archivo = `@RELATION iris\n@ATTRIBUTE sepallength REAL\n@ATTRIBUTE sepalwidth REAL\n@ATTRIBUTE petallength REAL\n@ATTRIBUTE petalwidth	REAL\n@ATTRIBUTE class {Iris-setosa,Iris-versicolor,Iris-virginica}\n@DATA\n`
    console.log("El archivo por ahora es : ");
    console.log(archivo);

    /*
    await fs.writeFile('mynewfile1.arff','', function (err) {
        if (err) throw err;
        console.log('File deleted!');
      });
   */

     await fs.appendFile('mynewfile1.arff', archivo, function (err) {
        if (err) throw err;
        console.log('Saved1 !');
      });

     await fs.appendFile('mynewfile1.arff', cadena_prueba, function (err) {
        if (err) throw err;
        console.log('Saved 2!');
      });

      console.log(cadena_prueba);

    var consulta = 'java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -T C:/Users/"Marcos Lupion"/Documents/LPS_Weka/mynewfile1.arff -l C:/Users/"Marcos Lupion"/Desktop/modelo.model -p 0';

    var exec = require('child_process').exec;

    var child;
    child =  exec(consulta,  function (error, stdout, stderr) {
        
        //console.log(error);
        console.log(stdout);
        //console.log(stderr);
        var array = stdout.split("\n")

        console.log(array)

        var nuevaLinea = array[5]
        console.log(nuevaLinea)
        var nuevoArray = nuevaLinea.split(" ")
        console.log(nuevoArray)
        var resultado = nuevoArray[14]
        console.log(resultado)
        var resultadoArray = resultado.split(":")
        var resultado = resultadoArray[1]

        console.log("EL PUTO RESULTADO PARSEADO ES PUTO: ")
        console.log(resultado)
        var devolver ;
        console.log(res)
        if(resultado == "Iris-vir"){
            devolver = "Iris Virginica";
        }else if(resultado == "Iris-set"){
            devolver = "Iris Setosa";
        }else{
            devolver = "Iris Versicolor";
        }
        var fecha = new Date();
        const data = { sep_long: sep_long, sep_anch : sep_anch , pet_long : pet_long ,pet_anch : pet_anch ,  clasificacion : devolver, hora : fecha }
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
        fs.writeFile('mynewfile1.arff','', function (err) {
            if (err) throw err;
            console.log('File deleted!');
          });
    
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


module.exports = router
