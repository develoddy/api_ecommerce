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

      products = resources.ProductStorePrintful.product_list(products);

      res.status( 200 ).json({
        products: products
    });

    } catch ( error ) {
      res.status( 500 ).json({
        error: 'Error al obtener la lista de productos de templates de Printful'
      });
    }
  },

  storeShowProduct: async ( req, res ) => {
    try {
      var product = null;
      var productId = req.params.id;

      // Llamar a la API (Service) de Printful para obtener la lista de productos
      product = await printfulService.getPrintfulStoreProduct(productId);

      res.status( 200 ).json({
        product: product
    });

    } catch ( error ) {
      res.status( 500 ).json({
        error: 'Debugg: storeShowProduct -- Error al obtener la lista de productos de templates de Printful'
      });
    }
  }
};
