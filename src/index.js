const http = require("http");
const url = require("url");
const fs = require("fs");
const moment = require("moment")

const errorHTML = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Error</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"><style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background-color:#f5f5f5;font-family:Arial,sans-serif}.error-message{font-size:24px;margin-bottom:16px}.error-image{font-size:64px;margin-bottom:16px}</style></head><body><div class="error-message">Ups, algo ocurrió mal</div><div class="error-image">😕</div></body></html>`;
const noexisteHTML = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Error</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"><style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background-color:#f5f5f5;font-family:Arial,sans-serif}.error-message{font-size:24px;margin-bottom:16px}.error-image{font-size:64px;margin-bottom:16px}</style></head><body><div class="error-message">Ups, el archivo no existe!</div><div class="error-image">😕</div></body></html>`;
const exitoHTML = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Error</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"><style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background-color:#f5f5f5;font-family:Arial,sans-serif}.error-message{font-size:24px;margin-bottom:16px}.error-image{font-size:64px;margin-bottom:16px}.confetti{display:flex;justify-content:center;align-items:center;position:absolute;width:100%;height:100%;overflow:hidden;z-index:1000}.confetti-piece{position:absolute;width:10px;height:30px;background:#ffd300;top:0;opacity:0}.confetti-piece:nth-child(1){left:7%;-webkit-transform:rotate(-40deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:182ms;-webkit-animation-duration:1116ms}.confetti-piece:nth-child(2){left:14%;-webkit-transform:rotate(4deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:161ms;-webkit-animation-duration:1076ms}.confetti-piece:nth-child(3){left:21%;-webkit-transform:rotate(-51deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:481ms;-webkit-animation-duration:1103ms}.confetti-piece:nth-child(4){left:28%;-webkit-transform:rotate(61deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:334ms;-webkit-animation-duration:708ms}.confetti-piece:nth-child(5){left:35%;-webkit-transform:rotate(-52deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:302ms;-webkit-animation-duration:776ms}.confetti-piece:nth-child(6){left:42%;-webkit-transform:rotate(38deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:180ms;-webkit-animation-duration:1168ms}.confetti-piece:nth-child(7){left:49%;-webkit-transform:rotate(11deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:395ms;-webkit-animation-duration:1.2s}.confetti-piece:nth-child(8){left:56%;-webkit-transform:rotate(49deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:14ms;-webkit-animation-duration:887ms}.confetti-piece:nth-child(9){left:63%;-webkit-transform:rotate(-72deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:149ms;-webkit-animation-duration:805ms}.confetti-piece:nth-child(10){left:70%;-webkit-transform:rotate(10deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:351ms;-webkit-animation-duration:1059ms}.confetti-piece:nth-child(11){left:77%;-webkit-transform:rotate(4deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:307ms;-webkit-animation-duration:1132ms}.confetti-piece:nth-child(12){left:84%;-webkit-transform:rotate(42deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:464ms;-webkit-animation-duration:776ms}.confetti-piece:nth-child(13){left:91%;-webkit-transform:rotate(-72deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:429ms;-webkit-animation-duration:818ms}.confetti-piece:nth-child(odd){background:#7431e8}.confetti-piece:nth-child(even){z-index:1}.confetti-piece:nth-child(4n){width:5px;height:12px;-webkit-animation-duration:2s}.confetti-piece:nth-child(3n){width:3px;height:10px;-webkit-animation-duration:2.5s;-webkit-animation-delay:1s}.confetti-piece:nth-child(4n-7){background:red}@-webkit-keyframes makeItRain{from{opacity:0}50%{opacity:1}to{-webkit-transform:translateY(350px)}}</style></head><body><div class="error-message">Archivo creado con exito!</div><div class="error-image">🥳</div><div class="confetti"><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div></div></body></html>`;
const renombreHTML = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Error</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"><style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background-color:#f5f5f5;font-family:Arial,sans-serif}.error-message{font-size:24px;margin-bottom:16px}.error-image{font-size:64px;margin-bottom:16px}.confetti{display:flex;justify-content:center;align-items:center;position:absolute;width:100%;height:100%;overflow:hidden;z-index:1000}.confetti-piece{position:absolute;width:10px;height:30px;background:#ffd300;top:0;opacity:0}.confetti-piece:nth-child(1){left:7%;-webkit-transform:rotate(-40deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:182ms;-webkit-animation-duration:1116ms}.confetti-piece:nth-child(2){left:14%;-webkit-transform:rotate(4deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:161ms;-webkit-animation-duration:1076ms}.confetti-piece:nth-child(3){left:21%;-webkit-transform:rotate(-51deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:481ms;-webkit-animation-duration:1103ms}.confetti-piece:nth-child(4){left:28%;-webkit-transform:rotate(61deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:334ms;-webkit-animation-duration:708ms}.confetti-piece:nth-child(5){left:35%;-webkit-transform:rotate(-52deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:302ms;-webkit-animation-duration:776ms}.confetti-piece:nth-child(6){left:42%;-webkit-transform:rotate(38deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:180ms;-webkit-animation-duration:1168ms}.confetti-piece:nth-child(7){left:49%;-webkit-transform:rotate(11deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:395ms;-webkit-animation-duration:1.2s}.confetti-piece:nth-child(8){left:56%;-webkit-transform:rotate(49deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:14ms;-webkit-animation-duration:887ms}.confetti-piece:nth-child(9){left:63%;-webkit-transform:rotate(-72deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:149ms;-webkit-animation-duration:805ms}.confetti-piece:nth-child(10){left:70%;-webkit-transform:rotate(10deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:351ms;-webkit-animation-duration:1059ms}.confetti-piece:nth-child(11){left:77%;-webkit-transform:rotate(4deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:307ms;-webkit-animation-duration:1132ms}.confetti-piece:nth-child(12){left:84%;-webkit-transform:rotate(42deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:464ms;-webkit-animation-duration:776ms}.confetti-piece:nth-child(13){left:91%;-webkit-transform:rotate(-72deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:429ms;-webkit-animation-duration:818ms}.confetti-piece:nth-child(odd){background:#7431e8}.confetti-piece:nth-child(even){z-index:1}.confetti-piece:nth-child(4n){width:5px;height:12px;-webkit-animation-duration:2s}.confetti-piece:nth-child(3n){width:3px;height:10px;-webkit-animation-duration:2.5s;-webkit-animation-delay:1s}.confetti-piece:nth-child(4n-7){background:red}@-webkit-keyframes makeItRain{from{opacity:0}50%{opacity:1}to{-webkit-transform:translateY(350px)}}</style></head><body><div class="error-message">Archivo renombrado con exito!</div><div class="error-image">🥳</div><div class="confetti"><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div></div></body></html>`;
const eliminadoHTML = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Error</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"><style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background-color:#f5f5f5;font-family:Arial,sans-serif}.error-message{font-size:24px;margin-bottom:16px}.error-image{font-size:64px;margin-bottom:16px}.confetti{display:flex;justify-content:center;align-items:center;position:absolute;width:100%;height:100%;overflow:hidden;z-index:1000}.confetti-piece{position:absolute;width:10px;height:30px;background:#ffd300;top:0;opacity:0}.confetti-piece:nth-child(1){left:7%;-webkit-transform:rotate(-40deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:182ms;-webkit-animation-duration:1116ms}.confetti-piece:nth-child(2){left:14%;-webkit-transform:rotate(4deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:161ms;-webkit-animation-duration:1076ms}.confetti-piece:nth-child(3){left:21%;-webkit-transform:rotate(-51deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:481ms;-webkit-animation-duration:1103ms}.confetti-piece:nth-child(4){left:28%;-webkit-transform:rotate(61deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:334ms;-webkit-animation-duration:708ms}.confetti-piece:nth-child(5){left:35%;-webkit-transform:rotate(-52deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:302ms;-webkit-animation-duration:776ms}.confetti-piece:nth-child(6){left:42%;-webkit-transform:rotate(38deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:180ms;-webkit-animation-duration:1168ms}.confetti-piece:nth-child(7){left:49%;-webkit-transform:rotate(11deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:395ms;-webkit-animation-duration:1.2s}.confetti-piece:nth-child(8){left:56%;-webkit-transform:rotate(49deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:14ms;-webkit-animation-duration:887ms}.confetti-piece:nth-child(9){left:63%;-webkit-transform:rotate(-72deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:149ms;-webkit-animation-duration:805ms}.confetti-piece:nth-child(10){left:70%;-webkit-transform:rotate(10deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:351ms;-webkit-animation-duration:1059ms}.confetti-piece:nth-child(11){left:77%;-webkit-transform:rotate(4deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:307ms;-webkit-animation-duration:1132ms}.confetti-piece:nth-child(12){left:84%;-webkit-transform:rotate(42deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:464ms;-webkit-animation-duration:776ms}.confetti-piece:nth-child(13){left:91%;-webkit-transform:rotate(-72deg);-webkit-animation:makeItRain 1s infinite ease-out;-webkit-animation-delay:429ms;-webkit-animation-duration:818ms}.confetti-piece:nth-child(odd){background:#7431e8}.confetti-piece:nth-child(even){z-index:1}.confetti-piece:nth-child(4n){width:5px;height:12px;-webkit-animation-duration:2s}.confetti-piece:nth-child(3n){width:3px;height:10px;-webkit-animation-duration:2.5s;-webkit-animation-delay:1s}.confetti-piece:nth-child(4n-7){background:red}@-webkit-keyframes makeItRain{from{opacity:0}50%{opacity:1}to{-webkit-transform:translateY(350px)}}</style></head><body><div class="error-message">Archivo eliminado con exito!</div><div class="error-image">🥳</div><div class="confetti"><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div></div></body></html>`;

http
    .createServer(function (req, res) {
        const params = url.parse(req.url, true).query;
        const nombre = params.nombre;
        const contenido = params.contenido;
        const nuevo_nombre = params.nuevo_nombre
        if (req.url.includes("/crear")) {

            const date = moment().format('DD/MM/YYYY');
            const result = `//${date} \n ${contenido}`;
            
            fs.writeFile(nombre, result, () => {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.write(exitoHTML);
                res.end();
            });
        }
        if (req.url.includes("/leer")) {
            if (fs.existsSync(nombre)) {
                fs.readFile(nombre, (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.write(errorHTML);
                        res.end();
                    } else {
                        const leerHTML = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Error</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"><style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background-color:#f5f5f5;font-family:Arial,sans-serif}.error-message{font-size:24px;margin-bottom:16px}.error-textarea{width:300px;height:200px;padding:8px;font-size:16px;border:2px solid #ccc;border-radius:4px;resize:none}</style></head><body><div class="error-message">Aqui esta su contenido:</div><textarea class="error-textarea" readonly>${data.toString()}</textarea></body></html>`;
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.write(leerHTML);
                        res.end();
                    }
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.write(noexisteHTML);
                res.end();
            }
        }
        if (req.url.includes("/renombrar")) {
            if (fs.existsSync(nombre)) {
                fs.rename(nombre, nuevo_nombre, (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.write(errorHTML);
                        res.end();
                    } else {
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.write(renombreHTML);
                        res.end();
                    }
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.write(noexisteHTML);
                res.end();
            }
        }
        if (req.url.includes("/eliminar")) {

            if (fs.existsSync(nombre)) {
                fs.unlink(nombre, (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.write(errorHTML);
                        res.end();
                    } else {
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.write(eliminadoHTML);
                        res.end();
                    }
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.write(noexisteHTML);
                res.end();
            }


        }
    })
    .listen(8080, () => console.log("Inicializado, escuchando el puerto 8080"));


