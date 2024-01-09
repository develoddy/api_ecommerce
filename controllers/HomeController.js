import models from "../models";
import resources from "../resources";

export default {
    list: async(req, res) => {
        try {

            var TIME_NOW = req.query.TIME_NOW;

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
            //OurProducts = OurProducts.map(async(product) => {
            //    let variedades = await models.Variedad.find({product: product._id});
            //    return resources.Product.product_list(product,variedades);
            //});

            let FlashSale = await models.Discount.findOne({
                type_campaign: 2,
                start_date_num: {$lte: TIME_NOW}, // <=
                end_date_num: {$gte: TIME_NOW},  // >=
            });

            let ProductList = [];

            if (FlashSale) {
                for (const product of FlashSale.products) {
                    var ObjectT = await models.Product.findById({_id: product._id});
                    let variedades = await models.Variedad.find({product: product._id});
                    ProductList.push(resources.Product.product_list(ObjectT,variedades));
                }
            } else {
                console.log("No hay FlashSale");
                FlashSale = null;
                ProductList = [];
            }

            res.status(200).json({
                sliders: Sliders,
                categories: Categories,
                bes_products: ObjectBestProducts,
                our_products: ObjectOurProducts,
                FlashSale: FlashSale,
                campaign_products: ProductList,
            });

        } catch (error) {
            res.status(500).send({
                message: "Ocurrio un problema"
            });
            console.log(error);
        }
    },

    show_landing_product:async(req, res) => {
        try {
            let SLUG = req.params.slug;
            let Product = await models.Product.findOne({slug: SLUG, state: 2});
            
            let VARIEDADES = await models.Variedad.find({product: Product._id});

            let RelateProducts = await models.Product.find({categorie: Product.categorie, state: 2});
            var ObjectRelateProducts = [];
            for (const Product of RelateProducts) {
                let variedades = await models.Variedad.find({product: Product._id});
                ObjectRelateProducts.push(resources.Product.product_list(Product,variedades));
            }
            res.status(200).json({
                product: resources.Product.product_list(Product, VARIEDADES),
                related_products: ObjectRelateProducts,
            })
        } catch (error) {
            res.status(500).send({
                message: "Ocurrio un problema"
            });
            console.log(error);
        }
    },
}