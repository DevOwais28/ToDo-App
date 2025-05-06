import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { auth, db } from './firebase.js';

let userId;

// Login Page
if (window.location.pathname.includes('login')) {
    let login_email = document.getElementById('login-email');
    let login_password = document.getElementById('login-password');
    let login_btn = document.getElementById('login-btn');
    let errorBox = document.getElementById('error-box');
   

    login_btn.addEventListener('click', () => {
        let email = login_email.value;
        let password = login_password.value;
    
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                window.location.assign('/T0-Do App/index.html');
            })
            .catch((error) => {
                errorBox.textContent = error.message;
                errorBox.style.display = 'block';
            });
    });
    
    login_email.addEventListener('input', () => errorBox.style.display = 'none');
    login_password.addEventListener('input', () => errorBox.style.display = 'none');
    
}

// Signup Page
if (window.location.pathname.includes('Signup')) {
    let signup_email = document.getElementById('signup-email');
    let signup_password = document.getElementById('signup-password');
    let signup_btn = document.getElementById('signup-btn');
    let errorBox = document.getElementById('error-box');
    signup_btn.addEventListener('click', () => {
        const email = signup_email.value;
        const password = signup_password.value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                window.location.assign('/T0-Do App/index.html');
            })
            .catch((error) => {
                errorBox.textContent = error.message;
                errorBox.style.display = 'block';
            });
    });
    signup_email.addEventListener('input', () => errorBox.style.display = 'none');
    signup_password.addEventListener('input', () => errorBox.style.display = 'none');
    
}

// Index (Todo) Page
if (window.location.pathname.includes('index')) {
    let logout_btn = document.getElementById('logout-btn');
    let inputEl = document.getElementById('input');
    let listEl = document.getElementById('list');
    let buttons = document.getElementsByClassName('buttons');
    const todos = [];

    onAuthStateChanged(auth, (user) => {
        if (user) {
            userId = user.uid;

            const q = query(collection(db, "Todo"), where("userID", "==", userId));
            onSnapshot(q, (querySnapshot) => {
                todos.length = 0;
                listEl.innerHTML = '';
                querySnapshot.forEach((doc) => {
                    todos.push({ ...doc.data(), id: doc.id });
                });

                todos.forEach((todo) => {
                    additem(todo.todo, todo.id);
                });
            });
        } else {
            window.location.assign('/T0-Do App/login.html');
        }
    });

    // Add todo
   
        buttons[0].children[0].addEventListener('click', () => {
            const todoText = inputEl.value.trim();
            if (todoText !== '') {
                addDoc(collection(db, "Todo"), {
                    id: Date.now(),
                    todo: todoText,
                    userID: userId
                });
            }
            })
   

        // Delete all todos
        buttons[0].children[1].addEventListener('click', () => {
            listEl.innerHTML = '';
            todos.forEach(element => {
                deleteDoc(doc(db, "Todo", element.id));
            });
        });
 
    function additem(value, id) {
        if (value !== '') {
            const img = document.createElement("img");
            const element = document.createElement('div');
            const rightside = document.createElement('div');
            const leftside = document.createElement('div');
            const buttondel = document.createElement('button');
            const buttonUpd = document.createElement('button');
            const text = document.createTextNode(value);

            element.setAttribute('id', id);
            styleEl(element);

            buttondel.textContent = 'Delete';
            buttonUpd.textContent = 'Update';

            buttondel.className = 'btn btn-secondary btn-sm';
            buttonUpd.className = 'btn btn-secondary btn-sm';

            buttondel.addEventListener('click', () => deleteitem(id));
            buttonUpd.addEventListener('click', () => updateitem(id));

            img.src = "To-Do App/img/to-do-list.png";
            img.alt = "Sample Image";
            img.style.width = "clamp(7%,8%,11%)";

            leftside.style.display = 'flex';
            leftside.style.gap = '5px';
            leftside.style.alignItems = 'center';
            rightside.style.display = 'flex';
            rightside.style.gap = '5px';

            leftside.appendChild(img);
            leftside.appendChild(text);
            rightside.appendChild(buttondel);
            rightside.appendChild(buttonUpd);
            element.appendChild(leftside);
            element.appendChild(rightside);
            listEl.appendChild(element);
        }
        inputEl.value = '';
    }

    function styleEl(element) {
        element.style.width = '100%';
        element.style.height = '5vh';
        element.style.marginTop = '2%';
        element.style.display = 'flex';
        element.style.padding = '2%';
        element.style.justifyContent = 'space-between';
        element.style.alignItems = 'center';
    }

    function deleteitem(id) {
        const target = document.getElementById(id);
        target.remove();
        deleteDoc(doc(db, "Todo", id));
    }

    let btn1 = '';
    let btn2 = '';

    function updateitem(id) {
        const target = document.getElementById(id);
        const text = target.children[0].innerText;

        inputEl.value = text;
        inputEl.focus();

        btn1 = buttons[0].children[0];
        btn2 = buttons[0].children[1];

        target.children[1].children[0].disabled = true;
        target.children[1].children[1].disabled = true;

        buttons[0].children[0].remove();
        buttons[0].children[0].remove();

        const updfinalbtn = document.createElement('button');
        updfinalbtn.textContent = 'Update Done';
        updfinalbtn.className = 'btn btn-secondary btn-sm';

        updfinalbtn.addEventListener('click', () => updateDone(id));
        buttons[0].appendChild(updfinalbtn);
    }

    function updateDone(id) {
        const updatedTodo = inputEl.value.trim();
        if (updatedTodo !== '') {
            updateDoc(doc(db, "Todo", id), 
            { todo: updatedTodo });

            const target = document.getElementById(id);
            const img = document.createElement("img");
            img.src = "/T0-Do App/img/to-do-list.png";
            img.style.width = "clamp(7%,8%,11%)";

            target.children[1].children[0].disabled = false;
            target.children[1].children[1].disabled = false;

            const text = document.createTextNode(updatedTodo);
            target.children[0].textContent = '';
            target.children[0].appendChild(img);
            target.children[0].appendChild(text);

            buttons[0].children[0].remove();
            buttons[0].appendChild(btn1);
            buttons[0].appendChild(btn2);
            inputEl.value = '';
        }
    }

    logout_btn.addEventListener('click', () => {
        signOut(auth).then(() => {
            console.log('User logged out');
            window.location.assign('/T0-Do App/login.html');
        }).catch((error) => {
            console.error(error);
        });
    });


// Global auth redirect guard (after DOM has loaded)
onAuthStateChanged(auth, (user) => {
    if (!user && !window.location.pathname.includes('login') && !window.location.pathname.includes('Signup')) {
        window.location.assign('/T0-Do App/login.html');
    }
});

}
