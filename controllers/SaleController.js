import models from "../models";
//import resources from "../resources";

export default {
    register: async(req, res) => {
        try {
            let sale_data = req.body.sale;
            let sale_address_data = req.body.sale_address;

            let SALE = await models.Sale.create(sale_data);
            
            sale_address_data.sale = SALE._id;
            let SALE_ADRESS = await models.SaleAddress.create(sale_address_data);

            let CARTS = await models.Cart.find({user: SALE.user});

            for (let CART of CARTS) {
                CART = CART.toObject();
                CART.sale = SALE._id;
                // EJECUTAR EL DESCUENTO DE INVENTARIO
                if (CART.variedad) { // MULTIPLE INVENTARIO
                    let VARIEDAD = await models.Variedad.findById({_id: CART.variedad});

                    let new_stock = VARIEDAD.stock - CART.cantidad;
                    await models.Variedad.findByIdAndUpdate({_id: CART.variedad}, {
                        stock: new_stock,
                    });
                } else { // UNITARIO INVENTARIO
                    let PRODUCT = await models.Product.findById({_id: CART.product});
                    let new_stock = PRODUCT.stock - CART.cantidad;

                    await models.Product.findByIdAndUpdate({_id: CART.product}, {
                        stock: new_stock,
                    });
                }
                //
                await models.SaleDetail.create(CART);
                await models.Cart.findByIdAndDelete({_id: CART._id});
            }

            res.status(200).json({
                message: "LA orden se genero correctamente",
            })
        } catch (error) {
            res.status(500).send({
                message: "debbug: SaleController register OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
}