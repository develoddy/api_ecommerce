import models from '../../models/printful';
import resources from '../../resources/printful';
import printfulService from '../../services/printful/PrintfulService';

export default {
  list: async (req, res) => {
    try {
      var products = null;

      // Llamar a la API (Service) de Printful para obtener la lista de productos
      products = await printfulService.getPrintfulProducts(5);

      products = products.slice(0, 5); 
      
      products = products.map(product => {
          return resources.ProductPrintful.product_list(product);
      });

      res.status(200).json({
        products: products
    });

    } catch (error) {
      console.error('Error al obtener la lista de productos de Printful:', error);
      res.status(500).json({
        error: 'Error al obtener la lista de productos de Printful'
      });
    }
  },

  storeListProducts: async ( req, res ) => {
    try {
      var products = null;

      // Llamar a la API (Service) de Printful para obtener la lista de productos
      products = await printfulService.getPrintfulStoreProducts();

      // Mapear los productos y llamar al servicio para obtener más detalles
        products = await Promise.all( products.map( async ( product ) => {
        const productDetails = await printfulService.getPrintfulStoreProduct( product.id );
        return resources.ProductStorePrintful.product_list( productDetails );
      }));

      res.status( 200 ).json({
        products: products
    });

    } catch ( error ) {
      res.status( 500 ).json({
        error: 'Error al obtener la lista de productos de templates de Printful'
      });
    }
  }
};
