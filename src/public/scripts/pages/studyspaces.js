const listContainer = document.querySelector(`ul`);
const listItems = document.querySelectorAll(`li`);

window.addEventListener(`load`, () => {
  configureGrid();
});

window.addEventListener(`resize`, () => {
  configureGrid();
});

const configureGrid = () => {
  if (window.innerWidth >= 0) {
    listContainer.style.gridTemplateRows = `repeat(${listItems.length}, auto)`;
    listContainer.style.gridRowGap = `2rem`;
    listContainer.style.gridTemplateColumns = `100%`;
  }
  if (window.innerWidth >= 600) {
    listContainer.style.gridTemplateRows = `repeat(${Math.round(listItems.length / 2)}, auto)`;
    listContainer.style.gridColumnGap = `2rem`;
    listContainer.style.gridTemplateColumns = `repeat(2, 1fr)`;
  }
  if (window.innerWidth >= 900) {
    listContainer.style.gridTemplateRows = `repeat(${Math.round(listItems.length / 3)}, auto)`;
    listContainer.style.gridTemplateColumns = `repeat(3, 1fr)`;
  }
  if (window.innerWidth >= 1440) {
    listContainer.style.gridTemplateRows = `repeat(${Math.round(listItems.length / 4)}, auto)`;
    listContainer.style.gridTemplateColumns = `repeat(4, 1fr)`;
  }
  if (window.innerWidth >= 2160) {
    listContainer.style.gridTemplateRows = `repeat(${Math.round(listItems.length / 5)}, auto)`;
    listContainer.style.gridTemplateColumns = `repeat(5, 1fr)`;
  }
};