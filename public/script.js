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
  const projectOverlay = document.getElementById("project-overlay");
  const closeProjectBox = document.getElementById("close-project-box");
  const projectContent = document.getElementById("project-content");

  const dots = document.querySelectorAll(".dot");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  let slideIndex = 1;

  // Slideshow functionality
  function showSlides(n) {
    const slides = document.querySelectorAll(".mySlides");
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    slides.forEach((slide, index) => {
      slide.style.display = index + 1 === slideIndex ? "grid" : "none";
    });
    dots.forEach((dot, index) => {
      dot.className = dot.className.replace(" active", "");
      if (index + 1 === slideIndex) {
        dot.className += " active";
      }
    });
  }

  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  function currentSlide(n) {
    showSlides((slideIndex = n));
  }

  prevButton.addEventListener("click", () => plusSlides(-1));
  nextButton.addEventListener("click", () => plusSlides(1));
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => currentSlide(index + 1));
  });

  showSlides(slideIndex);

  // Toggle chat widget visibility when CTA button is clicked
  ctaButton.addEventListener("click", () => {
    chatWidget.classList.toggle("visible");
  });

  // Hide chat widget when close button is clicked
  closeChatButton.addEventListener("click", () => {
    chatWidget.classList.remove("visible");
  });

  // Close chat widget when clicking outside of it
  document.addEventListener("click", (e) => {
    if (!chatWidget.contains(e.target) && !ctaButton.contains(e.target)) {
      chatWidget.classList.remove("visible");
    }
  });

  // Handle user info submission
  submitInfoButton.addEventListener("click", () => {
    submitUserInfo();
  });

  // Handle form submission with Enter key
  userNameInput.addEventListener("keypress", handleEnterKeySubmit);
  userEmailInput.addEventListener("keypress", handleEnterKeySubmit);

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
      event.preventDefault(); // Prevent form submission if within a form
      const message = userInput.value.trim();
      if (message) {
        sendMessage(message);
      }
    }
  });

  function handleEnterKeySubmit(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitUserInfo();
    }
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function submitUserInfo() {
    const userName = userNameInput.value.trim();
    const userEmail = userEmailInput.value.trim();

    if (userName && (!userEmail || validateEmail(userEmail))) {
      // Save user info to localStorage
      localStorage.setItem("userName", userName);
      if (userEmail) {
        localStorage.setItem("userEmail", userEmail);
      }

      // Hide the user info form and show suggestion buttons
      userInfoForm.style.display = "none";
      suggestionButtons.style.display = "flex";
    } else {
      alert("Silakan isi nama anda dan email yang valid.");
    }
  }

  function sendMessage(message) {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (!userName) {
      alert("Silakan isi nama anda sebelum mengirim pesan.");
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
      url: "/api/chat",
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
      error: function (error) {
        alert("Error in communication with the server.");
        console.log(error);
        document.getElementById(loaderId).remove();
      },
    });
  }

  // Project overlay functionality
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      const projectId = card.id;
      let projectContentHtml = "";

      // Example project content, you can customize this
      if (projectId === "project1") {
        projectContentHtml = `
          <h2>Localization of Commercial Vehicle Plate Number with YOLOv8 and Bayesian Optimization</h2>
          <h4 style="color:gray">2023 - 2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills</p>
            <div class="skill-box">Python</div>
            <div class="skill-box">Object Detection</div>
            <div class="skill-box">Machine Learning</div>
            <div class="skill-box">Google Colab</div>
            <div class="skill-box">Computer Vision</div>
            <div class="skill-box">Dataset</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
          <p class="noto-sans-medium" style="text-align: justify;"> Thesis Project for College. The core of this project is to predict the location of commercial vehicles and extract license plate image based on the predicted bounding boxes. The primary motivation for detecting commercial vehicles is to prevent overloading. The dataset was self-collected, as no relevant data was available online at the time. 
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/ANPR" target="_blank">Source Code Link</a>
          <br>
          <a href="https://www.kaggle.com/datasets/kennyanaga/commercial-vehicle-license-plate-dataset" target="_blank">Dataset Link</a>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/image1.jpg" alt="Image 1">
            <img src="/image2.jpg" alt="Image 2">
            <img src="/image3.jpg" alt="Image 3">
            <img src="/image4.jpg" alt="Image 4">
            <img src="/image5.jpg" alt="Image 5">
            <img src="/image6.jpg" alt="Image 6">
          </div>
      `;
      } else if (projectId === "project2") {
        projectContentHtml = `
          <h2>Legend of Pandawa</h2>
          <h4 style="color:gray">2021</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills</p>
            <div class="skill-box">Game Development</div>
            <div class="skill-box">Game Design</div>
            <div class="skill-box">Pixel Arts</div>
            <div class="skill-box">Animation</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">The game project created for the national competition GEMASTIK XIV. Legend of Pandawa is a retro doom-like action game where users play as Pandawa characters and follow the storyline. In this project, my main role was in creating sprites and animations. This game successfully reached the finalist nomination.</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://www.youtube.com/watch?v=5tarsoBcpqY" target="_blank">Trailer Link</a>
          <br>
          <a>DM me for game apk!</a>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/proj2-1.jpg" alt="Image 21">
            <img src="/proj2-2.jpg" alt="Image 22">
            <img src="/proj2-3.jpg" alt="Image 23">
            <img src="/proj2-4.jpg" alt="Image 24">
            <img src="/proj2-5.png" alt="Image 25">
            <img src="/proj2-6.png" alt="Image 26">
            <img src="/proj2-7.jpg" alt="Image 27">
            <img src="/proj2-8.jpg" alt="Image 28">
          </div>
        `;
      } else if (projectId === "project3") {
        projectContentHtml = `
          <h2>Inventaris Pika</h2>
          <h4 style="color:gray">2022</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills</p>
            <div class="skill-box">Python</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Lorem Ipsum Lor sit Jamet</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/ANPR" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/proj2-1.jpg" alt="Image 1">
            <img src="/proj2-2.jpg" alt="Image 1">
            <img src="/proj2-3.jpg" alt="Image 1">
            <img src="/proj2-4.jpg" alt="Image 1">
            <img src="/proj2-5.png" alt="Image 1">
            <img src="/proj2-6.png" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project4") {
        projectContentHtml = `
          <h2>Project2</h2>
          <h4 style="color:gray">2023 - 2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills</p>
            <div class="skill-box">Python</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Lorem Ipsum Lor sit Jamet</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/ANPR" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/image1.jpg" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project5") {
        projectContentHtml = `
          <h2>Project2</h2>
          <h4 style="color:gray">2023 - 2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills</p>
            <div class="skill-box">Python</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Lorem Ipsum Lor sit Jamet</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/ANPR" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/image1.jpg" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project6") {
        projectContentHtml = `
          <h2>Project2</h2>
          <h4 style="color:gray">2023 - 2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills</p>
            <div class="skill-box">Python</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Lorem Ipsum Lor sit Jamet</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/ANPR" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/image1.jpg" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project7") {
        projectContentHtml = `
          <h2>Project2</h2>
          <h4 style="color:gray">2023 - 2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills</p>
            <div class="skill-box">Python</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Lorem Ipsum Lor sit Jamet</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/ANPR" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/image1.jpg" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project8") {
        projectContentHtml = `
          <h2>Project2</h2>
          <h4 style="color:gray">2023 - 2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills</p>
            <div class="skill-box">Python</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Lorem Ipsum Lor sit Jamet</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/ANPR" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/image1.jpg" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project9") {
        projectContentHtml = `
          <h2>Project2</h2>
          <h4 style="color:gray">2023 - 2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills</p>
            <div class="skill-box">Python</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Lorem Ipsum Lor sit Jamet</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/ANPR" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/image1.jpg" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project10") {
        projectContentHtml = `
          <h2>Project2</h2>
          <h4 style="color:gray">2023 - 2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills</p>
            <div class="skill-box">Python</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Lorem Ipsum Lor sit Jamet</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/ANPR" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/image1.jpg" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project11") {
        projectContentHtml = `
          <h2>Project2</h2>
          <h4 style="color:gray">2023 - 2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills</p>
            <div class="skill-box">Python</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Lorem Ipsum Lor sit Jamet</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/ANPR" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/image1.jpg" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project12") {
        projectContentHtml = `
          <h2>Project2</h2>
          <h4 style="color:gray">2023 - 2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills</p>
            <div class="skill-box">Python</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Lorem Ipsum Lor sit Jamet</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/ANPR" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/image1.jpg" alt="Image 1">
          </div>
        `;
      }

      projectContent.innerHTML = projectContentHtml;
      projectOverlay.style.display = "flex"; // Show overlay
    });
  });

  closeProjectBox.addEventListener("click", () => {
    projectOverlay.style.display = "none"; // Hide overlay
  });

  // Close overlay when clicking outside the project box
  projectOverlay.addEventListener("click", (e) => {
    if (e.target === projectOverlay) {
      projectOverlay.style.display = "none"; // Hide overlay
    }
  });
});
