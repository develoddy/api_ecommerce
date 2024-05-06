import axios from 'axios';

// Token de autenticación de Printful
const PRINTFUL_API_TOKEN = 'CcbTqhupaIzBCtmkhmnYY59az1Tc8WxIrF9auaGH';

const getPrintfulProducts = async () => {
    try {
        const response = await axios.get('https://api.printful.com/products');
        return response.data.result;
    } catch (error) {
        throw new Error('Error al obtener la lista de productos de Printful');
    }
};


const getPrintfulStoreProducts = async () => {
    try {
        const response = await axios.get('https://api.printful.com/store/products', {
            headers: {
                'Authorization': `Bearer ${PRINTFUL_API_TOKEN}`
            }
        });
        return response.data.result;
    } catch (error) {
        console.error('DEBUG getPrintfulProductsTemplates: Error al obtener la lista de productos de Printful:', error);
        throw new Error('Error al obtener la lista de productos de Printful');
    }   
};

const getPrintfulStoreProduct = async ( productId ) => {
    try {
        console.log("DEbug me llega un id" + productId);

        const response = await axios.get(`https://api.printful.com/sync/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${PRINTFUL_API_TOKEN}`
            }
        });

        return response.data.result;

    } catch (error) {
        console.error('DEBUG getProductPrintful: Error al obtener la lista de productos de Printful:', error);
        throw new Error('Error al obtener la lista de productos de Printful');
    }
};


export default {
    getPrintfulProducts,
    getPrintfulStoreProducts,
    getPrintfulStoreProduct,
};
