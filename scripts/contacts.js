document.addEventListener("DOMContentLoaded", () => {
  renderContent();
});

async function renderContent() {
  const groupedContacts = await groupContacts();
  renderContactsList(groupedContacts);
}

async function groupContacts() {
  userContacts = await filterUserContacts();
  return userContacts.reduce((acc, contact, index) => {
    if (contact && contact.initials) {
      let firstInitial = contact.initials.charAt(0).toUpperCase();
      if (!acc[firstInitial]) {
        acc[firstInitial] = [];
      }
      acc[firstInitial].push({ contact, initials: contact.initials, index });
    }
    return acc;
  }, {});
}

async function filterUserContacts() {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  const data = await fetchData("contacts");
  const contacts = Object.values(data);
  const userContacts = contacts.filter((contact) =>
    activeUser.contacts.includes(contact.id)
  );
  return userContacts;
}

async function renderContactsList(groupedContacts) {
  const contactList = document.getElementById("contact_list");
  contactList.innerHTML = "";
  await initActiveUser(contactList);
  const sortedInitials = sortInitials(Object.keys(groupedContacts));
  sortedInitials.forEach((initial) => {
    initLetterBox(initial, contactList);
    initContactsByInitial(groupedContacts[initial], contactList);
  });
}

async function initActiveUser(contactList) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  const data = await fetchData("users");
  const users = Object.values(data);
  const user = users.find((c) => c.id === activeUser.id);

  if (user) {
    user.id = 0;
    contactList.innerHTML = generateActiveUserContact(user);
  }
}

function sortInitials(initials) {
  return initials.sort();
}

function initContactsByInitial(contacts, contactList) {
  contacts.forEach(({ contact }) => {
    const contactHtml = generateContact(contact);
    contactList.innerHTML += contactHtml;
  });
}

function initLetterBox(initial, contactList) {
  const letterBoxHtml = generateLetterBox(initial);
  contactList.innerHTML += letterBoxHtml;
}

async function addContact() {
  const contactId = await postNewContact();
  addContactToUser(contactId, activeUser);
  addContactToUserLocal(contactId, activeUser);
  closeDialog();
  await openDialogSuccessfully();
  clearForm();
  renderContent();
}

async function postNewContact() {
  const name = getInputValue("name");
  const email = getInputValue("email");
  const phone = getInputValue("phone");
  if (!name || !email) return; 
  const contactId = await getNewId("contacts");
  const contactData = createContact(name, email, phone, contactId);
  await postData(`contacts/${contactId - 1}/`, contactData); 
  return contactId; 
}

function createContact(name, email, phone, contactId) {
  return {
    id: contactId,
    name: name,
    email: email,
    phone: phone,
    color: generateRandomColor(),
    initials: getInitials(name),
  };
}

async function addContactToUser(contactId, activeUser) {
  const userId = activeUser.id;
  const allUsers = await fetchData("users");
  const userData = Object.values(allUsers).find((user) => user.id === userId);

  if (userData && !userData.contacts.includes(contactId)) {
    userData.contacts.push(contactId);
    await postData(`users/${userId - 1}/`, { ...userData });
  }
}

function addContactToUserLocal(contactId) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUser.contacts.push(contactId);
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
}

function generateRandomColor() {
  const darkLetters = "0123456789ABC"; 
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += darkLetters[Math.floor(Math.random() * darkLetters.length)];
  }
  return color;
}

async function displayContactInfo(contactId) {
  const contact = await getContact(contactId);
  if (window.innerWidth <= 777) {
    return displayContactInfoMobile(contactId);
  }
  const contactInfoDiv = document.querySelector(".contacts-info-box");
  const contactInfoButtons = document.getElementById("button_edit_dialog");
  contactInfoDiv.innerHTML = generateContactInfo(contact);
  contactInfoButtons.innerHTML = generateButtonsInContactInfo(contact);
  if (contact.id === 0) {
    document.getElementById("for_active_user").classList.add("letter-circel-user");
  }
  highlightContact(contact);
}

async function getContact(contactId) {
  if (contactId === 0) {
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));
    const contact = await searchForUser(activeUser.id);
    contact.id = 0;
    return contact;
  } else {
    return await searchForContact(contactId);
  }
}

function highlightContact(contact) {
  const contacts = document.getElementsByClassName("contacts");
  for (let i = 0; i < contacts.length; i++) {
    contacts[i].style.backgroundColor = "";
    contacts[i].style.color = "black";
  }
  document.getElementById(`contact${contact.id}`).style.backgroundColor =
    "#27364a";
  document.getElementById(`contact${contact.id}`).style.color = "white";
}

async function displayContactInfoMobile(contactId) {
  let infoDiv = document.getElementById("mobile_contact_info");
  infoDiv.classList.remove("d-none");
  infoDiv.classList.add("pos-abs");
  const contact = await getContact(contactId); 
  const contactInfoDiv = document.querySelector(".mobile-contacts-info-box");
  const contactInfoButtons = document.getElementById("button_edit_dialog");
  contactInfoDiv.innerHTML = generateContactInfo(contact);
  if (contact.id === 0) {
    document.getElementById("for_active_user").classList.add("letter-circel-user");
  }
  contactInfoButtons.innerHTML = generateButtonsInContactInfo(contact);
  mobileEditContact();
  const menu = document.getElementById("mobile_menu");
  menu.innerHTML = generateMobileMenu(contact);
}

function mobileEditContact() {
  const contactMobileButton = document.querySelector(
    ".contact-box-edit-delete"
  );
  contactMobileButton.classList.add("d-none");
}

async function deleteContact(contactId) {
  if(contactId === 0) {
    alert("user can't be deletet by this way")
    return;
  } 
  await deleteContactInData(contactId);
  await renderContent();
  document.querySelector(".contacts-info-box").innerHTML = "";
  if (window.innerWidth < 777) {
    document.getElementById("mobile_menu").classList.remove("d-flex");
    goBackMobile();
  }
}

async function deleteContactInData(contactId) {
  let users = await fetchData("users");
  if (contactId >= 1 && contactId <= 10) {
    await deleteContactOnlyforUser(contactId, users);
  } else {
    await deleteContactforAllUsers(contactId, users);
  }
  await deleteContactFromTasks(contactId)
  deleteContactInLocalStorage(contactId);
}

async function deleteContactOnlyforUser(contactId, users) {
  if (activeUser.id === 0) {
    return;
  }
  users = users.map((user) => {
    if (user.id === activeUser.id) {
      return {
        ...user,
        contacts: user.contacts.filter((contact) => contact !== contactId),
      };
    }
    return user;
  });
  await postData("users", users);
}

async function deleteContactFromTasks(contactId) {
  const allTasks = await fetchData("tasks");
  const updatedTasks = allTasks.map((task) => {
    if (task.assigned && Array.isArray(task.assigned)) {
      return {
        ...task,
        assigned: task.assigned.filter((id) => id !== contactId), 
      };
    }
    return task; 
  });
  await postData("tasks", updatedTasks);
}

async function deleteContactforAllUsers(contactId, users) {
  await deleteData("contacts", contactId);
  if (activeUser.id === 0) {
    return;
  }
  users = users.map((user) => ({
    ...user,
    contacts: user.contacts.filter((contact) => contact !== contactId),
  }));
  await postData("users", users);
}

function deleteContactInLocalStorage(contactId) {
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUser.contacts = activeUser.contacts.filter(
    (contact) => contact !== contactId
  );
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
}

function getInitials(name) {
  const names = name.split(" ");  
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase(); 
  }
  const firstInitial = names[0].charAt(0).toUpperCase();
  const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
  return firstInitial + lastInitial; 
}

function limitTextLength(text, maxLength = 20) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function goBackMobile() {
  document.getElementById("mobile_contact_info").classList.add("d-none");
  document.getElementById("mobile_contact_info").classList.remove("pos-abs");
  const contactInfoDiv = document.querySelector(".mobile-contacts-info-box");
  contactInfoDiv.innerHTML = "";
}

function openMobileMenu(contactId) {
  const menu = document.getElementById("mobile_menu");
  menu.classList.add("d-flex");
  const handleClickOutside = (event) => {
    if (!menu.contains(event.target)) {
      menu.classList.remove("d-flex");
      document.removeEventListener("click", handleClickOutside);
    }
  };
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
}

async function searchForContact(contactId) {
  const data = await fetchData("contacts");
  const contacts = Object.values(data);
  const contact = contacts.find((c) => c && c.id === contactId);
  return contact;
}

async function searchForUser(contactId) {
  const data = await fetchData("users");
  const contacts = Object.values(data);
  const contact = contacts.find((c) => c && c.id === contactId);
  return contact;
}

