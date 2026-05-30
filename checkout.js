// ─── MERCADO PAGO CHECKOUT PRO ───
// Este archivo maneja la creación de la preferencia de pago
// y la apertura del Checkout Pro de Mercado Pago

const MP_PUBLIC_KEY = "APP_USR-ad3fba59-c8f1-447d-b8cf-a25089a65221";
const MP_ACCESS_TOKEN = "APP_USR-2363455116822820-053019-8563b77f13648e8be167422839debffd-3438543176";

async function initCheckout() {
  const btn = document.getElementById('btn-comprar');
  if (!btn) return;

  btn.addEventListener('click', async function(e) {
    e.preventDefault();
    
    btn.textContent = '⏳ Procesando...';
    btn.style.opacity = '0.8';
    btn.style.pointerEvents = 'none';

    try {
      // Crear preferencia de pago via MP API
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          items: [{
            title: 'Sueño del Bebé — La Brújula Materna',
            description: 'Guía completa 36 páginas + Bonus Pantallas y Sueño. Descarga inmediata.',
            quantity: 1,
            currency_id: 'ARS',
            unit_price: 9900
          }],
          back_urls: {
            success: 'https://la-brujula-materna.vercel.app/gracias.html',
            failure: 'https://la-brujula-materna.vercel.app/?pago=fallido',
            pending: 'https://la-brujula-materna.vercel.app/gracias.html'
          },
          auto_return: 'approved',
          statement_descriptor: 'La Brujula Materna',
          external_reference: 'ebook-sueno-bebe'
        })
      });

      const data = await response.json();
      
      if (data.init_point) {
        // Redirigir al checkout de MP
        window.location.href = data.init_point;
      } else {
        throw new Error('No se pudo crear el checkout');
      }

    } catch (error) {
      console.error('Error:', error);
      btn.textContent = '🛒 Quiero acceso inmediato →';
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
      // Fallback al link directo de MP
      window.open('https://mpago.li/2sB17rM', '_blank');
    }
  });
}

document.addEventListener('DOMContentLoaded', initCheckout);
