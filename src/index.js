
import moment from 'moment'
import express from 'express';
const app = express();
import path from 'path'
import url from 'url'
import fs from 'fs'

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import { sendHTML, success } from './utils.js';

app.use('/style.css', express.static(path.join(__dirname, 'css/style.css')));


app.get('/', (req, res) => {
    sendHTML(res, "index.html", 'text/html');
});

app.get('/crear', (req, res) => {
    const params = url.parse(req.url, true).query;
    const nombre = params.nombre;
    const contenido = params.contenido;
    const date = moment().format('DD/MM/YYYY');

    const date0 = date
        .split('/')
        .map(segmento => segmento.padStart(2, '0'))
        .join('/');
    const result = `//${date0} \n ${contenido}`;
    const filePath = path.join(__dirname, '..', 'results', nombre);

    const extensionRegex = /\.[a-zA-Z0-9]+$/;
    if (!extensionRegex.test(nombre)) {
        success(res, `Favor agregar extensión a ${nombre}`, "error", "🙄");
        return;
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFile(filePath, result, (err) => {
            if (err) {
                sendHTML(res, './html/404.html', 'text/html');
            } else {
                success(res, `Archivo ${nombre} creado exitosamente!`, "exito", "🥳");
            }
        });
    } else {
        success(res, `Archivo ${nombre} ya existe!`, "error", "🙄");
    }

})

app.get('/leer' , (req,res) => {
    const params = url.parse(req.url, true).query;
    const nombre = params.nombre;
    const filePath = path.join(__dirname, '..', 'results', nombre);

            if (fs.existsSync(filePath)) {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        sendHTML(res, './html/404.html', 'text/html');
                    } else {
                        success(res,`Contenido de ${nombre}`, "leer", data.toString() )
                    }
                });
            } else {
                success(res,`Archivo ${nombre} no existe!`, "error", "🥴")

            }
})

app.get('/renombrar' , (req,res) => {
    const params = url.parse(req.url, true).query;
    const nombre = params.nombre;
    const nuevo_nombre = params.nuevo_nombre
    const filePath = path.join(__dirname, '..', 'results', nombre);
            const newFilePath = path.join(__dirname, '..', 'results', nuevo_nombre);

            if (fs.existsSync(filePath)) {
                fs.rename(filePath, newFilePath, (err) => {
                    if (err) {
                        sendHTML(res, "./html/404.html", 'text/html');
                    } else {
                        success(res,`Archivo ${nombre} renombrado a ${nuevo_nombre}!`, "exito", "🥳")

                    }
                });
            } else {
                success(res,`Archivo ${nombre} no existe!`, "error", "🥴")
            }
});

app.get('/eliminar' , (req,res) => {
    const params = url.parse(req.url, true).query;
    const nombre = params.nombre;
    const filePath = path.join(__dirname, '..', 'results', nombre);

            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        sendHTML(res, "./html/404.html", 'text/html');
                    } else {
                        success(res,`Archivo ${nombre} eliminado correctamente!`, "exito", "🥳")

                    }
                });
            } else {
                success(res,`Archivo ${nombre} no existe!`, "error", "🥴")
            }
});

app.get('*', (req,res) => {
    sendHTML(res, "./html/404.html", 'text/html');
});

app.listen(8081, () => console.log("escuchando en el puerto 8081"))