import { getTocTocPropertyDetail } from 'd:/proyectos/hojacero/app/aplicaciones/housing-intel/_lib/toctoc-scraper';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    const url = 'https://www.toctoc.com/propiedades/compracorredorasr/casa/providencia/5d-3b-casa-en-providencia/4088494';
    console.log('Testing detail scraper...');
    const result = await getTocTocPropertyDetail(url);
    console.log('Result:', JSON.stringify(result, null, 2));
}

test().catch(console.error);
