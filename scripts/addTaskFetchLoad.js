/**
 * This function loads the Add Task Template content
 * 
 * @param {string} domLocation This variable is the id where to load the template
 * @param {boolean} clear This variable is a state of true or false
 */
async function initTemplateAddTask(domLocation, clear) {
    const response = await fetch("../assets/templates/taskTemplate.html");
    const data = await response.text();
    document.getElementById(domLocation).innerHTML = data;
    getContacts();
    if (clear) {
      clearButton();
    }
  }

  async function createTask() {
    const taskData = getTaskFormData();
    const taskId = await getNewId("tasks");
  
    saveTaskData(taskData, taskId);
    await handleTaskCreationCompletion(taskId);
  }

  function saveTaskData(taskData, taskId) {
    putTasksContent(
      taskData.title,
      taskData.description,
      taskData.dueDate,
      taskId,
      taskData.assignedTo,
      taskData.categorySeleced
    );
    putTaskToUser(taskId);
  }

  async function putTaskToUser(taskId) {
    if (!activeUser.tasks.includes(taskId)) {
      activeUser.tasks.push(taskId);
      localStorage.setItem("activeUser", JSON.stringify(activeUser));
      try {
        await updateUserTaskInDatabase(activeUser.id, taskId);
      } catch (error) {
        console.error("Fehler beim Hinzufügen des Tasks:", error);
        activeUser.tasks.pop();
        localStorage.setItem("activeUser", JSON.stringify(activeUser));
      }
    }
  }
  
  async function updateUserTaskInDatabase(userId, taskId) {
    if (userId != 0) {
      const path = `users/${userId - 1}/tasks/${activeUser.tasks.length - 1}`;
      return postData(path, taskId);
    }
  }

  function putTasksContent(
    title,
    description,
    dueDate,
    taskId,
    assignedTo,
    categorySeleced
  ) {
    postData(`tasks/${taskId - 1}/`, {
      title: title,
      description: description,
      date: dueDate,
      priority: selectedPrio,
      category: categorySeleced,
      id: taskId,
      subtasks: getSubtasks(),
      assigned: assignedTo,
      status: taskStatus,
      user: Number(userId[0]),
    });
  }

  async function getContacts() {
    document.getElementById("contact_contant").innerHTML = "";
    let contacts = await fetchData("contacts");
    let userContacts = activeUser.contacts
    const contactsToRender = contacts.filter((contact) => userContacts.includes(contact.id));
    window.allContacts = contactsToRender;
    displayContacts(contactsToRender);
  }

  async function updateSelectedContactsDisplay() {
    const newContacts = await fetchData("contacts");
    const selectedList = document.getElementById("selected_contacts");
    selectedList.innerHTML = "";
    let userContacts = activeUser.contacts
    const contactsToRender = newContacts.filter((contact) => userContacts.includes(contact.id));
    window.allContacts = contactsToRender;
    displaySelectedContacts(contactsToRender, selectedList);
  }