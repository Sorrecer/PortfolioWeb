$(document).ready(function () {
  function sendMessage() {
    const message = $("#user-input").val().trim();
    if (message) {
      appendMessage("user-bubble", message);
      $("#user-input").val(""); // Clear input field
      scrollToBottom();

      const loaderId = appendLoader();
      scrollToBottom();

      $.ajax({
        url: "/chat",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ message }),
        success: function (response) {
          removeLoader(loaderId);
          appendMessage("bot-bubble", response.response);
          scrollToBottom();
        },
        error: function (error) {
          alert("Error communicating with the server. Please try again later.");
          console.error(error);
          removeLoader(loaderId);
        },
      });
    }
  }

  function appendMessage(className, message) {
    $("#chatbox").append(
      `<div class="chat-bubble ${className}">${message}</div>`
    );
  }

  function appendLoader() {
    const loaderId = "loader-" + Date.now();
    $("#chatbox").append(
      `<div class="chat-bubble bot-bubble" id="${loaderId}">
         <div class="loader"><span></span><span></span><span></span></div>
       </div>`
    );
    return loaderId;
  }

  function removeLoader(loaderId) {
    $("#" + loaderId).remove();
  }

  function scrollToBottom() {
    $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
  }

  // Event listeners
  $("#send-button").click(sendMessage);

  $("#user-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      sendMessage();
    }
  });
});
