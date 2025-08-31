
// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const cursor = document.querySelector('.cursor');
    const themeSwitch = document.querySelector('.theme-switch');
    const menuMobile = document.querySelector('.menu-mobile');
    const menu = document.querySelector('.menu');
    const sections = document.querySelectorAll('section');
    const skillBars = document.querySelectorAll('.progress');
    const form = document.getElementById('form');
    const typingElement = document.querySelector('.typing');

    // Carousel Elements
    const carouselTrack = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    // const indicators = document.querySelectorAll('.carousel-dot');
    const currentSlideElement = document.getElementById('currentSlide');
    const totalSlidesElement = document.getElementById('totalSlides');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Variables
    const typingTexts = ['Frontend', 'web', 'Full Stack'];
    let typingIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    // Carousel Variables
    let currentSlideIndex = 0;
    let totalSlides = slides.length;
    let filteredSlides = Array.from(slides);
    let autoSlideInterval;

    window.addEventListener("load", function () {
        const preloader = document.getElementById("preloader");

        // Mantém o preloader visível por pelo menos 1.5s
        setTimeout(() => {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 500); // tempo do fade-out
        }, 2000); // tempo mínimo da animação
    });




    // Custom cursor
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.addEventListener('mousedown', () => {
            cursor.style.width = '15px';
            cursor.style.height = '15px';
            cursor.style.backgroundColor = 'var(--primary-color)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'transparent';
        });

        document.querySelectorAll('a, button, .menu-mobile, .theme-switch').forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.borderWidth = '1px';
            });

            item.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.borderWidth = '2px';
            });
        });
    }

    // Theme switch
    themeSwitch.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isDarkTheme = !document.body.classList.contains('light-theme');
        localStorage.setItem('darkTheme', isDarkTheme);
    });

    // Check saved theme preference
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'false') {
        document.body.classList.add('light-theme');
    }

    // Mobile menu toggle
    menuMobile.addEventListener('click', () => {
        menuMobile.classList.toggle('active');
        menu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            menuMobile.classList.remove('active');
            menu.classList.remove('active');

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                document.querySelectorAll('.menu a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Scroll spy for active menu
    function updateActiveMenu() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.menu a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Animate sections on scroll
    function animateSections() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight * 0.8) {
                section.classList.add('in-view');

                if (section.id === 'sobre') {
                    skillBars.forEach(bar => {
                        const value = bar.getAttribute('data-value');
                        bar.style.width = value + '%';
                    });
                }
            }
        });
    }

    // Typing animation
    function typingAnimation() {
        const currentText = typingTexts[typingIndex];

        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            typingIndex = (typingIndex + 1) % typingTexts.length;
            typingSpeed = 500;
        }

        setTimeout(typingAnimation, typingSpeed);
    }

    // Carousel Functions
    function updateCarousel() {
        const translateX = -currentSlideIndex * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;

        // Update active slide
        filteredSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlideIndex);
        });

        // Update indicators dinamicamente
        const indicatorContainer = document.getElementById('carouselIndicators');
        const dots = indicatorContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlideIndex);
        });


        // Update counter
        currentSlideElement.textContent = currentSlideIndex + 1;

        // Update navigation buttons
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === filteredSlides.length - 1;
    }

    function nextSlide() {
        if (currentSlideIndex < filteredSlides.length - 1) {
            currentSlideIndex++;
            updateCarousel();
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateCarousel();
        }
    }

    function goToSlide(index) {
        currentSlideIndex = index;
        updateCarousel();
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            if (currentSlideIndex < filteredSlides.length - 1) {
                nextSlide();
            } else {
                currentSlideIndex = 0;
                updateCarousel();
            }
        }, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    function filterProjects(category) {
        // Reset carousel
        currentSlideIndex = 0;

        if (category === 'all') {
            filteredSlides = Array.from(slides);
        } else {
            filteredSlides = Array.from(slides).filter(slide =>
                slide.getAttribute('data-category') === category
            );
        }

        // Hide all slides first
        slides.forEach(slide => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });

        // Show filtered slides
        filteredSlides.forEach((slide, index) => {
            slide.style.display = 'flex';
            if (index === 0) {
                slide.classList.add('active');
            }
        });

        // Update indicators
        const indicatorContainer = document.getElementById('carouselIndicators');
        indicatorContainer.innerHTML = '';

        filteredSlides.forEach((slide, index) => {
            const dot = document.createElement('span');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('data-slide', index);
            dot.addEventListener('click', () => goToSlide(index));
            indicatorContainer.appendChild(dot);
        });

        // Update total slides counter
        totalSlidesElement.textContent = filteredSlides.length;

        // Update carousel
        updateCarousel();

        // Restart auto slide
        startAutoSlide();
    }

    // Carousel Event Listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        setTimeout(startAutoSlide, 10000); // Restart after 10 seconds
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        setTimeout(startAutoSlide, 10000);
    });

    // Initial indicators setup (dinâmico)
    document.getElementById('carouselIndicators')
        .querySelectorAll('.carousel-dot')
        .forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                stopAutoSlide();
                setTimeout(startAutoSlide, 10000);
            });
        });


    // Project filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            filterProjects(filterValue);
        });
    });

    // Touch/Swipe support for mobile
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoSlide();
    });

    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diffX = startX - currentX;

        // Add visual feedback during swipe
        const currentTranslateX = -currentSlideIndex * 100;
        const swipeOffset = (diffX / window.innerWidth) * 100;
        carouselTrack.style.transform = `translateX(${currentTranslateX - swipeOffset}%)`;
    });

    carouselTrack.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;

        const diffX = startX - currentX;
        const threshold = window.innerWidth * 0.2; // 20% of screen width

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0 && currentSlideIndex < filteredSlides.length - 1) {
                nextSlide();
            } else if (diffX < 0 && currentSlideIndex > 0) {
                prevSlide();
            } else {
                updateCarousel(); // Reset position
            }
        } else {
            updateCarousel(); // Reset position
        }

        setTimeout(startAutoSlide, 5000);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 10000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 10000);
        }
    });

    // Pause auto-slide on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);

    // Form submission
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });

            let isValid = true;
            const inputs = form.querySelectorAll('input, textarea');

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (!isValid) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            alert('Mensagem enviada com sucesso! Em breve entrarei em contato.');
            form.reset();
        });
    }

    // Download CV functionality
    const downloadBtn = document.getElementById('downloadBtn');
    // Caminho correto para o PDF
    const localFilePath = './src/public/ATS-Reginaldo-Nunes.pdf';


    downloadBtn.addEventListener('click', () => {
        downloadBtn.classList.add('downloading');

        function downloadLocalFile(filePath, fileName) {
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                fetch(filePath)
                    .then(response => response.blob())
                    .then(blob => {
                        window.navigator.msSaveOrOpenBlob(blob, fileName);
                    });
            } else {
                const link = document.createElement('a');
                link.href = filePath;
                link.download = fileName || 'ATS-Reginaldo-Nunes.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }

        setTimeout(() => {
            try {
                downloadLocalFile(localFilePath, 'ATS-Reginaldo-Nunes.pdf');
                downloadBtn.classList.remove('downloading');
                downloadBtn.classList.add('download-success');

                setTimeout(() => {
                    downloadBtn.classList.remove('download-success');
                }, 2000);
            } catch (error) {
                downloadBtn.classList.remove('downloading');
                downloadBtn.classList.add('download-error');
                console.error('Erro no download:', error);

                setTimeout(() => {
                    downloadBtn.classList.remove('download-error');
                }, 2000);
            }
        }, 1000);
    });

    // Sticky header
    function updateHeader() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '20px 0';
            header.style.boxShadow = 'none';
        }
    }

    // Initial calls
    updateActiveMenu();
    animateSections();
    typingAnimation();
    updateHeader();
    updateCarousel();
    startAutoSlide();

    // Event listeners for scrolling
    window.addEventListener('scroll', () => {
        updateActiveMenu();
        animateSections();
        updateHeader();
    });

    // Window resize handler
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            menuMobile.classList.remove('active');
            menu.classList.remove('active');
        }
        updateCarousel();
    });

    // Initialize filtered projects
    filterProjects('all');
});


// Função para criar notificações
function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4500); // remove após 4,5s
}

// EmailJS init
(function () {
    emailjs.init("EgMgHbjRXhbLq6Ydk"); // sua public key
})();

// Função para formatar data/hora em português
function getCurrentTimestamp() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Fortaleza'
    };

    return new Intl.DateTimeFormat('pt-BR', options).format(now);
}

document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    showToast("Enviando sua mensagem... ⏳", "info");

    const params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
        timestamp: getCurrentTimestamp()
    };

    emailjs.send("service_o2f1jwj", "template_w76dxsq", params)
        .then(() => {
            showToast("Mensagem enviada com sucesso ✅", "success");
            this.reset();
        }, (error) => {
            showToast("Erro ao enviar mensagem ❌", "error");
            console.error("Erro:", error);
        });
});

// Função de toast notification (caso não exista)
function showToast(message, type) {
    // Criar container se não existir
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;
        document.body.appendChild(container);
    }

    // Criar toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        padding: 15px 20px;
        border-radius: 18px;
        box-shadow: 0 6px 28px rgba(0, 0, 0, 0.15);
        font-weight: 500;
        font-size: 0.95rem;
        max-width: 300px;
        line-height: 1.4;
        color: #fff;
        animation: slideIn 0.4s ease, fadeOut 0.5s ease 4s forwards;
    `;

    // Cores baseadas no tipo
    const colors = {
        success: 'linear-gradient(45deg, #00ff9d, #0077ff)',
        error: 'linear-gradient(45deg, #ff3b30, #ff7675)',
        info: 'linear-gradient(45deg, #0077ff, #00ff9d)'
    };

    toast.style.background = colors[type] || colors.info;
    if (type === 'success' || type === 'info') {
        toast.style.color = '#000';
    }

    container.appendChild(toast);

    // Remover toast após 5 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
}

// Melhorias na experiência do usuário
document.addEventListener('DOMContentLoaded', function () {
    // Adicionar indicador visual de campos obrigatórios
    const requiredFields = document.querySelectorAll('#contact-form input[required], #contact-form textarea[required]');

    requiredFields.forEach(field => {
        // Validação em tempo real
        field.addEventListener('blur', function () {
            if (this.value.trim() === '') {
                this.style.borderBottomColor = '#ff3b30';
            } else {
                this.style.borderBottomColor = '#00ff9d';
            }
        });

        // Remover erro ao digitar
        field.addEventListener('input', function () {
            if (this.value.trim() !== '') {
                this.style.borderBottomColor = '#00ff9d';
            }
        });
    });

    // Validação de email em tempo real
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function () {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderBottomColor = '#ff3b30';
                // Opcional: mostrar mensagem de erro sutil
            } else if (this.value) {
                this.style.borderBottomColor = '#00ff9d';
            }
        });
    }
});