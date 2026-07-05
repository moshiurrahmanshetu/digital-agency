document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  initCareersFilters();
  initCareersAccordion();
  initCareersTimeline();
  initCareersHeroParallax();
  initCareersParticles();
  initCareersDetailsToggle();
});

/* ===================================================================
   1. JOB BOARD FILTERING SYSTEM
   =================================================================== */
function initCareersFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const jobCards = document.querySelectorAll(".job-card");
  const noJobsState = document.querySelector(".no-jobs-found");

  if (!filterButtons.length || !jobCards.length) return;

  // Track original job counts for count badges
  const departments = ["engineering", "design", "strategy", "operations"];
  
  function updateBadges() {
    filterButtons.forEach(btn => {
      const dept = btn.getAttribute("data-filter");
      const badge = btn.querySelector(".badge-count");
      if (!badge) return;

      if (dept === "all") {
        badge.textContent = jobCards.length;
      } else {
        const count = Array.from(jobCards).filter(card => card.getAttribute("data-department") === dept).length;
        badge.textContent = count;
      }
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Toggle active states
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");
      let visibleCount = 0;

      jobCards.forEach(card => {
        const cardDept = card.getAttribute("data-department");
        
        // Handle fading animations smoothly
        if (filterValue === "all" || cardDept === filterValue) {
          card.style.display = "block";
          visibleCount++;
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(15px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });

      // Manage empty state
      if (noJobsState) {
        if (visibleCount === 0) {
          setTimeout(() => {
            noJobsState.classList.remove("d-none");
            noJobsState.style.opacity = "1";
          }, 300);
        } else {
          noJobsState.classList.add("d-none");
          noJobsState.style.opacity = "0";
        }
      }
    });
  });

  // Run initial state
  updateBadges();
}

/* ===================================================================
   2. COLLAPSIBLE ACCORDION FOR CAREERS FAQ
   =================================================================== */
function initCareersAccordion() {
  const accordionItems = document.querySelectorAll(".faq-accordion-item");

  accordionItems.forEach(item => {
    const btn = item.querySelector(".faq-accordion-btn");
    const collapse = item.querySelector(".faq-accordion-collapse");

    if (!btn || !collapse) return;

    btn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other items first (one-at-a-time mode)
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          const otherCollapse = otherItem.querySelector(".faq-accordion-collapse");
          if (otherCollapse) {
            otherCollapse.style.maxHeight = null;
          }
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove("active");
        collapse.style.maxHeight = null;
      } else {
        item.classList.add("active");
        collapse.style.maxHeight = collapse.scrollHeight + "px";
      }
    });

    // Support Space / Enter keyboard activation
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

/* ===================================================================
   3. SCROLL-LINKED DYNAMIC TIMELINE PROGRESS
   =================================================================== */
function initCareersTimeline() {
  const timelineWrap = document.querySelector(".timeline-scroll-wrap");
  const fillLine = document.querySelector(".timeline-progress-fill");
  const steps = document.querySelectorAll(".timeline-step-col");

  if (!timelineWrap || !fillLine || !steps.length) return;

  function updateTimelineProgress() {
    const rect = timelineWrap.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate scroll percentage of the timeline section
    // Start tracking when section center enters viewport, finish when bottom leaves
    const elementTop = rect.top;
    const elementHeight = rect.height;

    // Normalize progress between 0 and 1
    let progress = (viewportHeight - elementTop) / (viewportHeight + elementHeight * 0.5);
    progress = Math.min(Math.max(progress, 0), 1);

    // Apply percentage to fill bar
    const percentage = progress * 100;
    fillLine.style.width = `${Math.max(percentage, 18)}%`; // Lock minimum at 18% so step 1 is always active

    // Dynamically activate sequential nodes as scroll advances
    const activeThresholds = [0.15, 0.32, 0.49, 0.66, 0.83, 0.95];
    steps.forEach((step, idx) => {
      if (progress >= activeThresholds[idx]) {
        step.classList.add("active");
      } else if (idx > 0) { // Keep Step 1 (idx === 0) permanently active
        step.classList.remove("active");
      }
    });
  }

  // Bind scroll and load events
  window.addEventListener("scroll", updateTimelineProgress, { passive: true });
  window.addEventListener("resize", updateTimelineProgress, { passive: true });
  updateTimelineProgress();
}

/* ===================================================================
   4. HERO FLOATING CARD PARALLAX INTERACTION
   =================================================================== */
function initCareersHeroParallax() {
  const heroSection = document.getElementById("careers-hero");
  if (!heroSection || window.innerWidth < 992) return;

  const floaters = heroSection.querySelectorAll(".careers-floater-card");
  const glowOrb = heroSection.querySelector(".careers-orb-glowing");

  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (mouseX - centerX) / centerX;
    const deltaY = (mouseY - centerY) / centerY;

    floaters.forEach((floater, index) => {
      const factorX = (index + 1) * 15;
      const factorY = (index + 1) * 12;
      floater.style.transform = `translate(${deltaX * factorX}px, ${deltaY * factorY}px)`;
    });

    if (glowOrb) {
      glowOrb.style.transform = `translate(${deltaX * -25}px, ${deltaY * -25}px) scale(1.1)`;
    }
  });

  heroSection.addEventListener("mouseleave", () => {
    floaters.forEach(floater => {
      floater.style.transform = "translate(0, 0)";
    });
    if (glowOrb) {
      glowOrb.style.transform = "translate(0, 0) scale(1)";
    }
  });
}

/* ===================================================================
   5. CTA DRIFTING PARTICLES ANIMATION
   =================================================================== */
function initCareersParticles() {
  const ctaSection = document.getElementById("careers-final-cta");
  if (!ctaSection) return;

  const particleCount = 12;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "careers-particle";

    const diameter = Math.random() * 4 + 3;
    const leftPercent = Math.random() * 100;
    const topPercent = Math.random() * 100;
    const animationDelay = Math.random() * 6;
    const animationDuration = Math.random() * 14 + 10;

    particle.style.width = `${diameter}px`;
    particle.style.height = `${diameter}px`;
    particle.style.left = `${leftPercent}%`;
    particle.style.top = `${topPercent}%`;
    particle.style.animation = `careers-particle-drift ${animationDuration}s linear infinite`;
    particle.style.animationDelay = `${animationDelay}s`;

    ctaSection.appendChild(particle);
  }
}

// Inject particle drifting frames dynamically to avoid stylesheet pollution
const customParticleKeyframes = document.createElement("style");
customParticleKeyframes.textContent = `
  .careers-particle {
    position: absolute;
    background-color: var(--accent-primary);
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
    z-index: 1;
  }
  @keyframes careers-particle-drift {
    0% { transform: translateY(0px) translateX(0px); opacity: 0; }
    15% { opacity: 0.25; }
    85% { opacity: 0.25; }
    100% { transform: translateY(-90px) translateX(-30px); opacity: 0; }
  }
`;
document.head.appendChild(customParticleKeyframes);

/* ===================================================================
   6. INLINE JOB DESCRIPTION COLLAPSE/EXPAND SYSTEM
   =================================================================== */
function initCareersDetailsToggle() {
  const toggleButtons = document.querySelectorAll(".job-details-toggle-btn");
  toggleButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".job-card");
      if (!card) return;
      const detailsBlock = card.querySelector(".job-expanded-details");
      if (!detailsBlock) return;

      const isExpanded = btn.classList.contains("active");
      if (isExpanded) {
        detailsBlock.style.maxHeight = "0px";
        btn.classList.remove("active");
        btn.textContent = "Details";
      } else {
        // Set exact pixel height for transition, then auto after animation
        detailsBlock.style.maxHeight = detailsBlock.scrollHeight + "px";
        btn.classList.add("active");
        btn.textContent = "Collapse";
      }
    });
  });
}
