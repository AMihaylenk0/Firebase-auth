// add admin cloud function
// админка firebase с использованием firebase functions
const adminForm = document.querySelector('.admin-actions')
adminForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const adminEmail = document.querySelector('#admin-email').value
    /* В качестве аргумента в httpsCallable записывается экспортируемая функция из ../functions/index.js(второй index.js)  */
    const addAdminRole = functions.httpsCallable('addAdminRole')
    addAdminRole({email: adminEmail}).then(result=> {
        alert(`${adminEmail} + is an admin`)
    })
})

// Выводит разный контент, в зависимости от залогиненности 
// listen for auth status changes
// onAuthStateChanged запускается сама, когда статус залогинен/разлогинен меняется
auth.onAuthStateChanged(user => {
   if (user) {           /* Если юзер залогинен, то выводит данные из базы */
    user.getIdTokenResult().then(idTokenResult =>{/* проверка пользователя на админку для доступа к созданию guides */
        user.admin = idTokenResult.claims.admin
        setupUI(user)
    })
    db.collection('guides').onSnapshot(snapshot => {
        setupGuides (snapshot.docs)
    })
   } else {    /* выводит пустой массив */
    setupUI() /* отсутствие параметра выводит else значение, записанное в функции в файле index.js  */
    setupGuides([])  
    }
})

// create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('guides').add({
    title: createForm.title.value,
    content: createForm.content.value
  }).then(() => {
    // close the create modal & reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err => {
    console.log(err.message);
  });
});

// signup
const signupForm = document.querySelector('#signup-form')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get user info
    const email = signupForm['signup-email'].value
    const password = signupForm['signup-password'].value

    // sign up the user. Переменная auth берется из первого скрипта в html 
    auth.createUserWithEmailAndPassword(email, password).then(cred=>{
    // При регистрации в третьем поле инпута создается новая коллекция, которая связана с юзером по uid
        return db.collection('users').doc(cred.user.uid).set({
            bio: signupForm['signup-bio'].value
        })
    // close the signup modal & reset form
    }).then(()=> {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        signupForm.querySelector('.error').innerHTML = ''
    }).catch(err=>{
        signupForm.querySelector('.error').innerHTML = err.message
    })
})

// Logout
const logout = document.querySelector('#logout')
logout.addEventListener('click', (e) => {
    e.preventDefault()
    auth.signOut()  /* signOut - метод firebase */
})

// Login 
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', (e)=> {
    e.preventDefault()

    // get user info
    const email = loginForm['login-email'].value
    const password = loginForm['login-password'].value
    
    auth.signInWithEmailAndPassword(email, password).then(()=>{
        // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    loginForm.querySelector('.error').innerHTML = ''
    }).catch(err=>{
        loginForm.querySelector('.error').innerHTML = err.message
    })
})