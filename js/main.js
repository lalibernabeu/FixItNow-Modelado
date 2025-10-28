// main.js - controlador general
(async function(){
  // Cargar datos (productos.json)
  async function fetchProductos(){
    try{
      const res = await fetch('data/productos.json');
      if(!res.ok) throw new Error('No se pudo cargar productos.json');
      const data = await res.json();
      return data;
    } catch(e){
      console.error(e);
      return [];
    }
  }

  // Renderizar tarjetas de oficios en un contenedor (id)
  window.renderOficios = async function(containerId){
    const cont = document.getElementById(containerId);
    if(!cont) return;
    cont.innerHTML = '<div class="card">Cargando...</div>';
    const productos = await fetchProductos();
    if(!productos.length){
      cont.innerHTML = '<div class="card">No hay servicios disponibles.</div>';
      return;
    }
    cont.innerHTML = productos.map(p => `
      <div class="card">
        <img class="thumb" src="${p.imagen || 'assets/placeholder.png'}" alt="${p.nombre}" />
        <h4>${p.nombre}</h4>
        <p>${p.descripcion}</p>
        <p><strong>Precio base:</strong> ARS ${p.precioBase.toFixed(2)}</p>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
          <button class="btn" onclick="solicitarCotizacion('${p.id}')">Solicitar cotización</button>
        </div>
      </div>
    `).join('');
  };

  // Selección de servicio y redirección a calculadora (usa localStorage para pasar datos)
  window.solicitarCotizacion = function(id){
    localStorage.setItem('fixitnow_selected_service', id);
    window.location = 'calculadora.html';
  };

  // Poblar selects de servicios (ej: en formulario contacto)
  window.populateServicioSelect = async function(selectId){
    const sel = document.getElementById(selectId);
    if(!sel) return;
    const productos = await fetchProductos();
    sel.innerHTML = '<option value="">-- seleccioná --</option>' + productos.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');
  };

  // Al cargar cualquier página: si existe select con id 'servicio' (calculadora), poblarlo
  document.addEventListener('DOMContentLoaded', async () => {
    const selectServicio = document.getElementById('servicio');
    if(selectServicio){
      const productos = await fetchProductos();
      selectServicio.innerHTML = productos.map(p => `<option value="${p.id}" data-base="${p.precioBase}">${p.nombre}</option>`).join('');
      // Si venimos con un servicio seleccionado
      const selected = localStorage.getItem('fixitnow_selected_service');
      if(selected){
        const option = Array.from(selectServicio.options).find(o => o.value===selected);
        if(option) option.selected = true;
        localStorage.removeItem('fixitnow_selected_service');
      }
    }

    // Si existe select de contacto, poblar (ej: formulario.html)
    const selectContacto = document.getElementById('servicio-interes');
    if(selectContacto){
      await window.populateServicioSelect('servicio-interes');
    }
  });
})();


document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.getElementById('header');
  const footerContainer = document.getElementById('footer');

  fetch('templates/header.html')
    .then(res => res.text())
    .then(html => headerContainer.innerHTML = html);

  fetch('templates/footer.html')
    .then(res => res.text())
    .then(html => footerContainer.innerHTML = html);
});