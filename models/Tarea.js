const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  completado: { type: Boolean, default: false }
});

const Tarea = mongoose.model('Tarea', tareaSchema);

module.exports = Tarea;
