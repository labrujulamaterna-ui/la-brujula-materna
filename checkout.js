async function initCheckout() {
  const buttons = document.querySelectorAll('#btn-comprar, .btn-buy');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();

      const originalText = btn.innerHTML;
      btn.innerHTML = '⏳ Procesando...';
      btn.style.opacity = '0.8';
      btn.style.pointerEvents = 'none';

      try {
        const response = await fetch('/.netlify/functions/create-preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data.init_point) {
          window.location.href = data.init_point;
        } else {
          throw new Error('Sin init_point');
        }

      } catch (error) {
        console.error('Error:', error);
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        window.open('https://mpago.li/2sB17rM', '_blank');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initCheckout);
