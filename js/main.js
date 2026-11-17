'use strict';
function initializePortfolio() {
  const pages = [...document.querySelectorAll('[data-page]')];
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const validPages = new Set(['datos', 'proyectos', 'hobbies']);
  const themeToggle = document.querySelector('#themeToggle');
  const modal = document.querySelector('#projectDialog');
  const closeDialog = document.querySelector('#closeDialog');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = {
    brew: {category:'BRANDING / IDENTIDAD Y PACKAGING', title:'Brew — Sabor Orense',image:'assets/brew-mockup.webp',alt:'Mockup del empaque, taza, vasos y tarjeta de identidad Brew',description:'Propuesta de identidad visual para Brew, una marca de café de inspiración orense. El proyecto reúne un logotipo expresivo, un personaje ilustrado y aplicaciones de marca en empaques, vasos, tarjetas y merchandising. Su lenguaje cálido y cercano refuerza la experiencia de compartir un café.',tools:['Identidad visual','Diseño de packaging','Ilustración','Mockup'],extra:'<div class="dialog-secondary"><span class="mini-label">LOGOTIPO PRINCIPAL</span><img src="assets/brew-logo.webp" alt="Logotipo ilustrado Brew Sabor Orense" /></div>'},
    kicks: {category:'BRANDING / LOGOTIPO',title:'Kicks — Curated Footwear',image:'assets/kicks.webp',alt:'Logotipo de la marca Kicks Curated Footwear en negro',description:'Exploración tipográfica para una marca de calzado contemporáneo. El logotipo apuesta por el contraste entre una estructura geométrica limpia y gestos gráficos distintivos, transmitiendo selección, modernidad y seguridad.',tools:['Diseño de logotipo','Tipografía','Branding','Minimalismo'],contain:true},
    foto: {category:'FOTOGRAFÍA / DIRECCIÓN VISUAL',title:'Instantes en equilibrio',image:'assets/fotografia.webp',alt:'Fotografía artística de producto con un vaso, fresas y aceitunas',description:'Ejercicio de fotografía de producto que experimenta con el movimiento del líquido, las texturas de la fruta y una iluminación cálida. La composición busca generar una escena expresiva a partir de elementos cotidianos.',tools:['Fotografía de producto','Iluminación','Composición','Dirección de arte']},
    becas: {category:'DISEÑO DE INFORMACIÓN / INFOGRAFÍA',title:'Campaña de becas',image:'assets/campana-becas.webp',alt:'Infografía vertical de una campaña de becas con datos de segmentación y embudo de conversión',description:'Propuesta de comunicación visual basada en datos para una campaña de becas. La lámina integra una matriz de segmentación KDD, distribución del presupuesto, conocimiento de becas y un embudo de conversión con el fin de presentar información compleja en una composición comprensible.',tools:['Infografía','Visualización de datos','Jerarquía visual','Diseño editorial'],extra:'<div class="dialog-secondary"><a href="assets/campana-becas.pdf" target="_blank" rel="noopener noreferrer">Ver la lámina completa en PDF →</a></div>'}
  };
  const pageFromHash = () => {
    const hash = decodeURIComponent(location.hash.slice(1));
    return validPages.has(hash) ? hash : 'datos';
  };
  function showPage(page, options={}) {
    if (!validPages.has(page)) page='datos';
    pages.forEach(section => {
      const active = section.dataset.page === page;
      section.hidden = !active;
      section.setAttribute('aria-hidden',String(!active));
    });
    navLinks.forEach(link => {
      if (link.dataset.nav === page) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    document.title = `${({datos:'Datos generales',proyectos:'Proyectos',hobbies:'Hobbies'})[page]} | Paula Ávila`;
    if (options.scroll !== false) {
      window.scrollTo({top:0,behavior:options.immediate?'auto':'smooth'});
    }
    if (options.focus) document.querySelector(`#${page} h1`)?.focus?.({preventScroll:true});
  }
  function navigate(page, {contact=false}={}) {
    if (location.hash !== '#'+page) location.hash=page;
    else showPage(page);
    if (contact) {
      window.setTimeout(() => document.querySelector('#contacto')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
    }
  }
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',event=>{
      const href=link.getAttribute('href').slice(1);
      if (!validPages.has(href) && href !== 'contacto') return;
      event.preventDefault();
      navigate(href === 'contacto' ? 'datos' : href, {contact:href==='contacto' || link.hasAttribute('data-scroll-contact')});
    });
  });
  window.addEventListener('hashchange',()=>showPage(pageFromHash()));
  showPage(pageFromHash(),{scroll:false});
  try {
    const saved = localStorage.getItem('paula-theme');
    if (saved === 'dark') document.documentElement.dataset.theme='dark';
  }catch(err){}
  function updateThemeLabel(){
    const dark=document.documentElement.dataset.theme==='dark';
    themeToggle.setAttribute('aria-label',dark?'Activar modo claro':'Activar modo oscuro');
    themeToggle.setAttribute('aria-pressed',String(dark));
    const label=themeToggle.querySelector('.theme-label');
    if(label)label.textContent=dark?'Modo claro':'Modo oscuro';
    document.querySelector('meta[name="theme-color"]').content=dark?'#1c191a':'#f8f5f0';
  }
  updateThemeLabel();
  themeToggle.addEventListener('click',()=>{
    const dark=document.documentElement.dataset.theme==='dark';
    if (dark) document.documentElement.removeAttribute('data-theme');
    else document.documentElement.dataset.theme='dark';
    try{localStorage.setItem('paula-theme',dark?'light':'dark')}catch(err){}
    updateThemeLabel();
  });
  document.querySelector('#contactForm').addEventListener('submit',event=>{
    event.preventDefault();
    const form=new FormData(event.currentTarget);
    const name=String(form.get('nombre')||'').trim();
    const email=String(form.get('email')||'').trim();
    const message=String(form.get('mensaje')||'').trim();
    if (!name || !email || !message) return;
    const subject=encodeURIComponent('Consulta desde mi portafolio — '+name);
    const body=encodeURIComponent('Hola Paula,\n\n'+message+'\n\nMi nombre: '+name+'\nMi correo: '+email);
    window.location.href='mailto:paula_anabelavila@hotmail.com?subject='+subject+'&body='+body;
  });
  filters.forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.filter;
    filters.forEach(b=>{const active=b===button;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    document.querySelectorAll('.project-card').forEach(card=>card.hidden=filter!=='todos'&&card.dataset.category!==filter);
  }));
  function openProject(key){
    const data=projects[key]; if(!data)return;
    const image=document.querySelector('#modalImage');
    image.classList.toggle('contain',Boolean(data.contain));
    image.innerHTML='';
    const img=document.createElement('img');img.src=data.image;img.alt=data.alt;
    image.append(img);
    document.querySelector('#modalCategory').textContent=data.category;
    document.querySelector('#modalTitle').textContent=data.title;
    document.querySelector('#modalDescription').textContent=data.description;
    document.querySelector('#modalTools').replaceChildren(...data.tools.map(t=>{const el=document.createElement('span');el.textContent=t;return el;}));
    document.querySelector('#modalExtra').innerHTML=data.extra||'';
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
  }
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>openProject(button.dataset.project)));
  closeDialog.addEventListener('click',()=>{if(typeof modal.close === 'function') modal.close(); else modal.removeAttribute('open')});
  modal.addEventListener('click',event=>{if(event.target===modal) {if(typeof modal.close==='function')modal.close(); else modal.removeAttribute('open')}});
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePortfolio, { once: true });
} else {
  initializePortfolio();
}

