import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';

import mongoose from 'mongoose';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));


app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});
const io = new Server(httpServer);

const DBPATH = "mongodb+srv://rodrigogigena2611:Urnn7PtPTUDLHzIs@cluster0.s1wg4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connectMongoDB = async () => {
    try {
        await mongoose.connect(DBPATH)
        console.log("Conectado a la base de datos")
        
    } catch (error) {
        console.log("Error al conectarse")
    }
}
connectMongoDB();

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('product-added', (product) => {
        console.log('Nuevo producto recibido:', product);
        io.emit('product-added', product);
    });
});
