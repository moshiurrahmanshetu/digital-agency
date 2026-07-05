document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  initPricingToggle();
  initPricingHeroParallax();
  initPricingCalculator();
  initPricingAccordion();
  initPricingParticles();
});

/* ===================================================================
   1. MONTHLY / YEARLY PLANS TOGGLE WITH SWIFT ANIMATIONS
   =================================================================== */
function initPricingToggle() {
  const toggleWrap = document.querySelector(".pricing-toggle-wrap");
  if (!toggleWrap) return;

  const toggleBtns = toggleWrap.querySelectorAll(".pricing-toggle-btn");
  const priceAmounts = document.querySelectorAll("[data-monthly-price]");

  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Deactivate all
      toggleBtns.forEach(b => b.classList.remove("active"));
      // Activate clicked
      btn.classList.add("active");

      const period = btn.getAttribute("data-period");

      priceAmounts.forEach(priceEl => {
        // Retrieve values
        const monthly = priceEl.getAttribute("data-monthly-price");
        const yearly = priceEl.getAttribute("data-yearly-price");
        const targetVal = period === "yearly" ? yearly : monthly;

        // Apply a quick fade out, update, and fade in animation
        priceEl.style.opacity = "0";
        priceEl.style.transform = "scale(0.95)";

        setTimeout(() => {
          priceEl.textContent = targetVal;
          priceEl.style.opacity = "1";
          priceEl.style.transform = "scale(1)";

          // Update period labels
          const periodLabel = priceEl.closest(".pricing-card-premium")?.querySelector(".plan-price-period");
          if (periodLabel) {
            periodLabel.textContent = period === "yearly" ? "/ Month, Billed Annually" : "/ Month, Billed Monthly";
          }
        }, 200);
      });
    });
  });
}

/* ===================================================================
   2. HERO PARALLAX & DESIGN PHYSICS
   =================================================================== */
function initPricingHeroParallax() {
  const heroSec = document.getElementById("pricing-hero");
  if (!heroSec || window.innerWidth < 992) return;

  const floatingCards = heroSec.querySelectorAll(".pricing-hero-floating-card");
  const glowOrb = heroSec.querySelector(".pricing-orb-glowing");

  heroSec.addEventListener("mousemove", (e) => {
    const rect = heroSec.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    floatingCards.forEach((card, idx) => {
      const factorX = (idx + 1) * 12;
      const factorY = (idx + 1) * 10;
      card.style.transform = `translate(${percentX * factorX}px, ${percentY * factorY}px)`;
    });

    if (glowOrb) {
      glowOrb.style.transform = `translate(${percentX * -25}px, ${percentY * -25}px) scale(1.05)`;
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
   3. REAL-TIME INTERACTIVE BUDGET ESTIMATOR / PRICING CALCULATOR
   =================================================================== */
function initPricingCalculator() {
  const calculator = document.getElementById("avant-pricing-calculator");
  if (!calculator) return;

  const projectsSlider = document.getElementById("calc-projects");
  const teamSlider = document.getElementById("calc-team");
  
  const projectsOutput = document.getElementById("calc-projects-output");
  const teamOutput = document.getElementById("calc-team-output");

  const slaAddon = document.getElementById("calc-sla");
  const brandAddon = document.getElementById("calc-brand");

  const calcPeriodBtns = document.querySelectorAll(".calc-period-btn");
  const calcTotalEl = document.getElementById("calc-total-val");
  const calcPeriodLabel = document.getElementById("calc-period-label");

  let currentPeriod = "monthly"; // monthly or yearly

  function calculateCost() {
    const activeProjects = parseInt(projectsSlider.value, 10);
    const teamMembers = parseInt(teamSlider.value, 10);

    // Update values in sliders labels
    projectsOutput.textContent = activeProjects === 10 ? "10+ Projects" : `${activeProjects} Projects`;
    teamOutput.textContent = teamMembers === 30 ? "30+ Members" : `${teamMembers} Members`;

    // Calculation Model
    // Base cost: $1200
    // Project weight: $350 per project
    // Team weight: $60 per member
    let basePrice = 1200;
    let projectsCost = activeProjects * 350;
    let teamCost = teamMembers * 60;

    let addonsCost = 0;
    if (slaAddon && slaAddon.checked) {
      addonsCost += 499;
    }
    if (brandAddon && brandAddon.checked) {
      addonsCost += 1199;
    }

    let total = basePrice + projectsCost + teamCost + addonsCost;

    // Apply discount if yearly billing active
    if (currentPeriod === "yearly") {
      total = total * 0.8; // 20% Discount
    }

    // Dynamic formatting with thousands separators
    const formattedTotal = Math.round(total).toLocaleString("en-US");

    // Smooth transition update
    if (calcTotalEl) {
      calcTotalEl.textContent = formattedTotal;
    }
  }

  // Bind Events
  if (projectsSlider) {
    projectsSlider.addEventListener("input", calculateCost);
  }
  if (teamSlider) {
    teamSlider.addEventListener("input", calculateCost);
  }
  if (slaAddon) {
    slaAddon.addEventListener("change", calculateCost);
  }
  if (brandAddon) {
    brandAddon.addEventListener("change", calculateCost);
  }

  calcPeriodBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      calcPeriodBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentPeriod = btn.getAttribute("data-calc-period");
      if (calcPeriodLabel) {
        calcPeriodLabel.textContent = currentPeriod === "yearly" ? "/ Month, Billed Annually" : "/ Month, Billed Monthly";
      }

      calculateCost();
    });
  });

  // Initial Run
  calculateCost();
}

/* ===================================================================
   4. ACCORDION MULTI-COLLAPSE ENGINE
   =================================================================== */
function initPricingAccordion() {
  const headers = document.querySelectorAll(".pricing-faq-header");

  headers.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.closest(".pricing-faq-item");
      const collapse = item.querySelector(".pricing-faq-collapse");
      const isExpanded = header.getAttribute("aria-expanded") === "true";

      // Close all other accordions first to maintain premium focus
      headers.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.setAttribute("aria-expanded", "false");
          const otherItem = otherHeader.closest(".pricing-faq-item");
          const otherCollapse = otherItem.querySelector(".pricing-faq-collapse");
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
   5. CTA FLOATING PARTICLES
   =================================================================== */
function initPricingParticles() {
  const ctaSec = document.getElementById("pricing-final-cta");
  if (!ctaSec) return;

  const count = 12;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "pricing-particle";

    const size = Math.random() * 4 + 3;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 12 + 10;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.animation = `pricing-particle-drift ${duration}s linear infinite`;
    particle.style.animationDelay = `${delay}s`;

    ctaSec.appendChild(particle);
  }
}

// Inject drifting keyframes into stylesheet dynamically for pricing
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes pricing-particle-drift {
    0% { transform: translateY(0px) translateX(0px); opacity: 0; }
    10% { opacity: 0.35; }
    90% { opacity: 0.35; }
    100% { transform: translateY(-70px) translateX(-20px); opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);
