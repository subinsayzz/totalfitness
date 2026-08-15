document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     Header Scroll Effect
     ========================================================================== */
  const header = document.getElementById('header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ==========================================================================
     Mobile Menu & Accordion Dropdowns
     ========================================================================== */
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  const closeMobileMenu = () => {
    if (mainNav) mainNav.classList.remove('mobile-open');
    if (header) header.classList.remove('menu-open');
    if (menuBtn) {
      menuBtn.classList.remove('is-active');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
    dropdowns.forEach(d => {
      d.classList.remove('open');
      const trigger = d.querySelector('.nav-dropdown-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.toggle('mobile-open');
      if (header) header.classList.toggle('menu-open', isOpen);
      menuBtn.classList.toggle('is-active', isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Handle Dropdown triggers on Mobile
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.nav-dropdown-trigger');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          if (window.innerWidth <= 991) {
            e.preventDefault();
            e.stopPropagation();
            const wasOpen = dropdown.classList.contains('open');
            // Close sibling dropdowns
            dropdowns.forEach(d => {
              if (d !== dropdown) {
                d.classList.remove('open');
                const t = d.querySelector('.nav-dropdown-trigger');
                if (t) t.setAttribute('aria-expanded', 'false');
              }
            });
            dropdown.classList.toggle('open', !wasOpen);
            trigger.setAttribute('aria-expanded', !wasOpen ? 'true' : 'false');
          }
        });
      }
    });

    // Close menu when clicking nav links
    const navLinks = mainNav.querySelectorAll('.nav-link, .dropdown-item, .btn-primary');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('mobile-open') && !header.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  /* ==========================================================================
     Reveal Animations (Intersection Observer with Instant Mobile Fallback)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-item');
  
  if ('IntersectionObserver' in window) {
    const revealOptions = {
      threshold: 0.05,
      rootMargin: "0px 0px -20px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, revealOptions);

    revealElements.forEach(el => {
      // Check if already in viewport
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('active');
      } else {
        revealObserver.observe(el);
      }
    });

    // Safety fallback: reveal all after 1.5s in case of slow scrolls or layout shifts
    setTimeout(() => {
      revealElements.forEach(el => el.classList.add('active'));
    }, 1500);
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }
});

/* ==========================================================================
   Pricing Toggle Logic
   ========================================================================== */
function togglePricing(membershipType, planType, btnElement) {
  const parentToggle = btnElement.closest('.pricing-toggle');
  if (!parentToggle) return;
  const buttons = parentToggle.querySelectorAll('.toggle-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');

  const container = document.getElementById(`${membershipType}-rows`);
  if (!container) return;

  const costElements = container.querySelectorAll('.strike, .cost');
  costElements.forEach(el => {
    if (el.dataset[planType]) {
      el.textContent = el.dataset[planType];
    } else {
      el.textContent = '';
    }
  });
}

/* ==========================================================================
   WhatsApp Contact Form Handler
   ========================================================================== */
function handleWhatsAppSubmit(e) {
  e.preventDefault();
  
  const nameEl = document.getElementById('wa-name');
  const phoneEl = document.getElementById('wa-phone');
  const serviceEl = document.getElementById('wa-service');
  const messageEl = document.getElementById('wa-message');

  const name = nameEl ? nameEl.value.trim() : '';
  const phone = phoneEl ? phoneEl.value.trim() : '';
  const service = serviceEl ? serviceEl.value : 'General Inquiry';
  const message = messageEl ? messageEl.value.trim() : '';

  if (!name || !phone) {
    alert('Please enter your name and phone number.');
    return;
  }

  const gymNumber = '918606347114';
  let waText = `Hi Total Fitness Mananthavady!\n\n`;
  waText += `👤 *Name:* ${name}\n`;
  waText += `📞 *Phone:* ${phone}\n`;
  waText += `🏋️ *Interested In:* ${service}\n`;
  if (message) {
    waText += `💬 *Message / Goal:* ${message}\n`;
  }
  waText += `\nI would like more information on joining Total Fitness.`;

  const waUrl = `https://wa.me/${gymNumber}?text=${encodeURIComponent(waText)}`;
  window.open(waUrl, '_blank');
}

