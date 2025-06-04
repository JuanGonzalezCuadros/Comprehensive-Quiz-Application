const apiUrl = 'https://opentdb.com/api.php?amount=5&type=multiple';
let questions = [];
let currentIndex = 0;
let userAnswers = [];

const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');

async function loadQuestions() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    questions = data.results.map(q => {
      const options = [...q.incorrect_answers, q.correct_answer].sort();
      return { question: q.question, options, correct: q.correct_answer };
    });
    displayQuestion();
  } catch (error) {
    quizContainer.innerHTML = '<p>Error. The questions could not be loaded.</p>';
  }
}

function displayQuestion() {
  const q = questions[currentIndex];
  quizContainer.innerHTML = `
    <div class="question">${decodeHTML(q.question)}</div>
    <div class="options">
      ${q.options.map((opt, i) => `
        <label>
          <input type="radio" name="answer" value="${opt}" ${userAnswers[currentIndex] === opt ? 'checked' : ''} />
          ${decodeHTML(opt)}
        </label>
      `).join('')}
    </div>
  `;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === questions.length - 1;
}

function handleNavigation(offset) {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    alert('Please select an option');
    return;
  }
  userAnswers[currentIndex] = selected.value;
  currentIndex += offset;
  displayQuestion();
}

function handleSubmit() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    alert('You must select an option before submitting.');
    return;
  }
  userAnswers[currentIndex] = selected.value;

  let correctCount = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.correct) correctCount++;
  });

  const incorrect = questions.length - correctCount;
  const percent = ((correctCount / questions.length) * 100).toFixed(2);

  quizContainer.innerHTML = '';
  resultContainer.innerHTML = `
    <p><strong>Score:</strong> ${correctCount}/${questions.length}</p>
    <p><strong>Correct:</strong> ${correctCount}</p>
    <p><strong>Incorrect:</strong> ${incorrect}</p>
    <p><strong>Percentage:</strong> ${percent}%</p>
  `;

  prevBtn.disabled = true;
  nextBtn.disabled = true;
  submitBtn.disabled = true;
}

function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

//Event Listeners
prevBtn.addEventListener('click', () => handleNavigation(-1));
nextBtn.addEventListener('click', () => handleNavigation(1));
submitBtn.addEventListener('click', handleSubmit);

loadQuestions();
