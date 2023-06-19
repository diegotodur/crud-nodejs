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

export { sendHTML, success };