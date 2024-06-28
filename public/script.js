document.addEventListener("DOMContentLoaded", function () {
  const chatWidget = document.getElementById("chat-widget");
  const ctaButton = document.querySelector(".cta");
  const moreInfoSection = document.querySelector(".more-info-section");
  const closeChatButton = document.getElementById("close-chat");

  // Toggle chat widget visibility
  ctaButton.addEventListener("click", () => {
    chatWidget.classList.toggle("visible");
  });

  moreInfoSection.addEventListener("click", () => {
    chatWidget.classList.toggle("visible");
  });

  moreInfoSection.addEventListener("mouseover", () => {
    ctaButton.classList.add("hovered");
  });

  moreInfoSection.addEventListener("mouseout", () => {
    ctaButton.classList.remove("hovered");
  });

  closeChatButton.addEventListener("click", () => {
    chatWidget.classList.remove("visible");
  });

  // Chat functionality
  const chatbox = document.getElementById("chatbox");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const headerLoading = document.getElementById("header-loading");

  sendButton.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
      addMessage("user", message);
      userInput.value = "";
      try {
        const response = await fetch("api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });

        const data = await response.json();
        addMessage("bot", data.response);
      } catch (error) {
        addMessage(
          "bot",
          "Error communicating with the server. Please try again."
        );
      }
    }
  }

  function addMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-bubble", `${sender}-bubble`);
    messageElement.textContent = message;

    chatbox.insertBefore(messageElement, chatbox.firstChild);
    chatbox.scrollTop = 0;
    messageElement.style.animation = "slideUp 0.3s ease-in-out";
  }
});
