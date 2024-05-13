import axios from "axios";
import fs from 'fs';
import path from "path";

export async function downloadImage(imageUrl, localPath) {
    const response = await axios.get(imageUrl, {
        responseType: 'stream'
    });

    // Crea un flujo de escritura para guardar el archivo localmente
    const writer = fs.createWriteStream(localPath);

    // Escribe el contenido del archivo
    response.data.pipe(writer);

    // Retorna una promesa que resuelve cuando se completa la escritura del archivo
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

export async function removeImageVersion( imagen ) {
    // Dividir la cadena utilizando "?v=" como separador y tomar el primer elemento
    const version = imagen.split("?v=");
    const image = version[0];
    return image;
}

export async function extractSKU(str)  {
    const parts = str.split("_");
    return parts[0]; // Devuelve la primera parte como el SKU
}

export async function generateSlug(name) {
    return name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
}