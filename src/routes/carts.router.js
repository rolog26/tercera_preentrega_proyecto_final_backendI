import { Router } from 'express';
import { cartModel } from '../models/carts.model.js';
import { productModel } from '../models/products.model.js';
import isValidProductId from '../middlewares/isValidProductId.js';
import isValidCartId from '../middlewares/isValidCartId.js';
import findCart from '../middlewares/findCart.js';
import findProductInCart from '../middlewares/findProductInCart.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] });
        res.status(201).json({ result: 'success', payload: newCart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al crear el carrito' });
    }
});

router.get('/:cid', isValidCartId, findCart, async (req, res) => {
    try {
        const cart = req.cart;

        res.json({ result: 'success', payload: cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al obtener el carrito' });
    }
});

router.post('/:cid/products/:pid', isValidCartId, findCart, isValidProductId, async (req, res) => {
    try {
        const productId = req.params.pid;

        const cart = req.cart;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ result: 'error', error: 'Producto no encontrado' });        
        }

        const existingProductIndex = cart.products.findIndex(item => item.product._id.toString() === productId);
        if (existingProductIndex >= 0) {
            cart.products[existingProductIndex].quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();

        res.json({ result: 'success', payload: cart.products });

    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al agregar el producto al carrito' });
    }
});

router.put('/:cid', isValidCartId, findCart, async (req, res) => {
    try {
        const cart = req.cart;

        cart.products = req.body.products;

        await cart.save();

        res.json({ result: 'success', payload: cart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al actualizar el carrito' });
    }
});

router.put('/:cid/products/:pid', isValidCartId, isValidProductId, findCart, findProductInCart, async (req, res) => {
    try {
        const { cart, productIndex } = req;

        cart.products[productIndex].quantity = req.body.quantity;

        await cart.save();

        res.json({ result: 'success', payload: cart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al actualizar el producto en el carrito' });
    }
});

router.delete('/:cid/products/:pid', isValidCartId, isValidProductId, findCart, findProductInCart, async (req, res) => {
    try {
        const { cart, productIndex } = req;

        cart.products.splice(productIndex, 1);

        await cart.save();

        res.json({ result: 'success', payload: cart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al eliminar el producto del carrito' });
    }
});

router.delete('/:cid', isValidCartId, async (req, res) => {
    try {
        const cartId = req.params.cid;

        const updatedCart = await cartModel.findByIdAndUpdate(cartId,
            { products: [] },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({ result: 'error', error: 'Carrito no encontrado' });
        }

        res.json({ result: 'success', payload: updatedCart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al eliminar los productos del carrito' });
    }
});

export default router;