/**
 * Carlos Ercoli - Plomero y Gasista Matriculado
 * Script de Navegación, Galería, Cotizador y Efectos Interactivos (UX/UI Premium)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. HEADER SCROLL Y EFECTO STICKY
  // ==========================================================================
  const header = document.getElementById('header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Ejecutar al cargar para verificar estado inicial


  // ==========================================================================
  // 2. MENÚ HAMBURGUESA PARA MÓVILES
  // ==========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Cambiar accesibilidad
    const isExpanded = menuToggle.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Cerrar menú al hacer clic en cualquier enlace
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', false);
    });
  });


  // ==========================================================================
  // 3. SEGUIMIENTO DE SECCIONES EN SCROLL (SCROLL SPY)
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');

  const scrollSpy = () => {
    const scrollY = window.pageYOffset + 120; // Compensación de altura del header

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);


  // ==========================================================================
  // 4. FILTRADO DE GALERÍA
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remover clase activa de todos los botones y agregar al seleccionado
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  // ==========================================================================
  // 5. LIGHTBOX PARA AMPLIACIÓN DE IMÁGENES
  // ==========================================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  let activeGalleryItems = []; // Almacena ítems que están visibles actualmente (no filtrados)

  // Actualizar la lista de imágenes activas según el filtro actual
  const updateActiveGalleryItems = () => {
    activeGalleryItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
  };

  // Mostrar imagen específica por índice
  const showLightboxImage = (index) => {
    if (index < 0) index = activeGalleryItems.length - 1;
    if (index >= activeGalleryItems.length) index = 0;
    
    currentGalleryIndex = index;
    const item = activeGalleryItems[currentGalleryIndex];
    
    const imgElement = item.querySelector('.gallery-thumbnail');
    const categoryEl = item.querySelector('.item-category');
    const titleEl = item.querySelector('.item-title');
    const descEl = item.querySelector('.item-desc');

    const categoryText = categoryEl ? categoryEl.innerText : '';
    const titleText = titleEl ? titleEl.innerText : '';
    const descText = descEl ? descEl.innerText : '';

    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;
    if (lightboxCategory) lightboxCategory.innerText = categoryText;
    if (lightboxTitle) lightboxTitle.innerText = titleText;
    if (lightboxDesc) lightboxDesc.innerText = descText;
  };

  // Abrir Lightbox
  const openLightbox = (item) => {
    updateActiveGalleryItems();
    const indexInActive = activeGalleryItems.indexOf(item);
    
    if (indexInActive !== -1) {
      showLightboxImage(indexInActive);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Detener scroll de fondo
    }
  };

  // Cerrar Lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll
  };

  // Evento de clic en cada ítem de galería para abrir el lightbox
  galleryItems.forEach(item => {
    // Al hacer clic en la tarjeta o en el botón de expandir
    const expandBtn = item.querySelector('.btn-expand-img');
    
    if (expandBtn) {
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar doble ejecución si hay burbujeo
        openLightbox(item);
      });
    }

    const imgWrapper = item.querySelector('.gallery-image-wrapper');
    if (imgWrapper) {
      imgWrapper.addEventListener('click', () => {
        openLightbox(item);
      });
    }
  });

  // Eventos de control del lightbox
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => showLightboxImage(currentGalleryIndex - 1));
  nextBtn.addEventListener('click', () => showLightboxImage(currentGalleryIndex + 1));

  // Cerrar al hacer clic fuera de la imagen en el fondo
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Navegación por teclado
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') showLightboxImage(currentGalleryIndex + 1);
  });


  // ==========================================================================
  // 6. COTIZADOR INTERACTIVO Y ENVÍO DE FORMULARIO A WHATSAPP
  // ==========================================================================
  const quoteForm = document.getElementById('quote-form');
  // Número de WhatsApp de Carlos Ercoli (puedes ajustar el prefijo y número)
  const WHATSAPP_PHONE = '5491161753059'; 

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener valores de campos
    const name = document.getElementById('client-name').value.trim();
    const location = document.getElementById('client-location').value;
    const service = document.getElementById('service-type').value;
    const urgency = document.getElementById('client-urgency').value;
    const details = document.getElementById('service-details').value.trim();

    // Validación básica de seguridad
    if (!name || !location || !service || !details) {
      alert('Por favor, completá todos los campos obligatorios indicados con un asterisco (*).');
      return;
    }

    // Armar mensaje con formato profesional
    const message = 
`*SOLICITUD DE PRESUPUESTO - WEB* 🛠️💧🔥

Estimado Carlos Ercoli, acabo de ver tu página web y quería solicitar un presupuesto para el siguiente trabajo:

👤 *Cliente:* ${name}
📍 *Localidad:* ${location}
🔧 *Servicio:* ${service}
🚨 *Urgencia:* ${urgency}

📝 *Detalle del Trabajo:*
"${details}"

---
_Mensaje generado desde la landing page profesional._`;

    // Codificar mensaje para la URL de WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

    // Abrir en una nueva pestaña
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });


  // ==========================================================================
  // 7. GLOBO DE BIENVENIDA DE WHATSAPP FLOTANTE
  // ==========================================================================
  const whatsappContainer = document.getElementById('whatsapp-container');
  const whatsappMsg = document.getElementById('whatsapp-msg');
  const closeWhatsappMsgBtn = document.getElementById('close-whatsapp-msg-btn');

  // Mostrar mensaje emergente después de 5 segundos si el usuario no lo cerró en esta sesión
  const shouldShowBubble = !sessionStorage.getItem('whatsapp_bubble_closed');

  if (shouldShowBubble) {
    setTimeout(() => {
      whatsappMsg.classList.add('active');
    }, 5000);
  }

  // Cerrar el globo de mensaje emergente
  closeWhatsappMsgBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar que abra el link de WhatsApp al hacer clic en cerrar
    whatsappMsg.classList.remove('active');
    sessionStorage.setItem('whatsapp_bubble_closed', 'true');
  });


  // ==========================================================================
  // 8. EFECTOS DE REVELACIÓN SCROLL (INTERSECTION OBSERVER)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.15 // Revelar cuando el 15% del elemento sea visible
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Dejar de observar una vez revelado
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    revealElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback para navegadores antiguos: revelar todo de inmediato
    revealElements.forEach(element => {
      element.classList.add('revealed');
    });
  }

});
