'use strict'

function findTaskById(id) {
    let task = null;
    for (let i = 0; i < tasksNew.length; i++) {
        if (tasksNew[i].id === id) {
            task = tasksNew[i];
        }
    }
    return task;
}

const createTask = (task) => {
    return `
        <div class="card row bg-info m-1 p-2" id="task-${task.id}">
          <div class="card-body">
            <div class="row justify-content-around">
                <div class="col-6">
                    <p>${task.task}</p>
                </div>
                <div class="col-1">
                    <a id="task-remove-${task.id}" href="#" class="removeTask btn btn-warning">X</a>
                </div>
            </div>
            <a id="task-btn-${task.id}" href="#" class="btn btn-warning">${task.buttonText}</a>
          </div>
        </div>
    `;
}

function addHandlerToStatus(task) {
    document.getElementById(`task-btn-` + task.id).addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        let t = findTaskById(task.id);
        if (t.status == 'new') {
            t.status = 'open';
            t.buttonText = 'Done >';
        } else if (t.status == 'open') {
            t.status = 'closed';
            t.buttonText = 'Delete';
        }
        localStorage.setItem('tasksNew', JSON.stringify(tasksNew));
        window.location.reload();
    })
}

function deleteTask(task) {
    return (e) => {
        e.stopPropagation();
        e.preventDefault();
        let t = findTaskById(task.id);
        let indexToRemove = null;
        for (let i = 0; i < tasksNew.length; i++) {
            if (tasksNew[i].id == task.id) {
                indexToRemove = i;
            }
        }
        tasksNew.splice(indexToRemove, 1);
        localStorage.setItem('tasksNew', JSON.stringify(tasksNew));
        window.location.reload();
    };
}

function addHandlerToDelete(task) {
    document.getElementById(`task-remove-` + task.id).addEventListener('click', deleteTask(task));
}

function addTaskToPage(task) {
    let div = document.createElement('div');
    div.innerHTML = createTask(task);
    if (task.status == 'new') {
        document.getElementById('tasks-new').append(div);
    } else if (task.status == 'open') {
        document.getElementById('tasks-open').append(div);
    } else if (task.status == 'closed') {
        document.getElementById('tasks-closed').append(div);
        document.getElementById(`task-btn-` + task.id).addEventListener('click', deleteTask(task));
    }
    addHandlerToStatus(task);
    addHandlerToDelete(task);
}

const addTask = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let form = e.target;
    const formData = new FormData(form);
    let data = Object.fromEntries(formData);
    const id = tasksNew.length + 1;
    const task = {
        id: id,
        task: data['task'],
        status: 'new',
        buttonText: 'In Progress >'
    }
    tasksNew.push(task);
    addTaskToPage(task);
    localStorage.setItem('tasksNew', JSON.stringify(tasksNew));
}

function initTasks() {
    for (let i = 0; i < tasksNew.length; i++) {
        addTaskToPage(tasksNew[i]);
    }
}



$("#add-task").on('submit', addTask);
let tasksNew = JSON.parse(localStorage.getItem('tasksNew'));
if (tasksNew == null) {
    tasksNew = [];
}
initTasks();

