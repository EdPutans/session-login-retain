import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

type User = {
  email: string;
  name: string;
  password: string;
  id: number
}

type State = {
  currentUser: null | User;
  errorMessage: null | string;
}

const state: State = {
  currentUser: null,
  errorMessage: null,
}

function login(email: string, password: string) {
  fetch('http://localhost:4000/users')
    .then(r => r.json())
    .then((users: User[]) => {

      const foundUser = users.find(user =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
      )

      if (foundUser) {
        state.currentUser = foundUser;
        localStorage.id = foundUser.id;
      } else {
        // TODO: this needs fixing for failed login => correct login path :P
        state.errorMessage = 'No user found!'
      }

      render();
    })
}

function render() {
  app.textContent = "";

  if (state.currentUser) {
    const welcomeText = document.createElement('h1');
    welcomeText.textContent = `Welcome aboard, ${state.currentUser.name}`

    const buttonEl = document.createElement('button');
    buttonEl.textContent = "Log out"
    buttonEl.addEventListener('click', () => {
      state.currentUser = null;
      state.errorMessage = null;
      localStorage.clear();
      render();
    })
    app.append(welcomeText, buttonEl)
  } else {
    const formEl = document.createElement('form');
    const formTitle = document.createElement('h3');
    formTitle.textContent = 'Please log in to see a message!'

    const emailInput = document.createElement('input')
    emailInput.placeholder = 'Email'
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Pw'

    const buttonEl = document.createElement('button');
    buttonEl.type = 'submit'
    buttonEl.textContent = "Log in"

    formEl.addEventListener('submit', (event) => {
      event.preventDefault()

      const email = emailInput.value;
      const password = passwordInput.value;

      login(email, password)
    })

    formEl.append(formTitle, emailInput, passwordInput, buttonEl);
    app.append(formEl)
  }
  if (state.errorMessage) {
    const errorSpan = document.createElement('span');
    errorSpan.textContent = state.errorMessage;

    app.append(errorSpan)
    state.errorMessage = null
  }

}


function checkIfUserIsStoredLocallyAndLogInIfTheyDo() {
  // 1. check for user in localstorage
  const userId = localStorage.id;

  // 2. if the user is there => use it to login
  if (userId) {
    fetch(`http://localhost:4000/users/${userId}`)
      .then(r => r.json())
      .then(user => {
        state.currentUser = user
        render()
      })
  } else {
    // 3. if not => show message to relogin - feel free to add one
  }
}

checkIfUserIsStoredLocallyAndLogInIfTheyDo();
render(); 