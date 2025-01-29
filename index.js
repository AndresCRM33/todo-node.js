//Importamos Express
const express = require("express")
//Creamos la aplicación
const app = express()
//Configuramos el puerto para el servidor
const PORT = 3000

let tareas = []

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

    const nuevaTarea = {
        id: tareas.length + 1,
        titulo: titulo,
        completado: completado || false,
    }

    tareas.push(nuevaTarea)
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

    res.json(tarea)
})

app.delete('/tareas/:id', (req, res) => {
    const {id} = req.params

    const tareaIndex = tareas.findIndex(tarea => tarea.id === parseInt(id))

    if(tareaIndex === -1){
        return res.status(404).json({error:"No existe la tarea"})
    }

    tareas.splice(tareaIndex, 1)

    res.json({message: "tarea eliminada"})
})

//Poner a escuchar el servidor
app.listen(PORT, () => {
    console.log("El servidor se está ejecutando en el puerto: " + PORT)
})