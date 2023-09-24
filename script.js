// --- COUNTER COMPONENT ---
const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');

const inputHandler = () => {
    // determine max number of characters.
    const max = 150;
    // number of characters that user has currently typed.
    const numCharTyped = textareaEl.value.length;
    // calculate number of characters left.
    const charsLeft = max - numCharTyped;
    // show number of characters left.
    counterEl.textContent = charsLeft;
};  

textareaEl.addEventListener('input', inputHandler);

