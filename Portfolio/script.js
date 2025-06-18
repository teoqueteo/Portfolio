// Theme Toggle (sin localStorage por sandboxing)
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
}

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Animaciones al hacer scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Cargar proyectos desde GitHub
async function loadProjects() {
    try {
        const response = await fetch('https://api.github.com/users/teoqueteo/repos?sort=updated&per_page=6');
        const repos = await response.json();

        const projectsContainer = document.getElementById('projects-container');

        if (!Array.isArray(repos)) throw new Error('Respuesta no válida');

        const projectsGrid = document.createElement('div');
        projectsGrid.className = 'projects-grid';

        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';

            const title = document.createElement('h3');
            title.textContent = repo.name;
            title.style.color = 'var(--color-acento)';
            title.style.marginBottom = '1rem';
            title.style.fontFamily = "'Orbitron', monospace";

            const desc = document.createElement('p');
            desc.textContent = repo.description || 'Sin descripción disponible';
            desc.style.marginBottom = '1rem';
            desc.style.color = 'var(--color-secundario)';

            const tech = document.createElement('div');
            tech.className = 'project-tech';
            if (repo.language) {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = repo.language;
                tech.appendChild(tag);
            }

            const links = document.createElement('div');
            links.style.marginTop = '1.5rem';

            const githubBtn = document.createElement('a');
            githubBtn.href = repo.html_url;
            githubBtn.className = 'btn';
            githubBtn.target = '_blank';
            githubBtn.style.marginRight = '0.5rem';
            githubBtn.innerHTML = `<i class="fab fa-github"></i> Ver Código`;

            links.appendChild(githubBtn);

            if (repo.homepage) {
                const demoBtn = document.createElement('a');
                demoBtn.href = repo.homepage;
                demoBtn.className = 'btn';
                demoBtn.target = '_blank';
                demoBtn.textContent = 'Ver Demo';
                links.appendChild(demoBtn);
            }

            card.appendChild(title);
            card.appendChild(desc);
            card.appendChild(tech);
            card.appendChild(links);

            projectsGrid.appendChild(card);
        });

        projectsContainer.innerHTML = '';
        projectsContainer.appendChild(projectsGrid);

    } catch (error) {
        console.error('Error al cargar repos:', error);
        document.getElementById('projects-container').innerHTML = `
            <div class="hex-card" style="text-align: center;">
                <h3>Error al cargar los repositorios</h3>
                <p>No se pudieron obtener los proyectos desde GitHub.</p>
                <a href="https://github.com/teoqueteo" target="_blank" class="btn">
                    <i class="fab fa-github"></i> Ver GitHub
                </a>
            </div>
        `;
    }
}

// Formulario de contacto
function handleFormSubmit(event) {
    const form = event.target;

    if (!form.checkValidity()) {
        event.preventDefault(); // Cancelar envío
        form.reportValidity();  // Mostrar mensajes nativos
        return;
    }

    event.preventDefault(); // Continuamos con el envío simulado

    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;

    setTimeout(() => {
        showNotification('¡Mensaje enviado correctamente! Te contactaré pronto.', 'success');
        form.reset();
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }, 2000);
}

// Notificaciones flotantes
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'all 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });

    notification.style.background =
        type === 'success'
            ? 'linear-gradient(135deg, #00c851, #28a745)'
            : type === 'error'
                ? 'linear-gradient(135deg, #ff4444, #cc0000)'
                : 'linear-gradient(135deg, #33b5e5, #0099cc)';

    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Partículas flotantes
function createParticles() {
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.style.position = 'fixed';
        p.style.width = '3px';
        p.style.height = '3px';
        p.style.borderRadius = '50%';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = Math.random() * 100 + 'vh';
        p.style.pointerEvents = 'none';
        p.style.zIndex = '-1';
        p.style.animation = `float ${5 + Math.random() * 10}s linear infinite`;

        if (document.body.classList.contains('dark-mode')) {
            p.style.background = Math.random() > 0.5 ? 'var(--color-acento)' : 'var(--color-terciario)';
            p.style.opacity = Math.random() * 0.5;
        } else {
            p.style.background = Math.random() > 0.5 ? '#cc0000' : '#ffd700';
            p.style.opacity = Math.random() * 0.8 + 0.2;
            p.style.boxShadow = '0 0 6px currentColor';
        }

        document.body.appendChild(p);
    }
}

// Animación CSS para partículas
const style = document.createElement('style');
style.textContent = `
@keyframes float {
    0% { transform: translateY(100vh) rotate(0deg); }
    100% { transform: translateY(-100vh) rotate(360deg); }
}`;
document.head.appendChild(style);

// Máquina de escribir
function initTypewriter() {
    const el = document.querySelector('.typewriter');
    if (el) {
        setTimeout(() => el.style.borderRight = 'none', 4000);
    }
}

// Inicialización
window.addEventListener('load', () => {
    loadProjects();
    createParticles();
    initTypewriter();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});
