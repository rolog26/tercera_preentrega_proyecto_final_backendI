import { Router } from 'express';
import { productModel } from '../models/products.model.js';
import isValidProductId from '../middlewares/isValidProductId.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let products = await productModel.find().limit(limit);

        res.json({ result: 'success', payload: products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al obtener los productos de la base de datos' });
    }
});

router.get('/:pid', isValidProductId, async (req, res) => {
    try {
        const productId = req.params.pid;
        let product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ result: 'error', error: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al obtener el producto de la base de datos' });
    }
});

router.post('/', async (req, res) => {
    try {
        let { title, description, price, code, stock, category, thumbnail } = req.body;

        if (!title || !description || !price || !code || !stock || !category) {
            return res.status(400).json({ result: 'error', error: 'Todos los campos son obligatorios excepto thumbnail' });
        }

        const newProduct = await productModel.create({ title, description, price, code, stock, category, thumbnail });
        res.status(201).json({ result: 'success', payload: newProduct });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al agregar el producto a la base de datos' });
    }
});

router.put('/:pid', isValidProductId, async (req, res) => {
    try {
        let productToUpdate = req.body;
        const productId = req.params.pid;

        let updatedProduct = await productModel.findByIdAndUpdate(productId, productToUpdate, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ result: 'error', error: 'Producto no encontrado' });
        }

        res.json({ result: 'success', payload: updatedProduct });

    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al actualizar el producto de la base de datos' });
    }
});

router.delete('/:pid', isValidProductId, async (req, res) => {
    try {
        const productId = req.params.pid;
        
        let deletedProduct = await productModel.findByIdAndDelete(productId);
        if (!deletedProduct) {
            res.status(404).json({ result: 'error', error: 'No se pudo eliminar el producto' });
        }

        res.json({ result: 'success', payload: deletedProduct });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al eliminar el producto de la base de datos' });
    }
});


export default router;