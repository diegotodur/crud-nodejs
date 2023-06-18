const http = require("http");
const url = require("url");
const fs = require("fs");
const moment = require("moment")
const path = require("path")

function enviarHTML(res, filePath, contentType) {
    fs.readFile(filePath, 'utf8', (err, html) => {
        if (err) {
            fs.readFile("./html/404.html", 'utf8', (err, html) => {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
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
            const imagePath = path.join(__dirname, 'favicon.png');

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
            const result = `//${date} \n ${contenido}`;
            const filePath = path.join(__dirname, '..', 'results', nombre);

            const extensionRegex = /\.[a-zA-Z0-9]+$/;
            if (!extensionRegex.test(nombre)) {
                enviarHTML(res, "./html/sin_extension.html", 'text/html');
                return;
            }

            if (!fs.existsSync(filePath)) {
                fs.writeFile(filePath, result, (err) => {
                    if (err) {
                        enviarHTML(res, "./html/error.html", 'text/html');
                    } else {
                        enviarHTML(res, "./html/exito.html", 'text/html');
                    }
                });
            } else {
                enviarHTML(res, "./html/existente.html", 'text/html');
            }
        }
        else if (req.url.includes('/leer')) {
            const filePath = path.join(__dirname, '..', 'results', nombre);

            if (fs.existsSync(filePath)) {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        const errorHTMLPath = path.join(__dirname, '..', 'html', 'error.html');
                        enviarHTML(res, 404, errorHTMLPath);
                    } else {
                        const leerHTMLPath = path.join(__dirname, '..', 'html', 'leer.html');
                        fs.readFile(leerHTMLPath, 'utf8', (err, html) => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.write('Error al leer el archivo HTML');
                                res.end();
                            } else {
                                const contenidoHTML = html.replace('{{contenido}}', data.toString());
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.write(contenidoHTML);
                                res.end();
                            }
                        });
                    }
                });
            } else {
                const noExisteHTMLPath = path.join(__dirname, '..', 'html', 'no_existe.html');
                enviarHTML(res, 404, noExisteHTMLPath);
            }
        }
        else if (req.url.includes("/renombrar")) {
            const filePath = path.join(__dirname, '..', 'results', nombre);
            const newFilePath = path.join(__dirname, '..', 'results', nuevo_nombre);

            if (fs.existsSync(filePath)) {
                fs.rename(filePath, newFilePath, (err) => {
                    if (err) {
                        enviarHTML(res, "./html/error.html", 'text/html');
                    } else {
                        enviarHTML(res, "./html/renombre.html", 'text/html');
                    }
                });
            } else {
                enviarHTML(res, "./html/no_existe.html", 'text/html');
            }
        }
        else if (req.url.includes("/eliminar")) {
            const filePath = path.join(__dirname, '..', 'results', nombre);

            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        enviarHTML(res, "./html/error.html", 'text/html');
                    } else {
                        enviarHTML(res, "./html/eliminado.html", 'text/html');
                    }
                });
            } else {
                enviarHTML(res, "./html/no_existe.html", 'text/html');
            }
        }
        else{
            fs.readFile(path.join(__dirname, '..', 'html', '404.html'), (err, html) => {
                if (err) {
                  console.error(err);
                  res.writeHead(404, { 'Content-Type': 'text/plain' });
                  res.write("Error al leer el archivo HTML");
                  res.end();
                } else {
                  res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
                  res.write(html);
                  res.end();
                }
              });
        }


    })
    .listen(8081, () => console.log("Inicializado, escuchando el puerto 8081"));


