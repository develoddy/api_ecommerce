// printfulService.js

import axios from 'axios';

const getPrintfulProducts = async () => {
    try {
        const response = await axios.get('https://api.printful.com/products');
        return response.data.result;
    } catch (error) {
        throw new Error('Error al obtener la lista de productos de Printful');
    }
};

export default {
    getPrintfulProducts
};
