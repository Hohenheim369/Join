
let tasks = {};
let tasksindex = 1;
let assignedindex = 1;
let subtasksindex = 1;

//for testing reasons my own database

let TEST_URL = `https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/tasks/${tasksindex}/`

function createTask(){ 
    addTaskTitle();
    addTaskDescription();
    addTaskDueDate();
    postTitle(``,{"title": `${tasks.Title}`,"description": `${tasks.Description}`,"date": `${tasks.Date}`,"priority": "TestUrgent","category": "TestUserStory1"})
    postAssignedTO(`assigned/${assignedindex}/`, {"name": "Testassigned1Name"})
    postSubtasks(`subtasks/${subtasksindex}/`, {"Title": "TestSubTitle1"})
}

async function postTitle(path="", title={}) {
    let response = await fetch (TEST_URL + path + ".json",{
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(title)
    });
    return responseToJson = await response.json();
}

async function postAssignedTO(path="", data={}) {
    let response = await fetch (TEST_URL + path + ".json",{
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

async function postSubtasks(path="", data1={}) {
    let response = await fetch (TEST_URL + path + ".json",{
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data1)
    });
    return responseToJson = await response.json();
}

function addTaskTitle(){
    let title = document.getElementById('title_input');
    tasks.Title = title.value;
    title.value = ""; 
}

function addTaskDescription(){
    let description = document.getElementById('description_textarea');
    tasks.Description = description.value;
    description.value = ""; 
}

function addTaskAssignedTo(){
    let assignedTo = document.getElementById('assigned_to');
    tasks.push(assignedTo.value)
    assignedTo.value = ""; 
}

function addTaskDueDate(){
    let dueDate = document.getElementById('due_date');
    tasks.Date = dueDate.value;    
    dueDate.value = "";
}

function addTaskPrio(){
    let prioUrgent = document.getElementById('urgent_span');
    let prioMedium = document.getElementById('medium_span');
    let prioLow = document.getElementById('low_span');
    tasks.push(prio.value)
    prio.value = ""; 
}

function addTaskCategory(){
    let category = document.getElementById('category_input');
    tasks.push(category.value)
    category.value = ""; 
}

function addTaskSubtasks(){
    let subtasks = document.getElementById('subtasks_input');
    tasks.push(subtasks.value)
    subtasks.value = ""; 
}

function dropDown(){

}