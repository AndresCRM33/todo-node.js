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

//Poner a escuchar el servidor
app.listen(PORT, () => {
    console.log("El servidor se está ejecutando en el puerto: " + PORT)
})