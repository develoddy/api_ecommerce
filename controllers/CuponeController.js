import models from "../models";
import resources from "../resources";
import fs from 'fs';
import path from "path";

export default {
    register: async(req, res) => {
        try {
            let data = req.body;
            let exists_cupone = await models.Cupone.findOne({code: data.code});
            if (exists_cupone) {
                res.status(200).json({
                    message: 403,
                    message_text: "El codigo de cupon ya existe"
                });
                return;
            }

            let cupone = await models.Cupone.create(data);

            res.status(200).json({
                message: 200,
                message_text: "El cupon se registró correctamente",
                cupone: cupone,
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: CuponeController register - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    update: async(req, res) => {
        try {
            let data = req.body;
            let exists_cupone = await models.Cupone.findOne({code: data_code, _id: {$ne: data._id} });
            if (exists_cupone) {
                res.status(200).json({
                    message: 403,
                    message_text: "El codigo de cupon ya existe"
                });
                return;
            }

            let cupone = await models.Cupone.findByIdAndUpdate({_id: data._id},data);
            let cupone_T = await models.Cupone.findById({_id: data._id});

            res.status(200).json({
                message: 200,
                message_text: "El cupon se registró correctamente",
                cupone: cupone_T,
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: CuponeController update - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    remove: async(req, res) => {
        try {
            let _id = req.query._id;
            
            await models.Cupone.findByIdAndDelete({_id: _id});

            res.status(200).json({
                message: 200,
                message_text: "El cupon se eliminó correctamente",
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: CuponeController remove - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    list: async(req, res) => {
        try {
            var search = req.query.search;
            let cupones = await models.Cupone.find({
                $or:[
                    {"code": RegExp(search, "i")},
                ]
            }).sort({'createdAt': -1});

            /*Sliders = Sliders.map((user) => {
                return resources.Slider.slider_list(user);
            });*/

            res.status(200).json({
                message: 200,
                cupones: cupones,
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: CuponeController list - OCURRIÓ UN PROBLEMA"
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
                message: "debbug: CuponeController list - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    }
}