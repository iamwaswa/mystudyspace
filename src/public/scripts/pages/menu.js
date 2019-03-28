const menuIcon = document.getElementById(`menu-icon`);
const menu = document.getElementById(`menu`);

window.onload = () => {
  menu.style.display = `flex`;
};

menuIcon.onclick = (event) => {
  event.preventDefault();
  menu.classList.toggle(`show-menu`);
};