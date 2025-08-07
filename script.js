// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initNavigation();
    initFEAAnimation();
    initInteractiveControls();
    initScrollAnimations();
    initContactForm();
    initModal();
});

// Initialize Modal System
function initModal() {
    // Create modal overlay if it doesn't exist
    if (!document.getElementById('modal-overlay')) {
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'modal-overlay';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <button class="modal-close" id="modal-close">&times;</button>
                </div>
                <div class="modal-body" id="modal-body">
                    <!-- Content will be inserted here -->
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        // Add event listeners
        const closeBtn = document.getElementById('modal-close');
        closeBtn.addEventListener('click', closeModal);

        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }
}

// Show Modal Function
function showModal(content) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');

    if (modalOverlay && modalBody) {
        modalBody.innerHTML = content;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Initialize any interactive elements in the modal
        setTimeout(() => {
            initModalInteractivity();
        }, 100);
    }
}

// Close Modal Function
function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize interactive elements within modals
function initModalInteractivity() {
    // FEA Demo Canvas
    const demoCanvas = document.getElementById('demoCanvas');
    if (demoCanvas) {
        const ctx = demoCanvas.getContext('2d');
        const meshSlider = document.getElementById('demo-mesh-density');
        const meshValue = document.getElementById('demo-mesh-value');

        if (meshSlider && meshValue) {
            let animationId;

            function drawDemoMesh() {
                const meshDensity = parseInt(meshSlider.value);
                ctx.clearRect(0, 0, demoCanvas.width, demoCanvas.height);

                // Draw boundary
                ctx.strokeStyle = '#2563eb';
                ctx.lineWidth = 2;
                ctx.strokeRect(10, 10, demoCanvas.width - 20, demoCanvas.height - 20);

                // Calculate mesh size based on density
                const meshSize = Math.max(15, 40 - meshDensity * 3);
                const cols = Math.floor((demoCanvas.width - 20) / meshSize);
                const rows = Math.floor((demoCanvas.height - 20) / meshSize);

                // Draw mesh
                ctx.strokeStyle = '#e5e7eb';
                ctx.lineWidth = 1;

                // Vertical lines
                for (let i = 0; i <= cols; i++) {
                    const x = 10 + i * meshSize;
                    ctx.beginPath();
                    ctx.moveTo(x, 10);
                    ctx.lineTo(x, demoCanvas.height - 10);
                    ctx.stroke();
                }

                // Horizontal lines
                for (let i = 0; i <= rows; i++) {
                    const y = 10 + i * meshSize;
                    ctx.beginPath();
                    ctx.moveTo(10, y);
                    ctx.lineTo(demoCanvas.width - 10, y);
                    ctx.stroke();
                }

                // Draw nodes
                ctx.fillStyle = '#2563eb';
                for (let i = 0; i <= cols; i++) {
                    for (let j = 0; j <= rows; j++) {
                        const x = 10 + i * meshSize;
                        const y = 10 + j * meshSize;
                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                }

                // Animate stress distribution
                const time = Date.now() * 0.001;
                ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
                for (let i = 0; i <= cols; i++) {
                    for (let j = 0; j <= rows; j++) {
                        const x = 10 + i * meshSize;
                        const y = 10 + j * meshSize;
                        const stress = Math.sin(time + i * 0.5) * Math.cos(time + j * 0.5);
                        if (stress > 0.3) {
                            ctx.beginPath();
                            ctx.arc(x, y, 3, 0, 2 * Math.PI);
                            ctx.fill();
                        }
                    }
                }

                animationId = requestAnimationFrame(drawDemoMesh);
            }

            meshSlider.addEventListener('input', (e) => {
                meshValue.textContent = e.target.value;
            });

            // Start animation
            drawDemoMesh();
        }
    }

    // Thermal Demo
    const tempSlider = document.getElementById('demo-temp-slider');
    const tempValue = document.getElementById('demo-temp-value');
    if (tempSlider && tempValue) {
        tempSlider.addEventListener('input', (e) => {
            const temp = e.target.value;
            tempValue.textContent = `${temp}°C`;

            const heatMap = document.querySelector('.heat-map');
            if (heatMap) {
                const intensity = (temp - 20) / 80;
                heatMap.style.background = `radial-gradient(circle at center, rgba(239, 68, 68, ${0.3 + intensity * 0.5}) 0%, rgba(59, 130, 246, ${0.3 + intensity * 0.3}) 50%, rgba(34, 197, 94, 0.2) 100%)`;
            }
        });
    }

    // Dynamics simulation
    if (document.getElementById('dynamics-canvas')) {
        initDynamicsSimulation();
    }
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    });
}

// FEA Animation with Canvas
function initFEAAnimation() {
    const canvas = document.getElementById('feaCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const meshDensitySlider = document.getElementById('mesh-density');
    const meshValueSpan = document.getElementById('mesh-value');

    let meshDensity = 5;
    let animationId;

    function drawFEAMesh() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw boundary
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Calculate mesh size based on density
        const meshSize = Math.max(20, 50 - meshDensity * 3);
        const cols = Math.floor((canvas.width - 20) / meshSize);
        const rows = Math.floor((canvas.height - 20) / meshSize);

        // Draw mesh
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let i = 0; i <= cols; i++) {
            const x = 10 + i * meshSize;
            ctx.beginPath();
            ctx.moveTo(x, 10);
            ctx.lineTo(x, canvas.height - 10);
            ctx.stroke();
        }

        // Horizontal lines
        for (let i = 0; i <= rows; i++) {
            const y = 10 + i * meshSize;
            ctx.beginPath();
            ctx.moveTo(10, y);
            ctx.lineTo(canvas.width - 10, y);
            ctx.stroke();
        }

        // Draw nodes
        ctx.fillStyle = '#2563eb';
        for (let i = 0; i <= cols; i++) {
            for (let j = 0; j <= rows; j++) {
                const x = 10 + i * meshSize;
                const y = 10 + j * meshSize;
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        // Animate stress distribution
        const time = Date.now() * 0.001;
        ctx.fillStyle = 'rgba(255, 107, 107, 0.6)';
        for (let i = 0; i <= cols; i++) {
            for (let j = 0; j <= rows; j++) {
                const x = 10 + i * meshSize;
                const y = 10 + j * meshSize;
                const stress = Math.sin(time + i * 0.5) * Math.cos(time + j * 0.5);
                if (stress > 0.3) {
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        }

        animationId = requestAnimationFrame(drawFEAMesh);
    }

    // Update mesh density
    if (meshDensitySlider && meshValueSpan) {
        meshDensitySlider.addEventListener('input', (e) => {
            meshDensity = parseInt(e.target.value);
            meshValueSpan.textContent = meshDensity;
        });
    }

    // Start animation
    drawFEAMesh();
}

// Interactive Controls
function initInteractiveControls() {
    // Temperature control for COMSOL
    const tempSlider = document.getElementById('temperature');
    const tempValue = document.getElementById('temp-value');

    if (tempSlider && tempValue) {
        tempSlider.addEventListener('input', (e) => {
            const temp = e.target.value;
            tempValue.textContent = `${temp}°C`;

            // Update heat distribution animation
            const heatDist = document.querySelector('.heat-distribution');
            if (heatDist) {
                const intensity = (temp - 20) / 180; // Normalize to 0-1
                heatDist.style.filter = `brightness(${1 + intensity * 0.5})`;
            }
        });
    }

    // Frequency control for dynamics
    const freqSlider = document.getElementById('frequency');
    const freqValue = document.getElementById('freq-value');

    if (freqSlider && freqValue) {
        freqSlider.addEventListener('input', (e) => {
            const freq = e.target.value;
            freqValue.textContent = `${freq} Hz`;

            // Update spring-mass animation speed
            const spring = document.querySelector('.spring');
            const mass = document.querySelector('.mass');
            if (spring && mass) {
                const duration = 2 / (freq / 5); // Normalize frequency
                spring.style.animationDuration = `${duration}s`;
                mass.style.animationDuration = `${duration}s`;
            }
        });
    }

    // Deflection control for flexure
    const defSlider = document.getElementById('deflection');
    const defValue = document.getElementById('def-value');

    if (defSlider && defValue) {
        defSlider.addEventListener('input', (e) => {
            const deflection = e.target.value;
            defValue.textContent = `${deflection} mm`;

            // Update flexure animation
            const flexureBeam = document.querySelector('.flexure-beam');
            if (flexureBeam) {
                const maxAngle = deflection * 2; // Scale deflection to angle
                flexureBeam.style.transform = `rotate(${maxAngle}deg)`;
            }
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.timeline-item, .blog-card');
    animateElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const name = form.querySelector('input[name="name"]').value;
            const email = form.querySelector('input[name="email"]').value;
            const subject = form.querySelector('input[name="subject"]').value;
            const message = form.querySelector('textarea[name="message"]').value;

            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }

            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Thank you for your message! I will get back to you soon.');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Blog Article Functions
function loadFEAArticle() {
    const articleContent = `
        <div class="article-content">
            <h2>Finite Element Analysis Fundamentals</h2>
            <p>Finite Element Analysis (FEA) is a numerical method for solving complex engineering problems. It divides a complex structure into smaller, simpler parts called finite elements.</p>
            
            <h3>Key Concepts:</h3>
            <ul>
                <li><strong>Mesh Generation:</strong> The process of dividing the geometry into finite elements</li>
                <li><strong>Element Types:</strong> Different shapes (triangles, quadrilaterals, tetrahedra, hexahedra)</li>
                <li><strong>Boundary Conditions:</strong> Applied loads and constraints</li>
                <li><strong>Material Properties:</strong> Young's modulus, Poisson's ratio, density</li>
            </ul>
            
            <h3>Applications in Mechanical Engineering:</h3>
            <ul>
                <li>Structural analysis and stress prediction</li>
                <li>Thermal analysis and heat transfer</li>
                <li>Dynamic analysis and vibration</li>
                <li>Fatigue and fracture analysis</li>
            </ul>
            
            <div class="interactive-demo">
                <h4>Interactive Mesh Density Demo</h4>
                <p>Adjust the mesh density slider to see how it affects the finite element mesh:</p>
                <div class="demo-controls">
                    <label>Mesh Density: <span id="demo-mesh-value">5</span></label>
                    <input type="range" id="demo-mesh-density" min="1" max="10" value="5">
                </div>
                <div class="demo-visualization">
                    <canvas id="demoCanvas" width="400" height="300" style="border: 1px solid #e5e7eb; margin-top: 1rem; border-radius: 8px;"></canvas>
                </div>
            </div>
        </div>
    `;

    showModal(articleContent);
}

function loadCOMSOLArticle() {
    const articleContent = `
        <div class="article-content">
            <h2>COMSOL Multiphysics Simulations</h2>
            <p>COMSOL Multiphysics is a powerful simulation software that enables engineers to solve complex multiphysics problems by coupling different physical phenomena.</p>
            
            <h3>Multiphysics Coupling:</h3>
            <ul>
                <li><strong>Thermal-Structural:</strong> Temperature changes causing structural deformation</li>
                <li><strong>Fluid-Structure:</strong> Fluid flow interacting with solid structures</li>
                <li><strong>Electromagnetic:</strong> Electric and magnetic field interactions</li>
                <li><strong>Acoustic-Structural:</strong> Sound waves and structural vibrations</li>
            </ul>
            
            <h3>Advanced Features:</h3>
            <ul>
                <li>Automatic mesh generation and refinement</li>
                <li>Parametric studies and optimization</li>
                <li>Real-time visualization and post-processing</li>
                <li>CAD integration and geometry import</li>
            </ul>
            
            <div class="interactive-demo">
                <h4>Thermal Analysis Demo</h4>
                <p>Adjust the temperature to see how it affects the heat distribution:</p>
                <div class="demo-controls">
                    <label>Temperature: <span id="demo-temp-value">50°C</span></label>
                    <input type="range" id="demo-temp-slider" min="20" max="100" value="50">
                </div>
                <div class="thermal-visualization" style="margin-top: 1rem;">
                    <div class="heat-map" style="width: 300px; height: 200px; border-radius: 8px; background: radial-gradient(circle at center, rgba(239, 68, 68, 0.5) 0%, rgba(59, 130, 246, 0.4) 50%, rgba(34, 197, 94, 0.2) 100%);"></div>
                </div>
            </div>
        </div>
    `;

    showModal(articleContent);
}

function loadDynamicsArticle() {
    const content = `
        <div class="article-content">
            <h2>Dynamics & Vibration Analysis</h2>
            <p>This interactive simulation demonstrates the fundamental principles of vibration analysis and dynamics. The mass-spring-damper system is one of the most important models in mechanical engineering.</p>
            
            <h3>System Parameters</h3>
            <ul>
                <li><strong>Mass (m):</strong> The inertial element that stores kinetic energy</li>
                <li><strong>Spring Constant (k):</strong> The stiffness that stores potential energy</li>
                <li><strong>Damping Coefficient (c):</strong> The energy dissipation mechanism</li>
                <li><strong>Forcing Frequency (ω):</strong> The frequency of the external excitation</li>
            </ul>
            
            <h3>Mathematical Model</h3>
            <div style="text-align: center; margin: 1rem 0; padding: 1rem; background: #f8fafc; border-radius: 8px; font-family: 'Courier New', monospace;">
                mẍ + cẋ + kx = F₀sin(ωt)
            </div>
            
            <h3>Key Concepts:</h3>
            <ul>
                <li><strong>Natural Frequency:</strong> ωₙ = √(k/m)</li>
                <li><strong>Damping Ratio:</strong> ζ = c/(2√(mk))</li>
                <li><strong>Resonance:</strong> Peak response when ω ≈ ωₙ</li>
            </ul>
            
            <div class="interactive-demo">
                <h4>Interactive Simulation</h4>
                <div class="demo-controls">
                    <label>Mass (kg): <input type="range" id="demo-mass" min="0.1" max="10" value="1" step="0.1"></label>
                    <span id="demo-mass-val">1.0</span>
                </div>
                <div class="demo-controls">
                    <label>Spring Constant (N/m): <input type="range" id="demo-spring" min="1" max="100" value="10" step="1"></label>
                    <span id="demo-spring-val">10</span>
                </div>
                <div class="demo-controls">
                    <label>Damping (Ns/m): <input type="range" id="demo-damping" min="0" max="20" value="1" step="0.1"></label>
                    <span id="demo-damping-val">1.0</span>
                </div>
                <div class="demo-controls">
                    <label>Frequency (rad/s): <input type="range" id="demo-freq" min="0.1" max="20" value="6.28" step="0.1"></label>
                    <span id="demo-freq-val">6.28</span>
                </div>
                
                <div style="margin-top: 2rem;">
                    <canvas id="dynamics-canvas" width="600" height="300" style="border: 1px solid #e5e7eb; border-radius: 8px; background: white;"></canvas>
                </div>
            </div>
            
            <h3>Engineering Applications</h3>
            <ul>
                <li>Vibration isolation systems for sensitive equipment</li>
                <li>Shock absorbers in automotive applications</li>
                <li>Structural dynamics analysis for buildings</li>
                <li>Control system design for precision positioning</li>
            </ul>
        </div>
    `;

    showModal(content);
}

function loadFlexureArticle() {
    const articleContent = `
        <div class="article-content">
            <h2>Precision Flexure Design</h2>
            <p>Flexure mechanisms are compliant mechanisms that provide motion through elastic deformation, offering high precision and repeatability without friction or backlash.</p>
            
            <h3>Design Principles:</h3>
            <ul>
                <li><strong>Compliance:</strong> Controlled flexibility in desired directions</li>
                <li><strong>Stiffness:</strong> Resistance to unwanted deformations</li>
                <li><strong>Stress Concentration:</strong> Managing high stress areas</li>
                <li><strong>Kinematic Design:</strong> Constraining degrees of freedom</li>
            </ul>
            
            <h3>Applications:</h3>
            <ul>
                <li>Precision positioning stages in semiconductor manufacturing</li>
                <li>Micro-manipulation systems</li>
                <li>Optical alignment mechanisms</li>
                <li>Vibration isolation systems</li>
            </ul>
            
            <h3>Key Design Considerations:</h3>
            <ul>
                <li>Material selection (often steel or titanium for high-performance applications)</li>
                <li>Stress analysis to prevent fatigue failure</li>
                <li>Stiffness optimization for desired motion characteristics</li>
                <li>Manufacturing tolerances and surface finish requirements</li>
            </ul>
            
            <div class="interactive-demo">
                <h4>Flexure Design Examples</h4>
                <p>Common flexure types used in precision engineering:</p>
                <ul>
                    <li><strong>Leaf Springs:</strong> Simple bending elements</li>
                    <li><strong>Cross Flexures:</strong> Two perpendicular elements</li>
                    <li><strong>Cartwheel Flexures:</strong> Radial spoke design</li>
                    <li><strong>Blade Flexures:</strong> Thin, flexible elements</li>
                </ul>
            </div>
        </div>
    `;

    showModal(articleContent);
}

// Dynamics Simulation (simplified for modal)
function initDynamicsSimulation() {
    const canvas = document.getElementById('dynamics-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let t = 0;
    let animationId;

    // System parameters
    let m = 1, k = 10, c = 1, w_force = 6.28;

    // Get controls
    const massSlider = document.getElementById('demo-mass');
    const springSlider = document.getElementById('demo-spring');
    const dampingSlider = document.getElementById('demo-damping');
    const freqSlider = document.getElementById('demo-freq');

    const massVal = document.getElementById('demo-mass-val');
    const springVal = document.getElementById('demo-spring-val');
    const dampingVal = document.getElementById('demo-damping-val');
    const freqVal = document.getElementById('demo-freq-val');

    function updateValues() {
        if (massVal) massVal.textContent = m.toFixed(1);
        if (springVal) springVal.textContent = k.toFixed(0);
        if (dampingVal) dampingVal.textContent = c.toFixed(1);
        if (freqVal) freqVal.textContent = w_force.toFixed(2);
    }

    // Add event listeners
    if (massSlider) {
        massSlider.addEventListener('input', (e) => {
            m = parseFloat(e.target.value);
            updateValues();
        });
    }

    if (springSlider) {
        springSlider.addEventListener('input', (e) => {
            k = parseFloat(e.target.value);
            updateValues();
        });
    }

    if (dampingSlider) {
        dampingSlider.addEventListener('input', (e) => {
            c = parseFloat(e.target.value);
            updateValues();
        });
    }

    if (freqSlider) {
        freqSlider.addEventListener('input', (e) => {
            w_force = parseFloat(e.target.value);
            updateValues();
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate natural frequency and response
        const w_n = Math.sqrt(k / m);
        const zeta = c / (2 * Math.sqrt(k * m));

        // Simple harmonic motion simulation
        const x = 50 * Math.cos(w_force * t * 0.1);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Draw spring
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(100, centerY);
        ctx.lineTo(centerX + x - 30, centerY);
        ctx.stroke();

        // Draw mass
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(centerX + x - 30, centerY - 20, 60, 40);

        // Draw ground
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, centerY);
        ctx.lineTo(120, centerY);
        ctx.stroke();

        // Draw position trace
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 200; i++) {
            const t_trace = t - i * 0.1;
            const x_trace = 50 * Math.cos(w_force * t_trace * 0.1);
            const y_trace = canvas.height - 50 - i;
            if (y_trace > 50) {
                if (i === 0) {
                    ctx.moveTo(centerX + x_trace, y_trace);
                } else {
                    ctx.lineTo(centerX + x_trace, y_trace);
                }
            }
        }
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#374151';
        ctx.font = '14px Inter';
        ctx.fillText(`Natural Freq: ${w_n.toFixed(2)} rad/s`, 10, 30);
        ctx.fillText(`Damping Ratio: ${zeta.toFixed(3)}`, 10, 50);

        t += 0.1;
        animationId = requestAnimationFrame(animate);
    }

    updateValues();
    animate();
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
const optimizedScrollHandler = debounce(() => {
    // Scroll-based animations and effects
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);