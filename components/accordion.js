document.addEventListener('DOMContentLoaded', () => {

    const accordion = document.querySelector('.accordion');
    const trigger = accordion.querySelector('.accordion__trigger');
    const content = accordion.querySelector('.accordion__content');

    trigger.addEventListener('click', () => {
        content.classList.toggle('hidden');
    });
});
