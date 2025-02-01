import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-1d586-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

// Initalize firebase database
const app = initializeApp(appSettings)
const database = getDatabase(app)
const listInDB = ref(database, 'todoList')


const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const listEl = document.getElementById("todo-list")


function clearListElement() {
    listEl.innerHTML = ""
}

function clearInputField() {
    inputFieldEl.value = ""
}

function addToListElement(item) {
    let id = item[0]
    let value = item[1]
    let newEl = document.createElement("li")
    newEl.textContent = value
    newEl.addEventListener("dblclick", function(){
        let exactLocInDB = ref(database, `todoList/${id}`)
        console.log('exactLocInDB',exactLocInDB)
        remove(exactLocInDB)
    })

    listEl.append(newEl)
}

function addUserInput() {
    let inputValue = inputFieldEl.value
    if (inputValue) {
        push(listInDB, inputValue)
        clearInputField()
    }
    
}

// add event listener to the "add" button
addButtonEl.addEventListener("click", function() {
    addUserInput()
})

// add global event listener --> when user press enter, add user input
window.addEventListener("keydown", function(e) {
    if (e.key === 'Enter') {
        addUserInput()
    }
})


// on change --> update app
onValue(listInDB, function(snapshot) {
    // if there is item in the db
    if (snapshot.exists()) {
        console.log('snapshot', snapshot)
        // convert db snapshot dictionary to arrays [[key,value]]
        let arr = Object.entries(snapshot.val())
        clearListElement()

        // for each item in the snapshot, add as li element
        for (let i = 0; i < arr.length; i++) {
            let curItem = arr[i]
            addToListElement(curItem)
        }
    } else {
        listEl.innerHTML = `<p id="done-msg">Yay! All done!! 🐥</p>`
    }
})