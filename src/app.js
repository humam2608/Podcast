import {Question} from './question'
import { createModal, isValid } from './utils'
import { authWithEmailAndPassword, getAuthForm } from './authr'
import './styles.css'

const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = document.getElementById('question-input')
const submitBtn = document.getElementById('submit-btn')

window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler)
modalBtn.addEventListener('click', openModal)



function submitFormHandler (e) {
  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON()
    }

    submitBtn.disabeled = true
    // Async request to server to save question
    Question.create(question).then(() => {
      input.value = ''
      input.className = ''
      submitBtn.disabeled = false  
    })
  }

  e.preventDefault()
}

function openModal () {
  createModal('Sign In', getAuthForm())
  document
    .getElementById('auth-form')
    .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler (e) {
  e.preventDefault()

  const email = e.target.querySelector('#email').value
  const btn = e.target.querySelector('button')
  const password = e.target.querySelector('#password').value

  btn.disabeled = true
  authWithEmailAndPassword(email, password)
    .then(token => {
      return Question.fetch(token)
    })
    .then(renderModalAfterAuth) 
    .then(() => btn.disabeled = false)
    

}

function renderModalAfterAuth (content) {
  if (typeof content === 'string') {
    createModal('Error!', content)
  } else {
    createModal('Questions', Question.toListToHtml(content))
  }
}