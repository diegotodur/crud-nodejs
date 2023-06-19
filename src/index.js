const http = require("http");
const url = require("url");
const fs = require("fs");
const moment = require("moment")
const path = require("path")

function enviarHTML(res, filePath, contentType) {
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
                        enviarHTML(res, "./html/error.html", 'text/html');
                    } else {
                        const leerHTMLPath = path.join(__dirname, '..', 'html', 'leer.html');
                        fs.readFile(leerHTMLPath, 'utf8', (err, html) => {
                            if (err) {
                                enviarHTML(res, "./html/error.html", 'text/html');
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
                fs.readFile(noExisteHTMLPath, 'utf8', (err, html) => {
                    if (err) {
                        enviarHTML(res, "./html/404.html", 'text/html');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.write(html);
                        res.end();
                    }
                });
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
        else {
            fs.readFile(path.join(__dirname, '..', 'html', '404.html'), (err, html) => {
                if (err) {
                    enviarHTML(res, "./html/error.html", 'text/html');
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=UTF-8' });
                    res.write(html);
                    res.end();
                }
            });
        }


    })
    .listen(8081, () => console.log("Inicializado, escuchando el puerto 8081"));


