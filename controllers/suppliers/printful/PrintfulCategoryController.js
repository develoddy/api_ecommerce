import axios from "axios";
import models from "../../../models";
import resources from "../../../resources";
import fs from 'fs';
import path from "path";
import CategoryService from "../../../services/suppliers/printful/CategoryService";
import  { 
    removeImageVersion  , 
    downloadImage       , 
    extractSKU          , 
    generateSlug        ,
} from "./helper";


// GET ALL CATEGORIES.
export async function syncGetPrintfulCategories() {

    let verifyExistenceCategory = false;

    // GET CATEGORIES FROM PRINTFUL
    const response = await CategoryService.getPrintfulCategories();
    const categories = response.categories;
    
    if ( categories ) {
        for ( const category of categories ) {
            const existingCategory = await models.Categorie.findOne({ 
                title: category.title 
            });

            // SI LA CATEGORIA NO EXISTE, ENTONCES CREARLO
            if ( !existingCategory ) {
                let data = {
                    title       : "tu_title"  ,
                    imagen      : "tu_imagen" ,
                    state       : 2           ,
                };
                
                data.title = category.title ;

                if ( category.image_url ) {
                    var img_path     = category.image_url                           ;
                    var name         = img_path.split('/')                          ;
                    var portada_name = await removeImageVersion(name[ 7 ])+'.png'   ;
                    data.imagen      = portada_name                                 ;

                    // RUTA DEL DIRECTORIO DE CARGA "UPLOAD"
                    const uploadDir = path.resolve(__dirname, '../../../', 'uploads', 'categorie' );
    
                    // VERIFICA SI EL DIRECTORIO EXISTE, EN CASO CONTRARIO HAY QUE CREARLO.
                    if ( !fs.existsSync( uploadDir ) ) { 
                        fs.mkdirSync( uploadDir, {  recursive: true, });
                    }
    
                    // RUTA DONDE SE GUARDA LA IMAGEN EN EL SISTEMA DE ARCHIVOS
                    const imagePath = path.join(uploadDir, portada_name );
    
                    // DESCARGAR LA IMAGEN DESDE LA URL.
                    await downloadImage(img_path, imagePath );
    
                    verifyExistenceCategory = true;
                    const success = await models.Categorie.create( data );
                }   
            }
            // END IF VALIDATION
        }   
    }
    // END CATEGORIES

    if ( verifyExistenceCategory ) {
        console.log("---- DEBUGG: SE HAN INSERTADO UNO O MAS CATEGORIAS -----");
      }
}

// GET CATEGORY.
async function getPrintfulCategory(categoryId) {
    try {
        const response = await CategoryService.getPrintfulCategory( categoryId );
        return response.result; // Aquí deberías obtener los detalles del producto
    } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
        throw new Error('Error al obtener los detalles del producto');
    }
  }