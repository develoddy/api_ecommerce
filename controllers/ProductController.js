import models from '../models';
import resources from '../resources';
import fs from 'fs';
import path from "path";

/**
 * 
 * ------------------------------------------------------------------
 * -           METODOS PRINCIPALES DEL CONTROLADOR                  -
 * ------------------------------------------------------------------
 *
 */
export default {
    register: async(req, res) => {
        try {
            let data = req.body;

            let valid_Product = await models.Product.findOne({title: data.title});

            if(valid_Product) {
                res.status(200).send({
                    code: 403,
                    message: "El producto ya existe"
                });
                return;
            }

            data.slug = data.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            
            if (req.files) {
                var img_path = req.files.imagen.path;
                var name = img_path.split('/');
                var portada_name = name[2];
                data.portada = portada_name;
            }

            let product = await models.Product.create(data);

            res.status(200).json({
                message: "El Producto se registró correctamente"
            });

        } catch (error) {
            res.status(500).send({
                message: "Debugg: ProducController - Ocurrio un problema en Register"
            });
        }
    },
    update: async(req, res) => {
        try {
            let data = req.body;

            let valid_Product = await models.Product.findOne({title: data.title, _id: {$ne: data._id} });

            if(valid_Product) {
                res.status(200).send({
                    code: 403,
                    message: "El producto ya existe"
                });
                return;
            }

            data.slug = data.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');

            if (req.files && req.files.imagen) {
                var img_path = req.files.imagen.path;
                var name = img_path.split('/');
                var portada_name = name[2];
                data.portada = portada_name;
            }

            await models.Product.findByIdAndUpdate({_id: data._id}, data);

            res.status(200).json({
                message: "El Registro se ha modificado correctamente"
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "Debugg: ProducController - Ocurrio un problema en Update"
            });
        }
    },
    list: async(req, res) => {
        try {
            var filter      = [];
            var products    = null;

            if ( req.query.search ) {
                filter.push(
                    {"title": new RegExp(req.query.search, 'i')},
                );
            }
            if ( req.query.categorie ) {
                filter.push(
                    {"categorie": req.query.categorie},
                );
            }
            if( filter.length > 0 ) {
                products = await models.Product.find({
                    $and: filter,
                }).populate('categorie')

                products = products.map( product => {
                    return resources.Product.product_list( product );
                });
            } else {
                // OBTENER PRODUCTOS DEL PROVEEDOR DE PRINTFUL
                //const printfulProducts = await getPrintfulProducts();
                
                // BUSCAR LAS CATEGORIAS
                products = await models.Product.find().populate('categorie')
                products = products.map( product => {
                    return resources.Product.product_list( product );
                });
            }
            res.status( 200 ).json({
                products: products,
            });
        } catch ( error ) {
            res.status( 500 ).send({
                message: "debbug: ProductController list - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    remove: async(req, res) => {
        try {
            let _id = req.query._id;
            await models.Product.findByIdAndDelete({_id: _id});
            res.status(200).json({
                message: "El producto se ha eliminado correctamente"
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: ProductController remove - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    getImage: async(req, res) => {
        try {
            var img = req.params['img'];

            fs.stat('./uploads/product/'+img, function(err){
                if(!err){
                    let path_img = './uploads/product/'+img;
                    res.status(200).sendFile(path.resolve(path_img));
                }else{
                    let path_img = './uploads/default.jpg';
                    res.status(200).sendFile(path.resolve(path_img));
                }
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: ProductController getImage - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    register_imagen: async(req, res) => {
        try {
            var img_path = req.files.imagen.path;
            var name = img_path.split('/');
            var imagen_name = name[2];

            let product = await models.Product.findByIdAndUpdate({_id: req.body._id}, {
                $push: {
                    galerias: {
                        imagen: imagen_name,
                        _id: req.body.__id
                    }
                }
            });
            res.status(200).json({
                message: "La imagen se subió perfectamente",
                imagen: {
                    //imagen: imagen_name,
                    imagen: 'http://localhost:3000'+'/api/products/uploads/product/'+imagen_name,
                    _id: req.body.__id
                }
            })
        } catch (error) {
            res.status(500).send({
                message: "debbug: ProductController register_imagen - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    remove_imagen: async(req, res) => {
        try {
            await models.Product.findByIdAndUpdate({_id: req.body._id}, {
                $pull: {
                    galerias: {
                        _id: req.body.__id
                    }
                }
            });
            res.status(200).json({
                message: "La imagen se eliminó perfectamente",
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: ProductController remove_imagen - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    show: async(req, res) => {
        try {
            var product_id = req.params.id;
            let product = await models.Product.findById({_id: product_id}).populate("categorie");
            let variedades = await models.Variedad.find({product: product_id});
            res.status(200).json({
                product: resources.Product.product_list(product, variedades)
            })
        } catch (error) {
            res.status(500).send({
                message: "debbug: ProductController show - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    webhook: async(req, res) => {
        try {
            // Maneja la solicitud del webhook aquí
            console.log("------ Debugg: Product controller: webhook -------");
            console.log('Solicitud de webhook recibida:', req.body);
            // Procesa los datos y actualiza tu base de datos
            // ...
            res.status(200).send('Solicitud de webhook recibida correctamente');
        } catch (error) {
            res.status(500).send({
                message: "debbug: ProductController webhook - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
}