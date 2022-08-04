export function getAuthForm () {
  return `
    <form class="mui-form" id="auth-form">
      <div class="mui-textfield mui-textfield--float-label">
        <input type="email" id="email">
        <label for="email">Email</label>
      </div> 
      <div class="mui-textfield mui-textfield--float-label">
        <input type="password" id="password">
        <label for="password">Password</label>
      </div>
      <button type="submit" class="mui-btn mui-btn--raised mui-btn--primary">Sign In</button>
    </form> `
}

export function getSignUpForm () {
  return `
    <form class="mui-form" id="signup-form">
      <div class="mui-textfield mui-textfield--float-label">
        <input type="email" id="signup-email">
        <label for="email">Email</label>
      </div> 
      <div class="mui-textfield mui-textfield--float-label">
        <input type="password" id="signup-password">
        <label for="password">Password</label>
      </div>
      <button type="submit" class="mui-btn mui-btn--raised mui-btn--primary">Sign Up</button>
    </form> `
}

export function authWithEmailAndPassword (email, password) {
  const apiKey = 'AIzaSyAHrB87gVSlei7ixUSF-rz3QZhDgsQxEX0'

  return fetch (`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: 'POST',
    body: JSON.stringify({
      email, password,
      returnSecureToken: true
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => data.idToken)
}