document.addEventListener("DOMContentLoaded", function () {
  const chatWidget = document.getElementById("chat-widget");
  const ctaButton = document.querySelector(".cta");
  const moreInfoSection = document.querySelector(".more-info-section");
  const closeChatButton = document.getElementById("close-chat");
  const suggestionButtons = document.querySelectorAll(".suggestion-button");
  const chatbox = document.getElementById("chatbox");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const suggestionButtonsContainer =
    document.getElementById("suggestion-buttons");

  // Toggle chat widget visibility when AI chatbot button is clicked
  ctaButton.addEventListener("click", () => {
    chatWidget.classList.toggle("visible");
  });

  // Toggle chat widget visibility when more info section is clicked
  moreInfoSection.addEventListener("click", () => {
    chatWidget.classList.toggle("visible");
  });

  // Add hover effect to AI chatbot button when hovering over more info section
  moreInfoSection.addEventListener("mouseover", () => {
    ctaButton.classList.add("hovered");
  });

  // Remove hover effect from AI chatbot button when leaving more info section
  moreInfoSection.addEventListener("mouseout", () => {
    ctaButton.classList.remove("hovered");
  });

  // Hide chat widget when close button is clicked
  closeChatButton.addEventListener("click", () => {
    chatWidget.classList.remove("visible");
  });

  // Handle click on suggestion buttons
  suggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const message = button.textContent;
      sendMessage(message);
    });
  });

  // Function to send message
  function sendMessage(message) {
    if (message.trim() !== "") {
      // Add user message to chatbox
      chatbox.insertAdjacentHTML(
        "beforeend",
        `<div class="chat-bubble user-bubble">${message}</div>`
      );
      userInput.value = ""; // Clear input field
      chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom

      // Hide suggestion buttons
      suggestionButtonsContainer.style.display = "none";

      // Append loading animation
      const loaderId = "loader-" + new Date().getTime(); // Unique ID for loader
      chatbox.insertAdjacentHTML(
        "beforeend",
        `<div class="chat-bubble bot-bubble" id="${loaderId}">
                <div class="loader">
                    <span></span><span></span><span></span>
                </div></div>`
      );
      chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom

      // Send user message to the server
      fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Remove loader and append bot response
          document.getElementById(loaderId).remove();
          chatbox.insertAdjacentHTML(
            "beforeend",
            `<div class="chat-bubble bot-bubble">${data.response}</div>`
          );
          chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
        })
        .catch(() => {
          alert("Error in communication with the server.");
          document.getElementById(loaderId).remove(); // Remove loader on error
        });
    }
  }

  // Event listener for send button
  sendButton.addEventListener("click", () => {
    sendMessage(userInput.value);
  });

  // Event listener for enter
  userInput.addEventListener("keypress", (event) => {
    if (event.which === 13) {
      // 13 is the key code for enter
      event.preventDefault(); // Prevent the default action
      sendMessage(userInput.value);
    }
  });
});
