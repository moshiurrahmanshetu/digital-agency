document.addEventListener("DOMContentLoaded", () => {
  initHeroParallax();
  initTimelineProgress();
  initLightbox();
  initResultsCounter();
});

/* ===================================================================
   1. HERO MOUSE PARALLAX & HOVER TILT
   =================================================================== */
function initHeroParallax() {
  const heroSec = document.getElementById("project-hero");
  if (!heroSec || window.innerWidth < 992) return;

  const mesh = heroSec.querySelector(".project-hero-mesh");
  const floatingCards = heroSec.querySelectorAll(".hero-glass-floating");
  const imageWrap = heroSec.querySelector(".project-hero-image-wrap");

  heroSec.addEventListener("mousemove", (e) => {
    const rect = heroSec.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    // Move mesh background in opposite direction (deeper feel)
    if (mesh) {
      mesh.style.transform = `translate(${percentX * -30}px, ${percentY * -30}px) scale(1.05)`;
    }

    // Move floating cards in direct direction (foreground feel)
    floatingCards.forEach((card, idx) => {
      const factor = (idx + 1) * 20; // different speed for layers
      card.style.transform = `translate(${percentX * factor}px, ${percentY * factor}px)`;
    });

    // Gentle image tilt
    if (imageWrap) {
      const rotateX = percentY * -4; // Max 4 degrees
      const rotateY = percentX * 4;
      imageWrap.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  });

  heroSec.addEventListener("mouseleave", () => {
    if (mesh) {
      mesh.style.transform = "translate(0, 0) scale(1)";
    }
    floatingCards.forEach(card => {
      card.style.transform = "translate(0, 0)";
    });
    if (imageWrap) {
      imageWrap.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
  });
}

/* ===================================================================
   2. CREATIVE PROCESS TIMELINE
   =================================================================== */
function initTimelineProgress() {
  const timelineSection = document.querySelector(".creative-process-section");
  const timelineProgress = document.querySelector(".process-timeline-progress");
  const timelineNodes = document.querySelectorAll(".process-timeline-node");

  if (!timelineSection || !timelineProgress || !timelineNodes.length) return;

  function updateTimeline() {
    const rect = timelineSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate how far we've scrolled inside the timeline section
    // Start measuring when the top of the section enters the viewport center
    // End when the bottom of the section leaves the viewport center
    const sectionStart = rect.top - viewportHeight / 2;
    const sectionLength = rect.height;

    let progress = 0;
    if (sectionStart < 0) {
      progress = Math.abs(sectionStart) / (sectionLength - viewportHeight / 3);
      progress = Math.min(Math.max(progress, 0), 1);
    }

    timelineProgress.style.height = `${progress * 100}%`;

    // Active nodes based on viewport intersection
    timelineNodes.forEach(node => {
      const nodeRect = node.getBoundingClientRect();
      // If the node reaches 60% of viewport height, activate it
      if (nodeRect.top < viewportHeight * 0.6) {
        node.classList.add("active");
      } else {
        node.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", updateTimeline);
  updateTimeline(); // Initial run
}

/* ===================================================================
   3. INTERACTIVE MASONRY GALLERY & LIGHTBOX
   =================================================================== */
function initLightbox() {
  const galleryItems = document.querySelectorAll(".gallery-grid-item");
  const lightbox = document.getElementById("lightbox-gallery");
  
  if (!galleryItems.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const lightboxTitle = lightbox.querySelector(".lightbox-caption-title");
  const lightboxCategory = lightbox.querySelector(".lightbox-caption-category");
  const closeBtn = lightbox.querySelector(".lightbox-close-btn");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");

  let currentIndex = 0;
  const galleryData = Array.from(galleryItems).map(item => ({
    src: item.getAttribute("data-img-src"),
    title: item.getAttribute("data-img-title"),
    category: item.getAttribute("data-img-category")
  }));

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden"; // Stop scrolling
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = ""; // Enable scrolling
    // Reset zoom
    if (lightboxImg) lightboxImg.style.transform = "scale(1)";
  }

  function updateLightboxContent() {
    const data = galleryData[currentIndex];
    if (!data || !lightboxImg) return;

    // Smooth transition
    lightboxImg.style.opacity = "0";
    lightboxImg.style.transform = "scale(0.95)";

    setTimeout(() => {
      lightboxImg.src = data.src;
      lightboxImg.alt = data.title;
      if (lightboxTitle) lightboxTitle.textContent = data.title;
      if (lightboxCategory) lightboxCategory.textContent = data.category;
      
      lightboxImg.style.opacity = "1";
      lightboxImg.style.transform = "scale(1)";
    }, 200);
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  // Hook up gallery clicks
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  // Buttons click events
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (nextBtn) nextBtn.addEventListener("click", nextImage);
  if (prevBtn) prevBtn.addEventListener("click", prevImage);

  // Close when clicking overlay (but not the image/buttons)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-stage")) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowRight") {
      nextImage();
    } else if (e.key === "ArrowLeft") {
      prevImage();
    }
  });

  // Optional image zoom on click
  if (lightboxImg) {
    let isZoomed = false;
    lightboxImg.addEventListener("click", (e) => {
      e.stopPropagation();
      isZoomed = !isZoomed;
      lightboxImg.style.transform = isZoomed ? "scale(1.35)" : "scale(1)";
      lightboxImg.style.cursor = isZoomed ? "zoom-out" : "zoom-in";
    });
  }
}

/* ===================================================================
   4. STATS RESULTS COUNTER
   =================================================================== */
function initResultsCounter() {
  const counterElements = document.querySelectorAll(".result-counter-num");
  if (!counterElements.length) return;

  const countOptions = {
    threshold: 0.5,
    rootMargin: "0px"
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endVal = parseFloat(target.getAttribute("data-target"));
        const suffix = target.getAttribute("data-suffix") || "";
        const isFloat = target.getAttribute("data-is-float") === "true";
        
        animateValue(target, 0, endVal, 1500, suffix, isFloat);
        observer.unobserve(target); // Only animate once
      }
    });
  }, countOptions);

  counterElements.forEach(el => {
    counterObserver.observe(el);
  });

  function animateValue(obj, start, end, duration, suffix, isFloat) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      let currentVal = progress * (end - start) + start;
      if (isFloat) {
        obj.textContent = currentVal.toFixed(1) + suffix;
      } else {
        obj.textContent = Math.floor(currentVal) + suffix;
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        if (isFloat) {
          obj.textContent = end.toFixed(1) + suffix;
        } else {
          obj.textContent = end + suffix;
        }
      }
    };
    window.requestAnimationFrame(step);
  }
}
