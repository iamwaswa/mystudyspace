const formContainer = document.getElementsByClassName(`form-container`)[0];

window.onload = () => {
  formContainer.classList.toggle(`hide-form-container`);
};

const button = document.getElementById(`button`);
button.onclick = () => {
  formContainer.classList.toggle(`hide-form-container`);  
  button.setAttribute(`disabled`, `true`);
};
