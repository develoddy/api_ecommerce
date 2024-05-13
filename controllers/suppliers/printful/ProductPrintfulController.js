//const axios = require('axios');
import axios from "axios";
import models from '../../../models';
import resources from '../../../resources';
import fs from 'fs';
import path from "path";
import  { 
  removeImageVersion  , 
  downloadImage       , 
  extractSKU          , 
  generateSlug        , 
} from "./helper";
import printfulService from '../../../services/suppliers/printful/PrintfulService';
import CategoryService from '../../../services/suppliers/printful/CategoryService';

// GET ALL PRODUCTS
export async function getPrintfulProducts() {
  let verifyExistenceProduct = false;

  // GET PRODUCTS FROM PRINTFUL
  const response = await printfulService.getPrintfulStoreProducts();
  const products = response.result;

  if ( products ) {
    for ( const product of products ) {
      let galerias = [ ];
      let tags     = [ ];
      
      // VERIFY IF EXISTS PRODUCT IN DATABASE
      const existingProduct = await models.Product.findOne({ 
          title: product.name 
      });

      // SI EL PRODUCTO NO EXISTE, ENTONCES CREARLO
      if ( !existingProduct ) {

        let data = {
          title       : "tu_title"        ,
          categorie   : "tu_categorie"    ,
          price_soles : "tut_retail_price",
          price_usd   : "tu_retail_price" ,
          portada     : "tu_portada"      ,
          resumen     : "tu_resumen"      ,
          description : "tu_descripcion"  ,
          sku         : "tu_sku"          ,
          slug        : "tu_slug"         ,
          state       : 2                 ,
          imagen      : "tu_imagen"       ,
          tags        : []                ,
          galerias    : []                ,
        };

        // TITLE
        data.title = product.name;

        // GET DETAIL PRODUCT
        const productDetail = await getPrintfulProductDetails( product.id );

        // SKU
        const sku = await extractSKU( productDetail.sync_variants[ 0 ].sku );
        data.sku = sku;
        
        // RETAIL PRICE
        const retail_price = productDetail.sync_variants[ 0 ].retail_price;
        data.price_soles = retail_price;
        data.price_usd = retail_price;

        // SLUG
        const slug = await generateSlug(product.name);
        data.slug = slug; 
        
        // TAGS
        tags.push(productDetail.sync_variants[ 0 ].color);
        let tagsString = JSON.stringify(tags);
        data.tags = tagsString;

        // SERVICE GET CATEGORY
        const response = await CategoryService.getPrintfulCategory( productDetail.sync_variants[ 0 ].main_category_id );
        const category = response.category;
        const existingCategory = await models.Categorie.findOne({ title: category.title });

        if( existingCategory ) {
          data.categorie = existingCategory._id;
        }

        if ( product.thumbnail_url ) {
            var img_path     = product.thumbnail_url    ;
            var name         = img_path.split('/')      ;
            var portada_name = name[ 5 ]                ;
            data.portada     = portada_name             ;

            // Ruta del directorio de carga (upload)
            const uploadDir = path.resolve( __dirname , '../../../', 'uploads', 'product' );

            // VERIFICA SI EL DIRECTORIO EXISTE, EN CASO CONTRARIO HAY QUE CREARLO.
            if ( !fs.existsSync( uploadDir ) ) { 
                fs.mkdirSync( uploadDir, {  recursive: true, } );
            }

            // RUTA DONDE SE GUARDA LA IMAGEN EN EL SISTEMA DE ARCHIVOS
            const imagePath = path.join( uploadDir, portada_name );

            // DESCARGAR LA IMAGEN DESDE LA URL.
            await downloadImage( img_path, imagePath );

            // AGREGAR LA IMAGEN EN LA GALERIA.
            galerias.push({ 
                imagen: portada_name
            });
        }
        verifyExistenceProduct = true;
        await models.Product.create( data );
      }
      // END IF VALIDATION
    }
  }
  // END PRODUCTS


  if ( verifyExistenceProduct ) {
    console.log("---- DEBUGG: SE HAN INSERTADO UNO O MAS PRODUCTOS -----");
  }

  return true;
}

// GET DETAIL PRODUCT
async function getPrintfulProductDetails(productId) {
  try {
      const response = await printfulService.getPrintfulProductDetail(productId);
      return response.result; // Aquí deberías obtener los detalles del producto
  } catch (error) {
      console.error('Error al obtener los detalles del producto:', error);
      throw new Error('Error al obtener los detalles del producto');
  }
}
