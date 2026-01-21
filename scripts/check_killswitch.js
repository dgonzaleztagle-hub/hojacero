const https = require('https');
const API_KEY = 'sb_publishable_Qz1iRV_N9JWqjUBmQkQgVA_iwNSLGDu';
const SITE_ID = '2f494d0e-55e3-4ba0-9e5a-167529eaa8ce';

async function check() {
    return new Promise((resolve) => {
        const options = {
            hostname: 'vcxfdihsyehomqfdzzjf.supabase.co',
            port: 443,
            path: `/rest/v1/site_status?id=eq.${SITE_ID}&select=is_active`,
            method: 'GET',
            headers: {
                'apikey': API_KEY,
                'Authorization': 'Bearer ' + API_KEY
            }
        };

        https.get(options, (res) => {
            let data = '';
            res.on('data', (d) => data += d);
            res.on('end', () => {
                console.log("Status Code:", res.statusCode);
                console.log("Data:", data);
                resolve();
            });
        }).on('error', (e) => {
            console.error(e);
            resolve();
        });
    });
}

check();
