import models from '../models';
export default {
    register: async(req, res) => {
        try {
            let data = req.body;
            let valid_Product = await models.Product.findOne({title: data.title});
            if(valid_Product) {
                res.status(200).send({
                    code: 403,
                    message: "Eñ producto ya existe"
                });
            }

            data.slug = data.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            let product = await models.Product.create(data);

            if (req.files) {
                var img_path = req.files.imagen.path;
                var name = img_path.split('\\');
                var portada_name = name[2];
                req.body.imagen = portada_name;
            }

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

            let valid_Product = await models.Product.findOne({title: data.title, _id: {$ne: data_._id} });

            if(valid_Product) {
                res.status(200).send({
                    code: 403,
                    message: "Eñ producto ya existe"
                });
            }

            data.slug = data.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            if (req.files && req.files.imagen) {
                var img_path = req.files.imagen.path;
                var name = img_path.split('\\');
                var portada_name = name[2];
                req.body.imagen = portada_name;
            }

            await models.Product.findByIdAndUpdate({_id: data._id}, data);

            res.status(200).json({
                message: "El Registro se ha modificado correctamente"
            });

        } catch (error) {
            res.status(500).send({
                message: "Debugg: ProducController - Ocurrio un problema en Register"
            });
        }
    },
    list: async(req, res) => {
        try {
            var search = req.query.search;
            var categorie = req.query.categorie;
            let products = await models.Product.find({
                $or:[
                    {"title": new RegExp(search, 'i')},
                    {"categorie": categorie},
                ],
            }).populate('categorie')

            products = products.map(product => {
                return resources.Product.product_list(product);
            });

            res.status(200).json({
                products: products
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: ProductController list - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    remove: async(req, res) => {
        try {
            let _id = req.params._id;
            await models.Product.findByIdAndDelete({_id: _id});
            resizeTo.status(200).json({
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
            })
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
            var name = img_path.split('\\');
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
                    imagen: imagen_name,
                    imagen_path: 'http://localhost:3000/'+'/uploads/product/'+imagen_name,
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
            })
        } catch (error) {
            res.status(500).send({
                message: "debbug: ProductController remove_imagen - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    }
}