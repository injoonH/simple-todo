const todoForm = document.querySelector("header > form");
const todoInput = todoForm.querySelector("input");
const pending = document.querySelector(".pending > ul");
const finished = document.querySelector(".finished > ul");
const pendingContainer = document.querySelector(".pending");
const finishedContainer = document.querySelector(".finished");
const toggle = document.querySelector(".toggle");
const togglePending = document.querySelector(".toggle__pending");
const toggleFinished = document.querySelector(".toggle__finished");

document.addEventListener("DOMContentLoaded", () => {
    handleResize();
    for (const [key, val] of Object.entries(getFromLocal("pending")))
        addToHTML("pending", { id: key, content: val });
    for (const [key, val] of Object.entries(getFromLocal("finished")))
        addToHTML("finished", { id: key, content: val });
});

window.addEventListener("resize", handleResize);

togglePending.addEventListener("click", () => {
    pendingContainer.classList.remove("invisible");
    finishedContainer.classList.add("invisible");
    togglePending.classList.add("toggle__focused");
    toggleFinished.classList.remove("toggle__focused");
});

toggleFinished.addEventListener("click", () => {
    pendingContainer.classList.add("invisible");
    finishedContainer.classList.remove("invisible");
    togglePending.classList.remove("toggle__focused");
    toggleFinished.classList.add("toggle__focused");
});

todoForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    if (todoInput.value === "") return;
    const todo = { id: makeID(), content: todoInput.value };
    saveLocal("pending", todo);
    addToHTML("pending", todo);
    todoInput.value = "";
});

function makeID() {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth().toString().padStart(2, "0");
    const date = time.getDate().toString().padStart(2, "0");
    const hour = time.getHours().toString().padStart(2, "0");
    const minute = time.getMinutes().toString().padStart(2, "0");
    const second = time.getSeconds().toString().padStart(2, "0");
    const millisecond = time.getMilliseconds().toString().padStart(3, "0");
    return `${year}${month}${date}${hour}${minute}${second}${millisecond}`;
}

function handleResize() {
    if (window.innerWidth < 700) {
        toggle.classList.remove("invisible");
        if (togglePending.classList.contains("toggle__focused"))
            finishedContainer.classList.add("invisible");
        else if (toggleFinished.classList.contains("toggle__focused"))
            pendingContainer.classList.add("invisible");
    } else {
        toggle.classList.add("invisible");
        pendingContainer.classList.remove("invisible");
        finishedContainer.classList.remove("invisible");
    }
}

function saveLocal(type, todo) {
    const container = getFromLocal(type);
    container[todo.id] = todo.content;
    localStorage.setItem(type, JSON.stringify(container));
}

function removeLocal(type, id) {
    const container = getFromLocal(type);
    delete container[id];
    localStorage.setItem(type, JSON.stringify(container));
}

function getFromLocal(type) {
    return localStorage.getItem(type) === null
        ? {}
        : JSON.parse(localStorage.getItem(type));
}

function addToHTML(type, todo) {
    const li = document.createElement("li");
    li.id = todo.id;

    const p = document.createElement("p");
    p.innerText = todo.content;
    li.appendChild(p);

    if (type === "pending") {
        const checkBtn = document.createElement("button");
        checkBtn.classList.add("check-btn");
        checkBtn.innerHTML = `<i class="fas fa-check"></i>`;
        checkBtn.addEventListener("click", shiftTodo);
        li.appendChild(checkBtn);
    } else if (type === "finished") {
        const callbackBtn = document.createElement("button");
        callbackBtn.classList.add("check-btn");
        callbackBtn.innerHTML = `<i class="fas fa-undo-alt"></i>`;
        callbackBtn.addEventListener("click", shiftTodo);
        li.appendChild(callbackBtn);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<i class="fas fa-minus"></i>`;
    deleteBtn.addEventListener("click", deleteBtnEvent);
    li.appendChild(deleteBtn);

    if (type === "pending") pending.appendChild(li);
    else if (type === "finished") finished.appendChild(li);
}

function shiftTodo(evt) {
    const todo = evt.target.parentElement;
    const type = todo.parentElement.parentElement.classList[0];
    const obj = { id: todo.id, content: todo.innerText };
    if (type === "pending") {
        removeLocal("pending", todo.id);
        saveLocal("finished", obj);
        addToHTML("finished", obj);
    } else if (type === "finished") {
        removeLocal("finished", todo.id);
        saveLocal("pending", obj);
        addToHTML("pending", obj);
    }
    todo.remove();
}

function deleteBtnEvent(evt) {
    const todo = evt.target.parentElement;
    const type = todo.parentElement.parentElement.classList[0];
    removeLocal(type, todo.id);
    todo.remove();
}
