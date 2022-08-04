import {Question} from './question'
import { createModal, isValid, closeModal } from './utils'
import { authWithEmailAndPassword, getAuthForm, getSignUpForm } from './authr'
import './styles.css'

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAHrB87gVSlei7ixUSF-rz3QZhDgsQxEX0",
  authDomain: "podcast-humam.firebaseapp.com",
  databaseURL: "https://podcast-humam-default-rtdb.firebaseio.com",
  projectId: "podcast-humam",
  storageBucket: "podcast-humam.appspot.com",
  messagingSenderId: "665615917801",
  appId: "1:665615917801:web:0bfacbd5dd0909cc814678"
})

const auth = firebase.auth();
const fs = firebase.firestore();


const form = document.getElementById('form')
const signIn = document.getElementById('signin')
const signUp = document.getElementById('signup')
const signOut = document.getElementById('signout')
const input = document.getElementById('question-input')
const submitBtn = document.getElementById('submit-btn')
const allBtn = document.getElementById('all-btn')
const signedIn = document.querySelectorAll('.signedin')
const signedOut = document.querySelectorAll('.signedout')

window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler)
allBtn.addEventListener('click', renderModalAfterAuth)
signIn.addEventListener('click', openModal)
signUp.addEventListener('click', openSignUp)
signOut.addEventListener('click', logOut)

const signinCheck = (user) => {
  if (user) {
    signedIn.forEach((button) => {button.style.display = "inline"})
    signedOut.forEach((button) => {button.style.display = "none"})
  } else {
    signedIn.forEach((button) => {button.style.display = "none"})
    signedOut.forEach((button) => {button.style.display = "inline"})
  }
}

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

function openSignUp () {
  createModal('Sign Up', getSignUpForm())
  const signUpForm = document.getElementById('signup-form')
  signUpForm.addEventListener('submit', e => {
    e.preventDefault()

    const email = e.target.querySelector('#signup-email').value
    const password = e.target.querySelector('#signup-password').value
    const btn = e.target.querySelector('button')
    btn.disabeled = true

    auth 
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // clear the form
        signUpForm.reset()

        closeModal()
      });

    })
}

function logOut (e) {
  e.preventDefault()

  auth
    .signOut()
    .then(() => {
      
    })
}

function authFormHandler (e) {
  e.preventDefault()

  const email = e.target.querySelector('#email').value
  const btn = e.target.querySelector('button')
  const password = e.target.querySelector('#password').value

  btn.disabeled = true

  auth
    .signInWithEmailAndPassword(email, password)
    .then(authWithEmailAndPassword(email, password)
    .then(token => {
      return Question.fetch(token)
    })
    .then(renderModalAfterAuth) 
    .then(() => btn.disabeled = false)
    .then(closeModal())
    )
}

function renderModalAfterAuth (content) {
  if (typeof content === 'string') {
    createModal('Error!', content)
  } else {
    createModal('Questions', Question.toListToHtml(content))
  }
  console.log(content);
}


auth.onAuthStateChanged(user => {
  if (user) {
    signinCheck (user)
    console.log('signedIn');
  } else {
    signinCheck (user)
    console.log('signed out');
  }
})