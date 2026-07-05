document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Init sections
  initFaqSearchAndFilter();
  initFaqAccordion();
  initFaqPopularConnections();
  initFaqHeroParallax();
  initFaqParticles();
});

/* ===================================================================
   1. SMART SEARCH & CATEGORY FILTERING ENGINE (VANILLA JS ONLY)
   =================================================================== */
function initFaqSearchAndFilter() {
  const searchInput = document.getElementById("faq-search-input");
  const clearBtn = document.getElementById("faq-clear-search");
  const categoryTabs = document.querySelectorAll(".faq-category-tab");
  const accordionItems = document.querySelectorAll(".faq-list-item-wrapper");
  const emptyState = document.getElementById("faq-search-empty-state");
  const activeCountEl = document.getElementById("faq-active-count");

  if (!searchInput) return;

  let currentCategory = "all";
  let searchQuery = "";

  // Dynamic Key shortcut: Pressing "/" focuses the search bar instantly
  document.addEventListener("keydown", (e) => {
    // Focus search input when "/" is pressed, unless user is already inside an input/textarea
    if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Calculate Category Counts dynamically
  function updateCategoryCounts() {
    categoryTabs.forEach(tab => {
      const cat = tab.getAttribute("data-category");
      const countBadge = tab.querySelector(".count-badge");
      if (!countBadge) return;

      if (cat === "all") {
        countBadge.textContent = accordionItems.length;
      } else {
        const matches = Array.from(accordionItems).filter(item => item.getAttribute("data-item-category") === cat);
        countBadge.textContent = matches.length;
      }
    });
  }

  // Pure Highlight Utility: safely wraps query match with styling
  function highlightText(element, query) {
    if (!query) {
      // Restore original text if query is empty
      const originalText = element.getAttribute("data-original-text");
      if (originalText) {
        element.innerHTML = originalText;
      }
      return;
    }

    // Save original text once if not already saved
    if (!element.getAttribute("data-original-text")) {
      element.setAttribute("data-original-text", element.innerHTML);
    }

    const originalText = element.getAttribute("data-original-text") || element.innerHTML;
    
    // Perform safe regex replacement
    const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    
    // Avoid breaking inner HTML structure, target only actual text inside
    const newHTML = originalText.replace(regex, `<span class="faq-highlight-match">$1</span>`);
    element.innerHTML = newHTML;
  }

  // Core Filter & Match function
  function applyFiltering() {
    let visibleCount = 0;
    searchQuery = searchInput.value.toLowerCase().trim();

    accordionItems.forEach(item => {
      const itemCategory = item.getAttribute("data-item-category");
      const questionEl = item.querySelector(".faq-item-question");
      const bodyEl = item.querySelector(".faq-item-body-content");

      const questionText = questionEl ? questionEl.textContent.toLowerCase() : "";
      const bodyText = bodyEl ? bodyEl.textContent.toLowerCase() : "";

      const categoryMatch = (currentCategory === "all" || itemCategory === currentCategory);
      const searchMatch = (searchQuery === "" || questionText.includes(searchQuery) || bodyText.includes(searchQuery));

      if (categoryMatch && searchMatch) {
        item.style.display = "block";
        visibleCount++;
        
        // Apply text highlights on search matching
        if (questionEl) highlightText(questionEl, searchQuery);
        if (bodyEl) highlightText(bodyEl, searchQuery);
      } else {
        item.style.display = "none";
        // Clean highlight styling if not matching
        if (questionEl) highlightText(questionEl, "");
        if (bodyEl) highlightText(bodyEl, "");
      }
    });

    // Update active counters
    if (activeCountEl) {
      activeCountEl.textContent = `Showing ${visibleCount} of ${accordionItems.length} entries`;
    }

    // Toggle Empty state view
    if (visibleCount === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
    }
  }

  // Clear Search Input Action
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearBtn.classList.remove("active");
      applyFiltering();
      searchInput.focus();
    });
  }

  // Search Input Event
  searchInput.addEventListener("input", () => {
    if (searchInput.value.length > 0) {
      clearBtn.classList.add("active");
    } else {
      clearBtn.classList.remove("active");
    }
    applyFiltering();
  });

  // Category Tab Click Event
  categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      categoryTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentCategory = tab.getAttribute("data-category");
      applyFiltering();
    });
  });

  // Run initial calculations
  updateCategoryCounts();
  applyFiltering();
}

/* ===================================================================
   2. ACCORDION MULTI-COLLAPSE ACCESSIBLE CONTROLLER
   =================================================================== */
function initFaqAccordion() {
  const headers = document.querySelectorAll(".faq-item-header-btn");
  const expandAllBtn = document.getElementById("faq-expand-all");
  const collapseAllBtn = document.getElementById("faq-collapse-all");

  headers.forEach(header => {
    // Click Interaction
    header.addEventListener("click", () => {
      toggleAccordionItem(header);
    });

    // Keyboard Accessibility (Support Spacebar and Enter)
    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleAccordionItem(header);
      }
    });
  });

  // Toggle Function
  function toggleAccordionItem(header) {
    const item = header.closest(".faq-list-item-wrapper");
    const pane = item.querySelector(".faq-item-collapse-pane");
    const isExpanded = header.getAttribute("aria-expanded") === "true";

    // One-at-a-time mode: Close other items
    headers.forEach(otherHeader => {
      if (otherHeader !== header) {
        otherHeader.setAttribute("aria-expanded", "false");
        const otherItem = otherHeader.closest(".faq-list-item-wrapper");
        otherItem.classList.remove("active-accordion");
        const otherPane = otherItem.querySelector(".faq-item-collapse-pane");
        if (otherPane) otherPane.style.maxHeight = null;
      }
    });

    // Toggle current
    if (isExpanded) {
      header.setAttribute("aria-expanded", "false");
      item.classList.remove("active-accordion");
      pane.style.maxHeight = null;
    } else {
      header.setAttribute("aria-expanded", "true");
      item.classList.add("active-accordion");
      pane.style.maxHeight = pane.scrollHeight + "px";
    }
  }

  // Expand All Action
  if (expandAllBtn) {
    expandAllBtn.addEventListener("click", () => {
      headers.forEach(header => {
        const item = header.closest(".faq-list-item-wrapper");
        const pane = item.querySelector(".faq-item-collapse-pane");
        // Only expand if item is currently visible (to not conflict with search filtering)
        if (item.style.display !== "none") {
          header.setAttribute("aria-expanded", "true");
          item.classList.add("active-accordion");
          pane.style.maxHeight = pane.scrollHeight + "px";
        }
      });
    });
  }

  // Collapse All Action
  if (collapseAllBtn) {
    collapseAllBtn.addEventListener("click", () => {
      headers.forEach(header => {
        const item = header.closest(".faq-list-item-wrapper");
        const pane = item.querySelector(".faq-item-collapse-pane");
        header.setAttribute("aria-expanded", "false");
        item.classList.remove("active-accordion");
        pane.style.maxHeight = null;
      });
    });
  }
}

/* ===================================================================
   3. POPULAR FAQ INTERACTION & HIGHLIGHT CONNECTION
   =================================================================== */
function initFaqPopularConnections() {
  const popularCards = document.querySelectorAll(".popular-faq-card[data-target-question]");

  popularCards.forEach(card => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = card.getAttribute("data-target-question");
      const targetItem = document.getElementById(targetId);

      if (targetItem) {
        // Find header and expand pane
        const header = targetItem.querySelector(".faq-item-header-btn");
        const pane = targetItem.querySelector(".faq-item-collapse-pane");

        // Clear any filters (Set Category Tab back to ALL to make sure the item is shown)
        const allTab = document.querySelector(".faq-category-tab[data-category='all']");
        if (allTab) {
          allTab.click();
        }

        // Close other accordions first
        const allHeaders = document.querySelectorAll(".faq-item-header-btn");
        allHeaders.forEach(otherHeader => {
          if (otherHeader !== header) {
            otherHeader.setAttribute("aria-expanded", "false");
            const otherItem = otherHeader.closest(".faq-list-item-wrapper");
            otherItem.classList.remove("active-accordion");
            const otherPane = otherItem.querySelector(".faq-item-collapse-pane");
            if (otherPane) otherPane.style.maxHeight = null;
          }
        });

        // Expand this accordion
        header.setAttribute("aria-expanded", "true");
        targetItem.classList.add("active-accordion");
        pane.style.maxHeight = pane.scrollHeight + "px";

        // Scroll smoothly to target element
        const offsetPosition = targetItem.getBoundingClientRect().top + window.pageYOffset - 120; // offset for sticky headers
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        // Add a temporary glow animation
        targetItem.style.transition = "all 0.3s ease";
        targetItem.style.outline = "2px solid var(--accent-primary)";
        targetItem.style.boxShadow = "0 0 30px rgba(var(--accent-primary-rgb), 0.25)";

        setTimeout(() => {
          targetItem.style.outline = "none";
          targetItem.style.boxShadow = "";
        }, 1500);
      }
    });
  });
}

/* ===================================================================
   4. HERO PARALLAX & DESIGN PHYSICS
   =================================================================== */
function initFaqHeroParallax() {
  const heroSec = document.getElementById("faq-hero");
  if (!heroSec || window.innerWidth < 992) return;

  const floatingCards = heroSec.querySelectorAll(".faq-hero-floating-card");
  const glowOrb = heroSec.querySelector(".faq-orb-glowing");

  heroSec.addEventListener("mousemove", (e) => {
    const rect = heroSec.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    floatingCards.forEach((card, idx) => {
      const factorX = (idx + 1) * 14;
      const factorY = (idx + 1) * 11;
      card.style.transform = `translate(${percentX * factorX}px, ${percentY * factorY}px)`;
    });

    if (glowOrb) {
      glowOrb.style.transform = `translate(${percentX * -30}px, ${percentY * -30}px) scale(1.08)`;
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
   5. CTA DRIFTING PARTICLES
   =================================================================== */
function initFaqParticles() {
  const ctaSec = document.getElementById("faq-final-cta");
  if (!ctaSec) return;

  const count = 15;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "faq-particle";

    const size = Math.random() * 4 + 3;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 12 + 10;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.animation = `faq-particle-drift ${duration}s linear infinite`;
    particle.style.animationDelay = `${delay}s`;

    ctaSec.appendChild(particle);
  }
}

// Inject drifting keyframes into stylesheet dynamically for FAQ page
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes faq-particle-drift {
    0% { transform: translateY(0px) translateX(0px); opacity: 0; }
    10% { opacity: 0.3; }
    90% { opacity: 0.3; }
    100% { transform: translateY(-80px) translateX(-25px); opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);
