//for testing reasons my own database

let TEST_URL = "https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/"

//changes to onclick create task function later on 
function testload(){ 
    postTitle("tasks/1/", {"Title": "TestTitle2","description": "TestDescription1","date": "06/09/2024","priority": "TestUrgent","category": "TestUserStory1"})
    postAssignedTO("tasks/1/assigned/1/", {"name": "Testassigned1Name"})
    postSubtasks("tasks/1/subtasks/1/", {"Title": "TestSubTitle1"})
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

function dropDown(){

}