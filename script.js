// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initFEAAnimation();
    initInteractiveControls();
    initScrollAnimations();
    initContactForm();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
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
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
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
    meshDensitySlider.addEventListener('input', (e) => {
        meshDensity = parseInt(e.target.value);
        meshValueSpan.textContent = meshDensity;
    });

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
                const intensity = (temp - 20) / 80; // Normalize to 0-1
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

    // Stiffness control for flexure
    const stiffnessSlider = document.getElementById('flexure-stiffness');
    const stiffnessValue = document.getElementById('stiffness-value');
    
    if (stiffnessSlider && stiffnessValue) {
        stiffnessSlider.addEventListener('input', (e) => {
            const stiffness = e.target.value;
            stiffnessValue.textContent = stiffness;
            
            // Update flexure animation
            const flexureArm = document.querySelector('.flexure-arm');
            if (flexureArm) {
                const maxAngle = 30 - (stiffness - 1) * 2; // Higher stiffness = less deflection
                flexureArm.style.setProperty('--max-angle', `${maxAngle}deg`);
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
    const animateElements = document.querySelectorAll('.experience-card, .blog-card, .profile-card');
    animateElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// Contact Form
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const message = form.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
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
        <div class="article-modal">
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
                        <canvas id="demoCanvas" width="400" height="300"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(articleContent);
}

function loadCOMSOLArticle() {
    const articleContent = `
        <div class="article-modal">
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
                    <div class="thermal-visualization">
                        <div class="heat-map"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(articleContent);
}

function loadDynamicsArticle() {
    const content = `
        <div class="article-content">
            <h2>Mass-Spring-Damper System Analysis</h2>
            <p>This interactive simulation demonstrates the fundamental principles of vibration analysis and dynamics. The mass-spring-damper system is one of the most important models in mechanical engineering, used to understand vibration, resonance, and dynamic response.</p>
            
            <h3>System Parameters</h3>
            <ul>
                <li><strong>Mass (m):</strong> The inertial element that stores kinetic energy</li>
                <li><strong>Spring Constant (k):</strong> The stiffness that stores potential energy</li>
                <li><strong>Damping Coefficient (c):</strong> The energy dissipation mechanism</li>
                <li><strong>Force Amplitude (F₀):</strong> The magnitude of the external forcing</li>
                <li><strong>Forcing Frequency (ω):</strong> The frequency of the external excitation</li>
            </ul>
            
            <h3>Mathematical Model</h3>
            <div style="text-align: center; margin: 1rem 0; padding: 1rem; background: #f8fafc; border-radius: 8px; font-family: 'Courier New', monospace;">
                mẍ + cẋ + kx = F₀sin(ωt)
            </div>
            
            <h3>Frequency Response</h3>
            <div style="text-align: center; margin: 1rem 0; padding: 1rem; background: #f8fafc; border-radius: 8px; font-family: 'Courier New', monospace;">
                H(ω) = 1 / (-mω² + jcω + k)
            </div>
            <p>This creates a frequency response with:</p>
            <ul>
                <li><strong>Natural Frequency:</strong> ωₙ = √(k/m)</li>
                <li><strong>Damping Ratio:</strong> ζ = c/(2√(mk))</li>
                <li><strong>Resonance:</strong> Peak response when ω ≈ ωₙ</li>
            </ul>
            
            <h3>Interactive Simulation</h3>
            <p>Use the sliders below to explore how different parameters affect the system response:</p>
            
            <div class="interactive-demo">
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
                    <label>Force Amplitude (N): <input type="range" id="demo-force" min="0" max="10" value="1" step="0.1"></label>
                    <span id="demo-force-val">1.0</span>
                </div>
                <div class="demo-controls">
                    <label>Frequency (rad/s): <input type="range" id="demo-freq" min="0.1" max="20" value="6.28" step="0.1"></label>
                    <span id="demo-freq-val">6.28</span>
                </div>
                
                <div style="margin-top: 2rem;">
                    <canvas id="dynamics-canvas" width="800" height="400" style="border: 1px solid #e5e7eb; border-radius: 8px; background: white;"></canvas>
                </div>
                
                <div style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <h4>Time Domain Response</h4>
                        <canvas id="time-canvas" width="350" height="200" style="border: 1px solid #e5e7eb; border-radius: 4px; background: white;"></canvas>
                    </div>
                    <div>
                        <h4>Frequency Response</h4>
                        <canvas id="freq-canvas" width="350" height="200" style="border: 1px solid #e5e7eb; border-radius: 4px; background: white;"></canvas>
                    </div>
                </div>
            </div>
            
            <h3>Key Observations</h3>
            <ul>
                <li>When damping is low, the system shows strong resonance near the natural frequency</li>
                <li>Higher mass reduces the natural frequency and makes the system more sluggish</li>
                <li>Stiffer springs increase natural frequency and reduce displacement</li>
                <li>Damping reduces peak response and broadens the frequency response</li>
            </ul>
            
            <h3>Engineering Applications</h3>
            <ul>
                <li>Vibration isolation systems for sensitive equipment</li>
                <li>Shock absorbers in automotive and aerospace applications</li>
                <li>Structural dynamics analysis for buildings and bridges</li>
                <li>Control system design for precision positioning</li>
            </ul>
        </div>
    `;
    
    showModal(content);
    
    // Initialize the interactive simulation after modal is shown
    setTimeout(() => {
        initDynamicsSimulation();
    }, 100);
}

function loadFlexureArticle() {
    const articleContent = `
        <div class="article-modal">
            <div class="article-content">
                <h2>Precision Flexure Design</h2>
                <p>Flexure mechanisms are compliant mechanisms that provide motion through elastic deformation, offering high precision and repeatability without friction or backlash.</p>
                
                <h3>Design Principles:</h3>
                <ul>
                    <li><strong>Compliance:</strong> Controlled flexibility in desired directions</li>
                    <li><strong>Stiffness:</strong> Resistance to unwanted deformations</li>
                    <li><strong>Stress Concentration:</strong> Managing high stress areas at fillets</li>
                    <li><strong>Kinematic Design:</strong> Constraining degrees of freedom</li>
                </ul>
                
                <h3>Applications:</h3>
                <ul>
                    <li>Precision positioning stages</li>
                    <li>Micro-manipulation systems</li>
                    <li>Optical alignment mechanisms</li>
                    <li>Vibration isolation systems</li>
                </ul>
                
                <div class="interactive-demo">
                    <h4>Flexure Stiffness Demo</h4>
                    <p>Adjust the stiffness to see how it affects the flexure deflection:</p>
                    <div class="demo-controls">
                        <label>Stiffness: <span id="demo-stiffness-value">5</span></label>
                        <input type="range" id="demo-stiffness-slider" min="1" max="10" value="5">
                    </div>
                    <div class="flexure-visualization">
                        <div class="flexure-demo">
                            <div class="demo-flexure-arm"></div>
                            <div class="demo-flexure-joint"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(articleContent);
}

// Modal functionality
function showModal(content) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal {
            background: white;
            border-radius: 16px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: slideIn 0.3s ease;
        }
        
        .modal-header {
            padding: 1rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #6b7280;
        }
        
        .modal-close:hover {
            color: #374151;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .article-content h2 {
            color: #1f2937;
            margin-bottom: 1rem;
        }
        
        .article-content h3 {
            color: #374151;
            margin: 1.5rem 0 0.5rem;
        }
        
        .article-content p {
            color: #6b7280;
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        
        .article-content ul {
            margin: 1rem 0;
            padding-left: 1.5rem;
        }
        
        .article-content li {
            margin-bottom: 0.5rem;
            color: #4b5563;
        }
        
        .interactive-demo {
            margin-top: 2rem;
            padding: 1.5rem;
            background: #f8fafc;
            border-radius: 8px;
        }
        
        .demo-controls {
            margin: 1rem 0;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .demo-controls label {
            font-weight: 600;
            color: #374151;
        }
        
        .demo-controls input[type="range"] {
            flex: 1;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
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

// Mass-Spring-Damper System Simulation
function initMassSpringSimulation() {
    // Get slider elements
    const massSlider = document.getElementById('mass-slider');
    const springSlider = document.getElementById('spring-slider');
    const dampingSlider = document.getElementById('damping-slider');
    const forceSlider = document.getElementById('force-slider');
    const freqSlider = document.getElementById('freq-slider');
    
    // Get value display elements
    const massValue = document.getElementById('mass-value');
    const springValue = document.getElementById('spring-value');
    const dampingValue = document.getElementById('damping-value');
    const forceValue = document.getElementById('force-value');
    const freqValue = document.getElementById('freq-value');

    // System parameters
    let m = 1, k = 10, c = 1, F0 = 1, w_force = 6.28;
    let t = 0;
    let animationId;

    // Update slider values
    function updateSliderValues() {
        if (massValue) massValue.textContent = m.toFixed(1);
        if (springValue) springValue.textContent = k.toFixed(0);
        if (dampingValue) dampingValue.textContent = c.toFixed(1);
        if (forceValue) forceValue.textContent = F0.toFixed(1);
        if (freqValue) freqValue.textContent = w_force.toFixed(2);
    }

    // Add event listeners to sliders
    if (massSlider) {
        massSlider.addEventListener('input', (e) => {
            m = parseFloat(e.target.value);
            updateSliderValues();
        });
    }

    if (springSlider) {
        springSlider.addEventListener('input', (e) => {
            k = parseFloat(e.target.value);
            updateSliderValues();
        });
    }

    if (dampingSlider) {
        dampingSlider.addEventListener('input', (e) => {
            c = parseFloat(e.target.value);
            updateSliderValues();
        });
    }

    if (forceSlider) {
        forceSlider.addEventListener('input', (e) => {
            F0 = parseFloat(e.target.value);
            updateSliderValues();
        });
    }

    if (freqSlider) {
        freqSlider.addEventListener('input', (e) => {
            w_force = parseFloat(e.target.value);
            updateSliderValues();
        });
    }

    // Initialize values
    updateSliderValues();
}




// Initialize the mass-spring simulation
function initDynamicsSimulation() {
    const canvas = document.getElementById('dynamics-canvas');
    const timeCanvas = document.getElementById('time-canvas');
    const freqCanvas = document.getElementById('freq-canvas');
    
    if (!canvas || !timeCanvas || !freqCanvas) return;
    
    const ctx = canvas.getContext('2d');
    const timeCtx = timeCanvas.getContext('2d');
    const freqCtx = freqCanvas.getContext('2d');
    
    // System parameters
    let m = 1, k = 10, c = 1, F0 = 1, w_force = 6.28;
    let t = 0;
    let animationId;
    
    // Get demo sliders
    const massSlider = document.getElementById('demo-mass');
    const springSlider = document.getElementById('demo-spring');
    const dampingSlider = document.getElementById('demo-damping');
    const forceSlider = document.getElementById('demo-force');
    const freqSlider = document.getElementById('demo-freq');
    
    // Get value displays
    const massVal = document.getElementById('demo-mass-val');
    const springVal = document.getElementById('demo-spring-val');
    const dampingVal = document.getElementById('demo-damping-val');
    const forceVal = document.getElementById('demo-force-val');
    const freqVal = document.getElementById('demo-freq-val');
    
    // Update slider values
    function updateValues() {
        if (massVal) massVal.textContent = m.toFixed(1);
        if (springVal) springVal.textContent = k.toFixed(0);
        if (dampingVal) dampingVal.textContent = c.toFixed(1);
        if (forceVal) forceVal.textContent = F0.toFixed(1);
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
    
    if (forceSlider) {
        forceSlider.addEventListener('input', (e) => {
            F0 = parseFloat(e.target.value);
            updateValues();
        });
    }
    
    if (freqSlider) {
        freqSlider.addEventListener('input', (e) => {
            w_force = parseFloat(e.target.value);
            updateValues();
        });
    }
    
    // Draw main animation
    function drawAnimation() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate response
        const X = F0 / (-m * w_force * w_force + 1i * c * w_force + k);
        const x = 400 + 100 * Math.cos(w_force * t);
        const y = 200 + 50 * Math.sin(w_force * t);
        
        // Draw spring-mass system
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(50, 200);
        ctx.lineTo(x - 30, y);
        ctx.stroke();
        
        // Draw mass
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x - 30, y - 20, 60, 40);
        
        // Draw force arrow
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 40, y);
        ctx.lineTo(x + 80, y);
        ctx.stroke();
        
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(x + 80, y);
        ctx.lineTo(x + 75, y - 5);
        ctx.lineTo(x + 75, y + 5);
        ctx.fill();
        
        // Draw time domain plot
        drawTimePlot();
        drawFreqPlot();
        
        t += 0.05;
        animationId = requestAnimationFrame(drawAnimation);
    }
    
    // Draw time domain response
    function drawTimePlot() {
        timeCtx.clearRect(0, 0, timeCanvas.width, timeCanvas.height);
        
        const timeWindow = 5;
        const dt = timeWindow / timeCanvas.width;
        
        timeCtx.strokeStyle = '#dc2626';
        timeCtx.lineWidth = 2;
        timeCtx.beginPath();
        
        for (let i = 0; i < timeCanvas.width; i++) {
            const t_val = t + i * dt - timeWindow;
            const force = F0 * Math.sin(w_force * t_val);
            const x = i;
            const y = timeCanvas.height/2 - force * 20;
            if (i === 0) {
                timeCtx.moveTo(x, y);
            } else {
                timeCtx.lineTo(x, y);
            }
        }
        timeCtx.stroke();
        
        // Labels
        timeCtx.fillStyle = '#374151';
        timeCtx.font = '12px Arial';
        timeCtx.fillText('Force vs Time', 10, 20);
    }
    
    // Draw frequency response
    function drawFreqPlot() {
        freqCtx.clearRect(0, 0, freqCanvas.width, freqCanvas.height);
        
        const w_n = Math.sqrt(k / m);
        const zeta = c / (2 * Math.sqrt(k * m));
        
        freqCtx.strokeStyle = '#2563eb';
        freqCtx.lineWidth = 2;
        freqCtx.beginPath();
        
        for (let i = 0; i < freqCanvas.width; i++) {
            const w = 0.1 + (i / freqCanvas.width) * 20;
            const H = 1 / (-m * w * w + 1i * c * w + k);
            const mag = 20 * Math.log10(Math.abs(H));
            const x = i;
            const y = freqCanvas.height/2 - mag * 2;
            if (i === 0) {
                freqCtx.moveTo(x, y);
            } else {
                freqCtx.lineTo(x, y);
            }
        }
        freqCtx.stroke();
        
        // Mark forcing frequency
        const freqX = (w_force - 0.1) / 20 * freqCanvas.width;
        freqCtx.fillStyle = '#dc2626';
        freqCtx.beginPath();
        freqCtx.arc(freqX, freqCanvas.height/2, 3, 0, 2*Math.PI);
        freqCtx.fill();
        
        // Labels
        freqCtx.fillStyle = '#374151';
        freqCtx.font = '12px Arial';
        freqCtx.fillText('Frequency Response', 10, 20);
    }
    
    // Initialize
    updateValues();
    drawAnimation();
}

// Initialize mass-spring simulation on page load
document.addEventListener('DOMContentLoaded', function() {
    initMassSpringSimulation();
});
