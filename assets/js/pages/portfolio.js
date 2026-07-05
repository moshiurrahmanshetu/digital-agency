document.addEventListener("DOMContentLoaded", () => {
  initPortfolioFiltering();
  initPortfolioTiltAndHover();
});

/* ===================================================================
   1. PORTFOLIO FILTERING & SLIDING INDICATOR
   =================================================================== */
function initPortfolioFiltering() {
  const filterNav = document.querySelector(".portfolio-filter-nav");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const slidingIndicator = document.querySelector(".filter-sliding-indicator");
  const portfolioCols = document.querySelectorAll(".portfolio-col");

  if (!filterBtns.length || !portfolioCols.length) return;

  // Function to move the sliding indicator
  function updateIndicator(activeBtn) {
    if (!slidingIndicator || !filterNav) return;
    
    const navRect = filterNav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    // Compute relative coordinates
    const leftOffset = btnRect.left - navRect.left;
    const btnWidth = btnRect.width;

    slidingIndicator.style.left = `${leftOffset}px`;
    slidingIndicator.style.width = `${btnWidth}px`;
  }

  // Set initial indicator position
  const activeBtn = document.querySelector(".filter-btn.active") || filterBtns[0];
  setTimeout(() => {
    updateIndicator(activeBtn);
  }, 150);

  // Re-align on window resize
  window.addEventListener("resize", () => {
    const currentActive = document.querySelector(".filter-btn.active") || filterBtns[0];
    updateIndicator(currentActive);
  });

  // Handle clicking filters
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // 1. Update Active Class
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // 2. Animate sliding indicator
      updateIndicator(btn);

      // 3. Filter Items
      const targetCategory = btn.getAttribute("data-filter");

      portfolioCols.forEach(col => {
        const itemCategory = col.getAttribute("data-category");

        if (targetCategory === "all" || itemCategory === targetCategory) {
          // Show
          col.classList.remove("filtered-out");
          
          // Re-trigger AOS animations or standard fades
          setTimeout(() => {
            col.style.opacity = "1";
            col.style.transform = "scale(1) translateY(0)";
          }, 50);
        } else {
          // Hide
          col.classList.add("filtered-out");
        }
      });

      // Recalculate layout or dispatch a fake resize event to help masonry/staggers look perfect
      window.dispatchEvent(new Event('resize'));
    });
  });
}

/* ===================================================================
   2. PORTFOLIO MOUSE MOVE TILT & GLOW EFFECTS
   =================================================================== */
function initPortfolioTiltAndHover() {
  if (window.innerWidth < 992) return; // Only apply on desktop

  const portfolioItems = document.querySelectorAll(".portfolio-item");

  portfolioItems.forEach(item => {
    const imgWrapper = item.querySelector(".portfolio-image-wrapper");

    item.addEventListener("mousemove", (e) => {
      if (!imgWrapper) return;

      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within client
      const y = e.clientY - rect.top;  // y coordinate within client

      // Set custom CSS properties for mouse follow border/glow effects
      item.style.setProperty("--mouse-x", `${x}px`);
      item.style.setProperty("--mouse-y", `${y}px`);

      // Gentle editorial perspective tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 3; // Max 3 degrees tilt
      const rotateY = ((x - centerX) / centerX) * 3;

      imgWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    item.addEventListener("mouseleave", () => {
      if (!imgWrapper) return;
      imgWrapper.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
  });
}
