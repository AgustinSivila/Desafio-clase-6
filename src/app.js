import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import handlebars from 'express-handlebars';
import __dirname from './untils.js'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import ProductManager from './manager/product.manager.js'


const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configurar Handlebars como el motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/', viewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

// Configurar el directorio de vistas
app.set('views', path.join(__dirname, 'views'));

app.use('/static', express.static(path.join(path.resolve(), 'public')));

app.get('/', (req, res) => {
  res.send('<h1> HOME </h1>');
});

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');
  
    socket.on('message', data => {
      console.log(data);
  
      // Aquí es donde creas o eliminas un producto
  
      if (data.action === 'create') {
        const newProduct = { name: data.name, price: data.price };
        io.emit('product_created', newProduct);
      } else if (data.action === 'delete') {
        const productId = data.productId;
        io.emit('product_deleted', productId);
      }
  
      socket.emit('message_one', 'Solo le llega al conectado');
      socket.broadcast.emit('msn_rest', 'Todos los ven, menos el actual');
      io.emit('msn_all', data);
    });
  });
  

server.listen(8080, () => {
  console.log('Servidor en funcionamiento en el puerto 8080');
});
