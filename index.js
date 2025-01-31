//Importamos Express
const express = require("express")
//Creamos la aplicación
const app = express()
//Configuramos el puerto para el servidor
const PORT = 3000

// let tareas = []

/////////////////////////////////////////////////////7////////////
const fs = require('fs');
const path = require('path');

const archivoTareas = path.join(__dirname, 'tareas.json');

// Función para cargar tareas desde el archivo JSON
const cargarTareas = () => {
  try {
    const data = fs.readFileSync(archivoTareas, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; // Si el archivo no existe o hay un error, devolvemos un array vacío
  }
};

// Función para guardar tareas en el archivo JSON
const guardarTareas = (tareas) => {
  fs.writeFileSync(archivoTareas, JSON.stringify(tareas, null, 2));
};

// Cargamos las tareas al iniciar el servidor
let tareas = cargarTareas();

//////////////////////////////////////////////////////////////////7

//Middleware para processar JSON
app.use(express.json())

//Creamos una ruta básica
app.get("/", (req, res) =>{
    res.send("Bienvenido a tu app To-Do!")
})

//Creamos ruta para obtener las tareas
app.get("/tareas", (req, res) =>{
    res.json(tareas)
})

app.post("/tareas", (req, res) => {
    const {titulo, completado} = req.body //Extraemos los datos del body

    if(!titulo){
        res.status(400).json({error: "El título es obligatorio"})
    }

    maxId = tareas.length > 0 ? Math.max(...tareas.map(tarea => tarea.id)) : 0 

    const nuevaTarea = {
        id: maxId + 1,
        titulo: titulo,
        completado: completado || false,
    }

    tareas.push(nuevaTarea)
    guardarTareas(tareas)
    res.status(201).json(nuevaTarea)
})

app.put('/tareas/:id', (req, res) =>{
    const {id} = req.params
    const {titulo, completado} = req.body

    const tareaIndex = tareas.findIndex(tarea => tarea.id === parseInt(id))

    if(tareaIndex === -1){
        return res.status(404).json({error: "No existe la tarea"})
    }

    //Actualizamos la tarea
    const tarea = tareas[tareaIndex]
    tarea.titulo = titulo || tarea.titulo
    tarea.completado = completado !== undefined ? completado : tarea.completado

    guardarTareas(tareas)

    res.json(tarea)
})

app.delete('/tareas/:id', (req, res) => {
    const {id} = req.params

    const tareaIndex = tareas.findIndex(tarea => tarea.id === parseInt(id))

    if(tareaIndex === -1){
        return res.status(404).json({error:"No existe la tarea"})
    }

    tareas.splice(tareaIndex, 1)

    guardarTareas(tareas)

    res.json({message: "tarea eliminada"})
})

/////////FILTROS////////////////////////////////////

app.get("/tareas/completadas", (req, res) =>{
    const tareasCompletadas = tareas.filter(tarea => tarea.completado)
    if(tareasCompletadas.length == 0){
        return res.status(404).json({error: "No hay tareas completadas"})
    }

    res.json(tareasCompletadas)
})

app.get("/tareas/incompletas", (req, res) =>{
    const tareasIncompletas = tareas.filter(tarea => tarea.completado == false)
    if(tareasIncompletas.length == 0){
        return res.status(404).json({error: "No hay tareas incompletas"})
    }
    res.json(tareasIncompletas)
})

///////////////////////////////////////////////////

//Poner a escuchar el servidor
app.listen(PORT, () => {
    console.log("El servidor se está ejecutando en el puerto: " + PORT)
})