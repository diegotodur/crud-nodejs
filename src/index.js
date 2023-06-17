const http = require("http");
const url = require("url");
const fs = require("fs");
const moment = require("moment")

http
    .createServer(function (req, res) {
        // Paso 5
        const params = url.parse(req.url, true).query;
        const nombre = params.nombre;
        const contenido = params.contenido;
        const nuevo_nombre = params.nuevo_nombre
        // Paso 6
        if (req.url.includes("/crear")) {

            const date = moment().format('DD/MM/YYYY');
            const result = `//${date} \n ${contenido}`;
        
            fs.writeFile(nombre, result, () => {
                
                res.write(`Archivo  ${nombre} creado con éxito!`);
                res.end();
            });
        }
        // Paso 7
        if (req.url.includes("/leer")) {
            if (fs.existsSync(nombre)) {
                fs.readFile(nombre, (err, data) => {
                    res.write(data);
                    res.end();
                });
            } else {
                res.write(`Archivo ${nombre} no existe`);
                res.end();
            }
            
                
          

        }
        // Paso 1
        if (req.url.includes("/renombrar")) {
            if (fs.existsSync(nombre)) {
                fs.rename(nombre, nuevo_nombre, (err, data) => {
                    res.write(`Archivo ${nombre} renombrado por ${nuevo_nombre}`);
                    res.end();
                });
            } else {
                res.write(`Archivo no existe`);
                res.end();
            }
        }
        // Paso 2
        if (req.url.includes("/eliminar")) {

            if (fs.existsSync(nombre)) {
                fs.unlink(nombre, (err, data) => {
                    res.write(`Archivo ${nombre} eliminado con exito`);
                    res.end();
                });
            } else {
                res.write(`Archivo ${nombre} no existe`);
                res.end();
            }

        }
    })
    .listen(8080, () => console.log("Escuchando el puerto 8080"));