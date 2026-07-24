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
});
