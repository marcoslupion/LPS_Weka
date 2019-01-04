const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = new Schema({
    title : {type:String, required:true},
    description : {type:String,required:true}
})

module.export = mongoose.model('Task', TaskSchema);
