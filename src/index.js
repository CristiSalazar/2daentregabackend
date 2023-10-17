import express from "express"
import prodRouter from "./router/product.routes.js"
import cartRouter from "./router/carts.routes.js"
import ProductManager from "./controllers/ProductManager.js"
import CartManager from "./controllers/CartManager.js"
import mongoose from "mongoose"
import { engine } from "express-handlebars"
import * as path from "path"
import __dirname from "./utils.js"


const app = express()
const PORT = 8080
const product = new ProductManager()
const cart = new CartManager()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api/carts", cartRouter)
app.use("/api/products", prodRouter)


app.listen(PORT,()=>{console.log("Escuchando en puerto 8080")})

mongoose.connect("mongodb+srv://cristinasalazar125:m123456789@cluster0.tomc32z.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log("Conectado a la base de datos")
})
.catch(error => {
    console.error("Error al conectarse a la base de datos" + error)
})

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))


app.use("/", express.static(__dirname + "/public"))

app.get("/carts/:cid", async(req,res)=>{
    let id = req.params.cid
    let allCarts = await cart.getCartsWithProducts(id)
    res.render("viewCart", {
        title: "vista del carro",
        carts: allCarts
    })
})

app.get("/products", async(req,res)=>{
    let allProducts = await product.getProducts()
    allProducts = allProducts.map(product=>product.toJSON())
    res.render("viewProducts", {
        title: "vista de los productos",
        products: allProducts
    })
})


