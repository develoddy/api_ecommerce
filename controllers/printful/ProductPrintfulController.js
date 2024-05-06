import models from '../../models/printful';
import resources from '../../resources/printful';
import printfulService from '../../services/printful/PrintfulService';

export default {
  list: async (req, res) => {
    try {
      var products = null;

      // Llamar a la API (Service) de Printful para obtener la lista de productos
      products = await printfulService.getPrintfulProducts();
      
      products = products.map(product => {
          return resources.ProductPrintful.product_list(product);
      });

      res.status(200).json({
        result: products
    });

    } catch (error) {
      // Manejar errores
      console.error('Error al obtener la lista de productos de Printful:', error);
      res.status(500).json({
        error: 'Error al obtener la lista de productos de Printful'
      });
    }
  }
};
