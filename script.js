// -- GLOBAL VARIABLES --
const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEL = document.querySelector('.feedbacks');
const submitBtnEl = document.querySelector('.submit-btn');


// --- COUNTER COMPONENT ---

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

// -- FORM COMPONENT --
const submitHandler = event => {
    // prevent default form action to send form to action address and load page.
    event.preventDefault();
    // get text from textarea
    const text = textareaEl.value;
    //  validate text ( check if hashtage is present and check if text is long enought
    if (text.includes('#') && text.length >= 5) {
        // adds green outline if # is included in text.
        formEl.classList.add('form--valid');
        // if # is included and submit is clicked, green outline will be rmoved in 2 seconds.
        setTimeout(() => {
            formEl.classList.remove('form--valid');
            }, 2000)


    } else {
        // adds red outline if # is NOT included in text and text is not at least five characters..
        formEl.classList.add('form--invalid');
        setTimeout(() => {
        // if # is NOT included and text is less than 5 and submit is clicked, red outline will be rmoved in 2 seconds.
        formEl.classList.remove('form--invalid');
            }, 2000)
        // keep focus to textarea so user can continue to type.
        textareaEl.focus();
        // stop function execution. Return will stop function here. It will not return anything.
        return;
    }
    // extract other info from user submission

    // get hashtag from company name in text
    // text.split will split the text into arrays according to spaces.
    // Then use array.find() to find first word that includes the hashtag.
    const hashtag = text.split(' ').find(word => word.includes('#'));
    // We want to remove hashtag from first character of string.
    const company = hashtag.substring(1);
    // Get the first character and change to capital letter.
    const badgeLetter = company.substring(0, 1).toUpperCase();
    const upvoteCount = 0;
    const daysAgo = 0;

    // new feedback item HTML
    const feedbackItemHTML = `
        <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${upvoteCount}</span>
            </button>
        
            <section class="feedback__badge">
                <p class="feedback__letter">${badgeLetter}</p>
            </section>
            
            <div class="feedback__content">
                <p class="feedback__company">${company}</p>
                <p class="feedback__text">${text}</p>
            </div>
        
            <p class="feedback__date">${ daysAgo === 0 ? 'NEW' : `${daysAgo}d` }</p>
        </li>
    `;

    // insert new feedback item in list
    feedbackListEL.insertAdjacentHTML('beforeend', feedbackItemHTML);

    // clear textarea
    textareaEl.value = '';
    // blue submit button 
    submitBtnEl.blur();
    // reset counter
    counterEl.textContent = 150;
};

formEl.addEventListener('submit', submitHandler);