
const https = require('https');
const fs = require('fs');

const apiKey = 'c5bde214829691464894c8b8901d7f15ead246f0';

function search(q, filename) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            q,
            gl: 'cl',
            hl: 'es'
        });

        const options = {
            hostname: 'google.serper.dev',
            path: '/maps',
            method: 'POST',
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    fs.writeFileSync(filename, body);
                    console.log(`Saved ${filename}`);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

async function run() {
    try {
        await search('restaurantes sushi cerca de La Robleria 1501, Lampa', 'sushi_real.json');
        await search('restaurantes cerca de La Robleria 1501, Lampa', 'general_real.json');
        await search('comida coreana lampa', 'korean_real.json');
        await search('colegios y supermercados cerca de La Robleria 1501, Lampa', 'anchors_real.json');
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
