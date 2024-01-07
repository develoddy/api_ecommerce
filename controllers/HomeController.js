import models from "../models";
import resources from "../resources";

export default {
    list: async(req, res) => {
        try {
            let Sliders = await models.Slider.find({state:1});
            Sliders = Sliders.map((slider) => {
                return resources.Slider.slider_list(slider);
            });

            let Categories = await models.Categorie.find({state:1});
            Categories = Categories.map((categorie) => {
                return resources.Categorie.categorie_list(categorie);
            });

            let BestProducts = await models.Product.find({state:2}).sort({"createdAt": -1});

            var ObjectBestProducts = [];
            for (const Product of BestProducts) {
                let variedades = await models.Variedad.find({product: Product._id});
                ObjectBestProducts.push(resources.Product.product_list(Product,variedades));
            }

            let OurProducts = await models.Product.find({state:2}).sort({"createdAt": 1});
            var ObjectOurProducts = [];
            for (const Product of OurProducts) {
                let variedades = await models.Variedad.find({product: Product._id});
                ObjectOurProducts.push(resources.Product.product_list(Product,variedades));
            }
            /*OurProducts = OurProducts.map(async(product) => {
                let variedades = await models.Variedad.find({product: product._id});
                return resources.Product.product_list(product,variedades);
            });*/

            res.status(200).json({
                sliders: Sliders,
                categories: Categories,
                bes_products: ObjectBestProducts,
                our_products: ObjectOurProducts,
            });

        } catch (error) {
            res.status(500).send({
                message: "Ocurrio un problema"
            });
            console.log(error);
        }
    }
}