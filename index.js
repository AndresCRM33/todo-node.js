//Importamos Express
const express = require("express")
//Creamos la aplicación
const app = express()
//Configuramos el puerto para el servidor
const PORT = 3000

const cors = require("cors")

// let tareas = []

//Para usar un archivo json local////////////////////////////////////
// const fs = require('fs');
// const path = require('path');

// const archivoTareas = path.join(__dirname, 'tareas.json');

// // Función para cargar tareas desde el archivo JSON
// const cargarTareas = () => {
//   try {
//     const data = fs.readFileSync(archivoTareas, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     return []; // Si el archivo no existe o hay un error, devolvemos un array vacío
//   }
// };

// // Función para guardar tareas en el archivo JSON
// const guardarTareas = (tareas) => {
//   fs.writeFileSync(archivoTareas, JSON.stringify(tareas, null, 2));
// };

// // Cargamos las tareas al iniciar el servidor
// let tareas = cargarTareas();

//////////////////////////////////////////////////////////////////


const mongoose = require("mongoose");
const Tarea = require("./models/Tarea");

//Conectar a mongoDB

mongoose.connect('mongodb://127.0.0.1:27017/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

//Middleware para processar JSON
app.use(cors())
app.use(express.json())

//Creamos una ruta básica
app.get("/", (req, res) =>{
    res.send("Bienvenido a tu app To-Do!")
})

//Creamos ruta para obtener las tareas
app.get('/tareas', async (req, res) => {
    const { completado } = req.query; // Captura el query param "completado"

    let filtro = {};
    if (completado !== undefined) {
        filtro.completado = completado === 'true'; // Convierte "true"/"false" a booleano
    }

    try {
        const tareas = await Tarea.find(filtro); // Filtra en MongoDB
        res.json(tareas);
    } catch (error) {
        console.error("❌ Error al obtener tareas:", error);
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
});


app.post('/tareas', async (req, res) => {
    try {
      const { titulo } = req.body;
      if (!titulo) {
        return res.status(400).json({ error: 'El título es requerido' });
      }
  
      const nuevaTarea = new Tarea({ titulo }); // Crea la tarea
      await nuevaTarea.save(); // Guarda en MongoDB
  
      res.status(201).json(nuevaTarea);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear tarea' });
    }
  });

  app.put('/tareas/:id', async (req, res) => {
    try {
      const { titulo, completado } = req.body;
      const tarea = await Tarea.findByIdAndUpdate(req.params.id, 
        { titulo, completado },
        { new: true } // Retorna la tarea actualizada
      );
  
      if (!tarea) {
        return res.status(404).json({ error: 'No existe la tarea' });
      }
  
      res.json(tarea);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar tarea' });
    }
  });
  

  app.delete('/tareas/:id', async (req, res) => {
    try {
      const tarea = await Tarea.findByIdAndDelete(req.params.id);
  
      if (!tarea) {
        return res.status(404).json({ error: 'No existe la tarea' });
      }
  
      res.json({ message: 'Tarea eliminada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar tarea' });
    }
  });
  

/////////FILTROS////////////////////////////////////

// app.get("/tareas/completadas", (req, res) =>{
//     const tareasCompletadas = tareas.filter(tarea => tarea.completado)
//     if(tareasCompletadas.length == 0){
//         return res.status(404).json({error: "No hay tareas completadas"})
//     }

//     res.json(tareasCompletadas)
// })

// app.get("/tareas/incompletas", (req, res) =>{
//     const tareasIncompletas = tareas.filter(tarea => tarea.completado == false)
//     if(tareasIncompletas.length == 0){
//         return res.status(404).json({error: "No hay tareas incompletas"})
//     }
//     res.json(tareasIncompletas)
// })

///////////////////////////////////////////////////

//Poner a escuchar el servidor
app.listen(PORT, () => {
    console.log("El servidor se está ejecutando en el puerto: " + PORT)
})