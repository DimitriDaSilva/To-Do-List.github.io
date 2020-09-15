import {
  categoryArray,
  urgencyArray,
  id,
  updateHelperVariables,
} from "../main.js";
import { filters, filterMode } from "./filter.js";
import {
  setColors,
  changeColorStatus,
  setRandColor,
  getBottomBorderColor,
} from "./category-color.js";
import { setListenersDots } from "./category-more.js";
import { addOptionToDatalist } from "./dropdown-list.js";
import { makeElementsDraggable } from "./drag-and-drop.js";
import { setListenersCrosses } from "./task-delete.js";

const tasksContainer = document.querySelector("#tasks");
const taskListTemplate = document.querySelector("#task-list-template");
const taskTemplate = document.querySelector("#task-template");

// Select input value
const newTask = document.querySelector("#add-new-task__input");
const categoryInput = document.querySelector("#add-new-task__category__input");
const urgencyInput = document.querySelector("#add-new-task__urgency__input");

// Add a task with DOM manipulation
export function addTask(
  taskString,
  category,
  urgency,
  pickedColor = setRandColor(),
  taskCheck = false
) {
  // Set default values if category and urgency are empty
  // ES6 Default value not used were because the parameters is always passed
  setDefault();

  // Based on the filterMode, filling the new list if needed
  const taskListTemplateNode = document.importNode(
    taskListTemplate.content,
    true
  );
  const copyListNode = taskListTemplateNode.querySelector("details");
  const summary = taskListTemplateNode.querySelector("summary");

  // Check if category exists already
  // If not, create it and append it to tasksContainer
  // If yes, do nothing
  if (filterMode === filters[0] && categoryArray.indexOf(category) === -1) {
    // Insert category to existing ones
    categoryArray.push(category);

    // Change title
    const title = copyListNode.querySelector(
      ".task-list-template__details__title"
    );
    title.textContent = category;

    // Add category and urgency to the class of the parentNode
    copyListNode.classList.add(category);

    // Set the colors to the stroke
    setColors(summary, pickedColor);

    // Asign the pickedColor to the category as a class
    copyListNode.classList.add(pickedColor);
    changeColorStatus(null, pickedColor);

    tasksContainer.append(copyListNode);

    setListenersDots(copyListNode);
  } else if (
    filterMode === filters[1] &&
    urgencyArray.indexOf(urgency) === -1
  ) {
    // Insert category to existing ones
    urgencyArray.push(urgency);

    // Change title
    const title = copyListNode.querySelector(
      ".task-list-template__details__title"
    );
    title.textContent = urgency;

    // Change title
    const dots = copyListNode.querySelector(
      ".task-list-template__details__button"
    );
    dots.id = urgency;

    // Add category and urgency to the class of the parentNode
    copyListNode.classList.add(urgency);

    // Set the colors to the stroke
    setColors(summary, pickedColor);

    // Asign the pickedColor to the category as a class
    copyListNode.classList.add(pickedColor);
    changeColorStatus(null, pickedColor);

    tasksContainer.append(copyListNode);

    setListenersDots(copyListNode);
  }

  // Filling the task template

  // Selecting the task template elements
  const taskTemplateNode = document.importNode(taskTemplate.content, true);
  const copyTaskNode = taskTemplateNode.querySelector("li");
  const checkbox = taskTemplateNode.querySelector("input");
  const label = taskTemplateNode.querySelector("label");
  const tag = taskTemplateNode.querySelector(".task-template__item__tag");
  const cross = taskTemplateNode.querySelector(".task-template__item__cross");

  // Selecting the existing categories
  const allDetails = tasksContainer.querySelectorAll("details");

  cross.id = id;
  checkbox.id = id;
  label.htmlFor = id;

  copyTaskNode.classList.add(category);
  copyTaskNode.classList.add(urgency);

  addOptionToDatalist(category, "category");
  addOptionToDatalist(urgency, "urgency");

  const pElement = taskTemplateNode.querySelector("p");
  pElement.append(taskString);

  // Appending the task in the right category
  if (filterMode === filters[0]) {
    allDetails.forEach((list) => {
      const hasClass = list.classList.contains(category);
      if (hasClass) {
        const ul = list.querySelector("ul");
        ul.append(taskTemplateNode);

        // Chec if the corresponding list is open. If not, open it
        if (list.open !== true) {
          list.open = true;
        }

        // Add tag
        tag.textContent = urgency;

        // Detect stroke color and apply it to the task
        const summaryEl = list.querySelector("summary");
        setColors(summaryEl, getBottomBorderColor(summaryEl));
      }
    });
  } else {
    allDetails.forEach((list) => {
      const hasClass = list.classList.contains(urgency);
      if (hasClass) {
        const ul = list.querySelector("ul");
        ul.append(taskTemplateNode);
        if (list.open !== true) {
          list.open = true;
        }

        // Add tag
        tag.textContent = category;

        // Detect stroke color and apply it to the task
        const summaryEl = list.querySelector("summary");
        setColors(summaryEl, getBottomBorderColor(summaryEl));
      }
    });
  }

  // Making sure that the check animation doesn't restart onload page
  if (taskCheck) {
    const checkCustom = label.querySelector("svg");
    const path = checkCustom.querySelector("path");
    path.style.strokeDashoffset = 0;
    checkbox.checked = taskCheck;
  } else {
    checkbox.checked = taskCheck;
  }

  setListenersCrosses();
  makeElementsDraggable();

  // Reseting input boxes and incrementing id
  newTask.value = "";
  categoryInput.value = "";
  urgencyInput.value = "";
  id++;

  updateHelperVariables(categoryArray, urgencyArray, id);
}

// Give default value to categoryInput and urgencyInput if they are left empty
function setDefault() {
  if (categoryInput.value === "") {
    categoryInput.value = "Inbox";
  }
  if (urgencyInput.value === "") {
    urgencyInput.value = "None";
  }
}