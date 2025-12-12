// Theme JavaScript - Modern Components
class ThemeComponents {
  constructor() {
    this.init();
  }

  init() {
    this.initMobileMenu();
    this.initScrollEffects();
    this.initAnimations();
    this.initCart();
    this.initSearch();
    this.initNewsletterForm();
    this.initProductQuickView();
    this.initTooltips();
    this.initLazyLoading();
  }

  // Mobile Menu
  initMobileMenu() {
    const toggle = document.querySelector('.header__mobile-toggle');
    const nav = document.querySelector('.header__nav');
    const body = document.body;

    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        body.classList.toggle('menu-open');
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.header__nav') && !e.target.closest('.header__mobile-toggle')) {
          toggle.classList.remove('active');
          nav.classList.remove('active');
          body.classList.remove('menu-open');
        }
      });
    }
  }

  // Scroll Effects
  initScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('.header-wrapper');

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Header hide/show on scroll
      if (currentScroll > lastScroll && currentScroll > 100) {
        header?.classList.add('header--hidden');
      } else {
        header?.classList.remove('header--hidden');
      }

      // Add shadow when scrolled
      if (currentScroll > 50) {
        header?.classList.add('header--scrolled');
      } else {
        header?.classList.remove('header--scrolled');
      }

      lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const headerHeight = header?.offsetHeight || 0;
            const targetPosition = target.offsetTop - headerHeight - 20;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // Intersection Observer Animations
  initAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // Cart Functionality
  initCart() {
    // Add to cart with AJAX
    document.addEventListener('submit', async (e) => {
      if (e.target.matches('[action*="/cart/add"]')) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent;

        try {
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Ekleniyor...';
          }

          const formData = new FormData(form);
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            const item = await response.json();
            this.updateCartCount();
            this.showNotification('Ürün sepete eklendi!', 'success');
            
            if (submitBtn) {
              submitBtn.textContent = '✓ Eklendi';
              setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
              }, 2000);
            }
          } else {
            throw new Error('Sepete eklenemedi');
          }
        } catch (error) {
          this.showNotification('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
          if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }
        }
      }
    });
  }

  // Update cart count
  async updateCartCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      const countElements = document.querySelectorAll('.cart-count');
      
      countElements.forEach(el => {
        el.textContent = cart.item_count > 0 ? cart.item_count : '';
        if (cart.item_count > 0) {
          el.style.display = 'flex';
        }
      });
    } catch (error) {
      console.error('Cart update failed:', error);
    }
  }

  // Search functionality
  initSearch() {
    const searchInputs = document.querySelectorAll('[data-search-input]');
    
    searchInputs.forEach(input => {
      let timeout;
      input.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 300);
      });
    });
  }

  async performSearch(query) {
    if (query.length < 2) return;

    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`);
      const results = await response.json();
      this.displaySearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  displaySearchResults(results) {
    // Implementation for search results display
    console.log('Search results:', results);
  }

  // Newsletter Form
  initNewsletterForm() {
    const forms = document.querySelectorAll('[data-newsletter-form]');
    
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.querySelector('input[type="email"]').value;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent;

        try {
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Gönderiliyor...';
          }

          // Simulate newsletter signup
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          this.showNotification('Bültene başarıyla kayıt oldunuz!', 'success');
          form.reset();
          
          if (submitBtn) {
            submitBtn.textContent = '✓ Kayıt Olundu';
            setTimeout(() => {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
            }, 2000);
          }
        } catch (error) {
          this.showNotification('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
          if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }
        }
      });
    });
  }

  // Quick View Modal
  initProductQuickView() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-quick-view]')) {
        e.preventDefault();
        const productUrl = e.target.getAttribute('href');
        this.openQuickView(productUrl);
      }
    });
  }

  async openQuickView(productUrl) {
    // Implementation for quick view modal
    console.log('Opening quick view for:', productUrl);
  }

  // Tooltips
  initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        const text = el.getAttribute('data-tooltip');
        this.showTooltip(e.target, text);
      });

      el.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
  }

  hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) tooltip.remove();
  }

  // Lazy Loading Images
  initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Notification System
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification__content">
        <span class="notification__icon">${this.getNotificationIcon(type)}</span>
        <span class="notification__message">${message}</span>
      </div>
      <button class="notification__close">&times;</button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('notification--show'), 100);

    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
      notification.classList.remove('notification--show');
      setTimeout(() => notification.remove(), 300);
    });

    setTimeout(() => {
      notification.classList.remove('notification--show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };
    return icons[type] || icons.info;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ThemeComponents());
} else {
  new ThemeComponents();
}

// Export for use in other scripts
window.ThemeComponents = ThemeComponents;

