export default {
    product_list: (product) => {
      return {
        id: product.id,
        main_category_id: product.main_category_id,
        type: product.type,
        description: product.description,
        type_name: product.type_name,
        title: product.title,
        brand: product.brand,
        model: product.model,
        image: product.image,
        variant_count: product.variant_count,
        currency: product.currency,
        options: product.options.map(option => ({
          id: option.id,
          title: option.title,
          type: option.type,
          values: option.values,
          additional_price: option.additional_price,
          additional_price_breakdown: option.additional_price_breakdown
        })),
        dimensions: product.dimensions,
        is_discontinued: product.is_discontinued,
        avg_fulfillment_time: product.avg_fulfillment_time,
        techniques: product.techniques.map(technique => ({
          key: technique.key,
          display_name: technique.display_name,
          is_default: technique.is_default
        })),
        files: product.files.map(file => ({
          id: file.id,
          type: file.type,
          title: file.title,
          additional_price: file.additional_price,
          options: file.options
        })),
        origin_country: product.origin_country
      };
    }

    // product_list: (product, variedades, imagen_two, galerias, avg_review, count_review, CampaingDiscount) => {
    //   const result = [{
    //     id: product.id,
    //     main_category_id: product.main_category_id,
    //     type: product.type,
    //     description: product.description,
    //     type_name: product.type_name,
    //     title: product.title,
    //     brand: product.brand,
    //     model: product.model,
    //     image: product.image,
    //     variant_count: product.variant_count,
    //     currency: product.currency,
    //     options: product.options.map(option => ({
    //       id: option.id,
    //       title: option.title,
    //       type: option.type,
    //       values: option.values,
    //       additional_price: option.additional_price,
    //       additional_price_breakdown: option.additional_price_breakdown
    //     })),
    //     dimensions: product.dimensions,
    //     is_discontinued: product.is_discontinued,
    //     avg_fulfillment_time: product.avg_fulfillment_time,
    //     techniques: product.techniques.map(technique => ({
    //       key: technique.key,
    //       display_name: technique.display_name,
    //       is_default: technique.is_default
    //     })),
    //     files: product.files.map(file => ({
    //       id: file.id,
    //       type: file.type,
    //       title: file.title,
    //       additional_price: file.additional_price,
    //       options: file.options
    //     })),
    //     origin_country: product.origin_country
    //   }];
  
    //   const code = product.code;
    //   const extra = [];
  
    //   return {
    //     code,
    //     result,
    //     extra
    //   };
    // }
};
  