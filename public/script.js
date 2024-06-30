document.addEventListener("DOMContentLoaded", function () {
  const chatWidget = document.getElementById("chat-widget");
  const ctaButton = document.querySelector(".cta");
  const closeChatButton = document.getElementById("close-chat");
  const suggestionButtons = document.getElementById("suggestion-buttons");
  const userInfoForm = document.getElementById("user-info-form");
  const userNameInput = document.getElementById("user-name");
  const userEmailInput = document.getElementById("user-email");
  const submitInfoButton = document.getElementById("submit-info");
  const chatbox = document.getElementById("chatbox");
  const sendButton = document.getElementById("send-button");
  const userInput = document.getElementById("user-input");

  // Toggle chat widget visibility when CTA button is clicked
  ctaButton.addEventListener("click", () => {
    chatWidget.classList.toggle("visible");
  });

  // Hide chat widget when close button is clicked
  closeChatButton.addEventListener("click", () => {
    chatWidget.classList.remove("visible");
  });

  // Handle user info submission
  submitInfoButton.addEventListener("click", () => {
    const userName = userNameInput.value.trim();
    const userEmail = userEmailInput.value.trim();

    if (userName && userEmail) {
      // Save user info to localStorage
      localStorage.setItem("userName", userName);
      localStorage.setItem("userEmail", userEmail);

      // Hide the user info form
      userInfoForm.style.display = "none";
      suggestionButtons.style.display = "flex"; // Show suggestion buttons
    } else {
      alert("Silakan isi nama dan email Anda.");
    }
  });

  // Handle suggestion button click
  suggestionButtons.addEventListener("click", (e) => {
    if (e.target.classList.contains("suggestion-button")) {
      const message = e.target.textContent.trim();
      sendMessage(message);
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
      const message = userInput.value.trim();
      if (message) {
        sendMessage(message);
      }
    }
  });

  // Send message function
  function sendMessage(message) {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (!userName || !userEmail) {
      alert("Silakan isi nama dan email Anda sebelum mengirim pesan.");
      return;
    }

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
      data: JSON.stringify({
        message: message,
        userName: userName,
        userEmail: userEmail,
      }),
      success: function (response) {
        // Remove loader and append bot response
        document.getElementById(loaderId).remove();
        const botBubble = document.createElement("div");
        botBubble.classList.add("chat-bubble", "bot-bubble");
        botBubble.textContent = response.response;
        chatbox.appendChild(botBubble);
        chatbox.scrollTop = chatbox.scrollHeight;
      },
      error: function () {
        alert("Error in communication with the server.");
        document.getElementById(loaderId).remove();
      },
    });
  }
});
