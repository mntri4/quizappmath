const STATES = {
    START: 'start',
    QUESTION: 'question',
    CORRECT: 'correct',
    INCORRECT: 'incorrect',
    END: 'end'
}

//Declare Variables
let currentState, numCorrect, numIncorrect, currentQuestionIndex

// set start state
function loadStart() {
    // set state 
    currentState = STATES.START

    // reset counters
    numCorrect = 0
    numIncorrect = 0
    currentQuestionIndex = 0

    // set id on main element to state
    $('main').attr('id', currentState);

    // update inner HTML in <main>
    $('main').html(`
    <article class="panel">
        <section class="inner">
            <h1><span class='me'>Test Your Math Skills</span> <spanclass='you'>Math Quiz</span></h1>
            <button class='nxt'>Let's Go!</button>
        </section>
    </article>`)
    console.log('first part is working');
} 

function loadNextQuestion() {
    currentState = STATES.QUESTION
    $('main').attr('id', currentState);
    // $('form').removeClass();
    $('button').html(`Submit`);

    let questionsHTML = createQuestionsHTML();
    
    // update inner HTML in <main>
    $('main').html(`
    <article class="panel">
        <section class="inner">
            <h1>${currentQuestionIndex + 1}. ${QUESTIONS[currentQuestionIndex].question}</h1>
            <form id="quiz">
                ${questionsHTML}
                <button type="Submit" class='another'>Submit</button>
                <div id='incorrect'></div>
            </form>
        </section>
        <footer>${currentQuestionIndex + 1} of 7</footer>
    </article>`)
    updateCorrectIncorrect()
    console.log('second part is working');
}

function loadEnd(){
    currentState = STATES.END
    $('main').attr('id', currentState);
    $('button').html(`Re-take!`);

    let message = 
        numCorrect / QUESTIONS.length >= 0.7
            ? 'Nice Job'
            : 'Better Next Time!'

    //update inner html
    $('main').html(`
    <article class="panel">
        <section class="inner">
            <p>YOU GOT<br /><span class="large">${numCorrect} / ${QUESTIONS.length}</span></p>
            <p>${message}</p>
            <button>RE-TAKE</button>
        </section>
    </article>`)

    //remove counter from incorrect and correct
    $('footer.footer').remove();
}

function createQuestionsHTML(){
    return QUESTIONS[currentQuestionIndex].answers
        .map((question, index) =>{
            return `
                <div class='answer'>
                        <input type='radio' name='answer' value='${index}' id='option${index}' class='' />
                        <label for='option${index}'>${question.text}</label>
               
               </div> `
        })
        .join('\n')
}

//checkAnswersValid 
function checkAnswerValid() {
    let answerIndex = $('input[name=answer]:checked').val()
    let answerNotSelected = !answerIndex

    if (answerNotSelected) {
        alert('You must select an option.')
    } else {
        let answer =
            QUESTIONS[currentQuestionIndex].answers[
                Number($('input[name=answer]:checked').val())
            ]

        updateForm({ answer, answerIndex })

        // increment correct / incorrect count
        answer.correct ? numCorrect++ : numIncorrect++
        updateCorrectIncorrect()
    }
}

//updateForm
// updates the question form with validation messages / classes
function updateForm({ answer, answerIndex }) {
    currentState = answer.correct ? STATES.CORRECT : STATES.INCORRECT
    // add correct/incorrect (stat) class to the form
    $('form').addClass(currentState)
    // disable all radios
    $('input[type=radio]').prop('disabled', true)

    if (answer.correct) {
        // add class, success message, and icon to correct answer
        $('.answer')
            .eq(answerIndex)
            .addClass('correct')
            .append(
                `<p class='right'>You're on a roll! Nice job!</p>`
            )
    } else {
        let correctAnswerIndex = QUESTIONS[currentQuestionIndex].answers.findIndex(
            answer => answer.correct
        )
        // add class, error, and icon to incorrect answer
        $('.answer')
            
            .eq(answerIndex)
            .addClass('incorrect')
            .append(
                `<p class='wrong'>Sorry, that's wrong, correct answer was ${QUESTIONS[currentQuestionIndex].answers[correctAnswerIndex].text}`
            )

        // add class to correct answer
        $('.answer')
            .eq(correctAnswerIndex)
            .addClass('correct')
    }

    // update button text
    $('button').html(`Next`)
}

//updateCorrectIncorrect
function updateCorrectIncorrect(){
    if($('footer.footer').length){
        $('footer.footer').html(`${numCorrect} correct / ${numIncorrect} incorrect`)
    } else {
        $('body').append(
            `<footer class='footer'>${numCorrect} correct ${numIncorrect} incorrect</footer>`
        )
    }
}

// listen for button clicks
// behavior changes based on the current state
function loadButtonListener() {
    $('main').on('click', 'button', function(event) {
        event.preventDefault()

        switch (currentState) {
            case STATES.START:
                loadNextQuestion()
                break
            case STATES.QUESTION:
                checkAnswerValid()
                break
            case STATES.CORRECT:
            case STATES.INCORRECT:
                currentQuestionIndex++
                currentQuestionIndex >= QUESTIONS.length
                    ? loadEnd()
                    : loadNextQuestion()
                break
            case STATES.END:
                loadStart()
                break
        }
    })
}

$(function pageLoad(){
    loadButtonListener()
    loadStart()
})
