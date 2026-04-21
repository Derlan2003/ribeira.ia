// Módulo principal para a landing page do Apresento CRM
// Estrutura modular com funções organizadas por funcionalidade

// ========== CONFIGURAÇÕES GERAIS ==========
const config = {
  gaTrackingId: 'UA-XXXXXXXXX-X', // Substitua pelo seu ID do Google Analytics
  formEndpoints: {
    contact: '/api/contact', // Endpoint para formulário de contato
    trial: '/api/trial' // Endpoint para teste grátis
  }
};

// ========== UTILITÁRIOS ==========
const utils = {
  // Verifica se elemento está no viewport
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Animação de fade in
  fadeIn: (element, duration = 1000) => {
    element.style.opacity = 0;
    element.style.display = 'block';
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.opacity = Math.min(progress / duration, 1);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  },

  // Animação de slide up
  slideUp: (element, duration = 1000) => {
    element.style.transform = 'translateY(50px)';
    element.style.opacity = 0;
    element.style.display = 'block';
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const ease = progress / duration;
      element.style.transform = `translateY(${50 * (1 - ease)}px)`;
      element.style.opacity = Math.min(ease, 1);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  },

  // Contador animado
  animateCounter: (element, target, duration = 2000) => {
    const start = parseInt(element.textContent) || 0;
    const increment = target / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }
};

// ========== MENU RESPONSIVO ==========
const menuModule = {
  init: () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
      });

      // Fecha menu ao clicar em link
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });
    }
  }
};

// ========== HEADER STICKY ==========
const headerModule = {
  init: () => {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        // Rolando para baixo
        header.classList.add('sticky');
      } else {
        // Rolando para cima
        header.classList.remove('sticky');
      }

      if (scrollTop > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollTop = scrollTop;
    });
  }
};

// ========== SCROLL SUAVE ==========
const scrollModule = {
  init: () => {
    // Scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Comportamento de scroll suave global
    document.documentElement.style.scrollBehavior = 'smooth';
  }
};

// ========== ANIMAÇÕES AO SCROLL ==========
const animationModule = {
  init: () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const checkAnimations = () => {
      animatedElements.forEach(element => {
        if (utils.isInViewport(element) && !element.classList.contains('animated')) {
          element.classList.add('animated');
          if (element.classList.contains('fade-in')) {
            utils.fadeIn(element);
          } else if (element.classList.contains('slide-up')) {
            utils.slideUp(element);
          }
        }
      });
    };

    window.addEventListener('scroll', checkAnimations);
    checkAnimations(); // Verifica na carga inicial
  }
};

// ========== CONTADORES ANIMADOS ==========
const counterModule = {
  init: () => {
    const counters = document.querySelectorAll('.counter');

    const animateCounters = () => {
      counters.forEach(counter => {
        if (utils.isInViewport(counter) && !counter.classList.contains('animated')) {
          counter.classList.add('animated');
          const target = parseInt(counter.dataset.target);
          utils.animateCounter(counter, target);
        }
      });
    };

    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Verifica na carga inicial
  }
};

// ========== EFEITOS DE BOTÃO ==========
const buttonModule = {
  init: () => {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.classList.add('glow');
      });

      button.addEventListener('mouseleave', () => {
        button.classList.remove('glow');
      });
    });
  }
};

// ========== VALIDAÇÃO DE FORMULÁRIOS ==========
const validationModule = {
  init: () => {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validationModule.validateForm(form)) {
          validationModule.submitForm(form);
        }
      });
    });
  },

  validateForm: (form) => {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
      const value = input.value.trim();
      const errorElement = form.querySelector(`[data-error="${input.name}"]`);

      if (input.hasAttribute('required') && !value) {
        isValid = false;
        validationModule.showError(input, 'Este campo é obrigatório.', errorElement);
      } else if (input.type === 'email' && value && !validationModule.isValidEmail(value)) {
        isValid = false;
        validationModule.showError(input, 'Email inválido.', errorElement);
      } else {
        validationModule.hideError(input, errorElement);
      }
    });

    return isValid;
  },

  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  showError: (input, message, errorElement) => {
    input.classList.add('error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  },

  hideError: (input, errorElement) => {
    input.classList.remove('error');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  },

  submitForm: async (form) => {
    const formData = new FormData(form);
    const endpoint = form.dataset.endpoint || config.formEndpoints.contact;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Formulário enviado com sucesso!');
        form.reset();
      } else {
        alert('Erro ao enviar formulário. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar formulário. Tente novamente.');
    }
  }
};

// ========== RASTREAMENTO DE CLIQUES ==========
const trackingModule = {
  init: () => {
    const ctas = document.querySelectorAll('.cta');

    ctas.forEach(cta => {
      cta.addEventListener('click', () => {
        // Rastreamento personalizado
        console.log('CTA clicado:', cta.textContent);
        // Integração com GA será feita no módulo GA
      });
    });
  }
};

// ========== GOOGLE ANALYTICS ==========
const gaModule = {
  init: () => {
    // Carrega o script do Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaTrackingId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', config.gaTrackingId);

    // Rastreia eventos de CTA
    const ctas = document.querySelectorAll('.cta');
    ctas.forEach(cta => {
      cta.addEventListener('click', () => {
        gtag('event', 'click', {
          event_category: 'CTA',
          event_label: cta.textContent
        });
      });
    });
  }
};

// ========== LAZY LOADING DE IMAGENS ==========
const lazyLoadModule = {
  init: () => {
    const images = document.querySelectorAll('img[data-src]');

    const loadImage = (image) => {
      image.src = image.dataset.src;
      image.classList.remove('lazy');
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    images.forEach(image => imageObserver.observe(image));
  }
};

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  menuModule.init();
  headerModule.init();
  scrollModule.init();
  animationModule.init();
  counterModule.init();
  buttonModule.init();
  validationModule.init();
  trackingModule.init();
  gaModule.init();
  lazyLoadModule.init();
});
