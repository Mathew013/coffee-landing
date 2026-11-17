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