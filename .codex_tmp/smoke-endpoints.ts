import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function runOne(name: string, fn: (req: Request) => Promise<Response>, payload: unknown) {
  try {
    const req = new Request('http://localhost/api', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const res = await fn(req);
    const text = await res.text();
    return { endpoint: name, status: res.status, ok: res.ok, body: text };
  } catch (e) {
    return {
      endpoint: name,
      status: 0,
      ok: false,
      body: e instanceof Error ? e.message : String(e)
    };
  }
}

(async () => {
  const territorial = await import('../app/api/territorial/analyze/route.ts');
  const radar = await import('../app/api/radar/search/route.ts');
  const sales = await import('../app/api/sales-agent/chat/route.ts');

  const out = [];
  out.push(await runOne('territorial-analyze', territorial.POST as any, {
    address: 'Providencia 1234, Santiago',
    plan_type: 1,
    business_type: 'restaurant',
    business_name: 'Smoke Test'
  }));

  out.push(await runOne('radar-search', radar.POST as any, {
    query: 'restaurante',
    location: 'Providencia',
    scannedBy: 'smoke-test'
  }));

  out.push(await runOne('sales-agent-chat', sales.POST as any, {
    messages: [{ role: 'user', content: 'hola' }]
  }));

  console.log(JSON.stringify(out, null, 2));
})();
