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
    apllyCupon: async(req, res) => {
        try {
            let data = req.body;
            // LA PRIMERA VALIDACION TIENE QUE VER CON LA EXISTENCIA DEL CUPON
            let CUPON = await models.Cupone.findOne({
                code: data.code,
            });

            if (!CUPON) {
                res.status(200).json({
                    message:403,
                    message_text: "El cupon ingresado no existe, digite otro nuevamente"
                });
                return;
            }
            // TIENE CON EL USO DEL CUPON -- VA ESTAR EN ESPERA...

            // LA PARTE OPERATIVA
            let carts = await models.Cart.find({user: data.user_id}).populate("product");
            let products = [];
            let categories = [];

            CUPON.products.forEach((product) => {
                products.push(product._id);
            });
            //
            CUPON.categories.forEach((categorie) => {
                categories.push(categorie._id);
            });

            for (const cart of carts) {
                if (products.length > 0) {
                    if (products.includes(cart.product._id+"")) {
                        let subtotal = 0;
                        let total = 0;
                        if (CUPON.type_discount == 1) { // PORT PORCENTAJE
                            //subtotal = cart.price_unitario - cart.price_unitario*(CUPON.discount*0.01);
                            //let precioRedondeado = parseFloat(precio.toFixed(2));
                            subtotal = parseFloat((cart.price_unitario - cart.price_unitario*(CUPON.discount*0.01)).toFixed(2));
                        } else { // PORT MONEDA
                            subtotal = cart.price_unitario - CUPON.discount;
                        }

                        total = subtotal * cart.cantidad;
                        await models.Cart.findByIdAndUpdate({_id: cart._id}, {
                            subtotal: subtotal,
                            total: total,
                            type_discount: CUPON.type_discount,
                            discount: CUPON.discount,
                            code_cupon: CUPON.code,
                        });
                    }
                }

                if (categories.length > 0) {
                    if (categories.includes(cart.product.categorie+"")) {
                        let subTotal = 0;
                        let total = 0;
                        if (CUPON.type_discount == 1) { // PORT PORCENTAJE
                            subTotal = cart.price_unitario - cart.price_unitario*(CUPON.discount*0.01);
                        } else { // PORT MONEDA
                            subTotal = cart.price_unitario - CUPON.discount;
                        }

                        total = subTotal * cart.cantidad;
                        await models.Cart.findByIdAndUpdate({_id: cart._id}, {
                            subTotal: subTotal,
                            total: total,
                            type_discount: CUPON.type_discount,
                            discount: CUPON.discount,
                            code_cupon: CUPON.code,
                        });
                    }
                }
            }
            res.status(200).json({
                message: 200,
                message_text: "El cupon es aplicado correctamente",
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: CartController apllyCupon OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    }
}