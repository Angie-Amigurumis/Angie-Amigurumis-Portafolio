const fs = require('fs');

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = 'app8rGHSTRkQ8CZV4';
const AIRTABLE_TABLE_NAME = 'Productos';

async function fetchData() {
    try {
        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
        const respuesta = await fetch(url, {
            headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` }
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error de Airtable: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        
        // Crea el archivo data.json
        fs.writeFileSync('data.json', JSON.stringify(datos, null, 2));
        console.log('Datos guardados exitosamente en data.json');
    } catch (error) {
        console.error('ERRORerror:', error);
    }
}

fetchData();