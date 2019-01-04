var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SensorSchema = new Schema(
  {
    nombre: {type: String, required: true, max: 100, unique:true},
    location: {type: String, required: false, max: 100},
    tipo: {type: Schema.Types.ObjectId, ref: 'TipoSensor', required: false},
  }
);
//unique=true;

//Export model
module.exports = mongoose.model('Sensor', SensorSchema);