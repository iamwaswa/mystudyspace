// =====================================
// MENU DRAWER DISPLAY HANDLING ========
// =====================================
const menuIcon = document.getElementById(`menu-icon`);
const menu = document.getElementById(`menu`);
const container = document.getElementsByClassName(`container`)[0];

menuIcon.onclick = (event) => {
  event.preventDefault();
  let toggled = false;
  for (const className of menu.classList) {
    if (className === `show-menu`) {
      container ? container.classList.toggle(`seethrough`) : null;
      menu.classList.add(`hide-menu`);
      menu.classList.remove(`show-menu`);
      toggled = true;
      return;
    }

    if (className === `hide-menu`) {
      container ? container.classList.toggle(`seethrough`) : null;      
      menu.classList.add(`show-menu`);
      menu.classList.remove(`hide-menu`);
      toggled = true;
      return;
    }
  }

  if (!toggled) {
    container ? container.classList.toggle(`seethrough`) : null;
    menu.classList.add(`show-menu`);
  }
};