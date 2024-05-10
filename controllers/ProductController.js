//const axios = require('axios');
import axios from "axios";
import models from '../models';
import resources from '../resources';
import fs from 'fs';
import path from "path";
import printfulService from '../services/printful/PrintfulService';

async function downloadImage(imageUrl, localPath) {
    const response = await axios.get(imageUrl, {
        responseType: 'stream'
    });

    // Crea un flujo de escritura para guardar el archivo localmente
    const writer = fs.createWriteStream(localPath);

    // Escribe el contenido del archivo
    response.data.pipe(writer);

    // Retorna una promesa que resuelve cuando se completa la escritura del archivo
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function extractSKU(str) {
    const skuPattern = /sku:(\w+)_\w/;
    const match = str.match(skuPattern);
    if (match) {
        return match[1]; // El primer grupo de captura contiene el SKU
    } else {
        return "tu-sku"; // Si no se encuentra ninguna coincidencia, devolvemos null
    }
}


/**
 * ------------------------------------------------------------------
 * -                        PRINTFUL                                -
 * ------------------------------------------------------------------
 * 
 * DESCRIPTION: Realiza una solicitud para obtener los productos de 
 *              Printful y esperar la respuesta.
 * 
 * Construye un objeto 'data' con los detalles del producto para guardar en la base de datos.
 * Verifica si el producto ya existe en la base de datos.
 * Si el producto tiene una URL de imagen, extrae el nombre del archivo de la URL de la imagen
 * Define la ruta donde se guardará la imagen en el sistema de archivos
 * Descarga la imagen desde la URL y la guarda en el sistema de archivos
 * Crea el producto en la base de datos utilizando los datos construidos
 * 
 */
async function getPrintfulProducts() {
    let verifyExistenceProduct = false;

    const response = await printfulService.getPrintfulStoreProducts();
    const printfulProducts = response.result;

    for ( const product of printfulProducts ) {

        let galerias = [ ];

        // OBTENER EL DETALLE DE CADA PRODUCTO
        const productDetail = await getProductDetails(product.id);

        const sku = await extractSKU(product.sync_variants[0].sku); 

        let data = {
            title       : product.name              ,
            categorie   : "tu_categorie"            ,
            price_soles : 0                         ,
            price_usd   : 0                         ,
            portada     : "tu_portada"              ,
            resumen     : "tu_resumen"              ,
            description : "tu_descripcion"          ,
            sku         : sku                       ,
            imagen      : "tu_imagen"               ,
            tags        : '["Negro","Luces Led"]'   ,
            galerias    : galerias                  ,
        };
        // const responsePrintfulProducts  = await printfulService.getPrintfulProductDetail( product.id );
        // const printfulProductDetail = responsePrintfulProducts.result;

        // Verificar si el producto ya existe en la base de datos
        const existingProduct = await models.Product.findOne({ 
            title: product.name 
        });

        if ( !existingProduct ) {
            // SI EL PRODUCTO NO EXISTE, ENTONCES REALIZAR A CREARLO.
            if ( product.thumbnail_url ) {
                var img_path     = product.thumbnail_url    ;
                var name         = img_path.split('/')      ;
                var portada_name = name[ 5 ]                ;
                data.portada     = portada_name             ;

                // Ruta del directorio de carga (upload)
                const uploadDir = path.resolve(
                    __dirname   , 
                    '..'        , 
                    'uploads'   , 
                    'product'   ,
                );

                // VERIFICA SI EL DIRECTORIO EXISTE, EN CASO CONTRARIO HAY QUE CREARLO.
                if ( !fs.existsSync( uploadDir ) ) { 
                    fs.mkdirSync( uploadDir, {  recursive: true, });
                }

                // RUTA DONDE SE GUARDA LA IMAGEN EN EL SISTEMA DE ARCHIVOS
                const imagePath = path.join(uploadDir, portada_name );

                // DESCARGAR LA IMAGEN DESDE LA URL.
                await downloadImage(img_path, imagePath );

                // AGREGAR LA IMAGEN EN LA GALERIA.
                galerias.push({ 
                    imagen: portada_name
                });
            }

            verifyExistenceProduct = false;
        
        } else {
            // SI EL PRODUCTO EXISTE, ENTONCES REALIZAR EL MODIFICADO
            verifyExistenceProduct = true;
        }

        
        // Si el producto no existe, crearlo
        if ( !verifyExistenceProduct ) {
            await models.Product.create( data ); 
            console.log("-------Si el producto no existe, crearlo......");
            console.log(data);

        } else {
            // Si el producto existe, modificarlo
            console.log("-------Si el producto existe, modificarlo......");
            console.log(data);
        }
    }
    return true;
}


/**
 * ------------------------------------------------------------------
 * -                        PRINTFUL                                -
 * ------------------------------------------------------------------
 * 
 * DESCRIPTION: Realiza una solicitud para obtener los productos de 
 *              Printful y esperar la respuesta.
 * 
 */
async function getPrintfulProductDetails(productId) {
    try {
        const response = await printfulService.getPrintfulProductDetail(productId);
        return response.result; // Aquí deberías obtener los detalles del producto
    } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
        throw new Error('Error al obtener los detalles del producto');
    }
}

// END PROVEDOR DE PRINTFUL



/**
 * ------------------------------------------------------------------
 * -                        OTRO PROVEEDOR                          -
 * ------------------------------------------------------------------
 * 
 * DESCRIPTION: Realiza una solicitud para obtener los productos de 
 *              de otro proveedor y esperar la respuesta.
 * 
 * 
 */
// async function processOtherProviderProducts() {}



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
                const printfulProducts = await getPrintfulProducts();

                // OBTENER PRODUCTOS DE OTROS PROVEDORES
                // --
                // --
                // --
                // --
                
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