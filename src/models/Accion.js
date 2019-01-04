var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AccionSchema = new Schema(
  {
    nombre: {type: String, required: true, max: 100},
  }
);
//Export model
module.exports = mongoose.model('Accion', AccionSchema);
