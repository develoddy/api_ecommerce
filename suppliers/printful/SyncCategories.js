import { 
    syncGetPrintfulCategories 
} from "../../controllers/suppliers/printful/PrintfulCategoryController";

/**
 * LLAMA A LA FUNCIÓN DE SINCRONIZACIÓN
 * AL INICIO DE LA APLICACIÓN
 */
syncGetPrintfulCategories();

/**
 * SE CONFIGURA EL INTERVALO PARA LLAMAR
 * 'getPrintfulProducts' CADA CIERTO TIEMPO
 * (POR EJEMPLO, CADA DIA)
 */
// INTERVALO DE 1 MIN
//const intervalInMilliseconds = 60 * 1000;
// 60 * 60 * 1000; // 1 HORA

/**
 * SE CONFIGURA EL INTERVALO PARA LLAMAR AL METODO 'getPrintfulCategories'
 * PARA OBTENER TODAS LAS CATEGORIAS EN GENRAL.
 */
//setInterval(syncGetPrintfulCategories, intervalInMilliseconds);
