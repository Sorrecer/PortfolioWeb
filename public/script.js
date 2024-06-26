document.addEventListener("DOMContentLoaded", function () {
  const chatWidget = document.getElementById("chat-widget");
  const ctaButton = document.querySelector(".cta");
  const moreInfoSection = document.querySelector(".more-info-section");
  const closeChatButton = document.getElementById("close-chat");

  // Toggle chat widget visibility when ai chatbot button is clicked
  ctaButton.addEventListener("click", () => {
    chatWidget.classList.toggle("visible");
  });

  // Toggle chat widget visibility when more info section is clicked
  moreInfoSection.addEventListener("click", () => {
    chatWidget.classList.toggle("visible");
  });

  // Add hover effect to ai chatbot button when hovering over more info section
  moreInfoSection.addEventListener("mouseover", () => {
    ctaButton.classList.add("hovered");
  });

  // Remove hover effect from ai chatbot button when leaving more info section
  moreInfoSection.addEventListener("mouseout", () => {
    ctaButton.classList.remove("hovered");
  });

  // Hide chat widget when close button is clicked
  closeChatButton.addEventListener("click", () => {
    chatWidget.classList.remove("visible");
  });
});
