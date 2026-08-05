/**
 * Samikshya Sigdel Portfolio - Dark & Artistic Interactive Script
 */

$(document).ready(function () {
    // ----------------------------------------------------
    // 1. Permanent Dark Theme Enforcement
    // ----------------------------------------------------
    $('body').removeClass('light-mode').addClass('dark-mode');

    // ----------------------------------------------------
    // 2. Mobile Navigation Drawer
    // ----------------------------------------------------
    const sideNav = $('#side-nav');
    const mobileToggle = $('#mobile-toggle');

    mobileToggle.on('click', function () {
        sideNav.toggleClass('open');
        const isOpened = sideNav.hasClass('open');
        mobileToggle.find('i').attr('class', isOpened ? 'fa-solid fa-xmark' : 'fa-solid fa-bars');
    });

    $('.nav-links a').on('click', function () {
        if ($(window).width() <= 1024) {
            sideNav.removeClass('open');
            mobileToggle.find('i').attr('class', 'fa-solid fa-bars');
        }
    });

    // ----------------------------------------------------
    // 3. Active Section Tracking (ScrollSpy)
    // ----------------------------------------------------
    const sections = $('section');
    const navLinks = $('.nav-links a');

    $(window).on('scroll', function () {
        let currentSectionId = '';
        const scrollPosition = $(window).scrollTop() + 200;

        sections.each(function () {
            const top = $(this).offset().top;
            const height = $(this).outerHeight();
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = $(this).attr('id');
            }
        });

        if (currentSectionId) {
            navLinks.removeClass('active');
            $(`.nav-links a[href="#${currentSectionId}"]`).addClass('active');
        }

        // Back to top visibility
        if ($(window).scrollTop() > 400) {
            $('#back-to-top').addClass('visible');
        } else {
            $('#back-to-top').removeClass('visible');
        }
    });

    $('#back-to-top').on('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ----------------------------------------------------
    // 4. Interactive Gallery Category Filtering
    // ----------------------------------------------------
    const filterButtons = $('.filter-btn');
    const galleryCards = $('.gallery-card');

    filterButtons.on('click', function () {
        filterButtons.removeClass('active');
        $(this).addClass('active');

        const selectedFilter = $(this).data('filter');

        galleryCards.each(function () {
            const cardCategory = $(this).data('category');
            if (selectedFilter === 'all' || cardCategory === selectedFilter) {
                $(this).removeClass('hide').css({
                    'opacity': '0',
                    'transform': 'scale(0.95)'
                });
                setTimeout(() => {
                    $(this).css({
                        'opacity': '1',
                        'transform': 'scale(1)'
                    });
                }, 50);
            } else {
                $(this).addClass('hide');
            }
        });
    });

    // ----------------------------------------------------
    // 5. Custom Fullscreen Lightbox Modal
    // ----------------------------------------------------
    const lightboxModal = $('#lightbox-modal');
    const lightboxImg = $('#lightbox-img');
    const lightboxTitle = $('#lightbox-title');
    const lightboxCategory = $('#lightbox-category');
    const lightboxCounter = $('#lightbox-counter');
    let visibleCardsList = [];
    let currentIndex = 0;

    function getVisibleCards() {
        return $('.gallery-card:not(.hide)');
    }

    function openLightbox(index) {
        visibleCardsList = getVisibleCards();
        if (index < 0) index = visibleCardsList.length - 1;
        if (index >= visibleCardsList.length) index = 0;
        
        currentIndex = index;
        const currentCard = $(visibleCardsList[currentIndex]);
        
        const src = currentCard.data('src');
        const title = currentCard.data('title');
        const category = currentCard.data('category') === 'coloured' ? '🎨 Coloured Art' : '✏️ Black & White';

        lightboxImg.attr('src', src);
        lightboxTitle.text(title);
        lightboxCategory.text(category);
        lightboxCounter.text(`${currentIndex + 1} of ${visibleCardsList.length}`);
        
        lightboxModal.addClass('active').attr('aria-hidden', 'false');
        $('body').css('overflow', 'hidden');
    }

    function closeLightbox() {
        lightboxModal.removeClass('active').attr('aria-hidden', 'true');
        $('body').css('overflow', 'auto');
    }

    galleryCards.on('click', function () {
        const visibleCards = getVisibleCards();
        const index = visibleCards.index(this);
        if (index !== -1) {
            openLightbox(index);
        }
    });

    $('#lightbox-close, .lightbox-backdrop').on('click', closeLightbox);

    $('#lightbox-prev').on('click', function (e) {
        e.stopPropagation();
        openLightbox(currentIndex - 1);
    });

    $('#lightbox-next').on('click', function (e) {
        e.stopPropagation();
        openLightbox(currentIndex + 1);
    });

    // Keyboard Shortcuts
    $(document).on('keydown', function (e) {
        if (!lightboxModal.hasClass('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
        if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    });

    // ----------------------------------------------------
    // 6. Contact Form Submission via AJAX to send_email.php
    // ----------------------------------------------------
    $('#contact-form').on('submit', function (e) {
        e.preventDefault();
        
        const form = $(this);
        const submitBtn = form.find('.submit-btn');
        const originalHtml = submitBtn.html();
        
        submitBtn.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin"></i> Sending...');
        
        $.ajax({
            url: 'send_email.php',
            type: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: function (response) {
                form[0].reset();
                submitBtn.prop('disabled', false).html(originalHtml);
                showToast(response.message || '✨ Message sent successfully!');
            },
            error: function (xhr) {
                let errorMsg = '⚠️ Unable to send email right now. Please email directly to samikshyasigdel45@gmail.com';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                }
                submitBtn.prop('disabled', false).html(originalHtml);
                showToast(errorMsg);
            }
        });
    });

    function showToast(message) {
        let toast = $('<div class="toast-success"></div>').text(message);
        $('body').append(toast);
        setTimeout(() => toast.addClass('show'), 100);
        
        setTimeout(() => {
            toast.removeClass('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // Set Copyright Year
    $('#year').text(new Date().getFullYear());

    // ----------------------------------------------------
    // 7. Hero Canvas Particles Background (Warm Golden Embers)
    // ----------------------------------------------------
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        $(window).on('resize', resizeCanvas);

        class EmberParticle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.8 + 0.8;
                this.speedX = (Math.random() - 0.5) * 0.35;
                this.speedY = (Math.random() - 0.5) * 0.35 - 0.15;
                this.alpha = Math.random() * 0.55 + 0.15;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.fillStyle = `rgba(226, 177, 112, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 55; i++) {
            particles.push(new EmberParticle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }
});
