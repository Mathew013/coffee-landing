// Адрес прослойки (Cloudflare Worker), куда отправляются заявки
const WORKER_URL = 'https://zerno-booking.mismirnov20102906.workers.dev';

// 1. Находим элементы на странице по их id
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

// 2. Говорим: "когда нажмут на бургер — выполни функцию"
burger.addEventListener('click', function () {
    // 3. toggle: если класса open нет — добавить, если есть — убрать
    nav.classList.toggle('open');

    // 4. Меняем значок в зависимости от того, открыто ли меню
    if (nav.classList.contains('open')) {
        burger.textContent = '✕';
    } else {
        burger.textContent = '☰';
    }
});

// 4. Закрываем меню после клика по любой ссылке
const links = nav.querySelectorAll('a');

links.forEach(function (link) {
    link.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.textContent = '☰';   // ← новая строка
    });
});

console.log('Скрипт подключён!');

// ---- Модальное окно ----
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('modalClose');
const form = document.getElementById('bookingForm');
const formSuccess = document.getElementById('formSuccess');
const successClose = document.getElementById('successClose');
const formError = document.getElementById('formError');

// ---- Маска телефона ----
const phoneInput = form.querySelector('input[name="phone"]');

function formatPhone(value) {
    let digits = value.replace(/\D/g, '');   // оставляем только цифры

    if (!digits) {
        return '';                             // поле очистили — оставляем пустым
    }

    if (digits.startsWith('8')) {
        digits = '7' + digits.slice(1);        // 8 912... → 7 912...
    }

    if (!digits.startsWith('7')) {
        digits = '7' + digits;                 // начали с 9 — дописываем 7 впереди
    }

    digits = digits.slice(0, 11);            // в номере 11 цифр, лишние отбрасываем

    let result = '+7';
    if (digits.length > 1) result += ' (' + digits.slice(1, 4);
    if (digits.length > 4) result += ') ' + digits.slice(4, 7);
    if (digits.length > 7) result += '-' + digits.slice(7, 9);
    if (digits.length > 9) result += '-' + digits.slice(9, 11);

    return result;
}

phoneInput.addEventListener('input', function () {
    phoneInput.value = formatPhone(phoneInput.value);
});

// Свои функции: открыть и закрыть окно
function openModal() {
    form.hidden = false;
    formSuccess.hidden = true;
    formError.hidden = true;
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
}

function closeModal() {
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
}

// Способ открыть: кнопка
openModalBtn.addEventListener('click', openModal);

// Способ закрыть №1: крестик
closeModalBtn.addEventListener('click', closeModal);

// Способ закрыть №2: клик по тёмному фону (но не по самому окну)
modal.addEventListener('click', function (event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Способ закрыть №3: клавиша Esc
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Отправка формы
// Отправка формы в Worker → Telegram
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const booking = Object.fromEntries(new FormData(form));

    // Блокируем кнопку, чтобы не отправили дважды
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';
    formError.hidden = true;

    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking),
            signal: AbortSignal.timeout(10000),   // ждём не больше 10 секунд
        });

        const result = await response.json();

        if (!result.ok) {
            throw new Error(result.error);
        }

        form.reset();
        form.hidden = true;
        formSuccess.hidden = false;
    } catch (error) {
        console.log('Ошибка отправки:', error);
        formError.hidden = false;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
    }
});

// Кнопка «Хорошо» закрывает окно
successClose.addEventListener('click', closeModal);

// ---- Пункт "Бронь" в меню ----
const navBooking = document.getElementById('navBooking');

navBooking.addEventListener('click', function (event) {
    event.preventDefault();   // отменяем прыжок наверх из-за href="#"
    openModal();              // открываем окно
});