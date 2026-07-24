document.addEventListener('DOMContentLoaded', () => {
    // 1. Ефект зміни шапки при прокрутці
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Обробка форми замовлення (імітація)
    const bookingForm = document.getElementById('booking-form');
    const successMessage = document.getElementById('success-message');
    const newBookingBtn = document.getElementById('new-booking-btn');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Запобігаємо стандартному відправленню форми

            // Проста анімація кнопки під час "завантаження"
            const submitBtn = bookingForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Обробка...';
            submitBtn.style.opacity = '0.8';
            submitBtn.disabled = true;

            // Імітація запиту на сервер (затримка 1.5 секунди)
            setTimeout(() => {
                // Ховаємо форму
                bookingForm.style.display = 'none';
                
                // Показуємо повідомлення про успіх
                successMessage.classList.add('show');
                
                // Відновлюємо кнопку (для майбутніх замовлень)
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // 3. Обробник для кнопки "Нове замовлення"
    if (newBookingBtn) {
        newBookingBtn.addEventListener('click', () => {
            // Очищаємо форму
            bookingForm.reset();
            
            // Ховаємо повідомлення, показуємо форму
            successMessage.classList.remove('show');
            bookingForm.style.display = 'block';
        });
    }

    // 4. Плавна прокрутка для якірних посилань (резервний варіант, хоча в CSS вже є scroll-behavior: smooth)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Відступ для закріпленої шапки
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Логіка модального вікна вибору авто
    const carModal = document.getElementById('car-modal');
    const carClassSelector = document.getElementById('car-class-selector');
    const closeModalBtn = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const carOptions = document.querySelectorAll('.car-option');
    const carClassInput = document.getElementById('car-class-input');
    const carClassHidden = document.getElementById('car-class');

    function openModal() {
        carModal.classList.add('active');
    }

    function closeModal() {
        carModal.classList.remove('active');
    }

    if (carClassSelector && carModal) {
        carClassSelector.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);

        carOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Видаляємо клас selected у всіх
                carOptions.forEach(opt => opt.classList.remove('selected'));
                // Додаємо поточному
                this.classList.add('selected');
                
                // Оновлюємо значення в формі
                const selectedValue = this.getAttribute('data-value');
                const selectedName = this.getAttribute('data-name');
                
                carClassHidden.value = selectedValue;
                carClassInput.value = selectedName;
                
                closeModal();
                if (window.calculateAndDisplayPrice) window.calculateAndDisplayPrice();
            });
        });
    }

    // 5.5 Логіка кнопок вибору способу оплати
    const paymentBtns = document.querySelectorAll('.payment-btn');
    const paymentHidden = document.getElementById('payment-method');

    if (paymentBtns.length > 0 && paymentHidden) {
        paymentBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                paymentBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                paymentHidden.value = this.getAttribute('data-method');
            });
        });
    }

    // 6. Intersection Observer для анімацій при прокрутці
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-down, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 7. Кастомний курсор
    const cursor = document.getElementById('custom-cursor');
    const cursorFollower = document.getElementById('custom-cursor-follower');
    
    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Плавний рух фоловера
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 50);
        });

        // Ефекти при наведенні
        const hoverElements = document.querySelectorAll('a, button, input, select, .car-option, .feature-card, .logo');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // 8. 3D Tilt Ефект для карток
    const tiltCards = document.querySelectorAll('.tilt-card, .tilt-card-light');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // 9. Паралакс для авто на головному екрані
    const heroSection = document.getElementById('hero');
    const floatingCar = document.querySelector('.floating-car');
    
    if (heroSection && floatingCar) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;
            
            floatingCar.style.setProperty('--px', `${x}px`);
            floatingCar.style.setProperty('--py', `${y}px`);
        });
        
        heroSection.addEventListener('mouseleave', () => {
            floatingCar.style.setProperty('--px', `0px`);
            floatingCar.style.setProperty('--py', `0px`);
        });
    }

    // 10. Typewriter Effect (Ефект друкарської машинки)
    const typeTarget = document.querySelector('.type-effect');
    if (typeTarget) {
        const text = typeTarget.innerHTML;
        typeTarget.innerHTML = '';
        let i = 0;
        let isTag = false;
        let currentText = '';
        
        function typeWriter() {
            if (i < text.length) {
                const char = text.charAt(i);
                if (char === '<') isTag = true;
                
                currentText += char;
                typeTarget.innerHTML = currentText + '<span class="cursor-blink">|</span>';
                
                if (char === '>') isTag = false;
                
                i++;
                let speed = isTag ? 0 : 50 + Math.random() * 50;
                setTimeout(typeWriter, speed);
            } else {
                typeTarget.innerHTML = text + '<span class="cursor-blink">|</span>';
            }
        }
        setTimeout(typeWriter, 500);
    }

    // 11. Перемикач темної теми
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Перевіряємо збережену тему
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
        }
        
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.body.removeAttribute('data-theme');
                themeToggle.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                themeToggle.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});

// 12. Безкоштовна карта (Leaflet + OpenStreetMap)
document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Прибираємо плейсхолдер
    mapElement.innerHTML = '';

    // Ініціалізація карти (Київ)
    const map = L.map('map').setView([50.4501, 30.5234], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let routingControl = null;
    let pickupCoords = null;
    let dropoffCoords = null;

    function setupAutocomplete(inputId, resultsId, isPickup) {
        const input = document.getElementById(inputId);
        const results = document.getElementById(resultsId);
        let timeout = null;

        input.addEventListener('input', (e) => {
            clearTimeout(timeout);
            const query = e.target.value;
            
            if (query.length < 3) {
                results.style.display = 'none';
                return;
            }

            timeout = setTimeout(() => {
                // Запит до безкоштовного Nominatim API
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ua`)
                    .then(res => res.json())
                    .then(data => {
                        results.innerHTML = '';
                        if (data.length > 0) {
                            results.style.display = 'block';
                            data.forEach(place => {
                                const div = document.createElement('div');
                                div.className = 'autocomplete-item';
                                div.textContent = place.display_name;
                                div.addEventListener('click', () => {
                                    input.value = place.display_name;
                                    results.style.display = 'none';
                                    
                                    const coords = L.latLng(place.lat, place.lon);
                                    if (isPickup) pickupCoords = coords;
                                    else dropoffCoords = coords;
                                    
                                    map.flyTo(coords, 14);
                                    checkAndDrawRoute();
                                });
                                results.appendChild(div);
                            });
                        } else {
                            results.style.display = 'none';
                        }
                    });
            }, 600); // Затримка, щоб не спамити API
        });

        // Ховати результати при кліку поза межами
        document.addEventListener('click', (e) => {
            if (e.target !== input && e.target !== results) {
                results.style.display = 'none';
            }
        });
    }

    setupAutocomplete('pickup', 'pickup-results', true);
    setupAutocomplete('dropoff', 'dropoff-results', false);

    function checkAndDrawRoute() {
        if (pickupCoords && dropoffCoords) {
            if (routingControl) {
                map.removeControl(routingControl);
            }

            // Побудова маршруту через OSRM
            routingControl = L.Routing.control({
                waypoints: [pickupCoords, dropoffCoords],
                routeWhileDragging: false,
                addWaypoints: false,
                show: false, // Приховуємо детальну текстову панель маршруту
                lineOptions: {
                    styles: [{ color: '#2ECC71', opacity: 0.9, weight: 5 }]
                }
            }).addTo(map);

            routingControl.on('routesfound', function(e) {
                const routes = e.routes;
                const summary = routes[0].summary;
                
                // Переводимо метри в км, а секунди в хвилини
                const distanceKm = (summary.totalDistance / 1000).toFixed(1);
                const timeMin = Math.round(summary.totalTime / 60);

                document.getElementById('route-info').style.display = 'flex';
                document.getElementById('dist-val').textContent = distanceKm + ' км';
                document.getElementById('dur-val').textContent = timeMin + ' хв';
                
                if (window.calculateAndDisplayPrice) window.calculateAndDisplayPrice(parseFloat(distanceKm));
            });
        }
    }
});

// 13. Глобальна функція для розрахунку вартості
window.calculateAndDisplayPrice = function(distanceKm) {
    if (distanceKm !== undefined) {
        window.currentDistanceKm = distanceKm;
    }
    const dist = window.currentDistanceKm || 0;
    if (dist === 0) return; // Маршрут ще не побудовано

    const carClass = document.getElementById('car-class').value;
    const basePrice = 50; // подача
    const pricePerKm = 15;
    let multiplier = 1.0;

    if (carClass === 'comfort') multiplier = 1.3;
    else if (carClass === 'business') multiplier = 2.0;
    else if (carClass === 'minivan') multiplier = 1.5;

    const total = Math.round((basePrice + dist * pricePerKm) * multiplier);
    
    document.getElementById('price-val').textContent = total + ' ₴';
};
