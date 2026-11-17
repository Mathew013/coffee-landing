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

// Свои функции: открыть и закрыть окно
function openModal() {
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
form.addEventListener('submit', function (event) {
    event.preventDefault();   // не даём странице перезагрузиться

    const data = new FormData(form);
    console.log('Новая заявка:', data.get('name'), data.get('phone'), data.get('date'), data.get('guests'));

    form.reset();             // очищаем поля
    closeModal();
    alert('Спасибо! Мы скоро вам позвоним.');
});

// ---- Пункт "Бронь" в меню ----
const navBooking = document.getElementById('navBooking');

navBooking.addEventListener('click', function (event) {
    event.preventDefault();   // отменяем прыжок наверх из-за href="#"
    openModal();              // открываем окно
});