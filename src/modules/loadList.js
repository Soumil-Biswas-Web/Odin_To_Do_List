import add_svg from './Images/add-plus.svg';
import back_svg from './Images/arrow-left.svg';
import deselected_svg from './Images/deselected.svg';
import checkMark_svg from './Images/checkbox-outline.svg';
import {listPrime, updateListPrime} from '../index';
import { removeItem, retrieveItem, saveItem } from './localSave';
import { clearFromList } from './handleListItem';

let currentID = 0;
let list_panel;

//Add list and it's items to the DOM after creation

// Create List DOM
const createListDOM = (listItem) => {
    let list_item = document.createElement("div");
    list_item.setAttribute("class", "list_item");
    const checkMark = document.createElement("div");
    list_item.appendChild(checkMark);
    updateCheckMark(checkMark, listItem.taskState);
    checkMark.addEventListener("click", () => {
      handleCheckMark(checkMark, listItem);
    });

    let p = document.createElement("p");
    p.textContent = listItem.name;
    list_item.appendChild(p);

    let del = document.createElement("div");
    del.textContent = "X";
    list_item.appendChild(del);
    del.addEventListener("click", () => {
        clearLisTItem(listItem);
    });

    list_panel.appendChild(list_item);
    createSubList(p, listItem);
}

// Sub-List Add Event Listener
const createSubList = (p, listitem) => {
    p.addEventListener("click", () => {
      clearList();
      populateList(listitem);
    });
}
  
// Clear all List Panel Items
const clearList = () => {
    let list_items = list_panel.children;
    let len = list_items.length;
    // console.log(list_items);
    for (let i = 2; i < len; i++) {
        list_items[2].remove();
        // console.log("removed " + list_items[1]);
    }
}

// Populate List with items
const populateList = (superList) => {
    updateListPrime(superList);
    currentID = superList.id;
    console.log("Current ID: " + currentID);
    console.log("Current listPrime = " + listPrime.name);
    let listHeading = document.querySelector(".list h3");
    listHeading.textContent = superList.name;
    let listDesc = document.querySelector(".list h5");
    listDesc.textContent = superList.desc;
    let listDate = document.querySelector(".list h4");
    if (superList.due_date !== "" && superList.due_date !== undefined){
        listDate.textContent = ("Due Date: " + superList.due_date); 
    }
    else listDate.textContent = ""; 
    console.log(superList.subList);
    for (let i in superList.subList) {
      let sublistItem = retrieveItem(superList.subList[i]);
      createListDOM(sublistItem);
    }
}

// Handle Go Back button
const handleBackButton = () => {
    if (listPrime.name !== "Main List") {
        clearList();
        populateList(retrieveItem(listPrime.superList));
    }
}
  
// Handle task Check Mark
const handleCheckMark = (checkMark, listItem) => {
    listItem.taskState = listItem.taskState ? false : true;
    //console.log(listItem.taskState);
    saveItem(listItem);
    updateCheckMark(checkMark, listItem.taskState);
    
    if (listItem.subList.length != 0) {
        subListCheckMark(listItem, listItem.taskState);
    }
}

// Make all sub lists checked
const subListCheckMark = (listItem, state) => {
    listItem.taskState = state;
    console.log(listItem.name + " Checked to " + state);
    saveItem(listItem);
    if (listItem.subList.length !== 0) {
        for (let i in listItem.subList) subListCheckMark(retrieveItem(listItem.subList[i]), state);
    }
}

// Update Check Mark DOM
const updateCheckMark = (checkMark, taskState) => {
    if (taskState) {
        checkMark.innerHTML = checkMark_svg;
    }
    else {
        checkMark.innerHTML = deselected_svg;
    }
    // taskState ? checkMark.textContent = "✔" : checkMark.textContent = "[ ]"
};

// Remove List Item
const clearLisTItem = (listItem) => {
    clearFromList(listItem, retrieveItem(listItem.superList));
    clearList();
    populateList(retrieveItem(listItem.superList));
    removeItem(listItem.name);
}

const loadList = () => {
    const list = document.createElement("div");
    list.setAttribute("class", "list");
    const h3 = document.createElement("h3");
    list.appendChild(h3);
    const h2 = document.createElement("h5");
    list.appendChild(h2);
    const date = document.createElement("h4");
    list.appendChild(date);
    return list;
}

const createHeader = () => {
    const header = document.createElement("div");
    header.setAttribute("class", "header");
        const button = document.createElement("button");
        button.setAttribute("id", "open_btn");
        button.innerHTML = add_svg;
        const back_button = document.createElement("button");
        back_button.setAttribute("id", "back_btn");
        back_button.innerHTML = back_svg;
        const title = document.createElement("h1");
        title.textContent = "Odin To-Do List";
    header.append(back_button,title, button);
    
    return header;
}

const createFooter = () => {

}

const loadListPage = () => {
    list_panel = document.createElement("div");
    list_panel.setAttribute("class", "list_panel");

    list_panel.append(createHeader(), loadList());

    return list_panel;
}

export default loadListPage;
export {populateList, createListDOM, handleBackButton};