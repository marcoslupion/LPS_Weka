var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NotificacionAccionSchema = new Schema(
  {
    fecha_creada: {type: Date, required: true},
    notificacion: {type: Schema.Types.ObjectId, ref: 'Notificacion', required: false},
    accion: {type: Schema.Types.ObjectId, ref: 'Accion', required: false},
  }
);


//Export model
module.exports = mongoose.model('NotificacionAccion', NotificacionAccionSchema);