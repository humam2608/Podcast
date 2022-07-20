export class Question {
  static create (question) {
    return fetch('https://podcast-humam-default-rtdb.firebaseio.com/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
        contentType: 'application/json'
      }
    })
      .then(response => response.json())
      .then(response => {
        question.id = response.name
        return question
      })
      .then(addToLocalStorage)
      .then(Question.renderList)
  }

  static fetch (token) {
    if (!token) {
      return Promise.resolve('<p class="error">Something went wrong!</p>')
    }
    return fetch(`https://podcast-humam-default-rtdb.firebaseio.com/questions.json?auth=${token}`)
      .then(response => response.json())
      .then(response => {
        if (response && response.error) {
          return `<p class="error">${response.error}</p>`
        }

        return response ? Object.keys(response).map(key => ({
          ...response[key],
          id: key
        })) : []
      })
  }

  static renderList() {
    const questions = getQuestionsFromLS()

    const html = questions.length
      ? questions.map(toCard).join('')
      : `<div class="mui--text-headline">There are no questions yet</div>`

    const list = document.getElementById('list')

    list.innerHTML = html
  }

  static toListToHtml (questions) {
    return questions.length
      ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
      : '<p>There is no questions yet</p>'
  }
}


function addToLocalStorage (question) {
  const allQuestions = getQuestionsFromLS()
  allQuestions.push(question)
  localStorage.setItem('questions', JSON.stringify(allQuestions))
}

function getQuestionsFromLS () {
  return JSON.parse(localStorage.getItem('questions') || '[]')
}

function toCard (question) {
  return `
    <div class="mui--text-black-54">
      ${new Date(question.date).toLocaleDateString()}
      ${new Date(question.date).toLocaleTimeString()}
    </div>
    <div>
      ${question.text}
    </div>
    <br>
  `
}