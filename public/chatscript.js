$(document).ready(function () {
  function sendMessage() {
    var message = $("#user-input").val().trim(); // Trimmed message
    if (message !== "") {
      // Add user message to chatbox
      $("#chatbox").append(
        `<div class="chat-bubble user-bubble">${message}</div>`
      );
      $("#user-input").val(""); // Clear input field
      $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight); // Scroll to the bottom

      // Append loading animation
      var loaderId = "loader-" + new Date().getTime(); // Unique ID for loader
      $("#chatbox").append(
        `<div class="chat-bubble bot-bubble" id="${loaderId}">
           <div class="loader">
             <span></span><span></span><span></span>
           </div>
         </div>`
      );
      $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight); // Scroll to the bottom

      // Send user message to the server
      $.ajax({
        url: "/chat",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ message: message }),
        success: function (response) {
          // Remove loader and append bot response
          $("#" + loaderId).remove();
          $("#chatbox").append(
            `<div class="chat-bubble bot-bubble">${response.response}</div>`
          );
          $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight); // Scroll to the bottom
        },
        error: function (error) {
          alert(
            "Error in communication with the server. Please try again later."
          );
          console.log(error);
          $("#" + loaderId).remove(); // Remove loader on error
        },
      });
    }
  }

  // Event listener for send button
  $("#send-button").click(function () {
    sendMessage();
  });

  // Event listener for enter key
  $("#user-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault(); // Prevent form submission
      sendMessage();
    }
  });
});
