var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NotificacionSchema = new Schema(
  {
    valor: {type: String, required: true, max: 100},
    fecha_creada: {type: Date, required: true},
    fecha_creada_parseada: {type: String, required: true},
    sensor: {type: Schema.Types.ObjectId, ref: 'Sensor', required: false},
    valor_actualizacion: {type: Number, required: true},
    nueva: {type: Boolean, required: true},
  }
);


//Export model
module.exports = mongoose.model('Notificacion', NotificacionSchema);