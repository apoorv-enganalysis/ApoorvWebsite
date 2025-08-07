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
    const articleContent = `
        <div class="article-modal">
            <div class="article-content">
                <h2>Dynamics & Vibration Analysis</h2>
                <p>Dynamics analysis studies the motion of mechanical systems under the influence of forces, while vibration analysis focuses on oscillatory motion.</p>
                
                <h3>Fundamental Concepts:</h3>
                <ul>
                    <li><strong>Natural Frequency:</strong> The frequency at which a system naturally vibrates</li>
                    <li><strong>Damping:</strong> Energy dissipation that reduces vibration amplitude</li>
                    <li><strong>Mode Shapes:</strong> The pattern of vibration at each natural frequency</li>
                    <li><strong>Resonance:</strong> Amplified response when forcing frequency matches natural frequency</li>
                </ul>
                
                <h3>Analysis Types:</h3>
                <ul>
                    <li>Modal analysis for natural frequencies</li>
                    <li>Harmonic analysis for steady-state response</li>
                    <li>Transient analysis for time-domain response</li>
                    <li>Random vibration analysis for stochastic loading</li>
                </ul>
                
                <div class="interactive-demo">
                    <h4>Spring-Mass System Demo</h4>
                    <p>Adjust the frequency to see how it affects the system response:</p>
                    <div class="demo-controls">
                        <label>Frequency: <span id="demo-freq-value">5 Hz</span></label>
                        <input type="range" id="demo-freq-slider" min="1" max="20" value="5">
                    </div>
                    <div class="dynamics-visualization">
                        <div class="spring-mass-demo">
                            <div class="demo-spring"></div>
                            <div class="demo-mass"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(articleContent);
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
