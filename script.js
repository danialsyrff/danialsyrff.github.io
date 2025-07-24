// --- Mobile Menu ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// --- Matrix Rain Effect ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
let animationFrameId;

function setupMatrix() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const rainDrops = [];

        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }

        const drawMatrix = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#4ade80';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
            animationFrameId = requestAnimationFrame(drawMatrix);
        };

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        drawMatrix();
    }
}

window.addEventListener('resize', setupMatrix);
document.addEventListener('DOMContentLoaded', setupMatrix);


// --- Typewriter Effect ---
const typewriterElement = document.getElementById('typewriter');
if (typewriterElement) {
    const roles = ['Full-Stack Developer', 'Data Analyst', 'Problem Solver'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }

        setTimeout(type, isDeleting ? 100 : 200);
    }
    type();
}

// --- Scroll Reveal Animation ---
const revealElements = document.querySelectorAll('.scroll-reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(elem => {
    revealObserver.observe(elem);
});

// --- Contact Form ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        // 1. Prevent the default form submission
        e.preventDefault();

        // 2. Give the user immediate feedback
        formStatus.textContent = 'Sending...';
        formStatus.className = 'text-slate-400'; // Neutral color while sending

        // 3. Get the data from the form fields using their new IDs
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // --- THIS IS THE NEW PART ---
        // 4. Define your n8n webhook URL
        const webhookURL = 'https://n8n.vontechdigital.com:5678/webhook/0230bab0-5b1d-4cac-9569-eb5d94bdde6d';

        // 5. Send the data to the n8n webhook
        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            // Check if the request was successful
            if (response.ok) {
                // Use your original success logic
                formStatus.textContent = 'Thank you for your message!';
                formStatus.className = 'text-green-400';
                contactForm.reset();
            } else {
                // Handle server errors (e.g., n8n workflow is inactive)
                throw new Error('Something went wrong on the server.');
            }
        })
        .catch(error => {
            // Handle network errors (e.g., user is offline)
            console.error('Fetch Error:', error);
            formStatus.textContent = 'Oops! Could not send message. Please try again later.';
            formStatus.className = 'text-red-400';
        })
        .finally(() => {
            // Use your original timeout logic to clear the status message
            setTimeout(() => {
                formStatus.textContent = '';
            }, 5000);
        });
        // --- END OF NEW PART ---
    });
}

// --- Footer Year ---
document.getElementById('current-year').textContent = new Date().getFullYear();