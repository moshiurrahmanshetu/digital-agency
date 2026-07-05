document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  initContactHeroParallax();
  initContactFormValidation();
  initContactAccordion();
  initCtaParticles();
});

/* ===================================================================
   1. HERO PARALLAX & CARD FLOATING PHYSICS
   =================================================================== */
function initContactHeroParallax() {
  const heroSec = document.getElementById("contact-hero");
  if (!heroSec || window.innerWidth < 992) return;

  const floatingCards = heroSec.querySelectorAll(".hero-glass-floating-card");
  const glowOrb = heroSec.querySelector(".hero-orb-glowing");

  heroSec.addEventListener("mousemove", (e) => {
    const rect = heroSec.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    // Smooth movement of cards
    floatingCards.forEach((card, idx) => {
      const factorX = (idx + 1) * 15;
      const factorY = (idx + 1) * 12;
      card.style.transform = `translate(${percentX * factorX}px, ${percentY * factorY}px)`;
    });

    // Move glowing orb in opposite directions
    if (glowOrb) {
      glowOrb.style.transform = `translate(${percentX * -30}px, ${percentY * -30}px) scale(1.05)`;
    }
  });

  heroSec.addEventListener("mouseleave", () => {
    floatingCards.forEach(card => {
      card.style.transform = "translate(0, 0)";
    });
    if (glowOrb) {
      glowOrb.style.transform = "translate(0, 0) scale(1)";
    }
  });
}

/* ===================================================================
   2. FORM CLIENT-SIDE VALIDATION & SUCCESS SEQUENCING
   =================================================================== */
function initContactFormValidation() {
  const form = document.getElementById("avant-premium-contact-form");
  if (!form) return;

  const feedbackCard = document.getElementById("form-feedback-card");
  const feedbackSuccess = document.getElementById("feedback-success-state");
  const feedbackError = document.getElementById("feedback-error-state");
  const submitBtn = form.querySelector(".btn-premium");
  const submitText = form.querySelector(".submit-btn-text");
  const spinner = form.querySelector(".btn-spinner");

  const inputs = form.querySelectorAll("input, textarea, select");

  // Live input validation on typing/blur
  inputs.forEach(input => {
    input.addEventListener("blur", () => {
      validateField(input);
    });

    input.addEventListener("input", () => {
      // Remove invalid class once user starts correcting
      if (input.value.trim() !== "") {
        const parent = input.closest(".form-floating-custom");
        if (parent) parent.classList.remove("is-invalid");
      }
    });
  });

  function validateField(input) {
    const parent = input.closest(".form-floating-custom");
    if (!parent) return true;

    let isValid = true;
    const val = input.value.trim();

    // Check required
    if (input.hasAttribute("required") && val === "") {
      isValid = false;
    }

    // Specific type checks
    if (isValid && input.type === "email" && val !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(val);
    }

    if (isValid && input.type === "tel" && val !== "") {
      // Simple phone verification (at least 7 digits)
      const telRegex = /^\+?[0-9\s\-()]{7,20}$/;
      isValid = telRegex.test(val);
    }

    if (!isValid) {
      parent.classList.add("is-invalid");
    } else {
      parent.classList.remove("is-invalid");
    }

    return isValid;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isFormValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    // Handle policy agreement checkbox
    const gdprCheck = document.getElementById("gdpr-policy-consent");
    if (gdprCheck && !gdprCheck.checked) {
      isFormValid = false;
      gdprCheck.closest(".premium-checkbox-label").style.color = "#ef4444";
      setTimeout(() => {
        gdprCheck.closest(".premium-checkbox-label").style.color = "";
      }, 3000);
    }

    if (!isFormValid) {
      // Shaking animation fallback on the card
      const formCard = form.closest(".contact-form-container-card");
      if (formCard) {
        formCard.classList.add("shake-animation");
        setTimeout(() => formCard.classList.remove("shake-animation"), 600);
      }
      return;
    }

    // Enter Loading State
    if (spinner) spinner.style.display = "inline-block";
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = "Processing Onboarding...";

    // Simulate elite regional secure servers delay
    setTimeout(() => {
      // Inside production standard: successful inquiry dispatch
      if (spinner) spinner.style.display = "none";
      if (submitText) submitText.textContent = "Dispatched Successfully";

      // Show Flawless Feedback Modal
      if (feedbackCard) {
        feedbackCard.classList.add("active");
        if (feedbackSuccess) feedbackSuccess.classList.remove("d-none");
        if (feedbackError) feedbackError.classList.add("d-none");
      }

      form.reset();
    }, 2000);
  });

  // Reset Button in feedback card
  const resetBtns = document.querySelectorAll(".feedback-reset-btn");
  resetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (feedbackCard) feedbackCard.classList.remove("active");
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = "Initiate Onboarding Sequence";
    });
  });
}

/* ===================================================================
   3. ACCORDION EXPANSION WITH SPRING PHYSICS
   =================================================================== */
function initContactAccordion() {
  const headers = document.querySelectorAll(".contact-faq-header");

  headers.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.closest(".contact-faq-item");
      const collapse = item.querySelector(".contact-faq-collapse");
      const isExpanded = header.getAttribute("aria-expanded") === "true";

      // Close all other accordions first
      headers.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.setAttribute("aria-expanded", "false");
          const otherItem = otherHeader.closest(".contact-faq-item");
          const otherCollapse = otherItem.querySelector(".contact-faq-collapse");
          if (otherCollapse) otherCollapse.style.maxHeight = null;
        }
      });

      // Toggle current accordion
      if (isExpanded) {
        header.setAttribute("aria-expanded", "false");
        collapse.style.maxHeight = null;
      } else {
        header.setAttribute("aria-expanded", "true");
        collapse.style.maxHeight = collapse.scrollHeight + "px";
      }
    });
  });
}

/* ===================================================================
   4. CTA FLOATING PARTICLES
   =================================================================== */
function initCtaParticles() {
  const ctaSec = document.getElementById("contact-final-cta");
  if (!ctaSec) return;

  const count = 15;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "floating-particle";

    const size = Math.random() * 5 + 3;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.animation = `cta-particle-drift ${duration}s linear infinite`;
    particle.style.animationDelay = `${delay}s`;

    ctaSec.appendChild(particle);
  }
}

// Inject drifting keyframes into stylesheet dynamically
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes cta-particle-drift {
    0% { transform: translateY(0px) translateX(0px); opacity: 0; }
    10% { opacity: 0.35; }
    90% { opacity: 0.35; }
    100% { transform: translateY(-80px) translateX(20px); opacity: 0; }
  }
  @keyframes shake-animation-keyframes {
    0%, 100% { transform: translateX(0); }
    15%, 45%, 75% { transform: translateX(-8px); }
    30%, 60%, 90% { transform: translateX(8px); }
  }
  .shake-animation {
    animation: shake-animation-keyframes 0.6s ease;
  }
`;
document.head.appendChild(styleSheet);
