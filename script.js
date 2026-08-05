/* ==========================================================================
   PORTFOLIO CENTRAL CONFIGURATION (Edit your stats and keys here!)
   ========================================================================== */
const PORTFOLIO_CONFIG = {
  // EmailJS Credentials
  emailjs: {
    publicKey: "JI5FKPxQdRwVQjMOZ",
    serviceId: "service_u26vpdk",
    templateId: "template_rhqmgbp"
  },

  // DSA Platforms Stats (Customize your details here!)
  dsa: {
    totalSolved: 500,             // Your total solved question count (animates)
    submissionsPastYear: "1,004",  // Submissions count string (e.g. "1,004")
    activeDays: 239,              // Total active days count (animates)
    maxStreak: 86,                // Max streak count (animates)
    filterYear: "Current"         // Year text showing on select dropdown
  }
};

(function() {
  // Initialize EmailJS with Public Key from configuration
  emailjs.init(PORTFOLIO_CONFIG.emailjs.publicKey);
})();

document.addEventListener("DOMContentLoaded", () => {
  
  /* ==========================================================================
     PAGE LOADER
     ========================================================================== */
  const loader = document.querySelector(".loader-wrapper");
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.visibility = "hidden";
    }, 400); // Small delay for visual fluidness
  });

  /* ==========================================================================
     MOBILE NAVIGATION
     ========================================================================== */
  const menuBtn = document.getElementById("menu-btn");
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open");
    navbar.classList.toggle("open");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("open");
      navbar.classList.remove("open");
    });
  });

  /* ==========================================================================
     CUSTOM CELESTIAL CURSOR & STAR DUST TRAIL
     ========================================================================== */
  const cursor = document.querySelector(".custom-cursor");
  const cursorDot = document.querySelector(".custom-cursor-dot");
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let lastDustTime = 0;
  
  // Track mouse coordinates
  // Track mouse coordinates to move rocket directly
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
  });

  // Attach hover state triggers
  const hoverElements = document.querySelectorAll("a, button, .project-card, .dsa-card, .form-input, .menu-btn, .cert-item");
  
  hoverElements.forEach(elem => {
    elem.addEventListener("mouseenter", () => {
      cursor.classList.add("hovered");
      cursorDot.classList.add("hovered");
    });
    elem.addEventListener("mouseleave", () => {
      cursor.classList.remove("hovered");
      cursorDot.classList.remove("hovered");
    });
  });

  /* ==========================================================================
     SPACE STARFIELD & NEBULA CANVAS
     ========================================================================== */
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  
  let starsArray = [];
  let shootingStars = [];
  const starCount = 140; // Number of background stars
  let nebulaTime = 0;
  
  // Resize Canvas
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Setup Stars
  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3; // Varying sizes
      this.alpha = Math.random() * 0.7 + 0.2; // Base transparency
      this.alphaPhase = Math.random() * Math.PI; // Sin wave offset
      this.twinkleSpeed = Math.random() * 0.02 + 0.005; // Twinkle speed
      this.color = this.getRandomColor();
      this.parallaxFactor = Math.random() * 0.02 + 0.005; // Depth multiplier
    }
    
    getRandomColor() {
      const colors = [
        "rgba(255, 255, 255, ", // Pure white
        "rgba(224, 242, 254, ", // Cyan blue tint
        "rgba(251, 243, 219, ", // Muted gold tint
        "rgba(243, 232, 255, "  // Soft violet tint
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
      // Modulate transparency for realistic twinkling
      this.alphaPhase += this.twinkleSpeed;
      this.alpha = (Math.sin(this.alphaPhase) * 0.45) + 0.55;
    }
    
    draw(offsetX, offsetY) {
      // Parallax shifts coordinates based on mouse position
      const shiftedX = this.x + (offsetX * this.parallaxFactor);
      const shiftedY = this.y + (offsetY * this.parallaxFactor);
      
      ctx.fillStyle = this.color + this.alpha + ")";
      ctx.beginPath();
      ctx.arc(shiftedX, shiftedY, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Setup Shooting Star structure
  class ShootingStar {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * (canvas.height * 0.5);
      this.length = Math.random() * 80 + 40;
      this.speed = Math.random() * 12 + 6;
      this.angle = Math.PI / 6 + (Math.random() * 0.1); // Diagonally down-right
      this.opacity = 1;
      this.decay = Math.random() * 0.025 + 0.015;
    }
    
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= this.decay;
      
      if (this.opacity <= 0) {
        this.reset();
      }
    }
    
    draw() {
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - Math.cos(this.angle) * this.length,
        this.y - Math.sin(this.angle) * this.length
      );
      ctx.stroke();
    }
  }

  // Populate Stars Array
  const initSpace = () => {
    starsArray = [];
    for (let i = 0; i < starCount; i++) {
      starsArray.push(new Star());
    }
    // 2 active shooting stars max
    shootingStars = [new ShootingStar(), new ShootingStar()];
  };
  initSpace();

  // Draw Space Nebula effects in background
  const drawNebulae = () => {
    nebulaTime += 0.001;
    
    // Pulse nebula coordinates slowly
    const neb1X = canvas.width * 0.7 + Math.sin(nebulaTime) * 100;
    const neb1Y = canvas.height * 0.3 + Math.cos(nebulaTime) * 100;
    
    const neb2X = canvas.width * 0.2 + Math.cos(nebulaTime * 0.8) * 120;
    const neb2Y = canvas.height * 0.7 + Math.sin(nebulaTime * 0.8) * 120;
    
    // Nebula 1 (Indigo/Blue)
    const radGrd1 = ctx.createRadialGradient(neb1X, neb1Y, 10, neb1X, neb1Y, Math.max(canvas.width, canvas.height) * 0.4);
    radGrd1.addColorStop(0, "rgba(37, 99, 235, 0.04)");
    radGrd1.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radGrd1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Nebula 2 (Purple)
    const radGrd2 = ctx.createRadialGradient(neb2X, neb2Y, 10, neb2X, neb2Y, Math.max(canvas.width, canvas.height) * 0.4);
    radGrd2.addColorStop(0, "rgba(147, 51, 234, 0.03)");
    radGrd2.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radGrd2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Loop Execution
  const animateSpace = () => {
    ctx.fillStyle = "#07080a"; // Solid background base
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render deep nebulae first
    drawNebulae();
    
    // Mouse Parallax Offsets
    // Subtract offsets to make background move in opposite direction
    const parallaxOffsetX = -mouseX + (canvas.width / 2);
    const parallaxOffsetY = -mouseY + (canvas.height / 2);
    
    // Draw twinkling stars
    starsArray.forEach(star => {
      star.update();
      star.draw(parallaxOffsetX, parallaxOffsetY);
    });
    
    // Random shooting star trigger
    if (Math.random() < 0.001) {
      shootingStars.forEach(s => {
        if (s.opacity <= 0) s.reset();
      });
    }
    
    shootingStars.forEach(s => {
      s.update();
      s.draw();
    });
    
    requestAnimationFrame(animateSpace);
  };
  animateSpace();

  /* ==========================================================================
     SCROLL SPY & HEADER SCROLL STATE
     ========================================================================== */
  const header = document.querySelector(".header");
  const sections = document.querySelectorAll(".section");

  window.addEventListener("scroll", () => {
    // Header shadow shrink state
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Scroll Spy active logic
    let currentSectionId = "";
    sections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.clientHeight;
      if (window.scrollY >= (secTop - 250)) {
        currentSectionId = sec.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  });

  /* ==========================================================================
     INTERSECTION OBSERVER FOR FADE-REVEAL
     ========================================================================== */
  const revealElements = document.querySelectorAll(".section");
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active-show");
      }
    });
  }, {
    threshold: 0.15 // Triggers when 15% is visible
  });

  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });



  /* ==========================================================================
     DSA BENTO HEATMAP & COUNTER ANIMATION
     ========================================================================== */
  const dsaSection = document.getElementById("dsa");
  const problemsCounter = document.getElementById("problems-count-anim");
  const heatmapGrid = document.getElementById("heatmap-grid");
  let hasAnimatedDSA = false;

  // 1. Generate Heatmap Grid (loads instantly with realistic static patterns)
  const buildHeatmap = () => {
    if (!heatmapGrid) return;
    heatmapGrid.innerHTML = "";
    
    const monthNames = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
    const monthsToShow = [];
    const today = new Date();
    
    // Calculate 12 months ending in current month
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthsToShow.push({
        name: monthNames[d.getMonth()],
        monthIndex: d.getMonth(),
        year: d.getFullYear()
      });
    }
    
    monthsToShow.forEach(m => {
      const monthBlock = document.createElement("div");
      monthBlock.className = "month-block";
      
      const monthGrid = document.createElement("div");
      monthGrid.className = "month-grid";
      
      // Draw 28 cells representing 4 weeks of the month
      for (let dayIndex = 0; dayIndex < 28; dayIndex++) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        
        // Random level distribution weights matching LeetCode user histories:
        // level-0 (no activity): 45%
        // level-1 (low activity): 25%
        // level-2 (med-low): 15%
        // level-3 (med-high): 10%
        // level-4 (high active): 5%
        const rand = Math.random() * 100;
        if (rand < 45) {
          cell.classList.add("level-0");
        } else if (rand < 70) {
          cell.classList.add("level-1");
        } else if (rand < 85) {
          cell.classList.add("level-2");
        } else if (rand < 95) {
          cell.classList.add("level-3");
        } else {
          cell.classList.add("level-4");
        }
        
        monthGrid.appendChild(cell);
      }
      
      const label = document.createElement("span");
      label.className = "month-label";
      label.textContent = m.name;
      
      monthBlock.appendChild(monthGrid);
      monthBlock.appendChild(label);
      heatmapGrid.appendChild(monthBlock);
    });
  };

  // 2. Animate total problems counter and other statistics directly from configuration
  const animateDSACounter = () => {
    const fallback = PORTFOLIO_CONFIG.dsa;
    
    // Set Year Filter option
    const filterOption = document.getElementById("heatmap-select-option");
    if (filterOption) {
      filterOption.textContent = fallback.filterYear;
    }

    // Total Solved Count
    if (problemsCounter) {
      const solved = fallback.totalSolved;
      let currentSolved = 0;
      const solvedTimer = setInterval(() => {
        currentSolved += Math.ceil(solved / 50);
        if (currentSolved >= solved) {
          problemsCounter.textContent = solved + "+";
          clearInterval(solvedTimer);
        } else {
          problemsCounter.textContent = currentSolved + "+";
        }
      }, 20);
    }

    // Submissions Count
    const submissionsEl = document.getElementById("submissions-count-anim");
    if (submissionsEl) {
      const submissions = parseInt(fallback.submissionsPastYear.replace(/,/g, '')) || 0;
      let currentSubmissions = 0;
      const subTimer = setInterval(() => {
        currentSubmissions += Math.ceil(submissions / 50);
        if (currentSubmissions >= submissions) {
          submissionsEl.textContent = submissions.toLocaleString();
          clearInterval(subTimer);
        } else {
          submissionsEl.textContent = currentSubmissions.toLocaleString();
        }
      }, 20);
    }

    // Active Days Count
    const activeDaysEl = document.getElementById("active-days-anim");
    if (activeDaysEl) {
      const active = fallback.activeDays;
      let currentActive = 0;
      const activeTimer = setInterval(() => {
        currentActive += Math.ceil(active / 50);
        if (currentActive >= active) {
          activeDaysEl.textContent = active;
          clearInterval(activeTimer);
        } else {
          activeDaysEl.textContent = currentActive;
        }
      }, 20);
    }

    // Max Streak Count
    const maxStreakEl = document.getElementById("max-streak-anim");
    if (maxStreakEl) {
      const streak = fallback.maxStreak;
      let currentStreak = 0;
      const streakTimer = setInterval(() => {
        currentStreak += Math.ceil(streak / 50);
        if (currentStreak >= streak) {
          maxStreakEl.textContent = streak;
          clearInterval(streakTimer);
        } else {
          maxStreakEl.textContent = currentStreak;
        }
      }, 20);
    }
  };

  // Trigger loading process when section comes into viewport
  const dsaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimatedDSA) {
        buildHeatmap();
        animateDSACounter();
        hasAnimatedDSA = true;
      }
    });
  }, {
    threshold: 0.15
  });

  if (dsaSection) {
    dsaObserver.observe(dsaSection);
  }

  /* ==========================================================================
     EMAILJS CONTACT FORM HANDLER
     ========================================================================== */
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const formToast = document.getElementById("form-toast");
  const toastIcon = document.getElementById("toast-icon");
  const toastTitle = document.getElementById("toast-title");
  const toastMsg = document.getElementById("toast-msg");

  const showToast = (title, message, isError = false) => {
    toastTitle.textContent = title;
    toastMsg.textContent = message;
    
    if (isError) {
      toastIcon.className = "fa-solid fa-circle-xmark";
      toastIcon.classList.add("error");
    } else {
      toastIcon.className = "fa-solid fa-circle-check";
      toastIcon.classList.remove("error");
    }
    
    formToast.classList.add("show");
    
    setTimeout(() => {
      formToast.classList.remove("show");
    }, 4500); // Show toast for 4.5 seconds
  };

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Change button visual status
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
      
      // Make sure user updated service key. If still placeholder, prompt instructions:
      const userPublicKey = PORTFOLIO_CONFIG.emailjs.publicKey;
      if (userPublicKey === "YOUR_PUBLIC_KEY_HERE" || !userPublicKey) {
        // Fallback simulate send to showcase visual response
        setTimeout(() => {
          showToast(
            "Demo Mode", 
            "Message simulated successfully! Add EmailJS credentials in the PORTFOLIO_CONFIG object in script.js to connect live."
          );
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          contactForm.reset();
        }, 1500);
        return;
      }

      // Live Send Form logic using EmailJS SDK from dynamic config parameters
      emailjs.sendForm(PORTFOLIO_CONFIG.emailjs.serviceId, PORTFOLIO_CONFIG.emailjs.templateId, contactForm)
        .then(() => {
          showToast("Message Sent", "Thank you, I will get back to you shortly.");
          contactForm.reset();
        })
        .catch((error) => {
          console.error("EmailJS Error details:", error);
          showToast("Submission Failed", "There was an issue sending your message. Please try again.", true);
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        });
    });
  }

  /* ==========================================================================
     PROJECTS EXPANDABLE TOGGLE HANDLER
     ========================================================================== */
  const projectsList = document.querySelector(".projects-list");
  const toggleBtn = document.getElementById("projects-toggle-btn");
  const toggleText = document.getElementById("projects-toggle-text");
  const toggleIcon = document.getElementById("projects-toggle-icon");

  if (toggleBtn && projectsList) {
    toggleBtn.addEventListener("click", () => {
      const isExpanded = projectsList.classList.contains("show-all");
      
      if (isExpanded) {
        // Collapse projects
        projectsList.classList.remove("show-all");
        toggleText.textContent = "View More Projects";
        toggleIcon.style.transform = "rotate(0deg)";
        
        // Scroll back to the top of the projects section smoothly
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Expand and show all projects
        projectsList.classList.add("show-all");
        toggleText.textContent = "View Less";
        toggleIcon.style.transform = "rotate(180deg)";
      }
    });
  }

  /* ==========================================================================
     SKILLS EXPANDABLE TOGGLE HANDLER
     ========================================================================== */
  const skillsGrid = document.querySelector(".skills-grid");
  const skillsToggleBtn = document.getElementById("skills-toggle-btn");
  const skillsToggleText = document.getElementById("skills-toggle-text");
  const skillsToggleIcon = document.getElementById("skills-toggle-icon");

  if (skillsToggleBtn && skillsGrid) {
    skillsToggleBtn.addEventListener("click", () => {
      const isExpanded = skillsGrid.classList.contains("show-all");
      
      if (isExpanded) {
        // Collapse skills
        skillsGrid.classList.remove("show-all");
        skillsToggleText.textContent = "View More Skills";
        skillsToggleIcon.style.transform = "rotate(0deg)";
        
        // Scroll back to the top of the skills section smoothly
        const skillsSection = document.getElementById("about");
        if (skillsSection) {
          skillsSection.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Expand and show all skills
        skillsGrid.classList.add("show-all");
        skillsToggleText.textContent = "View Less";
        skillsToggleIcon.style.transform = "rotate(180deg)";
      }
    });
  }

  /* ==========================================================================
     CERTIFICATIONS EXPANDABLE TOGGLE HANDLER
     ========================================================================== */
  const certsList = document.querySelector(".certifications-list");
  const certsToggleBtn = document.getElementById("certs-toggle-btn");
  const certsToggleText = document.getElementById("certs-toggle-text");
  const certsToggleIcon = document.getElementById("certs-toggle-icon");

  if (certsToggleBtn && certsList) {
    certsToggleBtn.addEventListener("click", () => {
      const isExpanded = certsList.classList.contains("show-all");
      
      if (isExpanded) {
        // Collapse certs
        certsList.classList.remove("show-all");
        certsToggleText.textContent = "View More Certifications";
        certsToggleIcon.style.transform = "rotate(0deg)";
        
        // Scroll back to the top of the certifications section smoothly
        const certsSection = document.getElementById("certifications");
        if (certsSection) {
          certsSection.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Expand and show all certs
        certsList.classList.add("show-all");
        certsToggleText.textContent = "View Less";
        certsToggleIcon.style.transform = "rotate(180deg)";
      }
    });
  }

});
