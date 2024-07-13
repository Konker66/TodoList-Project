const input = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = '';

showTodos();

function getTodoHtml(todo, index) {
  if (filter && filter !== todo.status) {
    return '';
  }
  let checked = todo.status === "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}"><i class="fa fa-times"></i></button>
    </li>
  `; 
}

function showTodos() {
  if (todosJson.length === 0) {
    todosHtml.innerHTML = '';
    if (emptyImage) emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    if (emptyImage) emptyImage.style.display = 'none';
  }
}

function addTodo(todo) {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (todo && e.key === "Enter") {
    addTodo(todo);
  }
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (todo) {
    addTodo(todo);
  }
});

function updateStatus(event) {
  const todo = event.target;
  let todoName = todo.parentElement.lastElementChild;
  const index = parseInt(todo.id, 10);
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[index].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[index].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

function remove(event) {
  const index = parseInt(event.target.dataset.index, 10);
  todosJson.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

todosHtml.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    remove(e);
  } else if (e.target.type === "checkbox") {
    updateStatus(e);
  }
});

filters.forEach(el => {
  el.addEventListener("click", e => {
    filters.forEach(tag => tag.classList.remove('active'));
    el.classList.add('active');
    filter = e.target.dataset.filter || '';
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});
