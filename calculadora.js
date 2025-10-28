// calculadora.js - lógica de la calculadora de presupuesto
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calc-form');
  const resultado = document.getElementById('resultado');
  const mensaje = document.getElementById('mensaje');
  const limpiarBtn = document.getElementById('limpiar');

  // lógica simple de cálculo:
  // total = (precioBase * factorPorHora * horas) + materiales + recargo (por ejemplo 10% manejo)
  function calcularTotal(precioBase, horas, materiales){
    const factorHora = 1.0; // si quisieras variar por servicio
    const subtotal = (precioBase * factorHora * Number(horas)) + Number(materiales || 0);
    const recargo = subtotal * 0.10; // 10% por imprevistos/gestión
    return subtotal + recargo;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const servicioId = document.getElementById('servicio').value;
    const horas = document.getElementById('horas').value;
    const materiales = document.getElementById('materiales').value || 0;
    if(!servicioId || horas === '' ){
      mensaje.textContent = 'Complete todos los campos.';
      mensaje.className = 'error';
      return;
    }

    // obtener precio base desde la opción seleccionada (data-base)
    const opt = document.querySelector(`#servicio option[value="${servicioId}"]`);
    const precioBase = opt ? Number(opt.dataset.base || 0) : 0;

    const total = calcularTotal(precioBase, horas, materiales);
    resultado.innerHTML = `<strong>Total estimado:</strong> ARS ${total.toFixed(2)} <br/>
      <small class="muted">Incluye recargo estimado del 10% por gestión.</small>
      <div style="margin-top:8px"><a class="btn" href="formulario.html">Contactar proveedor</a></div>
    `;
    resultado.classList.remove('hidden');
    mensaje.textContent = 'Cotización generada correctamente.';
    mensaje.className = 'success';
  });

  limpiarBtn && limpiarBtn.addEventListener('click', () => {
    form.reset();
    resultado.classList.add('hidden');
    mensaje.textContent = '';
    mensaje.className = 'muted';
  });
});
