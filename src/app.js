import express from "express"
import ProductRouter from "./router/produt.routes.js";
import CartRouter from "./router/carts.routes.js";
import {engine} from "express-handlebars"
import * as path from "path"
import http from "http";  
import { Server } from "socket.io";  
import __dirname from "./utils.js";
import ProductManager from "./controllers/ProductManager.js";

const app = express();
const server = http.createServer(app);  
const io = new Server(server);  
global.io = io;

const PORT = 8080;
const product = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//-------> Handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

//-----> Static
app.use("/", express.static(__dirname + "/public"))
let allProducts = await product.getProducts()
app.get("/", async (req, res) =>{
  console.log("Ruta de las vistas:", path.resolve(__dirname, "views"));
  res.render("home", {
    title: "Express Avanzado - Handlebars",
    products: allProducts
  });
})

app.use("/api/products", ProductRouter)
app.use("/api/cart", CartRouter)

//-------> Socket.io
io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  //------> Emite la lista de productos en tiempo real cuando un usuario se conecta
  socket.emit("updateProducts", allProducts);

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });

  //-------> Manejo de eventos del formulario
  socket.on("addProduct", (product) => {
    console.log("Nuevo producto recibido:", product);
  });

  socket.on("deleteProduct", (product) => {
    console.log("Producto a eliminar recibido:", product);
  });
});


app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    title: "Productos en Tiempo Real",
    products: allProducts,
  });
});

server.listen(PORT, () => {
  console.log(`Servidor Express Puerto ${PORT}`);
});