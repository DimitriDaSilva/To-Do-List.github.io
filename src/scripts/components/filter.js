import { categoryArray, urgencyArray } from "../index.js";
import { addTask } from "./task-new.js";
import { saveTasks } from "./task-save.js";
import { colorPairs } from "./category-color.js";

const tasksContainer = document.querySelector("#tasks");
const filterBtn = document.querySelector("#buttons__filter");

// Handling the filter
export const filterText = filterBtn.querySelector("p");
export const filters = ["category", "urgency"];
export let filterMode = "";

filterBtn.addEventListener("click", () => {
  if (filterMode === filters[0]) {
    filterMode = filters[1];
    filterText.textContent = "Filter by category";
  } else {
    filterMode = filters[0];
    filterText.textContent = "Filter by urgency";
  }

  const savedTasks = saveTasks();

  tasksContainer.textContent = "";

  categoryArray.splice(0, categoryArray.length);
  urgencyArray.splice(0, urgencyArray.length);

  savedTasks.forEach((item) => {
    let color = "";
    if (filterMode === filters[0]) {
      color = colorPairs[filterMode][item.category];
    } else {
      color = colorPairs[filterMode][item.urgency];
    }
    addTask(item.task, item.category, item.urgency, color, item.checked);
  });
});

export function updateFilter(updatedFilter) {
  filterMode = updatedFilter;
}
