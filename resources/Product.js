export default {
    product_list: (product) => {
        return {
            _id: product._id,
            title: product.title,
            sku: product.sku,
            slug: product.slug,
            imagen: 'http://localhost:3000'+'/api/products/uploads/product/'+product.portada, // Falta completar la ruta
            categorie: product.categorie,
            price_soles: product.price_soles,
            price_usd: product.price_usd,
            stock: product.stock,
            description: product.description,
            resumen: product.resumen,
            tags: product.tags ? JSON.parse(product.tags) : [],
            type_inventario: product.type_inventario,
            state: product.state,
        }
    }
}

/**
    title: {type:String, require:true, maxlength: 250},
    slug: {type:String, require:true, maxlength: 1000},
    categorie: {type:Schema.ObjectId, ref: 'categorie', require:true},
    price_soles: {type:Number, require:true},
    price_usd: {type:Number, require:true},
    portada: {type:String, require:true},
    galerias: [{type:Object, require:false}],
    state: {type:Number, default:1}, // 1 es en prueba o desarrollo, 2 será publico y 3 será anulado
    stock: {type:Number, default:0},
    description: {type:String, require:true},
    resumen: {type:String, require:true},
    tags: {type:String, required:true},
    type_inventario: {type: Number, default:1}
 */