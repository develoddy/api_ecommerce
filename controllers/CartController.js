import models from "../models";
//import bcrypt from 'bcryptjs';
//import token from "../services/token";
import resources from "../resources";


export default {
    list: async(req, res) => {
        try {
            let user_id = req.query.user_id;
            let CARTS = await models.Cart.find({
                user: user_id,
            }).populate("variedad").populate({
                path: "product",
                populate: {
                    path: "categorie"
                }
            });

            CARTS = CARTS.map((cart) => {
                return resources.Cart.cart_list(cart)
            });

            res.status(200).json({
                carts: CARTS,
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: CartController list OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    register: async(req, res) => {
        try {
            let data = req.body;
            // PRIMERO VAMOS A VALIDAR SI EL PRODUCTO EXISTE EN EL CARRITO DE COMPRA
            if(data.variedad) {
                let valid_cart = await models.Cart.findOne({
                    user: data.user,
                    variedad: data.variedad,
                    product: data.product,
                });
                if (valid_cart) {
                    res.status(200).json({
                        message: 403,
                        message_text: "El producto con la variedad ya existe en el carrito de compra",
                    });
                    return;
                }
            } else {
                // AQUI SERIA PRODUCTO DE INVENTARIO UNITARIO
                let valid_cart = await models.Cart.findOne({
                    user: data.user,
                    product: data.product,
                });
                if (valid_cart) {
                    res.status(200).json({
                        message: 403,
                        message_text: "El producto ya existe en el carrito de compra",
                    });
                    return;
                }
            }
            
            // SEGUNDO VAMOS A VALIDAR SI EL STOCK ESTÁ DISPONIBLE
            if(data.variedad) {
                let valid_variedad = await models.Variedad.findOne({
                    _id: data.variedad,
                });
                if (valid_variedad.stock < data.cantidad) {
                    res.status(200).json({
                        message: 403,
                        message_text: "El stock no está disponible!",
                    });
                    return;
                }
            } else {
                // AQUI SERIA PRODUCTO DE INVENTARIO UNITARIO
                let valid_product = await models.Product.findOne({
                    _id: data.product,
                });
                if (valid_product.stock < data.cantidad) {
                    res.status(200).json({
                        message: 403,
                        message_text: "El stock no está disponible!",
                    });
                    return;
                }
            }

            let CART = await models.Cart.create(data);

            let NEW_CART = await models.Cart.findById({_id: CART._id}).populate("variedad").populate({
                path: "product",
                populate: {
                    path: "categorie"
                }
            });

            res.status(200).json({
                cart: resources.Cart.cart_list(NEW_CART),
                message_text: "El carrito se registro con exito!",
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: CartController register:  OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    update: async(req, res) => {
        try {
            let data = req.body;
            // SEGUNDO VAMOS A VALIDAR SI EL STOCK ESTÁ DISPONIBLE
            if(data.variedad) {
                let valid_variedad = await models.Variedad.findOne({
                    _id: data.variedad,
                });
                if (valid_variedad.stock < data.cantidad) {
                    res.status(200).json({
                        message: 403,
                        message_text: "El stock no está disponible!",
                    });
                    return;
                }
            } else {
                // AQUI SERIA PRODUCTO DE INVENTARIO UNITARIO
                let valid_product = await models.Product.findOne({
                    _id: data.product,
                });
                if (valid_product.stock < data.cantidad) {
                    res.status(200).json({
                        message: 403,
                        message_text: "El stock no está disponible!",
                    });
                    return;
                }
            }

            let CART = await models.Cart.findByIdAndUpdate({_id: data._id}, data);
            let NEW_CART = await models.Cart.findById({_id: CART._id}).populate("variedad").populate({
                path: "product",
                populate: {
                    path: "categorie"
                }
            });
            res.status(200).json({
                cart: resources.Cart.cart_list(NEW_CART),
                message_text: "El cartito se actualizó con exito!",
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: CartController OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    delete: async(req, res) => {
        try {
            let _id = req.params.id;
            let CART = await models.Cart.findByIdAndDelete({_id: _id});
            res.status(200).json({
                message_text: "El cartito se eliminó correctamente!",
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: CartController delete OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
}