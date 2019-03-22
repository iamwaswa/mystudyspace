const main = document.getElementsByTagName(`main`)[0];
const messageSection = document.getElementsByClassName(`message-section`);
const container = document.getElementsByClassName(`container`)[0];

window.onload = () => {
  if (messageSection.length) {
    main.classList.add(`add-row`);
    messageSection[0].classList.add(`fade-in`);
    container.classList.add(`shift-up`);
  }
}