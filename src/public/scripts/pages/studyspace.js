const spinner = document.getElementsByClassName(`spinner`)[0];
const formContainer = document.getElementsByClassName(`form-container`)[0];

window.onload = () => {
  spinner.style.animation = `fadeoutandhide 300ms ease-in 1 forwards normal`;
  formContainer.classList.toggle(`hide-form-container`);
};

const button = document.getElementById(`button`);
button.onclick = (event) => {
  event.preventDefault();
  formContainer.classList.toggle(`hide-form-container`);  
  button.classList.toggle(`button-disabled`);
  button.setAttribute(`disabled`, `true`);
};

const cancelButton = document.getElementById(`cancel-btn`);
cancelButton.onclick = (event) => {
  event.preventDefault();
  formContainer.classList.toggle(`hide-form-container`);
  button.classList.toggle(`button-disabled`);
  button.removeAttribute(`disabled`);
};