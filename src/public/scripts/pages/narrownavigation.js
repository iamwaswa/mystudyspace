const hamburgerMenuIcon = document.getElementById(`hamburger`);
const closeMenuIcon = document.getElementById(`close`);

hamburgerMenuIcon.addEventListener(`click`, () => {
  hamburgerMenuIcon.classList.toggle(`hidden`);
  closeMenuIcon.classList.toggle(`hidden`);
});

closeMenuIcon.addEventListener(`click`, () => {
  closeMenuIcon.classList.toggle(`hidden`);
  hamburgerMenuIcon.classList.toggle(`hidden`);
});