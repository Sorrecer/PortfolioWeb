document.addEventListener("DOMContentLoaded", function () {
  const chatWidget = document.getElementById("chat-widget");
  const contactWidget = document.getElementById("contact-widget");
  const ctaButton = document.querySelector(".cta");
  const contactButton = document.querySelector(".letter-image");
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

  var gear1 = document.querySelector(".gear1").style;
  gear2 = document.querySelector(".gear2").style;
  window.onscroll = function rotateGear() {
    gear1.transform = "rotate(" + window.scrollY * 1 + "deg)";
    gear2.transform = "rotate(-" + window.scrollY * 1 + "deg)";
  };

  // Toggle chat widget visibility when CTA button is clicked
  ctaButton.addEventListener("click", () => {
    chatWidget.classList.toggle("visible");
  });

  // Toggle contact widget visibility when contactbutton button is clicked
  contactButton.addEventListener("click", () => {
    contactWidget.classList.toggle("visible");
  });

  // Hide chat widget when close button is clicked
  closeChatButton.addEventListener("click", () => {
    chatWidget.classList.remove("visible");
    contactWidget.classList.remove("visible");
  });

  // Close chat widget when clicking outside
  document.addEventListener("click", (e) => {
    if (!chatWidget.contains(e.target) && !ctaButton.contains(e.target)) {
      chatWidget.classList.remove("visible");
    }
  });

  //close contact widget when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !contactWidget.contains(e.target) &&
      !contactButton.contains(e.target)
    ) {
      contactWidget.classList.remove("visible");
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
          <p class="noto-sans-bold">Skills and Techs</p>
            <div class="skill-box">Python</div>
            <div class="skill-box">Object Detection</div>
            <div class="skill-box">Machine Learning</div>
            <div class="skill-box">Google Colab</div>
            <div class="skill-box">Computer Vision</div>
            <div class="skill-box">Dataset</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
          <p class="noto-sans-medium" style="text-align: justify;"> Thesis Project for College. The core of this computer vision project is to predict the location of commercial vehicles and extract license plate image based on the predicted bounding boxes. The primary motivation for detecting commercial vehicles is to prevent overloading. The dataset was self-collected, as no relevant data was available online at the time. 
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
          <p class="noto-sans-bold">Skills and Techs</p>
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
          <p class="noto-sans-bold">Skills and Techs</p>
            <div class="skill-box">Web Programming</div>
            <div class="skill-box">HTML</div>
            <div class="skill-box">CSS</div>
            <div class="skill-box">MySQL</div>
            <div class="skill-box">PHP</div>
            <div class="skill-box">CodeIgniter</div>
            <div class="skill-box">Javascript</div>
            <div class="skill-box">Bootstrap</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">College internship project. Developed a school inventory system to manage incoming and outgoing assets and generate asset data reports. The system includes authentication and notifications related to stock levels. Technologies used include HTML, CSS, PHP, JavaScript, with the CodeIgniter and Bootstrap frameworks.</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/InventarisPIKA" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/proj3-1.png" alt="Image 1">
            <img src="/proj3-2.png" alt="Image 1">
            <img src="/proj3-3.png" alt="Image 1">
            <img src="/proj3-4.png" alt="Image 1">
            <img src="/proj3-5.png" alt="Image 1">
            <img src="/proj3-6.png" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project4") {
        projectContentHtml = `
          <h2>Efficient Computation of Mandelbrot Set Generation with Compute Unified Device Architecture (CUDA)</h2>
          <h4 style="color:gray">2022</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills and Techs</p>
            <div class="skill-box">Python</div>
            <div class="skill-box">Parallel programming</div>
            <div class="skill-box">Machine Process</div>
            <div class="skill-box">Google Colab</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">The Mandelbrot set is one of the fractal generations that need a complex computational process to generate it. In this research, the execution of a Mandelbrot Set generation using the CPU and GPU (CUDA) will be done. Parallelization that occurs on CUDA’s Mandelbrot set generation, results in relatively faster execution time than sequential work on the CPU in certain cases.</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://ieeexplore.ieee.org/document/9930601" target="_blank">Publication Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/proj4-1.png" alt="Image 1">
            <img src="/proj4-3.png" alt="Image 1">
            <img src="/proj4-2.jpg" alt="Image 1">
            <img src="/proj4-4.png" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project5") {
        projectContentHtml = `
          <h2>Project2</h2>
          <h4 style="color:gray">2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills and Techs</p>
            <div class="skill-box">Python</div>
            <div class="skill-box">AI</div>
            <div class="skill-box">Automation</div>
            <div class="skill-box">Optical Character Recognition</div>
            <div class="skill-box">Javascript</div>
            <div class="skill-box">LLM</div>
            <div class="skill-box">Google Gemini</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Chat bot project in Pony Town, a social massive multiplayer online game. This chat bot includes various mini games and features a standout AI chat, allowing players to interact directly with AI using AI prompts that have memory and personality, enabling continuous chat interaction. Google Gemini is used as the Large Language Model.</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/PonyTownBotv2" target="_blank">Source Code Link</a>
          <br>
          <a href="https://www.youtube.com/watch?v=8LgPhX1Yyzc" target="_blank">Small Clip</a>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/proj5-1.jpg" alt="Image 1">
            <img src="/proj5-3.jpg" alt="Image 1">
            <img src="/proj5-2.jpg" alt="Image 1">
            <img src="/proj5-4.jpg" alt="Image 1">
            <img src="/proj5-5.jpg" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project6") {
        projectContentHtml = `
          <h2>Portfolio Web</h2>
          <h4 style="color:gray">2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills and Techs</p>
            <div class="skill-box">HTML</div>
            <div class="skill-box">CSS</div>
            <div class="skill-box">Javascript</div>
            <div class="skill-box">AI</div>
            <div class="skill-box">Web Programming</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">My simple web portfolio containing my profile, projects, and history. Built with vanilla JavaScript featuring a standout AI chatbot. Users can interact with AI to inquire about information regarding Kenny. The language model used is Google Gemini.</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/PortfolioWeb" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
        `;
      } else if (projectId === "project7") {
        projectContentHtml = `
          <h2>Wordmaster</h2>
          <h4 style="color:gray">2020</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills and Techs</p>
            <div class="skill-box">Game Development</div>
            <div class="skill-box">Pixel Art</div>
            <div class="skill-box">Godot</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Wordmaster is an RPG game project where the user plays the role of Wil to save a kingdom. The main goal of this game is English education. The user fights enemies by selecting the correct answer choices based on the given english grammar questions.</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://www.youtube.com/watch?v=dodeTLRwiUQ" target="_blank">Video Teaser Link</a>
          <br>
          <a>Contact me for the game apk!</a>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/proj7-1.jpg" alt="Image 1">
            <img src="/proj7-3.jpg" alt="Image 1">
            <img src="/proj7-2.jpg" alt="Image 1">
            <img src="/proj7-4.jpg" alt="Image 1">
            <img src="/proj7-5.jpg" alt="Image 1">
            <img src="/proj7-6.jpg" alt="Image 1">
            <img src="/proj7-7.jpg" alt="Image 1">
            <img src="/proj7-8.jpg" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project8") {
        projectContentHtml = `
          <h2>SoloBudaya2</h2>
          <h4 style="color:gray">2022</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills and Techs</p>
            <div class="skill-box">HTML</div>
            <div class="skill-box">CSS</div>
            <div class="skill-box">Javascript</div>
            <div class="skill-box">Web Programming</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">SoloBudaya is a web-based Indonesian cultural learning application featuring interactive materials and quizzes. The application offers a variety of cultural content from different regions in Indonesia. Users can study the material and complete short quizzes related to specific regions.</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/Project-Solobudaya" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/proj8-1.png" alt="Image 1">
            <img src="/proj8-3.png" alt="Image 1">
            <img src="/proj8-2.png" alt="Image 1">
            <img src="/proj8-4.png" alt="Image 1">
            <img src="/proj8-5.png" alt="Image 1">
            <img src="/proj8-6.png" alt="Image 1">
            <img src="/proj8-7.png" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project9") {
        projectContentHtml = `
          <h2>Shark Bounce Ball</h2>
          <h4 style="color:gray">2022</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills and Techs</p>
            <div class="skill-box">Game Development</div>
            <div class="skill-box">Pixel Art</div>
            <div class="skill-box">Unity</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Shark Bounce Ball is a game project created for modeling and simulation subject in college. The gameplay of Shark Bounce Ball involves controlling a ball and bouncing it to destroy bombs in the sea while avoiding the existing bombs. Shark Bounce Ball is made using Unity with many physics reactions occurring within the game</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://drive.google.com/file/d/1CgHCzeuwAiJSsVefwSxSfJ9V012PU4S-/view?usp=sharing" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/proj7-1.jpg" alt="Image 1">
            <img src="/proj7-3.jpg" alt="Image 1">
            <img src="/proj7-2.jpg" alt="Image 1">
            <img src="/proj7-4.jpg" alt="Image 1">
            <img src="/proj7-5.jpg" alt="Image 1">
            <img src="/proj7-6.jpg" alt="Image 1">
            <img src="/proj7-7.jpg" alt="Image 1">
            <img src="/proj7-8.jpg" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project10") {
        projectContentHtml = `
          <h2>Sin Confession</h2>
          <h4 style="color:gray">2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills and Techs</p>
            <div class="skill-box">HTML</div>
            <div class="skill-box">CSS</div>
            <div class="skill-box">Javascript</div>
            <div class="skill-box">AI</div>
            <div class="skill-box">Web Programming</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">A small project: a website for interacting with AI, where the user takes on the role of someone wanting to confess sins. The AI will act as a witty priest and will give appropriate penance for the sins confessed by the user, while maintaining a humorous aspect.</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/sinconfession" target="_blank">Source Code Link</a>
          <br>
          <a href="https://sinconfession.vercel.app/"  target="_blank">Web Link</a>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/proj10.jpg" alt="Image 1">
            <img src="/proj10-1.jpg" alt="Image 1">
            <img src="/proj10-3.jpg" alt="Image 1">
            <img src="/proj10-2.jpg" alt="Image 1">
            <img src="/proj10-4.jpg" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project11") {
        projectContentHtml = `
          <h2>KennyLib</h2>
          <h4 style="color:gray">2021</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills and Techs</p>
            <div class="skill-box">HTML</div>
            <div class="skill-box">CSS</div>
            <div class="skill-box">MySQL</div>
            <div class="skill-box">Java</div>
            <div class="skill-box">Web Programming</div>
            <div class="skill-box">Android Studio</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Kenny Lib is a web-based application that serves as a library information system. This application offers various functionalities designed for an administrator, members (users), and visitors. Kenny Lib can be accessed through a website as well as a mobile application.</p>
          <div class="divider"></div>
          <p class="noto-sans-bold">Source</p>
          <a href="https://github.com/Sorrecer/Project-Kenny-Lib" target="_blank">Source Code Link</a>
          <br>
          <div class="divider"></div>
          <p class="noto-sans-bold">Images</p>
          <div class="image-grid">
            <img src="/proj11-5.jpg" alt="Image 1">
            <img src="/proj11-6.jpg" alt="Image 1">
            <img src="/proj11-5.png" alt="Image 1">
          </div>
        `;
      } else if (projectId === "project12") {
        projectContentHtml = `
          <h2>Legend of Pandawa:Remaster</h2>
          <h4 style="color:gray">2024</h4>
          <div class="divider"></div>
          <p class="noto-sans-bold">Skills and Techs</p>
            <div class="skill-box">Game Development</div>
            <div class="skill-box">Pixel Art</div>
            <div class="skill-box">Game Modeling</div>
          <div class="divider"></div>
          <p class="noto-sans-bold">Details</p>
           <p class="noto-sans-medium" style="text-align: justify;">Remake of Legend of Pandawa. Planned to be a short, arcade game with improved action and animations.</p>
          <div class="divider"></div>
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

  // const img = document.getElementById("about-image");

  // img.addEventListener("mouseover", () => {
  //   // const randomHue = Math.floor(Math.random() * 360);
  //   const randomSaturation = Math.floor(Math.random() * 100) + 50; // 50% to 250%
  //   const randomBrightness = Math.floor(Math.random() * 100) + 50; // 50% to 250%
  //   const randomContrast = Math.floor(Math.random() * 200) + 50; // 50% to 250%

  //   img.style.filter = `hue-rotate(${randomHue}deg) saturate(${randomSaturation}%) brightness(${randomBrightness}%) contrast(${randomContrast}%)`;
  // });

  // img.addEventListener("mouseout", () => {
  //   img.style.filter = "none";
  // });
});
