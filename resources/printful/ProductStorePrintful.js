export default {
    product_list: (product) => {
        return {
            id: product.id,
            external_id: product.external_id,
            name: product.name,
            variants: product.variants,
            synced: product.synced,
            thumbnail_url: product.thumbnail_url,
            is_ignored: product.is_ignored,
            sync_variants: product.sync_variants.map(syncVariant => ({
                id: syncVariant.id,
                external_id: syncVariant.external_id,
                sync_product_id: syncVariant.sync_product_id,
                name: syncVariant.name,
                synced: syncVariant.synced,
                variant_id: syncVariant.variant_id,
                main_category_id: syncVariant.main_category_id,
                warehouse_product_id: syncVariant.warehouse_product_id,
                warehouse_product_variant_id: syncVariant.warehouse_product_variant_id,
                retail_price: syncVariant.retail_price,
                sku: syncVariant.sku,
                currency: syncVariant.currency,
                product: {
                    variant_id: syncVariant.product.variant_id,
                    product_id: syncVariant.product.product_id,
                    image: syncVariant.product.image,
                    name: syncVariant.product.name
                },
                files: syncVariant.files.map(file => ({
                    id: file.id,
                    type: file.type,
                    hash: file.hash,
                    url: file.url,
                    filename: file.filename,
                    mime_type: file.mime_type,
                    size: file.size,
                    width: file.width,
                    height: file.height,
                    dpi: file.dpi,
                    status: file.status,
                    created: file.created,
                    thumbnail_url: file.thumbnail_url,
                    preview_url: file.preview_url,
                    visible: file.visible,
                    is_temporary: file.is_temporary,
                    message: file.message,
                    stitch_count_tier: file.stitch_count_tier
                })),
                options: syncVariant.options.map(option => ({
                    id: option.id,
                    value: option.value
                })),
                is_ignored: syncVariant.is_ignored,
                size: syncVariant.size,
                color: syncVariant.color,
                availability_status: syncVariant.availability_status
            }))
        };
    }
};
