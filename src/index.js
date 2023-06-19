const http = require("http");
const url = require("url");
const fs = require("fs");
const moment = require("moment");
const path = require("path");

function sendHTML(res, filePath, contentType) {
    fs.readFile(filePath, 'utf8', (err, html) => {
        if (err) {
            fs.readFile("./html/404.html", 'utf8', (err, html) => {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.write(html);
                res.end();
            });

        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(html);
            res.end();
        }
    });
}

function success(res, mensaje, estado, emoji) {
    let filePath = '';
  
    switch (estado) {
      case 'exito':
        filePath = path.join(__dirname, '..', 'html', 'exito.html');
        break;
  
      case 'error':
        filePath = path.join(__dirname, '..', 'html', 'error.html');
        break;
     
     case 'leer':
        filePath = path.join(__dirname, '..', 'html', 'leer.html');
        break;

    }
  
    fs.readFile(filePath, 'utf8', (err, html) => {
      if (err) {
        sendHTML(res, './html/404.html', 'text/html');
      } else {
        const contenidoHTML = html
                                .replace('{{contenido1}}', mensaje)
                                .replace('{{contenido2}}', emoji);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(contenidoHTML);
        res.end();
      }
    });
  }

  
http
    .createServer(function (req, res) {
        const params = url.parse(req.url, true).query;
        const nombre = params.nombre;
        const contenido = params.contenido;
        const nuevo_nombre = params.nuevo_nombre

        if (req.url === "/") {
            res.writeHead(200, { 'Content-Type': 'text/html;charset="UTF-8"' })
            fs.readFile("index.html", (err, response) => {
                res.write(response)
                res.end()
            })
        }
        else if (req.url === "/style") {
            fs.readFile("./src/style.css", (err, css) => {
                if (err) {
                    res.writeHead(201, { "Content-Type": "text/plain" });
                    res.write("Error al leer css");
                    res.end();
                } else {
                    res.writeHead(200, { "Content-Type": "text/css" });
                    res.write(css);
                    res.end();
                }
            });
        }
        else if (req.url === "/favicon.png") {
            const imagePath = path.join(__dirname, './img/favicon.png');

            fs.readFile(imagePath, (err, image) => {
                if (err) {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.write("Error reading image file");
                    res.end();
                } else {
                    res.writeHead(200, { "Content-Type": "image/png" });
                    res.end(image, 'binary');
                }
            });
        }
        else if (req.url.includes("/crear")) {
            const date = moment().format('DD/MM/YYYY');

            const date0 = date
                .split('/')
                .map(segmento => segmento.padStart(2, '0'))
                .join('/');
            const result = `${date0} \n ${contenido}`;
            const filePath = path.join(__dirname, '..', 'results', nombre);

            const extensionRegex = /\.[a-zA-Z0-9]+$/;
            if (!extensionRegex.test(nombre)) {
                success(res,`Favor agregar extension a ${nombre}`, "error", "🙄")
                return;
            }

            if (!fs.existsSync(filePath)) {
                fs.writeFile(filePath, result, (err) => {
                    if (err) {
                        sendHTML(res, './html/404.html', 'text/html');
                    } else {
                        success(res,`Archivo ${nombre} creado exitosamente!`, "exito", "🥳")
                    }
                });
            } else {
                success(res,`Archivo ${nombre} ya existe!`, "error", "🙄")
            }
        }
        else if (req.url.includes('/leer')) {
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
        }
        else if (req.url.includes("/renombrar")) {
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
        }
        else if (req.url.includes("/eliminar")) {
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
        }
        else {
            sendHTML(res, "./html/404.html", 'text/html');
        }


    })
    .listen(8081, () => console.log("Inicializado, escuchando el puerto 8081"));


