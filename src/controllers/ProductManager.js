import { promises as fs } from 'fs';
import { nanoid } from 'nanoid';

class ProductManager {
    constructor() {
        this.path = "./src/models/product.json";
    }

    readProducts = async () =>{
        let products = await fs.readFile(this.path, "utf-8");
        return JSON.parse(products);
    }

    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product));

    }

    exist = async (id) => {
        let products = await this.readProducts();
        return products.find(prod => prod.id === id)
    }


    addProducts = async (product) =>{
        let productsOld = await this.readProducts();
        product.id = nanoid()
        let productALL = [...productsOld, product];
        await this.writeProducts(productALL);
        return "Producto Agregado";
    };

    getProducts = async () =>{
        return await this.readProducts()
    };


    getProductsById = async (id) =>{
        let productById = await this.exist(id)
        if(!productById) return "Producto no Encontrado"
        return productById
    };

    deleteProducts = async (id) =>{
        let product = await this.readProducts();
        let existProducts = product.some(prod => prod.id === id)
        if (existProducts) {
        let filterProducts = product.filter(prod => prod.id != id)
        await this.writeProducts(filterProducts)
        return "Producto Eliminado"
        }
        return "El Producto a Eliminar no Existe"
    }

    updateProducts = async (id, product) => {
        let productById = await this.exist(id)
        if(!productById) return "Producto no Encontrado"
        await this.deleteProducts(id)
        let productsOld = await this.readProducts()
        let products = [{...product, id : id}, ...productsOld]
        await this.writeProducts(products)
        return "Producto Actualizado"
    }

    addProducts = async (product) => {
        let productsOld = await this.readProducts();
        product.id = nanoid();
        let productALL = [...productsOld, product];
        await this.writeProducts(productALL);
        //-----> Emite los eventos a través de Socket.io
        io.emit("updateProducts", productALL);
        return "Producto Agregado";
    };

    
    deleteProducts = async (id) => {
        let product = await this.readProducts();
        let existProducts = product.some((prod) => prod.id === id);
        if (existProducts) {
            let filterProducts = product.filter((prod) => prod.id != id);
            await this.writeProducts(filterProducts);
            io.emit("updateProducts", filterProducts);
            return "Producto Eliminado";
        }
        return "El Producto a Eliminar no Existe";
    };


};

export default ProductManager


