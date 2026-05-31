const https = require('https');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const ACCESS_TOKEN = 'APP_USR-2363455116822820-053019-8563b77f13648e8be167422839debffd-3438543176';

  const preference = {
    items: [{
      title: 'Sueño del Bebé — La Brújula Materna',
      description: 'Guía completa 36 páginas + Bonus Pantallas y Sueño. Descarga inmediata.',
      quantity: 1,
      currency_id: 'ARS',
      unit_price: 9900
    }],
    back_urls: {
      success: 'https://la-brujula-materna.netlify.app/gracias.html',
      failure: 'https://la-brujula-materna.netlify.app/?pago=fallido',
      pending: 'https://la-brujula-materna.netlify.app/gracias.html'
    },
    auto_return: 'approved',
    statement_descriptor: 'La Brujula Materna',
    external_reference: 'ebook-sueno-bebe'
  };

  return new Promise((resolve) => {
    const body = JSON.stringify(preference);
    const options = {
      hostname: 'api.mercadopago.com',
      path: '/checkout/preferences',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.init_point) {
            resolve({
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ init_point: parsed.init_point })
            });
          } else {
            resolve({
              statusCode: 500,
              headers: { 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ error: 'No init_point', details: parsed })
            });
          }
        } catch (e) {
          resolve({
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Parse error' })
          });
        }
      });
    });

    req.on('error', (e) => {
      resolve({
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: e.message })
      });
    });

    req.write(body);
    req.end();
  });
};
