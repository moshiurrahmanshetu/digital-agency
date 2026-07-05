/*
 * ===================================================================
 * PREMIUM DIGITAL AGENCY HTML TEMPLATE - CORE JAVASCRIPT ENGINE
 * Handles custom cursors, magnetic effects, theme toggles, ripples,
 * and mouse-tracking parallax interactions.
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Initialize all interactive components
  initPageLoader();
  initThemeSystem();
  initCustomCursor();
  initHeaderScroll();
  initMobileDrawer();
  initMagneticButtons();
  initRippleEffect();
  initMouseParallax();
  initInputFloatingLabels();
  initDynamicCopyright();
  initSearchOverlay();
  initTiltCards();
  initStatsCounter();
  initServicesMouseFollow();
  initPortfolioCursorPreview();
  initProcessTimeline();
  initCompanyTimelineProgress();
  initWorkflowTimeline();
  initAosFallback();
  initTestimonialsSwiper();
  initBackToTop();
  initShowreelVideoModal();
});

/* ===================================================================
   1. THEME SYSTEM (Day/Night Mode Toggle)
   =================================================================== */
function initThemeSystem() {
  const themeToggleButtons = document.querySelectorAll(".theme-toggle-btn");
  
  // Apply saved theme or system default (defaulting to dark mode)
  const savedTheme = localStorage.getItem("agency-theme");
  const initialTheme = savedTheme || "dark";
  
  document.documentElement.setAttribute("data-theme", initialTheme);
  
  themeToggleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const targetTheme = currentTheme === "dark" ? "light" : "dark";
      
      document.documentElement.setAttribute("data-theme", targetTheme);
      localStorage.setItem("agency-theme", targetTheme);
      
      // Flash custom cursor or ripple when changing themes
      triggerThemeTransitionCursorEffect();
    });
  });
}

function triggerThemeTransitionCursorEffect() {
  const follower = document.querySelector(".custom-cursor-follower");
  if (follower) {
    follower.style.transform = "translate(-50%, -50%) scale(2.5)";
    follower.style.backgroundColor = "rgba(var(--accent-primary-rgb), 0.15)";
    setTimeout(() => {
      follower.style.transform = "translate(-50%, -50%) scale(1)";
      follower.style.backgroundColor = "transparent";
    }, 400);
  }
}

/* ===================================================================
   2. CUSTOM INTERACTIVE CURSOR WITH SPRING PHYSICS
   =================================================================== */
function initCustomCursor() {
  // Only enable on desktop screens where pointer events exist
  if (window.matchMedia("(max-width: 991.98px)").matches) return;

  const cursor = document.createElement("div");
  const follower = document.createElement("div");

  cursor.className = "custom-cursor";
  follower.className = "custom-cursor-follower";

  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;

  // Mouse move listener
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Quick cursor follows mouse instantly
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Spring physics animation for follower cursor
  function animateFollower() {
    // Distance between follower and actual mouse
    const dx = mouseX - followerX;
    const dy = mouseY - followerY;

    // Direct linear interpolation (lerp) or spring speed (0.15 is optimal)
    followerX += dx * 0.15;
    followerY += dy * 0.15;

    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Add hover classes for custom styling
  const interactiveElements = document.querySelectorAll(
    "a, button, input, select, textarea, .card-premium, .theme-toggle-btn, [role='button']"
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hover");
    });
  });

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    follower.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
    follower.style.opacity = "1";
  });
}

/* ===================================================================
   3. STICKY HEADER DETECTION
   =================================================================== */
function initHeaderScroll() {
  const header = document.querySelector(".main-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);
  // Initial check on load
  handleScroll();
}

/* ===================================================================
   4. MOBILE OVERLAY NAVIGATION DRAWER
   =================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const drawer = document.querySelector(".mobile-drawer");
  const closeBtn = document.querySelector(".mobile-drawer-close");
  const overlay = document.querySelector(".drawer-overlay");

  if (!toggleBtn || !drawer || !closeBtn || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add("open");
    overlay.classList.add("visible");
    document.body.classList.add("drawer-open");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };

  const closeDrawer = () => {
    drawer.classList.remove("open");
    overlay.classList.remove("visible");
    document.body.classList.remove("drawer-open");
    document.body.style.overflow = "";
  };

  // Allow clicking toggleBtn (the burger menu) to also toggle/close if already open
  toggleBtn.addEventListener("click", () => {
    if (drawer.classList.contains("open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  // Close mobile menu on clicking any of the links
  const drawerLinks = drawer.querySelectorAll(".mobile-drawer-nav-link");
  drawerLinks.forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
}

/* ===================================================================
   5. MAGNETIC BUTTON HOVER EFFECT
   =================================================================== */
function initMagneticButtons() {
  const magneticElements = document.querySelectorAll(".magnetic-wrap");
  
  if (window.matchMedia("(max-width: 991.98px)").matches) return;

  magneticElements.forEach((wrap) => {
    const trigger = wrap.querySelector("a, button, .theme-toggle-btn");
    if (!trigger) return;

    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Translate the wrapper slightly (strength factor 0.35)
      wrap.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
      if (trigger) {
        // Translate the inner button in same direction for layered depth (strength factor 0.2)
        trigger.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      }
    });

    wrap.addEventListener("mouseleave", () => {
      // Smooth reset
      wrap.style.transform = "translate(0px, 0px)";
      if (trigger) {
        trigger.style.transform = "translate(0px, 0px)";
      }
    });
  });
}

/* ===================================================================
   6. BUTTON CLICK RIPPLE EFFECT
   =================================================================== */
function initRippleEffect() {
  const rippleButtons = document.querySelectorAll(".btn-premium, .theme-toggle-btn");

  rippleButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Create ripple element
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      
      ripple.style.width = ripple.style.height = `${size}px`;
      
      // Calculate coordinates relative to container
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      // Append ripple and remove after animation finishes
      this.appendChild(ripple);
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/* ===================================================================
   7. MOUSE PARALLAX SCROLLING ENGINE
   =================================================================== */
function initMouseParallax() {
  const parallaxContainers = document.querySelectorAll("[data-parallax-container]");

  if (window.matchMedia("(max-width: 991.98px)").matches) return;

  window.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    parallaxContainers.forEach((container) => {
      const items = container.querySelectorAll("[data-parallax-factor]");
      
      items.forEach((item) => {
        const factor = parseFloat(item.getAttribute("data-parallax-factor")) || 0.05;
        
        // Calculate coordinate offsets relative to center
        const offsetX = (windowWidth / 2 - mouseX) * factor;
        const offsetY = (windowHeight / 2 - mouseY) * factor;

        item.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      });
    });
  });
}

/* ===================================================================
   8. INPUT FIELD FLOATING LABELS UTILITY
   =================================================================== */
function initInputFloatingLabels() {
  const inputs = document.querySelectorAll(".form-control-premium");

  inputs.forEach((input) => {
    // Ensure placeholder is set to allow the CSS selector :placeholder-shown to function
    if (!input.getAttribute("placeholder")) {
      input.setAttribute("placeholder", " ");
    }
  });
}

/* ===================================================================
   9. DYNAMIC COPYRIGHT YEAR
   =================================================================== */
function initDynamicCopyright() {
  const yearElement = document.getElementById("copyright-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/* ===================================================================
   10. AOS (ANIMATION ON SCROLL) SCRIPT SAFETY FALLBACK
   =================================================================== */
function initAosFallback() {
  // If AOS script is loaded externally, initialize it
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      delay: 50
    });
  } else {
    // If AOS CDN fails or is slower, apply standard fade-in styles to reveal page content safely
    console.log("[Agency Engine] AOS fallback applied.");
    document.querySelectorAll("[data-aos]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }
}

/* ===================================================================
   11. PREMIUM SEARCH OVERLAY CONTROLLER
   =================================================================== */
function initSearchOverlay() {
  const triggers = document.querySelectorAll(".search-trigger");
  const overlay = document.querySelector(".search-overlay");
  const closeBtn = document.querySelector(".search-overlay-close");
  const input = document.querySelector(".search-input");

  if (!overlay || !closeBtn) return;

  const openSearch = () => {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      if (input) input.focus();
    }, 300);
  };

  const closeSearch = () => {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openSearch();
    });
  });

  closeBtn.addEventListener("click", closeSearch);

  // Close search overlay on 'Escape' key press
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) {
      closeSearch();
    }
  });
}

/* ===================================================================
   12. 3D CARD TILT EFFECT (Vanilla JS)
   =================================================================== */
function initTiltCards() {
  const cards = document.querySelectorAll("[data-tilt]");
  
  if (window.matchMedia("(max-width: 991.98px)").matches) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // position relative to card boundaries
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate relative degree rotation (-8 to 8 deg range)
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      // Revert transition
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
}

/* ===================================================================
   13. ANIMATED STATISTICS COUNTERS (Intersection Observer)
   =================================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll(".stat-counter-number");
  if (!counters.length) return;

  const runCounter = (el) => {
    const target = parseInt(el.getAttribute("data-target") || "0", 10);
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(start + easeProgress * (target - start));
      
      const suffix = el.getAttribute("data-suffix") || "";
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (!el.classList.contains("animated")) {
          el.classList.add("animated");
          runCounter(el);
        }
      }
    });
  }, { threshold: 0.1 });

  counters.forEach((counter) => observer.observe(counter));
}

/* ===================================================================
   14. SERVICES & INTERACTIVE CARD CURSOR SPOTLIGHT TRACKING
   =================================================================== */
function initServicesMouseFollow() {
  const interactiveCards = document.querySelectorAll(".service-card, .choose-card, .tech-card, .award-card, .mission-vision-card, .value-card, .award-glow-card, .timeline-card, .industry-card, .why-feature-box, .benefit-card");
  
  interactiveCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // Animated bars on the floating dashboard mockup card
  const bars = document.querySelectorAll(".floating-card-bar");
  if (bars.length) {
    setInterval(() => {
      bars.forEach(bar => {
        const randomHeight = Math.floor(Math.random() * 85) + 15; // 15% to 100%
        bar.style.height = `${randomHeight}%`;
      });
    }, 1800);
  }
}

/* ===================================================================
   15. PORTFOLIO CURSOR HOVER PREVIEW
   =================================================================== */
function initPortfolioCursorPreview() {
  if (window.innerWidth < 992) return; // Disable on touch/mobile/tablet screens
  
  const items = document.querySelectorAll(".portfolio-item");
  if (!items.length) return;

  // Create floating preview container if it doesn't exist
  let preview = document.querySelector(".portfolio-cursor-preview");
  if (!preview) {
    preview = document.createElement("div");
    preview.className = "portfolio-cursor-preview";
    document.body.appendChild(preview);
  }

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let currentScale = 0.8;
  let targetScale = 0.8;
  let active = false;

  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  function animate() {
    if (active || currentScale > 0.81) {
      mouseX = lerp(mouseX, targetX, 0.1);
      mouseY = lerp(mouseY, targetY, 0.1);
      currentScale = lerp(currentScale, targetScale, 0.1);
      
      preview.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${currentScale}) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    }
  }

  items.forEach(item => {
    const imgSrc = item.getAttribute("data-preview");
    
    item.addEventListener("mouseenter", (e) => {
      if (!imgSrc) return;
      preview.style.backgroundImage = `url(${imgSrc})`;
      preview.classList.add("visible");
      active = true;
      targetScale = 1;
      
      // Set initial positions close to cursor to prevent jumping
      targetX = e.clientX;
      targetY = e.clientY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      animate();
    });

    item.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    item.addEventListener("mouseleave", () => {
      preview.classList.remove("visible");
      targetScale = 0.8;
      active = false;
    });
  });
}

/* ===================================================================
   16. WORK PROCESS SCROLL-DRIVEN TIMELINE PROGRESS
   =================================================================== */
function initProcessTimeline() {
  const timeline = document.querySelector(".process-timeline-wrapper");
  const progress = document.querySelector(".process-timeline-progress");
  if (!timeline || !progress) return;

  const handleScroll = () => {
    const rect = timeline.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // We want the drawing to start when the top of the section enters the bottom 80% of viewport
    // and finish when the top of the section goes near the top (20% of viewport)
    const triggerStart = viewportHeight * 0.8;
    const triggerEnd = viewportHeight * 0.2;
    
    const totalHeight = rect.height;
    const currentScrolled = triggerStart - rect.top;
    
    let drawPercent = currentScrolled / (totalHeight + (triggerStart - triggerEnd));
    drawPercent = Math.max(0, Math.min(1, drawPercent));

    if (window.innerWidth >= 992) {
      progress.style.transform = `scaleX(${drawPercent})`;
      progress.style.transformOrigin = "left center";
    } else {
      progress.style.transform = `scaleY(${drawPercent})`;
      progress.style.transformOrigin = "top center";
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll, { passive: true });
  handleScroll(); // Trigger initially
}

/* ===================================================================
   17. SWIPER TESTIMONIAL SLIDER INITIALIZATION
   =================================================================== */
function initTestimonialsSwiper() {
  const container = document.querySelector(".testimonials-swiper");
  if (!container || typeof Swiper === "undefined") return;

  const swiper = new Swiper(".testimonials-swiper", {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    speed: 800,
    grabCursor: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    pagination: {
      el: ".testimonials-swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".testimonials-swiper-next",
      prevEl: ".testimonials-swiper-prev",
    },
    breakpoints: {
      // Small Tablets
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      // Desktop
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      }
    }
  });
}

/* ===================================================================
   18. ELEGANT PAGE LOADING TRANSITION SYSTEM
   =================================================================== */
function initPageLoader() {
  const loader = document.getElementById("page-loader");
  if (!loader) return;

  // Fade out loader smoothly once window is fully loaded
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("loaded");
    }, 500); // graceful delay for visual pacing
  });

  // Fallback if window load takes too long (e.g. slow resources)
  setTimeout(() => {
    if (!loader.classList.contains("loaded")) {
      loader.classList.add("loaded");
    }
  }, 3000);
}

/* ===================================================================
   19. PREMIUM BACK TO TOP PROGRESS INDICATOR
   =================================================================== */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  const bar = document.getElementById("progress-circle-bar");
  if (!btn || !bar) return;

  const updateScroll = () => {
    const scrollY = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    
    // Smooth visibility fade
    if (scrollY > 300) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }

    // Interactive circular path offset mapping
    if (height > 0) {
      const progress = scrollY / height;
      const offset = 283 - (progress * 283);
      bar.style.strokeDashoffset = offset;
    }
  };

  window.addEventListener("scroll", updateScroll);
  updateScroll(); // initial state detection

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* ===================================================================
   20. CINEMATIC VIDEO SHOWREEL CONTROLLER
   =================================================================== */
function initShowreelVideoModal() {
  const openBtn = document.getElementById("open-showreel-btn");
  const openTextBtn = document.getElementById("open-showreel-text-btn");
  const modal = document.getElementById("video-modal");
  const closeBtn = document.getElementById("close-video-modal");
  const iframe = document.getElementById("video-iframe");
  
  if (!modal || !closeBtn || !iframe) return;

  const agencyVideoUrl = "https://www.youtube.com/embed/3JZ_D3K60WI?autoplay=1&mute=0&rel=0";

  const openModal = (e) => {
    e.preventDefault();
    iframe.src = agencyVideoUrl;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("open");
    iframe.src = ""; // teardown video completely to avoid background audio
    document.body.style.overflow = "";
  };

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (openTextBtn) openTextBtn.addEventListener("click", openModal);
  
  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
}

/* ===================================================================
   21. LUXURY NEWSLETTER SUBSCRIPTION FORMS
   =================================================================== */
function submitNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  const feedback = document.getElementById("newsletter-feedback");
  
  if (!form || !feedback) return;

  feedback.classList.add("show");
  form.style.opacity = "0";
  form.style.pointerEvents = "none";

  setTimeout(() => {
    feedback.classList.remove("show");
    form.reset();
    form.style.opacity = "1";
    form.style.pointerEvents = "auto";
  }, 6000);
}

function submitFooterNewsletter() {
  const emailInput = document.getElementById("footer-newsletter-email");
  const successText = document.getElementById("footer-newsletter-success");
  const form = document.getElementById("footer-newsletter-form");
  if (!emailInput || !successText || !form) return;

  successText.style.display = "block";
  form.style.opacity = "0.4";
  form.style.pointerEvents = "none";

  setTimeout(() => {
    successText.style.display = "none";
    form.reset();
    form.style.opacity = "1";
    form.style.pointerEvents = "auto";
  }, 5000);
}


/* ===================================================================
   22. PREMIUM COMPANY TIMELINE SCROLL ENGINE
   =================================================================== */
function initCompanyTimelineProgress() {
  const timelineSection = document.querySelector(".company-timeline-section");
  const fill = document.querySelector(".timeline-progress-fill");
  const rows = document.querySelectorAll(".timeline-item-row");
  
  if (!timelineSection || !fill || rows.length === 0) return;
  
  function updateTimeline() {
    const rect = timelineSection.getBoundingClientRect();
    const sectionHeight = timelineSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // Calculate scroll percentage through the timeline section
    const topOfSectionInViewport = rect.top - viewportHeight;
    const totalScrollableDistance = sectionHeight + viewportHeight;
    
    let percentage = 0;
    if (topOfSectionInViewport < 0) {
      percentage = Math.abs(topOfSectionInViewport) / totalScrollableDistance;
      percentage = Math.min(Math.max(percentage * 100, 0), 100);
    }
    
    fill.style.height = `${percentage}%`;
    
    // Highlight active milestone card when it is scrolled past
    rows.forEach(row => {
      const rowRect = row.getBoundingClientRect();
      const rowMiddle = rowRect.top + rowRect.height / 2;
      const triggerPoint = viewportHeight * 0.6;
      
      if (rowMiddle < triggerPoint) {
        row.classList.add("active-milestone");
      } else {
        row.classList.remove("active-milestone");
      }
    });
  }
  
  window.addEventListener("scroll", updateTimeline);
  window.addEventListener("resize", updateTimeline);
  updateTimeline(); // run once initially
}


/* ===================================================================
   23. SERVICE DETAILS WORKFLOW SCROLL ENGINE
   =================================================================== */
function initWorkflowTimeline() {
  const workflowSection = document.querySelector(".workflow-section");
  const fill = document.querySelector(".workflow-timeline-progress");
  const steps = document.querySelectorAll(".workflow-step-card");
  
  if (!workflowSection || !fill || steps.length === 0) return;
  
  function updateWorkflowProgress() {
    const rect = workflowSection.getBoundingClientRect();
    const sectionHeight = workflowSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // Calculate scroll progress percentage through the section
    const topOfSectionInViewport = rect.top - viewportHeight * 0.4;
    const totalScrollableDistance = sectionHeight - viewportHeight * 0.2;
    
    let percentage = 0;
    if (topOfSectionInViewport < 0) {
      percentage = Math.abs(topOfSectionInViewport) / totalScrollableDistance;
      percentage = Math.min(Math.max(percentage * 100, 0), 100);
    }
    
    // Check screen width to determine if vertical or horizontal progress layout
    if (window.innerWidth < 992) {
      // In vertical progress mode, fill height instead of width
      fill.style.width = "4px";
      fill.style.height = `${percentage}%`;
    } else {
      fill.style.height = "4px";
      fill.style.width = `${percentage}%`;
    }
    
    // Stagger activation of cards based on percentage
    const stepCount = steps.length;
    steps.forEach((step, idx) => {
      const threshold = (idx / (stepCount - 1)) * 90;
      if (percentage >= threshold) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });
  }
  
  window.addEventListener("scroll", updateWorkflowProgress);
  window.addEventListener("resize", updateWorkflowProgress);
  updateWorkflowProgress(); // initial execution
}

/* ===================================================================
   24. PREMIUM CUSTOM GLASSMORPHIC TOAST NOTIFICATION
   =================================================================== */
window.showPremiumToast = function(message) {
  let toastContainer = document.querySelector(".premium-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "premium-toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "premium-toast";
  toast.innerHTML = `
    <div class="premium-toast-content">
      <i class="bi bi-info-circle-fill premium-toast-icon"></i>
      <span class="premium-toast-message"></span>
    </div>
    <button class="premium-toast-close" aria-label="Close notification">
      <i class="bi bi-x"></i>
    </button>
  `;

  // Safely set text content to prevent XSS
  toast.querySelector(".premium-toast-message").textContent = message;

  toastContainer.appendChild(toast);

  // Trigger animations
  setTimeout(() => {
    toast.classList.add("show");
  }, 50);

  const closeToast = () => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => {
      toast.remove();
      if (toastContainer.children.length === 0) {
        toastContainer.remove();
      }
    }, 400);
  };

  toast.querySelector(".premium-toast-close").addEventListener("click", closeToast);

  // Auto-remove after 5 seconds
  setTimeout(closeToast, 5000);
};



