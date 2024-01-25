import { promises as fs } from 'fs';
import { nanoid } from 'nanoid';
import ProductManager from './ProductManager.js';


const productAll = new ProductManager

class CartManager{
    constructor() {
        this.path = "./src/models/carts.json";
    };

    readCarts = async () =>{
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    };

    writeCarts = async (cart) => {
        await fs.writeFile(this.path, JSON.stringify(cart));

    };

    exist = async (id) => {
        let carts = await this.readCarts();
        return carts.find(cart => cart.id === id)
    }

    addCarts = async () => {
        let cartOld = await this.readCarts();
        let id = nanoid()
        let cartsConcat = [{id : id, products : []}, ...cartOld]
        await this.writeCarts(cartsConcat)
        return "Carrito Agregado"

    }

    getCartsById = async (id) =>{
        let CartById = await this.exist(id)
        if(!CartById) return "Carrito no Encontrado"
        return CartById
    };

    addProductInCart = async (cartId, productId) => {
        let CartById = await this.exist(cartId);
        if (!CartById) return "Carrito no Encontrado";
        
        if (!CartById.products) {
            CartById.products = [];
        }
    
        let productById = await productAll.exist(productId);
        if (!productById) return "Producto no Encontrado";
    
        let cartsAll = await this.readCarts();
        let cartFilter = cartsAll.filter((cart) => cart.id !== cartId);
    
        if (CartById.products.some((prod) => prod.id === productId)) {
            let moreProductInCart = CartById.products.find((prod) => prod.id === productId);
            moreProductInCart.cantidad++;
            let cartsConcat = [CartById, ...cartFilter];
            await this.writeCarts(cartsConcat);
            return "Producto Sumado al Carrito";
        }
    
        CartById.products.push({ id: productById.id, cantidad: 1 });
        let cartsConcat = [CartById, ...cartFilter];
        await this.writeCarts(cartsConcat);
        return "Producto Agregado al Carrito";
    };
    
    

}

export default CartManager
