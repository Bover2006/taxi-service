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
            });
        });
    }
});
