const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Clasificacion = new Schema({
    sep_long : {type:Number, required:true},
    sep_anch : {type:Number, required:true},
    pet_long : {type:Number, required:true},
    pet_anch : {type:Number, required:true},
    hora :     {type:Date,required:true},
    clasificacion : {type:String,required:true}
})

module.exports = mongoose.model('Clasificacion', Clasificacion);
