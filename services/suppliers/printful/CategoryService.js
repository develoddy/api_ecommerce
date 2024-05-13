import axios from 'axios';

const PRINTFUL_API_TOKEN = 'CcbTqhupaIzBCtmkhmnYY59az1Tc8WxIrF9auaGH';

const getPrintfulCategories = async () => {
    try {
        const response = await axios.get('https://api.printful.com/categories', {
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

const getPrintfulCategory = async ( categoryId ) => {
    try {

        const response = await axios.get(`https://api.printful.com/categories/${categoryId}`, {
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
    getPrintfulCategories,
    getPrintfulCategory,
};
