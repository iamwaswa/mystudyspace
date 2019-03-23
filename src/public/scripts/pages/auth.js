const messageSection = document.querySelector(`.message-section`);

if (messageSection) {
  let opacity = 0;
  messageSection.style.opacity = opacity;

  const timer = setInterval(() => {
    if (opacity >= 1) {
      messageSection.style.opacity = 1;
      clearInterval(timer);
      return;
    }
    messageSection.style.opacity = opacity;
    messageSection.style.filter = `alpha(opacity=${opacity * 100})`;
    opacity += 0.1;
  }, 30);
}