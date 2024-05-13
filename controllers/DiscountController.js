import models from "../models";
import resources from "../resources";
import fs from 'fs';
import path from "path";

export default {
    register: async(req, res) => {
        try {
            let data = req.body;
            var filter_a = [];
            var filter_b = [];
            //product_s = ["id", "id"]
            //categorie_s = ["id", "id"]

            if (data.type_segment == 1) {
                filter_a.push({
                    "products": {$elemMatch: {_id: {$in: data.product_s}}}
                });
                filter_b.push({
                    "products": {$elemMatch: {_id: {$in: data.product_s}}}
                });
            } else {
                filter_a.push({
                    "categories": {$elemMatch: {_id: {$in: data.categorie_s}}}
                });
                filter_b.push({
                    "categories": {$elemMatch: {_id: {$in: data.categorie_s}}}
                });
            }

            filter_a.push({
                type_campaign:data.type_campaign,
                start_date_num: {$gte: data.start_date_num, $lte: data.end_date_num}
            });

            filter_b.push({
                type_campaign:data.type_campaign,
                end_date_num: {$gte: data.start_date_num, $lte: data.end_date_num}
            });

            let exists_start_date = await models.Discount.find({$and: filter_a});

            let exists_end_date = await models.Discount.find({$and: filter_b});

            if (exists_start_date.length > 0 || exists_end_date.length > 0 ) {
                res.status(200).json({
                    message: 403,
                    message_text: "El descuento no se puede programar eliminar algunas opciones..11"
                });
                return;
            }

            let discount = await models.Discount.create(data);

            res.status(200).json({
                message: 200,
                message_text: "El descuento se registró correctamente",
                discount: discount,
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: DiscountController register - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    update: async(req, res) => {
        try {
            let data = req.body;
            var filter_a = [];
            var filter_b = [];
            //product_s = ["id", "id"]
            //categorie_s = ["id", "id"]

            if (data.type_segment == 1) {
                filter_a.push({
                    "products": {$elemMatch: {_id: {$in: data.product_s}}}
                });
                filter_b.push({
                    "products": {$elemMatch: {_id: {$in: data.product_s}}}
                });
            } else {
                filter_a.push({
                    "categories": {$elemMatch: {_id: {$in: data.categorie_s}}}
                });
                filter_b.push({
                    "categories": {$elemMatch: {_id: {$in: data.categorie_s}}}
                });
            }

            filter_a.push({
                type_campaign:data.type_campaign,
                _id: {$ne: data._id},
                start_date_num: {$gte: data.start_date_num, $lte: data.end_date_num}
            });

            filter_b.push({
                type_campaign:data.type_campaign,
                _id: {$ne: data._id},
                end_date_num: {$gte: data.start_date_num, $lte: data.end_date_num}
            });

            let exists_start_date = await models.Discount.find({$and: filter_a});

            let exists_end_date = await models.Discount.find({$and: filter_b});

            if (exists_start_date.length > 0 || exists_end_date.length > 0 ) {
                res.status(200).json({
                    message: 403,
                    message_text: "El descuento no se puede programar eliminar algunas opcioness..22"
                });
                return;
            }

            let discount = await models.Discount.findByIdAndUpdate({_id: data._id},data);

            res.status(200).json({
                message: 200,
                message_text: "El descuento se registró correctamente",
                discount: discount,
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: DiscountController update - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    remove: async(req, res) => {
        try {
            let _id = req.query._id;
            
            await models.Discount.findByIdAndDelete({_id: _id});

            res.status(200).json({
                message: 200,
                message_text: "El descuento se eliminó correctamente",
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: DiscountController remove - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    list: async(req, res) => {
        try {
            // var search = req.query.search;
            let discounts = await models.Discount.find().sort({'createdAt': -1});

            res.status(200).json({
                message: 200,
                discounts: discounts,
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: DiscountController list - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    show:async(req, res) => {
        try {
            var discount_id = req.query.discount_id;

            let discount = await models.Discount.findOne({_id: discount_id});

            res.status(200).json({
                message: 200,
                discount: discount,
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: DiscountController show - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    config:async(req, res) => {
        try {
            
            let Products = await models.Product.find({state:2});
            let Categories = await models.Categorie.find({state:1});

            res.status(200).json({
                message: 200,
                products: Products,
                categories: Categories
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: DiscountController config - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    }
}