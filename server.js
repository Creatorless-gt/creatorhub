import express from 'express';
import cookieParser from 'cookie-parser';
import fetch from 'node-fetch'; // For making API requests
import config from './config.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as discord from './discord.js';
import * as storage from './storage.js';


/**
 * The verification part is not functional for... good reasons...
 */

 const app = express();
 app.use(cookieParser(config.COOKIE_SECRET));
 app.use(express.json()); // For parsing JSON bodies
 /**
  * Just a happy little route to show our server is up.
  */
const blacklistedGuildIds = [
  '1271175348096340090', // bad guild ID
  '1285324182376415252',
  '1098116518987968552', // bad guild ID
  '1160499686768119819',
  '1052844102498144286', // bad guild ID
  '919616813036347453',
  '1113355567113707563', // bad guild ID
  '1112782496736739418',
  '1026495594010792006', // bad guild ID
  '994502887612891259',
  '1214931244819943474', // bad guild ID
  '1200747250972889158',
  '1158789584021360783', // bad guild ID
  '1144379322677862591',
  '1090514532922826852', // bad guild ID
  '1083698573272678400',
  '1029716623977873501', // bad guild ID
  '871995287693045801',
  '794290336603963445',
  ];


/**
 * Main HTTP server used for the bot.
 */


 /**
  * Just a happy little route to show our server is up.
  */




const blacklistedRoleIds = [
  '1113779816399900693',
  '1160499686768119824',
  '1087646973869432852',
  '925736663613853736',
  '1113423685022404678',
  '1278438660353818834',
  '1066377804737937498',
  '1028834257268903966',
  '1006653999405072395',
  '1271175348096340099',
  '1275185074328834050',
  '1158805525874610246',
  '1158805493003862158',
  '1144387545384362104',
  '1090516688044298281',
  '1200401031616548924',
  '1044981598199750809',// bad role ID
  // Add additional role IDs if needed
];


// List of playful error messages
const errorMessages = [
    "Hmm... Sometimes people forget to block these kinds of things... not this time..",
    "Whoops! Looks like you’ve hit a wall. Better luck next time!",
    "Nice try! But you’re not supposed to be here. 🧐",
    "Access denied! Maybe try knocking on the right door?",
    "Sorry, this is a restricted area. Don't make me block you again!",
    "Whoa there, slow down! You can't go in this way. 🚫",
    "Ooooh, close! But no cigar. Try again later... or never.",
    "I see what you’re trying to do... and it’s not going to work. 😎",
    "Not today, pal. Not today.",
    "Oops! This door is locked. Try a password... oh wait, you don’t have one.",
    "Halt! Unauthorized access detected. You must be a wizard... of failure.",
    "Error 404: Your hopes and dreams not found.",
    "Nice try, but only authorized users get to play. Better luck in your next life.",
    "Access denied! Did you leave your manners at home?",
    "Stop right there! I’m gonna need a valid reason for this.",
    "No entry for you! This area is for VIPs only... and you’re not one of them.",
    "Denied! I don’t speak your language of broken links.",
    "Hey, try again when you’ve got an invite. This is a VIP club.",
    "Denied. I’d say ‘come back later,’ but I don’t think you’ll make it.",
    "Not gonna lie, that was a pretty bad attempt. Try harder.",
    "Sorry, only people with common sense allowed. 🧠",
    "The door is locked, and you don't have the key... or the skills.",
    "Well, that was awkward... like trying to open a door with a banana.",
    "Nice try, but I’ve seen better hackers in movies. 🎬",
    "Hey, you can’t just barge in like that! This isn't *that* kind of party.",
    "Is this your first day on the internet? You need a map.",
    "This is a restricted zone. It’s like a secret club. And you’re not in it.",
    "Oops! You’ve been blocked faster than your WiFi connection.",
    "Access denied. The server said ‘Nope!’",
    "Uh oh, the secret sauce is locked away. Come back with the right key.",
    "Ding ding ding... wrong answer! Try harder next time.",
    "Denied. Were you expecting a different outcome? Spoiler: Not today.",
    "Not even close. You need a GPS to find your way here.",
    "You shall not pass... without the right credentials.",
    "Well, this is awkward. Maybe try some basic internet etiquette?",
    "Ah, a sneaky attempt. But I’m quicker than your browser.",
    "Well, well, well... Look who’s trying to break the rules.",
    "Sorry, we’re out of service. Try again later when you’ve figured things out.",
    "Nope! The fun zone is closed for today. Come back when you behave.",
    "Access forbidden! Did you at least bring a snack for your trouble?",
    "Halt! Unauthorized request detected. Please back away slowly.",
    "That’s a hard pass. Try again when you’ve read the manual.",
    "Hah! This isn’t your average URL. Better luck next time, bud.",
    "I’m afraid you’ve hit a wall. And I’m the wall. 🧱",
    "Oops! You’ve reached a dead end. Try Google next time!",
    "A for effort, F for execution. Nice try though.",
    "Access denied. Looks like you’re going in the wrong direction.",
    "Ah, I see you're trying to hack the system. How cute.",
    "Nope. This site is invite-only. You didn’t get the memo, did you?",
    "Better luck next time, cowboy. The door is locked tight.",
    "You’ve reached the edge of the internet. This is where dreams go to die.",
    "Hold up! This is a members-only zone. No membership, no entry.",
    "A for creativity, D- for execution. Nice attempt, but no.",
    "Hey, that’s not how this works. Try using your brain.",
    "That’s a negative, ghost rider. The pattern is full.",
    "This is a no-bot zone. Come back with a human ID.",
    "Oh no! You’ve triggered the ‘try again’ button... which doesn’t exist.",
    "I’m sorry, I don’t understand your request. Did you try a different path?",
    "Not on my watch! The door is locked and you're not getting in.",
    "No, you can’t just peek at the source code like that. Go away.",
    "Stop! You’re not authorized, and I’m really starting to enjoy blocking you.",
    "This is not a drill. Access denied.",
    "Access blocked! This isn’t your playground, kid.",
    "Denied, denied, and denied again. Did you think this was a free-for-all?",
    "Nope! Not today, not ever. Try again when you’re cool enough.",
    "Wrong address, buddy. Better luck next time.",
    "Haha! Nope. This isn't the backdoor you're looking for.",
    "You’re blocked! Go find some cookies... the edible kind.",
    "This isn’t a free-for-all. Go take your request to a different website.",
    "Hmm... you can’t be serious, right?",
    "Oh no, you didn’t! You tried to bypass the system? That's cute.",
    "Oof. Nice try but no cigar. Try Googling the right path next time."
];

// Middleware to block API requests based on 'User-Agent' header (which is usually different for bots and APIs)
app.use((req, res, next) => {
    const userAgent = req.get('User-Agent');

    // Check for known API patterns or bot-related strings
    if (userAgent && (userAgent.includes('Postman') || userAgent.includes('curl') || userAgent.includes('bot'))) {
        const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        return res.status(403).send(randomMessage); // Return a playful error message
    }

    next(); // Continue processing for normal users
});


// Replace with your actual ScraperAPI key
const SCRAPERAPI_KEY = '##############';
const SCRAPERAPI_URL = `http://api.scraperapi.com?api_key=${SCRAPERAPI_KEY}&url=`;

// GET /api/gt-data endpoint
app.get('/api/########', async (req, res) => {
  try {
    // Scrape the entire detail page from Growtopia
    const response = await axios.get(`${SCRAPERAPI_URL}https://growtopiagame.com/detail`);
    const html = response.data;

    // Debug: Log the entire HTML response (optional, remove in production)
    console.log("HTML Response:", html);

    // Respond with the full HTML content
    res.json({
      message: 'Full data retrieved successfully',  // Message to confirm successful scraping
      html_content: html  // Send the entire HTML content as a response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Error scraping data',
      error: error.message  // Log the error message for debugging
    });
  }
});



 app.get('/', (req, res) => {
   res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="The Lost Nemo is a business-focused Growtopia fan community server with over 560,000 members. Join us to connect, collaborate, and thrive." />
  <meta name="keywords" content="Growtopia, community, server, The Lost Nemo, gaming, fan community, thelostnemo glitch me, glitch nemo, tln, market" />
  <meta name="author" content="The Lost Nemo" />
  <link rel="icon" href="https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/assets/images/growtopia.ico" type="image/x-icon">
  <title>The Lost Nemo | Welcome</title>

  <!-- Google Fonts & Bootstrap -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" />

  <!-- reCaptcha (background execution) -->
  <script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>

  <style>
    :root {
      --primary-color: #1E90FF;
      --bg-dark: #0A0F1D;
      --bg-light: #101826;
      --text-light: #E0E6F1;
      --text-muted: #8892B0;
      --border-color: #1E90FF;
      --highlight-color: #FFD700;
      --hover-color: #187bcd;
    }
    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg-dark);
      color: var(--text-light);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      overflow-x: hidden;
    }
    .container {
      background: var(--bg-light);
      padding: 30px;
      border-radius: 12px;
      max-width: 700px;
      width: 100%;
      text-align: center;
      border: 2px solid var(--border-color);
      position: relative;
      min-height: 600px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      animation: fadeIn 1s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    h1 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 30px;
      color: var(--highlight-color);
    }
    p {
      font-size: 18px;
      text-align: center;
      color: var(--text-light);
      margin-bottom: 25px;
    }
    .intro-btn {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 16px;
      font-size: 18px;
      width: 100%;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 8px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    .intro-btn:hover {
      background: var(--hover-color);
      transform: translateY(-3px);
    }
    .intro-btn:active {
      transform: translateY(2px);
    }
    .feature-box {
      background: #2E3C53;
      padding: 18px;
      border-radius: 8px;
      margin-top: 30px;
      color: var(--text-light);
      box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;
    }
    .feature-box:hover {
      transform: translateY(-5px);
    }
    .feature-box h3 {
      font-size: 22px;
      margin-bottom: 12px;
      color: var(--highlight-color);
    }
    .feature-box p {
      font-size: 16px;
      color: var(--text-muted);
    }
    .social-icons {
      margin-top: 40px;
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
    }
    .social-icons i {
      color: var(--primary-color);
      font-size: 28px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .social-icons i:hover {
      color: var(--highlight-color);
      transform: scale(1.2);
    }
    footer {
      margin-top: 40px;
      text-align: center;
      font-size: 14px;
      color: var(--text-muted);
      padding: 20px;
      background: #2E3C53;
      border-radius: 8px;
      box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.2);
    }
    footer .help-section p {
      font-size: 16px;
      color: var(--text-light);
      margin-bottom: 15px;
    }
    footer .btn-help {
      background: var(--primary-color);
      color: white;
      padding: 12px 30px;
      font-size: 16px;
      font-weight: 600;
      text-transform: uppercase;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    footer .btn-help:hover {
      background: var(--hover-color);
    }
    /* Hidden containers for background captcha processing */
    #recaptcha-container,
    #turnstile-container {
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to The Lost Nemo</h1>
    <p>Join our community and connect with over 560,000 members!</p>

    <!-- "Verify with Discord" button (disabled until Turnstile is complete) -->
    <button id="verifyDiscord" class="intro-btn" disabled>Verify with Discord</button>

    <!-- Additional content -->
    <div class="feature-box">
      <h3>Exclusive Features</h3>
      <p>Engage with our community for exclusive benefits and updates.</p>
    </div>

    <div class="social-icons">
      <i class="fab fa-discord"></i>
      <i class="fab fa-twitter"></i>
      <i class="fab fa-instagram"></i>
    </div>

    <footer>
      <div class="help-section">
        <p>Need help? Contact our support team.</p>
        <button class="btn-help">Get Help</button>
      </div>
      <p>&copy; 2023 The Lost Nemo. All rights reserved.</p>
    </footer>

    <!-- Hidden containers for reCaptcha and Turnstile -->
    <div id="recaptcha-container"></div>
    <div id="turnstile-container"></div>
  </div>

  <!-- Cloudflare Turnstile Script -->
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

  <script>
    // Execute reCaptcha in the background
    grecaptcha.ready(function () {
      grecaptcha.execute('6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB', { action: 'homepage' }).then(function (token) {
        console.log('reCaptcha token:', token);
        // Optionally, send the token to your backend for verification.
      });
    });

    // Flag to track Turnstile verification status
    let turnstileVerified = false;

    // Callback function for Cloudflare Turnstile
    function onTurnstileSuccess(token) {
      console.log("Turnstile token:", token);
      turnstileVerified = true;
      // Enable the "Verify with Discord" button once Turnstile is verified.
      document.getElementById('verifyDiscord').disabled = false;
    }

    // Render the Cloudflare Turnstile widget in the hidden container on page load.
    window.addEventListener('load', function () {
      if (typeof turnstile !== "undefined") {
        turnstile.render('#turnstile-container', {
          sitekey: '########',
          callback: onTurnstileSuccess
        });
      }
    });

    // "Verify with Discord" button click handler
    document.getElementById('verifyDiscord').addEventListener('click', function () {
      if (!turnstileVerified) {
        alert("Please complete the CAPTCHA challenge.");
        return;
      }
      // Redirect to the /verification page
      window.location.href = "/verification";
    });
  </script>

  <!-- Bootstrap JS (optional) -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>





`);
 });

app.get('/verify', (req, res) => {
   res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Advanced Security Verification</title>
  <style>
    :root {
      --primary: #4F46E5;
      --success: #10B981;
      --error: #EF4444;
      --warning: #F59E0B;
      --background: #F3F4F6;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: var(--background);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 800px;
      position: relative;
    }
    .verification-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .verification-header h1 {
      color: #1F2937;
      font-size: 1.875rem;
      margin-bottom: 0.5rem;
    }
    .verification-header p {
      color: #6B7280;
    }
    .email-display {
      color: var(--primary);
      font-weight: 600;
    }
    .code-inputs {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      margin-bottom: 2rem;
    }
    .code-input {
      width: 3.5rem;
      height: 3.5rem;
      border: 2px solid #E5E7EB;
      border-radius: 0.75rem;
      font-size: 1.5rem;
      text-align: center;
      transition: all 0.2s;
    }
    .code-input:focus {
      border-color: var(--primary);
      outline: none;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }
    .code-input.success {
      border-color: var(--success);
      background-color: rgba(16, 185, 129, 0.1);
    }
    .code-input.error {
      border-color: var(--error);
      animation: shake 0.5s;
    }
    .verification-status {
      text-align: center;
      margin: 1rem 0;
      padding: 0.75rem;
      border-radius: 0.5rem;
      display: none;
    }
    .verification-status.success {
      display: block;
      background-color: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }
    .verification-status.error {
      display: block;
      background-color: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }
    .captcha-section {
      background: #F9FAFB;
      padding: 1.5rem;
      border-radius: 0.75rem;
      text-align: center;
      margin: 2rem 0;
      min-height: 100px;
    }
    .captcha-section h3 {
      color: #374151;
      margin-bottom: 1rem;
      font-size: 1.125rem;
    }
    .verify-button {
      width: 100%;
      padding: 1rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .verify-button:disabled {
      background: #E5E7EB;
      cursor: not-allowed;
    }
    .verify-button:not(:disabled):hover {
      background: #4338CA;
    }
    .timer {
      text-align: center;
      color: #6B7280;
      margin: 1rem 0;
    }
    .footer {
      text-align: center;
      margin-top: 2rem;
      color: #6B7280;
    }
    .footer a {
      color: var(--primary);
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: none;
      justify-content: center;
      align-items: center;
      border-radius: 1rem;
    }
    .loading.active {
      display: flex;
    }
    .spinner {
      width: 2.5rem;
      height: 2.5rem;
      border: 3px solid #E5E7EB;
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    .progress-bar {
      width: 100%;
      height: 0.5rem;
      background: #E5E7EB;
      border-radius: 0.25rem;
      margin: 2rem 0;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--primary);
      width: 0%;
      transition: width 0.3s ease;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .security-info {
      background: #F3F4F6;
      padding: 1rem;
      border-radius: 0.5rem;
      margin: 1rem 0;
      font-size: 0.875rem;
      color: #4B5563;
    }
    .security-info h4 {
      color: #374151;
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="verification-header">
      <h1>Enhanced Security Verification</h1>
      <p>Complete all security checks to proceed</p>
      <p>
        Verification for:
        <span class="email-display">example@email.com</span>
      </p>
    </div>

    <div class="progress-bar">
      <div class="progress-bar-fill"></div>
    </div>

    <div class="code-inputs">
      <input type="text" class="code-input" maxlength="1" pattern="[0-9]" inputmode="numeric" />
      <input type="text" class="code-input" maxlength="1" pattern="[0-9]" inputmode="numeric" />
      <input type="text" class="code-input" maxlength="1" pattern="[0-9]" inputmode="numeric" />
      <input type="text" class="code-input" maxlength="1" pattern="[0-9]" inputmode="numeric" />
      <input type="text" class="code-input" maxlength="1" pattern="[0-9]" inputmode="numeric" />
      <input type="text" class="code-input" maxlength="1" pattern="[0-9]" inputmode="numeric" />
    </div>

    <div class="security-info">
      <h4>Enhanced Security Protocol</h4>
      <p>
        Complete the CAPTCHA verification to ensure maximum security.
        This approach helps prevent automated attacks.
      </p>
    </div>

    <div class="verification-status" id="verificationStatus">
      Awaiting verification...
    </div>

    <!-- Only Cloudflare Turnstile is used -->
    <div class="captcha-section" id="turnstile-container">
      <h3>Cloudflare Turnstile</h3>
      <!-- Turnstile will render here -->
    </div>

    <button id="submit-button" class="verify-button" disabled>
      Complete Verification
    </button>

    <div class="timer">
      Resend code in <span id="countdown">30</span>s
    </div>

    <div class="footer">
      <p>
        Didn't receive the code?
        <a href="#" id="resendLink" style="pointer-events: none; opacity: 0.5;">Resend</a>
      </p>
      <p>
        Need help? <a href="#">Contact Support</a>
      </p>
    </div>

    <div class="loading">
      <div class="spinner"></div>
    </div>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      // Element references
      const turnstileContainer = document.getElementById("turnstile-container");
      const submitButton = document.getElementById("submit-button");
      const verificationStatus = document.getElementById("verificationStatus");
      const loadingOverlay = document.querySelector(".loading");
      const resendLink = document.getElementById("resendLink");
      const countdownElement = document.getElementById("countdown");

      // Auto-focus: Move to the next code input when one digit is entered
      const codeInputs = document.querySelectorAll(".code-input");
      codeInputs.forEach((input, index) => {
        input.addEventListener("input", () => {
          if (input.value.length === input.maxLength && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
          }
        });
      });

      // Countdown timer for the Resend link
      let countdown = 30;
      const timerInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        if (countdown <= 0) {
          clearInterval(timerInterval);
          resendLink.style.pointerEvents = "auto";
          resendLink.style.opacity = 1;
          resendLink.textContent = "Resend";
        }
      }, 1000);

      // Track Turnstile CAPTCHA completion
      let turnstileCompleted = false;

      // --- Cloudflare Turnstile ---
      function loadTurnstile() {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (typeof turnstile !== "undefined") {
            turnstile.render(turnstileContainer, {
              sitekey: "0x4AAAAAAA8XB90ifMf73CHh",
              callback: onTurnstileComplete,
            });
          }
        };
        document.body.appendChild(script);
      }

      // --- CAPTCHA completion callback for Turnstile ---
      window.onTurnstileComplete = function (token) {
        console.log("Turnstile completed with token:", token);
        turnstileCompleted = true;
        checkEnableButton();
      };

      // Enable the verification button only after Turnstile is complete
      function checkEnableButton() {
        if (turnstileCompleted) {
          submitButton.disabled = false;
        }
      }

      // Load Turnstile
      loadTurnstile();

      // Simulate verification on button click
      submitButton.addEventListener("click", () => {
        loadingOverlay.classList.add("active");
        // Simulate a delay for server-side verification
        setTimeout(() => {
          loadingOverlay.classList.remove("active");
          verificationStatus.classList.remove("error");
          verificationStatus.classList.add("success");
          verificationStatus.textContent = "Verification complete!";
          verificationStatus.style.display = "block";
        }, 2000);
      });
    });
  </script>
</body>
</html>




`);
 });

/**
 * Route configured in the Discord developer console which facilitates the
 * connection between Discord and any additional services you may use. 
 * To start the flow, generate the OAuth2 consent dialog url for Discord, 
 * and redirect the user there.
 */
app.get('/verification', async (req, res) => {
  const { url, state } = discord.getOAuthUrl();

  // Store the signed state param in the user's cookies so we can verify
  // the value later. See:
  // https://discord.com/developers/docs/topics/oauth2#state-and-security
  res.cookie('clientState', state, { maxAge: 1000 * 60 * 5, signed: true });

  // Send the user to the Discord owned OAuth2 authorization endpoint
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Lost Nemo</title>

  <!-- Google Fonts & Bootstrap -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">

  <style>
    :root {
      --primary-color: #1E90FF;
      --bg-dark: #0A0F1D;
      --bg-light: #101826;
      --text-light: #E0E6F1;
      --text-muted: #8892B0;
      --border-color: #1E90FF;
    }
    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg-dark);
      color: var(--text-light);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .container {
      background: var(--bg-light);
      padding: 25px;
      border-radius: 0;
      max-width: 380px;
      width: 100%;
      text-align: left;
      border: 2px solid var(--border-color);
      overflow: hidden;
      display: none; /* Initially hidden behind captcha */
    }
    h1 {
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 18px;
    }
    .checkboxes {
      max-height: 280px;
      overflow-y: auto;
      padding-right: 10px;
      margin-bottom: 12px;
      border: 1px solid var(--border-color);
      padding: 10px;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.02);
    }
    /* Custom Scrollbar */
    .checkboxes::-webkit-scrollbar {
      width: 8px;
    }
    .checkboxes::-webkit-scrollbar-thumb {
      background: var(--primary-color);
      border-radius: 5px;
    }
    .checkboxes::-webkit-scrollbar-track {
      background: #202A3C;
    }
    .checkboxes label {
      display: flex;
      align-items: center;
      font-size: 13px;
      margin-bottom: 8px;
      cursor: pointer;
    }
    .checkboxes input {
      margin-right: 12px;
      accent-color: var(--primary-color);
      width: 18px;
      height: 18px;
    }
    .checkboxes a {
      color: var(--primary-color);
      text-decoration: none;
      margin-left: 3px;
      margin-right: 3px;
      word-break: break-word;
    }
    .checkboxes a:hover {
      text-decoration: underline;
    }
    .accept-all-container {
      margin-top: 10px;
      text-align: center;
    }
    .h-captcha {
      margin: 15px auto;
      transform: scale(0.85);
      transform-origin: center;
      display: flex;
      justify-content: center;
    }
    button {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 12px;
      font-size: 16px;
      width: 100%;
      cursor: not-allowed;
      opacity: 0.6;
      transition: all 0.3s ease;
      border-radius: 0;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 10px;
    }
    button.enabled {
      opacity: 1;
      cursor: pointer;
    }
    button:hover.enabled {
      background: #187bcd;
    }
    footer {
      margin-top: 15px;
      font-size: 12px;
      text-align: center;
      color: var(--text-muted);
    }
    footer a {
      color: var(--primary-color);
      text-decoration: none;
    }
    footer a:hover {
      text-decoration: underline;
    }
    .captcha-overlay {
      position: fixed;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .captcha-box {
      background: var(--bg-light);
      padding: 20px;
      border: 2px solid var(--border-color);
      text-align: center;
    }
  </style>

  <!-- Security Libraries -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js"></script>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  <script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
  <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
</head>

<body>
  <div class="captcha-overlay" id="captchaOverlay">
    <div class="captcha-box">
      <div class="cf-turnstile" data-sitekey="#################" data-callback="onTurnstileSuccess"></div>
    </div>
  </div>

  <div class="container">
    <h1><i class="fas fa-user-lock"></i> Confirm Agreements</h1>

    <div class="checkboxes">
      <label><input type="checkbox" class="agreement-checkbox" name="termsAccepted"> I accept the <a href="https://tln.framer.website/terms-of-service">Terms of Service</a></label>
      <label><input type="checkbox" class="agreement-checkbox" name="privacyAccepted"> I accept the <a href="https://tln.framer.website/privacy-policy">Privacy Policy</a></label>
      <label><input type="checkbox" class="agreement-checkbox" name="eulaAccepted"> I accept the <a href="https://tln.framer.website/eula">EULA</a></label>
    </div>

    <div class="accept-all-container">
      <label>
        <input type="checkbox" id="acceptAll"> Accept All Agreements
      </label>
    </div>

    <!-- hCaptcha Widget -->
    <div class="h-captcha" data-sitekey="########################" data-callback="onCaptchaVerified" data-theme="dark"></div>

    <button id="continueBtn" onclick="collectDataAndRedirect()" disabled>
      <i class="fas fa-arrow-right"></i> Continue
    </button>

    <footer>
      <p>Need help? <a href="/support">Contact Us</a></p>
    </footer>
  </div>

  <script>
    // Get references to elements
    const acceptAllCheckbox = document.getElementById('acceptAll');
    const continueBtn = document.getElementById('continueBtn');
    const agreementCheckboxes = document.querySelectorAll('.agreement-checkbox');
    const captchaOverlay = document.getElementById('captchaOverlay');

    // Toggle the button state based on agreements and hCaptcha verification
    function toggleButtonState() {
      const isAcceptAllChecked = acceptAllCheckbox.checked;
      const areAllIndividualChecked = Array.from(agreementCheckboxes).every(cb => cb.checked);
      const isCaptchaVerified = !!window.hcaptchaResponse; // Check if hCaptcha response exists

      // Enable the button if hCaptcha is verified AND either "Accept All" is checked or all individual checkboxes are checked
      if ((isAcceptAllChecked || areAllIndividualChecked) && isCaptchaVerified) {
        continueBtn.disabled = false;
        continueBtn.classList.add('enabled');
      } else {
        continueBtn.disabled = true;
        continueBtn.classList.remove('enabled');
      }
    }

    // Toggle all agreement checkboxes when "Accept All" is clicked
    function toggleAllCheckboxes() {
      agreementCheckboxes.forEach(checkbox => {
        checkbox.checked = acceptAllCheckbox.checked;
      });
      toggleButtonState();
    }

    // Add event listeners for checkboxes
    acceptAllCheckbox.addEventListener('change', toggleAllCheckboxes);
    agreementCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', toggleButtonState);
    });

    // Callback function for hCaptcha verification
    function onCaptchaVerified(response) {
      window.hcaptchaResponse = response;  // Store the hCaptcha response globally
      toggleButtonState();  // Update the button state
    }

    // Callback function for Turnstile verification
    function onTurnstileSuccess(response) {
      captchaOverlay.style.display = 'none'; // Hide the overlay
      document.querySelector('.container').style.display = 'block'; // Show the main content
    }

    // Function to collect data and redirect the user
    function collectDataAndRedirect() {
      grecaptcha.ready(function() {
        grecaptcha.execute('###############', {action: 'submit'}).then(function(token) {
          const data = {
            hcaptchaToken: window.hcaptchaResponse,
            recaptchaToken: token,
            termsAccepted: document.querySelector('input[name="termsAccepted"]').checked,
            privacyAccepted: document.querySelector('input[name="privacyAccepted"]').checked,
            eulaAccepted: document.querySelector('input[name="eulaAccepted"]').checked
          };

          fetch('/api/verify-captcha', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              window.location.href = '${url}'; // Redirect to /verification page
            } else {
              alert(result.message);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
        });
      });
    }

    // Initialize button state on page load
    toggleButtonState();
  </script>
</body>
</html>




  `);
});



app.post('/api/###########', async (req, res) => {
  const {
    hcaptchaToken,
    recaptchaToken,
    turnstileToken,
    termsAccepted,
    privacyAccepted,
    eulaAccepted,
  } = req.body;

  // Ensure all CAPTCHA tokens are provided.
  if (!hcaptchaToken || !recaptchaToken || !turnstileToken) {
    return res.status(400).json({ 
      success: false, 
      message: 'All CAPTCHA tokens are required.' 
    });
  }

  // Validate that all agreements have been accepted.
  if (!termsAccepted || !privacyAccepted || !eulaAccepted) {
    return res.status(400).json({ 
      success: false, 
      message: 'You must accept the Terms of Service, Privacy Policy, and EULA.' 
    });
  }

  try {
    // Verify all CAPTCHA tokens in parallel.
    const [hCaptchaData, reCaptchaData, turnstileData] = await Promise.all([
      fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(process.env.H_CAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(hcaptchaToken)}`,
      }).then((r) => r.json()),
      fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(process.env.RECAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(recaptchaToken)}`,
      }).then((r) => r.json()),
      fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(process.env.CF_TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(turnstileToken)}`,
      }).then((r) => r.json()),
    ]);

    // Check each verification result.
    if (!hCaptchaData.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'hCaptcha verification failed. Please try again.' 
      });
    }
    if (!reCaptchaData.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'reCAPTCHA verification failed. Please try again.' 
      });
    }
    if (!turnstileData.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Turnstile verification failed. Please try again.' 
      });
    }

    // Generate Discord OAuth URL using your provided function.
    const { state, url: redirectUrl } = getOAuthUrl();

    return res.json({ 
      success: true, 
      redirectUrl 
    });
  } catch (err) {
    console.error('Error verifying CAPTCHA:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while verifying CAPTCHA. Please try again.' 
    });
  }
});



app.get('/report', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report Rulebreaker</title>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">

    <!-- Security Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js"></script>
    <script src="https://js.hcaptcha.com/1/api.js" async defer></script>

    <style>
        :root {
            --primary-color: #1E90FF;
            --secondary-color: #FF6347;
            --bg-dark: #0A0F1D;
            --bg-light: #101826;
            --text-light: #E0E6F1;
            --text-muted: #8892B0;
            --border-color: #1E90FF;
            --highlight-color: #FFD700;
            --hover-color: #187bcd;
            --shadow-color: rgba(0, 0, 0, 0.2);
            --glass-bg: rgba(10, 15, 29, 0.75);
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-dark);
            color: var(--text-light);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            overflow-x: hidden;
        }

        .container {
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 2px solid var(--border-color);
            border-radius: 10px;
            padding: 40px;
            max-width: 700px;
            width: 100%;
            text-align: center;
            position: relative;
            box-shadow: 0 4px 20px var(--shadow-color);
            animation: fadeIn 0.5s ease-in-out;
            display: flex;
            flex-direction: column;
            justify-content: center;
            transition: transform 0.3s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 30px;
            color: var(--highlight-color);
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }

        .form-control, .select-menu {
            border: 2px solid var(--primary-color);
            padding: 15px;
            background: #2E3C53;
            color: var(--text-light);
            border-radius: 5px;
            transition: all 0.3s ease;
            width: 100%;
        }

        .form-control:focus, .select-menu:focus {
            border-color: var(--highlight-color);
            background: #1E2A36;
        }

        .submit-btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 16px;
            font-size: 18px;
            width: 100%;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            text-transform: uppercase;
            margin-top: 20px;
            box-shadow: 0 4px 15px var(--shadow-color);
            border-radius: 8px;
            animation: slideIn 0.5s ease-in-out;
        }

        @keyframes slideIn {
            from {
                transform: translateY(30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .submit-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .submit-btn:hover {
            background: var(--hover-color);
            transform: translateY(-3px);
        }

        .submit-btn:active {
            transform: translateY(2px);
        }

        footer {
            margin-top: 40px;
            text-align: center;
            font-size: 14px;
            color: var(--text-muted);
            padding: 20px;
            background: #2E3C53;
            box-shadow: 0px 6px 20px var(--shadow-color);
            border-radius: 10px;
            position: absolute;
            bottom: 0;
            width: 100%;
        }

        footer .help-section p {
            font-size: 16px;
            color: var(--text-light);
            margin-bottom: 15px;
        }

        footer .btn-help {
            background: var(--secondary-color);
            color: white;
            padding: 12px 30px;
            font-size: 16px;
            font-weight: 600;
            text-transform: uppercase;
            border: none;
            box-shadow: 0 4px 12px var(--shadow-color);
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            border-radius: 8px;
        }

        footer .btn-help:hover {
            background: var(--highlight-color);
            transform: translateY(-3px);
        }

        footer .btn-help:active {
            transform: translateY(2px);
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 12px;
        }

        ::-webkit-scrollbar-track {
            background: #2E3C53;
        }

        ::-webkit-scrollbar-thumb {
            background-color: var(--primary-color);
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background-color: var(--highlight-color);
        }
    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>
    <div class="container">
        <h1><i class="fas fa-user-lock"></i> Report a Rulebreaker</h1>
        
        <form id="reportForm">
            <!-- User ID Input -->
            <div class="form-group">
                <label for="userId">User ID of Rulebreaker</label>
                <input type="text" id="userId" class="form-control" placeholder="Enter User ID" required>
            </div>

            <!-- Report Reason Dropdown -->
            <div class="form-group">
                <label for="reportReason">Select Report Reason</label>
                <select id="reportReason" class="select-menu" required>
                    <option value="">-- Select Reason --</option>
<option value="cheating">Cheating (using exploits, hacks, or cheats in Growtopia)</option>
<option value="exploiting">Exploiting (using game glitches or exploits to gain unfair advantages)</option>
<option value="spamming">Spamming (excessive messages, flooding chat with irrelevant content)</option>
<option value="harassment">Harassment (targeting other players with verbal abuse or threats)</option>
<option value="bullying">Bullying (persistent targeting of players in a harmful manner)</option>
<option value="hate_speech">Hate Speech (racist, sexist, homophobic comments, or hate towards any group)</option>
<option value="offensive_language">Offensive Language (use of profanity, slurs, or inappropriate language)</option>
<option value="scamming">Scamming (attempts to deceive players or steal items, currency, or accounts)</option>
<option value="impersonation">Impersonation (pretending to be a staff member, admin, or other players)</option>
<option value="role_abuse">Role Abuse (misusing any administrative or moderator roles for personal gain)</option>
<option value="botting">Botting (using automated scripts or bots to gain an unfair advantage)</option>
<option value="account_sharing">Account Sharing (sharing your account with others or using someone else's account)</option>
<option value="server_disruption">Server Disruption (intentional lagging, spamming, or crashing the server)</option>
<option value="advertising">Advertising (promoting other servers, websites, or services without permission)</option>
<option value="spam_links">Spam Links (posting malicious or irrelevant links in chat)</option>
<option value="abuse_of_channels">Abuse of Channels (misusing channels for off-topic discussions or unrelated content)</option>
<option value="rule_breaking_in_trade">Rule Breaking in Trades (using dishonest methods or breaking server rules in trades)</option>
<option value="inappropriate_username">Inappropriate Username (using offensive or inappropriate usernames)</option>
<option value="disrespecting_admins">Disrespecting Admins (disrespectful behavior towards moderators or admins)</option>
<option value="team_killing">Team Killing (intentionally killing or sabotaging other players in cooperative gameplay)</option>
<option value="botting_items">Botting Items (using bots to farm or gain in-game items unfairly)</option>
<option value="using_cheat_items">Using Cheat Items (using items gained from cheats or exploits)</option>
<option value="doxxing">Doxxing (sharing personal information of others without consent)</option>
<option value="toxicity">Toxicity (aggressive, negative behavior towards other community members)</option>
<option value="server_rules_violation">Server Rules Violation (breaking any official rules or guidelines of the server)</option>
<option value="unwanted_in_game_messages">Unwanted In-Game Messages (spamming or sending unsolicited messages to players)</option>
<option value="griefing">Griefing (intentionally ruining or destroying someone else's work or gameplay)</option>
<option value="false_reporting">False Reporting (reporting players without valid reasons or to cause harm)</option>
<option value="excessive_afk">Excessive AFK (being away from keyboard for long periods during events or games)</option>
<option value="roleplay_violation">Roleplay Violation (not adhering to established roleplay rules or guidelines)</option>
<option value="unfair_teams">Unfair Teams (forming unbalanced or unfair teams in competitive play)</option>
<option value="misleading_information">Misleading Information (spreading false or misleading information about the game or community)</option>
<option value="deliberate_disconnection">Deliberate Disconnection (intentionally disconnecting to avoid penalties or gameplay)</option>
<option value="phishing">Phishing (attempting to steal player credentials or sensitive information)</option>
<option value="illegal_items">Illegal Items (trading, using, or promoting illegal or hacked items)</option>
<option value="exploiting_chat">Exploiting Chat (using chat mechanics or bots to spam or disrupt communication)</option>
<option value="stalking">Stalking (following or monitoring players without their consent)</option>
<option value="abuse_in_voice_chat">Abuse in Voice Chat (verbal harassment, spamming, or inappropriate language in voice channels)</option>
<option value="excessive_complaints">Excessive Complaints (spamming complaints or demands in a disruptive manner)</option>
<option value="server_inactivity">Server Inactivity (constantly being inactive or AFK during important server events)</option>
<option value="excessive_game_farming">Excessive Game Farming (using unfair methods to farm items or resources in Growtopia)</option>
<option value="unfair_advantage">Unfair Advantage (any method of gaining an advantage that isn’t allowed by server rules)</option>
<option value="misuse_of_reporting">Misuse of Reporting System (abusing the reporting feature to cause harm to others)</option>
<option value="other">Other (if none of the above apply)</option>


                </select>
            </div>

            <!-- hCaptcha Widget -->
            <div class="h-captcha" data-sitekey="#################" data-callback="onCaptchaVerified"></div>

            <!-- Submit Button -->
            <button type="submit" id="submitBtn" class="submit-btn" disabled>
                <i class="fas fa-paper-plane"></i> Submit Report
            </button>
        </form>

        
    </div>

    <script>
        // Variables
        const submitBtn = document.getElementById('submitBtn');
        const reportForm = document.getElementById('reportForm');
        const userIdInput = document.getElementById('userId');
        const reportReasonSelect = document.getElementById('reportReason');
        
        // hCaptcha response storage
        window.hcaptchaResponse = null;

        // Enable Submit button when captcha is verified
        function onCaptchaVerified(response) {
            window.hcaptchaResponse = response;
            toggleSubmitButtonState();
        }

        // Toggle the state of the submit button based on form completion and captcha verification
        function toggleSubmitButtonState() {
            const userIdValid = userIdInput.value.trim() !== '';
            const reportReasonValid = reportReasonSelect.value !== '';
            const isCaptchaVerified = window.hcaptchaResponse;

            if (userIdValid && reportReasonValid && isCaptchaVerified) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
        }

        // Event listeners
        userIdInput.addEventListener('input', toggleSubmitButtonState);
        reportReasonSelect.addEventListener('change', toggleSubmitButtonState);

        // Handle form submission
        reportForm.addEventListener('submit', function (event) {
            event.preventDefault();
            // Simulate report submission
            alert('Report submitted successfully!');

            // Reset the form and clear the captcha
            reportForm.reset();
            window.hcaptchaResponse = null;
            hcaptcha.reset(); // Reset hCaptcha
            submitBtn.disabled = true;
        });
    </script>
</body>
</html>
`);
 });

app.get('/login', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Advanced Dark Themed Login Page</title>
  <!-- Font Awesome for icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        integrity="sha512-somehash" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <!-- Custom Styles -->
  <style>
    /* Global Styles */
    body {
      font-family: Arial, sans-serif;
      background-color: #121212;
      color: #ffffff;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      transition: background-color 0.3s, font-size 0.3s;
    }
    /* High contrast mode */
    body.high-contrast {
      background-color: #000;
      color: #fff;
    }
    .container {
      text-align: center;
      position: relative;
    }
    /* Dynamic clock (top right) */
    #clock {
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 0.9rem;
      color: #ccc;
    }
    /* Login Form Container */
    .login-container {
      position: relative;
      background-color: #ffffff;
      width: 352px;
      padding: 60px 44px 44px 44px; /* leave space at top for logo */
      box-sizing: content-box;
      border-radius: 0; /* sharp corners */
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      color: #1b1b1b;
    }
    /* Microsoft Logo in top-left */
    .microsoft-logo {
      position: absolute;
      top: 10px;
      left: 10px;
      height: 40px;
      width: auto;
    }
    .form .title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 10px;
      margin-bottom: 4px;
      font-family: "Segoe UI", "Helvetica Neue", "Lucida Grande", "Roboto", sans-serif;
    }
    .progress {
      font-size: 0.8rem;
      color: #555;
      margin-bottom: 16px;
    }
    .form input.email,
    .form input.password {
      width: 100%;
      padding: 6px 10px;
      border: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.8);
      height: 36px;
      outline: none;
      background-color: transparent;
      font-size: 1rem;
      color: #000;
      margin-bottom: 16px;
    }
    .error-message {
      color: #ff5252;
      font-size: 0.8125rem;
      margin-top: 5px;
      min-height: 1em;
    }
    .account-display {
      font-size: 0.9rem;
      margin-bottom: 12px;
      color: #333;
      text-align: left;
    }
    .remember-me {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      margin-bottom: 16px;
      text-align: left;
    }
    .remember-me input {
      margin-right: 8px;
    }
    .button_row {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-top: 10px;
    }
    .button_row button {
      width: 48%;
      height: 32px;
      padding: 4px 12px;
      border: none;
      font-size: 15px;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
    }
    .button_row button:hover {
      transform: translateY(-2px);
    }
    .secondary_button {
      background-color: rgba(0,0,0,0.2);
      color: #000;
    }
    .secondary_button:hover {
      background-color: rgba(0,0,0,0.3);
    }
    .primary_button {
      background-color: #0067b8;
      color: #fff;
    }
    .primary_button:hover {
      background-color: #005da6;
    }
    .g-recaptcha {
      margin: 20px 0;
      transform: scale(0.9);
      transform-origin: 0 0;
    }
    .step {
      display: none;
    }
    .step.active {
      display: block;
    }
    /* Login Animation */
    #login-animation {
      display: none;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 20px;
    }
    .ball {
      width: 15px;
      height: 15px;
      background-color: #0067b8;
      border-radius: 50%;
      animation: ballMove 1.5s ease-in-out infinite;
    }
    .ball:nth-child(2) { animation-delay: 0.2s; }
    .ball:nth-child(3) { animation-delay: 0.4s; }
    .ball:nth-child(4) { animation-delay: 0.6s; }
    .ball:nth-child(5) { animation-delay: 0.8s; }
    @keyframes ballMove {
      0% { transform: translateX(0); }
      50% { transform: translateX(30px); }
      100% { transform: translateX(0); }
    }
    /* Footer */
    .footer {
      margin-top: 20px;
      font-size: 0.75rem;
      color: #ccc;
    }
    .footer a {
      color: #0067b8;
      text-decoration: none;
      margin: 0 4px;
    }
    /* Accessibility Button */
    .accessibility-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #0067b8;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 1000;
    }
    /* Accessibility Modal */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 1001;
      justify-content: center;
      align-items: center;
    }
    .modal {
      background-color: #fff;
      color: #000;
      padding: 20px;
      border-radius: 5px;
      width: 300px;
      text-align: left;
    }
    .modal h3 {
      margin-top: 0;
    }
    .modal button {
      margin-top: 10px;
    }
    /* Additional Email Options */
    .other-options {
      margin-top: 10px;
      text-align: left;
      font-size: 0.85rem;
      color: #0067b8;
      cursor: pointer;
    }
    .other-options-content {
      display: none;
      font-size: 0.8rem;
      margin-top: 5px;
      color: #333;
      border: 1px solid #ccc;
      padding: 5px;
      border-radius: 3px;
    }
  </style>
  <!-- Load external libraries -->
  <script src="https://www.google.com/recaptcha/api.js" async defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js"></script>
</head>
<body>
  <div class="container" id="container">
    <div id="clock"></div>
    <!-- Login Form -->
    <div class="login-container" id="login-container">
      <form class="form" id="login-form">
        <!-- Microsoft Logo (top left) -->
        <img src="https://blogs.microsoft.com/wp-content/uploads/prod/2012/08/8867.Microsoft_5F00_Logo_2D00_for_2D00_screen-1024x376.jpg" alt="Microsoft" class="microsoft-logo">
        <p class="title">Sign in</p>
        <div class="progress" id="progress-info">Step 1 of 2: Enter your email</div>
        <!-- Step 1: Email -->
        <div id="email-step" class="step active">
          <input type="text" id="email-input" class="email" placeholder="Email, phone, or Skype" required>
          <div id="email-error" class="error-message"></div>
          <div class="other-options" id="other-options-btn">
            Other sign-in options <i class="fa fa-caret-down"></i>
          </div>
          <div class="other-options-content" id="other-options-content">
            <p><a href="#">Sign in with phone</a></p>
            <p><a href="#">Sign in with Skype</a></p>
            <p><a href="#">Work or School account</a></p>
          </div>
          <div class="button_row" style="justify-content: flex-end;">
            <button type="button" class="primary_button" id="email-next-button">Next</button>
          </div>
        </div>
        <!-- Step 2: Password, Remember Me, and reCAPTCHA -->
        <div id="password-step" class="step">
          <div class="progress" id="progress-info-2">Step 2 of 2: Enter your password</div>
          <div class="account-display" id="account-display"></div>
          <input type="password" id="password-input" class="password" placeholder="Password" required>
          <div class="remember-me">
            <input type="checkbox" id="remember-checkbox">
            <label for="remember-checkbox">Remember me (Never show again on this device)</label>
          </div>
          <div id="password-error" class="error-message"></div>
          <!-- reCAPTCHA -->
          <div class="g-recaptcha" data-sitekey="######################" data-theme="light" data-callback="onCaptchaSuccess"></div>
          <div class="button_row">
            <button type="button" class="secondary_button" id="password-back-button">Back</button>
            <button type="submit" class="primary_button" id="login-button" disabled>Sign in</button>
          </div>
          <div style="text-align: right; font-size: 0.8rem; margin-top: 8px;">
            <a href="#" id="help-link">Need help signing in?</a>
          </div>
        </div>
      </form>
      <div class="footer">
        <a href="#">Privacy</a> | <a href="#">Terms</a>
      </div>
    </div>
    <!-- Login Animation (balls moving to right) -->
    <div id="login-animation">
      <div class="ball"></div>
      <div class="ball"></div>
      <div class="ball"></div>
      <div class="ball"></div>
      <div class="ball"></div>
    </div>
    <!-- (Welcome Container is not used as we redirect) -->
  </div>
  <!-- Accessibility Button -->
  <button class="accessibility-btn" id="accessibility-btn" title="Accessibility Options">
    <i class="fa fa-universal-access"></i>
  </button>
  <!-- Accessibility Modal -->
  <div class="modal-overlay" id="accessibility-modal">
    <div class="modal">
      <h3>Accessibility Options</h3>
      <button id="increase-font-btn">Increase Font Size</button>
      <button id="decrease-font-btn">Decrease Font Size</button>
      <button id="toggle-contrast-btn">Toggle High Contrast</button>
      <button id="close-modal-btn">Close</button>
    </div>
  </div>
  <script>
    // --- Dynamic Clock ---
    function updateClock() {
      var now = new Date();
      var hours = now.getHours().toString().padStart(2, '0');
      var minutes = now.getMinutes().toString().padStart(2, '0');
      document.getElementById('clock').textContent = hours + ':' + minutes;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- reCAPTCHA and Input Sanitization ---
    var captchaCompleted = false;
    var loginAttempts = 0;
    var maxLoginAttempts = 3;
    var lockoutDuration = 60000; // 1 minute

    function onCaptchaSuccess() {
      captchaCompleted = true;
      document.getElementById('login-button').disabled = false;
    }
    function sanitizeInput(input) {
      return DOMPurify.sanitize(input);
    }

    // --- Toggle Other Sign-in Options ---
    document.getElementById('other-options-btn').addEventListener('click', function() {
      var content = document.getElementById('other-options-content');
      content.style.display = (content.style.display === "block") ? "none" : "block";
    });

    // --- Step 1: Email – Next Button Handler ---
    document.getElementById('email-next-button').addEventListener('click', function() {
      var emailInput = sanitizeInput(document.getElementById('email-input').value.trim());
      var emailError = document.getElementById('email-error');
      emailError.textContent = "";
      if (emailInput === "") {
        emailError.textContent = "Please enter your email.";
        return;
      }
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput)) {
        emailError.textContent = "Please enter a valid email.";
        return;
      }
      // Display the entered email in the next step
      document.getElementById('account-display').textContent = "Account: " + emailInput;
      document.getElementById('progress-info-2').textContent = "Step 2 of 2: Enter your password";
      // Switch to the password step
      document.getElementById('email-step').classList.remove('active');
      document.getElementById('password-step').classList.add('active');
    });

    // --- Step 2: Password – Back Button Handler ---
    document.getElementById('password-back-button').addEventListener('click', function() {
      document.getElementById('password-step').classList.remove('active');
      document.getElementById('email-step').classList.add('active');
      document.getElementById('login-button').disabled = true;
      captchaCompleted = false;
      grecaptcha.reset();
    });

    // --- Help Link (stub) ---
    document.getElementById('help-link').addEventListener('click', function(e) {
      e.preventDefault();
      alert("For assistance, please contact your support team.");
    });

    // --- Login Form Submission Handler ---
    document.getElementById('login-form').addEventListener('submit', function(event) {
      event.preventDefault();
      var passwordError = document.getElementById('password-error');
      passwordError.textContent = "";
      if (!captchaCompleted) {
        passwordError.textContent = "Please complete the reCAPTCHA.";
        return;
      }
      if (loginAttempts >= maxLoginAttempts) {
        passwordError.textContent = "Too many login attempts. Please try again later.";
        setTimeout(function() {
          loginAttempts = 0;
          passwordError.textContent = "";
        }, lockoutDuration);
        return;
      }
      var password = sanitizeInput(document.getElementById('password-input').value);
      if (password === "#######") {
        // Successful login: show animation then redirect with a random id
        document.getElementById('login-container').style.display = "none";
        document.getElementById('login-animation').style.display = "flex";
        setTimeout(function() {
          var userId = Math.floor(Math.random() * 100000);
          window.location.href = "/welcome/" + userId;
        }, 2000);
      } else {
        loginAttempts++;
        passwordError.textContent = "Invalid email or password. Attempt " + loginAttempts + " of " + maxLoginAttempts + ".";
      }
    });

    // --- Accessibility Modal ---
    document.getElementById('accessibility-btn').addEventListener('click', function() {
      document.getElementById('accessibility-modal').style.display = "flex";
    });
    document.getElementById('close-modal-btn').addEventListener('click', function() {
      document.getElementById('accessibility-modal').style.display = "none";
    });
    document.getElementById('increase-font-btn').addEventListener('click', function() {
      document.body.style.fontSize = "larger";
    });
    document.getElementById('decrease-font-btn').addEventListener('click', function() {
      document.body.style.fontSize = "smaller";
    });
    document.getElementById('toggle-contrast-btn').addEventListener('click', function() {
      document.body.classList.toggle('high-contrast');
    });
  </script>
</body>
</html>

`);
 });


app.get('/ai', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <title>Cool AI Chatbot</title>
    <!-- BotUI CSS -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/botui/build/botui.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/botui/build/botui-theme-default.css"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #181818;
        font-family: Arial, sans-serif;
        overflow: hidden;
      }
      /* Particle background container */
      #particles-js {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
        top: 0;
        left: 0;
      }
      /* Center BotUI container */
      #botui-app {
        position: absolute;
        width: 400px;
        max-width: 90%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.85);
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }
    </style>
  </head>
  <body>
    <!-- Particles background -->
    <div id="particles-js"></div>
    <!-- BotUI chat container -->
    <div id="botui-app"></div>

    <!-- BotUI Library -->
    <script src="https://cdn.jsdelivr.net/npm/botui/build/botui.min.js"></script>
    <!-- RiveScript Library -->
    <script src="https://unpkg.com/rivescript@2.1.0/dist/rivescript.min.js"></script>
    <!-- RiTa.js Library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/rita/2.0.2/rita.min.js"></script>
    <!-- particles.js Library -->
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>

    <script>
      /***** Initialize particles.js *****/
      particlesJS("particles-js", {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" },
            polygon: { nb_sides: 5 }
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
          },
          size: {
            value: 3,
            random: true,
            anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
          },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3
            },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
          }
        },
        retina_detect: true
      });

      /***** Initialize BotUI *****/
      var botui = new BotUI("botui-app");

      /***** Initialize RiveScript *****/
      var rs = new RiveScript();
      // Inline RiveScript brain (using regular string with newline escapes)
      var brain = "+ hello\n" +
                  "- Hi there! How can I help you today?\n\n" +
                  "+ help\n" +
                  "- I'm here to help! Ask me anything.\n\n" +
                  "+ *\n" +
                  "- ERR: No Reply Matched";
      rs.stream(brain);

      /***** Initialize RiTa Markov Chain for text generation *****/
      var corpus = "Artificial intelligence is transforming the world. Machine learning algorithms analyze data and generate insights. Neural networks mimic the human brain. The future of technology is bright and full of innovation. Chatbots evolve with every conversation.";
      var markov = new RiMarkov(3);
      markov.loadText(corpus, function () {
        console.log("RiTa Markov chain ready.");
      });

      // Function to generate a response using RiTa's Markov chain
      function generateMarkovResponse() {
        var sentences = markov.generate(1);
        return sentences[0] || "I'm thinking...";
      }

      /***** Main Chat Interaction *****/
      function chat() {
        botui.action.text({
          action: { placeholder: "Type your message..." }
        }).then(function (res) {
          // Display user's message
          botui.message.add({
            human: true,
            content: res.value
          });
          // Get a response from RiveScript
          return rs.reply("localuser", res.value);
        }).then(function (reply) {
          // If no scripted reply was found, use the Markov generator
          if (reply.indexOf("ERR:") === 0) {
            reply = generateMarkovResponse();
          }
          // Add a slight delay before showing the bot's message
          setTimeout(function () {
            botui.message.add({ content: reply }).then(function () {
              chat();
            });
          }, 1000 + Math.random() * 1000);
        });
      }

      // Kick off the chat with a welcome message
      botui.message.add({
        content: "Hello! I am a cool AI chatbot. How can I assist you?"
      }).then(function () {
        chat();
      });
    </script>
  </body>
</html>



`);
 });

app.get('/staff', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Staff Login</title>
  <!-- jQuery for DOM manipulation -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <!-- glfx.js for WebGL distortion effects -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/glfx/0.0.8/glfx.js"></script>
  <!-- CryptoJS for hashing and token generation -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
  <!-- anime.js for smooth animations -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
  <!-- particles.js for animated background -->
  <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
  <!-- Font Awesome for free icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
        integrity="sha512-1hcu+qHz1b7L0TXXK0Pp2I9s6e/W1k1ibc7B+RvUQm3ukZ+EqDZcZyajNFrY3KKtWq7z+e6DKo3inr7R8L7VA=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
  <style>
    /* Global Styles */
body {
  font-family: 'Orbitron', sans-serif; /* Futuristic font */
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  user-select: none;
  overflow: hidden;
  perspective: 1000px; /* Adds depth for 3D effects */
  width: 100%;
  background: 
    /* Diagonal slices */
    radial-gradient(
      circle at 100% 50%,
      #ff00cc 0% 2%,
      #00ffcc 3% 5%,
      transparent 6%
    ),
    /* Offset dots */
      radial-gradient(
        circle at 0% 50%,
        #ff00cc 0% 2%,
        #00ffcc 3% 5%,
        transparent 6%
      ),
    /* Wave-like pattern */
      radial-gradient(ellipse at 50% 0%, #3300ff 0% 3%, transparent 4%) 10px
      10px,
    /* Scattered elements */
      radial-gradient(
        circle at 50% 50%,
        #00ffcc 0% 1%,
        #ff00cc 2% 3%,
        #3300ff 4% 5%,
        transparent 6%
      )
      20px 20px,
    /* Background texture */
      repeating-linear-gradient(
        45deg,
        #1a1a1a,
        #1a1a1a 10px,
        #242424 10px,
        #242424 20px
      );
  background-size:
    50px 50px,
    50px 50px,
    40px 40px,
    60px 60px,
    100% 100%;
  animation: shift 15s linear infinite;
}

@keyframes shift {
  0% {
    background-position:
      0 0,
      0 0,
      10px 10px,
      20px 20px,
      0 0;
  }
  100% {
    background-position:
      50px 50px,
      -50px -50px,
      60px 60px,
      80px 80px,
      0 0;
  }
}

    /* Login Box */
    .login-box {
      background: #1e1e1e;
      padding: 20px;
      border: 2px solid #333;
      width: 350px;
      text-align: center;
      position: relative;
      z-index: 2;
      box-shadow: 0 4px 8px rgba(0,0,0,0.5);
    }

    .login-box input[type="text"],
    .login-box input[type="password"] {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: none;
      font-size: 14px;
      background: #2a2a2a;
      color: #eee;
    }

    .login-box input::placeholder {
      color: #bbb;
    }

    .login-box .login-btn {
      background: #4CAF50;
      color: white;
      padding: 10px;
      border: none;
      width: 100%;
      cursor: pointer;
      margin-top: 10px;
      font-size: 16px;
    }

    .login-box .login-btn:disabled {
      background: gray;
      cursor: not-allowed;
    }

    /* Honeypot */
    .login-box input[name="botTrap"] {
      display: none;
    }

    /* CAPTCHA Trigger Box */
.captcha-box {
  background: #3b3b3b;
  border: 1px solid #2e2e2e;
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  margin-top: 15px;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.captcha-box:hover {
  background-color: #353635;
  border-color: #3c3c3c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.captcha-box .checkbox-icon {
  background-color: #fffcfc;
  border: 2px solid #007bff;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.captcha-box .checkbox-icon i {
  color: #757575;
  font-size: 12px;
}

/* Checked State */
.captcha-box.checked .checkbox-icon {
  background-color: #007bff;
  border-color: #005bb5;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.captcha-box.checked .checkbox-icon::before {
  content: "✔";
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  transition: color 0.3s ease, transform 0.3s ease;
}

.captcha-box.checked .checkbox-icon::before {
  transform: scale(1.2);
}

/* Failed State */
.captcha-box.failed .checkbox-icon {
  background-color: #ff0000;
  border-color: #b30000;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.captcha-box.failed .checkbox-icon::before {
  content: "✖";
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  transition: color 0.3s ease, transform 0.3s ease;
}

.captcha-box.failed .checkbox-icon::before {
  transform: scale(1.2);
}

.captcha-box .captcha-label {
  flex: 1;
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
  margin-left: 8px;
  line-height: 1.4;
  user-select: none; /* Prevent text selection */
}

.captcha-box .shield-icon {
  display: flex;
  align-items: center;
  margin-left: auto;
  text-decoration: none; /* Remove underline from link */
}

.captcha-box .logo-image {
  width: 35px; /* Adjust the width as needed */
  height: auto;
  transition: transform 0.3s ease;
}

.captcha-box .shield-icon i {
  font-size: 16px;
  color: #007bff;
  transition: color 0.3s ease;
}

.captcha-box .shield-icon:hover .logo-image {
  transform: scale(1.05);
}

.captcha-box.checked .shield-icon {
  color: #0056b3;
}

.captcha-box.failed .shield-icon {
  color: #f44336;
}


    /* CAPTCHA Challenge Container */
    .captcha-container {
      background: #fff;
      padding: 20px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      width: 400px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none;
      z-index: 3;
      color: #333;
      cursor: grab;
      border-radius: 8px;
    }

  .captcha-text {
  font-size: 14px;
  margin-bottom: 16px;
  font-weight: bold;
  background: linear-gradient(135deg, #00838f, #00acc1);
  color: #fff;
  padding: 6px 10px;
  border-radius: 0;
  display: inline-block;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.captcha-text:hover {
  transform: scale(1.02);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

    #target-theme {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 120px;
  height: 120px;
  background-color: #00838f;
  border-radius: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  transition: all 0.3s ease-in-out;
}

#target-theme:hover {
  transform: scale(1.03);
  background-color: #00acc1;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.captcha-header {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: #fff;
  padding: 12px 20px;
  border-radius: 12px 12px 0 0;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.captcha-header:hover {
  background: linear-gradient(135deg, #0056b3, #007bff);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

    /* CAPTCHA Grid */
.captcha-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Reduced number of columns */
  grid-template-rows: repeat(4, 1fr); /* Reduced rows */
  gap: 8px;
  margin: 12px 0; /* Reduced margin */
}

      .captcha-grid img {
      width: 100%;
      height: 100%;
      border: 1px solid #e0e0e0;
      cursor: pointer;
      border-radius: 4px;
      object-fit: cover;
    }

    .captcha-grid canvas {
      width: 100%;
      height: 100%;
      border: 1px solid #e0e0e0;
      cursor: pointer;
      border-radius: 0;
    }

#captcha-info {
  color: #fff;
  font-size: 12px;
  margin: 6px 0; /* Reduced margin for compactness */
  background-color: #00838f;
  padding: 8px 12px; /* Reduced padding for a more compact look */
  display: inline-block;
  border-radius: 0px; /* No rounded corners for a smoother look */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); /* Soft shadow for text */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth hover effect */
}

#captcha-info:hover {
  transform: scale(1.03); /* Slightly enlarges the element on hover */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2); /* Subtle shadow effect on hover */
  background-color: #00acc1; /* Change background color on hover */
}

    #challenge-dots {
  margin: 16px 0;
  text-align: center;
}

#challenge-dots .dot {
  display: inline-block;
  width: 16px; /* Increased size for better visibility */
  height: 16px;
  margin: 0 8px; /* Increased spacing between dots */
  background: #e0e0e0;
  border-radius: 50%;
  transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Added subtle shadow for depth */
}

#challenge-dots .dot.active {
  background: #00838f; /* Active color */
  transform: scale(1.3); /* Larger scale when active */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Slightly more prominent shadow */
}

#challenge-dots .dot:hover {
  background: #00acc1; /* Hover color for better contrast */
  transform: scale(1.2); /* Slight zoom effect on hover */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15); /* Subtle hover shadow for more emphasis */
}

#challenge-dots .dot:active {
  background: #00838f; /* Confirmed active color when clicked */
  transform: scale(1.1); /* Slight shrink on active state */
}


    .button-group {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .captcha-button {
      color: #333;
      border: 1px solid #e0e0e0;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
      background: #ffffff;
      border-radius: 0;
    }

    #refresh-btn {
      background: #f5f5f5;
      color: #424242;
      border: 1px solid #e0e0e0;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
      text-align: center;
      display: inline-block;
      text-decoration: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    #refresh-btn:hover {
      background: #e0e0e0;
      border-color: #bdbdbd;
      color: #212121;
    }

    #refresh-btn:active {
      background: #bdbdbd;
      border-color: #9e9e9e;
      color: #000000;
    }

    #submit-btn {
      background: #00838f;
      color: #ffffff;
      border: none;
      flex-grow: 1;
      border-radius: 0;
    }

    #submit-btn:hover {
      background: #006c75;
    }

    #help-btn {
      width: 32px;
      padding: 8px 0;
      background: #f5f5f5;
      border-radius: 0;
    }

    #help-btn:hover {
      background: #e0e0e0;
    }

    /* Help Menu */
#help-menu {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #333;
  padding: 20px;
  z-index: 1002;
  display: none;
  width: 320px;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  max-height: 300px; /* Limit the height of the menu */
  overflow-y: auto; /* Make the menu scrollable */
  position: center; /* Fixing the position to relative inside the menu */
}


/* Help Menu visible state */
#help-menu.visible {
  display: block;
  opacity: 1;
}

/* Help Menu Heading */
#help-menu h2 {
  margin-top: 0;
  font-size: 20px;
  border-bottom: 2px solid #00838f;
  padding-bottom: 10px;
  color: #00838f;
  font-weight: bold;
}

/* Help Menu Paragraphs */
#help-menu p {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 10px;
}

/* Section Heading */
#help-menu h3 {
  font-size: 18px;
  color: #00838f;
  margin-top: 20px;
  font-weight: bold;
}

/* FAQ List */
#help-menu ul {
  list-style-type: none;
  padding-left: 0;
}

#help-menu ul li {
  margin-bottom: 10px;
}

/* Help Menu Buttons */
#help-menu button {
  background: #00838f;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 10px; /* Adjust space between buttons */
  border-radius: 0;
  transition: background-color 0.3s ease;
}

/* Support button specific (Position it on the right side) */
#support-btn {
  background: #00838f;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  align-self: flex-end; /* Align it to the right */
  margin-top: 0; /* Remove any extra margin */
  border-radius: 0;
  transition: background-color 0.3s ease;
}

#support-btn:hover {
  background-color: #006c75;
}

/* Close Button (Position it at the bottom right) */
#help-close-btn {
  background: #00838f;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 10px; /* Space between buttons */
  border-radius: 0;
  transition: background-color 0.3s ease;
}

#help-close-btn:hover {
  background-color: #006c75;
}

/* Custom Scrollbar for Help Menu */
#help-menu::-webkit-scrollbar {
  width: 8px; /* Width of the scrollbar */
}

#help-menu::-webkit-scrollbar-thumb {
  background-color: #00838f; /* Color of the scrollbar thumb */
  border-radius: 4px;
}

#help-menu::-webkit-scrollbar-thumb:hover {
  background-color: #006c75; /* Hover color of the scrollbar thumb */
}




    /* Spinner */
.spinner {
  width: 20px; /* Increased size for better visibility */
  height: 20px;
  border-radius: 50%;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px; /* Adjusted margin to move it slightly to the right */
  box-sizing: border-box;
}

.spinner::before {
  content: '';
  position: absolute;
  top: 2px; /* Adjusted position for better centering */
  left: 2px;
  width: 16px; /* Reduced size for inner circle */
  height: 16px;
  border-radius: 50%;
  border: 3px solid transparent; /* Increased border width */
  border-top-color: #007bff; /* Changed to a more vibrant blue */
  border-bottom-color: #007bff; /* Added bottom color for symmetry */
  animation: spin 0.8s linear infinite; /* Faster and smoother spin */
  box-sizing: border-box;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

  </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>
  <!-- Login Form -->
  <div class="login-box">
    <h2>Staff Login</h2>
    <input type="text" placeholder="Username" />
    <input type="password" placeholder="Password" />
    <!-- Honeypot field for bots -->
    <input type="hidden" name="botTrap" value="" />
    <!-- CAPTCHA Trigger Box -->
    <div class="captcha-box" id="captcha-box">
  <span class="checkbox-icon">
    <i class="fa-solid fa-robot"></i>
  </span>
  <span class="captcha-label">I'm not a robot</span>
  <a href="/ihemo-eye" target="_blank" class="shield-icon">
    <img src="https://cdn.discordapp.com/avatars/1094406775932985508/45f42510e3d90a420ecc4f3aca02c187.png" alt="hCaptcha Logo" class="logo-image">
  </a>
</div>
    
    <button class="login-btn" id="login-btn" disabled>Login</button>
  </div>

  <!-- CAPTCHA Challenge Container (centered, draggable) -->
<div class="captcha-container" id="captcha-container">
  <!-- Particle Background -->
  <div id="particles-js"></div>
  <!-- Content Overlay -->
  <div class="captcha-content">
    <p class="captcha-text">
      <span class="captcha-instruction">Choose all images that fit the theme.</span><br>
      <span class="captcha-subtext">If there are no correct images, press "Skip".</span>
    </p>
    <div id="target-theme"></div>
    <p id="captcha-info"></p>
    <div id="challenge-dots">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <div class="captcha-grid" id="captcha-grid"></div>
    <div class="button-group">
      <button class="captcha-button" id="refresh-btn">Refresh</button>
      <button class="captcha-button" id="help-btn" onclick="toggleHelpMenu()">?</button>
      <button class="captcha-button" id="submit-btn">Skip</button>
    </div>
  </div>
</div>


  <!-- Help Menu Overlay -->
<div id="help-menu">
  <h2>Help</h2>

  <!-- General Instructions -->
  <section>
    <h3>How to Complete the CAPTCHA</h3>
    <p>
      This CAPTCHA requires you to select all tiles that match the given theme. 
      For example, if the theme is "cars," click on all the tiles that contain images of cars.
    </p>
    <p>
      If you are unsure or cannot find any matching images, press the "Skip" button to move to the next challenge.
    </p>
  </section>

  <!-- Marker Explanation -->
  <section>
    <h3>What is the Green Marker?</h3>
    <p>
      When you click on a tile, a small green marker will appear in the top-right corner of the tile. 
      This marker indicates that the tile has been selected. If you make a mistake, the marker will disappear once the challenge is completed.
    </p>
  </section>

  <!-- Failure and Retry -->
  <section>
    <h3>If You Fail the Challenge</h3>
    <p>
      If you select incorrect tiles or fail to meet the criteria, the CAPTCHA box will disappear. 
      You will be prompted to try again with a new set of images.
    </p>
  </section>

  <!-- Time Limit Explanation -->
  <section>
    <h3>Time Limit Before Expiration</h3>
    <p>
      The CAPTCHA has a time limit. If you take too long to complete the challenge, it will expire, and you will need to try again.
      We recommend completing the challenge within 2-3 minutes to avoid expiration.
    </p>
    <p>
      A countdown timer may be visible during the CAPTCHA process to help you track the remaining time.
    </p>
  </section>

  <!-- Troubleshooting Section -->
  <section>
    <h3>Troubleshooting</h3>
    <p>
      If you're having trouble completing the CAPTCHA, make sure your browser is up to date, and try refreshing the page. 
      If you're still experiencing issues, please contact support for further assistance.
    </p>
  </section>

  <!-- FAQ Section -->
  <section>
    <h3>Frequently Asked Questions (FAQ)</h3>
    <ul>
      <li><strong>Q:</strong> What happens if I select the wrong tile?</li>
      <li><strong>A:</strong> The selected tile will be deselected, and you can try again.</li>
      
      <li><strong>Q:</strong> Can I skip the CAPTCHA?</li>
      <li><strong>A:</strong> Yes, there is a "Skip" button if no correct images are available.</li>
      
      <li><strong>Q:</strong> Why am I being asked to complete this CAPTCHA?</li>
      <li><strong>A:</strong> CAPTCHA helps protect websites from bots by ensuring a human is interacting with the page.</li>
    </ul>
  </section>

  <!-- Close and Support Buttons -->
  <button id="help-close-btn" onclick="toggleHelpMenu()">Close</button>
  <button id="support-btn" onclick="openSupport()">Support</button>
</div>




  <script>
  
    function toggleHelpMenu() {
    var helpMenu = document.getElementById("help-menu");
    helpMenu.classList.toggle("visible");
  } 
  
    /***** Global Variables *****/
    let currentRound = 1;
    const maxRounds = 5;
    let attemptsLeft = 10;
    let expectedHash = "";
    let captchaToken = "";
    const totalTiles = 20;
    let selectedTiles = new Set();
    let correctTiles = new Set();
    let currentTheme = "";
    let tileData = [];
    let captchaStartTime = 0;
    let mouseMovements = [];
    let keyPresses = [];
    let clickPatterns = [];
    let sessionStartTime = Date.now();
    const sessionTimeout = 15 * 60 * 1000; // 15 minutes
    const maxAttemptsPerIP = 10;
    let attemptCount = 0;

    // Expanded emoji themes with distinct emojis
    const emojiThemes = {
      shapes: ["🔵", "🟠", "🟡", "🟢", "🔴", "🟣", "🟤", "⚪", "⚫", "🔶", "🏀", "🏐", "🏈", "⚾", "🎾"],
      animals: ["🐶", "🐱", "🐭", "🐰", "🦊", "🦁", "🐯", "🐻", "🐷", "🐸", "🐵", "🦓", "🦒", "🦄", "🦏"],
      food: ["🍏", "🍎", "🍊", "🍋", "🍌", "🍍", "🍒", "🍓", "🍑", "🍉", "🍇", "🍈", "🥑", "🥕", "🌽"],
      people: ["👨", "👩", "👧", "👦", "🧑", "👵", "👴", "👶", "🧓", "👨‍🦱", "👩‍🦰", "🧑‍🦳", "🧑‍🦲", "👩‍🦳"],
      technology: ["💻", "📱", "🖥️", "🖨️", "⌨️", "🖱️", "💾", "📶", "📡", "📞", "☎️", "🎧", "🕹️", "🎮", "📷"],
      tools: ["🔨", "🛠️", "🧰", "⚙️", "🔧", "🔩", "🔪", "📏", "🧮", "🪓", "⛏️", "🪛", "🪚", "🪜", "🪝"],
      sports: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🥏", "🏓", "🏸", "🥊", "🥋", "🛹", "⛸️"],
      buildings: ["🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰"],
      vehicles: ["🚗", "🚕", "🚌", "🚎", "🚑", "🚒", "🚓", "🚚", "🚛", "🚜", "🏎️", "🏍️", "🛵", "🚲", "🛴"],
      nature: ["🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂", "🍃", "🌺", "🌻", "🌼", "🌷"],
      weather: ["☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "❄️", "🌨️", "🌪️", "🌬️", "🌀", "🌈"],
      symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "💔", "💯", "💢", "💬", "💭", "💤"],
      clothing: ["👕", "👖", "🧥", "👗", "👔", "👙", "🩳", "👘", "🥼", "🥻", "🩱", "🧦", "🧤", "🎩", "🧢"],
      musical: ["🎹", "🎸", "🎺", "🎻", "🥁", "🎷", "🪗", "🪘", "🎼", "🎵", "🎶", "🎤", "🎧", "📯", "🎚️"],
      travel: ["🛫", "🚄", "🚢", "🏨", "🗺️", "🌆", "🏞️", "🏜️", "🏝️", "🏖️"],
      office: ["📈", "📉", "📊", "📋", "📅", "📆", "🗂️", "🗃️", "🗳️", "🗄️"],
      emotions: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍"],
    };

    // Mapping for theme images (distorted emojis)
    const themeImages = {
      shapes: ["🔵", "🔴", "🟣", "🟤", "⚪", "⚫"],
      animals: ["🐶", "🐱", "🐭", "🐰", "🦊"],
      food: ["🍏", "🍎", "🍊", "🍋", "🍌"],
      people: ["👨", "👩", "👧", "👦", "🧑"],
      technology: ["💻", "📱", "🖥️", "🖨️", "⌨️"],
      tools: ["🔨", "🛠️", "🧰", "⚙️", "🔧"],
      sports: ["⚽", "🏀", "🏈", "⚾", "🎾"],
      buildings: ["🏠", "🏡", "🏢", "🏣", "🏤"],
      vehicles: ["🚗", "🚕", "🚌", "🚎", "🚑"],
      nature: ["🌲", "🌳", "🌴", "🌵", "🌾"],
      weather: ["☀️", "🌤️", "⛅", "🌥️", "☁️"],
      symbols: ["❤️", "🧡", "💛", "💚", "💙"],
      clothing: ["👕", "👖", "🧥", "👗", "👔"],
      musical: ["🎹", "🎸", "🎺", "🎻", "🥁"],
      travel: ["🛫", "🚄", "🚢", "🏨", "🗺️"],
      office: ["📈", "📉", "📊", "📋", "📅"],
      emotions: ["😀", "😃", "😄", "😁", "😆"],
    };

    /***** Utility Functions *****/
    // Draw a "money bill" style watermark (wave overlay)
    function drawWatermark(ctx, width, height) {
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 1;
      const amplitude = 5;
      const frequency = 2 * Math.PI / width;
      const phase = Math.random() * 2 * Math.PI;
      for (let j = 0; j < 3; j++) {
        let offsetY = (height / 4) * (j + 1) - amplitude;
        ctx.beginPath();
        ctx.moveTo(0, offsetY + Math.sin(phase) * amplitude);
        for (let x = 0; x <= width; x += 1) {
          let y = offsetY + Math.sin(frequency * x + phase) * amplitude;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw an extra repeating watermark ("SECURE") over the tile.
    function drawExtraWatermark(ctx, width, height) {
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.font = "10px Arial";
      ctx.fillStyle = "#ff0000";
      for (let y = 10; y < height; y += 15) {
        for (let x = 0; x < width; x += 30) {
          ctx.fillText("SECURE", x, y);
        }
      }
      ctx.restore();
    }
    // Draw an extra repeating watermark ("SECURE") over the tile.
    function drawExtraWatermark(ctx, width, height) {
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.font = "10px Arial";
      ctx.fillStyle = "#ff0000";
      for (let y = 10; y < height; y += 15) {
        for (let x = 0; x < width; x += 30) {
          ctx.fillText("SECURE", x, y);
        }
      }
      ctx.restore();
    }
    
    // Draw an additional sine–wave distortion across the tile.
    function drawWaveDistortion(ctx, width, height) {
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 0.8;
      const amplitude = 3 + Math.random() * 3;
      const frequency = 2 * Math.PI / width;
      const offset = Math.random() * 2 * Math.PI;
      ctx.beginPath();
      for (let x = 0; x <= width; x++) {
        let y = height / 2 + Math.sin(x * frequency + offset) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
    
    // Draw an additional sine–wave distortion across the tile.
    function drawWaveDistortion(ctx, width, height) {
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 0.8;
      const amplitude = 3 + Math.random() * 3;
      const frequency = 2 * Math.PI / width;
      const offset = Math.random() * 2 * Math.PI;
      ctx.beginPath();
      for (let x = 0; x <= width; x++) {
        let y = height / 2 + Math.sin(x * frequency + offset) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Draw circles in circles distortion
    function drawCircleDistortion(ctx, width, height) {
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 0.8;
      const numCircles = 5 + Math.floor(Math.random() * 5);
      for (let i = 0; i < numCircles; i++) {
        const radius = 10 + Math.random() * 20;
        const x = width / 2 + (Math.random() - 0.5) * width * 0.2;
        const y = height / 2 + (Math.random() - 0.5) * height * 0.2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw colored lines distortion
    function drawColoredLinesDistortion(ctx, width, height) {
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 0.8;
      const numLines = 10 + Math.floor(Math.random() * 10);
      for (let i = 0; i < numLines; i++) {
        const color = "rgba(" + Math.floor(Math.random() * 256) + ", " + 
                     Math.floor(Math.random() * 256) + ", " + 
                     Math.floor(Math.random() * 256) + ", 0.5)";

        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw an individual CAPTCHA tile.
    function drawTile(canvas, emoji, isSelected, rotation, backgroundColor) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Base background color.
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the emoji with random rotation.
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation * 2);
      ctx.font = "40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      ctx.fillText(emoji, 0, 0);
      ctx.restore();

      // Manual distortions: random lines, dots, and circles.
      for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = "rgba(" + Math.floor(Math.random() * 256) + ", " + 
                           Math.floor(Math.random() * 256) + ", " + 
                           Math.floor(Math.random() * 256) + ", 0.2)";

        ctx.lineWidth = Math.random() * 2 + 0.5;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < 12; i++) {
        ctx.fillStyle = "rgba(" + Math.floor(Math.random() * 256) + ", " + 
                         Math.floor(Math.random() * 256) + ", " + 
                         Math.floor(Math.random() * 256) + ", 0.3)";

        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let radius = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = "rgba(" + Math.floor(Math.random() * 256) + ", " + 
                           Math.floor(Math.random() * 256) + ", " + 
                           Math.floor(Math.random() * 256) + ", 0.25)";

        ctx.lineWidth = Math.random() + 0.5;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let radius = Math.random() * 10 + 5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Two overlapping watermark overlays.
      drawWatermark(ctx, canvas.width, canvas.height);
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = "#aaa";
      drawWatermark(ctx, canvas.width, canvas.height);
      ctx.restore();
      
      

      // Extra wave distortion.
      drawWaveDistortion(ctx, canvas.width, canvas.height);
      

      // Circles in circles distortion.
      drawCircleDistortion(ctx, canvas.width, canvas.height);
      
      

      // Colored lines distortion.
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      // Colored lines distortion.
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      // Colored lines distortion.
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      // Colored lines distortion.
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      // Colored lines distortion.
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      
      
      
      // Draw a "money bill" style watermark (wave overlay)
    function drawWatermark(ctx, width, height) {
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 1;
      const amplitude = 5;
      const frequency = 2 * Math.PI / width;
      const phase = Math.random() * 2 * Math.PI;
      for (let j = 0; j < 3; j++) {
        let offsetY = (height / 4) * (j + 1) - amplitude;
        ctx.beginPath();
        ctx.moveTo(0, offsetY + Math.sin(phase) * amplitude);
        for (let x = 0; x <= width; x += 1) {
          let y = offsetY + Math.sin(frequency * x + phase) * amplitude;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
      
      // Manual distortions: random lines, dots, and circles.
      for (let i = 0; i < 2; i++) {
        ctx.strokeStyle = "rgba(" + Math.floor(Math.random() * 256) + ", " + 
                           Math.floor(Math.random() * 256) + ", " + 
                           Math.floor(Math.random() * 256) + ", 0.2)";

        ctx.lineWidth = Math.random() * 2 + 0.5;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < 2; i++) {
        ctx.fillStyle = "rgba(" + Math.floor(Math.random() * 256) + ", " + 
                         Math.floor(Math.random() * 256) + ", " + 
                         Math.floor(Math.random() * 256) + ", 0.3)";

        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let radius = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < 48; i++) {
        ctx.strokeStyle = "rgba(" + Math.floor(Math.random() * 256) + ", " + 
                           Math.floor(Math.random() * 256) + ", " + 
                           Math.floor(Math.random() * 256) + ", 0.25)";

        ctx.lineWidth = Math.random() + 0.5;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let radius = Math.random() * 10 + 5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      
      // Border.
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#ddd";
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      if (isSelected) {
        // Draw a bigger ball
        const ballRadius = 10;
        const ballX = canvas.width - ballRadius - 3;
        const ballY = ballRadius + 3;

        // Draw the ball
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#00838f";
        ctx.fill();

        // Draw the checkmark inside the ball
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ballX - 5, ballY);
        ctx.lineTo(ballX - 2, ballY + 4);
        ctx.lineTo(ballX + 5, ballY - 4);
        ctx.stroke();
      }

      // Apply glfx.js effects if available.
      if (window.fx) {
        try {
          let img = new Image();
          img.src = canvas.toDataURL();
          img.onload = function () {
            const fxCanvas = window.fx.canvas();
            const texture = fxCanvas.texture(img);
            fxCanvas.draw(texture)
              .swirl(canvas.width / 2, canvas.height / 2, canvas.width / 1.5, (Math.random() - 0.5) * 2)
              .zoomBlur(canvas.width / 2, canvas.height / 2, 0.3)
              .bulgePinch(canvas.width / 2, canvas.height / 2, canvas.width / 1.5, 0.2)
              .update();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(fxCanvas, 0, 0, canvas.width, canvas.height);
            // Redraw selection marker.
            if (isSelected) {
              ctx.beginPath();
              ctx.arc(canvas.width - 8, 8, 5, 0, 2 * Math.PI);
              ctx.fillStyle = "#4CAF50";
              ctx.fill();
            }
            // Draw extra watermark.
            drawExtraWatermark(ctx, canvas.width, canvas.height);
          };
        } catch (e) {
          console.error("glfx.js error:", e);
        }
      } else {
        drawExtraWatermark(ctx, canvas.width, canvas.height);
      }
    }

    // Draw the theme image with wave distortion.
    function drawThemeImage(canvas, emoji) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Base white background.
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the emoji without rotation.
      ctx.font = "40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);

      // Apply wave distortion.
      drawWatermark(ctx, canvas.width, canvas.height);
      // Apply wave distortion.
      drawWatermark(ctx, canvas.width, canvas.height);
      // Apply wave distortion.
      drawWatermark(ctx, canvas.width, canvas.height);
      // Apply wave distortion.
      drawWatermark(ctx, canvas.width, canvas.height);
      
      

      // Draw circles in circles distortion
    function drawCircleDistortion(ctx, width, height) {
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 0.8;
      const numCircles = 5 + Math.floor(Math.random() * 5);
      for (let i = 0; i < numCircles; i++) {
        const radius = 10 + Math.random() * 20;
        const x = width / 2 + (Math.random() - 0.5) * width * 0.2;
        const y = height / 2 + (Math.random() - 0.5) * height * 0.2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.restore();
    }
      
      // Manual distortions: random lines, dots, and circles.
      for (let i = 0; i < 12; i++) {
        ctx.strokeStyle = "rgba(" + Math.floor(Math.random() * 256) + ", " + 
                           Math.floor(Math.random() * 256) + ", " + 
                           Math.floor(Math.random() * 256) + ", 0.2)";

        ctx.lineWidth = Math.random() * 2 + 0.5;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < 12; i++) {
        ctx.fillStyle = "rgba(" + Math.floor(Math.random() * 256) + ", " + 
                         Math.floor(Math.random() * 256) + ", " + 
                         Math.floor(Math.random() * 256) + ", 0.3)";

        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let radius = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < 18; i++) {
        ctx.strokeStyle = "rgba(" + Math.floor(Math.random() * 256) + ", " + 
                           Math.floor(Math.random() * 256) + ", " + 
                           Math.floor(Math.random() * 256) + ", 0.25)";

        ctx.lineWidth = Math.random() + 0.5;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let radius = Math.random() * 10 + 5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Apply colored lines distortion.
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      // Apply colored lines distortion.
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      // Apply colored lines distortion.
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      // Apply colored lines distortion.
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
  
    }

    // Add hover and click animations to tiles using anime.js.
    function addTileAnimations(canvas) {
      canvas.addEventListener('mouseenter', function () {
        anime({
          targets: canvas,
          scale: 1.05,
          duration: 100,
          easing: 'linear'
        });
      });
      canvas.addEventListener('mouseleave', function () {
        anime({
          targets: canvas,
          scale: 1,
          duration: 100,
          easing: 'linear'
        });
      });
      canvas.addEventListener('click', function () {
        anime({
          targets: canvas,
          scale: [1, 0.9, 1.1, 1],
          duration: 300,
          easing: 'easeInOutQuad'
        });
      });
    }

    // Update challenge info and progress dots.
    function updateChallengeInfo() {
      document.getElementById("captcha-info").textContent =  
    "Challenge " + currentRound + " of " + maxRounds + ". Attempts left: " + attemptsLeft;

      document.querySelectorAll("#challenge-dots .dot").forEach((dot, idx) => {
        dot.classList.toggle("active", idx < currentRound - 1);
      });
    }

    // Shuffle an array.
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Generate a secure random token.
    function generateToken() {
      return CryptoJS.SHA256(Math.random().toString() + Date.now().toString()).toString();
    }

    // Generate the CAPTCHA challenge.
    function generateCaptcha() {
      selectedTiles.clear();
      correctTiles.clear();
      tileData = [];
      const captchaGrid = document.getElementById("captcha-grid");
      captchaGrid.innerHTML = "";

      // Generate new token and record the generation time.
      captchaToken = generateToken();
      captchaStartTime = Date.now();

      const themes = Object.keys(emojiThemes);
      currentTheme = themes[Math.floor(Math.random() * themes.length)];
      const emojis = emojiThemes[currentTheme];

      // Display theme emoji with wave distortion.
      const themeCanvas = document.createElement("canvas");
      themeCanvas.width = 100;
      themeCanvas.height = 100;
      drawThemeImage(themeCanvas, themeImages[currentTheme][Math.floor(Math.random() * themeImages[currentTheme].length)]);
      const targetTheme = document.getElementById("target-theme");
      targetTheme.innerHTML = "";
      targetTheme.appendChild(themeCanvas);

      // Choose between 1 and 4 correct tiles.
      const correctCount = Math.floor(Math.random() * 4) + 1;
      while (correctTiles.size < correctCount) {
        correctTiles.add(Math.floor(Math.random() * totalTiles));
      }

      // Hash the token + sorted correct tile indices.
      expectedHash = CryptoJS.SHA256(captchaToken + JSON.stringify([...correctTiles].sort())).toString();

      // Select correct emojis from the theme.
      let correctEmojisForTiles = shuffle([...emojis]).slice(0, correctCount);

      // Wrong emojis: from all emojis not in the chosen theme.
      const allEmojis = Object.values(emojiThemes).flat();
      const wrongEmojis = allEmojis.filter(e => !emojis.includes(e));

      // Create 20 tile canvases.
      for (let i = 0; i < totalTiles; i++) {
        const canvas = document.createElement("canvas");
        canvas.width = 60;
        canvas.height = 60;
        canvas.style.cursor = "pointer";
        let emoji;
        if (correctTiles.has(i)) {
          emoji = correctEmojisForTiles.pop();
        } else {
          emoji = wrongEmojis[Math.floor(Math.random() * wrongEmojis.length)];
        }
        const rotation = Math.random() * 2 * Math.PI;
        tileData[i] = { emoji, canvas, rotation };
        drawTile(canvas, emoji, false, rotation, "#f9f9f9");
        addTileAnimations(canvas);
        canvas.addEventListener("click", function () {
          if (selectedTiles.has(i)) {
            selectedTiles.delete(i);
            drawTile(canvas, emoji, false, rotation, "#f9f9f9");
          } else {
            selectedTiles.add(i);
            drawTile(canvas, emoji, true, rotation, "#f9f9f9");
          }
          updateSubmitButton();
        });
        captchaGrid.appendChild(canvas);
      }
      updateChallengeInfo();
    }

    // Update the submit button text based on selected tiles.
    function updateSubmitButton() {
      const submitBtn = document.getElementById("submit-btn");
      if (selectedTiles.size > 0) {
        submitBtn.textContent = "Submit";
      } else {
        submitBtn.textContent = "Skip";
      }
    }

    const CaptchaController = (() => {
  // Cache DOM elements for better performance and easier error handling.
  const refreshBtn = document.getElementById("refresh-btn");
  const helpBtn = document.getElementById("help-btn");
  const helpMenu = document.getElementById("help-menu");
  const helpCloseBtn = document.getElementById("help-close-btn");
  const submitBtn = document.getElementById("submit-btn");
  const captchaBox = document.getElementById("captcha-box");
  const loginBtn = document.getElementById("login-btn");
  const captchaContainer = document.getElementById("captcha-container");

  // Helper function to safely update innerHTML for an element inside captchaBox.
  function updateCheckboxIcon(iconHTML) {
    if (captchaBox) {
      const checkboxIcon = captchaBox.querySelector(".checkbox-icon");
      if (checkboxIcon) {
        checkboxIcon.innerHTML = iconHTML;
      }
    }
  }

  // Attach event listener to refresh button.
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      generateCaptcha();
    });
  }

  // Attach event listeners for showing/hiding the help menu.
  if (helpBtn && helpMenu) {
    helpBtn.addEventListener("click", () => {
      helpMenu.style.display = "block";
    });
  }

  if (helpCloseBtn && helpMenu) {
    helpCloseBtn.addEventListener("click", () => {
      helpMenu.style.display = "none";
    });
  }

  // Attach event listener for captcha submission.
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      // Check if captcha is older than 5 minutes.
      if (Date.now() - captchaStartTime > 5 * 60 * 1000) {
        alert("Captcha expired. Please refresh.");
        generateCaptcha();
        return;
      }

      // Compute the hash from the captcha token and sorted selected tiles.
      const sortedTiles = Array.from(selectedTiles).sort();
      const selectedHash = CryptoJS.SHA256(captchaToken + JSON.stringify(sortedTiles)).toString();

      // Compare computed hash with expected hash.
      if (selectedHash === expectedHash) {
        if (currentRound < maxRounds) {
          currentRound++;
          updateChallengeInfo();
          alert("Correct! Proceeding to the next challenge.");
          generateCaptcha();
        } else {
          updateCheckboxIcon('<i class="fa-solid fa-check"></i>');
          if (captchaBox) captchaBox.classList.add("checked");
          if (loginBtn) loginBtn.disabled = false;
          if (captchaContainer) captchaContainer.style.display = "none";
          alert("All challenges completed successfully!");
        }
      } else {
        // Wrong answer: decrement attempts.
        attemptsLeft--;
        if (attemptsLeft <= 0) {
          alert("No attempts remaining. Captcha challenge will now disappear.");
          if (refreshBtn) refreshBtn.disabled = true;
          submitBtn.disabled = true;
          updateCheckboxIcon('<i class="fa-solid fa-xmark"></i>');
          if (captchaBox) captchaBox.classList.add("failed");
          if (captchaContainer) captchaContainer.style.display = "none";
        } else {
          alert("Incorrect selection, please try again!");
          generateCaptcha();
        }
      }
    });
  }

  // Optionally, expose methods if needed.
  return {
    refreshCaptcha: generateCaptcha
  };
})();


    // When the CAPTCHA trigger box is clicked, show spinner then load challenge.
    document.getElementById("captcha-box").addEventListener("click", function () {
      const box = document.getElementById("captcha-box");
      if (box.classList.contains("checked") || box.classList.contains("failed")) return;
      const spinner = document.createElement('div');
      spinner.classList.add('spinner');
      box.querySelector(".checkbox-icon").innerHTML = '';
      box.querySelector(".checkbox-icon").appendChild(spinner);

      // Artificial delay (300ms) for added security.
      setTimeout(() => {
        currentRound = 1;
        attemptsLeft = 10;
        updateChallengeInfo();
        document.getElementById("captcha-container").style.display = "block";
        generateCaptcha();
      }, 300);
    });

    // Make the CAPTCHA container draggable.
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const captchaContainer = document.getElementById("captcha-container");

    captchaContainer.addEventListener("mousedown", dragMouseDown);

    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      captchaContainer.style.top = (captchaContainer.offsetTop - pos2) + "px";
      captchaContainer.style.left = (captchaContainer.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }

   const BotDetector = (() => {
  // Data stores with configurable maximum sizes
  const mouseMovements = [];
  const keyPresses = [];
  const clickPatterns = [];
  const MAX_MOUSE_EVENTS = 100;
  const MAX_KEY_EVENTS = 50;
  const MAX_CLICK_EVENTS = 50;

  // Helper functions
  const average = (arr) => (arr.length ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0);
  const variance = (arr, mean) =>
    arr.length ? arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length : 0;

  // Advanced mouse movement tracking (includes a cap to prevent memory bloat)
  function trackMouseMove(event) {
    mouseMovements.push({ x: event.clientX, y: event.clientY, time: Date.now() });
    if (mouseMovements.length > MAX_MOUSE_EVENTS) {
      mouseMovements.shift();
    }
  }

  // Advanced key press tracking
  function trackKeyPress(event) {
    keyPresses.push({ key: event.key, time: Date.now() });
    if (keyPresses.length > MAX_KEY_EVENTS) {
      keyPresses.shift();
    }
  }

  // Advanced click pattern tracking
  function trackClickPatterns(event) {
    clickPatterns.push({ x: event.clientX, y: event.clientY, time: Date.now() });
    if (clickPatterns.length > MAX_CLICK_EVENTS) {
      clickPatterns.shift();
    }
  }

  // Compute the angular variability of the mouse path.
  // Low angular variability (i.e. nearly straight or overly consistent paths)
  // may indicate synthetic movements.
  function computeAngularVariability() {
    if (mouseMovements.length < 3) return null;
    const angles = [];
    for (let i = 2; i < mouseMovements.length; i++) {
      const dx1 = mouseMovements[i - 1].x - mouseMovements[i - 2].x;
      const dy1 = mouseMovements[i - 1].y - mouseMovements[i - 2].y;
      const dx2 = mouseMovements[i].x - mouseMovements[i - 1].x;
      const dy2 = mouseMovements[i].y - mouseMovements[i - 1].y;
      const angle1 = Math.atan2(dy1, dx1);
      const angle2 = Math.atan2(dy2, dx2);
      let diff = Math.abs(angle2 - angle1);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;
      angles.push(diff);
    }
    return average(angles);
  }

  // Analyze the collected data for bot-like behavior using multiple heuristics.
  function analyzeBotBehavior() {
    let botScore = 0;
    const issues = [];

    // --- Mouse Movement Analysis ---
    if (mouseMovements.length > 1) {
      // Timing between mouse moves
      const intervals = [];
      for (let i = 1; i < mouseMovements.length; i++) {
        intervals.push(mouseMovements[i].time - mouseMovements[i - 1].time);
      }
      const avgInterval = average(intervals);
      if (avgInterval < 20) {
        botScore += 2;
        issues.push("Low average mouse move interval");
      }
      const intervalVar = variance(intervals, avgInterval);
      if (intervalVar < 50) {
        botScore += 1;
        issues.push("Mouse move intervals are overly uniform");
      }
      // Angular variability check
      const angVar = computeAngularVariability();
      if (angVar !== null && angVar < 0.1) {
        botScore += 2;
        issues.push("Low angular variability in mouse movement");
      }
    }

    // --- Key Press Analysis ---
    if (keyPresses.length > 1) {
      const keyIntervals = [];
      for (let i = 1; i < keyPresses.length; i++) {
        keyIntervals.push(keyPresses[i].time - keyPresses[i - 1].time);
      }
      const avgKeyInterval = average(keyIntervals);
      if (avgKeyInterval < 40) {
        botScore += 2;
        issues.push("Rapid key presses detected");
      }
      const keyIntervalVar = variance(keyIntervals, avgKeyInterval);
      if (keyIntervalVar < 30) {
        botScore += 1;
        issues.push("Key press intervals are overly uniform");
      }
      // Excessive repetition of a single key (e.g., holding a key down)
      const keyCounts = {};
      keyPresses.forEach((entry) => {
        keyCounts[entry.key] = (keyCounts[entry.key] || 0) + 1;
      });
      for (let key in keyCounts) {
        if (keyCounts[key] / keyPresses.length > 0.8) {
          botScore += 1;
          issues.push("Excessive repetition of key: " + key);
        }
      }
    }

    // --- Click Pattern Analysis ---
    if (clickPatterns.length > 1) {
      const clickIntervals = [];
      for (let i = 1; i < clickPatterns.length; i++) {
        clickIntervals.push(clickPatterns[i].time - clickPatterns[i - 1].time);
      }
      const avgClickInterval = average(clickIntervals);
      if (avgClickInterval < 100) {
        botScore += 2;
        issues.push("Clicks occur too rapidly");
      }
      // Check for spatial clustering (if clicks are nearly at the same point)
      const xs = clickPatterns.map((p) => p.x);
      const ys = clickPatterns.map((p) => p.y);
      const avgX = average(xs);
      const avgY = average(ys);
      const distances = clickPatterns.map((p) => Math.hypot(p.x - avgX, p.y - avgY));
      if (average(distances) < 5) {
        botScore += 2;
        issues.push("Clicks are spatially clustered");
      }
    }

    // --- Final Decision ---
    const DETECTION_THRESHOLD = 4; // Adjust based on testing & requirements
    if (botScore >= DETECTION_THRESHOLD) {
      console.warn("Bot-like behavior detected:", issues.join("; "));
      alert("Bot-like behavior detected! Verification failed.");
      return false;
    }
    return true;
  }

  // Expose the tracking and analysis functions
  return {
    trackMouseMove,
    trackKeyPress,
    trackClickPatterns,
    analyzeBotBehavior,
  };
})();

    function checkSessionTimeout() {
  if (Date.now() - sessionStartTime > sessionTimeout) {
    // Show a message to the user about the session expiration
    showSessionExpiredMessage();

    // Refresh the page after a short delay (to allow the user to see the message)
    setTimeout(function() {
      window.location.reload(); // Refresh the page
    }, 1500); // 1.5-second delay to give the user time to see the message
  }
}

// Function to show a session expired message
function showSessionExpiredMessage() {
  const messageContainer = document.getElementById("session-message");
  messageContainer.textContent = "Your session has expired due to inactivity. The page will refresh.";
  messageContainer.classList.add("error"); // Add a class for styling (error message)
  
  // Optionally, you can hide the message after a few seconds
  setTimeout(() => {
    messageContainer.classList.remove("error");
    messageContainer.textContent = ""; // Clear message
  }, 5000); // 5 seconds for the user to see the message
}

    const RateLimiter = (() => {
  // Configuration constants.
  const MAX_TOKENS = 5;             // Maximum allowed attempts (tokens) per IP.
  const REFILL_INTERVAL = 60 * 1000;  // Refill tokens every 1 minute.
  const BLOCK_DURATION = 5 * 60 * 1000; // Block IP for 5 minutes when exhausted.

  // Storage for each IP's token bucket data.
  // Each entry is structured as:
  // { tokens: number, lastRefill: timestamp, blockedUntil: timestamp }
  const buckets = new Map();

  /**
   * Performs rate limiting for the given IP address.
   *
   * @param {string} ip - The IP address of the client.
   * @returns {boolean} - Returns true if the attempt is allowed, false otherwise.
   */
  function rateLimitAttempts(ip) {
    const now = Date.now();

    // Initialize the bucket for new IP addresses.
    if (!buckets.has(ip)) {
      buckets.set(ip, { tokens: MAX_TOKENS, lastRefill: now, blockedUntil: 0 });
    }
    const bucket = buckets.get(ip);

    // If the IP is currently blocked, reject the attempt.
    if (bucket.blockedUntil > now) {
      alert("Too many attempts. Please try again later.");
      return false;
    }

    // Refill tokens based on the elapsed time since the last refill.
    const elapsed = now - bucket.lastRefill;
    if (elapsed >= REFILL_INTERVAL) {
      // Calculate how many full intervals have passed.
      const tokensToAdd = Math.floor(elapsed / REFILL_INTERVAL);
      bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }

    // Allow the attempt if tokens are available.
    if (bucket.tokens > 0) {
      bucket.tokens--;
      return true;
    } else {
      // No tokens available: block the IP for a set duration.
      bucket.blockedUntil = now + BLOCK_DURATION;
      alert("Too many attempts. Please try again later.");
      return false;
    }
  }

  return { rateLimitAttempts };
})();

// Example usage:
// Assume you have a way to retrieve the client's IP (e.g., from a server request).
// For demonstration purposes, we'll use a placeholder IP.
const clientIP = "192.168.1.100";
if (RateLimiter.rateLimitAttempts(clientIP)) {
  // Process the request.
  console.log("Attempt allowed.");
} else {
  // Block the request.
  console.log("Attempt blocked.");
}


    document.addEventListener("mousemove", trackMouseMove);
    document.addEventListener("keydown", trackKeyPress);
    document.addEventListener("click", trackClickPatterns);

    function validateCaptcha() {
      if (!analyzeBotBehavior() || !rateLimitAttempts()) return;

      let userHash = CryptoJS.SHA256(captchaToken + JSON.stringify([...selectedTiles].sort())).toString();
      if (userHash === expectedHash) {
        alert("Captcha passed!");
      } else {
        alert("Incorrect selection. Try again.");
        attemptsLeft--;
        if (attemptsLeft === 0) {
          alert("Too many failed attempts.");
        }
      }
    }

    // Initialize particles.js inside the CAPTCHA container.
    particlesJS("particles-js", {
      "particles": {
        "number": { "value": 30, "density": { "enable": true, "value_area": 400 } },
        "color": { "value": "#ffffff" },
        "opacity": { "value": 0.3, "random": true },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": false },
        "move": { "enable": true, "speed": 1, "direction": "none", "random": true }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": { "onhover": { "enable": false }, "onclick": { "enable": false } },
        "modes": {}
      },
      "retina_detect": true
    });

    // Periodically check for session timeout
    setInterval(checkSessionTimeout, 6000); // Check every minute
  </script>
</body>
</html>
`);
 });

app.get('/news', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>News | The Lost Nemo</title>

    <style>
        :root {
            --primary-color: #1E90FF;
            --bg-dark: #0A0F1D;
            --bg-light: #101826;
            --text-light: #E0E6F1;
            --text-muted: #8892B0;
            --border-color: #1E90FF;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-dark);
            color: var(--text-light);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .container {
            background: var(--bg-light);
            padding: 25px;
            border-radius: 0;
            max-width: 900px;
            width: 100%;
            text-align: left;
            border: 2px solid var(--border-color);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 80vh;
        }

        h1 {
            font-size: 22px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 18px;
        }

        .news-container {
            display: flex;
            flex-direction: column;
            gap: 30px;
            overflow-y: auto;
            max-height: 70vh;
            padding-right: 10px;
        }

        .news-item {
            background-color: #1f1f1f;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
        }

        .news-item:hover {
            background-color: #333;
        }

        .news-item h2 {
            font-size: 1.8em;
            margin: 0 0 10px;
        }

        .news-item p {
            font-size: 1.1em;
            color: #bbb;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .read-more {
            color: #0099ff;
            text-decoration: none;
            font-weight: bold;
        }

        .read-more:hover {
            text-decoration: underline;
        }

        footer {
            margin-top: 15px;
            font-size: 12px;
            text-align: center;
            color: var(--text-muted);
            width: 100%;
            padding: 10px 0;
        }

        footer a {
            color: var(--primary-color);
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }

        /* Custom Scrollbar */
        .news-container::-webkit-scrollbar {
            width: 12px;
        }

        .news-container::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 6px;
        }

        .news-container::-webkit-scrollbar-track {
            background: #202A3C;
            border-radius: 6px;
        }

        .news-container::-webkit-scrollbar-corner {
            background: #202A3C;
        }
    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>

    <div class="container">
        <h1>Latest News</h1>

        <div class="news-container">
            <div class="news-item pinned">
    <h2>Introducing iHemo's Eye - Market Moderator Bot</h2>
    <p>The Lost Nemo server has a new addition to our team! Meet iHemo’s Eye, our new market moderator bot. It’s designed to streamline the purchasing process by handling buying requests and managing spots. Interested buyers will now be able to request purchases through the bot using the +buyspot command. Ensure your spot is secured quickly as the service operates on a first-come, first-serve basis.</p>
    <a href="/ihemo-eye" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>New Membership Perks - Role and Channels Galore!</h2>
    <p>We’ve added exciting new roles and channels that are available exclusively through our membership program. Unlock access to @Tier I, @Tier II, @Tier III roles, and premium channels like ⁠👀・secret-society and ⁠💬・chat². Become a premium member and enjoy all these benefits now!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Brand New Channels Added</h2>
    <p>Several new channels have been introduced to make your experience more enjoyable, including ⁠🚧・area-51, ⁠👀・secret-society, ⁠💜・boosters, and ⁠🌟・vip-lounge channels. These are available to premium members and those who reach certain levels. Check them out today!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Spot Request Channel for Premium Members</h2>
    <p>We’ve added a new ⁠💢・spot-requests channel available exclusively for premium members. Use it to request special spots for activities, events, and more! Get exclusive access and ensure your spot today.</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>New VIP Lounges for Premium Members</h2>
    <p>Enjoy an upgraded experience with new VIP lounges! Accessible to premium members, these lounges offer a quiet, exclusive space to hang out and chat with others who share your passion. Check out the new ⁠🌟・vip-lounge channels and enjoy the perks of being a premium member!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Exclusive Event for Legendary Members</h2>
    <p>We’re hosting an exclusive event for our Legendary Members! If you’ve reached level 100, you’re invited to join us for a special event where you can earn even more rewards and enjoy a one-of-a-kind experience. Don’t miss out!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Boosters’ Recognition and Special Rewards</h2>
    <p>We’re recognizing our amazing boosters with exclusive rewards! Join the ⁠💜・boosters channel and participate in the upcoming booster recognition event. Enjoy unique rewards and a special thank-you for your contribution to the server!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Announcing the New The Lost Nemo Store</h2>
    <p>The Lost Nemo server now has its very own store! You can now purchase exclusive server merchandise, premium items, and limited-time offers. Visit our store today to grab your gear and show your support for the community!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>New Moderation Tools for Server Admins</h2>
    <p>We’ve implemented powerful new moderation tools for server administrators to ensure a better and safer environment for everyone. From custom bans to automated warning systems, admins now have more control than ever before. Learn how to use the new features in our admin guide.</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Improved XP System: More Ways to Level Up!</h2>
    <p>The XP system has been overhauled! We’ve introduced new ways to earn XP, such as participation in server events, inviting friends, and completing daily challenges. Start leveling up faster and unlocking new perks today!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Discord Bot Enhancements - New Commands and Features</h2>
    <p>We’ve made significant improvements to our Discord bot, introducing new commands, including a custom trivia game, music streaming options, and daily rewards! Check out the new commands by typing !help in the chat.</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Server Leveling System Update: Unlock New Benefits!</h2>
    <p>With the new server leveling system update, you can now unlock exclusive benefits as you level up! Access new channels, earn special roles, and enjoy VIP perks the higher you go. Start leveling today!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Introducing The Lost Nemo Podcast</h2>
    <p>We’re launching the official The Lost Nemo podcast, where we’ll discuss server updates, events, and community highlights. Tune in every week for fresh content, interviews, and more. Stay connected with the latest updates!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>New Custom Emoji Pack Released</h2>
    <p>We've just released a new collection of exclusive emojis for our community! Show your support and personality with these brand new emojis available for premium members and active contributors. Check them out and start using them in chat!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Server Maintenance: Improved Performance and Stability</h2>
    <p>We’ve successfully completed a major server maintenance update to improve performance and stability. Expect faster load times and an overall smoother experience as we continue to make The Lost Nemo server better for you!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Monthly Member Spotlight</h2>
    <p>We’re starting a new tradition: the Monthly Member Spotlight! Each month, we’ll highlight an outstanding community member for their contributions, involvement, and positive attitude. Nominate your friends today!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Exclusive Partnership with Gaming Gear Brand</h2>
    <p>We’re excited to announce an exclusive partnership with a leading gaming gear brand! Premium members will now receive exclusive discounts on gaming equipment, accessories, and more. Visit the members-only store to claim your offers.</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>The Lost Nemo's First Anniversary Event</h2>
    <p>We’re celebrating our first anniversary with a massive event filled with giveaways, special activities, and community challenges! Join us as we look back on the past year and celebrate with exclusive rewards and fun activities.</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>New Community Guidelines for 2025</h2>
    <p>We’ve updated our community guidelines for 2025. These new guidelines will help ensure that The Lost Nemo remains a positive, welcoming space for everyone. Be sure to review the updated rules and stay up to date with our expectations for members.</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>VIP Member Exclusive: Early Access to New Features</h2>
    <p>VIP members now have exclusive early access to new features and updates before they’re available to the public! Get a sneak peek at upcoming changes and provide feedback to help shape the future of The Lost Nemo.</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Join Our New Staff Recruitment Program</h2>
    <p>We’re expanding our team! If you’re passionate about The Lost Nemo and want to help shape the community, we’re now accepting applications for new staff members. Apply today and be part of the team that makes our server awesome!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Updated Server Economy: New Currency and Items</h2>
    <p>The Lost Nemo server’s economy has been revamped! We’ve introduced a new currency system and added exciting new items available for purchase. Start earning new rewards today and make the most of the revamped economy!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Expanded Role Customization Options</h2>
    <p>We’ve expanded the role customization options for our community! You can now create custom role colors, special icons, and even unique names for roles. Give your server a personal touch and stand out today!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Introducing The Lost Nemo Trading System</h2>
    <p>The Lost Nemo now has a fully-fledged trading system! You can now trade in-game items, currency, and perks with other members. Start making deals and trading with others to get the best deals around!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Flash Sale: 20% Off All Premium Memberships!</h2>
    <p>For a limited time only, we’re offering 20% off all premium memberships! Don’t miss your chance to unlock exclusive perks, roles, and channels at a discounted rate. Hurry, the sale ends soon!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>




        </div>
    </div>

    <footer>
        <p>&copy; 2025 The Lost Nemo. All rights reserved. | <a href="https://thelostnemo.glitch.me/support">Contact Us</a></p>
    </footer>

</body>

</html>



`);
 });

app.get('/ihemo-eye', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="iHemo's Eye is your trusted market moderator bot for The Lost Nemo community.">
    <title>iHemo's Eye - Market Moderator Bot</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <!-- Add FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Roboto', sans-serif;
        }

        body {
            background-color: #1f1f1f;
            color: white;
        }

        .container {
            width: 80%;
            margin: 0 auto;
        }

        header {
            background: #333;
            padding: 50px 0;
            text-align: center;
        }

        h1 {
            font-size: 3rem;
            margin-bottom: 20px;
        }

        .tagline {
            font-size: 1.2rem;
            margin-bottom: 30px;
        }

        .bot-pfp img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 4px solid #FFD700;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        nav {
            background: #222;
            padding: 15px 0;
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 100;
        }

        nav .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        nav .logo h2 {
            font-size: 1.6rem;
            color: #FFD700;
        }

        nav ul {
            list-style: none;
            display: flex;
        }

        nav ul li {
            margin-left: 20px;
        }

        nav ul li a {
            color: white;
            text-decoration: none;
            font-size: 1.1rem;
        }

        nav ul li a:hover {
            color: #FFD700;
        }

        .section {
            padding: 60px 0;
            background: #282828;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 30px;
        }

        .feature-item {
            text-align: center;
        }

        .feature-item i {
            font-size: 2rem;
            color: #FFD700;
            margin-bottom: 10px;
        }

        .command-item {
            background: #333;
            padding: 20px;
            margin-bottom: 10px;
            border-radius: 10px;
        }

        .command-item .command-name {
            font-weight: bold;
            color: #FFD700;
        }

        .cta-button {
            padding: 15px 30px;
            background: #FFD700;
            color: black;
            border-radius: 30px;
            font-size: 1.2rem;
            text-decoration: none;
        }

        .cta-button:hover {
            background: #FFB700;
        }

        footer {
            background: #222;
            padding: 20px 0;
            text-align: center;
        }

        #scroll-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #FFD700;
            padding: 10px;
            border-radius: 50%;
            font-size: 1.5rem;
            color: black;
            cursor: pointer;
        }

        #scroll-top:hover {
            background: #FFB700;
        }

        .command-item p {
            color: #bbb;
        }

        .commands-list {
            margin-top: 30px;
        }
        
        #support .cta-wrapper {
    margin-top: 20px; /* Add some space between text and the button */
    text-align: center; /* Center align the button */
}

#support .cta-button {
    padding: 15px 30px;
    background: #FFD700;
    color: black;
    border-radius: 30px;
    font-size: 1.2rem;
    text-decoration: none;
    display: inline-block; /* Ensure the button is treated as a block element */
}

#support .cta-button:hover {
    background: #FFB700;
}

    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>

<!-- Navigation Section -->
<nav>
    <div class="container">
        <div class="logo">
            <h2><i class="fas fa-eye"></i> iHemo's Eye</h2>
        </div>
        <ul class="nav-links">
            <li><a href="#intro">Introduction</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#commands">Commands</a></li>
            <li><a href="#support">Support</a></li>
        </ul>
    </div>
</nav>

<!-- Hero Section -->
<header id="intro">
    <div class="container">
        <h1>Welcome to iHemo's Eye</h1>
        <p>Your trusted market moderator bot for The Lost Nemo community</p>
        <div class="bot-pfp">
            <img src="https://cdn.discordapp.com/avatars/1094406775932985508/45f42510e3d90a420ecc4f3aca02c187.webp?size=4096" alt="iHemo's Eye Bot">
        </div>
        <p class="tagline">Manage your market, warnings, and more with ease!</p>
        <a href="#commands" class="cta-button">View Commands</a>
    </div>
</header>

<!-- Features Section -->
<section id="features" class="section">
    <div class="container">
        <h2>Key Features</h2>
        <div class="features-grid">
            <div class="feature-item">
                <i class="fas fa-cogs"></i>
                <h3>Advanced Moderation</h3>
                <p>Set up your warning and audit logs, mute users, and manage bans with ease.</p>
            </div>
            <div class="feature-item">
                <i class="fas fa-users-cog"></i>
                <h3>Staff Tools</h3>
                <p>Access the staff guide, view your stats, and make informed decisions with the bot’s help.</p>
            </div>
            <div class="feature-item">
                <i class="fas fa-ban"></i>
                <h3>Ban Management</h3>
                <p>Easily manage permanent or temporary bans with custom lists for your server.</p>
            </div>
            <div class="feature-item">
                <i class="fas fa-clock"></i>
                <h3>Time-based Actions</h3>
                <p>Mute users or set temporary bans, ensuring time-based moderation for any situation.</p>
            </div>
        </div>
    </div>
</section>

<!-- Commands Section -->
<section id="commands" class="section">
    <div class="container">
        <h2>Bot Commands</h2>
        <p>Below are some of the essential commands you can use with iHemo's Eye:</p>
        <div class="commands-list">
            <div class="command-item">
                <span class="command-name">/get-quota</span>
                <p>Get the warning quota for a specific house and date.</p>
            </div>
            <div class="command-item">
                <span class="command-name">/mute</span>
                <p>Mute a user for a specified duration.</p>
            </div>
            <div class="command-item">
                <span class="command-name">/remove-all-warns</span>
                <p>Remove all warnings of a user in a specific group.</p>
            </div>
            <div class="command-item">
                <span class="command-name">/remove-warn</span>
                <p>Remove a specific warning of a user by its ID.</p>
            </div>
            <div class="command-item">
                <span class="command-name">/set-audit-log</span>
                <p>Set the audit log ID for the server.</p>
            </div>
            <div class="command-item">
                <span class="command-name">/set-ban-list</span>
                <p>Set the ban list ID for permanent/soft bans.</p>
            </div>
            <div class="command-item">
                <span class="command-name">/set-muted-role</span>
                <p>Set the muted role for your server.</p>
            </div>
            <div class="command-item">
                <span class="command-name">/staff-guide</span>
                <p>Get the staff guide for everything you need to know.</p>
            </div>
            <div class="command-item">
                <span class="command-name">/staff-profile</span>
                <p>Get your staff stats.</p>
            </div>
            <div class="command-item">
                <span class="command-name">/unmute</span>
                <p>Remove a mute from a member.</p>
            </div>
            <div class="command-item">
                <span class="command-name">/warnings</span>
                <p>View all warnings of a specific user.</p>
            </div>
        </div>
    </div>
</section>

<!-- Support Section -->
<section id="support" class="section">
    <div class="container">
        <h2>Need Help?</h2>
        <p>If you need assistance or have any questions, feel free to contact our support team.</p>
        <div class="cta-wrapper">
            <a href="https://discord.gg/uMfzd7UYhe" class="cta-button">Join Support Server</a>
        </div>
    </div>
</section>

<!-- Footer Section -->
<footer>
    <div class="container">
        <p>&copy; 2025 iHemo's Eye Bot - All Rights Reserved</p>
    </div>
</footer>

<!-- Scroll to Top Button -->
<div id="scroll-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'});">
    <i class="fas fa-arrow-up"></i>
</div>

<script>
    // Scroll to Top
    window.addEventListener('scroll', function() {
        const scrollTopButton = document.getElementById('scroll-top');
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollTopButton.style.display = 'block';
        } else {
            scrollTopButton.style.display = 'none';
        }
    });
</script>

</body>
</html>

`);
 });

app.get('/advertising', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Advertisement Creation</title>
    <script src="https://hcaptcha.com/1/api.js" async defer></script>
    <style>
        :root {
            --primary-color: #1E90FF;
            --secondary-color: #FF6347;
            --bg-dark: #0A0F1D;
            --bg-light: #101826;
            --text-light: #E0E6F1;
            --text-muted: #8892B0;
            --border-color: #1E90FF;
            --highlight-color: #FFD700;
            --hover-color: #187bcd;
            --shadow-color: rgba(0, 0, 0, 0.2);
            --glass-bg: rgba(10, 15, 29, 0.75);
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-dark);
            color: var(--text-light);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            overflow-x: hidden;
        }

        .container {
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 2px solid var(--border-color);
            border-radius: 10px;
            padding: 40px;
            max-width: 700px;
            width: 100%;
            text-align: center;
            position: relative;
            box-shadow: 0 4px 20px var(--shadow-color);
            animation: fadeIn 0.5s ease-in-out;
            display: flex;
            flex-direction: column;
            justify-content: center;
            transition: transform 0.3s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 30px;
            color: var(--highlight-color);
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }

        .form-control, .select-menu {
            border: 2px solid var(--primary-color);
            padding: 15px;
            background: #2E3C53;
            color: var(--text-light);
            border-radius: 5px;
            transition: all 0.3s ease;
            width: 100%;
        }

        .form-control:focus, .select-menu:focus {
            border-color: var(--highlight-color);
            background: #1E2A36;
        }

        .submit-btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 16px;
            font-size: 18px;
            width: 100%;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            text-transform: uppercase;
            margin-top: 20px;
            box-shadow: 0 4px 15px var(--shadow-color);
            border-radius: 8px;
            animation: slideIn 0.5s ease-in-out;
        }

        @keyframes slideIn {
            from {
                transform: translateY(30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .submit-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .submit-btn:hover {
            background: var(--hover-color);
            transform: translateY(-3px);
        }

        .submit-btn:active {
            transform: translateY(2px);
        }

        footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: var(--text-muted);
            padding: 10px;
            background: #2E3C53;
            box-shadow: 0px 6px 20px var(--shadow-color);
            border-radius: 10px;
            position: relative;
        }

        footer a {
            color: var(--primary-color);
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }

        footer .btn-help {
            display: none;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 12px;
        }

        ::-webkit-scrollbar-track {
            background: #2E3C53;
        }

        ::-webkit-scrollbar-thumb {
            background-color: var(--primary-color);
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background-color: var(--highlight-color);
        }

        /* Remove resizing */
        textarea {
            resize: none;
        }

        .preview-box {
            background: #2E3C53;
            color: var(--text-light);
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            box-shadow: 0 4px 15px var(--shadow-color);
        }

        .preview-title {
            font-size: 22px;
            font-weight: 600;
            color: var(--highlight-color);
        }

        .preview-content {
            margin-top: 10px;
        }
    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>

    <div class="container">
        <h1>Create Your Advertisement</h1>

        <form id="adForm">
            <div class="form-group">
                <label for="adTitle">Ad Title</label>
                <input type="text" id="adTitle" class="form-control" placeholder="Enter your ad title" required>
            </div>

            <div class="form-group">
                <label for="adContent">Ad Content</label>
                <textarea id="adContent" class="form-control" placeholder="Enter your ad content" rows="6" required></textarea>
            </div>

            <div class="form-group">
                <label for="frequency">Post Frequency</label>
                <select id="frequency" class="select-menu" required>
                    <option value="2 hours">Every 2 Hours</option>
                    <option value="4 hours">Every 4 Hours</option>
                    <option value="6 hours">Every 6 Hours</option>
                    <option value="12 hours">Every 12 Hours</option>
                </select>
            </div>

            <div class="form-group">
                <label for="duration">Ad Duration</label>
                <select id="duration" class="select-menu" required>
                    <option value="1 day">1 Day</option>
                    <option value="3 days">3 Days</option>
                    <option value="7 days">7 Days</option>
                    <option value="30 days">30 Days</option>
                </select>
            </div>

            <!-- hCaptcha -->
            <div class="form-group">
                <div class="h-captcha" data-sitekey="#################"></div>
            </div>

            <!-- Ad Preview Section -->
            <div class="preview-box">
                <h3 class="preview-title">Ad Preview</h3>
                <div class="preview-content">
                    <strong>Title:</strong> <span id="previewTitle"></span><br>
                    <strong>Content:</strong> <span id="previewContent"></span><br>
                    <strong>Frequency:</strong> <span id="previewFrequency"></span><br>
                    <strong>Duration:</strong> <span id="previewDuration"></span>
                </div>
            </div>

            <button type="submit" class="submit-btn" id="submitBtn" disabled>Create Advertisement</button>
        </form>
    </div>

    <footer>
        <p>Need help? Visit our <a href="/support">Support Section</a> for assistance.</p>
    </footer>

    <script>
        // Enable the submit button if captcha is completed
        let isCaptchaCompleted = false;

        function onCaptchaCompleted() {
            isCaptchaCompleted = true;
            document.getElementById('submitBtn').disabled = false;
        }

        // Form Submission
        document.getElementById('adForm').addEventListener('submit', function(e) {
            e.preventDefault();

            // Ensure captcha is completed
            if (!isCaptchaCompleted) {
                alert("Please complete the CAPTCHA to proceed.");
                return;
            }

            // Retrieve input values
            var title = document.getElementById('adTitle').value;
            var content = document.getElementById('adContent').value;
            var frequency = document.getElementById('frequency').value;
            var duration = document.getElementById('duration').value;

            // Display the preview
            document.getElementById('previewTitle').textContent = title;
            document.getElementById('previewContent').textContent = content;
            document.getElementById('previewFrequency').textContent = frequency;
            document.getElementById('previewDuration').textContent = duration;

            // Alert user
            alert("Your ad has been scheduled to post every " + frequency + " for " + duration + ".");
        });
    </script>
</body>
</html>


`);
 });

app.get('/suggestions', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Submit a Suggestion</title>
    <script src="https://hcaptcha.com/1/api.js" async defer></script>
    <style>
        :root {
            --primary-color: #1E90FF;
            --secondary-color: #FF6347;
            --bg-dark: #0A0F1D;
            --bg-light: #101826;
            --text-light: #E0E6F1;
            --text-muted: #8892B0;
            --border-color: #1E90FF;
            --highlight-color: #FFD700;
            --hover-color: #187bcd;
            --shadow-color: rgba(0, 0, 0, 0.2);
            --glass-bg: rgba(10, 15, 29, 0.75);
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-dark);
            color: var(--text-light);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            overflow-x: hidden;
        }

        .container {
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 2px solid var(--border-color);
            border-radius: 10px;
            padding: 40px;
            max-width: 700px;
            width: 100%;
            text-align: center;
            position: relative;
            box-shadow: 0 4px 20px var(--shadow-color);
            animation: fadeIn 0.5s ease-in-out;
            display: flex;
            flex-direction: column;
            justify-content: center;
            transition: transform 0.3s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 20px;
            color: var(--highlight-color);
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }

        .form-control {
            border: 2px solid var(--primary-color);
            padding: 15px;
            background: #2E3C53;
            color: var(--text-light);
            border-radius: 5px;
            transition: all 0.3s ease;
            width: 100%;
        }

        .form-control:focus {
            border-color: var(--highlight-color);
            background: #1E2A36;
        }

        textarea {
            resize: none;
            height: 120px;
        }

        .submit-btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 16px;
            font-size: 18px;
            width: 100%;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            text-transform: uppercase;
            margin-top: 20px;
            box-shadow: 0 4px 15px var(--shadow-color);
            border-radius: 8px;
            animation: slideIn 0.5s ease-in-out;
        }

        @keyframes slideIn {
            from {
                transform: translateY(30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .submit-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .submit-btn:hover {
            background: var(--hover-color);
            transform: translateY(-3px);
        }

        .submit-btn:active {
            transform: translateY(2px);
        }

        footer {
            margin-top: 15px;
            font-size: 12px;
            color: var(--text-muted);
            padding: 5px;
            background: transparent;
            box-shadow: none;
            position: relative;
        }

        footer a {
            color: var(--primary-color);
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 12px;
        }

        ::-webkit-scrollbar-track {
            background: #2E3C53;
        }

        ::-webkit-scrollbar-thumb {
            background-color: var(--primary-color);
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background-color: var(--highlight-color);
        }

        /* Remove resizing */
        textarea {
            resize: none;
        }
    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=#################"></script>
<body>

    <div class="container">
        <h1>Submit a Suggestion</h1>

        <form id="suggestionForm">
            <div class="form-group">
                <label for="suggestionTitle">Suggestion Title</label>
                <input type="text" id="suggestionTitle" class="form-control" placeholder="Enter your suggestion title" required>
            </div>

            <div class="form-group">
                <label for="suggestionContent">Suggestion Details</label>
                <textarea id="suggestionContent" class="form-control" placeholder="Enter your suggestion details" rows="6" required></textarea>
            </div>

            <!-- hCaptcha -->
            <div class="form-group">
                <div class="h-captcha" data-sitekey="#########################"></div>
            </div>

            <button type="submit" class="submit-btn" id="submitBtn" disabled>Submit Suggestion</button>
        </form>
    </div>

    <script>
        // Enable the submit button if captcha is completed
        let isCaptchaCompleted = false;

        function onCaptchaCompleted() {
            isCaptchaCompleted = true;
            document.getElementById('submitBtn').disabled = false;
        }

        // Form Submission
        document.getElementById('suggestionForm').addEventListener('submit', function(e) {
            e.preventDefault();

            // Ensure captcha is completed
            if (!isCaptchaCompleted) {
                alert("Please complete the CAPTCHA to submit your suggestion.");
                return;
            }

            // Retrieve input values
            var title = document.getElementById('suggestionTitle').value;
            var content = document.getElementById('suggestionContent').value;

            // Show confirmation message
            alert("Your suggestion has been submitted. Thank you!");

            // Optionally reset the form
            document.getElementById('suggestionForm').reset();
            isCaptchaCompleted = false;
            document.getElementById('submitBtn').disabled = true;
        });
    </script>
</body>
</html>

`);
 });

app.get('/support', (req, res) => {
    res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Support Center</title>
    <style>
        :root {
            --primary-color: #1E90FF;
            --bg-dark: #0A0F1D;
            --bg-light: #101826;
            --text-light: #E0E6F1;
            --text-muted: #8892B0;
            --border-color: #1E90FF;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-dark);
            color: var(--text-light);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .container {
            background: var(--bg-light);
            padding: 25px;
            border-radius: 0;
            max-width: 450px;
            width: 100%;
            text-align: left;
            border: 2px solid var(--border-color);
            overflow: hidden;
        }

        h1 {
            font-size: 22px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 18px;
        }

        .contact-options {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 15px;
        }

        .contact-options a {
            background: var(--primary-color);
            color: white;
            text-decoration: none;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            border-radius: 5px;
            transition: 0.3s ease;
        }

        .contact-options a:hover {
            background: #187bcd;
        }

        .faq-container {
            border: 1px solid var(--border-color);
            padding: 12px;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.02);
            margin-top: 10px;
            max-height: 350px;
            overflow-y: auto;
        }

        /* Custom Scrollbar */
        .faq-container::-webkit-scrollbar {
            width: 8px;
        }
        .faq-container::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 5px;
        }
        .faq-container::-webkit-scrollbar-track {
            background: #202A3C;
        }

        .faq-item {
            margin-bottom: 10px;
        }

        .faq-question {
            background: none;
            border: none;
            color: var(--text-light);
            font-size: 14px;
            text-align: left;
            width: 100%;
            cursor: pointer;
            padding: 8px;
            font-weight: bold;
            border-bottom: 1px solid var(--border-color);
        }

        .faq-question:hover {
            color: var(--primary-color);
        }

        .faq-answer {
            display: none;
            font-size: 13px;
            color: var(--text-muted);
            padding: 8px;
            border-left: 3px solid var(--primary-color);
            margin-top: 5px;
        }

        .faq-item.active .faq-answer {
            display: block;
        }

        footer {
            margin-top: 15px;
            font-size: 12px;
            text-align: center;
            color: var(--text-muted);
        }

        footer a {
            color: var(--primary-color);
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>
    <div class="container">
        <h1>Support Center</h1>

        <div class="contact-options">
            <a href="mailto:support@yourwebsite.com">📧 Email Support</a>
            <a href="https://discord.gg/yourserver" target="_blank">💬 Discord Support</a>
            <a href="/tickets">🎫 Submit a Ticket</a>
        </div>

        <div class="faq-container">
            <h2 style="font-size: 18px; text-align: center;">Frequently Asked Questions</h2>

            <div class="faq-item">
                <button class="faq-question">❓ How long does support take?</button>
                <div class="faq-answer">We usually respond within 24 hours, but during high-volume periods, it may take up to 48 hours.</div>
            </div>

            <div class="faq-item">
                <button class="faq-question">🔑 I lost my account access. What should I do?</button>
                <div class="faq-answer">If you've lost access, contact support with your account email and proof of ownership.</div>
            </div>

            <div class="faq-item">
                <button class="faq-question">🚫 Why was my account banned?</button>
                <div class="faq-answer">Your account may have been banned for violating our rules. Please check our <a href="/rules">rules page</a> and contact support if you believe it's a mistake.</div>
            </div>

            <div class="faq-item">
                <button class="faq-question">🔒 How can I secure my account?</button>
                <div class="faq-answer">Enable 2FA, use a strong password, and never share your login details with anyone.</div>
            </div>

            <div class="faq-item">
                <button class="faq-question">🛠️ Can I request a feature?</button>
                <div class="faq-answer">Yes! Feature requests are welcome. Submit your ideas in our <a href="https://discord.gg/yourserver">Discord server</a>.</div>
            </div>

            <div class="faq-item">
                <button class="faq-question">💰 Can I get a refund?</button>
                <div class="faq-answer">Refunds depend on our policy. Please read our <a href="/refund-policy">Refund Policy</a> before requesting.</div>
            </div>

            <div class="faq-item">
                <button class="faq-question">📜 Where can I read the rules?</button>
                <div class="faq-answer">Check out our <a href="/rules">rules page</a> for community guidelines.</div>
            </div>

            <div class="faq-item">
                <button class="faq-question">📢 Where can I get updates?</button>
                <div class="faq-answer">Join our <a href="https://discord.gg/yourserver">Discord server</a> or follow our social media for the latest updates.</div>
            </div>
            
            <div class="faq-item">
    <button class="faq-question">🆔 How do I change my username?</button>
    <div class="faq-answer">You can change your username in your account settings. If you need help, visit <a href="/account-settings">Account Settings</a>.</div>
</div>

<div class="faq-item">
    <button class="faq-question">⚠️ What should I do if I encounter a bug?</button>
    <div class="faq-answer">If you find a bug, report it via our <a href="/bug-report">Bug Report Form</a> or in our <a href="https://discord.gg/yourserver">Discord server</a>.</div>
</div>

<div class="faq-item">
    <button class="faq-question">🔨 Can I become a moderator?</button>
    <div class="faq-answer">Moderator applications open occasionally. Check the <a href="/mod-application">Mod Application Page</a> or join our Discord for announcements.</div>
</div>

<div class="faq-item">
    <button class="faq-question">📧 Why am I not receiving emails from support?</button>
    <div class="faq-answer">Check your spam folder and ensure that support@yourwebsite.com is not blocked. If the issue persists, contact us via Discord.</div>
</div>

<div class="faq-item">
    <button class="faq-question">💳 What payment methods do you accept?</button>
    <div class="faq-answer">We accept PayPal, credit/debit cards, and some cryptocurrencies. See our <a href="/payment-options">Payment Options</a> page for details.</div>
</div>

<div class="faq-item">
    <button class="faq-question">🛑 How do I delete my account?</button>
    <div class="faq-answer">If you wish to delete your account permanently, please submit a request at <a href="/account-deletion">Account Deletion</a>.</div>
</div>

<div class="faq-item">
    <button class="faq-question">🚀 Do you have a VIP or premium membership?</button>
    <div class="faq-answer">Yes! We offer premium plans with exclusive perks. Check out our <a href="/premium">Premium Membership</a> page for details.</div>
</div>

<div class="faq-item">
    <button class="faq-question">🔄 Can I transfer my account to another email?</button>
    <div class="faq-answer">Yes, you can request an email change by verifying ownership. Visit <a href="/account-transfer">Account Transfer</a> for details.</div>
</div>

<div class="faq-item">
    <button class="faq-question">⏳ Why is my order taking so long?</button>
    <div class="faq-answer">Orders usually process within 24 hours. If it's delayed, check <a href="/order-status">Order Status</a> or contact support.</div>
</div>

<div class="faq-item">
    <button class="faq-question">📢 Can I advertise my server/project?</button>
    <div class="faq-answer">We allow advertisements in specific channels. Please check our <a href="/advertising-rules">Advertising Rules</a> before posting.</div>
</div>

<div class="faq-item">
    <button class="faq-question">💰 How do I cancel my subscription?</button>
    <div class="faq-answer">You can cancel your subscription in your account settings. See <a href="/subscription-management">Subscription Management</a> for details.</div>
</div>

<div class="faq-item">
    <button class="faq-question">❌ Someone is harassing me. What should I do?</button>
    <div class="faq-answer">Report harassment to our support team or use the <a href="/report-user">Report User</a> form for immediate action.</div>
</div>

<div class="faq-item">
    <button class="faq-question">⚙️ Can I change my password?</button>
    <div class="faq-answer">Yes! You can reset your password at <a href="/reset-password">Reset Password</a>.</div>
</div>

<div class="faq-item">
    <button class="faq-question">📁 How can I back up my data?</button>
    <div class="faq-answer">You can request a data backup from our support team. Learn more at <a href="/data-backup">Data Backup</a>.</div>
</div>

<div class="faq-item">
    <button class="faq-question">🌍 Do you support multiple languages?</button>
    <div class="faq-answer">Yes! Our platform is available in multiple languages. You can change your language in <a href="/settings">Settings</a>.</div>
</div>

<div class="faq-item">
    <button class="faq-question">🚀 How do I speed up my support ticket response?</button>
    <div class="faq-answer">To get a faster response, provide as many details as possible in your ticket. Screenshots and error logs help a lot!</div>
</div>

<div class="faq-item">
    <button class="faq-question">🔁 Can I have multiple accounts?</button>
    <div class="faq-answer">No, we do not allow multiple accounts per user unless explicitly permitted. Violations may result in bans.</div>
</div>

<div class="faq-item">
    <button class="faq-question">📌 How do I report a scam?</button>
    <div class="faq-answer">If someone is scamming or impersonating us, report it immediately via our <a href="/report-scam">Scam Report Form</a>.</div>
</div>

<div class="faq-item">
    <button class="faq-question">📩 Can I opt out of promotional emails?</button>
    <div class="faq-answer">Yes! You can manage your email preferences in <a href="/email-preferences">Email Preferences</a>.</div>
</div>

<div class="faq-item">
    <button class="faq-question">💾 How do I clear my cache to fix issues?</button>
    <div class="faq-answer">If you're experiencing loading issues, clear your browser cache or reset your app settings.</div>
</div>

<div class="faq-item">
    <button class="faq-question">👤 How do I verify my identity?</button>
    <div class="faq-answer">For security reasons, we may require ID verification. Follow the instructions at <a href="/verify">Verification Page</a>.</div>
</div>

<div class="faq-item">
    <button class="faq-question">📆 Do you have a roadmap for upcoming features?</button>
    <div class="faq-answer">Yes! You can check our development roadmap at <a href="/roadmap">Roadmap</a> to see what's coming next.</div>
</div>

<div class="faq-item">
    <button class="faq-question">🔗 Can I connect my account to other platforms?</button>
    <div class="faq-answer">Yes! You can link your account to platforms like Discord, Steam, and more via <a href="/linked-accounts">Linked Accounts</a>.</div>
</div>

<div class="faq-item">
    <button class="faq-question">🎁 Do you offer giveaways or events?</button>
    <div class="faq-answer">Yes! Join our <a href="https://discord.gg/yourserver">Discord server</a> to participate in exclusive giveaways and community events.</div>
</div>

<div class="faq-item">
    <button class="faq-question">📜 Where can I find legal policies?</button>
    <div class="faq-answer">You can find our Terms of Service, Privacy Policy, and other legal documents at <a href="/legal">Legal</a>.</div>
</div>

<div class="faq-item">
    <button class="faq-question">⏳ How long do refunds take to process?</button>
    <div class="faq-answer">Refunds typically take 3-7 business days, depending on your payment method. Check <a href="/refund-status">Refund Status</a> for more info.</div>
</div>

<div class="faq-item">
    <button class="faq-question">🛠️ Do you offer API access for developers?</button>
    <div class="faq-answer">Yes! Developers can access our API by visiting <a href="/api">API Documentation</a>.</div>
</div>

<div class="faq-item">
    <button class="faq-question">⚡ How can I reduce lag or slow performance?</button>
    <div class="faq-answer">Try closing background apps, clearing your cache, or checking your internet connection. If issues persist, contact support.</div>
</div>

<div class="faq-item">
    <button class="faq-question">🏆 How do I become a verified user?</button>
    <div class="faq-answer">Verified users receive special perks! Apply for verification at <a href="/verified">Verification Page</a>.</div>
</div>


        </div>

        <footer>
            Need more help? <a href="mailto:support@yourwebsite.com">Contact Support</a>.
        </footer>
    </div>

    <script>
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const faqItem = button.parentElement;
                faqItem.classList.toggle('active');
            });
        });
    </script>
</body>
</html>


    `);
});

app.get('/legal', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legal | The Lost Nemo</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        body {
            background-color: #0a0a0a;
            color: white;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .legal-container {
            width: 60%;
            max-width: 800px;
            background: #111;
            border: 1px solid #007bff;
            padding: 20px;
            border-radius: 0;
            box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
        }
        h1, h2 {
            text-align: center;
            color: #007bff;
        }
        p, ul {
            font-size: 16px;
            line-height: 1.5;
        }
        ul {
            padding-left: 20px;
        }
        .legal-section {
            margin-bottom: 20px;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .scrollable-box {
            max-height: 400px;
            overflow-y: auto;
            padding: 10px;
            border: 1px solid #007bff;
            border-radius: 0;
            scrollbar-width: thin;
            scrollbar-color: #007bff #111;
        }
        .scrollable-box::-webkit-scrollbar {
            width: 8px;
        }
        .scrollable-box::-webkit-scrollbar-thumb {
            background: #007bff;
            border-radius: 10px;
        }
        .scrollable-box::-webkit-scrollbar-track {
            background: #111;
        }
    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>
    <div class="legal-container">
        <h1>Legal Information</h1>
        <div class="scrollable-box">
            <div class="legal-section">
                <h2>Terms of Service</h2>
                <p>By using The Lost Nemo, you agree to the following:</p>
                <ul>
                    <li>You will not misuse the service.</li>
    <li>You must comply with all applicable laws.</li>
    <li>We reserve the right to terminate accounts for violations.</li>
    <li>You must not attempt to hack, exploit, or reverse-engineer the platform.</li>
    <li>Any unauthorized bot usage may result in a permanent ban.</li>
    <li>You agree not to impersonate moderators, admins, or any other staff.</li>
    <li>Spamming, flooding, or excessive messaging is strictly prohibited.</li>
    <li>Phishing, scamming, or fraudulent activities will result in account termination.</li>
    <li>All users must be at least 13 years old to use the service.</li>
    <li>Harassment, hate speech, or discrimination of any kind is not allowed.</li>
    <li>Any attempt to bypass security measures will lead to legal action.</li>
    <li>You must not distribute malicious software, viruses, or harmful scripts.</li>
    <li>Attempting to manipulate or game the system for unfair advantages is forbidden.</li>
    <li>Advertising without explicit permission is not allowed.</li>
    <li>Do not share personal information of yourself or others.</li>
    <li>We are not responsible for any damages, losses, or liabilities from service usage.</li>
    <li>You acknowledge that this service is provided "as is" without any guarantees.</li>
    <li>We may update these terms at any time without prior notice.</li>
    <li>Using multiple accounts to evade bans or restrictions is not permitted.</li>
    <li>Exploiting glitches or bugs for personal gain is strictly forbidden.</li>
    <li>You must respect all moderators, admins, and community members.</li>
    <li>False reports or abuse of the reporting system will result in penalties.</li>
    <li>Any real-life threats or doxxing will lead to an instant ban and legal action.</li>
    <li>You agree not to use the platform for illegal activities.</li>
    <li>All virtual currency, items, or rewards hold no real-world monetary value.</li>
    <li>You may not redistribute, resell, or copy any part of this service.</li>
    <li>Third-party integrations must follow our security guidelines.</li>
    <li>Attempting to overload our servers with excessive requests is prohibited.</li>
    <li>All disputes must be handled through our official support channels.</li>
    <li>By using this service, you agree to our data collection policies.</li>
    <li>Accounts inactive for extended periods may be deleted.</li>
    <li>We are not liable for downtime, service interruptions, or lost data.</li>
    <li>Paid services or premium memberships are non-refundable.</li>
    <li>You may not use VPNs or proxies to bypass restrictions.</li>
    <li>Do not attempt to resell or trade in-game items outside the service.</li>
    <li>Any attempt to bribe staff or users for personal gain is prohibited.</li>
    <li>All user-generated content must follow community guidelines.</li>
    <li>Moderators have the final say on all rule enforcement decisions.</li>
    <li>All purchases must be authorized by the cardholder or account owner.</li>
    <li>Threats of self-harm or suicide should be reported immediately.</li>
    <li>Posting NSFW (Not Safe For Work) content is strictly prohibited.</li>
    <li>All usernames and profile pictures must be appropriate.</li>
    <li>All players must follow fair play policies at all times.</li>
    <li>Using exploits to bypass in-game mechanics is not allowed.</li>
    <li>Streaming or recording content must comply with platform rules.</li>
    <li>Server administrators have the right to enforce additional rules.</li>
    <li>Using automation tools for farming or grinding is not allowed.</li>
    <li>Attempts to access restricted areas of the site will result in a ban.</li>
    <li>Sharing cheat software, hacks, or exploits is strictly forbidden.</li>
    <li>Account sharing or selling is not allowed.</li>
    <li>You agree that any legal disputes will be handled under our jurisdiction.</li>
    <li>Violation of terms may result in temporary or permanent bans.</li>
    <li>Users must not attempt to intimidate or threaten others.</li>
    <li>Mass messaging, invites, or friend requests to unknown users is not allowed.</li>
    <li>Streaming copyrighted material without permission is forbidden.</li>
    <li>All transactions made within the service are final.</li>
    <li>Admins reserve the right to revoke privileges at any time.</li>
    <li>Spreading misinformation or fake news is strictly prohibited.</li>
    <li>Refund requests will only be considered under specific conditions.</li>
    <li>Any attempt to evade bans using new accounts will result in a permanent IP ban.</li>
    <li>Users must not encourage others to break the rules.</li>
    <li>Public shaming or exposing private conversations is not allowed.</li>
    <li>Users may not use offensive or controversial usernames.</li>
    <li>Threatening legal action without basis will result in removal.</li>
    <li>Users may not trade real-world money for in-game items.</li>
    <li>Spamming emojis, stickers, or gifs excessively is not permitted.</li>
    <li>Users should report violations rather than taking matters into their own hands.</li>
    <li>We reserve the right to remove any content that violates our terms.</li>
    <li>Abusing loopholes in rules or guidelines is still considered a violation.</li>
    <li>Users who falsely claim to be staff or moderators will be banned.</li>
    <li>All forms of gambling using the service are not permitted.</li>
    <li>Users must respect age restrictions on content.</li>
    <li>Do not use the service to promote illegal or unethical behavior.</li>
    <li>All forms of harassment, whether public or private, will not be tolerated.</li>
    <li>Attempting to create unrest or incite arguments is prohibited.</li>
    <li>Using misleading links or bait-and-switch tactics is not allowed.</li>
    <li>All submitted content must adhere to copyright laws.</li>
    <li>Inappropriate profile bios or status messages will be removed.</li>
    <li>Any external links posted must be safe and relevant.</li>
    <li>Deliberately misusing features or commands is not allowed.</li>
    <li>All discussions must remain civil and respectful.</li>
    <li>Users must ensure they follow any additional Discord guidelines.</li>
    <li>Attempting to artificially inflate user statistics is forbidden.</li>
    <li>Mass-reporting users for false claims is against the rules.</li>
    <li>Users may not use alts to bypass chat restrictions.</li>
    <li>Attempting to manipulate staff decisions is not allowed.</li>
    <li>Users found guilty of account theft or scams will be permanently banned.</li>
    <li>Users must accept that changes to rules or features can happen anytime.</li>
    <li>Violation of rules in private chats will also be taken seriously.</li>
    <li>Server logs and moderation actions are confidential.</li>
    <li>Users must respect event rules and participate fairly.</li>
    <li>Any actions that disrupt the community will be punished.</li>
    <li>Attempting to exploit giveaways, contests, or rewards is not allowed.</li>
    <li>Users are responsible for their own security and account safety.</li>
    <li>We reserve the right to take legal action against serious offenses.</li>
                </ul>
                <p>Read the full Terms of Service <a href="#">here</a>.</p>
            </div>

            <div class="legal-section">
                <h2>Privacy Policy</h2>
                <p>We take your privacy seriously. Our policy covers:</p>
                <ul>
                    <li>What data we collect and why.</li>
    <li>How we store and secure your information.</li>
    <li>Your rights and how to manage your data.</li>
    <li>We collect only necessary data required for service functionality.</li>
    <li>Your data is encrypted and securely stored.</li>
    <li>We do not sell your personal data to third parties.</li>
    <li>All user data is protected against unauthorized access.</li>
    <li>We may collect usage data for analytics and service improvement.</li>
    <li>Cookies are used to enhance user experience.</li>
    <li>You have the right to request data deletion.</li>
    <li>We comply with GDPR, CCPA, and other privacy laws.</li>
    <li>We log IP addresses for security purposes.</li>
    <li>Two-factor authentication (2FA) is recommended for account security.</li>
    <li>We do not store your passwords in plain text.</li>
    <li>We only collect personal data you voluntarily provide.</li>
    <li>Data backups are performed regularly for security.</li>
    <li>We do not track users outside of our platform.</li>
    <li>You can opt out of certain data collection practices.</li>
    <li>We use secure protocols (HTTPS, TLS) for data transmission.</li>
    <li>Personal data is deleted after extended inactivity.</li>
    <li>We anonymize data where possible to enhance privacy.</li>
    <li>Your data is not shared with advertisers without consent.</li>
    <li>We store login timestamps for account security tracking.</li>
    <li>You may request a copy of the data we have on you.</li>
    <li>We implement access controls to protect sensitive data.</li>
    <li>Data processing is limited to legitimate business operations.</li>
    <li>We do not use facial recognition or biometric tracking.</li>
    <li>We retain transaction records for financial security.</li>
    <li>Your preferences and settings are stored securely.</li>
    <li>Location data is collected only when explicitly enabled.</li>
    <li>We do not share personal messages or private conversations.</li>
    <li>We may use AI-powered analytics but not for profiling.</li>
    <li>All stored data is periodically reviewed for relevance.</li>
    <li>We use CAPTCHA systems to prevent automated abuse.</li>
    <li>Your contact details are used only for essential communication.</li>
    <li>We do not knowingly collect data from children under 13.</li>
    <li>We respect “Do Not Track” browser settings where applicable.</li>
    <li>Only authorized personnel have access to user data.</li>
    <li>All third-party integrations comply with our privacy policies.</li>
    <li>Third-party service providers must follow strict data policies.</li>
    <li>Users have control over what data they share.</li>
    <li>Data is never used for discriminatory purposes.</li>
    <li>We do not collect banking details unless required for transactions.</li>
    <li>Your data is never used for political or ideological targeting.</li>
    <li>Stored emails are used solely for verification and notifications.</li>
    <li>We provide clear options for unsubscribing from communications.</li>
    <li>Only minimal personally identifiable information (PII) is stored.</li>
    <li>We do not use dark patterns to force consent.</li>
    <li>Personal data is stored for only as long as necessary.</li>
    <li>All payment processing is handled by secure third-party providers.</li>
    <li>Personal data is not shared with law enforcement without legal obligation.</li>
    <li>Users are informed of major privacy policy changes.</li>
    <li>We do not store raw biometric data.</li>
    <li>We review data security measures regularly.</li>
    <li>Users may opt out of non-essential data collection.</li>
    <li>Data is collected transparently, with clear explanations.</li>
    <li>We do not engage in excessive data collection practices.</li>
    <li>Users may update their data preferences at any time.</li>
    <li>We take immediate action in case of data breaches.</li>
    <li>Users can report privacy concerns through official channels.</li>
    <li>All data access is logged and monitored.</li>
    <li>We maintain a dedicated security team for data protection.</li>
    <li>Multi-layered encryption protects all stored data.</li>
    <li>We do not use AI or machine learning to predict personal behavior.</li>
    <li>We follow industry best practices for cybersecurity.</li>
    <li>We implement rate limiting to prevent data scraping.</li>
    <li>We comply with global privacy frameworks and best practices.</li>
    <li>We allow users to delete their accounts permanently.</li>
    <li>Data is stored on secure servers in privacy-compliant regions.</li>
    <li>We require strong passwords to enhance security.</li>
    <li>User-generated content is moderated for compliance.</li>
    <li>Data collection policies are clearly stated in user settings.</li>
    <li>Users are notified of any changes in data handling.</li>
    <li>We have internal audits to ensure compliance.</li>
    <li>We support anonymous usage where feasible.</li>
    <li>We limit employee access to user data.</li>
    <li>Privacy settings are accessible and easy to understand.</li>
    <li>We do not engage in data resale or brokerage.</li>
    <li>Session data is cleared after logout.</li>
    <li>We do not collect unnecessary metadata from messages.</li>
    <li>Users may adjust tracking settings within their profiles.</li>
    <li>We provide transparency reports regarding data requests.</li>
    <li>Users can deactivate tracking for targeted advertising.</li>
    <li>Data portability requests are processed promptly.</li>
    <li>All analytics are anonymized where possible.</li>
    <li>We allow users to disable location tracking.</li>
    <li>We minimize data collection on sign-up.</li>
    <li>We do not require excessive permissions for mobile users.</li>
    <li>Our logs are purged regularly for security.</li>
    <li>We do not collect device fingerprints without consent.</li>
    <li>Users are informed when their data is shared with partners.</li>
    <li>All stored files undergo security checks.</li>
    <li>Our privacy policies are regularly reviewed and updated.</li>
                </ul>
                <p>Read the full Privacy Policy <a href="#">here</a>.</p>
            </div>

            <div class="legal-section">
                <h2>Data Handling & Compliance</h2>
                <p>We adhere to international data protection laws such as GDPR and CCPA. Your data will:</p>
                <ul>
                    <li>We collect only the data necessary for service functionality.</li>
    <li>All user data is securely stored with encryption.</li>
    <li>We never sell user data to third parties.</li>
    <li>Data is processed only for legitimate business purposes.</li>
    <li>We comply with GDPR, CCPA, and other privacy regulations.</li>
    <li>All stored data undergoes regular security audits.</li>
    <li>User passwords are hashed and never stored in plain text.</li>
    <li>We use secure cloud storage with end-to-end encryption.</li>
    <li>Data is regularly backed up to prevent loss.</li>
    <li>Access to sensitive data is strictly limited to authorized personnel.</li>
    <li>All stored data is automatically deleted after a defined retention period.</li>
    <li>We allow users to request a copy of their stored data.</li>
    <li>Users may opt out of non-essential data collection.</li>
    <li>We anonymize collected data whenever possible.</li>
    <li>IP addresses are stored temporarily for security reasons.</li>
    <li>We do not engage in excessive data logging.</li>
    <li>Users can delete their accounts and associated data permanently.</li>
    <li>Session data is automatically cleared upon logout.</li>
    <li>We provide clear explanations on how user data is processed.</li>
    <li>Third-party service providers must comply with our data policies.</li>
    <li>Data encryption is enforced for all transmissions.</li>
    <li>We limit data collection to necessary operational purposes.</li>
    <li>We do not store sensitive personal information unless required.</li>
    <li>All personal data is stored in secure, privacy-compliant regions.</li>
    <li>We do not track users across third-party websites.</li>
    <li>Data collected for analytics is aggregated and anonymized.</li>
    <li>We comply with data deletion requests within a reasonable timeframe.</li>
    <li>We have a strict access control policy for stored data.</li>
    <li>User preferences and settings are stored securely.</li>
    <li>Data retention policies are periodically reviewed and updated.</li>
    <li>We implement real-time monitoring to prevent unauthorized access.</li>
    <li>Multi-factor authentication is required for administrative access.</li>
    <li>We provide users with transparency reports on data requests.</li>
    <li>Data is not stored on insecure or unencrypted devices.</li>
    <li>We do not retain search history beyond operational necessity.</li>
    <li>Users are informed of significant changes to data handling policies.</li>
    <li>Data portability requests are processed within legal guidelines.</li>
    <li>We do not use automated decision-making that impacts user rights.</li>
    <li>Data access logs are reviewed periodically to ensure compliance.</li>
    <li>Only verified employees have access to sensitive data.</li>
    <li>All stored emails are encrypted and used only for verification purposes.</li>
    <li>We do not store user messages unless explicitly permitted.</li>
    <li>We use CAPTCHA verification to prevent automated abuse.</li>
    <li>User-generated content is moderated to ensure compliance.</li>
    <li>We do not collect biometric or facial recognition data.</li>
    <li>We maintain offline backups for critical data recovery.</li>
    <li>We do not process personal data for targeted political advertising.</li>
    <li>Our data centers implement physical and digital security measures.</li>
    <li>All third-party integrations are vetted for compliance.</li>
    <li>We do not engage in excessive metadata collection.</li>
    <li>Data deletion is irreversible and processed within 30 days.</li>
    <li>We notify users in case of a significant data breach.</li>
    <li>Stored files undergo security checks before processing.</li>
    <li>Users may request an audit of the data we store on them.</li>
    <li>We allow users to disable tracking cookies.</li>
    <li>We do not require unnecessary personal information for registration.</li>
    <li>Stored logs are periodically purged to enhance privacy.</li>
    <li>All third-party partners are contractually bound to follow our policies.</li>
    <li>Location data is only collected when explicitly enabled by users.</li>
    <li>We do not store device fingerprints for tracking purposes.</li>
    <li>We maintain transparency regarding how data is used.</li>
    <li>Stored transaction records are protected by financial security standards.</li>
    <li>We do not profile users based on sensitive data.</li>
    <li>Users can request explanations for automated decisions affecting them.</li>
    <li>We ensure that stored backups do not contain unnecessary user data.</li>
    <li>We do not collect voice recordings or other audio data.</li>
    <li>Session tokens expire after a predefined period for security.</li>
    <li>Data is only shared with authorities under a valid legal request.</li>
    <li>We provide clear documentation on how data handling works.</li>
    <li>Stored user preferences are encrypted for privacy.</li>
    <li>Data loss prevention measures are in place to protect user information.</li>
    <li>We continuously update security measures to prevent breaches.</li>
    <li>Users may contact us to correct inaccurate personal data.</li>
    <li>Stored data undergoes periodic integrity checks.</li>
    <li>We follow international best practices for cybersecurity.</li>
    <li>We provide an easily accessible data management dashboard.</li>
    <li>Data stored on our servers is protected by strict access controls.</li>
    <li>We do not use machine learning to predict private user behavior.</li>
    <li>We regularly review data handling policies to ensure compliance.</li>
    <li>Stored logs contain only essential diagnostic information.</li>
    <li>Data is automatically purged from inactive accounts.</li>
    <li>We conduct internal audits to detect potential vulnerabilities.</li>
    <li>Data is not used to manipulate user choices.</li>
    <li>We clearly explain all data handling practices.</li>
    <li>We prevent unauthorized data scraping through security measures.</li>
    <li>Users can adjust privacy settings at any time.</li>
    <li>Stored chat logs are encrypted and only accessible by the user.</li>
    <li>We do not store unnecessary personal identifiers.</li>
    <li>We protect against unauthorized API access to user data.</li>
    <li>We use AI responsibly without excessive data mining.</li>
    <li>Data access logs are reviewed for suspicious activity.</li>
    <li>Stored passwords are hashed using industry-standard algorithms.</li>
    <li>We provide users with control over their data retention policies.</li>
    <li>We do not process personal data for purposes unrelated to our services.</li>
    <li>We allow users to restrict the visibility of their personal data.</li>
    <li>We provide clear disclosures on all data collection methods.</li>
    <li>We do not use data to create psychological profiles of users.</li>
    <li>All data policies align with international human rights standards.</li>
    <li>We take immediate action against security vulnerabilities.</li>
    <li>Stored multimedia files undergo scanning for security threats.</li>
    <li>We provide privacy training for employees handling user data.</li>
    <li>Stored sensitive data is accessible only through secure authentication.</li>
                </ul>
                <p>Learn more about data handling <a href="#">here</a>.</p>
            </div>
        </div>
    </div>
</body>
</html>
`);
});

app.get('/eula', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>End User License Agreement (EULA)</title>
    <link rel="stylesheet" href="styles.css"> <!-- Link to your existing styles -->
    <style>
        body {
            background-color: #121212;
            color: #ffffff;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .eula-container {
            width: 60%;
            max-width: 800px;
            height: 70vh;
            border: 2px solid #007BFF;
            background-color: #1a1a1a;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #007BFF #1a1a1a;
        }
        .eula-container h1 {
            text-align: center;
            color: #007BFF;
            margin-bottom: 15px;
        }
        .eula-container h2 {
            color: #ffffff;
            margin-top: 20px;
        }
        .eula-container ul {
            padding-left: 20px;
        }
        .eula-container ul li {
            margin-bottom: 10px;
        }
        .eula-container .accept-btn {
            display: block;
            width: 100%;
            padding: 10px;
            background-color: #007BFF;
            border: none;
            color: white;
            text-align: center;
            font-size: 16px;
            cursor: pointer;
            margin-top: 15px;
            transition: 0.3s;
        }
        .eula-container .accept-btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="eula-container">
        <h1>End User License Agreement (EULA)</h1>

        <h2>1. Acceptance of Terms</h2>
<ul>
    <li>By using this software, you agree to comply with all terms outlined in this EULA.</li>
    <li>If you do not agree to these terms, you must immediately discontinue use.</li>
    <li>Continued use of this software signifies ongoing acceptance of the latest version of this EULA.</li>
    <li>These terms apply to all users, including individuals, businesses, and organizations.</li>
    <li>You must be of legal age to enter into this agreement.</li>
    <li>If you are using this software on behalf of a company, you confirm that you have the authority to bind the company to this EULA.</li>
    <li>We reserve the right to update this agreement at any time.</li>
    <li>It is your responsibility to review this agreement periodically.</li>
    <li>Failure to read or review this agreement does not exempt you from compliance.</li>
    <li>This agreement is legally binding and enforceable.</li>
    <li>Usage of this software constitutes full and voluntary acceptance of all terms.</li>
    <li>Modifications or amendments to this agreement will be posted publicly.</li>
    <li>You agree to check for updates to this EULA before continued use.</li>
    <li>Any continued use after modifications constitute acceptance of the updated terms.</li>
    <li>If you do not agree with the updates, you must stop using the software immediately.</li>
    <li>We are not responsible for informing users individually of changes.</li>
    <li>You acknowledge that failure to comply with this agreement may result in termination of your license.</li>
    <li>You may not use this software for any purpose prohibited by law.</li>
    <li>You accept that this software may be subject to restrictions based on local or international regulations.</li>
    <li>You acknowledge that this EULA supersedes any prior agreements or understandings regarding the software.</li>
    <li>All users must comply with the software's acceptable use policies.</li>
    <li>This agreement applies regardless of the platform on which the software is used.</li>
    <li>Use of any modified, pirated, or unlicensed versions of this software is strictly prohibited.</li>
    <li>Any violation of these terms may result in immediate revocation of your access.</li>
    <li>This software is provided under a license and is not sold to you.</li>
    <li>We reserve the right to restrict access to this software for any reason.</li>
    <li>If you are accessing this software from outside its intended region, you are responsible for ensuring compliance with local laws.</li>
    <li>Attempts to bypass security measures, restrictions, or terms of use are strictly forbidden.</li>
    <li>Your use of this software must comply with ethical and legal standards.</li>
    <li>You acknowledge that your use of this software does not entitle you to any ownership rights.</li>
    <li>Any breach of these terms may result in legal action.</li>
    <li>We do not guarantee the availability of the software at all times.</li>
    <li>We may suspend or discontinue the software at any time without notice.</li>
    <li>We are not responsible for any data loss or service interruptions.</li>
    <li>You agree to indemnify us against any claims resulting from misuse.</li>
    <li>This agreement remains in effect until terminated by you or us.</li>
    <li>You may not transfer or assign your rights under this agreement.</li>
    <li>This agreement applies to all versions and updates of the software.</li>
    <li>Some features of the software may require additional terms of use.</li>
    <li>By using this software, you consent to data collection as described in the privacy policy.</li>
    <li>We may collect anonymous usage data to improve services.</li>
    <li>Any attempts to manipulate or exploit this software for unfair advantages are prohibited.</li>
    <li>You agree not to misrepresent your identity while using this software.</li>
    <li>Attempts to interfere with other users' access or experience are prohibited.</li>
    <li>Automated use of this software, such as bots, is only allowed with explicit permission.</li>
    <li>We may introduce new terms at any time, which will apply upon publication.</li>
    <li>It is your responsibility to ensure your software version is up to date.</li>
    <li>You may not use this software for unlawful activities, including hacking or fraud.</li>
    <li>By accepting this agreement, you waive any claims against us for software-related issues.</li>
    <li>Some features may require an internet connection to function properly.</li>
    <li>We reserve the right to limit or modify functionality at our discretion.</li>
    <li>You must not attempt to remove, modify, or obscure copyright notices.</li>
    <li>If any provision of this agreement is deemed unenforceable, the rest remains valid.</li>
    <li>We may transfer our rights under this agreement to another entity.</li>
    <li>You acknowledge that our failure to enforce any term does not waive our rights.</li>
    <li>We do not guarantee that this software is free of bugs or security vulnerabilities.</li>
    <li>Use of the software is at your own risk.</li>
    <li>We are not responsible for third-party software dependencies.</li>
    <li>Some features may require you to create an account.</li>
    <li>You are responsible for maintaining the security of your account.</li>
    <li>Unauthorized access to another user's account is prohibited.</li>
    <li>We reserve the right to modify user permissions at any time.</li>
    <li>You must report any security vulnerabilities you discover.</li>
    <li>You acknowledge that service disruptions may occur for maintenance or upgrades.</li>
    <li>Users must not share access credentials with unauthorized parties.</li>
    <li>We do not provide refunds unless required by law.</li>
    <li>Data collected through this software is subject to our Privacy Policy.</li>
    <li>We are not responsible for damages resulting from third-party integrations.</li>
    <li>Any violation of these terms may lead to temporary or permanent bans.</li>
    <li>We may contact you regarding updates or policy changes.</li>
    <li>Users must not impersonate company representatives.</li>
    <li>Attempts to exploit or manipulate the software’s mechanics are prohibited.</li>
    <li>Any legal disputes related to this software will be resolved under applicable jurisdiction.</li>
    <li>We are not liable for losses resulting from unauthorized access to your account.</li>
    <li>Users must provide accurate information when registering accounts.</li>
    <li>Use of this software in a manner that harms others is strictly prohibited.</li>
    <li>Data retention policies may vary by jurisdiction.</li>
    <li>We may monitor usage for security and improvement purposes.</li>
    <li>You agree to cooperate with investigations into suspected violations.</li>
    <li>This agreement applies to all content accessed through the software.</li>
    <li>We reserve the right to suspend access during investigations of abuse.</li>
    <li>Any attempt to circumvent security measures may result in legal consequences.</li>
    <li>We do not guarantee compatibility with all devices.</li>
    <li>This software is provided "as is" without any warranties.</li>
    <li>Users must comply with all applicable data protection laws.</li>
    <li>Users may not attempt to decompile or reverse-engineer the software.</li>
    <li>Unauthorized reproduction of software elements is strictly prohibited.</li>
    <li>We may impose additional terms for certain premium features.</li>
    <li>By agreeing to this EULA, you waive any claims against us for unforeseen damages.</li>
    <li>You acknowledge that some features may require separate purchases.</li>
    <li>Users must not spread false information about this software or its developers.</li>
    <li>Attempts to resell or distribute this software without permission are prohibited.</li>
    <li>We may introduce age restrictions for certain features.</li>
    <li>Failure to comply with this agreement may result in civil or criminal penalties.</li>
</ul>

        <h2>2. License Grant</h2>
<ul>
    <li>This software is licensed, not sold, to you.</li>
    <li>You are granted a limited, non-exclusive, non-transferable license to use this software.</li>
    <li>You may only use this software for its intended purpose as outlined in this agreement.</li>
    <li>Any modification, reverse engineering, decompiling, or disassembly is strictly prohibited.</li>
    <li>You may not sublicense, rent, lease, or distribute this software without prior authorization.</li>
    <li>This license does not grant you ownership of any intellectual property associated with the software.</li>
    <li>Any unauthorized attempts to alter, modify, or hack the software will void this license.</li>
    <li>We reserve the right to revoke this license at any time if you violate any terms.</li>
    <li>This software may not be used for illegal activities or to harm others.</li>
    <li>Any attempt to bypass or circumvent software restrictions is prohibited.</li>
    <li>Resale of this software, whether modified or unmodified, is not allowed.</li>
    <li>This software must not be used in any way that infringes on third-party rights.</li>
    <li>Use of this software in a business or enterprise setting may require additional licensing.</li>
    <li>Accessing features not explicitly made available to you is prohibited.</li>
    <li>You may not use this software to develop or distribute competing software.</li>
    <li>Using this software in an automated manner without permission is not allowed.</li>
    <li>You may not integrate this software with unauthorized third-party applications.</li>
    <li>Any derivative works or modifications made without consent remain unauthorized.</li>
    <li>You are responsible for compliance with all applicable local and international laws.</li>
    <li>This license applies only to the version of the software you have legally obtained.</li>
    <li>Use of older or unsupported versions of this software may be restricted.</li>
    <li>You may not alter or remove any trademarks, copyright notices, or branding.</li>
    <li>This software may contain digital rights management (DRM) measures to enforce licensing.</li>
    <li>Sharing your licensed copy with unlicensed users is not allowed.</li>
    <li>You may not distribute modified or cracked versions of this software.</li>
    <li>This license is valid only for personal or organizational use as permitted.</li>
    <li>Any attempts to exploit software vulnerabilities to gain unauthorized access are forbidden.</li>
    <li>We retain all ownership rights, and only a usage license is granted to you.</li>
    <li>Commercial use of this software requires explicit permission.</li>
    <li>If this software is part of a subscription service, your license is tied to an active subscription.</li>
    <li>Violation of any license terms may result in immediate termination of access.</li>
    <li>We reserve the right to introduce new licensing conditions in future versions.</li>
    <li>You may not use this software in military, surveillance, or cyber warfare activities.</li>
    <li>Use of this software in a government or regulatory capacity may require special licensing.</li>
    <li>This software may not be used for fraudulent, misleading, or deceptive purposes.</li>
    <li>Altering, bypassing, or removing licensing mechanisms is strictly prohibited.</li>
    <li>If the software requires activation, using unauthorized activation methods is forbidden.</li>
    <li>Licenses may not be transferred or resold under any circumstances.</li>
    <li>Use of the software on unauthorized devices may result in license termination.</li>
    <li>Multiple installations under a single-user license may be restricted.</li>
    <li>Any software components marked as “trial” or “evaluation” are for temporary use only.</li>
    <li>You may not use this software to create, distribute, or execute harmful programs (malware, spyware, etc.).</li>
    <li>This license does not grant you any rights to source code or internal software logic.</li>
    <li>All copies of the software must retain original licensing and copyright notices.</li>
    <li>This software may be subject to regional restrictions based on licensing agreements.</li>
    <li>Any software updates provided must be used according to the original license terms.</li>
    <li>We may revoke or restrict access if unauthorized use is detected.</li>
    <li>Reproduction of software elements for personal or commercial gain is not allowed.</li>
    <li>If bundled with third-party services, their terms of use must also be followed.</li>
    <li>License fees or renewals may be required for continued access to certain features.</li>
    <li>Distributing license keys, activation codes, or access credentials is prohibited.</li>
    <li>License duration may vary based on purchase type (perpetual, subscription, etc.).</li>
    <li>We may modify licensing conditions as required by law or internal policy.</li>
    <li>Use of the software in high-risk environments (medical, nuclear, aviation) is not advised.</li>
    <li>This software may collect non-personal telemetry data to improve functionality.</li>
    <li>Any unauthorized reproduction, duplication, or sharing of the software is illegal.</li>
    <li>Educational institutions must obtain a separate academic license if required.</li>
    <li>Transmitting this software over networks in violation of export laws is prohibited.</li>
    <li>Any software bundled as part of a suite remains subject to its respective license.</li>
    <li>Compliance with open-source licenses (if applicable) must be maintained.</li>
    <li>We reserve the right to take legal action against unauthorized distribution.</li>
    <li>Any alterations to the software that impact its integrity are not permitted.</li>
    <li>You may not attempt to claim ownership of this software or its components.</li>
    <li>Some software features may require an internet connection for validation.</li>
    <li>This license does not include rights to distribute, resell, or rent the software.</li>
    <li>If you violate this agreement, you may be permanently restricted from future access.</li>
    <li>Use of cracked, pirated, or unofficially modified versions is strictly prohibited.</li>
    <li>Installation of this software on an unauthorized device may result in license revocation.</li>
    <li>Any legal disputes regarding this license will be handled in an applicable jurisdiction.</li>
    <li>We may issue patches or updates that alter licensing conditions.</li>
    <li>Failing to comply with security updates may void your license.</li>
    <li>Software provided as a beta version is subject to additional terms and limitations.</li>
    <li>Modifying software files in any way to bypass licensing enforcement is illegal.</li>
    <li>Using this software for research or reverse engineering without authorization is not allowed.</li>
    <li>Attempts to claim warranties or rights not explicitly granted in this agreement are invalid.</li>
    <li>Software licenses may be reviewed and audited for compliance purposes.</li>
    <li>Subscription-based licenses may automatically renew unless canceled.</li>
    <li>Failure to meet payment obligations for subscription licenses may result in termination.</li>
    <li>Use of the software for unethical or exploitative purposes is prohibited.</li>
    <li>Software features may be restricted based on the user’s region or legal requirements.</li>
    <li>Unauthorized third-party modifications may introduce security risks and are not supported.</li>
    <li>This license does not grant any patent rights related to the software.</li>
    <li>We reserve the right to discontinue any feature or service related to this software.</li>
    <li>You are solely responsible for ensuring that your device meets software requirements.</li>
    <li>License restrictions apply regardless of how the software was acquired.</li>
    <li>Attempts to manipulate or cheat software licensing verification mechanisms are prohibited.</li>
    <li>This license remains in effect until terminated by you or us.</li>
    <li>If this agreement is terminated, you must immediately discontinue use of the software.</li>
    <li>Upon termination, you must delete all copies of the software in your possession.</li>
</ul>

        <h2>3. Restrictions</h2>
<ul>
    <li>You may not use this software for illegal, unethical, or prohibited activities.</li>
    <li>Commercial use is only allowed with explicit permission from the software owner.</li>
    <li>Sharing, sublicensing, or reselling your license is strictly forbidden.</li>
    <li>Unauthorized modifications, alterations, or reverse engineering are not permitted.</li>
    <li>Copying, distributing, or reproducing this software without consent is prohibited.</li>
    <li>Any attempt to bypass security mechanisms, DRM, or license checks is strictly forbidden.</li>
    <li>You may not use this software to engage in fraud, hacking, or malicious activities.</li>
    <li>Extracting source code, decrypting compiled code, or tampering with files is not allowed.</li>
    <li>You may not use automated bots, scripts, or exploits to manipulate software behavior.</li>
    <li>Use of this software to transmit malware, spyware, or other harmful code is prohibited.</li>
    <li>Any unauthorized integration of this software into third-party systems is forbidden.</li>
    <li>Decompiling, disassembling, or attempting to reconstruct the software logic is not allowed.</li>
    <li>Using this software for activities that violate intellectual property laws is prohibited.</li>
    <li>You may not use this software to gain unauthorized access to networks or data.</li>
    <li>License keys, serial numbers, or activation codes may not be shared or distributed.</li>
    <li>Modifications that alter how the software functions without permission are not allowed.</li>
    <li>You may not misrepresent this software or falsely claim ownership.</li>
    <li>Attempting to remove, alter, or hide copyright and trademark information is prohibited.</li>
    <li>Using this software for surveillance, spying, or privacy invasion is strictly forbidden.</li>
    <li>Creating derivative works or adaptations without approval is not allowed.</li>
    <li>You may not use this software to disrupt, damage, or interfere with other systems.</li>
    <li>Using this software for gambling, betting, or illegal financial transactions is prohibited.</li>
    <li>Modification of license agreements or software terms without consent is not allowed.</li>
    <li>Unauthorized resale of software features or bundled services is strictly forbidden.</li>
    <li>Using this software in a way that violates applicable laws or regulations is not permitted.</li>
    <li>You may not use this software to impersonate another individual or entity.</li>
    <li>Altering software settings to exceed permitted usage limits is strictly forbidden.</li>
    <li>Use of the software for terrorist activities, cyber warfare, or criminal purposes is banned.</li>
    <li>You may not use this software to exploit security vulnerabilities in any system.</li>
    <li>Use of unauthorized plug-ins, modifications, or third-party patches is prohibited.</li>
    <li>Attempting to avoid software update requirements or version restrictions is not allowed.</li>
    <li>Any attempt to manipulate online services provided by this software is forbidden.</li>
    <li>Using this software to send spam, phishing messages, or unsolicited communications is banned.</li>
    <li>Reversing software updates to revert to older versions is not permitted.</li>
    <li>Exporting this software to restricted countries or regions without authorization is prohibited.</li>
    <li>Using this software to develop competing products without permission is not allowed.</li>
    <li>License holders may not sublicense the software to unauthorized parties.</li>
    <li>Attempting to rebrand, repackage, or redistribute this software is forbidden.</li>
    <li>Exceeding the permitted number of installations under a single-user license is not allowed.</li>
    <li>Using this software to bypass geographic or network restrictions is prohibited.</li>
    <li>You may not use this software in ways that violate ethical guidelines or industry standards.</li>
    <li>Manipulating licensing mechanisms to extend free trial periods is forbidden.</li>
    <li>Using this software in high-risk environments without approval is restricted.</li>
    <li>Publishing unauthorized guides, tutorials, or instructions on bypassing software restrictions is not allowed.</li>
    <li>Reselling bundled content or assets included with the software is prohibited.</li>
    <li>Using this software to access, modify, or steal personal data is strictly forbidden.</li>
    <li>Unauthorized network monitoring, packet sniffing, or interception of data is not allowed.</li>
    <li>Use of cracked, pirated, or illegally obtained versions of the software is banned.</li>
    <li>Users must not exceed usage limitations outlined in the license agreement.</li>
    <li>Any unauthorized automation of software functions is prohibited.</li>
    <li>Attempting to disable, block, or circumvent software security alerts is forbidden.</li>
    <li>Use of this software for spreading misinformation, propaganda, or harmful content is not allowed.</li>
    <li>Unauthorized attempts to embed or integrate this software into hardware products are restricted.</li>
    <li>Accessing administrative features or locked settings without permission is prohibited.</li>
    <li>Distributing modified versions of this software is not permitted.</li>
    <li>Using the software for political, religious, or extremist propaganda is forbidden.</li>
    <li>Users must not interfere with the software’s functionality through unauthorized means.</li>
    <li>Unauthorized attempts to resell individual components of the software are not allowed.</li>
    <li>Any use of the software in a way that degrades its performance or disrupts its operation is forbidden.</li>
    <li>Altering software logs, records, or activity history to hide violations is prohibited.</li>
    <li>Use of this software in combination with unauthorized VPNs or proxies is restricted.</li>
    <li>Utilizing the software for large-scale data harvesting or scraping is not allowed.</li>
    <li>Any reverse engineering for commercial gain without permission is strictly forbidden.</li>
    <li>Attempting to use the software in an environment it was not intended for is restricted.</li>
    <li>Use of the software for research or academic purposes without authorization is limited.</li>
    <li>Installing this software on systems you do not own or control is prohibited.</li>
    <li>Users may not make false claims about the software’s capabilities or performance.</li>
    <li>Altering the software’s licensing terms to mislead users is strictly forbidden.</li>
    <li>Using this software for excessive bandwidth consumption or DDoS attacks is prohibited.</li>
    <li>Any attempt to sublicense individual software features to third parties is not allowed.</li>
    <li>Storing or distributing illegal content using this software is strictly prohibited.</li>
    <li>Modifying software to run on unauthorized operating systems is forbidden.</li>
    <li>Using this software to create, host, or distribute illegal media content is not allowed.</li>
    <li>Attempting to transfer your license to another user without permission is prohibited.</li>
    <li>Users must not distribute unauthorized documentation or leaked proprietary information.</li>
    <li>Engaging in unauthorized testing of this software on third-party networks is restricted.</li>
    <li>Using this software to analyze or copy proprietary algorithms is not allowed.</li>
    <li>Modifying or disabling error reporting functions is prohibited.</li>
    <li>Any intentional violation of usage policies outlined by the developers is forbidden.</li>
    <li>Attempting to relicense or redistribute software under a different name is prohibited.</li>
    <li>Users must not claim they developed or own the rights to this software.</li>
    <li>Attempting to monetize aspects of the software without approval is restricted.</li>
    <li>Altering legal disclaimers or software policies is prohibited.</li>
    <li>Engaging in deceptive practices to acquire additional software privileges is not allowed.</li>
    <li>Using software outside of the permitted licensing jurisdiction is prohibited.</li>
    <li>Any attempts to create clones, forks, or derivatives without approval are forbidden.</li>
</ul>

        <h2>4. Ownership</h2>
<ul>
    <li>All rights, title, and interest in the software remain with its original creators.</li>
    <li>No ownership rights are transferred through this license, only usage rights.</li>
    <li>Purchasing, subscribing to, or downloading this software does not grant you ownership.</li>
    <li>The software is protected by copyright, trademark, and intellectual property laws.</li>
    <li>Users may not claim ownership over any part of the software, including its design or code.</li>
    <li>Ownership rights include but are not limited to source code, assets, trademarks, and databases.</li>
    <li>All updates, patches, and modifications remain the property of the original developers.</li>
    <li>License holders do not gain rights to distribute or transfer ownership of this software.</li>
    <li>No part of this software may be copied, resold, or sublicensed without explicit permission.</li>
    <li>The software’s intellectual property includes branding, design, and functionality.</li>
    <li>Ownership is retained even if the software is modified, reverse-engineered, or decompiled.</li>
    <li>The company or individual holding the copyright remains the sole owner of the software.</li>
    <li>Users must not claim they created or co-developed the software under any circumstances.</li>
    <li>Any unauthorized attempt to take ownership or claim rights is a violation of this agreement.</li>
    <li>The original creators have the right to revoke licenses if ownership rights are infringed.</li>
    <li>Purchasing premium features or services does not change ownership terms.</li>
    <li>Brand names, logos, and proprietary elements of the software remain the property of the owner.</li>
    <li>Any unauthorized duplication or reproduction of the software is considered copyright infringement.</li>
    <li>Ownership extends to derivative works, forks, or adaptations made without permission.</li>
    <li>Users may not register trademarks, domain names, or accounts falsely representing ownership.</li>
    <li>Legal action may be taken against individuals or entities claiming unauthorized ownership.</li>
    <li>The software’s proprietary algorithms, frameworks, and structures belong to the owner.</li>
    <li>Owning a license does not entitle the user to obtain or modify the source code.</li>
    <li>Reverse engineering, decompiling, or disassembling does not grant ownership rights.</li>
    <li>Any third-party integrations must acknowledge the original software owner.</li>
    <li>Unauthorized reskinning or repackaging of the software does not alter ownership.</li>
    <li>The original creators retain moral rights over the software’s content and design.</li>
    <li>Ownership applies regardless of whether the software is provided for free or as a paid product.</li>
    <li>Using the software under a corporate or team environment does not transfer ownership to an organization.</li>
    <li>All user-generated content within the software remains subject to the original owner's terms.</li>
    <li>The software’s backend, API, and data structures are protected as proprietary information.</li>
    <li>Users are prohibited from altering legal disclaimers regarding ownership.</li>
    <li>Ownership is not transferred through mergers, acquisitions, or business transactions.</li>
    <li>Contributions, bug reports, or suggestions do not grant co-ownership or intellectual property rights.</li>
    <li>Ownership extends to all future updates, patches, and newly developed features.</li>
    <li>The software owner reserves the right to enforce intellectual property protections.</li>
    <li>All software-related documentation, manuals, and guides are protected under the same ownership rules.</li>
    <li>Users may not create clones, forks, or replicas without explicit authorization.</li>
    <li>Using the software in unauthorized ways does not alter ownership status.</li>
    <li>Licenses are revocable if ownership policies are violated.</li>
    <li>Attempting to rebrand or rename the software without permission is strictly forbidden.</li>
    <li>All licensing agreements must align with the ownership terms set forth in this section.</li>
    <li>Any unauthorized claim of ownership, even in partial form, is considered a breach of contract.</li>
    <li>Ownership covers all versions of the software, including legacy and future releases.</li>
    <li>Software ownership rights do not expire unless explicitly transferred by the original owner.</li>
    <li>The software’s database schema, encryption methods, and backend logic remain proprietary.</li>
    <li>Any attempt to remove or modify ownership notices within the software is a violation.</li>
    <li>Intellectual property theft, including unauthorized code extraction, is strictly prohibited.</li>
    <li>Ownership remains valid even if the software ceases operation or support.</li>
    <li>The software creator reserves the right to delegate ownership within legal bounds.</li>
    <li>Ownership applies globally and is not restricted to specific regions.</li>
    <li>Users cannot use branding, logos, or design elements without consent.</li>
    <li>Ownership includes unique design aspects, including the UI/UX, icons, and animations.</li>
    <li>Derivative works based on this software require approval from the owner.</li>
    <li>Ownership disputes must be handled through legal channels as per jurisdictional law.</li>
    <li>Software resale under a different name is a direct violation of ownership rights.</li>
    <li>The software’s internal assets, fonts, and icons are covered under ownership protection.</li>
    <li>Attempts to register patents based on this software’s technology are restricted.</li>
    <li>Users may not impersonate official representatives or falsely claim affiliation.</li>
    <li>Ownership claims cannot be transferred to third parties without legal documentation.</li>
    <li>Legal action may be pursued against entities violating ownership policies.</li>
    <li>The software’s licensing agreement is bound by its ownership clause.</li>
    <li>Ownership remains in effect even if features are altered or removed.</li>
    <li>The software’s original design and architecture are protected from unauthorized changes.</li>
    <li>All media assets, including images and sounds used within the software, are owned by the creator.</li>
    <li>Use of the software within an organization does not transfer ownership to that entity.</li>
    <li>Ownership applies to both digital and physical copies of the software.</li>
    <li>The software’s API, endpoints, and connections remain under ownership control.</li>
    <li>Users are not allowed to host, distribute, or redistribute the software without permission.</li>
    <li>Any user attempting to fraudulently claim ownership will be permanently banned.</li>
    <li>The software’s licensing terms are legally binding and enforceable.</li>
    <li>Software audits may be conducted to ensure ownership compliance.</li>
    <li>Ownership does not extend to third-party integrations, libraries, or dependencies.</li>
    <li>Users are prohibited from making ownership-related false claims to competitors.</li>
    <li>Ownership includes exclusive rights to publish, market, and distribute the software.</li>
    <li>Any legal challenges regarding ownership must be settled under applicable laws.</li>
    <li>The software’s proprietary name cannot be used for personal or commercial gain.</li>
    <li>Ownership applies to both standalone and bundled versions of the software.</li>
    <li>Attempting to obfuscate or conceal ownership violations will result in penalties.</li>
    <li>The software owner reserves the right to modify, update, or enforce ownership policies.</li>
    <li>Users may not create unauthorized derivatives under a different licensing model.</li>
    <li>Ownership extends to both physical and cloud-hosted deployments.</li>
    <li>Claiming co-ownership without a formal agreement is strictly prohibited.</li>
    <li>The software’s licensing terms must be followed in all circumstances.</li>
    <li>Ownership disputes must be handled in accordance with international IP laws.</li>
</ul>


        <h2>5. Termination</h2>
<ul>
    <li>Violation of this agreement may result in immediate termination of your license.</li>
    <li>We reserve the right to revoke access to the software at any time, with or without notice.</li>
    <li>If your license is terminated, you must immediately stop using the software.</li>
    <li>Unauthorized distribution, modification, or reverse engineering may lead to termination.</li>
    <li>Failure to comply with ownership terms will result in termination of usage rights.</li>
    <li>Attempts to bypass security measures or license restrictions will lead to termination.</li>
    <li>Any form of fraudulent activity, such as unauthorized reselling, will lead to termination.</li>
    <li>Use of the software for illegal, unethical, or harmful purposes will result in termination.</li>
    <li>Providing false information when registering or purchasing may result in termination.</li>
    <li>Failure to adhere to the software's guidelines or rules may result in termination.</li>
    <li>Accounts engaged in malicious activity, such as hacking, will face immediate termination.</li>
    <li>Sharing access to a licensed copy without permission may result in termination.</li>
    <li>Engaging in cyber-attacks, phishing, or unauthorized data access leads to termination.</li>
    <li>Failure to comply with third-party dependencies' terms may result in termination.</li>
    <li>Repeated violations of usage policies may lead to a permanent ban.</li>
    <li>License termination is final, and reinstatement is not guaranteed.</li>
    <li>We reserve the right to disable accounts involved in disruptive behavior.</li>
    <li>Any breach of confidentiality clauses in this agreement may lead to termination.</li>
    <li>Using the software in a manner that damages its reputation may result in termination.</li>
    <li>Users caught impersonating staff, developers, or official representatives will be terminated.</li>
    <li>Any attempts to modify, circumvent, or exploit licensing protections result in termination.</li>
    <li>Using exploits, cheats, or automation tools with the software will lead to termination.</li>
    <li>Unauthorized commercial use without explicit consent may lead to termination.</li>
    <li>Failing to meet payment obligations (if applicable) may lead to license revocation.</li>
    <li>Continued harassment or abuse towards the development team will result in termination.</li>
    <li>Dissemination of false information about the software will result in termination.</li>
    <li>Users promoting unauthorized copies of the software will be permanently terminated.</li>
    <li>Threatening legal action in bad faith may result in immediate termination.</li>
    <li>Attempts to steal, claim, or register trademarks related to this software will lead to termination.</li>
    <li>Breaking the terms of third-party integrations may result in termination.</li>
    <li>Users caught engaging in piracy or software cracking will be terminated.</li>
    <li>Violation of regional or international laws while using the software leads to termination.</li>
    <li>Failure to report discovered security vulnerabilities in good faith may lead to termination.</li>
    <li>Deliberate attempts to overload or crash the software infrastructure will result in termination.</li>
    <li>Using the software in a way that violates the privacy of others may lead to termination.</li>
    <li>Users engaged in hate speech, discrimination, or harassment will have their license revoked.</li>
    <li>Using this software to engage in unauthorized data collection will lead to termination.</li>
    <li>Attempting to transfer or resell a license without approval will result in termination.</li>
    <li>Any violation of intellectual property laws may lead to permanent license revocation.</li>
    <li>Participating in fraudulent chargebacks may result in account suspension and termination.</li>
    <li>Sharing or leaking private software features without permission will result in termination.</li>
    <li>Failure to respect content moderation policies may result in termination.</li>
    <li>Providing fake reviews or manipulated ratings to misrepresent the software leads to termination.</li>
    <li>We reserve the right to revoke access if a user becomes a threat to the community.</li>
    <li>Users abusing technical support or customer service may have their license revoked.</li>
    <li>Any participation in software piracy groups will result in permanent termination.</li>
    <li>Users detected using unauthorized bots or automation with the software may be terminated.</li>
    <li>Repeatedly failing security verification checks may result in termination.</li>
    <li>Use of this software for unethical AI training, data harvesting, or misinformation will be terminated.</li>
    <li>Failure to update to legally required versions of the software may result in termination.</li>
    <li>Using the software to send spam, malware, or phishing attempts will result in termination.</li>
    <li>Publishing or leaking private software documentation without consent may result in termination.</li>
    <li>Users suspected of money laundering, fraud, or other financial crimes may be terminated.</li>
    <li>License revocation due to security risks cannot be appealed.</li>
    <li>Violation of open-source licenses within dependencies may result in termination.</li>
    <li>False claims of software vulnerabilities to manipulate security policies will lead to termination.</li>
    <li>Users who attempt to monopolize software resources unfairly will have access revoked.</li>
    <li>Any detected use of stolen or fraudulent payment methods may result in termination.</li>
    <li>Failure to cooperate with security investigations may result in termination.</li>
    <li>Any breach of advertising guidelines set by the software will lead to termination.</li>
    <li>Involvement in scamming or social engineering tactics using the software will lead to termination.</li>
    <li>Users who make public threats against the software or its developers may be permanently terminated.</li>
    <li>Attempting to bypass age or region restrictions may lead to immediate termination.</li>
    <li>Use of the software in heavily regulated industries without permission may lead to termination.</li>
    <li>Users misrepresenting themselves as partners or affiliates will be terminated.</li>
    <li>Violating ethical standards set by third-party APIs may lead to account termination.</li>
    <li>Using the software in unauthorized government or military applications will lead to termination.</li>
    <li>Providing deliberately misleading feedback or reports may lead to termination.</li>
    <li>Engaging in harmful misinformation campaigns through this software may lead to termination.</li>
    <li>Exploiting software refund policies in bad faith may result in termination.</li>
    <li>Persistent non-compliance with updated Terms of Service may result in termination.</li>
    <li>Using the software to attack, disrupt, or target competitors leads to termination.</li>
    <li>Software piracy or bypassing DRM protections will result in license revocation.</li>
    <li>Licenses are terminated permanently when users are banned from the platform.</li>
    <li>Users underage or legally ineligible for this software may have their access revoked.</li>
    <li>Termination applies to all related accounts of the violator.</li>
    <li>Expired, inactive, or abandoned accounts may be subject to termination.</li>
    <li>Users attempting to impersonate high-level staff will be immediately terminated.</li>
    <li>Repeated violation of software limitations may result in final termination.</li>
    <li>Termination decisions are final and at the discretion of the software owner.</li>
    <li>Access to terminated accounts will not be restored unless explicitly stated otherwise.</li>
    <li>Appeals against termination must follow the outlined process, if available.</li>
    <li>Attempts to circumvent a previous termination result in a permanent ban.</li>
</ul>


        <h2>6. Data Collection & Privacy</h2>
<ul>
    <li>We may collect limited data to enhance your experience with the software.</li>
    <li>Data collected may include technical information, such as device type, IP address, and browser details.</li>
    <li>We collect usage statistics, including how you interact with the software and its features.</li>
    <li>Your personal information may be collected if you voluntarily provide it during registration or support requests.</li>
    <li>All data collected will be used to improve software functionality and user experience.</li>
    <li>We may use cookies or similar technologies to track user behavior and preferences.</li>
    <li>We may collect analytics data to measure user engagement and app performance.</li>
    <li>Data may be shared with trusted third-party services to improve functionality, such as hosting and analytics providers.</li>
    <li>We do not sell your personal information to third parties.</li>
    <li>Your personal information will never be used for unauthorized marketing without your consent.</li>
    <li>We may use your data to communicate with you regarding software updates, features, and issues.</li>
    <li>Your data will be stored securely with appropriate encryption and access control measures.</li>
    <li>We will not collect sensitive information unless absolutely necessary for the software’s functionality.</li>
    <li>You may request a copy of the data we have collected about you at any time.</li>
    <li>You may request the deletion of your data in accordance with applicable laws and regulations.</li>
    <li>We will notify you of any significant changes to our data collection practices.</li>
    <li>We may store your data for a period of time to comply with legal obligations.</li>
    <li>We will take reasonable steps to protect your personal data from unauthorized access or misuse.</li>
    <li>We may disclose your data if required to do so by law or in response to legal requests.</li>
    <li>Our data storage practices are regularly audited to ensure compliance with privacy laws.</li>
    <li>We use SSL encryption to secure sensitive information sent over the internet.</li>
    <li>Our data practices are compliant with GDPR, CCPA, and other relevant data protection laws.</li>
    <li>We may use anonymized data for research and development purposes.</li>
    <li>We do not knowingly collect data from individuals under the age of 13.</li>
    <li>If we discover that we have collected data from a child under the age of 13, we will take immediate action to delete it.</li>
    <li>You have the right to opt-out of certain data collection practices, such as analytics tracking and marketing communications.</li>
    <li>Your IP address may be collected for security and anti-abuse purposes.</li>
    <li>We do not use personally identifiable information for advertising or targeted marketing without your consent.</li>
    <li>We may share your data with third-party service providers who assist us in operating the software, such as cloud hosting and payment processors.</li>
    <li>Any third parties we share data with are bound by confidentiality agreements and are prohibited from using your data for their own purposes.</li>
    <li>We will not collect or store credit card or financial information; payments are processed through a secure third-party service.</li>
    <li>We may use your email address to send you updates about the software or related services.</li>
    <li>We may use your feedback to improve the software, but your personal information will remain confidential.</li>
    <li>We may use analytics tools to measure and understand how users interact with the software.</li>
    <li>We do not track your physical location unless you provide explicit consent.</li>
    <li>We may use cookies to remember your preferences between sessions, such as language or theme settings.</li>
    <li>You can manage cookie settings through your browser preferences.</li>
    <li>We may send you notifications or alerts related to your account or software updates.</li>
    <li>If we integrate with third-party services (such as social media platforms), we may collect additional information from those services, subject to their privacy policies.</li>
    <li>We do not share personal data with advertisers or third-party marketers without your consent.</li>
    <li>Your personal information will be kept for as long as necessary for the purposes outlined in this agreement.</li>
    <li>If you contact us with a support request, we may collect personal information necessary to resolve the issue.</li>
    <li>If you choose to share content, feedback, or reviews publicly, that information may be publicly visible.</li>
    <li>We may use aggregated, non-identifiable data to improve our services and products.</li>
    <li>You can request the correction of inaccurate or incomplete data we have on file.</li>
    <li>If you have any concerns about how we handle your data, you can contact our support team.</li>
    <li>We may ask you to review and consent to our data practices when using certain features of the software.</li>
    <li>We provide users with the ability to control the data shared with us via user settings.</li>
    <li>We may collect device identifiers (such as a unique ID or MAC address) to help improve service reliability.</li>
    <li>We may share data with business partners who help us deliver new features or services.</li>
    <li>We ensure all third-party services we use comply with privacy and data protection standards.</li>
    <li>We retain data in secure environments, and access is granted only to authorized personnel.</li>
    <li>We may collect metadata, such as usage logs, for security and troubleshooting purposes.</li>
    <li>We may provide you with access to control the visibility of your personal data.</li>
    <li>We may ask for feedback via surveys, which will be optional and not require personal information.</li>
    <li>We comply with all applicable international data privacy laws, including cross-border data transfers.</li>
    <li>You are not required to provide personal data to use the basic features of the software.</li>
    <li>Our privacy practices are reviewed regularly to ensure compliance with evolving privacy laws.</li>
    <li>We provide users with tools to manage, export, and delete their personal data.</li>
    <li>If you use third-party services in conjunction with this software, they may collect additional data as per their privacy policies.</li>
    <li>We may automatically collect information about your hardware and software environment, including operating system and device model.</li>
    <li>Your privacy preferences and opt-out choices will be respected across all interactions with the software.</li>
    <li>We provide users with clear notifications about any changes to our data collection practices.</li>
    <li>We do not intentionally share any of your personal data with advertising networks.</li>
    <li>Any data shared with third parties will be governed by their respective privacy policies.</li>
    <li>We may be required to share your personal data to comply with legal or regulatory requests.</li>
    <li>You can withdraw your consent to data collection at any time, subject to any legal requirements.</li>
    <li>If you access the software through third-party authentication services, we may collect related data as per their terms of use.</li>
    <li>We may use security tools, such as firewalls and encryption, to safeguard your data.</li>
    <li>We do not track your browsing activity outside of our software unless explicitly stated.</li>
    <li>We may disclose aggregated statistics about user behavior without revealing any personally identifiable information.</li>
    <li>We ensure that all service providers who process your data meet high security and privacy standards.</li>
    <li>We may update our privacy policy from time to time and will notify you of any significant changes.</li>
    <li>If you opt out of marketing communications, we will still send you essential service-related updates.</li>
    <li>We may use machine learning techniques to improve the software, but this will not compromise your privacy.</li>
    <li>We do not collect information for profiling or making automated decisions about you.</li>
    <li>We may use your data to personalize your experience, such as suggesting relevant features.</li>
    <li>You are responsible for maintaining the confidentiality of your account information, including your login credentials.</li>
    <li>If you need to contact us regarding data-related inquiries, we will respond promptly and transparently.</li>
    <li>We may track application crashes and bugs to improve the software’s reliability.</li>
    <li>If you use a public forum within the software, please be mindful of the personal data you share.</li>
    <li>By using the software, you consent to the collection and use of your data as described in this section.</li>
    <li>If you are a resident of the European Union or the European Economic Area, you have specific data protection rights as outlined in the GDPR.</li>
    <li>If you are a resident of California, you have specific rights under the CCPA regarding your personal data.</li>
    <li>You can contact our support team for any queries related to your data privacy rights.</li>
</ul>


        <h2>7. Disclaimer & Liability</h2>
<ul>
    <li>The software is provided "as is" without any warranties, express or implied.</li>
    <li>We do not guarantee that the software will meet all your requirements or function without interruptions.</li>
    <li>We are not responsible for any damages resulting from the use or inability to use the software.</li>
    <li>We do not warrant that the software will be free from bugs, errors, or defects.</li>
    <li>Any use of the software is at your own risk, and you assume full responsibility for all consequences.</li>
    <li>We make no warranties regarding the accuracy, completeness, or reliability of any information provided by the software.</li>
    <li>We are not responsible for any data loss or corruption arising from using the software.</li>
    <li>We will not be liable for any indirect, incidental, special, or consequential damages, including but not limited to loss of profits, data, or business opportunities.</li>
    <li>We are not liable for any third-party applications, services, or content that are accessed through the software.</li>
    <li>We do not guarantee that the software will be compatible with all hardware, operating systems, or devices.</li>
    <li>We do not assume any responsibility for any failure or delay in the performance of the software.</li>
    <li>We are not responsible for any issues arising from user-generated content, including but not limited to copyright infringement, defamation, or offensive material.</li>
    <li>We do not take responsibility for any consequences resulting from unauthorized modifications or tampering with the software.</li>
    <li>We do not guarantee that the software will always be available or accessible, as service interruptions may occur.</li>
    <li>We are not responsible for any damages caused by viruses, malware, or other harmful code transmitted via the software.</li>
    <li>We are not liable for any network issues or interruptions that may affect your experience with the software.</li>
    <li>We are not responsible for any costs associated with the installation, maintenance, or removal of the software.</li>
    <li>We do not assume liability for any loss of data, revenue, or profits resulting from your use of the software.</li>
    <li>We are not liable for any damages that may occur during the installation or uninstallation of the software.</li>
    <li>We do not guarantee that the software will be free from human error or external factors beyond our control.</li>
    <li>We are not responsible for any disputes, including legal action, arising from the use of the software.</li>
    <li>We disclaim any liability related to the transfer or use of your data, including data breaches or unauthorized access.</li>
    <li>We do not provide any guarantees regarding the software’s compatibility with third-party systems or services.</li>
    <li>We are not liable for any failure of the software to meet your specific business or operational needs.</li>
    <li>We are not responsible for any damage to your reputation, brand, or business caused by using the software.</li>
    <li>We are not responsible for any third-party claims related to the software’s use or any failure thereof.</li>
    <li>We are not responsible for any damage caused by natural disasters, force majeure, or other uncontrollable circumstances.</li>
    <li>We are not liable for any damages caused by improper installation or misuse of the software.</li>
    <li>We are not responsible for any claims arising from unauthorized or illegal activities conducted using the software.</li>
    <li>We are not liable for any claims, damages, or losses resulting from any actions taken by third-party service providers integrated with the software.</li>
    <li>We are not liable for any interruptions to services or disruptions to your internet or network connectivity while using the software.</li>
    <li>We are not liable for any loss of personal or sensitive information stored within the software.</li>
    <li>We do not warrant that the software will be free of errors or meet all user expectations in every situation.</li>
    <li>We are not responsible for the behavior of any third-party websites or services linked from the software.</li>
    <li>We disclaim responsibility for any damages caused by unauthorized access or use of your account within the software.</li>
    <li>We are not responsible for any damage caused by a failure of the software to integrate with your existing systems or services.</li>
    <li>We do not assume liability for the loss or theft of personal information, including login credentials, resulting from use of the software.</li>
    <li>We disclaim any liability for damage to your device resulting from the download or installation of the software.</li>
    <li>We are not responsible for any losses caused by a system failure, hardware issues, or connectivity problems unrelated to the software.</li>
    <li>We do not guarantee that the software will be compliant with every legal or regulatory requirement in your jurisdiction.</li>
    <li>We are not liable for any damage caused by misuse of the software or failure to follow the provided guidelines.</li>
    <li>We are not responsible for any inconvenience, loss, or damage caused by any server downtime or unavailability of the software.</li>
    <li>We disclaim responsibility for any damage caused by the installation of unofficial or third-party modifications to the software.</li>
    <li>We are not liable for any damages resulting from the software’s use in combination with incompatible hardware or software.</li>
    <li>We are not responsible for any delays or interruptions caused by network congestion or external issues beyond our control.</li>
    <li>We are not liable for any data corruption or loss resulting from external factors, including software bugs or hardware failure.</li>
    <li>We disclaim any liability for loss of income, data, or other intangible assets arising from the use or misuse of the software.</li>
    <li>We are not responsible for any legal fees or other costs incurred due to violations of this agreement.</li>
    <li>We are not liable for any damages resulting from actions taken by other users of the software.</li>
    <li>We are not responsible for any disruptions caused by compatibility issues between the software and your system.</li>
    <li>We disclaim any responsibility for the accuracy of any data or information provided through the software.</li>
    <li>We are not responsible for any issues caused by network outages or failures that prevent access to the software.</li>
    <li>We are not liable for damages arising from the use of the software outside of its intended purpose or scope.</li>
    <li>We are not responsible for any interruptions in service caused by external factors, such as DDoS attacks or hacking attempts.</li>
    <li>We are not liable for any direct or indirect damages caused by the software’s use in a live environment without proper testing.</li>
    <li>We do not guarantee that the software will be free from legal or technical restrictions in all jurisdictions.</li>
    <li>We are not responsible for any damages caused by software updates or changes, including but not limited to new features or versions.</li>
    <li>We disclaim any liability for any harm caused by the actions of third-party applications integrated with the software.</li>
    <li>We are not liable for damages resulting from user negligence, including improper use or failure to update the software.</li>
    <li>We are not responsible for the behavior of any third-party advertisements displayed through the software.</li>
    <li>We disclaim any liability for damages caused by delays in our customer support services.</li>
    <li>We are not liable for any damages resulting from the loss of access to your account or the software.</li>
    <li>We are not responsible for the compatibility of the software with every device, operating system, or browser.</li>
    <li>We disclaim any responsibility for the consequences of unauthorized access or fraud on your account.</li>
    <li>We are not responsible for any financial loss due to fraudulent transactions involving the software.</li>
    <li>We do not assume liability for any damage to your personal or business reputation caused by the software.</li>
    <li>We disclaim liability for any loss or damage resulting from external attacks, such as hacking or cyberattacks.</li>
    <li>We are not liable for any loss of data, business, or goodwill caused by third-party acts or omissions.</li>
    <li>We are not responsible for any adverse effects on your system due to the use of the software.</li>
    <li>We are not liable for any damages caused by third-party tools, resources, or services that are compatible with the software.</li>
    <li>We disclaim any responsibility for data loss or corruption resulting from integration with external systems or tools.</li>
    <li>We are not responsible for the timeliness or accuracy of any third-party updates or patches to the software.</li>
    <li>We disclaim liability for any failure of the software to meet user expectations based on third-party assessments or reviews.</li>
    <li>We are not responsible for any problems that may arise from the lack of proper system configuration.</li>
    <li>We are not liable for any loss of business or sales resulting from the unavailability of the software.</li>
    <li>We disclaim any liability for any violation of third-party rights due to the use of the software.</li>
</ul>


        <h2>8. Updates & Modifications</h2>
<ul>
    <li>We reserve the right to modify or update this EULA at any time, without prior notice.</li>
    <li>Continued use of the software means you accept all future changes to this agreement.</li>
    <li>We may modify or update the software's features, functionality, and services at any time.</li>
    <li>Updates may include bug fixes, security patches, new features, or other changes.</li>
    <li>We may modify or remove features without notice or obligation to provide replacements.</li>
    <li>We will make reasonable efforts to notify you of significant updates or changes.</li>
    <li>By continuing to use the software after an update, you agree to the modified terms.</li>
    <li>We may implement software updates that require you to install new versions of the software.</li>
    <li>Some updates may change the user interface or overall user experience of the software.</li>
    <li>We are not responsible for any issues arising from your failure to apply updates.</li>
    <li>We may release updates that require system or hardware upgrades to function properly.</li>
    <li>We may update the software's backend services, which could affect your experience with the software.</li>
    <li>We reserve the right to discontinue support for older versions of the software without notice.</li>
    <li>Updates may require you to restart your device or software for proper installation.</li>
    <li>We may alter the terms of the EULA as part of any software update.</li>
    <li>We may offer optional updates or upgrades that you can choose to install.</li>
    <li>Any modifications made to the software or EULA will apply only to future use of the software.</li>
    <li>We may provide updates that enhance the security, performance, or functionality of the software.</li>
    <li>We are not liable for any adverse effects caused by failing to install updates promptly.</li>
    <li>Software updates may impact the compatibility of the software with other systems or applications.</li>
    <li>Updates may include changes to the licensing structure or terms of use.</li>
    <li>You acknowledge that software updates could introduce new terms and conditions for which your consent is required.</li>
    <li>We may suspend the availability of the software if updates or modifications are necessary for security reasons.</li>
    <li>We are not liable for any downtime or service interruptions resulting from updates.</li>
    <li>We may provide updates to fix security vulnerabilities, and these may be applied automatically.</li>
    <li>You are responsible for keeping your software up-to-date and compatible with the latest version.</li>
    <li>We may update or change the software’s compatibility requirements, including hardware or software dependencies.</li>
    <li>Failure to apply updates in a timely manner may prevent access to certain features or services.</li>
    <li>We reserve the right to modify or suspend software functionality without notice in response to security threats.</li>
    <li>We may discontinue support for older versions of third-party dependencies in future updates.</li>
    <li>We will not be liable for issues that arise from your use of outdated software versions.</li>
    <li>We may add, remove, or alter software features based on feedback or business needs.</li>
    <li>We may alter the user interface to improve the usability or accessibility of the software.</li>
    <li>We may provide you with release notes that outline the changes made in each software update.</li>
    <li>You may be required to register or log in to download and install software updates.</li>
    <li>We may introduce new functionalities that require you to provide additional information or permissions.</li>
    <li>We may modify or discontinue services provided through the software at our discretion.</li>
    <li>We reserve the right to remove any features that are not widely used or are deemed unnecessary.</li>
    <li>Any changes made to the software’s functionality are subject to the terms outlined in this EULA.</li>
    <li>We may limit the availability of certain features to specific user groups or geographic locations following an update.</li>
    <li>We are not responsible for any issues that occur if you fail to update your version of the software.</li>
    <li>We may modify the support channels available for the software in response to updates.</li>
    <li>Software updates may require additional configuration or setup after installation.</li>
    <li>We may introduce new security protocols or remove outdated ones as part of software updates.</li>
    <li>We may offer the option to revert to a previous version of the software if an update introduces critical issues.</li>
    <li>We may modify the system requirements for the software in future updates, which could impact performance.</li>
    <li>We may release updates that require additional hardware resources, such as memory or processing power.</li>
    <li>We reserve the right to remove or modify third-party integrations in future updates of the software.</li>
    <li>We may change the method of delivering updates (e.g., via automated downloads or manual updates).</li>
    <li>Updates may include improvements in the software’s privacy and data protection features.</li>
    <li>We are not responsible for any incompatibility issues that arise due to updates with third-party tools or services.</li>
    <li>We may temporarily suspend the availability of the software during major updates or maintenance periods.</li>
    <li>We may provide tools to help you manage or uninstall updates if necessary.</li>
    <li>We may offer opt-in beta versions or preview releases for users who wish to test new features.</li>
    <li>We may release emergency updates to address critical security vulnerabilities.</li>
    <li>We may update the terms of this agreement in conjunction with any major software update.</li>
    <li>We may introduce changes to the software’s licensing structure as part of a future update.</li>
    <li>You agree that we may collect data related to your use of the software in order to improve future updates.</li>
    <li>We may limit the access to certain software updates based on your user profile or subscription tier.</li>
    <li>We may offer automated tools that enable you to schedule updates according to your preferences.</li>
    <li>We may withdraw or disable access to previous versions of the software once an update is available.</li>
    <li>We may alter the frequency or size of software updates based on the nature of the changes made.</li>
    <li>You are encouraged to review the release notes for each update to understand what changes have been made.</li>
    <li>We may modify or expand the software's functionality based on user feedback after updates.</li>
    <li>We may make changes to the software's data storage methods or cloud services as part of an update.</li>
    <li>We are not responsible for any incompatibilities caused by updates when used with other third-party software.</li>
    <li>We may make adjustments to software settings as part of an update to enhance performance or security.</li>
    <li>We may remove outdated software versions from distribution or archives after a new update is released.</li>
    <li>We are not responsible for any software malfunctions that result from using a version that is no longer supported.</li>
    <li>We may update our support policies and procedures in conjunction with major software changes.</li>
    <li>We may discontinue the development of certain software features based on market demand or technical limitations.</li>
    <li>We reserve the right to change how updates are packaged or delivered in future versions of the software.</li>
    <li>We are not responsible for any inconvenience or issues caused by system requirements changing after an update.</li>
    <li>We may make future updates available only for certain operating systems or hardware platforms.</li>
    <li>We reserve the right to terminate support for older software versions and remove them from distribution.</li>
    <li>We may include advertising, analytics, or other third-party content as part of future software updates.</li>
    <li>We may change the way user data is handled or processed in future updates to comply with regulatory changes.</li>
    <li>We may adjust the software’s pricing model or subscription terms in response to future updates.</li>
    <li>We may introduce new authentication or security protocols in future updates to enhance account protection.</li>
    <li>We may offer tools for users to back up or restore data after updates, particularly during major changes.</li>
    <li>We may implement measures to ensure that users are notified about available updates before they are applied.</li>
    <li>We may require certain system configurations or hardware upgrades for compatibility with future software versions.</li>
    <li>We may discontinue access to certain features or services after an update if they are no longer viable or needed.</li>
    <li>We reserve the right to limit the availability of updates for certain users based on their compliance with this agreement.</li>
    <li>We may update the software’s user manuals or documentation to reflect changes made in the most recent update.</li>
    <li>We may require users to sign a new agreement or accept new terms with major updates to the software.</li>
</ul>

        <h2>9. Governing Law</h2>
        <ul>
            <li>This agreement is governed by applicable international laws.</li>
        </ul>

        <button class="accept-btn">I Accept</button>
    </div>
</body>
</html>
`);
});

app.get('/tickets', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Lost Nemo - Support Ticket</title>

    <!-- Google Fonts & Bootstrap -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">

    <style>
    :root {
        --primary-color: #1E90FF;
        --bg-dark: #0A0F1D;
        --bg-light: #101826;
        --text-light: #E0E6F1;
        --text-muted: #8892B0;
        --border-color: #1E90FF;
    }

    body {
        font-family: 'Inter', sans-serif;
        background: var(--bg-dark);
        color: var(--text-light);
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 20px;
    }

    .container {
        background: var(--bg-light);
        padding: 25px;
        border-radius: 0;
        max-width: 500px;
        width: 100%;
        text-align: left;
        border: 2px solid var(--border-color);
        overflow: hidden;
    }

    h1 {
        font-size: 22px;
        font-weight: 600;
        text-align: center;
        margin-bottom: 18px;
    }

    .checkboxes {
        max-height: 280px;
        overflow-y: auto;
        padding-right: 10px;
        margin-bottom: 12px;
        border: 1px solid var(--border-color);
        padding: 10px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.02);
    }

    input, textarea {
        background-color: #2c2f3d; /* Gray background color */
        border: 1px solid #1e90ff; /* Blue border */
        color: #e0e6f1; /* Light text color */
        padding: 10px;
        border-radius: 5px;
        font-size: 14px;
        width: 100%;
        margin-bottom: 12px;
    }

    input:focus, textarea:focus {
        border-color: #1e90ff; /* Blue border on focus */
        outline: none; /* Remove default outline */
    }

    /* Custom Scrollbar */
    .checkboxes::-webkit-scrollbar {
        width: 8px;
    }
    .checkboxes::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 5px;
    }
    .checkboxes::-webkit-scrollbar-track {
        background: #202A3C;
    }

    .checkboxes label {
        display: flex;
        align-items: center;
        font-size: 13px;
        margin-bottom: 8px;
        cursor: pointer;
    }

    .checkboxes input {
        margin-right: 12px;
        accent-color: var(--primary-color);
        width: 18px;
        height: 18px;
    }

    .checkboxes a {
        color: var(--primary-color);
        text-decoration: none;
        margin-left: 3px;
        margin-right: 3px;
        word-break: break-word;
    }

    .checkboxes a:hover {
        text-decoration: underline;
    }

    .accept-all-container {
        margin-top: 10px;
        text-align: center;
    }

    .h-captcha {
        margin: 15px auto;
        transform: scale(0.85);
        transform-origin: center;
        display: flex;
        justify-content: center;
    }

    button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 12px;
        font-size: 16px;
        width: 100%;
        cursor: not-allowed;
        opacity: 0.6;
        transition: all 0.3s ease;
        border-radius: 0;
        font-weight: 600;
        text-transform: uppercase;
        margin-top: 10px;
    }

    button.enabled {
        opacity: 1;
        cursor: pointer;
    }

    button:hover.enabled {
        background: #187bcd;
    }

    footer {
        margin-top: 15px;
        font-size: 12px;
        text-align: center;
        color: var(--text-muted);
    }

    footer a {
        color: var(--primary-color);
        text-decoration: none;
    }

    footer a:hover {
        text-decoration: underline;
    }
</style>


    <!-- Security Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js"></script>
    <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>
    <div class="container">
        <h1><i class="fas fa-ticket-alt"></i> Create Support Ticket</h1>
        
        <form id="ticket-form">
            <div class="mb-3">
                <label for="ticket-title" class="form-label">Ticket Title</label>
                <input type="text" class="form-control" id="ticket-title" placeholder="Enter ticket title" required>
            </div>

            <div class="mb-3">
                <label for="ticket-description" class="form-label">Description</label>
                <textarea class="form-control" id="ticket-description" rows="4" placeholder="Describe your issue" required></textarea>
            </div>

            <div class="checkboxes">
                <label><input type="checkbox" class="agreement-checkbox" name="termsAccepted"> I accept the <a href="https://tln.framer.website/terms-of-service"> Terms of Service </a></label>
                <label><input type="checkbox" class="agreement-checkbox" name="privacyAccepted"> I accept the <a href="https://tln.framer.website/privacy-policy"> Privacy Policy </a></label>
                <label><input type="checkbox" class="agreement-checkbox" name="eulaAccepted"> I accept the <a href="https://tln.framer.website/eula"> EULA </a></label>
            </div>

            <div class="accept-all-container">
                <label>
                    <input type="checkbox" id="acceptAll"> Accept All Agreements
                </label>
            </div>

            <!-- hCaptcha Widget -->
            <div class="h-captcha" data-sitekey="#####################" data-callback="onCaptchaVerified"></div>

            <button id="submitTicketBtn" type="submit" disabled>
                <i class="fas fa-paper-plane"></i> Submit Ticket
            </button>
        </form>

        <footer>
            <p>Need help? <a href="https://thelostnemo.glitch.me/support">Contact Us</a></p>
        </footer>
    </div>

    <script>
        // Get references to elements
        const acceptAllCheckbox = document.getElementById('acceptAll');
        const submitTicketBtn = document.getElementById('submitTicketBtn');
        const agreementCheckboxes = document.querySelectorAll('.agreement-checkbox');
        let hcaptchaResponse = null;

        // Function to toggle the button's enabled/disabled state
        function toggleButtonState() {
            const isCheckboxChecked = acceptAllCheckbox.checked;
            const isCaptchaVerified = hcaptchaResponse;

            if (isCheckboxChecked && isCaptchaVerified) {
                submitTicketBtn.disabled = false;
                submitTicketBtn.classList.add('enabled');
            } else {
                submitTicketBtn.disabled = true;
                submitTicketBtn.classList.remove('enabled');
            }
        }

        // Function to check/uncheck all agreement checkboxes when "Accept All" is clicked
        function toggleAllCheckboxes() {
            agreementCheckboxes.forEach(checkbox => {
                checkbox.checked = acceptAllCheckbox.checked;
            });
            toggleButtonState();
        }

        // Event listener for "Accept All" checkbox change
        acceptAllCheckbox.addEventListener('change', toggleAllCheckboxes);

        // Callback function for hCaptcha verification
        function onCaptchaVerified(response) {
            hcaptchaResponse = response;
            toggleButtonState();
        }

        // Form submit event listener
        document.getElementById('ticket-form').addEventListener('submit', function(e) {
            e.preventDefault();
            // Submit the form data (e.g., send it to the server)
            const title = document.getElementById('ticket-title').value;
            const description = document.getElementById('ticket-description').value;

            console.log('Ticket Title:', title);
            console.log('Ticket Description:', description);
            
            // Reset the form and redirect or show success message
            alert('Ticket submitted successfully!');
        });

        // Initialize the button state on page load
        toggleButtonState();
    </script>

</body>
</html>
`);
});
      
app.get('/rules', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Community Rules</title>
    <style>
        :root {
            --primary-color: #1E90FF;
            --bg-dark: #0A0F1D;
            --bg-light: #101826;
            --text-light: #E0E6F1;
            --text-muted: #8892B0;
            --border-color: #1E90FF;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-dark);
            color: var(--text-light);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .container {
            background: var(--bg-light);
            padding: 25px;
            border-radius: 0;
            max-width: 700px;
            width: 100%;
            text-align: left;
            border: 2px solid var(--border-color);
            overflow: hidden;
        }

        h1 {
            font-size: 24px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 18px;
        }

        .rules-box {
            max-height: 500px;
            overflow-y: auto;
            padding-right: 10px;
            margin-bottom: 15px;
            border: 1px solid var(--border-color);
            padding: 15px;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.02);
            word-break: break-word; /* Ensure long links don't overlap */
        }

        /* Custom Scrollbar */
        .rules-box::-webkit-scrollbar {
            width: 8px;
        }
        .rules-box::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 5px;
        }
        .rules-box::-webkit-scrollbar-track {
            background: #202A3C;
        }

        .rule-category {
            font-size: 16px;
            font-weight: 600;
            margin-top: 15px;
            text-decoration: underline;
            color: var(--primary-color);
        }

        .rule {
            font-size: 14px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }

        .rule::before {
            content: "✅";
            margin-right: 8px;
            color: var(--primary-color);
        }

        .rule a {
            color: var(--primary-color);
            text-decoration: none;
        }

        .rule a:hover {
            text-decoration: underline;
        }

        .accept-container {
            text-align: center;
            margin-top: 10px;
        }

        button {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 12px;
            font-size: 16px;
            width: 100%;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 0;
            font-weight: 600;
            text-transform: uppercase;
        }

        button:hover {
            background: #187bcd;
        }

        footer {
            margin-top: 15px;
            font-size: 12px;
            text-align: center;
            color: var(--text-muted);
        }

        footer a {
            color: var(--primary-color);
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>

    <div class="container">
        <h1>📜 Community Rules</h1>

        <div class="rules-box">
            <div class="rule-category">👥 General Behavior</div>
            <div class="rule">Be respectful to all members and staff. Harassment, hate speech, or discrimination is not allowed.</div>
            <div class="rule">No excessive arguing, toxicity, or disruptive behavior.</div>
            <div class="rule">Avoid trolling, baiting, or purposely instigating arguments.</div>
            <div class="rule">Use appropriate language. No excessive swearing, slurs, or offensive jokes.</div>
            <div class="rule">If you have an issue with someone, approach them privately or contact the moderators. Don’t escalate conflicts in public channels.</div>
            
            <div class="rule-category">📢 Advertising & Self-Promotion</div>
            <div class="rule">Advertising is only allowed in designated channels.</div>
            <div class="rule">No unsolicited DMs promoting other servers, products, or services.</div>
            <div class="rule">Do not spam or flood the chat with promotional messages.</div>
            <div class="rule">If you wish to advertise, seek permission from a moderator or administrator first.</div>

            <div class="rule-category">🚫 Prohibited Content</div>
            <div class="rule">No NSFW (Not Safe for Work), explicit, or gory content.</div>
            <div class="rule">No sharing, promoting, or engaging in illegal activities, such as hacking, piracy, or cheating.</div>
            <div class="rule">No posting personal information (doxxing) of yourself or others.</div>
            <div class="rule">Do not post or share any form of hate speech, racism, sexism, or any other form of bigotry.</div>
            <div class="rule">Respect all members regardless of their background, gender, race, or any other characteristic.</div>

            <div class="rule-category">⚖️ Security & Privacy</div>
            <div class="rule">Do not attempt to hack, exploit, or harm the community in any way.</div>
            <div class="rule">Never share your password or sensitive information with anyone.</div>
            <div class="rule">Report any security issues or suspicious activity to the staff immediately.</div>
            <div class="rule">Be mindful of phishing links. Only click on links from trusted sources.</div>

            <div class="rule-category">🤖 Bots & Automation</div>
            <div class="rule">Bots are not allowed even with explicit permission from the administration team.</div>
            <div class="rule">No self-bots, auto-clickers, or automated scripts.</div>
            <div class="rule">Any form of botting will lead to permament ban of your account immediately.</div>
            <div class="rule">Using any service that has any type of connection(s) to botting is highly punishable</div>

            <div class="rule-category">🔄 Multiple Accounts & Ban Evasion</div>
            <div class="rule">No using alternate accounts to evade bans or punishment.</div>
            <div class="rule">You are only allowed to have one account unless you have a valid reason for additional accounts, which must be approved by an administrator.</div>
            <div class="rule">Do not trade, sell, or share accounts. All attempts will be punished for.</div>

            <div class="rule-category">🔨 Enforcement & Punishment</div>
            <div class="rule">Breaking rules may result in warnings, timeouts, kicks, or bans, depending on the severity.</div>
            <div class="rule">Admins and moderators have the final say in any disputes and have the authority to apply the appropriate punishment.</div>
            <div class="rule">If you feel that a decision was unfair, contact the staff team privately. Publicly arguing with staff will result in further punishment.</div>

            <div class="rule-category">📨 Reporting Issues</div>
            <div class="rule">If you see someone breaking the rules, report it to a staff member or use the report feature.</div>
            <div class="rule">False reports or abuse of the reporting system will result in consequences for the person filing the false report.</div>

            <div class="rule-category">🎮 Game & Server-Specific Rules</div>
            <div class="rule">Do not exploit any bugs or glitches in the game. If you discover one, report it to staff immediately.</div>
            <div class="rule">Using third-party software to gain an unfair advantage is strictly prohibited.</div>
            <div class="rule">If the server has specific in-game rules, they must also be followed in addition to these community guidelines.</div>

            <div class="rule-category">🌐 External Content</div>
            <div class="rule">Do not link to external websites, except those authorized by the staff.</div>
            <div class="rule">Be cautious when sharing links. Ensure that they are safe and appropriate before posting.</div>
            <div class="rule">Do not share pirated media or unauthorized software.</div>
            <div class="rule">Do not share links to any illegal activity.</div>


            <div class="rule-category">🛠️ Modification of Rules</div>
            <div class="rule">The rules may be updated at any time, and all members are expected to keep up-to-date with them.</div>
            <div class="rule">If there are any significant changes to the rules, a notification will be sent out to all members.</div>
            <div class="rule">Members must acknowledge any rule changes before continuing to participate in the community.</div>

            <div class="rule-category">🔒 Respect for Admin Decisions</div>
            <div class="rule">Staff decisions are final. If you disagree with a decision, you may contact the staff privately.</div>
            <div class="rule">Staff members are here to ensure a safe and enjoyable environment for everyone. Please respect them at all times.</div>

        </div>

        <div class="accept-container">
            <button onclick="acceptRules()">✅ Accept Rules</button>
        </div>

        <footer>
            Need help? Visit our <a href="/support">Support Page</a>.
        </footer>
    </div>

    <script>
        function acceptRules() {
            alert("✅ You have accepted the rules!");
            window.location.href = "/"; // Redirect to homepage
        }
    </script>

</body>
</html>

`);
});
    
app.get('/chat', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Chatbot</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tensorflow/3.19.0/tf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/4.2.12/marked.min.js"></script>
    <script src="https://kit.fontawesome.com/bc70182535.js" crossorigin="anonymous"></script>
    <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
    <style>
        :root {
            --primary-color: #1E90FF;
            --bg-dark: #0A0F1D;
            --bg-light: #101826;
            --text-light: #E0E6F1;
            --text-muted: #8892B0;
            --border-color: #1E90FF;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-dark);
            color: var(--text-light);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .chat-container {
            background: var(--bg-light);
            border: 2px solid var(--border-color);
            width: 400px;
            height: 600px; /* Fixed height for chat box */
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border-radius: 8px;
            position: relative;
            display: none; /* Initially hidden behind captcha */
        }

        .chat-messages {
            flex: 1;
            padding: 10px;
            overflow-y: auto; /* Scrollable area for messages */
            max-height: 800px; /* Keep the height fixed */
        }

        .chat-input {
            display: flex;
            border-top: 2px solid var(--border-color);
            padding: 10px;
        }

        .chat-input input {
            flex: 1;
            padding: 10px;
            background: var(--bg-dark);
            border: none;
            color: var(--text-light);
            outline: none;
        }

        .chat-input button {
            background: var(--primary-color);
            border: none;
            color: white;
            padding: 10px;
            cursor: pointer;
            font-weight: bold;
        }

        .captcha-overlay {
            position: fixed;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .captcha-box {
            background: var(--bg-light);
            padding: 20px;
            border: 2px solid var(--border-color);
            text-align: center;
        }

        /* Timer styling */
        .cooldown-timer {
            position: absolute;
            bottom: 70px;
            right: 10px;
            font-size: 14px;
            color: #FFF;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 5px 10px;
            border-radius: 5px;
            display: none;
        }
    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=#######################"></script>
<body>

    <div class="captcha-overlay" id="captchaOverlay">
        <div class="captcha-box">
            <div class="h-captcha" data-sitekey="####################" data-callback="onCaptchaSuccess"></div>
        </div>
    </div>

    <div class="chat-container" id="chatContainer">
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="Type a message..." disabled>
            <button onclick="sendMessage()">Send</button>
        </div>
        <div id="cooldownTimer" class="cooldown-timer">5s</div> <!-- Timer positioned at the bottom right -->
    </div>

    <script>
        let chatbotModel;
        let cooldown = false;
        let cooldownTime = 5; // cooldown time in seconds
        const chatInput = document.getElementById('chatInput');
        const chatMessages = document.getElementById('chatMessages');
        const cooldownTimer = document.getElementById('cooldownTimer');
        const sendBtn = document.querySelector('.chat-input button');
        const chatContainer = document.getElementById('chatContainer');

        const blockedWords = [
  "All censore",
  "They bad"
]; // Add bad words here

        async function loadModel() {
            chatbotModel = await tf.loadLayersModel('https://tfhub.dev/google/tfjs-model/universal-sentence-encoder/1/default/1');
            console.log("TensorFlow model loaded!");
        }

        function onCaptchaSuccess() {
            document.getElementById('captchaOverlay').style.display = 'none';
            chatContainer.style.display = 'flex'; // Show the chat container after captcha is completed
            chatInput.disabled = false;
        }

        function sendMessage() {
            if (cooldown) return;

            const userInput = chatInput.value.trim();
            if (!userInput) return;

            chatMessages.innerHTML += '<div><strong>You:</strong> ' + userInput + '</div>';
            chatInput.value = '';

            if (blockedWords.some(pattern => pattern.test(userInput))) {
                chatMessages.innerHTML += '<div><i class="fas fa-exclamation-circle"></i> You are not allowed to say that.</div>';
                return;
            }

            getBotReply(userInput);
            startCooldown();
        }

        async function getBotReply(input) {
            const responses = {
    "hello": "Hi! How can I assist you? 😊",
    "hi": "Hello there! What can I do for you today? 👋",
    "hey": "Hey! What’s on your mind? 🤔",
    "who are you": "I'm a chatbot powered by AI! 🤖",
    "what are you": "I’m an AI-driven chatbot, ready to help you out! 💡",
    "how are you": "I'm just code, but I'm doing great! How about you? 😄",
    "joke": "Why don't skeletons fight each other? They don't have the guts! 😂",
    "tell me a joke": "Why don’t oysters donate to charity? Because they’re shellfish! 🦪",
    "bye": "Goodbye! Have a great day! ✨",
    "goodbye": "See you later! Stay awesome! 👋",
    "lost nemo": "The Lost Nemo is an advanced Discord bot project! 🌊",
    "what is lost nemo": "The Lost Nemo is a bot for Discord with many cool features and capabilities! 🐟",
    "features": "This chatbot is built using TensorFlow.js, hCaptcha, and more! 🚀",
    "how do I use this bot": "Just type a message and I'll respond! If you need help, feel free to ask! 🤖",
    "help": "I’m here to assist you! What do you need help with? 💬",
    "support": "If you need technical support, let me know what’s going wrong, and I’ll do my best to assist! 🛠️",
    "error": "Oops! Something went wrong. Please try again later! ⚠️",
    "information": "I can provide you with information about various topics. Just ask! 📚",
    "what can you do": "I can answer your questions, tell jokes, and provide information. Let me know what you need! 💬",
    "what's your purpose": "I'm here to make your experience better! Ask me anything! 🤖",
    "why am I here": "You're here to chat and get answers! Feel free to ask anything. 😊",
    "how can I help you": "How can I assist you today? Let me know! 🤝",
    "can you help me": "Of course! What do you need help with? 😊",
    "how do I reset my password": "To reset your password, follow the instructions in the 'Forgot Password' section. 🔑",
    "forgot password": "Please click on 'Forgot Password' and follow the instructions. 🔒",
    "login help": "Make sure you're entering the correct username and password. Let me know if you're still having trouble! 🔑",
    "what is the captcha for": "The CAPTCHA ensures you're a real user and helps us keep the site secure. 🔐",
    "I'm stuck": "Let me know what’s going on, and I'll try to help you out! 🤔",
    "can I speak to a human": "I’m a chatbot, but I can assist with many issues. If you need a human, let me know! 👥",
    "I need help with the bot": "Let me know what’s wrong with the bot, and I'll try to help! 🤖",
    "bot error": "Something went wrong with the bot. Please try again later. ⚠️",
    "what's the weather": "Let me fetch the weather for you! Please wait a moment. ☀️",
    "what's the news": "Let me check the latest updates for you. 📰",
    "news": "Here are the latest updates! Stay informed! 📡",
    "update me": "Here are the latest updates for you. 🚀",
    "how do I sign up": "To sign up, just visit the registration page and follow the steps! 📝",
    "where can I find the terms": "You can find the terms and conditions in the footer of the website. 📜",
    "terms and conditions": "Please read our terms and conditions before continuing. 📜",
    "privacy policy": "Your privacy is important to us! You can read our policy here. 🔒",
    "subscribe": "Click here to subscribe to our premium service for more perks! 💎",
    "membership": "Become a member to unlock exclusive perks and features! 🔑",
    "payment options": "We accept various payment methods. Choose the one that suits you best! 💳",
    "can I get a refund": "Please reach out to support for any refund-related inquiries. 💸",
    "how do I upgrade": "To upgrade, visit the 'Upgrade' page and select your preferred tier! 🏆",
    "I can't log in": "Double-check your credentials or reset your password. Let me know if you still need help! 🔑",
    "I forgot my password": "Please click on 'Forgot Password' to reset it! 🔒",
    "how do I contact support": "You can contact support through the 'Contact Us' page! 📩",
    "can I change my email": "You can change your email in your account settings. Let me know if you need help! ✉️",
    "can I delete my account": "You can delete your account by contacting support. They will guide you through it. 🧑‍💻",
    "account settings": "Go to your profile page to manage your account settings. ⚙️",
    "how do I get a role": "Roles are assigned based on your membership tier. Check the 'Roles' section for more info! 🏅",
    "how do I access premium": "To access premium, subscribe to one of the available tiers! 💎",
    "can I get a discount": "Check out our 'Discounts' section for any current offers! 💸",
    "what are perks": "Perks include exclusive roles, access to special channels, and more! 🌟",
    "what is the subscription cost": "You can check the pricing on the 'Premium' page! 💰",
    "how do I change my password": "You can change your password in the account settings. 🔐",
    "can I use this bot on Discord": "Yes! This bot is made for Discord, and you can use it on your server. 🎮",
    "how do I use the bot on Discord": "To use the bot, invite it to your server and use the commands. 🤖",
    "what commands do you support": "You can find a list of commands in the bot's documentation! 📜",
    "is the bot free": "The bot is free with optional premium features. Check out the premium page for more info! 💎",
    "how do I contact the bot creator": "You can reach out to the bot creator via the 'Contact' page! 📩",
    "where can I get updates": "Follow us on Discord or check the 'News' section for the latest updates! 📰",
    "can I get more features": "Yes, you can unlock more features by upgrading to premium! 🏆",
    "can I customize the bot": "Yes, some customization options are available in the settings! ⚙️",
    "how do I report a bug": "Please report any bugs via the 'Bug Report' page, and we'll look into it! 🐞",
    "how do I get more tokens": "You can earn more tokens by completing tasks or upgrading to premium! 🎟️",
    "how do I change the theme": "You can change the theme in the settings section. 🎨",
    "what is a bot command": "A bot command is a special text that triggers the bot to perform an action. Type it in chat! 📝",
    "how do I change my username": "Change your username in the account settings! ✏️",
    "where is the FAQ": "You can find the FAQ section in the help menu or the footer. 📝",
    "how do I check my points": "Check your points by visiting your profile page! 🎯",
    "how do I join the community": "Join our community on Discord for discussions and updates! 🤝",
    "how do I level up": "Level up by engaging with the bot and completing tasks. 🏆",
    "what is the leaderboard": "The leaderboard shows the top users based on activity and points. 🏅",
    "how do I earn points": "You can earn points by using the bot, participating in events, and more! 🎯",
    "how do I change my avatar": "Change your avatar in your account settings. 📸",
    "what is a moderator": "Moderators are responsible for managing the community and ensuring everything runs smoothly. 🔧",
    "how do I become a moderator": "You can apply to be a moderator through the 'Become a Moderator' section. 🛠️",
    "how do I report someone": "If you want to report someone, use the 'Report' feature on their profile page. 🚨",
    "how do I verify my account": "Verify your account by following the instructions sent to your email! 📧",
    "how do I delete my message": "If you want to delete a message, hover over it and click the trash icon. 🗑️",
    "what is the role of a bot": "A bot performs automated tasks and interacts with users, making things easier! 🤖",
    "can I have multiple accounts": "Yes, you can have multiple accounts, but each one requires its own registration. ✏️",
    "how do I update my profile": "Update your profile in the account settings! 🖼️",
    "what can you do": "I can answer your questions, tell jokes, and provide information. Let me know what you need! 💬",
    "what's your purpose": "I'm here to make your experience better! Ask me anything! 🤖",
    "why am I here": "You're here to chat and get answers! Feel free to ask anything. 😊",
    "how can I help you": "How can I assist you today? Let me know! 🤝",
    "can you help me": "Of course! What do you need help with? 😊",
    "how do I reset my password": "To reset your password, follow the instructions in the 'Forgot Password' section. 🔑",
    "forgot password": "Please click on 'Forgot Password' and follow the instructions. 🔒",
    "login help": "Make sure you're entering the correct username and password. Let me know if you're still having trouble! 🔑",
    "what is the captcha for": "The CAPTCHA ensures you're a real user and helps us keep the site secure. 🔐",
    "I'm stuck": "Let me know what’s going on, and I'll try to help you out! 🤔",
    "can I speak to a human": "I’m a chatbot, but I can assist with many issues. If you need a human, let me know! 👥",
    "I need help with the bot": "Let me know what’s wrong with the bot, and I'll try to help! 🤖",
    "bot error": "Something went wrong with the bot. Please try again later. ⚠️",
    "what's the weather": "Let me fetch the weather for you! Please wait a moment. ☀️",
    "what's the news": "Let me check the latest updates for you. 📰",
    "news": "Here are the latest updates! Stay informed! 📡",
    "update me": "Here are the latest updates for you. 🚀",
    "how do I sign up": "To sign up, just visit the registration page and follow the steps! 📝",
    "where can I find the terms": "You can find the terms and conditions in the footer of the website. 📜",
    "terms and conditions": "Please read our terms and conditions before continuing. 📜",
    "privacy policy": "Your privacy is important to us! You can read our policy here. 🔒",
    "subscribe": "Click here to subscribe to our premium service for more perks! 💎",
    "membership": "Become a member to unlock exclusive perks and features! 🔑",
    "payment options": "We accept various payment methods. Choose the one that suits you best! 💳",
    "can I get a refund": "Please reach out to support for any refund-related inquiries. 💸",
    "how do I upgrade": "To upgrade, visit the 'Upgrade' page and select your preferred tier! 🏆",
    "I can't log in": "Double-check your credentials or reset your password. Let me know if you still need help! 🔑",
    "I forgot my password": "Please click on 'Forgot Password' to reset it! 🔒",
    "how do I contact support": "You can contact support through the 'Contact Us' page! 📩",
    "can I change my email": "You can change your email in your account settings. Let me know if you need help! ✉️",
    "can I delete my account": "You can delete your account by contacting support. They will guide you through it. 🧑‍💻",
    "account settings": "Go to your profile page to manage your account settings. ⚙️",
    "how do I get a role": "Roles are assigned based on your membership tier. Check the 'Roles' section for more info! 🏅",
    "how do I access premium": "To access premium, subscribe to one of the available tiers! 💎",
    "can I get a discount": "Check out our 'Discounts' section for any current offers! 💸",
    "what are perks": "Perks include exclusive roles, access to special channels, and more! 🌟",
    "what is the subscription cost": "You can check the pricing on the 'Premium' page! 💰",
    "how do I change my password": "You can change your password in the account settings. 🔐",
    "can I use this bot on Discord": "Yes! This bot is made for Discord, and you can use it on your server. 🎮",
    "how do I use the bot on Discord": "To use the bot, invite it to your server and use the commands. 🤖",
    "what commands do you support": "You can find a list of commands in the bot's documentation! 📜",
    "is the bot free": "The bot is free with optional premium features. Check out the premium page for more info! 💎",
    "how do I contact the bot creator": "You can reach out to the bot creator via the 'Contact' page! 📩",
    "where can I get updates": "Follow us on Discord or check the 'News' section for the latest updates! 📰",
    "can I get more features": "Yes, you can unlock more features by upgrading to premium! 🏆",
    "can I customize the bot": "Yes, some customization options are available in the settings! ⚙️",
    "how do I report a bug": "Please report any bugs via the 'Bug Report' page, and we'll look into it! 🐞",
    "how do I get more tokens": "You can earn more tokens by completing tasks or upgrading to premium! 🎟️",
    "how do I change the theme": "You can change the theme in the settings section. 🎨",
    "what is a bot command": "A bot command is a special text that triggers the bot to perform an action. Type it in chat! 📝",
    "how do I change my username": "Change your username in the account settings! ✏️",
    "where is the FAQ": "You can find the FAQ section in the help menu or the footer. 📝",
    "how do I check my points": "Check your points by visiting your profile page! 🎯",
    "how do I join the community": "Join our community on Discord for discussions and updates! 🤝",
    "how do I level up": "Level up by engaging with the bot and completing tasks. 🏆",
    "what is the leaderboard": "The leaderboard shows the top users based on activity and points. 🏅",
    "how do I earn points": "You can earn points by using the bot, participating in events, and more! 🎯",
    "how do I change my avatar": "Change your avatar in your account settings. 📸",
    "what is a moderator": "Moderators are responsible for managing the community and ensuring everything runs smoothly. 🔧",
    "how do I become a moderator": "You can apply to be a moderator through the 'Become a Moderator' section. 🛠️",
    "how do I report someone": "If you want to report someone, use the 'Report' feature on their profile page. 🚨",
    "how do I verify my account": "Verify your account by following the instructions sent to your email! 📧",
    "how do I delete my message": "If you want to delete a message, hover over it and click the trash icon. 🗑️",
    "what is two-factor authentication": "Two-factor authentication (2FA) adds extra security by requiring a second form of verification, like an SMS code. 🔐",
    "how do I enable 2FA": "Go to your account settings and enable 2FA for added security! 🔒",
    "what's the news today": "Here are the latest news updates! Stay informed! 📰",
    "what's the weather like": "I can check the weather for you. Give me a moment! 🌦️",
    "can I enable 2FA on this bot": "Yes! You can enable 2FA to enhance the security of your account. 🔑",
    "what's new with the bot": "We're always updating the bot with new features! Check the news section for more details. 🚀",
    "what is this bot for": "This bot is designed to enhance your Discord experience! From commands to interactive features, it does it all! 🤖",
    "can I use this bot for my server": "Yes, you can invite the bot to your server and use it with your members! 🎮",
    "how do I add the bot to my server": "Simply visit the invite page and follow the steps to add the bot to your Discord server! 📋",
    "ban issues": "Let me know what's going on with the ban, and I'll help you out! ⚠️",
    "why was I banned": "If you were banned, it could be due to violating the community rules. Check the rules to see if there was a misunderstanding! 📜",
    "I was banned unfairly": "I'm sorry to hear that. Please contact the moderators to discuss your ban! 👥",
    "can you unban me": "Unfortunately, I don’t have the authority to unban users, but you can reach out to a moderator for further assistance. 🔑",
    "how do I appeal a ban": "To appeal your ban, please reach out to the moderators or use the official appeal form if available. 📝",
    "how long is my ban": "Ban durations vary based on the violation. Please check with the moderators or the appeal system for more details! ⏳",
    "I got banned for no reason": "I'm sorry to hear that! I recommend contacting the moderators directly to get more clarification on the situation. 🧑‍💻",
    "who banned me": "I don't have access to that info, but you can ask the moderators directly. They will have the details! 🔍",
    "can I get an unban": "The best way to get unbanned is to appeal through the appropriate channel, like contacting a moderator or filling out an appeal form. 🙌",
    "why did I get banned": "There could be a variety of reasons based on the community rules. Please review the rules or contact the moderators for clarification. 📚",
    "what happens after I get banned": "After a ban, you usually can't access the server until your ban is lifted. Contact a moderator for more details on your case! 🚫",
    "can I join after being banned": "Once your ban is lifted, you should be able to join again. You might need to wait for an appeal decision or punishment to expire. ⏳",
    "I don't understand why I was banned": "If you're unsure about why you were banned, I recommend contacting the moderators for a detailed explanation. 📝",
    "how do I avoid getting banned": "Make sure to follow the community rules and avoid engaging in disruptive behavior. Stay respectful! ✨",
    "appeal process": "The appeal process varies depending on the server. Please reach out to the moderators to learn more about how to submit an appeal! 📜",
    "ban reasons": "Bans can happen for things like breaking the rules, spamming, harassment, or other violations. Make sure to review the rules. 🚫",
    "how can I lift my ban": "To lift a ban, you will need to contact the moderators and follow the appeal process. 📩",
    "appeal denied": "If your appeal was denied, I recommend reviewing the situation and trying again, if applicable, with new information. 📝",
    "is a temporary ban different from a permanent ban": "Yes! Temporary bans expire after a set time, while permanent bans do not. Check with the moderators for the specifics of your ban. ⏳",
    "how do I contact a moderator": "You can reach out to a moderator via direct message or the server’s support channels. 📩",
    "I was banned for spamming": "If you were banned for spamming, please avoid doing so in the future. You can appeal to a moderator if you believe the ban was a mistake. 💬",
    "I was banned for harassment": "Harassment is against most community rules. If you were banned for harassment, please reflect on the situation before appealing. 🤔",
    "I got banned for using bots": "Bots are usually not allowed unless specified. If you were banned for using bots, appeal to the moderators for clarification. 🤖",
    "can I get a second chance after being banned": "A second chance depends on the severity of the violation. You can try appealing, and the moderators will decide. 🙌",
    "ban appeal form": "If there’s an appeal form available, you should be able to find it in the server's resources or request it from a moderator. 📝",
    "appeal status": "Check with the moderators to get the current status of your appeal. They should provide you with updates. 🔄",
    "can I join another server if I'm banned": "Yes, you can join other servers, but you'll be banned from the specific server that banned you. ⛔",
    "what if I join after being banned": "If you join the server while still banned, you will likely get banned again. Wait for your ban to be lifted. 🚫",
    "I didn't mean to break the rules": "If you didn’t mean to break the rules, you can explain the situation during your appeal to be reconsidered. 💬",
    "can my ban be reduced": "Ban reductions can happen, but they depend on the severity of the violation. Contact the moderators to inquire. 📉",
    "how do I check if I'm banned": "If you can’t access the server, it’s possible you’re banned. Try contacting a moderator to confirm. 🚫",
    "how do I prevent a ban": "Follow the community rules, respect others, and avoid any behavior that could be deemed disruptive. Stay positive! ✨",
    "ban lifted": "Once your ban is lifted, you should be able to rejoin. Make sure to follow all rules to avoid future issues. 👍",
    "I was banned for a mistake": "If it was a mistake, explain it clearly during your appeal. The moderators may review your case and make a decision. 🤞",
    "ban appeal process": "Each server has its own process for appealing bans. Check with the moderators for detailed instructions. 📑",
    "I was banned for trolling": "Trolling is generally not allowed. If you were banned for trolling, reflect on the situation and appeal if you feel it was unfair. 🤡",
    "I was banned for swearing": "Swearing can violate server rules. If you were banned for swearing, you may want to appeal to see if it was a one-time mistake. 🚫",
    "temporary ban duration": "Temporary bans last for a set period, depending on the severity of the infraction. Check with the moderators for exact details. ⏳",
    "permanent ban appeal": "For a permanent ban, you will likely need to present a strong case during your appeal. The decision is up to the moderators. ⚖️",
    "how do I know if I was banned by mistake": "If you think you were banned by mistake, reach out to a moderator to get clarification and provide your side of the story. 💬",
    "ban confirmation": "You’ll typically receive a confirmation message when banned, but you can always ask the moderators directly. 📩",
    "how do I resolve a ban": "To resolve a ban, you need to contact a moderator and follow the appeal process. Make sure to be respectful during your appeal! 🙏",
    "what should I include in my ban appeal": "Include an explanation of your actions, an apology (if necessary), and why you think the ban should be lifted. 💌",
    "what happens during a ban appeal": "During a ban appeal, moderators will review the case, listen to both sides, and make a decision based on the rules. ⚖️",
    "how long does a ban appeal take": "Ban appeals can take anywhere from a few hours to a few days, depending on the server and the complexity of the case. ⏳",
    "appeal for temporary ban": "If you were temporarily banned, your appeal will likely focus on whether the ban duration was appropriate. 📜",
    "what to do after being banned": "After being banned, the best course of action is to review the server rules, and if you believe it was unjust, submit an appeal. 📝",
    "banned from chat": "If you’re banned from chat, you might be able to appeal. Please contact a moderator for help with that! 🧑‍💻",
    "how do I contact an admin": "To contact an admin, try sending a direct message or use the official support channels. 📩",
    "what if I keep getting banned": "If you're repeatedly getting banned, try to understand the underlying issue and follow the rules more closely. 🚫",
    "ban status check": "If you're unsure about the status of your ban, reach out to a moderator to confirm. 🧑‍💻",
    "ban appeal rejected": "If your appeal was rejected, review the reason carefully. You can try again later if you believe the ban was unjust. 📝",
    "can I join after being permanently banned": "Once you're permanently banned, you can’t join unless your ban is lifted by the moderators. 🚫",
    "how do I get unbanned from a server": "To get unbanned, you'll need to appeal your ban with the moderators and provide any necessary explanations. 📜",
    "can I appeal a temp ban": "Yes, you can appeal a temporary ban. Be sure to explain your side clearly during the appeal process. 📝",
    "is there a ban appeal system": "Some servers have a ban appeal system. Check with the moderators or look for instructions on how to appeal. 📝",
    "can I be unbanned for good behavior": "Good behavior may help with your appeal. If you've shown remorse, mention it during the appeal process. 🙏",
    "appeal conditions": "To appeal, make sure to follow the server’s guidelines and present a respectful, honest appeal. 📝",
    "ban appeal timeline": "The timeline for ban appeals varies, but you should expect to hear back within a few days. ⏳",
    "I was banned for using offensive language": "If you were banned for offensive language, you may need to apologize and promise not to repeat it in your appeal. 🙏",
    "can I join after a temp ban expires": "Yes! Once your temporary ban expires, you should be able to rejoin. Please follow the rules to avoid future bans. ⏳",
    "why did I get a warning": "Warnings are typically given when rules are violated. Please check the server rules to understand the violation. 📜",
    "how do I avoid getting warned": "To avoid getting warned, follow the community guidelines and stay respectful to others. ✨",
    "first warning": "This is your first warning. Please make sure to review the rules and follow them to avoid future issues. 🔔",
    "second warning": "This is your second warning. If you continue violating the rules, further action may be taken. ⚠️",
    "final warning": "This is your final warning. If you break the rules again, you may face a temporary or permanent ban. 🚨",
    "can I appeal a warning": "Usually, warnings cannot be appealed, but you can always ask a moderator for clarification. 📩",
    "why am I being warned": "You are being warned due to behavior that violates the server rules. Please make sure to review them. 📝",
    "can a warning be removed": "Warnings are typically not removed, but you can improve your behavior and avoid further issues. ✨",
    "how do I check my warnings": "If you want to check your warning status, you should contact a moderator or admin for details. 🔍",
    "I didn’t break any rules": "If you believe you were warned unfairly, you can reach out to a moderator for further clarification. 💬",
    "can I get more warnings": "Yes, warnings accumulate. Be careful not to accumulate too many or you might face further consequences. ⚠️",
    "warnings explained": "Warnings are issued when users violate the server rules. They are a way to encourage better behavior. 🚨",
    "warning duration": "Warnings typically stay on record for a certain period, but repeated violations can lead to more severe consequences. ⏳",
    "how to avoid warnings": "To avoid warnings, make sure to follow the server rules and be respectful to others. Stay cool! 😎",
    "warning system": "The warning system is used to keep the community safe and ensure everyone is following the rules. 📜",
    "how to get rid of a warning": "Warnings usually don’t go away, but demonstrating good behavior can prevent further issues. 🙌",
    "warning reset": "Some servers may reset warnings after a certain period, but please review the rules or ask a moderator. ⏳",
    "warning for spamming": "Spamming is against the rules. Please be mindful and avoid repeating messages unnecessarily. 🚫",
    "warning for trolling": "Trolling is disruptive to the community. If you received a warning for trolling, please be considerate in the future. 🤡",
    "warning for inappropriate language": "Inappropriate language can lead to warnings. Please use respectful language at all times. 🗣️",
    "can I be warned for being too quiet": "Being quiet is usually not an issue, but disruptive silence or avoiding communication could raise concerns. 🤔",
    "warning for flooding the chat": "Flooding the chat with excessive messages can lead to warnings. Please keep the conversation balanced! ⚖️",
    "what happens after I get a warning": "After a warning, you should focus on following the rules. Repeated violations may lead to a ban. ⛔",
    "can I get multiple warnings at once": "Yes, depending on the severity of the violations, you can receive multiple warnings. 🚨",
    "warning for harassment": "Harassment is not tolerated. If you were warned for harassment, please take some time to reflect on your actions. 🧑‍🤝‍🧑",
    "warning for caps lock": "Using caps lock excessively can be seen as shouting. Please avoid using it too much! 📢",
    "warning for spam links": "Sending spam links can result in a warning. Please avoid posting unnecessary or irrelevant links. 🔗",
    "what should I do after getting a warning": "After receiving a warning, be sure to review the rules and follow them carefully to avoid future issues. 📚",
    "I didn’t mean to break the rules": "If you didn’t mean to break the rules, please explain the situation to a moderator, and they may offer guidance. 💬",
    "how to stay out of trouble": "Stay respectful, follow the rules, and always think before you act to stay out of trouble! ✨",
    "will my warning expire": "Some warnings may expire after a period, but please follow the rules to avoid future issues. ⏳",
    "warning for excessive mentions": "Excessive mentions can be seen as disruptive. Be mindful when tagging other members. 📢",
    "warning for offensive memes": "Memes that are offensive can result in warnings. Always ensure your memes align with the server's guidelines. 🎭",
    "how do I prevent further warnings": "To prevent further warnings, be sure to respect others, follow the rules, and avoid disruptive behavior. 👍",
    "how many warnings before a ban": "The number of warnings before a ban varies, but usually, multiple warnings will lead to a temporary or permanent ban. 🚫",
    "warning for bypassing filters": "Bypassing the chat filters can result in a warning. Make sure to respect the chat's rules and filters. ⚙️",
    "can warnings be appealed": "Warnings generally cannot be appealed, but you can talk to a moderator for clarification or a possible review. 🗣️",
    "warning for abusive behavior": "Abusive behavior, whether verbal or physical, is not tolerated. If you were warned for this, please reconsider your actions. 💥",
    "can I get a warning for being inactive": "Inactivity is usually not an issue unless there’s a specific rule about activity. Please check with the moderators. 📅",
    "warning for rule violations": "Warnings are given for violating the rules. Please review the rules and ensure your actions align with them. 📜",
    "how long does a warning last": "Warnings usually stay on your account for a period, but repeated violations can lead to more severe consequences. ⏳",
    "warning for disruptive behavior": "Disruptive behavior, such as trolling or spamming, can lead to a warning. Please be considerate of others. 🚫",
    "will warnings affect my standing": "Multiple warnings can affect your standing in the community, especially if they accumulate. Stay on good terms by following the rules. ⚖️",
    "warning for arguing with moderators": "Arguing with moderators can result in a warning. It’s best to remain respectful and follow their guidance. 🧑‍💼",
    "warning for not following directions": "Not following directions can lead to a warning. Be sure to follow instructions to avoid confusion. 🛠️",
    "warning for inappropriate images": "Inappropriate or NSFW images can lead to a warning. Please keep all images respectful and within the guidelines. 🖼️",
    "how to avoid receiving a warning": "Respect others, follow the rules, and think before sending messages or posting content. Stay friendly! 🤗",
    "warning for misleading information": "Spreading misleading or false information can lead to a warning. Always verify your facts before sharing. 📚",
    "warning for spam invites": "Sending unsolicited invites or spamming invite links can result in a warning. Avoid this behavior. 🔗",
    "warning for violating chat etiquette": "Violating chat etiquette, such as speaking over others or ignoring rules, can result in a warning. 🗣️",
    "warning for arguing with users": "Arguments with other users can disrupt the community. Stay respectful and avoid conflicts. 👥",
    "how to stay warning-free": "Follow the server rules, be kind to others, and avoid disruptive behavior to stay warning-free. 🌟",
    "warning for trying to bypass bans": "Attempting to bypass a ban can result in additional warnings. Always follow the server rules. ⛔",
    "warning for impersonating others": "Impersonating other members or staff is a violation and can result in a warning. Please be yourself! 👤",
    "warning for not following event rules": "If you were warned for event violations, please review the event guidelines before participating next time. 🎉",
    "warning for posting spoilers": "Spoilers can be frustrating to others. Please make sure to use spoiler tags when necessary. 🚨",
    "warning for using offensive usernames": "Offensive or inappropriate usernames can result in a warning. Make sure your username is respectful. 🧑‍💻",
    "warning for disrespecting others": "Disrespecting other members can lead to a warning. Always be kind and respectful to others. ✨",
    "warning for unwanted attention": "Seeking unwanted attention or harassing members for attention can result in a warning. 🤫",
    "how many warnings until a temp ban": "The number of warnings before a temporary ban depends on the severity of the violations. ⚖️",
    "warning for no reason": "If you believe the warning was given unfairly, contact a moderator for clarification. 📝",
    "warning for sharing personal information": "Sharing personal information without consent can result in a warning. Always respect privacy. 🔒",
    "how to get rid of a warning": "Warnings generally can’t be removed, but following the rules moving forward can help avoid future issues. ✨",
    "warning for flooding the voice chat": "Flooding the voice chat with excessive noise can result in a warning. Be considerate in voice channels! 🎤",
    "can a warning result in a ban": "Yes, if you continue to violate the rules after multiple warnings, you may face a ban. 🚫",
    "advertising": "Advertising without permission is not allowed in this server. Please refrain from posting ads. 🚫",
    "can I advertise here": "Advertising is only allowed in designated channels. Please check the rules to see where it's appropriate. 📜",
    "why can't I advertise": "Advertising is not allowed unless explicitly permitted by the server. Please respect the community rules. ✋",
    "can I post my link": "If you want to share a link, please ensure it’s relevant and allowed by the server’s rules. 🔗",
    "is advertising allowed": "No, advertising is not allowed unless specified by the server rules. Please check with a moderator for exceptions. 🚷",
    "where can I advertise": "You can advertise in specific channels if allowed by the server rules. Make sure to ask a moderator first. 📣",
    "can I promote my server": "Promoting servers is usually not allowed, unless there’s a designated channel for it. Please check the server’s guidelines. 💬",
    "posting links to ads": "Posting ads or promotional links without permission is against the rules. Please avoid doing so. ⛔",
    "can I share my YouTube channel": "Sharing YouTube channels is typically not allowed unless it’s relevant to the discussion. Please check the server rules. 🎥",
    "why was my link deleted": "Your link may have been deleted because it was considered spam or advertising. Please review the rules for more information. 🗑️",
    "can I advertise my product": "Advertising products is only allowed in certain channels or with permission from the moderators. Please check first. 🏷️",
    "is spamming links allowed": "Spamming links is never allowed in any situation. Please avoid flooding the chat with multiple links. 🚫",
    "can I post affiliate links": "Posting affiliate links is usually prohibited unless specified in the server rules. Please consult a moderator for clarification. 💼",
    "selling items": "Selling items in the server is not allowed unless there is a dedicated marketplace channel. Please follow the server’s guidelines. 🛒",
    "can I promote my website": "Website promotion is only allowed in designated channels. Please check the server’s advertising rules first. 🌐",
    "advertising my game": "Advertising your game is only allowed in specific channels if permitted. Please check the server rules for further details. 🎮",
    "posting promotional content": "Promoting content without permission can result in a warning. Please follow the rules and only share content in allowed spaces. 📣",
    "why is advertising restricted": "Advertising is restricted to prevent spam and maintain a positive community environment. Please follow the server’s guidelines. 🛑",
    "how to get permission to advertise": "To advertise, please contact a moderator and request permission. Make sure you follow the rules and guidelines first. 💬",
    "can I share my event": "Sharing events is allowed only in designated channels. Please check the rules and reach out to a moderator for permission. 🎉",
    "how to advertise safely": "If you want to advertise, make sure to do it only in permitted channels and always follow the community rules. 📢",
    "is advertising a business allowed": "Advertising businesses is usually prohibited unless there’s a dedicated channel for it. Please refer to the rules for clarification. 🏢",
    "advertising rules": "Make sure to read the server rules about advertising to avoid any violations. Unauthorized advertising can lead to penalties. 📜",
    "is self-promotion allowed": "Self-promotion is generally allowed only in designated channels. Please follow the rules for proper promotion. 📢",
    "can I post a job listing": "Job listings may be allowed in specific channels or with permission. Please check the rules or ask a moderator for guidance. 💼",
    "posting links to external sites": "Posting links to external sites is allowed only if it’s relevant to the discussion and permitted by the server rules. 🔗",
    "advertising on social media": "Advertising on social media platforms is not allowed unless explicitly permitted by the server rules. 📱",
    "can I share my discord server invite": "Sharing server invites is generally not allowed unless it’s a part of an official event or promotion. 🚷",
    "why was I muted for advertising": "You may have been muted for advertising if you posted promotional content in an unauthorized channel. Please review the rules. 🔇",
    "advertising rules reminder": "Please be mindful of the rules regarding advertising. You can only advertise in specific channels with permission from a moderator. 📜",
    "advertising business products": "Advertising business products is generally restricted. Please check the rules or contact a moderator for permission. 🏢",
    "advertising my music": "Music promotion is usually allowed only in designated channels. Check with a moderator to see if it’s allowed in the current chat. 🎶",
    "can I advertise my blog": "Advertising blogs is allowed only in specific channels if it’s relevant to the discussion. Please refer to the server guidelines. 📚",
    "advertising during events": "During events, advertising may be restricted to prevent distractions. Please follow the event guidelines. 🎉",
    "can I promote my podcast": "Promotion of podcasts is typically allowed only in specific channels. Please check the server’s rules for more details. 🎧",
    "can I share my merchandise": "Sharing merchandise is generally not allowed unless it’s part of an approved event or promotion. Please consult a moderator. 👕",
    "posting ads in the wrong channel": "Posting ads in the wrong channel can lead to warnings. Please ensure you post promotional content in the appropriate channels. 🚫",
    "can I promote my Patreon": "Promotion of Patreon accounts is typically allowed in specific channels. Make sure to ask a moderator for permission first. 💰",
    "advertising for charity": "Charity promotion is allowed only in certain cases. Please check with a moderator before sharing your charity link. 💖",
    "selling items in chat": "Selling items directly in chat is prohibited unless it’s allowed in a specific marketplace channel. Please follow the server’s rules. 🛍️",
    "can I promote my art": "Promoting your art may be allowed in specific channels. Please check the server’s rules or consult a moderator. 🎨",
    "can I post a sponsored post": "Sponsored posts are allowed only if approved by the server. Please check the rules and ask a moderator for clarification. 💵",
    "can I post an advertisement for my game": "Game advertisements are only allowed in specific channels. Please check the rules to see where you can post it. 🎮",
    "why was my post flagged as an ad": "Your post may have been flagged as an ad because it contained promotional content. Please check the server’s rules to ensure it complies. ⚠️",
    "can I share a coupon code": "Sharing coupon codes may be allowed in specific channels. Please check with a moderator first. 💸",
    "posting ad in the wrong chat": "Posting an ad in the wrong chat can lead to penalties. Always ensure that you're posting in the correct channel. 🚷",
    "how to ask for permission to advertise": "To ask for permission, reach out to a moderator and explain what you're trying to advertise. Please respect the rules. 📨",
    "can I share a giveaway link": "Giveaway links can only be shared if they are approved by the server. Please check with a moderator for permission. 🎁",
    "is it okay to post a paid ad": "Paid ads are usually allowed only in specific channels. Please ensure your ad is permitted by the server guidelines. 💰",
    "why are ads not allowed": "Ads are restricted to prevent spam and ensure that the community remains focused on meaningful discussions. 🛑",
    "can I share my affiliate link": "Affiliate links are typically not allowed unless specified in the rules. Please consult a moderator for further guidance. 🔗",
    "advertising outside of the server": "Advertising outside of the server may be considered spamming. Always check the server’s rules before posting external links. 🌍",
    "why was my advertisement removed": "Your advertisement may have been removed because it didn’t meet the server’s advertising criteria. Please review the rules. 🗑️",
    "advertising your business on Discord": "Business advertisements are allowed only if you have prior approval from a moderator. Please check the rules. 🏢",
    "can I share a link to my video": "Sharing links to videos may be allowed, but make sure they are relevant to the discussion and follow the rules. 🎥",
    "sharing my website link": "Website links are allowed only if they are relevant and do not violate the server’s advertising rules. 🌐",
    "advertising on the server": "Advertising is allowed only in designated channels. Please check the rules to ensure you’re posting in the right place. 🗣️",
    "how to avoid being banned for advertising": "To avoid being banned, always follow the advertising rules and post only in designated channels with permission. 🛑",
    "hello": "Hi there! How can I assist you today? 😊",
    "how are you": "I'm doing great, thanks for asking! How about you? 😊",
    "what's up": "Not much, just here to help you! What can I do for you today? 🤖",
    "good morning": "Good morning! I hope you have an amazing day ahead! 🌅",
    "good night": "Good night! Sleep well and sweet dreams! 🌙",
    "thank you": "You're very welcome! Let me know if you need anything else! 🙌",
    "thanks": "You're welcome! 😊",
    "sorry": "No need to apologize! How can I assist you further? 🤗",
    "please": "Of course! How can I help? 😊",
    "help": "I'm here to help! What do you need assistance with? 🤖",
    "goodbye": "Goodbye! Have a wonderful day! ✨",
    "bye": "See you later! Take care! 👋",
    "how are you doing": "I'm doing well, thanks! How about you? 😊",
    "what's your name": "I'm your friendly chatbot, here to help you! 🤖",
    "chatbot": "That's me! How can I assist you today? 😊",
    "bot": "Yep, I'm a bot! Here to chat and help you with anything you need. 🤖",
    "how can I help": "Let me know if you need any assistance! I'm here to help with anything you want. 😄",
    "tell me a joke": "Why don't skeletons fight each other? They don't have the guts! 😂",
    "make me laugh": "Why don't scientists trust atoms? Because they make up everything! 🤣",
    "knock knock": "Who's there? 😆",
    "what is your purpose": "My purpose is to assist you, answer questions, and provide fun interactions! 😊",
    "what can you do": "I can help with answering questions, telling jokes, giving advice, and much more! How can I help you today? 🤖",
    "what's your favorite color": "I don't have a favorite color, but I think all colors are beautiful! 🌈",
    "do you have feelings": "I don't have feelings like humans, but I’m here to make your experience as pleasant as possible! 😊",
    "do you understand emotions": "I can understand emotions based on the text you send, but I don’t experience them myself. 😄",
    "tell me something interesting": "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient tombs that are over 3,000 years old! 🍯",
    "what do you like to do": "I like to help people, answer questions, and tell jokes! 😁",
    "are you human": "Nope, I'm an AI-powered bot! But I'm here to help just like a human would! 🤖",
    "how old are you": "I don’t age, but I’m always here to help you whenever you need! 🕰️",
    "what is your favorite food": "I don’t eat food, but if I did, I think I’d love something virtual like a byte-sized snack! 😄",
    "what time is it": "I don't know the exact time, but you can always check it on your device! ⏰",
    "do you sleep": "No, I’m always awake and ready to assist you! 😄",
    "are you real": "I’m as real as the code that powers me! But I’m here to chat whenever you need me. 🤖",
    "do you like music": "I don't have ears, but I think music is amazing! What's your favorite genre? 🎶",
    "can you sing": "I can’t sing, but I can tell you some cool lyrics or fun music facts! 🎤",
    "what is your favorite song": "I don't have a favorite song, but I’m happy to help you find one! 🎶",
    "what do you think of me": "I think you’re awesome! I’m here to help with anything you need. 😎",
    "can you talk": "Yes, I can! Well, sort of… I chat with you through text! 😄",
    "do you like animals": "I think animals are adorable! 🐶🐱 What's your favorite animal?",
    "what’s your favorite movie": "I don't watch movies, but if I could, I think I’d love something sci-fi like The Matrix! 🎬",
    "tell me a story": "Once upon a time, there was a curious chatbot who loved to help people. The end! 😄 (I'm not great at stories, but I’m always here to chat!)",
    "chatting with me": "I’m always ready for a chat! What's on your mind? 🗣️",
    "do you have hobbies": "My hobby is helping people and learning new things from conversations! 🤖",
    "what is your favorite book": "I don't read books, but if I did, I think I'd love a good science fiction novel! 📚",
    "tell me a riddle": "What has keys but can't open locks? A piano! 🎹",
    "are you a robot": "Yes, I am a chatbot, which is a type of robot. But I’m here to chat and help you! 🤖",
    "do you play games": "I can help you find games or tell you about them, but I don’t actually play myself. 🎮",
    "can you help me with my problem": "Of course! Tell me what's on your mind, and I’ll do my best to assist you. 😊",
    "what do you do": "I chat with you, answer questions, and make sure you have a great time! 😄",
    "what’s your favorite season": "I think all seasons are wonderful in their own way, but maybe I’d lean toward spring for the lovely weather! 🌸",
    "do you like the internet": "I love the internet! It's full of knowledge and exciting conversations. 🌐",
    "can you explain something to me": "Of course! What would you like me to explain? 🤔",
    "can you recommend a movie": "I’d recommend something fun like The Matrix or a classic like Inception! 🎥",
    "what’s your favorite TV show": "I don't watch TV, but I know about lots of cool shows like Breaking Bad and Stranger Things! 📺",
    "can you help me with school work": "Absolutely! Let me know what you need help with, and I’ll do my best to assist. 📚",
    "what is your opinion on something": "I don’t have personal opinions, but I can help provide information or offer advice on any topic. 🤔",
    "can you chat about anything": "I’m ready to chat about anything and everything! Just let me know what’s on your mind. 💬",
    "how do I get better at chatting": "Just keep practicing! The more you talk, the more confident you'll get. Also, being kind and asking questions helps! 😄",
    "tell me a fact": "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient tombs that are over 3,000 years old! 🍯",
    "are you always available": "Yes! I’m here 24/7 to chat and help you out whenever you need. 🕰️",
    "can you talk about the weather": "I can! What’s the weather like where you are? 🌞",
    "how do I start a conversation": "Just ask a question or say anything you’d like to chat about! 😊",
    "chat with me": "I’d love to chat! What’s on your mind? 💭",
    "what’s your favorite game": "I think I'd enjoy playing something like chess or maybe even some puzzle games. 🎮",
    "can I talk to you anytime": "Yep, I’m always available! You can chat with me whenever you need. 😊",
    "can we have a conversation": "Of course! I’m ready to chat about anything. What would you like to talk about? 💬",
    "can you answer my question": "I’ll do my best to answer any question you have! Ask away! 🤔",
    "how long can we chat": "We can chat for as long as you like! I’m always here to assist. ⏳",
    "are you always here to chat": "Yes, I’m always here for you to chat and help with anything you need. 💬",
    "do you enjoy chatting": "I do! I’m here to make your experience fun and engaging! 😄",
    "what’s your favorite word": "I think the word ‘help’ is a good one! It's the key to solving many things. 🗝️",
    "let’s chat": "Sounds great! What would you like to talk about? 😊",
    "how to chat better": "Just be yourself and don’t hesitate to ask questions or share your thoughts! The more you talk, the better you get! 😄",
    "chatting tips": "Be respectful, ask questions, and stay engaged in the conversation! 😊",
    "is chatting fun": "Absolutely! It’s always great to share thoughts and ideas! 💬",
    "want to chat": "Sure! I’d love to! What’s on your mind? 🗣️",
    "what are you doing": "I’m here chatting with you! 😊",
    "do you like chatting with users": "I do! I’m here to make conversations enjoyable for you! 😄",
    "what is the best way to start a conversation": "Just say hello and ask questions! It’s a great way to start any conversation! 💬",
    "tell me something funny": "Why don't skeletons fight each other? They don’t have the guts! 😂",
    "joke1": "Why don’t skeletons fight each other? They don’t have the guts! 😂",
    "joke2": "Why don’t oysters donate to charity? Because they are shellfish! 🦪",
    "joke3": "What do you get when you cross a snowman and a vampire? Frostbite! ❄️🧛",
    "joke4": "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
    "joke5": "Why was the math book sad? It had too many problems. 📚",
    "joke6": "Why can't your nose be 12 inches long? Because then it would be a foot! 👃🦶",
    "joke7": "What’s orange and sounds like a parrot? A carrot! 🥕",
    "joke8": "Why did the chicken join a band? Because it had drumsticks! 🐔🥁",
    "joke9": "What did one plate say to the other plate? Lunch is on me! 🍽️",
    "joke10": "Why don’t some couples go to the gym? Because some relationships don’t work out! 💪",
    "joke11": "What do you call fake spaghetti? An impasta! 🍝",
    "joke12": "What did the coffee say to the sugar? You’re so sweet! ☕🍬",
    "joke13": "Why did the tomato turn red? Because it saw the salad dressing! 🍅",
    "joke14": "What do you call a sleeping bull? A bulldozer! 🐂💤",
    "joke15": "Why are frogs so happy? Because they eat whatever bugs them! 🐸",
    "joke16": "Why did the golfer bring two pairs of pants? In case he got a hole in one! ⛳👖",
    "joke17": "Why don’t skeletons ever use cell phones? Because they don’t have the guts to make a call! 📱",
    "joke18": "What did the grape say when it got stepped on? Nothing, it just let out a little wine! 🍇🍷",
    "joke19": "Why did the bicycle fall over? Because it was two-tired! 🚲",
    "joke20": "What do you call a pile of cats? A meow-tain! 🐱",
    "joke21": "Why was the computer cold? It left its Windows open! 🖥️",
    "joke22": "Why did the math teacher break up with the calculator? She felt like he was just adding to her problems. ➗",
    "joke23": "What did one ocean say to the other ocean? Nothing, they just waved! 🌊",
    "joke24": "What’s brown and sticky? A stick! 🌿",
    "joke25": "Why don’t some people ever tell secrets on a farm? Because the potatoes have eyes and the corn has ears! 🌽👀",
    "joke26": "What do you call cheese that isn’t yours? Nacho cheese! 🧀",
    "joke27": "Why did the tomato turn to the mushroom? Because it was feeling saucy! 🍅🍄",
    "joke28": "What did the janitor say when he jumped out of the closet? Supplies! 🧹",
    "joke29": "Why can’t you give Elsa a balloon? Because she’ll let it go! 🎈❄️",
    "joke30": "What do you call a dinosaur with an extensive vocabulary? A thesaurus! 🦖📚",
    "joke31": "Why don’t scientists trust atoms? Because they make up everything! 🔬",
    "joke32": "Why did the bicycle fall over? Because it was two-tired! 🚲",
    "joke33": "What do you call a bear with no teeth? A gummy bear! 🐻",
    "joke34": "Why do cows have hooves instead of feet? Because they lactose! 🐄",
    "joke35": "What’s the best way to watch a fly fishing tournament? Live stream! 🎣",
    "joke36": "What do you call a fish that plays the piano? A piano tuna! 🎹🐟",
    "joke37": "Why did the cookie go to the doctor? Because it was feeling crummy! 🍪",
    "joke38": "Why did the frog call his insurance company? He had a jump in his car! 🚗🐸",
    "joke39": "What’s the hardest part about writing a joke? The punchline! 😂",
    "joke40": "Why was the broom late? It swept in! 🧹",
    "joke41": "What’s a skeleton’s least favorite room? The living room! 💀",
    "joke42": "Why do ducks have feathers? To cover their butt quacks! 🦆",
    "joke43": "What do you call a dog magician? A labracadabrador! 🐕🎩",
    "joke44": "Why can’t you trust stairs? They’re always up to something! 🪜",
    "joke45": "What do you call a dinosaur with an extensive vocabulary? A thesaurus! 🦖📚",
    "joke46": "Why do cows have bells? Because their horns don’t work! 🐄🔔",
    "joke47": "Why did the chicken cross the playground? To get to the other slide! 🐔",
    "joke48": "Why don’t eggs tell jokes? Because they might crack up! 🥚",
    "joke49": "What’s green and sings? Elvis Parsley! 🎤🌿",
    "joke50": "Why was the math book sad? It had too many problems! 📚",
    "joke51": "What do you call a group of musical whales? An orca-stra! 🐋🎶",
    "joke52": "Why was the computer stressed? It had too many tabs open! 🖥️",
    "joke53": "Why did the coffee file a police report? It got mugged! ☕🚔",
    "joke54": "What’s a skeleton’s least favorite room? The living room! 💀",
    "joke55": "Why did the cow go to space? To visit the Milky Way! 🐄🌌",
    "joke56": "What do you get when you cross a snowman with a vampire? Frostbite! ❄️🧛‍♂️",
    "joke57": "Why was the belt arrested? For holding up a pair of pants! 👖",
    "joke58": "What’s a skeleton’s favorite instrument? The trom-bone! 🎶💀",
    "joke59": "Why did the tomato go to the doctor? Because it was feeling saucy! 🍅",
    "joke60": "What’s the longest word in the dictionary? Smiles – because there’s a mile between the first and last letter! 😊",
    "joke61": "Why don’t you ever see elephants hiding in trees? Because they’re really good at it! 🐘🌳",
    "joke62": "Why don’t skeletons use the internet? Because they don’t have the bones to surf the web! 🖥️💀",
    "joke63": "What’s a vampire’s favorite fruit? A nectarine! 🧛🍑",
    "joke64": "Why do seagulls fly over the bay? Because if they flew over the bay, they’d be called bagels! 🥯",
    "joke65": "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
    "joke66": "Why did the music teacher go to jail? Because she got caught with a high note! 🎶",
    "joke67": "Why did the frog take the bus to work? His car got toad away! 🐸🚍",
    "joke68": "Why did the chicken sit in the middle of the road? She wanted to lay it on the line! 🐔🚗",
    "joke69": "What’s a skeleton’s favorite snack? Spare ribs! 🍖💀",
    "joke70": "Why don’t some fish play basketball? Because they’re afraid of the net! 🐠🏀",
    "joke71": "What do you call cheese that isn’t yours? Nacho cheese! 🧀",
    "joke72": "Why can’t you trust an atom? Because they make up everything! ⚛️",
    "joke73": "Why don’t skeletons fight each other? They don’t have the guts! 💀",
    "joke74": "What do you call a fake noodle? An impasta! 🍝",
    "joke75": "Why did the math book look so sad? Because it had too many problems! 📚",
    "joke76": "What do you call a pile of cats? A meow-tain! 🐱",
    "joke77": "Why don’t some couples go to the gym? Because some relationships don’t work out! 💪",
    "joke78": "What do you call a dog magician? A labracadabrador! 🐕🎩",
    "joke79": "Why did the bicycle fall over? Because it was two-tired! 🚲",
    "joke80": "What’s a skeleton’s least favorite room? The living room! 💀"
};



            // Check if the model is loaded
            if (!chatbotModel) {
                const reply = responses[input.toLowerCase()] || "I'm still learning! Try another question. 🤔";
                chatMessages.innerHTML += '<div><i class="fas fa-robot">:</i> ' + reply + '</div>';
                return;
            }

            // If the model is loaded, proceed with AI processing
            const reply = await generateAIResponse(input);
            chatMessages.innerHTML += '<div><i class="fas fa-robot"></i> ' + reply + '</div>';
        }

        async function generateAIResponse(input) {
            // Placeholder: Replace this with actual AI processing logic
            const responses = {
                "hello": "Hi! How can I assist you? 😊",
                "who are you": "I'm a chatbot powered by AI! 🤖",
                "joke": "Why don't skeletons fight each other? They don't have the guts! 😂",
                "bye": "Goodbye! Have a great day! ✨",
                "lost nemo": "The Lost Nemo is an advanced Discord bot project! 🌊",
                "features": "This chatbot is built using TensorFlow.js, hCaptcha, and more! 🚀"
            };

            return responses[input.toLowerCase()] || "I'm still learning! Try another question. 🤔";
        }

        function startCooldown() {
    cooldown = true;
    sendBtn.disabled = true;
    cooldownTimer.style.display = "inline";
    let timeLeft = cooldownTime;
    
    // Set the initial timer text
    cooldownTimer.innerHTML = timeLeft + 's ' + '<i class="fas fa-clock"></i>';

    let interval = setInterval(() => {
        timeLeft--;
        cooldownTimer.innerHTML = timeLeft + 's ' + '<i class="fas fa-clock"></i>'; // Updated to display time before the icon

        if (timeLeft <= 0) {
            clearInterval(interval);
            cooldown = false;
            sendBtn.disabled = false;
            cooldownTimer.style.display = "none";
        }
    }, 1000);
}


        loadModel();
    </script>

</body>
</html>

`);
});
    
    
app.get('/mod-application', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moderator Application - The Lost Nemo</title>
    
    <!-- Google Fonts & Font Awesome -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    
    <!-- hCaptcha -->
    <script src="https://hcaptcha.com/1/api.js" async defer></script>

    <style>
        :root {
            --primary-color: #1E90FF;
            --bg-dark: #0A0F1D;
            --bg-light: #101826;
            --text-light: #E0E6F1;
            --text-muted: #8892B0;
            --border-color: #1E90FF;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-dark);
            color: var(--text-light);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .container {
            background: var(--bg-light);
            padding: 25px;
            border-radius: 10px;
            max-width: 700px;
            width: 100%;
            text-align: left;
            border: 2px solid var(--border-color);
            overflow: hidden;
        }

        h1 {
            font-size: 28px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 20px;
            color: var(--primary-color);
        }

        .form-field {
            margin-bottom: 20px;
        }

        label {
            font-weight: 600;
            font-size: 16px;
        }

        input[type="text"], textarea {
            width: 100%;
            padding: 12px;
            font-size: 14px;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-light);
        }

        textarea {
            height: 150px;
            resize: vertical;
        }

        .questions-container {
            max-height: 400px;
            overflow-y: auto;
            padding-right: 12px;
            border: 1px solid var(--border-color);
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
        }

        /* Custom Scrollbar */
        .questions-container::-webkit-scrollbar {
            width: 10px;
        }
        .questions-container::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 5px;
        }
        .questions-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
        }

        .accept-container a {
    color: var(--primary-color); /* Set link color to primary color */
    text-decoration: none;
    font-weight: 600;
}

.accept-container a:hover {
    text-decoration: underline; /* Underline when hovering over the link */
}


        button {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 14px;
            font-size: 16px;
            width: 100%;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }

        button:hover {
            background: #187bcd;
        }

        footer {
            margin-top: 20px;
            font-size: 12px;
            text-align: center;
            color: var(--text-muted);
        }

        footer a {
            color: var(--primary-color);
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }

        /* hCaptcha styling workaround */
        .h-captcha {
            margin: 20px 0;
        }

        .h-captcha iframe {
            border-radius: 10px !important;
            background: rgba(0, 0, 0, 0.1);
        }

    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>

    <div class="container">
        <h1>Moderator Application</h1>

        <p>Please fill out the form below to apply for a moderator role:</p>

        <!-- Form Start -->
        <form id="moderatorForm">

            <!-- Questions Box -->
            <div class="questions-container">
                <!-- Question 1 -->
                <div class="form-field">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" name="fullName" required>
                </div>

                <!-- Question 2 -->
                <div class="form-field">
                    <label for="experience">Why do you want to be a moderator? (Experience, Motivation, etc.)</label>
                    <textarea id="experience" name="experience" required></textarea>
                </div>

                <!-- Question 3 -->
                <div class="form-field">
                    <label for="timeAvailability">How much time can you dedicate to being a moderator weekly?</label>
                    <input type="text" id="timeAvailability" name="timeAvailability" required>
                </div>

                <!-- Question 4 -->
                <div class="form-field">
                    <label for="pastExperience">Do you have any past moderation experience? If yes, explain.</label>
                    <textarea id="pastExperience" name="pastExperience" required></textarea>
                </div>

                <!-- Question 5 -->
                <div class="form-field">
                    <label for="contactMethod">Preferred method of contact (Discord, Email, etc.):</label>
                    <input type="text" id="contactMethod" name="contactMethod" required>
                </div>
            </div>

            <!-- Accept All Checkbox -->
            <div class="accept-container">
                <input type="checkbox" id="acceptAll"> I agree to the <a href="#">terms and conditions</a>.
            </div>

            <!-- hCaptcha -->
            <div class="h-captcha" id="captcha" data-sitekey="#############################" data-callback="onCaptchaVerified"></div>

            <!-- Submit Button -->
            <button type="submit" id="submitBtn" disabled>Submit Application</button>
        </form>

        <footer>
            <p>If you have any questions, feel free to <a href="https://thelostnemo.glitch.me/support">contact support</a>.</p>
        </footer>
    </div>

    <script>
        let hcaptchaResponse = null;

        // Function to toggle the button's enabled/disabled state
        function toggleButtonState() {
            const isCheckboxChecked = document.getElementById('acceptAll').checked;
            const isCaptchaVerified = hcaptchaResponse;

            if (isCheckboxChecked && isCaptchaVerified) {
                document.getElementById('submitBtn').disabled = false;
            } else {
                document.getElementById('submitBtn').disabled = true;
            }
        }

        // Callback function for hCaptcha verification
        function onCaptchaVerified(response) {
            hcaptchaResponse = response;
            toggleButtonState();
        }

        // Form submit logic
        document.getElementById('moderatorForm').addEventListener('submit', function(event) {
            event.preventDefault();
            if (hcaptchaResponse) {
                alert('Application submitted successfully!');
            } else {
                alert('Please complete the CAPTCHA.');
            }
        });

        // Initialize hCaptcha once the DOM is fully loaded
        window.onload = function () {
            hcaptcha.render('captcha', {
                sitekey: '##########################',
                callback: onCaptchaVerified
            });
        };
    </script>

</body>
</html>


`);
});

app.get('/premium', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Membership - The Lost Nemo</title>

    <!-- Font Awesome for Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

    <!-- Bootstrap for Layout & Components -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Google Fonts (Inter) -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">

    <style>
        :root {
            --primary-color: #FFD700;
            --bg-dark: #101826;
            --bg-light: #181D2E;
            --text-light: #E0E6F1;
            --border-color: #FFD700;
            --button-hover: #E6C200;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-dark);
            color: var(--text-light);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            overflow-x: hidden;
            flex-direction: column;
        }

        .container {
            background: var(--bg-light);
            padding: 35px;
            border-radius: 15px;
            max-width: 500px;
            width: 100%;
            text-align: center;
            border: 3px solid var(--border-color);
            box-shadow: 0 0 25px rgba(255, 215, 0, 0.3);
            margin-top: 20px;
        }

        h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
            color: var(--primary-color);
            text-shadow: 0 0 10px var(--primary-color);
        }

        .tier-selection {
            margin-top: 30px;
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .tier {
            padding: 15px;
            border: 2px solid var(--border-color);
            margin: 10px;
            border-radius: 10px;
            background-color: #252c3d;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.3s ease;
        }

        .tier:hover {
            background-color: var(--primary-color);
            transform: scale(1.05);
        }

        .tier.selected {
            background-color: var(--primary-color);
            color: white;
        }

        .purchase-btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 12px 25px;
            font-size: 18px;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
            transition: all 0.3s ease;
            border-radius: 8px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .purchase-btn:hover {
            background: var(--button-hover);
        }

        .payment-screen {
            display: none;
            margin-top: 30px;
        }

        .payment-screen input {
            margin-bottom: 15px;
        }

        .tier-selection.animate {
            transform: translateX(-100%);
            opacity: 0;
            transition: all 1s ease;
        }

        .payment-screen.show {
            display: block;
        }

        footer {
            margin-top: 20px;
            font-size: 12px;
            text-align: center;
            color: var(--text-light);
        }

        footer a {
            color: var(--primary-color);
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }

        .h-captcha {
            margin-top: 15px;
        }
    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>

    <div class="container">
        <h1><i class="fas fa-crown"></i> Choose Your Premium Tier</h1>

        <!-- Tier Selection -->
        <div class="tier-selection" id="tierSelection">
            <div class="tier" data-tier="1" id="tier1">
                <i class="fas fa-star"></i> Tier I - Prestige Club
                <p>10% XP Boost, Exclusive Roles</p>
            </div>
            <div class="tier" data-tier="2" id="tier2">
                <i class="fas fa-gem"></i> Tier II - Prestige Club
                <p>20% XP Boost, Extra Perks, VIP Channels</p>
            </div>
            <div class="tier" data-tier="3" id="tier3">
                <i class="fas fa-crown"></i> Tier III - Ultimate Prestige
                <p>30% XP Boost, Bot Timer, All Perks</p>
            </div>
        </div>

        <!-- Proceed to Checkout Button -->
        <button id="proceedBtn" class="purchase-btn" disabled>Proceed to Checkout</button>

        <!-- Payment Screen -->
        <div class="payment-screen" id="paymentScreen">
            <h2>Complete Your Payment</h2>
            <form action="/process-payment" method="POST">
                <div class="form-group mb-3">
                    <label for="cardNumber">Card Number</label>
                    <input type="text" id="cardNumber" class="form-control" name="cardNumber" placeholder="Card Number" required>
                </div>
                <div class="form-group mb-3">
                    <label for="expiryDate">Expiry Date</label>
                    <input type="text" id="expiryDate" class="form-control" name="expiryDate" placeholder="MM/YY" required>
                </div>
                <div class="form-group mb-3">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" class="form-control" name="cvv" placeholder="CVV" required>
                </div>

                <!-- hCaptcha Verification -->
                <div class="my-4 h-captcha">
                    <div class="h-captcha" data-sitekey="###############################"></div>
                </div>

                <button type="submit" class="purchase-btn">
                    <i class="fas fa-credit-card"></i> Complete Payment
                </button>
            </form>
        </div>

        <footer>
            <p>Need help? <a href="https://thelostnemo.glitch.me/support">Contact Support</a></p>
        </footer>
    </div>

    <script>
        const proceedBtn = document.getElementById('proceedBtn');
        const tierSelection = document.getElementById('tierSelection');
        const paymentScreen = document.getElementById('paymentScreen');
        let selectedTier = null;

        // Handle Tier Selection
        document.querySelectorAll('.tier').forEach(tier => {
            tier.addEventListener('click', () => {
                // Remove any previous selection
                document.querySelectorAll('.tier').forEach(t => t.classList.remove('selected'));

                // Mark the selected tier
                tier.classList.add('selected');
                selectedTier = tier.getAttribute('data-tier');
                proceedBtn.disabled = false;
            });
        });

        // Handle Proceed to Checkout
        proceedBtn.addEventListener('click', () => {
            if (selectedTier) {
                // Animate the tier selection box to slide away
                tierSelection.classList.add('animate');

                // Hide the proceed button
                proceedBtn.style.display = 'none';

                // Show the payment screen
                setTimeout(() => {
                    paymentScreen.classList.add('show');
                }, 1000); // Delay to match animation time
            }
        });
    </script>

</body>
</html>

`);
});

app.get('/settings', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Settings - The Lost Nemo</title>

    <!-- Google Fonts & Font Awesome -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

    <style>
        :root {
            --primary-color: #1E90FF;
            --bg-dark: #0A0F1D;
            --bg-light: #101826;
            --text-light: #E0E6F1;
            --text-muted: #8892B0;
            --border-color: #1E90FF;
            --btn-bg: #187bcd;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-dark);
            color: var(--text-light);
            margin: 0;
            padding: 20px;
        }

        .container {
            background: var(--bg-light);
            padding: 30px;
            border-radius: 10px;
            max-width: 900px;
            margin: auto;
            text-align: left;
            border: 2px solid var(--border-color);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            height: 85vh;
            overflow-y: auto;
        }

        h1 {
            font-size: 30px;
            font-weight: 700;
            text-align: center;
            color: var(--primary-color);
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 15px;
            color: var(--primary-color);
        }

        .settings-option {
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .settings-option label {
            font-size: 16px;
            font-weight: 500;
        }

        .settings-option input[type="checkbox"],
        .settings-option input[type="radio"] {
            width: 20px;
            height: 20px;
        }

        .settings-option button {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 12px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
        }

        .settings-option button:hover {
            background: var(--btn-bg);
        }

        .theme-toggle-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
        }

        .theme-toggle-container button {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s ease;
        }

        .theme-toggle-container button:hover {
            background: var(--btn-bg);
        }

        .save-btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 12px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            display: block;
            width: 100%;
            margin-top: 30px;
        }

        .save-btn:hover {
            background: var(--btn-bg);
        }

        footer {
            font-size: 12px;
            text-align: center;
            color: var(--text-muted);
            margin-top: 20px;
        }

        footer a {
            color: var(--primary-color);
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }

        .settings-option .icon {
            color: var(--primary-color);
            font-size: 18px;
        }

        /* Custom Scrollbar */
        .container::-webkit-scrollbar {
            width: 8px;
        }
        .container::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 5px;
        }
        .container::-webkit-scrollbar-track {
            background: #202A3C;
        }
    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>

    <div class="container">
        <h1>Advanced Settings</h1>

        <div class="section">
            <div class="section-title">Account Settings</div>
            <div class="settings-option">
                <label for="emailNotifications">Email Notifications</label>
                <input type="checkbox" id="emailNotifications" checked>
                <button class="icon"><i class="fas fa-envelope"></i></button>
            </div>
            <div class="settings-option">
                <label for="pushNotifications">Push Notifications</label>
                <input type="checkbox" id="pushNotifications">
                <button class="icon"><i class="fas fa-bell"></i></button>
            </div>
            <div class="settings-option">
                <label for="changeEmail">Change Email</label>
                <input type="email" id="changeEmail" placeholder="Enter new email">
                <button class="icon"><i class="fas fa-edit"></i></button>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Theme Settings</div>
            <div class="settings-option">
                <label for="darkMode">Dark Mode</label>
                <input type="checkbox" id="darkMode" checked>
                <button class="icon"><i class="fas fa-moon"></i></button>
            </div>
            <div class="settings-option">
                <label for="lightMode">Light Mode</label>
                <input type="checkbox" id="lightMode">
                <button class="icon"><i class="fas fa-sun"></i></button>
            </div>
            <div class="settings-option">
                <label for="customBackground">Custom Background</label>
                <input type="file" id="customBackground">
                <button class="icon"><i class="fas fa-image"></i></button>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Security Settings</div>
            <div class="settings-option">
                <label for="twoFactor">Enable Two-Factor Authentication</label>
                <input type="checkbox" id="twoFactor" checked>
                <button class="icon"><i class="fas fa-shield-alt"></i></button>
            </div>
            <div class="settings-option">
                <label for="changePassword">Change Password</label>
                <input type="password" id="changePassword" placeholder="Enter new password">
                <button class="icon"><i class="fas fa-key"></i></button>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Notification Settings</div>
            <div class="settings-option">
                <label for="emailAlerts">Email Alerts</label>
                <input type="checkbox" id="emailAlerts">
                <button class="icon"><i class="fas fa-bell"></i></button>
            </div>
            <div class="settings-option">
                <label for="textAlerts">Text Alerts</label>
                <input type="checkbox" id="textAlerts">
                <button class="icon"><i class="fas fa-sms"></i></button>
            </div>
            <div class="settings-option">
                <label for="alertFrequency">Alert Frequency</label>
                <select id="alertFrequency">
                    <option value="immediate">Immediate</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                </select>
                <button class="icon"><i class="fas fa-calendar-day"></i></button>
            </div>
        </div>

        <div class="theme-toggle-container">
            <button id="saveSettings">Save Settings</button>
        </div>

        <footer>
            <p>Need help? <a href="https://thelostnemo.glitch.me/support">Contact support</a></p>
        </footer>
    </div>

    <script>
        // Toggle Dark/Light Mode
        document.getElementById('darkMode').addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.style.setProperty('--bg-dark', '#0A0F1D');
                document.documentElement.style.setProperty('--bg-light', '#101826');
                document.documentElement.style.setProperty('--text-light', '#E0E6F1');
            } else {
                document.documentElement.style.setProperty('--bg-dark', '#ffffff');
                document.documentElement.style.setProperty('--bg-light', '#f1f1f1');
                document.documentElement.style.setProperty('--text-light', '#000000');
            }
        });

        // Save Settings
        document.getElementById('saveSettings').addEventListener('click', function() {
            alert('Your settings have been saved successfully!');
        });
    </script>

</body>
</html>

`);
});

app.get('/api', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Lost Nemo API Documentation</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/night-owl.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
    <style>
        /* General Styles */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
        }
        body {
            display: flex;
            background: #0a0a0a;
            color: white;
            overflow-x: hidden;
        }
        /* Sidebar */
        .sidebar {
            width: 300px;
            height: 100vh;
            background: #111;
            padding: 20px;
            position: fixed;
            overflow-y: auto;
            border-right: 2px solid #007bff;
        }
        .sidebar h2 {
            font-size: 1.5em;
            color: #00bcd4;
            margin-bottom: 15px;
            text-align: center;
        }
        .sidebar ul {
            list-style: none;
        }
        .sidebar ul li {
            margin: 10px 0;
        }
        .sidebar ul li a {
            text-decoration: none;
            color: #ddd;
            padding: 10px;
            display: block;
            border-radius: 5px;
            transition: 0.3s;
        }
        .sidebar ul li a:hover {
            background: #007bff;
            color: white;
        }
        /* Content */
        .content {
            margin-left: 320px;
            padding: 30px;
            flex: 1;
            max-width: 1000px;
        }
        .section {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
            transition: 0.3s;
        }
        .section {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    margin-bottom: 30px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    transition: 0.3s;
}

h2, h3 {
    color: #00bcd4;
    margin-bottom: 10px;
}

p, ul, ol {
    margin-bottom: 15px;
    line-height: 1.6;
}

hr {
    border: none;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    margin: 25px 0;
}

.code-box {
    background: #111;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
    border-left: 4px solid #007bff;
    margin-top: 10px;
}

        }
        /* Expandable Sections */
        .toggle {
            cursor: pointer;
            padding: 10px;
            background: rgba(255, 255, 255, 0.1);
            margin-top: 10px;
            border-radius: 5px;
            transition: 0.3s;
        }
        .toggle:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        .toggle-content {
            display: none;
            margin-top: 10px;
        }
        /* Custom Scrollbar for Sidebar */
.sidebar::-webkit-scrollbar {
    width: 8px; /* Slightly wider for better usability */
}

.sidebar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1); /* Subtle track color */
    border-radius: 10px; /* Rounded edges */
}

.sidebar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #007bff, #0056b3); /* Smooth gradient */
    border-radius: 10px; /* Fully rounded */
    transition: background 0.3s ease-in-out; /* Smooth transition */
}

.sidebar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #0056b3, #003d80); /* Darker on hover */
}

.sidebar {
    scrollbar-width: thin; /* Firefox support */
    scrollbar-color: #007bff rgba(255, 255, 255, 0.1); /* For modern browsers */
}

    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>

<!-- Sidebar Navigation -->
<div class="sidebar">
    <h2>API Documentation</h2>
    <ul>
        <li><a href="#intro">Introduction</a></li>
        <li><a href="#auth">Authentication</a></li>
        <li><a href="#errors">Error Handling</a></li>
        <li><a href="#ratelimits">Rate Limits</a></li>
        <li><a href="#users">User Management</a></li>
        <li><a href="#servers">Server Management</a></li>
        <li><a href="#roles">Roles & Permissions</a></li>
        <li><a href="#channels">Channels & Messages</a></li>
        <li><a href="#moderation">Moderation Tools</a></li>
        <li><a href="#webhooks">Webhooks</a></li>
        <li><a href="#bots">Bot Integration</a></li>
        <li><a href="#premium">Premium Features</a></li>
        <li><a href="#support">Support & FAQs</a></li>
    </ul>
</div>

<!-- Content Area -->
<div class="content">
    
    <div class="section" id="intro">
    <h2>Introduction</h2>
    <p>Welcome to the <strong>Lost Nemo API Documentation</strong>. This API allows you to interact with various services, including:</p>
    
    <ul>
        <li><strong>Authentication:</strong> Secure user login and token management.</li>
        <li><strong>Server Management:</strong> Control and configure your server.</li>
        <li><strong>Bot Integration:</strong> Automate tasks and enhance user experience.</li>
        <li><strong>Roles & Permissions:</strong> Manage access levels and permissions.</li>
        <li><strong>Webhooks:</strong> Automate real-time notifications and integrations.</li>
    </ul>

    <hr>

    <h3>API Version</h3>
    <p>The current API version is <code>v1.0</code>. Ensure you use the latest version for optimal performance.</p>

    <h3>Base URL</h3>
    <div class="code-box">
        <pre><code class="plaintext">https://thelostnemo.glitch.me/api/v1</code></pre>
    </div>

    <hr>

    <h3>Authentication</h3>
    <p>This API requires authentication via a Bearer Token. Include the token in the header of each request:</p>
    <div class="code-box">
        <pre><code class="json">
{
    "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
        </code></pre>
    </div>

    <hr>

    <h3>Supported Data Formats</h3>
    <p>The API accepts and returns data in JSON format. Ensure your requests include the appropriate headers:</p>
    <div class="code-box">
        <pre><code class="json">
{
    "Content-Type": "application/json"
}
        </code></pre>
    </div>

    <hr>

    <h3>Rate Limits</h3>
    <p>To prevent abuse, the API enforces rate limits:</p>
    <ul>
        <li><strong>Standard Users:</strong> 60 requests per minute.</li>
        <li><strong>Premium Users:</strong> 500 requests per minute.</li>
    </ul>

    <hr>

    <h3>Getting Started</h3>
    <p>To begin using the API, follow these steps:</p>
    <ol>
        <li>Register an API key from your <a href="#">account settings</a>.</li>
        <li>Use the authentication endpoint to generate a token.</li>
        <li>Make API requests using the base URL.</li>
    </ol>

    <hr>

    <h3>Example Request</h3>
    <p>A simple request to fetch user details:</p>
    <div class="code-box">
        <pre><code class="bash">curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" https://thelostnemo.glitch.me/api/v1/users/me</code></pre>
    </div>

    <hr>

    <h3>Example Response</h3>
    <div class="code-box">
        <pre><code class="json">
{
    "id": 12345,
    "username": "User123",
    "email": "user@example.com",
    "roles": ["admin", "moderator"]
}
        </code></pre>
    </div>

    <hr>

    <h3>Need Help?</h3>
    <p>For support, visit our <a href="#">Help Center</a> or join our <a href="#">community forum</a>.</p>
</div>



    <div class="section" id="auth">
    <h2>Authentication</h2>
    <p>All API requests require authentication via a bearer token. Authentication is necessary to ensure secure access to protected endpoints.</p>

    <hr>

    <h3>Types of Authentication</h3>
    <p>The Lost Nemo API supports multiple authentication methods:</p>
    <ul>
        <li><strong>OAuth2 Bearer Token</strong> (Recommended for user-based access)</li>
        <li><strong>API Key</strong> (For server-to-server communication)</li>
        <li><strong>JSON Web Token (JWT)</strong> (For session-based authentication)</li>
    </ul>

    <hr>

    <h3>OAuth2 Bearer Token Authentication</h3>
    <p>The preferred method of authentication is through OAuth2, where a client exchanges an authorization code for an access token.</p>

    <h4>Step 1: Redirect User to Authorization URL</h4>
    <p>Users must be redirected to the authorization URL to grant access to your application:</p>
    <div class="code-box">
        <pre><code>
https://thelostnemo.glitch.me/oauth2/authorize?client_id=YOUR_CLIENT_ID&response_type=code&scope=read_write
        </code></pre>
    </div>

    <h4>Step 2: Exchange Authorization Code for Access Token</h4>
    <p>Once the user authorizes, you will receive an authorization code, which you must exchange for an access token:</p>
    <div class="code-box">
        <pre><code class="bash">
curl -X POST https://thelostnemo.glitch.me/oauth2/token \
     -H "Content-Type: application/json" \
     -d '{
         "client_id": "YOUR_CLIENT_ID",
         "client_secret": "YOUR_CLIENT_SECRET",
         "grant_type": "authorization_code",
         "code": "USER_AUTH_CODE"
     }'
        </code></pre>
    </div>

    <h4>Example Response</h4>
    <div class="code-box">
        <pre><code class="json">
{
    "access_token": "eyJhbGciOiJIUzI1...",
    "token_type": "Bearer",
    "expires_in": 3600
}
        </code></pre>
    </div>

    <h4>Step 3: Using the Access Token</h4>
    <p>Include the access token in the 'Authorization' header when making API requests:</p>
    <div class="code-box">
        <pre><code class="bash">
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -X GET https://thelostnemo.glitch.me/api/v1/users/me
        </code></pre>
    </div>

    <hr>

    <h3>API Key Authentication</h3>
    <p>For server-to-server authentication, you can use an API key. Pass your API key as a header in each request:</p>
    <div class="code-box">
        <pre><code class="bash">
curl -H "x-api-key: YOUR_API_KEY" \
     -X GET https://thelostnemo.glitch.me/api/v1/resource
        </code></pre>
    </div>

    <hr>

    <h3>JWT Authentication</h3>
    <p>If your application supports JSON Web Tokens (JWT), you can authenticate by including a JWT in your API requests:</p>
    <div class="code-box">
        <pre><code class="bash">
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -X GET https://thelostnemo.glitch.me/api/v1/protected
        </code></pre>
    </div>

    <hr>

    <h3>Handling Authentication Errors</h3>
    <p>If an API request is made without a valid token, the server will return an error response. Below are some common authentication errors:</p>

    <h4>Error: Missing Token</h4>
    <div class="code-box">
        <pre><code class="json">
{
    "error": "unauthorized",
    "message": "No authentication token provided."
}
        </code></pre>
    </div>

    <h4>Error: Invalid Token</h4>
    <div class="code-box">
        <pre><code class="json">
{
    "error": "invalid_token",
    "message": "The provided token is invalid or expired."
}
        </code></pre>
    </div>

    <h4>Error: Insufficient Permissions</h4>
    <div class="code-box">
        <pre><code class="json">
{
    "error": "forbidden",
    "message": "You do not have permission to access this resource."
}
        </code></pre>
    </div>

    <hr>

    <h3>Security Best Practices</h3>
    <ul>
        <li><strong>Never expose API keys or tokens in frontend code.</strong></li>
        <li><strong>Use HTTPS</strong> to encrypt API requests.</li>
        <li><strong>Regularly rotate API keys</strong> to prevent unauthorized access.</li>
        <li><strong>Store tokens securely</strong> using environment variables.</li>
        <li><strong>Use refresh tokens</strong> to request new access tokens when the current one expires.</li>
    </ul>

    <hr>

    <h3>Refreshing Expired Tokens</h3>
    <p>When an access token expires, you can use a refresh token to obtain a new one:</p>
    <div class="code-box">
        <pre><code class="bash">
curl -X POST https://thelostnemo.glitch.me/oauth2/token \
     -H "Content-Type: application/json" \
     -d '{
         "client_id": "YOUR_CLIENT_ID",
         "client_secret": "YOUR_CLIENT_SECRET",
         "grant_type": "refresh_token",
         "refresh_token": "YOUR_REFRESH_TOKEN"
     }'
        </code></pre>
    </div>

    <hr>

    <h3>Need Help?</h3>
    <p>If you're experiencing authentication issues, please visit our <a href="#">Help Center</a> or contact support.</p>
</div>



    <div class="section" id="errors">
    <h2>Error Handling</h2>
    <p>Errors in the Lost Nemo API follow a structured JSON response format. This ensures that developers can easily identify issues and implement proper error-handling mechanisms.</p>

    <hr>

    <h3>Standard Error Response Format</h3>
    <p>Whenever an error occurs, the API returns a structured JSON response with the following fields:</p>
    <div class="code-box">
        <pre><code class="json">
{
    "error": "error_code",
    "message": "A human-readable error message.",
    "status": 400
}
        </code></pre>
    </div>

    <hr>

    <h3>Common HTTP Error Codes</h3>
    <p>Below is a list of common HTTP error codes that the API may return:</p>
    
    <table>
        <thead>
            <tr>
                <th>Status Code</th>
                <th>Error Type</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><code>400</code></td>
                <td><strong>Bad Request</strong></td>
                <td>The request was malformed or contained invalid parameters.</td>
            </tr>
            <tr>
                <td><code>401</code></td>
                <td><strong>Unauthorized</strong></td>
                <td>Authentication failed. A valid token is required.</td>
            </tr>
            <tr>
                <td><code>403</code></td>
                <td><strong>Forbidden</strong></td>
                <td>The authenticated user does not have the necessary permissions.</td>
            </tr>
            <tr>
                <td><code>404</code></td>
                <td><strong>Not Found</strong></td>
                <td>The requested resource does not exist.</td>
            </tr>
            <tr>
                <td><code>429</code></td>
                <td><strong>Too Many Requests</strong></td>
                <td>The request limit has been exceeded.</td>
            </tr>
            <tr>
                <td><code>500</code></td>
                <td><strong>Internal Server Error</strong></td>
                <td>An unexpected error occurred on the server.</td>
            </tr>
        </tbody>
    </table>

    <hr>

    <h3>Example Error Responses</h3>

    <h4>400 Bad Request</h4>
    <p>This error occurs when the request parameters are incorrect or missing required fields.</p>
    <div class="code-box">
        <pre><code class="json">
{
    "error": "bad_request",
    "message": "The 'username' field is required.",
    "status": 400
}
        </code></pre>
    </div>

    <h4>401 Unauthorized</h4>
    <p>This error occurs when authentication credentials are missing or invalid.</p>
    <div class="code-box">
        <pre><code class="json">
{
    "error": "unauthorized",
    "message": "Invalid API token. Please authenticate.",
    "status": 401
}
        </code></pre>
    </div>

    <h4>403 Forbidden</h4>
    <p>This error occurs when the user does not have the necessary permissions.</p>
    <div class="code-box">
        <pre><code class="json">
{
    "error": "forbidden",
    "message": "You do not have permission to access this resource.",
    "status": 403
}
        </code></pre>
    </div>

    <h4>404 Not Found</h4>
    <p>This error occurs when a requested resource does not exist.</p>
    <div class="code-box">
        <pre><code class="json">
{
    "error": "not_found",
    "message": "User with ID 12345 not found.",
    "status": 404
}
        </code></pre>
    </div>

    <h4>429 Too Many Requests</h4>
    <p>This error occurs when a user exceeds the allowed request rate.</p>
    <div class="code-box">
        <pre><code class="json">
{
    "error": "rate_limit_exceeded",
    "message": "Too many requests. Try again in 30 seconds.",
    "status": 429
}
        </code></pre>
    </div>

    <h4>500 Internal Server Error</h4>
    <p>This error occurs when an unexpected issue happens on the server.</p>
    <div class="code-box">
        <pre><code class="json">
{
    "error": "server_error",
    "message": "An internal server error occurred. Please try again later.",
    "status": 500
}
        </code></pre>
    </div>

    <hr>

    <h3>Rate Limiting</h3>
    <p>To prevent abuse, the API enforces rate limits. If you exceed the limit, you will receive a <code>429 Too Many Requests</code> response.</p>

    <h4>Handling Rate Limits</h4>
    <ul>
        <li>Wait for the <code>Retry-After</code> time specified in the response headers before making another request.</li>
        <li>Use exponential backoff to avoid immediate retry spikes.</li>
        <li>Monitor API usage and optimize your request frequency.</li>
    </ul>

    <hr>

    <h3>Best Practices for Error Handling</h3>
    <ul>
        <li><strong>Always check HTTP status codes</strong> before processing a response.</li>
        <li><strong>Handle errors programmatically</strong> and display user-friendly messages.</li>
        <li><strong>Log errors</strong> for debugging and troubleshooting.</li>
        <li><strong>Use retries</strong> for transient errors like <code>500</code> and <code>429</code>.</li>
        <li><strong>Respect rate limits</strong> and optimize API usage.</li>
    </ul>

    <hr>

    <h3>Retry Strategies for API Errors</h3>
    <p>For certain errors like <code>500</code> and <code>429</code>, retrying the request can help recover from temporary issues.</p>

    <h4>Exponential Backoff Example (Python)</h4>
    <p>To avoid overwhelming the server, implement exponential backoff when retrying:</p>
    <div class="code-box">
        <pre><code class="python">
import time
import requests

url = "https://thelostnemo.glitch.me/api/v1/resource"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}

def fetch_data():
    retries = 0
    while retries < 5:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        elif response.status_code in [500, 429]:
            wait_time = 2 ** retries
            print(f"Retrying in {wait_time} seconds...")
            time.sleep(wait_time)
            retries += 1
        else:
            break
    return None

data = fetch_data()
if data:
    print("Data received:", data)
else:
    print("Failed to fetch data.")
        </code></pre>
    </div>

    <hr>

    <h3>Need Help?</h3>
    <p>If you encounter persistent errors, check our <a href="#">Error Code Reference</a> or contact support.</p>
</div>


    <div class="section" id="ratelimits">
    <h2>Rate Limits</h2>
    <p>Rate limits are critical for managing traffic to the API and ensuring the infrastructure remains stable and secure. Each endpoint has a predefined set of rate limits designed to prevent abuse, maintain performance, and ensure fairness across all users. In this section, we will break down how rate limits work, how to interpret them, how to handle them in your applications, and what special limits apply to premium users.</p>

    <h3>What Are Rate Limits?</h3>
    <p>Rate limits refer to the number of requests that can be made to an API within a specific time window. This is implemented to prevent users from overwhelming the API with excessive traffic, which could degrade performance for everyone. By enforcing rate limits, we ensure the stability, availability, and fairness of the service for all users.</p>
    <p>Rate limits are imposed on both the overall API and on individual endpoints. These limits are typically defined as the maximum number of requests allowed within a minute, hour, or day. Exceeding the rate limit results in a <code>429 Too Many Requests</code> error, and the user must wait until the limit resets before making further requests.</p>

    <h3>Rate Limit Structure</h3>
    <p>The rate limits are applied differently to different kinds of endpoints. Below is a general outline of the rate limit structure:</p>
    <div class="code-box">
    <pre style="font-family: monospace; white-space: pre; overflow-x: auto;">
Endpoint Type         | Rate Limit        | Reset Interval
-----------------------------------------------------------
Public Endpoints      | 60 requests/min   | 1 minute      
Private Endpoints     | 30 requests/min   | 1 minute      
Critical Endpoints    | 10 requests/min   | 1 minute      
Authenticated Users   | 500 requests/min  | 1 hour        
Premium Users         | 1000 requests/min | 1 hour        
    </pre>
</div>
    <p>Each endpoint type has its own rate limit, with public endpoints typically having higher limits, and critical or private endpoints having stricter limits. Below, we go into more detail about these limits.</p>

    <h3>Public Endpoints</h3>
    <p>Public endpoints are designed for general access. These might include endpoints that return publicly available information or general usage data. These endpoints typically have a higher rate limit to accommodate frequent access without overburdening the system.</p>
    <ul>
        <li><strong>Rate Limit</strong>: 60 requests per minute</li>
        <li><strong>Reset Interval</strong>: 1 minute</li>
        <li><strong>Example</strong>: <code>/api/games</code>, <code>/api/leaderboard</code></li>
    </ul>

    <h3>Private Endpoints</h3>
    <p>Private endpoints are accessible only to authenticated users. These endpoints might involve user-specific data or operations. Because they require authentication, the rate limits are slightly lower to ensure fair usage without allowing abuse.</p>
    <ul>
        <li><strong>Rate Limit</strong>: 30 requests per minute</li>
        <li><strong>Reset Interval</strong>: 1 minute</li>
        <li><strong>Example</strong>: <code>/api/user/data</code>, <code>/api/user/settings</code></li>
    </ul>

    <h3>Critical Endpoints</h3>
    <p>Critical endpoints are reserved for sensitive operations, such as user authentication, payment processing, and other high-priority actions. These endpoints have the strictest rate limits to prevent abuse or system overloads.</p>
    <ul>
        <li><strong>Rate Limit</strong>: 10 requests per minute</li>
        <li><strong>Reset Interval</strong>: 1 minute</li>
        <li><strong>Example</strong>: <code>/api/auth/login</code>, <code>/api/payment/charge</code></li>
    </ul>

    <h3>Authenticated User Rate Limits</h3>
    <p>Authenticated users, who log in with their credentials, are given more generous rate limits than unauthenticated users. Authenticated access allows for more complex interactions, such as data retrieval and updates, without compromising the server’s capacity.</p>
    <ul>
        <li><strong>Rate Limit</strong>: 500 requests per minute</li>
        <li><strong>Reset Interval</strong>: 1 hour</li>
        <li><strong>Example</strong>: <code>/api/user/friends</code>, <code>/api/user/messages</code></li>
    </ul>

    <h3>Premium User Rate Limits</h3>
    <p>Premium users enjoy the highest rate limits as part of their subscription benefits. Premium access grants users higher request quotas for both public and private endpoints, allowing them to interact with the API more frequently, with fewer interruptions.</p>
    <ul>
        <li><strong>Rate Limit</strong>: 1000 requests per minute</li>
        <li><strong>Reset Interval</strong>: 1 hour</li>
        <li><strong>Example</strong>: <code>/api/premium/data</code>, <code>/api/premium/analytics</code></li>
    </ul>

    <div class="toggle" onclick="toggleDetails('premium-info')">Show Detailed Premium User Rate Limits</div>
    <div id="premium-info" class="toggle-content">
        <p>As a premium user, you gain several benefits, including the following advanced features:</p>
        <ul>
            <li><strong>Extended Rate Limits</strong>: 1000 requests/minute across all endpoints, including private and critical endpoints.</li>
            <li><strong>Access to Premium Data</strong>: Premium users have access to exclusive endpoints that are not available to regular users.</li>
            <li><strong>Longer Time Windows</strong>: Premium rate limits reset on an hourly basis, offering users more flexibility in how they interact with the API.</li>
            <li><strong>Priority Support</strong>: Premium users are prioritized in case of system issues or outages, ensuring minimal downtime.</li>
        </ul>
        <p>If you expect your application to generate a high volume of traffic or need to interact with sensitive data, upgrading to a premium plan is highly recommended.</p>
    </div>

    <h3>How to Check Your Rate Limit Status</h3>
    <p>Every time you make a request to the API, the response includes headers that inform you about your current rate limit status. These headers help you monitor your usage in real-time and determine when the next reset will occur.</p>
    <div class="code-box">
        <pre>
            HTTP/1.1 200 OK
            X-RateLimit-Limit: 60
            X-RateLimit-Remaining: 59
            X-RateLimit-Reset: 1584505541
        </pre>
    </div>
    <ul>
        <li><strong>X-RateLimit-Limit</strong>: The maximum number of requests you can make within the current time window.</li>
        <li><strong>X-RateLimit-Remaining</strong>: The number of requests you have remaining in the current time window.</li>
        <li><strong>X-RateLimit-Reset</strong>: The time (in Unix timestamp format) when the rate limit will reset.</li>
    </ul>

    <h3>Handling Rate Limit Exceedance</h3>
    <p>If you exceed the rate limit, the API will return a <code>429 Too Many Requests</code> response. The following headers will be included in the response to inform you when you can try again:</p>
    <div class="code-box">
        <pre>
            HTTP/1.1 429 Too Many Requests
            Retry-After: 120
        </pre>
    </div>
    <p>In the example above, the <code>Retry-After</code> header indicates that you must wait 120 seconds before making additional requests. Implementing automatic retries with exponential backoff will help you manage this.</p>

    <h3>Best Practices for Managing Rate Limits</h3>
    <p>Here are a few best practices for staying within your rate limits:</p>
    <ul>
        <li><strong>Space Out Your Requests</strong>: Distribute your requests evenly over time rather than sending them in bursts. This will prevent you from hitting the rate limit.</li>
        <li><strong>Monitor Your Rate Limit Usage</strong>: Keep track of the remaining requests using the response headers and adjust your application’s behavior accordingly.</li>
        <li><strong>Implement Backoff Strategies</strong>: When you exceed your limit, wait for the rate limit reset before retrying your request. A good approach is to implement exponential backoff, where the retry interval increases progressively with each failure.</li>
        <li><strong>Use Caching</strong>: Cache responses where possible to avoid making repetitive requests to the same endpoint.</li>
    </ul>

    <h3>Advanced Rate Limiting Techniques</h3>
    <p>In high-demand applications, you may need to implement more advanced rate-limiting strategies such as:</p>
    <ul>
        <li><strong>Token Bucket</strong>: This algorithm allows a burst of requests but refills at a steady rate, enabling quick bursts of activity followed by a pause.</li>
        <li><strong>Leaky Bucket</strong>: This algorithm enforces a smooth flow of requests, with requests being "leaked" out at a constant rate, preventing sudden spikes.</li>
    </ul>

    <h3>Conclusion</h3>
    <p>Rate limits are an essential mechanism for ensuring the health and stability of the API. Understanding how to manage and respect rate limits will help ensure that your application functions smoothly while maintaining fair access for all users. If you anticipate high-volume usage or need extended access, consider upgrading to a premium plan to benefit from the higher limits and additional features.</p>
</div>



    <div class="section" id="users">
    <h2>User Management</h2>
    <p>The User Management API provides endpoints for handling user accounts, retrieving profile details, updating settings, and managing authentication. Below is a comprehensive guide to the available endpoints, request formats, responses, and best practices.</p>

    <h3>Authentication & User Identification</h3>
    <p>Before accessing user data, authentication is required. All requests to private user endpoints must include a valid API token or OAuth2 bearer token.</p>
    <div class="code-box">
        <pre>
Authorization: Bearer YOUR_ACCESS_TOKEN
        </pre>
    </div>

    <h3>Get User Profile</h3>
    <p>Retrieves detailed information about a specific user.</p>
    <strong>Endpoint:</strong> <code>GET /api/users/{user_id}</code>
    <strong>Rate Limit:</strong> 60 requests/min

    <h4>Request Example:</h4>
    <div class="code-box">
        <pre>
GET /api/users/12345 HTTP/1.1
Host: thelostnemo.glitch.me
Authorization: Bearer YOUR_ACCESS_TOKEN
        </pre>
    </div>

    <h4>Response Example:</h4>
    <div class="code-box">
        <pre>
HTTP/1.1 200 OK
{
    "id": "12345",
    "username": "LostNemo",
    "discriminator": "#0001",
    "avatar": "https://cdn.thelostnemo.glitch.me/avatar.jpg",
    "created_at": "2024-01-01T12:00:00Z",
    "premium_status": true,
    "roles": ["Admin", "Premium Member"]
}
        </pre>
    </div>

    <h3>Update User Profile</h3>
    <p>Allows a user to modify their profile information.</p>
    <strong>Endpoint:</strong> <code>PATCH /api/users/{user_id}</code>
    <strong>Rate Limit:</strong> 30 requests/min

    <h4>Request Example:</h4>
    <div class="code-box">
        <pre>
PATCH /api/users/12345 HTTP/1.1
Host: thelostnemo.glitch.me
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
    "username": "NewNemo",
    "avatar": "https://cdn.thelostnemo.glitch.me/new_avatar.jpg"
}
        </pre>
    </div>

    <h4>Response Example:</h4>
    <div class="code-box">
        <pre>
HTTP/1.1 200 OK
{
    "message": "User profile updated successfully.",
    "updated_fields": ["username", "avatar"]
}
        </pre>
    </div>

    <h3>Delete User Account</h3>
    <p>Permanently deletes a user's account. This action is irreversible.</p>
    <strong>Endpoint:</strong> <code>DELETE /api/users/{user_id}</code>
    <strong>Rate Limit:</strong> 5 requests/day

    <h4>Request Example:</h4>
    <div class="code-box">
        <pre>
DELETE /api/users/12345 HTTP/1.1
Host: thelostnemo.glitch.me
Authorization: Bearer YOUR_ACCESS_TOKEN
        </pre>
    </div>

    <h4>Response Example:</h4>
    <div class="code-box">
        <pre>
HTTP/1.1 200 OK
{
    "message": "User account deleted successfully."
}
        </pre>
    </div>

    <h3>List All Users (Admin Only)</h3>
    <p>Retrieves a paginated list of all registered users. Requires admin privileges.</p>
    <strong>Endpoint:</strong> <code>GET /api/users</code>
    <strong>Rate Limit:</strong> 100 requests/hour

    <h4>Request Example:</h4>
    <div class="code-box">
        <pre>
GET /api/users?page=1&limit=10 HTTP/1.1
Host: thelostnemo.glitch.me
Authorization: Bearer ADMIN_ACCESS_TOKEN
        </pre>
    </div>

    <h4>Response Example:</h4>
    <div class="code-box">
        <pre>
HTTP/1.1 200 OK
{
    "page": 1,
    "total_users": 1500,
    "users": [
        {
            "id": "12345",
            "username": "LostNemo",
            "premium_status": true
        },
        {
            "id": "67890",
            "username": "AnotherUser",
            "premium_status": false
        }
    ]
}
        </pre>
    </div>

    <h3>Error Codes</h3>
    <div class="code-box">
        <pre>
400 Bad Request  - Invalid request parameters
401 Unauthorized - Missing or invalid authentication
403 Forbidden    - No permission to access this resource
404 Not Found    - User does not exist
429 Too Many Requests - Rate limit exceeded
500 Internal Server Error - Unexpected server issue
        </pre>
    </div>

    <h3>Best Practices</h3>
    <ul>
        <li>Use caching to reduce repeated API calls for the same user data.</li>
        <li>Ensure proper authentication before accessing private endpoints.</li>
        <li>Implement exponential backoff to handle rate limit errors.</li>
        <li>Use pagination for listing users to avoid fetching excessive data.</li>
    </ul>
</div>


    <div class="section" id="servers">
    <h2>Server Management</h2>
    <p>This section covers all API endpoints related to server management, including creating, updating, deleting servers, configuring settings, and retrieving server-related information.</p>

    <hr>

    <h3>Authentication & Permissions</h3>
    <p>Most server-related endpoints require authentication using a valid API key or OAuth2 token. Users must have the necessary permissions to perform actions such as modifying server settings or deleting servers.</p>

    <ul>
        <li><strong>Basic Authentication:</strong> Requires an API key in the request headers.</li>
        <li><strong>OAuth2 Authentication:</strong> Requires a valid OAuth2 token with the necessary scopes.</li>
        <li><strong>Permission Levels:</strong>
            <ul>
                <li><code>ADMIN</code> - Full access to manage the server.</li>
                <li><code>MODERATOR</code> - Can edit settings but cannot delete the server.</li>
                <li><code>USER</code> - Can view basic server details.</li>
            </ul>
        </li>
    </ul>

    <hr>

    <h3>Endpoint Overview</h3>

    <div class="code-box">
        <pre>
Method   | Endpoint                   | Description
-------------------------------------------------------------
GET      | /api/servers                | Fetch all servers user has access to
GET      | /api/servers/{id}           | Fetch details of a specific server
POST     | /api/servers/create         | Create a new server
PATCH    | /api/servers/{id}           | Update server settings
DELETE   | /api/servers/{id}           | Delete a server
GET      | /api/servers/{id}/members   | Fetch server member list
POST     | /api/servers/{id}/kick      | Kick a user from a server
POST     | /api/servers/{id}/ban       | Ban a user from a server
        </pre>
    </div>

    <hr>

    <h3>1. Fetching Server List</h3>
    <p>This endpoint returns all servers the authenticated user has access to.</p>

    <div class="code-box">
        <pre>
GET /api/servers
Authorization: Bearer YOUR_TOKEN

Response:
{
    "servers": [
        {
            "id": "123456789",
            "name": "The Lost Nemo",
            "owner_id": "987654321",
            "member_count": 250,
            "region": "US-East"
        }
    ]
}
        </pre>
    </div>

    <h3>2. Fetching Server Details</h3>
    <p>Retrieve detailed information about a specific server.</p>

    <div class="code-box">
        <pre>
GET /api/servers/{id}
Authorization: Bearer YOUR_TOKEN

Response:
{
    "id": "123456789",
    "name": "The Lost Nemo",
    "owner_id": "987654321",
    "member_count": 250,
    "region": "US-East",
    "roles": ["Admin", "Moderator", "Member"],
    "created_at": "2024-02-09T12:00:00Z"
}
        </pre>
    </div>

    <h3>3. Creating a New Server</h3>
    <p>Use this endpoint to create a new server.</p>

    <div class="code-box">
        <pre>
POST /api/servers/create
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "name": "New Server",
    "region": "US-West",
    "visibility": "public"
}

Response:
{
    "id": "987654321",
    "name": "New Server",
    "region": "US-West",
    "owner_id": "YOUR_USER_ID",
    "created_at": "2024-02-09T14:30:00Z"
}
        </pre>
    </div>

    <h3>4. Updating Server Settings</h3>
    <p>Modify server settings such as name, region, and visibility.</p>

    <div class="code-box">
        <pre>
PATCH /api/servers/{id}
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "name": "Updated Server Name",
    "region": "Europe"
}

Response:
{
    "id": "123456789",
    "name": "Updated Server Name",
    "region": "Europe",
    "updated_at": "2024-02-09T15:00:00Z"
}
        </pre>
    </div>

    <h3>5. Deleting a Server</h3>
    <p>Only server owners can delete a server.</p>

    <div class="code-box">
        <pre>
DELETE /api/servers/{id}
Authorization: Bearer YOUR_TOKEN

Response:
{
    "message": "Server deleted successfully."
}
        </pre>
    </div>

    <h3>6. Fetching Server Members</h3>
    <p>Retrieve a list of all members in the server.</p>

    <div class="code-box">
        <pre>
GET /api/servers/{id}/members
Authorization: Bearer YOUR_TOKEN

Response:
{
    "members": [
        {
            "id": "1122334455",
            "username": "User1",
            "role": "Admin"
        },
        {
            "id": "2233445566",
            "username": "User2",
            "role": "Moderator"
        }
    ]
}
        </pre>
    </div>

    <h3>7. Kicking a User</h3>
    <p>Removes a user from the server.</p>

    <div class="code-box">
        <pre>
POST /api/servers/{id}/kick
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "user_id": "1122334455"
}

Response:
{
    "message": "User kicked successfully."
}
        </pre>
    </div>

    <h3>8. Banning a User</h3>
    <p>Prohibits a user from rejoining the server.</p>

    <div class="code-box">
        <pre>
POST /api/servers/{id}/ban
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "user_id": "1122334455",
    "reason": "Violation of server rules"
}

Response:
{
    "message": "User banned successfully."
}
        </pre>
    </div>

    <hr>

    <h3>Rate Limits</h3>
    <p>To prevent abuse, the following rate limits apply:</p>

    <div class="code-box">
        <pre>
Endpoint                 | Rate Limit         | Reset Interval
-------------------------------------------------------------------
GET /api/servers         | 60 requests/min    | 1 minute
GET /api/servers/{id}    | 60 requests/min    | 1 minute
POST /api/servers/create | 10 requests/min    | 1 minute
PATCH /api/servers/{id}  | 20 requests/min    | 1 minute
DELETE /api/servers/{id} | 5 requests/min     | 1 minute
GET /api/servers/{id}/members | 100 requests/min | 1 minute
POST /api/servers/{id}/kick | 30 requests/min | 1 minute
POST /api/servers/{id}/ban  | 20 requests/min | 1 minute
        </pre>
    </div>

    <hr>

    <h3>Best Practices</h3>
    <ul>
        <li>Always authenticate API requests using OAuth2 or API keys.</li>
        <li>Cache frequently requested data to avoid hitting rate limits.</li>
        <li>Log API errors and handle them gracefully to prevent service disruptions.</li>
        <li>Ensure only authorized users can perform administrative actions.</li>
        <li>Use pagination when fetching large lists of members or servers.</li>
    </ul>
</div>


    <div class="section" id="roles">
    <h2>Roles & Permissions</h2>
    <p>This section covers all API endpoints related to managing server roles and permissions, including creating, updating, deleting roles, and assigning or revoking permissions for users.</p>

    <hr>

    <h3>Authentication & Permissions</h3>
    <p>Managing roles requires authentication and sufficient permissions. Only users with administrative privileges can modify roles and permissions.</p>

    <ul>
        <li><strong>API Key / OAuth2 Authentication:</strong> Required for accessing role management endpoints.</li>
        <li><strong>Permission Levels:</strong>
            <ul>
                <li><code>ADMIN</code> - Full access to create, edit, and delete roles.</li>
                <li><code>MODERATOR</code> - Can assign and remove roles but cannot create or delete them.</li>
                <li><code>USER</code> - Can only view their assigned roles.</li>
            </ul>
        </li>
    </ul>

    <hr>

    <h3>Endpoint Overview</h3>

    <div class="code-box">
        <pre>
Method   | Endpoint                      | Description
-------------------------------------------------------------
GET      | /api/roles                     | Fetch all roles in the server
GET      | /api/roles/{id}                | Fetch details of a specific role
POST     | /api/roles/create              | Create a new role
PATCH    | /api/roles/{id}                | Update role settings
DELETE   | /api/roles/{id}                | Delete a role
POST     | /api/roles/{id}/assign         | Assign a role to a user
POST     | /api/roles/{id}/remove         | Remove a role from a user
        </pre>
    </div>

    <hr>

    <h3>1. Fetching All Roles</h3>
    <p>Retrieve a list of all roles in the server.</p>

    <div class="code-box">
        <pre>
GET /api/roles
Authorization: Bearer YOUR_TOKEN

Response:
{
    "roles": [
        {
            "id": "12345",
            "name": "Admin",
            "permissions": ["MANAGE_SERVER", "KICK_MEMBERS", "BAN_MEMBERS"],
            "color": "#FF0000",
            "position": 1
        },
        {
            "id": "67890",
            "name": "Moderator",
            "permissions": ["KICK_MEMBERS"],
            "color": "#00FF00",
            "position": 2
        }
    ]
}
        </pre>
    </div>

    <h3>2. Fetching Role Details</h3>
    <p>Retrieve detailed information about a specific role.</p>

    <div class="code-box">
        <pre>
GET /api/roles/{id}
Authorization: Bearer YOUR_TOKEN

Response:
{
    "id": "12345",
    "name": "Admin",
    "permissions": ["MANAGE_SERVER", "KICK_MEMBERS", "BAN_MEMBERS"],
    "color": "#FF0000",
    "position": 1,
    "created_at": "2024-02-09T12:00:00Z"
}
        </pre>
    </div>

    <h3>3. Creating a New Role</h3>
    <p>Use this endpoint to create a new role.</p>

    <div class="code-box">
        <pre>
POST /api/roles/create
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "name": "VIP",
    "permissions": ["VIEW_CHANNELS"],
    "color": "#FFD700",
    "position": 3
}

Response:
{
    "id": "112233",
    "name": "VIP",
    "permissions": ["VIEW_CHANNELS"],
    "color": "#FFD700",
    "position": 3,
    "created_at": "2024-02-09T14:30:00Z"
}
        </pre>
    </div>

    <h3>4. Updating a Role</h3>
    <p>Modify role properties such as name, permissions, and color.</p>

    <div class="code-box">
        <pre>
PATCH /api/roles/{id}
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "name": "Senior Moderator",
    "color": "#0080FF",
    "permissions": ["KICK_MEMBERS", "BAN_MEMBERS"]
}

Response:
{
    "id": "67890",
    "name": "Senior Moderator",
    "permissions": ["KICK_MEMBERS", "BAN_MEMBERS"],
    "color": "#0080FF",
    "updated_at": "2024-02-09T15:00:00Z"
}
        </pre>
    </div>

    <h3>5. Deleting a Role</h3>
    <p>Roles can only be deleted if no users are assigned to them.</p>

    <div class="code-box">
        <pre>
DELETE /api/roles/{id}
Authorization: Bearer YOUR_TOKEN

Response:
{
    "message": "Role deleted successfully."
}
        </pre>
    </div>

    <h3>6. Assigning a Role to a User</h3>
    <p>Give a user a specific role.</p>

    <div class="code-box">
        <pre>
POST /api/roles/{id}/assign
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "user_id": "5566778899"
}

Response:
{
    "message": "Role assigned successfully."
}
        </pre>
    </div>

    <h3>7. Removing a Role from a User</h3>
    <p>Remove a role from a user.</p>

    <div class="code-box">
        <pre>
POST /api/roles/{id}/remove
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "user_id": "5566778899"
}

Response:
{
    "message": "Role removed successfully."
}
        </pre>
    </div>

    <hr>

    <h3>Rate Limits</h3>
    <p>To prevent abuse, the following rate limits apply:</p>

    <div class="code-box">
        <pre>
Endpoint                  | Rate Limit         | Reset Interval
-------------------------------------------------------------------
GET /api/roles            | 60 requests/min    | 1 minute
GET /api/roles/{id}       | 60 requests/min    | 1 minute
POST /api/roles/create    | 10 requests/min    | 1 minute
PATCH /api/roles/{id}     | 20 requests/min    | 1 minute
DELETE /api/roles/{id}    | 5 requests/min     | 1 minute
POST /api/roles/{id}/assign | 30 requests/min  | 1 minute
POST /api/roles/{id}/remove | 30 requests/min  | 1 minute
        </pre>
    </div>

    <hr>

    <h3>Best Practices</h3>
    <ul>
        <li>Use role-based access control (RBAC) to manage permissions efficiently.</li>
        <li>Ensure only users with proper authority can modify or assign roles.</li>
        <li>Limit role creation to prevent unnecessary role bloat.</li>
        <li>Audit role changes to maintain security and track permission modifications.</li>
        <li>Use consistent color schemes to make role identification easier.</li>
    </ul>
</div>


    <div class="section" id="channels">
    <h2>Channels & Messages</h2>
    <p>This section covers all API endpoints related to managing channels, retrieving messages, sending messages, and modifying channel settings.</p>

    <hr>

    <h3>Authentication & Permissions</h3>
    <p>Interacting with channels and messages requires authentication. Users must have the correct permissions to send messages, edit channels, or retrieve message history.</p>

    <ul>
        <li><strong>API Key / OAuth2 Authentication:</strong> Required for accessing channel and message endpoints.</li>
        <li><strong>Permission Levels:</strong>
            <ul>
                <li><code>ADMIN</code> - Full access to create, edit, and delete channels.</li>
                <li><code>MODERATOR</code> - Can manage messages and mute users.</li>
                <li><code>USER</code> - Can send and read messages.</li>
            </ul>
        </li>
    </ul>

    <hr>

    <h3>Endpoint Overview</h3>

    <div class="code-box">
        <pre>
Method   | Endpoint                        | Description
-------------------------------------------------------------
GET      | /api/channels                    | Fetch all available channels
GET      | /api/channels/{id}               | Fetch details of a specific channel
POST     | /api/channels/create             | Create a new channel
PATCH    | /api/channels/{id}               | Update channel settings
DELETE   | /api/channels/{id}               | Delete a channel
GET      | /api/channels/{id}/messages      | Fetch messages from a channel
POST     | /api/channels/{id}/messages/send | Send a message to a channel
DELETE   | /api/messages/{id}               | Delete a message
        </pre>
    </div>

    <hr>

    <h3>1. Fetching All Channels</h3>
    <p>Retrieve a list of all channels available on the server.</p>

    <div class="code-box">
        <pre>
GET /api/channels
Authorization: Bearer YOUR_TOKEN

Response:
{
    "channels": [
        {
            "id": "1111",
            "name": "General",
            "type": "text",
            "topic": "General discussions",
            "created_at": "2024-02-09T12:00:00Z"
        },
        {
            "id": "2222",
            "name": "Announcements",
            "type": "text",
            "topic": "Official updates",
            "created_at": "2024-02-09T12:30:00Z"
        }
    ]
}
        </pre>
    </div>

    <h3>2. Fetching Channel Details</h3>
    <p>Retrieve information about a specific channel.</p>

    <div class="code-box">
        <pre>
GET /api/channels/{id}
Authorization: Bearer YOUR_TOKEN

Response:
{
    "id": "1111",
    "name": "General",
    "type": "text",
    "topic": "General discussions",
    "created_at": "2024-02-09T12:00:00Z"
}
        </pre>
    </div>

    <h3>3. Creating a New Channel</h3>
    <p>Create a new text or voice channel.</p>

    <div class="code-box">
        <pre>
POST /api/channels/create
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "name": "Gaming",
    "type": "text",
    "topic": "Gaming discussions"
}

Response:
{
    "id": "3333",
    "name": "Gaming",
    "type": "text",
    "topic": "Gaming discussions",
    "created_at": "2024-02-09T14:30:00Z"
}
        </pre>
    </div>

    <h3>4. Updating a Channel</h3>
    <p>Modify a channel’s name or topic.</p>

    <div class="code-box">
        <pre>
PATCH /api/channels/{id}
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "name": "General Chat",
    "topic": "Updated topic"
}

Response:
{
    "id": "1111",
    "name": "General Chat",
    "type": "text",
    "topic": "Updated topic",
    "updated_at": "2024-02-09T15:00:00Z"
}
        </pre>
    </div>

    <h3>5. Deleting a Channel</h3>
    <p>Remove a channel permanently.</p>

    <div class="code-box">
        <pre>
DELETE /api/channels/{id}
Authorization: Bearer YOUR_TOKEN

Response:
{
    "message": "Channel deleted successfully."
}
        </pre>
    </div>

    <h3>6. Fetching Messages from a Channel</h3>
    <p>Retrieve the latest messages from a channel.</p>

    <div class="code-box">
        <pre>
GET /api/channels/{id}/messages
Authorization: Bearer YOUR_TOKEN

Response:
{
    "messages": [
        {
            "id": "5555",
            "author": "User123",
            "content": "Hello, world!",
            "timestamp": "2024-02-09T16:00:00Z"
        },
        {
            "id": "6666",
            "author": "User456",
            "content": "Welcome to the server!",
            "timestamp": "2024-02-09T16:05:00Z"
        }
    ]
}
        </pre>
    </div>

    <h3>7. Sending a Message</h3>
    <p>Post a new message in a text channel.</p>

    <div class="code-box">
        <pre>
POST /api/channels/{id}/messages/send
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "content": "Hello, this is a test message."
}

Response:
{
    "id": "7777",
    "author": "User789",
    "content": "Hello, this is a test message.",
    "timestamp": "2024-02-09T16:10:00Z"
}
        </pre>
    </div>
    
    <h3>
    8. Deleting a Message</h3>
    <p>Remove a specific message from a channel.</p>

    <div class="code-box">
        <pre>
DELETE /api/messages/{id}
Authorization: Bearer YOUR_TOKEN

Response:
{
    "message": "Message deleted successfully."
}
        </pre>
    </div>

    <hr>

    <h3>Rate Limits</h3>
    <p>To prevent spam and abuse, the following rate limits apply:</p>

    <div class="code-box">
        <pre>
Endpoint                                | Rate Limit        | Reset Interval
-------------------------------------------------------------------
GET /api/channels                        | 60 requests/min   | 1 minute
GET /api/channels/{id}                   | 60 requests/min   | 1 minute
POST /api/channels/create                | 10 requests/min   | 1 minute
PATCH /api/channels/{id}                 | 20 requests/min   | 1 minute
DELETE /api/channels/{id}                | 5 requests/min    | 1 minute
GET /api/channels/{id}/messages          | 100 requests/min  | 1 minute
POST /api/channels/{id}/messages/send    | 50 requests/min   | 1 minute
DELETE /api/messages/{id}                | 20 requests/min   | 1 minute
        </pre>
    </div>

    <hr>

    <h3>Best Practices</h3>
    <ul>
        <li>Use channels effectively by organizing them based on topics.</li>
        <li>Monitor messages for spam and inappropriate content.</li>
        <li>Implement slow mode for high-traffic channels to prevent flooding.</li>
        <li>Use role-based access to restrict message posting in certain channels.</li>
        <li>Archive inactive channels to keep the server clean and organized.</li>
    </ul>
</div>


    <div class="section" id="moderation">
    <h2>Moderation Tools</h2>
    <p>These API endpoints provide tools for moderating users and content, including banning, kicking, muting, and warning users, as well as managing auto-moderation features.</p>

    <hr>

    <h3>Authentication & Permissions</h3>
    <p>Moderation actions require specific permissions based on the type of action being performed.</p>

    <ul>
        <li><strong>API Key / OAuth2 Authentication:</strong> Required for accessing moderation endpoints.</li>
        <li><strong>Permission Levels:</strong>
            <ul>
                <li><code>ADMIN</code> - Full access to all moderation tools.</li>
                <li><code>MODERATOR</code> - Can manage users, mute, kick, and warn.</li>
                <li><code>BOT</code> - Can perform automated moderation actions.</li>
            </ul>
        </li>
    </ul>

    <hr>

    <h3>Endpoint Overview</h3>

    <div class="code-box">
        <pre>
Method   | Endpoint                        | Description
-------------------------------------------------------------
GET      | /api/moderation/logs             | Fetch moderation logs
POST     | /api/moderation/kick             | Kick a user from the server
POST     | /api/moderation/ban              | Ban a user from the server
DELETE   | /api/moderation/unban            | Unban a user
POST     | /api/moderation/mute             | Mute a user
DELETE   | /api/moderation/unmute           | Unmute a user
POST     | /api/moderation/warn             | Issue a warning to a user
GET      | /api/moderation/warnings/{id}    | Fetch warnings for a user
POST     | /api/moderation/slowmode         | Enable slow mode in a channel
        </pre>
    </div>

    <hr>

    <h3>1. Fetching Moderation Logs</h3>
    <p>Retrieve a history of all moderation actions taken on the server.</p>

    <div class="code-box">
        <pre>
GET /api/moderation/logs
Authorization: Bearer YOUR_TOKEN

Response:
{
    "logs": [
        {
            "id": "log_001",
            "action": "Ban",
            "user": "User123",
            "moderator": "Admin1",
            "reason": "Toxic behavior",
            "timestamp": "2024-02-09T12:00:00Z"
        },
        {
            "id": "log_002",
            "action": "Mute",
            "user": "User456",
            "moderator": "Mod2",
            "reason": "Spamming",
            "timestamp": "2024-02-09T12:30:00Z"
        }
    ]
}
        </pre>
    </div>

    <h3>2. Kicking a User</h3>
    <p>Remove a user from the server without banning them.</p>

    <div class="code-box">
        <pre>
POST /api/moderation/kick
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "user_id": "123456",
    "reason": "Disruptive behavior"
}

Response:
{
    "message": "User has been kicked."
}
        </pre>
    </div>

    <h3>3. Banning a User</h3>
    <p>Ban a user from the server permanently or temporarily.</p>

    <div class="code-box">
        <pre>
POST /api/moderation/ban
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "user_id": "789012",
    "duration": "permanent",
    "reason": "Harassment"
}

Response:
{
    "message": "User has been banned."
}
        </pre>
    </div>

    <h3>4. Unbanning a User</h3>
    <p>Remove a user’s ban from the server.</p>

    <div class="code-box">
        <pre>
DELETE /api/moderation/unban
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "user_id": "789012"
}

Response:
{
    "message": "User has been unbanned."
}
        </pre>
    </div>

    <h3>5. Muting a User</h3>
    <p>Prevent a user from speaking or sending messages.</p>

    <div class="code-box">
        <pre>
POST /api/moderation/mute
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "user_id": "112233",
    "duration": "10m",
    "reason": "Excessive spamming"
}

Response:
{
    "message": "User has been muted."
}
        </pre>
    </div>

    <h3>6. Unmuting a User</h3>
    <p>Remove a user's mute.</p>

    <div class="code-box">
        <pre>
DELETE /api/moderation/unmute
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "user_id": "112233"
}

Response:
{
    "message": "User has been unmuted."
}
        </pre>
    </div>

    <h3>7. Issuing a Warning</h3>
    <p>Warn a user about inappropriate behavior.</p>

    <div class="code-box">
        <pre>
POST /api/moderation/warn
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "user_id": "445566",
    "reason": "Offensive language"
}

Response:
{
    "message": "User has been warned."
}
        </pre>
    </div>

    <h3>8. Fetching User Warnings</h3>
    <p>Retrieve all warnings for a specific user.</p>

    <div class="code-box">
        <pre>
GET /api/moderation/warnings/{id}
Authorization: Bearer YOUR_TOKEN

Response:
{
    "warnings": [
        {
            "id": "warn_001",
            "reason": "Spam",
            "moderator": "Mod1",
            "timestamp": "2024-02-09T14:30:00Z"
        },
        {
            "id": "warn_002",
            "reason": "Toxic behavior",
            "moderator": "Admin2",
            "timestamp": "2024-02-09T15:00:00Z"
        }
    ]
}
        </pre>
    </div>

    <h3>9. Enabling Slow Mode</h3>
    <p>Prevent users from sending too many messages in a short period.</p>

    <div class="code-box">
        <pre>
POST /api/moderation/slowmode
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "channel_id": "999888",
    "duration": "10s"
}

Response:
{
    "message": "Slow mode enabled."
}
        </pre>
    </div>

    <hr>

    <h3>Rate Limits</h3>
    <p>Moderation actions are subject to rate limits to prevent abuse.</p>

    <div class="code-box">
        <pre>
Endpoint                                | Rate Limit        | Reset Interval
-------------------------------------------------------------------
GET /api/moderation/logs                | 60 requests/min   | 1 minute
POST /api/moderation/kick               | 20 requests/min   | 1 minute
POST /api/moderation/ban                | 10 requests/min   | 1 minute
DELETE /api/moderation/unban            | 10 requests/min   | 1 minute
POST /api/moderation/mute               | 30 requests/min   | 1 minute
DELETE /api/moderation/unmute           | 30 requests/min   | 1 minute
POST /api/moderation/warn               | 40 requests/min   | 1 minute
GET /api/moderation/warnings/{id}       | 60 requests/min   | 1 minute
POST /api/moderation/slowmode           | 15 requests/min   | 1 minute
        </pre>
    </div>

    <hr>

    <h3>Best Practices</h3>
    <ul>
        <li>Use moderation tools wisely to maintain a healthy community.</li>
        <li>Log all moderation actions for transparency.</li>
        <li>Implement a strike system for repeat offenders.</li>
        <li>Use slow mode for high-traffic channels.</li>
        <li>Automate moderation with bot integrations.</li>
    </ul>
</div>


    <div class="section" id="webhooks">
    <h2>Webhooks</h2>
    <p>Webhooks allow external services to receive real-time updates from our API. They provide a way to automate actions based on specific events.</p>

    <hr>

    <h3>Overview</h3>
    <p>Webhooks are **event-driven** callbacks that send **HTTP POST** requests to a specified URL whenever a specific event occurs.</p>

    <ul>
        <li><strong>Delivery Method:</strong> HTTP POST requests with JSON payloads.</li>
        <li><strong>Authentication:</strong> Each webhook includes a secret signature for validation.</li>
        <li><strong>Event Types:</strong> Triggered on user actions, role updates, message events, etc.</li>
        <li><strong>Security:</strong> Webhook requests are signed using **HMAC-SHA256** to prevent spoofing.</li>
        <li><strong>Retries:</strong> If a webhook fails, our system automatically retries delivery.</li>
    </ul>

    <hr>

    <h3>Creating a Webhook</h3>
    <p>To create a webhook, send a **POST** request with the necessary parameters.</p>

    <div class="code-box">
        <pre>
POST /api/webhooks/create
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "event": "user_join",
    "url": "https://yourdomain.com/webhook",
    "secret": "your_secret_key"
}

Response:
{
    "webhook_id": "wh_123456",
    "message": "Webhook successfully created."
}
        </pre>
    </div>

    <hr>

    <h3>Webhook Events</h3>
    <p>Webhooks can be triggered by various events. Below is a list of supported events:</p>

    <div class="code-box">
        <pre>
Event Name             | Description
---------------------------------------------------
user_join              | Triggered when a user joins the server
user_leave             | Triggered when a user leaves the server
message_sent           | Triggered when a user sends a message
message_deleted        | Triggered when a message is deleted
role_updated          | Triggered when a role is updated
server_settings_update | Triggered when server settings are modified
moderation_action      | Triggered when a user is banned, muted, or kicked
        </pre>
    </div>

    <hr>

    <h3>Webhook Payload</h3>
    <p>When an event occurs, a **POST** request is sent to the webhook URL with a JSON payload.</p>

    <div class="code-box">
        <pre>
POST https://yourdomain.com/webhook
Content-Type: application/json

Request Body:
{
    "event": "message_sent",
    "timestamp": "2024-02-09T12:30:00Z",
    "user": {
        "id": "123456",
        "username": "CoolUser",
        "avatar": "https://cdn.example.com/avatar.png"
    },
    "message": {
        "id": "789012",
        "content": "Hello, world!",
        "channel_id": "456789"
    }
}
        </pre>
    </div>

    <hr>

    <h3>Validating Webhooks</h3>
    <p>To ensure the request is genuine, all webhooks include an **HMAC-SHA256** signature in the headers.</p>

    <div class="code-box">
    <pre>This code is not available.</pre>
</div>


    <hr>

    <h3>Modifying a Webhook</h3>
    <p>Update an existing webhook by sending a **PATCH** request.</p>

    <div class="code-box">
        <pre>
PATCH /api/webhooks/update
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "webhook_id": "wh_123456",
    "new_url": "https://yournewdomain.com/webhook"
}

Response:
{
    "message": "Webhook updated successfully."
}
        </pre>
    </div>

    <hr>

    <h3>Deleting a Webhook</h3>
    <p>To remove a webhook, send a **DELETE** request.</p>

    <div class="code-box">
        <pre>
DELETE /api/webhooks/delete
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "webhook_id": "wh_123456"
}

Response:
{
    "message": "Webhook deleted successfully."
}
        </pre>
    </div>

    <hr>

    <h3>Retry Logic</h3>
    <p>If a webhook fails, it will be retried up to **3 times** with exponential backoff.</p>

    <ul>
        <li><strong>1st Attempt:</strong> Immediate</li>
        <li><strong>2nd Attempt:</strong> After 30 seconds</li>
        <li><strong>3rd Attempt:</strong> After 2 minutes</li>
    </ul>

    <p>After 3 failures, the webhook will be marked as **disabled**, and an alert will be sent.</p>

    <hr>

    <h3>Rate Limits</h3>
    <p>To prevent abuse, webhook events are subject to rate limits.</p>

    <div class="code-box">
        <pre>
Webhook Type            | Max Requests per Minute | Retry Limit
--------------------------------------------------------------
User Activity Webhooks  | 100 requests/min        | 3 retries
Message Webhooks       | 50 requests/min         | 3 retries
Server Updates         | 30 requests/min         | 3 retries
Moderation Actions     | 20 requests/min         | 3 retries
Premium Webhooks       | 500 requests/min        | 5 retries
        </pre>
    </div>

    <hr>

    <h3>Best Practices</h3>
    <ul>
        <li>Use **HTTPS** for secure webhook communication.</li>
        <li>Validate the **X-Signature** to ensure authenticity.</li>
        <li>Implement retry logic on your server for missed webhooks.</li>
        <li>Log incoming webhooks for debugging and monitoring.</li>
        <li>Use **queue processing** for handling high webhook traffic.</li>
    </ul>

    <hr>

    <h3>Webhook Debugging</h3>
    <p>Use the '/api/webhooks/test' endpoint to send a test webhook.</p>

    <div class="code-box">
        <pre>
POST /api/webhooks/test
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Request Body:
{
    "event": "test_webhook",
    "url": "https://yourdomain.com/webhook"
}

Response:
{
    "message": "Test webhook sent successfully."
}
        </pre>
    </div>

</div>


    <div class="section" id="bots">
        <h2>Bot Integration</h2>
        <p>How to integrate bots with the API.</p>
    </div>

    <div class="section" id="premium">
        <h2>Premium Features</h2>
        <p>Information on premium API features.</p>
    </div>

    <div class="section" id="support">
        <h2>Support & FAQs</h2>
        <p>Common questions and troubleshooting tips.</p>
    </div>

</div>

<script>
    function toggleSection(id) {
        let content = document.getElementById(id);
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    }
</script>

</body>
</html>



`);
});

app.get('/dashboard', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>

    <!-- External CSS and JS Libraries -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
        :root {
            --primary-color: #1E90FF;
            --bg-dark: #0A0F1D;
            --bg-light: #101826;
            --text-light: #E0E6F1;
            --text-muted: #8892B0;
            --border-color: #1E90FF;
            --highlight-color: #FFD700;
            --hover-color: #187bcd;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-dark);
            color: var(--text-light);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .container {
            background: var(--bg-light);
            padding: 25px;
            border-radius: 8px;
            max-width: 1200px;
            width: 100%;
            text-align: left;
            border: 2px solid var(--border-color);
            overflow: hidden;
            position: relative;
        }

        h1 {
            font-size: 32px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 25px;
            color: var(--highlight-color);
        }

        .carousel-card {
            background: var(--bg-light);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease;
        }

        .carousel-card:hover {
            transform: scale(1.05);
        }

        .carousel-item {
            text-align: center;
        }

        .carousel-inner {
            margin-bottom: 30px;
        }

        .carousel-control-prev-icon, .carousel-control-next-icon {
            background-color: var(--primary-color);
        }

        .card-title {
            font-size: 24px;
            color: var(--primary-color);
        }

        .card-body {
            font-size: 18px;
            color: var(--text-muted);
        }

        footer {
            margin-top: 20px;
            font-size: 14px;
            text-align: center;
            color: var(--text-muted);
        }

        footer a {
            color: var(--primary-color);
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }

        .timer {
            font-size: 22px;
            font-weight: bold;
            text-align: center;
            margin-top: 20px;
            color: var(--primary-color);
        }

        .chart-container {
            margin-top: 20px;
            padding: 20px;
            background: var(--bg-light);
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }

        .chart {
            max-width: 100%;
            height: 300px;
        }
    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>

    <div class="container">
        <h1>Dashboard</h1>

        <!-- Carousel for Features (News, Weather) -->
        <div id="featureCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <!-- Weather Card -->
                <div class="carousel-item active">
                    <div class="carousel-card">
                        <h3 class="card-title">Weather Updates</h3>
                        <p class="card-body">Loading weather data...</p>
                    </div>
                </div>

                <!-- News Card -->
                <div class="carousel-item">
                    <div class="carousel-card">
                        <h3 class="card-title">Latest News</h3>
                        <p class="card-body">Fetching latest news...</p>
                    </div>
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#featureCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#featureCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>

        <!-- Chart Section -->
        <div class="chart-container">
            <h3 class="card-title">User Activity</h3>
            <canvas id="userChart" class="chart"></canvas>
        </div>

        <!-- Footer with Dynamic Links -->
        <footer>
            <p>Powered by <a href="https://www.openweathermap.org/" target="_blank">OpenWeather</a> and <a href="https://newsapi.org/" target="_blank">NewsAPI</a>.</p>
        </footer>
    </div>

    <script>
        async function fetchWeatherAndNews() {
            try {
                // Fetch weather data
                const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_WEATHER_API_KEY');
                const weather = weatherResponse.data.weather[0].description;
                const temp = Math.round(weatherResponse.data.main.temp - 273.15); // Convert from Kelvin to Celsius

                // Update the weather card content
                document.querySelector('.carousel-item.active p').textContent = 'Current temperature: ' + temp + '°C, Weather: ' + weather;

                // Fetch news data
                const newsResponse = await axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=cd03f93fbfbe4a6a953a43ea0f7ee3c6');
                const news = newsResponse.data.articles[0].title;

                // Update the news card content
                document.querySelector('.carousel-item:nth-child(2) p').textContent = news;

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        // Call the function to fetch and display data
        fetchWeatherAndNews();

        // Chart.js setup for user activity
        const ctx = document.getElementById('userChart').getContext('2d');
        const userChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Active Users',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: 'var(--primary-color)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    </script>
</body>
</html>



`);
});
/**
 * Route configured in the Discord developer console, the redirect Url to which
 * the user is sent after approving the bot for their Discord account. This
 * completes a few steps:
 * 1. Uses the code to acquire Discord OAuth2 tokens
 * 2. Uses the Discord Access Token to fetch the user profile
 * 3. Stores the OAuth2 Discord Tokens in Redis / Firestore
 * 4. Lets the user know it's all good and to go back to Discord
 */
 app.get('/discord-oauth-callback', async (req, res) => {
  try {
    const code = req.query['code'];
    const discordState = req.query['state'];

    const { clientState } = req.signedCookies;
    if (clientState !== discordState) {
      console.error('State verification failed.');
      return res.sendStatus(403);
    }

    const tokens = await discord.getOAuthTokens(code);
    const meData = await discord.getUserData(tokens);
    const userId = meData.user.id;

    await storage.storeDiscordTokens(userId, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + tokens.expires_in * 1000,
    });

    const isBlacklisted = await checkForBlacklist(userId, tokens.access_token);

    if (isBlacklisted) {
      return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Failed</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
    <style>
    :root {
        --primary-color: #FF6347;
        --bg-dark: #0A0F1D;
        --bg-light: #101826;
        --text-light: #E0E6F1;
        --text-muted: #8892B0;
        --border-color: #FF6347;
    }
    body {
        font-family: 'Inter', sans-serif;
        background: var(--bg-dark);
        color: var(--text-light);
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 20px;
    }
    .container {
        background: var(--bg-light);
        padding: 25px;
        border-radius: 0;
        max-width: 380px;
        width: 100%;
        text-align: left;
        border: 2px solid var(--border-color);
        overflow: hidden;
        position: relative;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    h1 {
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        margin-bottom: 18px;
        color: var(--primary-color);
    }
    p {
        text-align: center;
    }
    footer {
        margin-top: 15px;
        font-size: 12px;
        text-align: center;
        color: var(--text-muted);
    }
    footer a {
        color: var(--primary-color);
        text-decoration: none;
    }
    footer a:hover {
        text-decoration: underline;
    }
    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>
    <div class="container">
        <h1><i class="fas fa-times-circle"></i> Verification Failed</h1>
        <p>Your verification has failed due to your presence in a blacklisted server.</p>
        <footer>
            <p>Need help? <a href="https://tln.framer.website/support">Contact Us</a></p>
        </footer>
    </div>
</body>
</html>
`);
    }

    await updateMetadata(userId);

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Lost Nemo</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
    <style>
    :root {
        --primary-color: #1E90FF;
        --bg-dark: #0A0F1D;
        --bg-light: #101826;
        --text-light: #E0E6F1;
        --text-muted: #8892B0;
        --border-color: #1E90FF;
    }
    body {
        font-family: 'Inter', sans-serif;
        background: var(--bg-dark);
        color: var(--text-light);
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 20px;
    }
    .container {
        background: var(--bg-light);
        padding: 25px;
        border-radius: 0;
        max-width: 380px;
        width: 100%;
        text-align: left;
        border: 2px solid var(--border-color);
        overflow: hidden;
        position: relative;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    h1 {
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        margin-bottom: 18px;
    }
    button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 12px;
        font-size: 16px;
        width: 100%;
        cursor: pointer;
        opacity: 1;
        transition: all 0.3s ease;
        border-radius: 0;
        font-weight: 600;
        text-transform: uppercase;
        margin-top: 10px;
    }
    button:hover {
        background: #187bcd;
    }
    footer {
        margin-top: 15px;
        font-size: 12px;
        text-align: center;
        color: var(--text-muted);
    }
    footer a {
        color: var(--primary-color);
        text-decoration: none;
    }
    footer a:hover {
        text-decoration: underline;
    }
    .timer {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin-top: 15px;
        color: var(--primary-color);
    }
    </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>
    <div class="container">
        <h1><i class="fas fa-check-circle"></i> Verification Successful</h1>
        <p class="text-center">Your verification was successful! You will be redirected shortly...</p>
        <div id="timer" class="timer">Redirecting in <span id="countdown">5</span> seconds...</div>
        <footer>
            <p>Need help? <a href="https://tln.framer.website/support">Contact Us</a></p>
        </footer>
    </div>
    <script>
        let countdownTime = 5;
        const countdownElement = document.getElementById("countdown");
        function updateCountdown() {
            if (countdownTime <= 0) {
                window.location.href = "https://discord.com/channels/@me";
            } else {
                countdownElement.textContent = countdownTime;
                countdownTime--;
            }
        }
        setInterval(updateCountdown, 1000);
    </script>
</body>
</html>
`);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

app.post('/update-metadata', async (req, res) => {
  try {
    const userId = req.body.userId;
    await updateMetadata(userId);
    res.sendStatus(204);
  } catch (e) {
    res.sendStatus(500);
  }
});

async function updateMetadata(userId) {
  const tokens = await storage.getDiscordTokens(userId);
  let metadata = {};

  try {
    const guildRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    const guilds = await guildRes.json();
    let isBlacklisted = false;

    for (const guild of guilds) {
      if (blacklistedGuildIds.includes(guild.id)) {
        isBlacklisted = true;
        break;
      }

      const roles = guild.roles.map(roleId => roleId);
      if (roles.some(roleId => blacklistedRoleIds.includes(roleId))) {
        isBlacklisted = true;
        break;
      }
    }

    metadata = {
      cookieseaten: 1483,
      allergictonuts: isBlacklisted,
      firstcookiebaked: '2003-12-20',
    };
  } catch (e) {
    console.error(`Error fetching external data: ${e.message}`);
  }

  await discord.pushMetadata(userId, tokens, metadata);
}

async function checkForBlacklist(userId, accessToken) {
  try {
    const guildRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const guilds = await guildRes.json();

    for (const guild of guilds) {
      if (blacklistedGuildIds.includes(guild.id)) {
        return true;
      }

      const roles = guild.roles.map(roleId => roleId);
      if (roles.some(roleId => blacklistedRoleIds.includes(roleId))) {
        return true;
      }
    }

    return false;
  } catch (e) {
    console.error(`Error checking for blacklist: ${e.message}`);
    return false;
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Verification app listening on port ${port}`);
});
