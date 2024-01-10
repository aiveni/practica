const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');//
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const session = require("express-session");

const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const port = 3000;
require('dotenv').config()

const app = express();

// Configuración del límite de solicitudes
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutos
    max: 10, // límite de 100 solicitudes por IP en el intervalo de tiempo especificado
    message: 'Demasiadas solicitudes desde esta IP, inténtelo de nuevo más tarde.',
  });
  const sess = {
    secret: 'ausazko hitz multzoa',
    cookie: {maxAge: 1000*60*2}
  }

//mongodb
mongoose.connect('mongodb://localhost:27017/todo_express',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true

    })
    .then(() => console.log('MongoDB Conectada'))
    .catch(err => console.log(err)
);
app.use(cookieParser());
app.use(session(sess))

// Utilizar el middleware helmet
app.use(helmet());
// Middleware para limitar el tamaño del cuerpo HTTP
app.use(bodyParser.json({ limit: '1mb' })); // Limita el tamaño del cuerpo JSON a 1 MB
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' })); // Limita el tamaño del cuerpo de datos codificados a 1 MB
// Configurar helmet
app.use(helmet());
app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'trusted-scripts.com'],
        },
      },
    })
  );
  


// Aplicar el límite de solicitudes a todas las rutas
//app.use(limiter);
//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//rutes
app.use(require('./routes/index'));
app.use(require('./routes/todo'));
//app.use(require('./routes/user'));
const serverOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
  };
  
  const server = https.createServer(serverOptions, app);
  server.listen(port, () => {
    console.log(`Servidor HTTPS escuchando en el puerto ${port}`);
  });
//server connection
//app.listen(3000, () => console.log('Server on port: 3000'));