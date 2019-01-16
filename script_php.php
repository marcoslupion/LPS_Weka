<?php
$consulta = 'java -classpath C:/Users/"Marcos Lupion"/Desktop/weka/weka.jar weka.classifiers.trees.J48 -T C:/Users/"Marcos Lupion"/Documents/LPS_Weka/mynewfile1.arff -l C:/Users/"Marcos Lupion"/Documents/LPS_Weka/weka/modelo.model -p 0';
$resultado = shell_exec($consulta);
print($resultado);
?>
