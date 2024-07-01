document.addEventListener("DOMContentLoaded", function () {
  const chatWidget = document.getElementById("chat-widget");
  const ctaButton = document.querySelector(".cta");
  const suggestionButtons = document.getElementById("suggestion-buttons");
  const chatbox = document.getElementById("chatbox");
  const sendButton = document.getElementById("send-button");
  const userInput = document.getElementById("user-input");

  // Toggle chat widget visibility when CTA button is clicked
  if (ctaButton) {
    ctaButton.addEventListener("click", () => {
      chatWidget.classList.toggle("visible");
    });
  }

  // Handle suggestion button click
  suggestionButtons.addEventListener("click", (e) => {
    if (e.target.classList.contains("suggestion-button")) {
      const message = e.target.textContent.trim();
      sendMessage(message);
      suggestionButtons.style.display = "none"; // Hide buttons after click
    }
  });

  // Handle send button click
  sendButton.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (message) {
      sendMessage(message);
    }
  });

  // Handle enter key press for sending message
  userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission if within a form
      const message = userInput.value.trim();
      if (message) {
        sendMessage(message);
      }
    }
  });

  function sendMessage(message) {
    // Add user message to chatbox
    const userBubble = document.createElement("div");
    userBubble.classList.add("chat-bubble", "user-bubble");
    userBubble.textContent = message;
    chatbox.appendChild(userBubble);

    // Clear input field and scroll to bottom
    userInput.value = "";
    chatbox.scrollTop = chatbox.scrollHeight;

    // Hide suggestion buttons if message sent
    suggestionButtons.style.display = "none";

    // Add loading animation
    const loaderId = "loader-" + new Date().getTime();
    const loader = document.createElement("div");
    loader.classList.add("chat-bubble", "bot-bubble");
    loader.id = loaderId;
    loader.innerHTML = `<div class="loader"><span></span><span></span><span></span></div>`;
    chatbox.appendChild(loader);
    chatbox.scrollTop = chatbox.scrollHeight;

    // Send user message to the server
    $.ajax({
      url: "/chat",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ message }),
      success: function (response) {
        // Remove loader and append bot response
        document.getElementById(loaderId).remove();
        const botBubble = document.createElement("div");
        botBubble.classList.add("chat-bubble", "bot-bubble");
        botBubble.textContent = response.response;
        chatbox.appendChild(botBubble);
        chatbox.scrollTop = chatbox.scrollHeight;
      },
      error: function (error) {
        alert("Error in communication with the server.");
        console.error(error);
        document.getElementById(loaderId).remove();
      },
    });
  }
});
