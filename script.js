// -- GLOBAL VARIABLES --

const MAX_CHARS = 150;
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api';

const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEL = document.querySelector('.feedbacks');
const submitBtnEl = document.querySelector('.submit-btn');
const spinnerEl = document.querySelector('.spinner');
const hashtagListEl = document.querySelector('.hashtags');


const renderFeedback = feedback => {
     // new feedback item HTML
     const feedbackItemHTML = `
     <li class="feedback">
         <button class="upvote">
             <i class="fa-solid fa-caret-up upvote__icon"></i>
             <span class="upvote__count">${feedback.upvoteCount}</span>
         </button>
     
         <section class="feedback__badge">
             <p class="feedback__letter">${feedback.badgeLetter}</p>
         </section>
         
         <div class="feedback__content">
             <p class="feedback__company">${feedback.company}</p>
             <p class="feedback__text">${feedback.text}</p>
         </div>
     
         <p class="feedback__date">${ feedback.daysAgo === 0 ? 'NEW' : `${feedback.daysAgo}d` }</p>
     </li>
 `;
 // insert new feedback item in list
 feedbackListEL.insertAdjacentHTML('beforeend', feedbackItemHTML);
};

        // --- COUNTER COMPONENT ---
(() => {
    const inputHandler = () => {
        // determine max number of characters.
        const maxNbrChars = MAX_CHARS;
        // number of characters that user has currently typed.
        const numCharTyped = textareaEl.value.length;
        // calculate number of characters left.
        const charsLeft = maxNbrChars - numCharTyped;
        // show number of characters left.
        counterEl.textContent = charsLeft;
    };  
    textareaEl.addEventListener('input', inputHandler);
    
    // -- FORM COMPONENT --
    
    // function to determine if form is valid or invalid and what information to display.
    const showVisualIndicator = textCheck => {
        // Ternary operator returns valid if text includes # and at least 5 chars. Invalid if not.
        const className = textCheck === 'valid' ? 'form--valid' : 'form--invalid';
    
        // adds indicator depending on rules.
     formEl.classList.add(className);
     // Outline will be rmoved in 2 seconds whether or not outline is green or red.
     setTimeout(() => {
         formEl.classList.remove(className);
         }, 2000)
    };
    })();


(() => {
        const submitHandler = event => {
            // prevent default form action to send form to action address and load page.
            event.preventDefault();
            // get text from textarea
            const text = textareaEl.value;
           
            //  validate text ( check if hashtage is present and check if text is long enought
            if (text.includes('#') && text.length >= 5) {
                showVisualIndicator('valid');
            } else {
                showVisualIndicator('invalid');
        
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
        
        
        
            // render feedback item in list. (Get Request);
            const feedback = {
                upvoteCount: upvoteCount,
                company: company,
                badgeLetter: badgeLetter,
                daysAgo: daysAgo,
                text: text
            }
            renderFeedback(feedback);
        
            // send feedback item to server (Post Request)
            fetch(`${BASE_API_URL}/feedbacks`, {
                method: 'POST',
                body: JSON.stringify(feedback),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                // this if statement is considered a guard clause
                if(!response.ok) {
                    console.log('something went wrong');
                    return;
                }
                
                console.log('Successfully submitted');
            })
            .catch(error => console.log(error) );
        
            // clear textarea
            textareaEl.value = '';
            // blue submit button 
            // reset counter
            submitBtnEl.blur();
            counterEl.textContent = MAX_CHARS;
        };
        
        formEl.addEventListener('submit', submitHandler);
    })();


// -- FEEDBACK LIST COMPONENT ---
(() => {
    // clickHandler must be written first before adding event listener. Arrow function not hoisted.
    const clickHandler = event => {
        // get target that was clicked.
        const clickedEl = event.target;
        
        // determine if user intended to upvote or expand
        const upvoteIntention = clickedEl.className.includes('upvote'); // gives either true or false

        if (upvoteIntention) {
            // get upvote button.
            const upvoteBtnEl = clickedEl.closest('.upvote');
            // disable upvote button if clicked.
            upvoteBtnEl.disabled = true;

            // select upvote__count element with upvote button
            // document.querySelector will find the first one in the document. 
            // We want to search for element in the button element so we use upvoteBtnEl instead of document.
            const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count');

            // get currently displayed upvote Count 
            // if content is a string, add + before upvoteCountEl to convert it to number.
            let upvoteCount = +upvoteCountEl.textContent;

            // set upvoteCount and increment by one. ++ should be typed first to increment first then diplay updated value 
            upvoteCountEl.textContent = ++upvoteCount;

            console.log(upvoteCount);

        } else {
            // expand clicked feedback item
            clickedEl.closest('.feedback').classList.toggle('feedback--expand');
        }
    };

    // adds event listender to feedbackListEL (ol tag)
    feedbackListEL.addEventListener('click', clickHandler);

    // fetch request uses AJAX and replaces XMLHTTP or XHR ojbect request object withotu doing full page refresh
    fetch(`${BASE_API_URL}/feedbacks`)
        .then(response => {
            // this waits for all the data of the response to be parsed in json format
            return response.json();
        })
        // this returns data in form of javascript object in manner we can work with
        .then(data => { 
            // remove spinner
            spinnerEl.remove();
            // forEach goes through each feedback in data.feedbacks and displays information in array.
            data.feedbacks.forEach((feedback) => { renderFeedback(feedback) });
        })
        .catch(error => {
            feedbackListEL.textContent = `Failed to fetch feedback items. Error message: ${error.message}`;
        });
})();




(() => {
    // -- HASHTAG LIST COMPONENT -- 
    const clickHandler = event => {
        // get element that was clicked
        const clickedEl = event.target;

        // stop function if click happend in list but outside the buttons.
        if (clickedEl.className === 'hashtags') return;

        // extract company name from button clicked.
        const companyNameFromHashtag = clickedEl.textContent.substring(1).toLowerCase().trim();

        // iterate over each feedback item in the list
        feedbackListEL.childNodes.forEach(childNode => {
            // stop this iteration if it is a text node
            if (childNode.nodeType === 3) return;
            //
            // extract company name from node
            const companyNameFromFeedbackItem = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();
            // remove feeback items if company names are not equal
            if (companyNameFromHashtag !== companyNameFromFeedbackItem) {
                childNode.remove();
            }
        });

    };
    // select hashtag element
    hashtagListEl.addEventListener('click', clickHandler);
})();

