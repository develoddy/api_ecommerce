const mongoose = require('mongoose');

// Define el esquema para sync_product
const syncProductSchema = new mongoose.Schema({
    id: Number,
    external_id: String,
    name: String,
    variants: Number,
    synced: Number,
    thumbnail_url: String,
    is_ignored: Boolean
});

// Define el esquema para sync_variants
const syncVariantSchema = new mongoose.Schema({
    id: Number,
    external_id: String,
    sync_product_id: Number,
    name: String,
    synced: Boolean,
    variant_id: Number,
    main_category_id: Number,
    warehouse_product_id: Number,
    warehouse_product_variant_id: Number,
    retail_price: String,
    sku: String,
    currency: String,
    product: {
        variant_id: Number,
        product_id: Number,
        image: String,
        name: String
    },
    files: [{
        id: Number,
        type: String,
        hash: String,
        url: String,
        filename: String,
        mime_type: String,
        size: Number,
        width: Number,
        height: Number,
        dpi: Number,
        status: String,
        created: Number,
        thumbnail_url: String,
        preview_url: String,
        visible: Boolean,
        is_temporary: Boolean,
        message: String,
        stitch_count_tier: String
    }],
    options: [{
        id: String,
        value: mongoose.Schema.Types.Mixed
    }],
    is_ignored: Boolean,
    size: String,
    color: String,
    availability_status: String
});

// Define el esquema para el objeto completo del JSON
const ProductStorePrintful = new mongoose.Schema({
    code: Number,
    result: {
        sync_product: syncProductSchema,
        sync_variants: [syncVariantSchema]
    },
    extra: [mongoose.Schema.Types.Mixed] // Siempre es una buena práctica tener un campo extra para almacenar datos adicionales que no estén definidos en el esquema
});

// Crea el modelo utilizando el esquema
const ProductStorePrintfulModel = mongoose.model('ProductStorePrintfulModel', ProductStorePrintful);

module.exports = ProductStorePrintfulModel;
