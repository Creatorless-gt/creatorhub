import express from 'express';
import cookieParser from 'cookie-parser';
import fetch from 'node-fetch'; // For making API requests
import config from './config.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as discord from './discord.js';
import * as storage from './storage.js';
import { getOAuthUrl } from './discord.js';


/**
 * Main HTTP server used for the bot.
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


app.use((req, res, next) => {
    const userAgent = req.get('User-Agent');

   
    if (userAgent && (userAgent.includes('Postman') || userAgent.includes('curl') || userAgent.includes('bot'))) {
        const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        return res.status(403).send(randomMessage); // Return a playful error message
    }

    next(); 
});



const validApiKeys = [
  "a1b2c3d4de5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90",
  "0f1e2d3c4b5a69788796ea5b4c3d2e1f00f1e2d3c4b5a69788796a5b4c3d2e1f0",
  "1234567890abcdef1s234567890abcdef1234567890abcdef1234567890abcdef",
  "fedcba0987654321fedcbta0987654321fedcba0987654321fedcba0987654321",
  "abcdef1234567890habcdef1234567890abcdef1234567890abcdef1234567890",
  "0a1b2c3d4e5f6071e8293a4b5c6d7e8f90f0e1d2c3b4a5968778695a4b3c2d1e0f",
  "112233445566778o89900aabbccddeeff11223344556677889900aabbccddeeff",
  "ffeeddccbbaar00998877665544332211ffeeddccbbaa00998877665544332211"
];


function verifyApiKey(req, res, next) {
  const apiKey = req.header('Authorization') || req.query.apiKey;
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  next();
}

/**
 * Splits an object into an array of smaller objects, each containing up to 'chunkSize' key-value pairs.
 * @param {Object} obj - The original object to be split.
 * @param {number} chunkSize - The maximum number of key-value pairs per chunk.
 * @returns {Array} - An array of chunked objects.
 */
const chunkObject = (obj, chunkSize) => {
  const entries = Object.entries(obj);
  const chunks = [];
  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);
    chunks.push(Object.fromEntries(chunk));
  }
  return chunks;
};

app.post('/process-items', (req, res) => {
  try {
    // Retrieve and parse 'worldBlocks' and 'floatingItems' from request headers
    const worldBlocks = JSON.parse(req.headers['worldblocks'] || '{}');
    const floatingItems = JSON.parse(req.headers['floatingitems'] || '{}');

    // Chunk the objects into smaller objects with a maximum of 20 key-value pairs each
    const chunkSize = 20;
    const worldBlockChunks = chunkObject(worldBlocks, chunkSize);
    const floatingItemChunks = chunkObject(floatingItems, chunkSize);

    // Prepare the response object
    const response = {};

    worldBlockChunks.forEach((chunk, index) => {
      response[`Blocks${index + 1}`] = chunk;
    });

    floatingItemChunks.forEach((chunk, index) => {
      response[`Float${index + 1}`] = chunk;
    });

    // Send the response
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input data' });
  }
});


app.get('/data', verifyApiKey, async (req, res) => {
  try {
    // Define all API endpoints
    const endpoints = {
      // 1. Bitcoin price from Coindesk
      bitcoin: 'https://api.coindesk.com/v1/bpi/currentprice.json',
      // 2. Stocks quotes from Yahoo Finance (AAPL, GOOGL, MSFT)
      stocks: 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL,GOOGL,MSFT',
      // 3. Weather data for New York (latitude=40.71, longitude=-74.01) from Open-Meteo
      weather: 'https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&hourly=temperature_2m',
      // 4. A random joke from Official Joke API
      joke: 'https://official-joke-api.appspot.com/random_joke',
      // 5. A random quote from Quotable
      quote: 'https://api.quotable.io/random',
      // 6. A cat fact from Catfact.ninja
      catFact: 'https://catfact.ninja/fact',
      // 7. A random dog image from Dog CEO
      dogImage: 'https://dog.ceo/api/breeds/image/random',
      // 8. Global COVID-19 stats from disease.sh
      covid: 'https://disease.sh/v3/covid-19/all',
      // 9. Latest exchange rates from exchangerate.host
      exchangeRates: 'https://api.exchangerate.host/latest',
      // 10. Random advice from adviceslip API
      advice: 'https://api.adviceslip.com/advice'
    };

    // Map each endpoint to a fetch promise.
    const requests = Object.entries(endpoints).map(([key, url]) =>
      fetch(url).then(response => response.json()).then(data => ({ key, data }))
    );

    // Await all fetches concurrently.
    const results = await Promise.all(requests);

    // Aggregate results into an object.
    const aggregatedData = results.reduce((acc, { key, data }) => {
      // Some APIs wrap data in an outer property, adjust as needed.
      if (key === 'advice' && data.slip) {
        acc[key] = data.slip;
      } else {
        acc[key] = data;
      }
      return acc;
    }, {});

    res.json(aggregatedData);
  } catch (error) {
    console.error("Error fetching aggregated data:", error);
    res.status(500).json({ error: "Error fetching aggregated data" });
  }
});




 app.get('/', (req, res) => {
   res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta Data -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="CreatorHub is a futuristic platform for creators, gamers, and tech enthusiasts. Join our dynamic community to innovate, collaborate, and thrive in a digital space." />
  <meta name="keywords" content="CreatorHub, futuristic, community, creators, gamers, innovation, collaboration, technology" />
  <meta name="author" content="CreatorHub" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#0656bf" />

  <!-- Open Graph Tags -->
  <meta property="og:title" content="CreatorHub - The Ultimate Creative Space" />
  <meta property="og:description" content="Join CreatorHub, a futuristic community where creators, gamers, and tech enthusiasts innovate, collaborate, and thrive." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://creatorhub.glitch.me/" />
  <meta property="og:image" content="https://example.com/og-image.jpg" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="CreatorHub - The Ultimate Creative Space" />
  <meta name="twitter:description" content="Join CreatorHub, a futuristic community where creators, gamers, and tech enthusiasts innovate, collaborate, and thrive." />
  <meta name="twitter:image" content="https://example.com/twitter-image.jpg" />

  <link rel="icon" href="https://static.vecteezy.com/system/resources/thumbnails/013/757/834/small/abstract-letter-c-logo-illustration-in-trendy-and-minimal-style-png.png" type="image/x-icon" />
  <title>CreatorHub | The Ultimate Creative Space</title>

  <!-- External Fonts & Libraries -->
  <!-- Futuristic Font: Orbitron for headings and Inter for body -->
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" rel="stylesheet" />

  <!-- Custom Captcha CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/custom-recaptcha/dist/custom_captcha.min.css">

  <style>
    /* Global Styles */
    body {
      font-family: 'Inter', sans-serif;
      background: #121212;
      color: #eee;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
    h1, h2, h3, h4, h5 {
      font-family: 'Orbitron', sans-serif;
    }
    a {
      color: #65a9ff;
      text-decoration: none;
    }
    a:hover {
      color: #fff;
    }

    /* Navigation */
    .navbar {
      background: rgba(0,0,0,0.85);
      transition: background 0.3s ease;
    }
    .navbar-brand, .nav-link {
      font-weight: 600;
      text-transform: uppercase;
      color: #fff !important;
    }
    .nav-link:hover {
      color: #65a9ff !important;
    }

    /* Hero Section */
    header {
      position: relative;
      height: 100vh;
      background: url('https://source.unsplash.com/1600x900/?futuristic,technology') no-repeat center center/cover;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    header::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 1;
    }
    header .hero-content {
      position: relative;
      z-index: 2;
      padding: 0 20px;
    }
    #typed {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 20px;
    }
    header p {
      font-size: 1.25rem;
      margin-top: 20px;
    }
    .scroll-down {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2rem;
      color: #fff;
      animation: bounce 2s infinite;
      z-index: 2;
    }
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }

    /* Sections */
    section {
      padding: 80px 20px;
      text-align: center;
    }
    section:nth-of-type(even) {
      background: #202020;
    }
    section h2 {
      font-size: 2.75rem;
      margin-bottom: 50px;
    }
    .card {
      background: #252525;
      border: none;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      margin-bottom: 30px;
      transition: transform 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
    }
    .card-title {
      font-size: 1.5rem;
      margin-bottom: 15px;
    }
    .card-text {
      font-size: 1rem;
    }

    /* FAQ Accordion */
    .accordion-button {
      background-color: #252525;
      color: #fff;
    }
    .accordion-button:not(.collapsed) {
      background-color: #1a1a1a;
      color: #65a9ff;
    }
    .accordion-body {
      background-color: #1a1a1a;
      color: #eee;
    }

    /* More Info Section */
    .testimonial {
      font-style: italic;
      border-left: 4px solid #65a9ff;
      padding-left: 20px;
      margin: 20px 0;
    }

    /* Contact Form */
    .contact-form {
      max-width: 600px;
      margin: auto;
    }
    .contact-form .form-control {
      background: #252525;
      border: none;
      color: #fff;
    }
    .contact-form .form-control::placeholder {
      color: #bbb;
    }
    .contact-form .form-control:focus {
      background: #333;
      color: #fff;
    }
    .contact-form .btn {
      background: #0656bf;
      border: none;
    }
    .contact-form .btn:hover {
      background: #054a97;
    }

    /* Footer */
    footer {
      background: #111;
      text-align: center;
      padding: 20px 10px;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>

  <!-- Navigation Bar -->
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container">
      <a class="navbar-brand" href="/">CreatorHub</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" 
              aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="fas fa-bars"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="#home">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
          <li class="nav-item"><a class="nav-link" href="#features">Features</a></li>
          <li class="nav-item"><a class="nav-link" href="#community">Community</a></li>
          <li class="nav-item"><a class="nav-link" href="#more-info">More Info</a></li>
          <li class="nav-item"><a class="nav-link" href="#faq">FAQ</a></li>
          <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
          <li class="nav-item"><a class="nav-link" href="/support">Support</a></li>
          <li class="nav-item"><a class="nav-link" href="/tickets">Tickets</a></li>
          <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
          <li class="nav-item"><a class="nav-link" href="/staff">Staff</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <header id="home">
    <div class="hero-content" data-aos="fade-up">
      <h1>Welcome to CreatorHub</h1>
      <div id="typed"></div>
      <p data-aos="fade-up" data-aos-delay="500">
        A futuristic space where creators, gamers, and tech enthusiasts unite to innovate, collaborate, and thrive.
      </p>
    </div>
    <div class="scroll-down">
      <a href="#about"><i class="fas fa-arrow-down"></i></a>
    </div>
  </header>

  <!-- About Section -->
  <section id="about">
    <div class="container" data-aos="fade-up">
      <h2>About CreatorHub</h2>
      <p>
        CreatorHub is a cutting-edge platform that brings together creative minds, gamers, and technology enthusiasts from around the globe.
        Our mission is to foster innovation, collaboration, and growth in a dynamic digital community. Discover resources, join events, and connect with like-minded individuals.
      </p>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features">
    <div class="container" data-aos="fade-up">
      <h2>Our Features</h2>
      <div class="row">
        <div class="col-md-4" data-aos="fade-right" data-aos-delay="200">
          <div class="card p-3">
            <i class="fas fa-users fa-3x"></i>
            <h5 class="card-title">Community Driven</h5>
            <p class="card-text">Engage with a passionate community of creators and innovators shaping the future.</p>
          </div>
        </div>
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="400">
          <div class="card p-3">
            <i class="fas fa-laptop-code fa-3x"></i>
            <h5 class="card-title">Innovation Hub</h5>
            <p class="card-text">Access state-of-the-art resources, tutorials, and tools to empower your creative journey.</p>
          </div>
        </div>
        <div class="col-md-4" data-aos="fade-left" data-aos-delay="600">
          <div class="card p-3">
            <i class="fas fa-lightbulb fa-3x"></i>
            <h5 class="card-title">Inspiration & Growth</h5>
            <p class="card-text">Discover new ideas, be inspired by success stories, and unlock your creative potential.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Community Section -->
  <section id="community">
    <div class="container" data-aos="fade-up">
      <h2>Community & News</h2>
      <p>
        Stay informed with the latest updates, creator spotlights, and upcoming events that celebrate innovation and collaboration.
      </p>
      <div class="row">
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
          <div class="card p-3">
            <h5 class="card-title">Creator Spotlight</h5>
            <p class="card-text">Meet the talented creators making waves in our community.</p>
          </div>
        </div>
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="400">
          <div class="card p-3">
            <h5 class="card-title">Latest News</h5>
            <p class="card-text">Catch up on the trends, updates, and events driving the future of creativity.</p>
          </div>
        </div>
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="600">
          <div class="card p-3">
            <h5 class="card-title">Upcoming Events</h5>
            <p class="card-text">Join hackathons, webinars, and live Q&A sessions to network and learn.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- More Info Section -->
  <section id="more-info">
    <div class="container" data-aos="fade-up">
      <h2>More Info</h2>
      <p>
        Explore additional insights about CreatorHub. We offer exclusive tutorials, community challenges, and expert-led webinars to boost your creative journey.
      </p>
      <div class="row">
        <div class="col-md-6" data-aos="fade-right" data-aos-delay="200">
          <h4>Testimonials</h4>
          <div class="testimonial">
            "CreatorHub has transformed the way I collaborate with fellow creators. The community is inspiring!"<br>
            <small>- Alex R.</small>
          </div>
          <div class="testimonial">
            "A truly innovative space for anyone looking to push their creative limits."<br>
            <small>- Jamie L.</small>
          </div>
        </div>
        <div class="col-md-6" data-aos="fade-left" data-aos-delay="200">
          <h4>Resources & Tutorials</h4>
          <p>
            Access a library of cutting-edge tutorials, guides, and live sessions designed to help you stay ahead in the creative world.
          </p>
          <p>
            From coding workshops to design masterclasses, our resources are tailored to fuel your growth.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section id="faq">
    <div class="container" data-aos="fade-up">
      <h2>Frequently Asked Questions</h2>
      <div class="accordion" id="faqAccordion">
        <!-- FAQ Item 1 -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="faqHeadingOne">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseOne" aria-expanded="true" aria-controls="faqCollapseOne">
              What is CreatorHub?
            </button>
          </h2>
          <div id="faqCollapseOne" class="accordion-collapse collapse show" aria-labelledby="faqHeadingOne" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
              CreatorHub is a futuristic platform designed to connect creators, gamers, and tech enthusiasts in a collaborative community where innovation meets inspiration.
            </div>
          </div>
        </div>
        <!-- FAQ Item 2 -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="faqHeadingTwo">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseTwo" aria-expanded="false" aria-controls="faqCollapseTwo">
              How do I join the community?
            </button>
          </h2>
          <div id="faqCollapseTwo" class="accordion-collapse collapse" aria-labelledby="faqHeadingTwo" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
              Simply sign up for an account on our platform. Registration is fast and secure. Once registered, you can start engaging in discussions, join events, and collaborate with peers.
            </div>
          </div>
        </div>
        <!-- FAQ Item 3 -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="faqHeadingThree">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseThree" aria-expanded="false" aria-controls="faqCollapseThree">
              What are the benefits of using CreatorHub?
            </button>
          </h2>
          <div id="faqCollapseThree" class="accordion-collapse collapse" aria-labelledby="faqHeadingThree" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
              Enjoy access to exclusive resources, live events, mentorship opportunities, and a community-driven platform that helps you grow your creative skills and network.
            </div>
          </div>
        </div>
        <!-- FAQ Item 4 -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="faqHeadingFour">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseFour" aria-expanded="false" aria-controls="faqCollapseFour">
              How is my data protected on CreatorHub?
            </button>
          </h2>
          <div id="faqCollapseFour" class="accordion-collapse collapse" aria-labelledby="faqHeadingFour" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
              We use industry-standard encryption and security protocols to ensure your data remains safe and private. Our platform is regularly audited and updated to meet the latest security standards.
            </div>
          </div>
        </div>
        <!-- FAQ Item 5 -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="faqHeadingFive">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseFive" aria-expanded="false" aria-controls="faqCollapseFive">
              How does the custom captcha work?
            </button>
          </h2>
          <div id="faqCollapseFive" class="accordion-collapse collapse" aria-labelledby="faqHeadingFive" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
              Our advanced custom captcha extends Google reCAPTCHA v3 with a branded, invisible verification process and a custom checkbox skin. It uses a scoring mechanism and requires backend validation for enhanced security.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section id="contact">
    <div class="container" data-aos="fade-up">
      <h2>Contact Us</h2>
      <p>If you have any questions or need support, please fill out the form below.</p>
      <form class="contact-form" action="#" method="post">
        <div class="mb-3">
          <input type="text" class="form-control" placeholder="Your Name" required>
        </div>
        <div class="mb-3">
          <input type="email" class="form-control" placeholder="Your Email" required>
        </div>
        <div class="mb-3">
          <textarea class="form-control" rows="5" placeholder="Your Message" required></textarea>
        </div>
        <!-- Advanced Custom Captcha Integration -->
        <div class="mb-3">
          <captcha required>Please wait while the Captcha is loading...</captcha>
        </div>
        <button type="submit" class="btn btn-primary">Send Message</button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <p>&copy; 2025 CreatorHub. All rights reserved.</p>
      <p>
        Follow us on 
        <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
        <a href="#" target="_blank"><i class="fab fa-discord"></i></a>
        <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
      </p>
    </div>
  </footer>

  <!-- External Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/typed.js@2.0.12"></script>
  <!-- Custom Captcha Script -->
  <script src="https://cdn.jsdelivr.net/npm/custom-recaptcha/dist/custom_captcha.min.js"></script>
  <!-- Initialize Scripts -->
  <script>
    // Initialize AOS for scroll animations
    AOS.init({
      duration: 1000,
      easing: 'ease-out-back',
      once: true
    });

    // Initialize Typed.js for dynamic welcome text
    var typed = new Typed("#typed", {
      strings: ["Explore the Future.", "Innovate. Create. Inspire.", "Join the Revolution of Creativity."],
      typeSpeed: 50,
      backSpeed: 25,
      backDelay: 1500,
      loop: true
    });

    // Initialize the Custom Captcha widget with your reCAPTCHA v3 key and custom configuration.
    CustomCaptcha.init({
      siteKey: "6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB",
      text: "Secure Check",
      label: "I'm not a robot",
      logo: "https://static.vecteezy.com/system/resources/thumbnails/013/757/834/small/abstract-letter-c-logo-illustration-in-trendy-and-minimal-style-png.png",
      theme: "dark"
    });

    // Ensure Custom Captcha is completed before form submission
    document.querySelector(".contact-form").addEventListener("submit", function(e) {
      var captchaResponse = document.querySelector('input[name="g-recaptcha-response"]');
      if (!captchaResponse || captchaResponse.value.trim() === "") {
        e.preventDefault();
        alert("Please complete the captcha before submitting.");
      }
    });
    
    
    
  </script>
</body>
</html>
`);
 });

app.get('/lucifer', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Advanced Login with Custom Draggable Captcha (Dark Theme)</title>
  <!-- Load Google Fonts -->
  <link href="https://fonts.googleapis.com/css?family=Roboto:200,500&display=swap" rel="stylesheet">
  <!-- Load reCAPTCHA v3 script (using your site key) -->
  <script src="https://www.google.com/recaptcha/api.js?render=your_site_key_here"></script>
  <style>
    /* Global Dark Theme Styles */
    body {
      background-color: #121212;
      color: #e0e0e0;
      font-family: 'Roboto', sans-serif;
      margin: 0;
      padding: 0;
    }
    .login-container {
      width: 320px;
      margin: 80px auto;
      padding: 30px;
      background-color: #1e1e1e;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(0,0,0,0.5);
    }
    .login-container h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #fff;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #ccc;
    }
    .form-group input {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 5px;
      background-color: #333;
      color: #e0e0e0;
      font-size: 14px;
    }
    #loginForm button[type="submit"] {
      width: 100%;
      padding: 12px;
      background-color: #4CAF50;
      color: #fff;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
    }
    #loginForm button[type="submit"]:hover {
      background-color: #45a049;
    }
    /* Captcha Button */
    .captcha-btn {
      display: block;
      width: 100%;
      padding: 12px;
      margin-top: 15px;
      background-color: #333;
      border: 1px solid #555;
      border-radius: 5px;
      text-align: center;
      color: #e0e0e0;
      cursor: pointer;
      font-size: 16px;
    }
    .captcha-btn:hover {
      background-color: #444;
    }
    /* Modal Styles */
    .modal {
      position: fixed;
      z-index: 2000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: none;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .draggable {
      background-color: #1e1e1e;
      border: 2px solid #555;
      border-radius: 8px;
      width: 350px;
      position: relative;
      box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    }
    .modal-header {
      padding: 10px;
      background-color: #333;
      cursor: move;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      color: #fff;
    }
    .modal-header span {
      font-size: 22px;
      font-weight: bold;
      color: #fff;
      cursor: pointer;
    }
    .modal-body {
      padding: 20px;
    }
    /* Custom Captcha Styles & Animations */
    captcha {
      display: block;
      width: fit-content;
      height: auto;
      min-width: 1em;
      min-height: 1em;
      border: .15em solid #777;
      border-radius: .2em;
      padding: 1.4em 1em;
      font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
      font-weight: 200;
      color: #e0e0e0;
      background-color: #1e1e1e;
    }
    #grecaptcha-badge { display: none; }
    .custom-captcha {
      --_cc-bg: #2a2a2a;
      --_cc-border: #555;
      --_cc-text-color: #e0e0e0;
      --_cc-checkmark-bg: #333;
      --_cc-checkmark-bg-hover: #444;
      --_cc-checkmark-border: #777;
      --_cc-checkmark-border-hover: #999;
      --_cc-check-color: #4CAF50;
      --_cc-loading-bg: #555;
      --_cc-loading-spinner: #4CAF50;
      --_cc-brand-color: #4CAF50;
      all: revert;
      background-color: var(--_cc-bg);
      border: .2em solid var(--_cc-border);
      border-radius: .35em;
      color: var(--_cc-text-color);
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: fit-content;
      position: relative;
      font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: .78em;
    }
    .custom-captcha._cc-dark {
      --_cc-bg: #222;
      --_cc-border: #484848;
      --_cc-text-color: #eee;
    }
    .custom-captcha * { all: revert; }
    .custom-captcha ._cc-text {
      font-size: 1.2em;
      font-weight: 200;
      margin-right: 1em;
    }
    .custom-captcha ._cc-spinner {
      position: relative;
      width: 2em;
      height: 2em;
      display: flex;
      margin: 2em 1em;
      align-items: center;
      justify-content: center;
    }
    .custom-captcha ._cc-checkmark {
      display: inline-flex;
      background-color: var(--_cc-checkmark-bg);
      border: .15em solid var(--_cc-checkmark-border);
      border-radius: .2em;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 0;
      width: 1.7em;
      height: 1.7em;
      cursor: pointer;
    }
    .custom-captcha ._cc-checkmark span {
      position: relative;
      margin-top: -.2em;
      transform: rotate(45deg);
      width: .75em;
      height: 1.2em;
      opacity: 0;
    }
    .custom-captcha ._cc-checkmark span:after,
    .custom-captcha ._cc-checkmark span:before {
      content: "";
      position: absolute;
      background-color: var(--_cc-check-color);
    }
    .custom-captcha ._cc-checkmark span:after {
      height: .2em;
      bottom: 0;
      left: 0;
    }
    .custom-captcha ._cc-checkmark span:before {
      width: .2em;
      bottom: 0;
      right: 0;
    }
    .custom-captcha:not(._cc-loading):not(._cc-loaded) ._cc-checkmark:hover {
      background-color: var(--_cc-checkmark-bg-hover);
      border-color: var(--_cc-checkmark-border-hover);
    }
    .custom-captcha ._cc-code {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      opacity: 0;
      box-sizing: border-box;
      word-break: break-all;
      resize: none;
    }
    .custom-captcha ._cc-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      align-self: flex-start;
      margin: .5em 1em;
      margin-left: auto;
    }
    .custom-captcha ._cc-logo img {
      height: 3em;
      width: 3em;
      border-radius: .35em;
    }
    .custom-captcha ._cc-logo._cc-rounded img {
      border-radius: 50%;
    }
    .custom-captcha ._cc-logo p {
      color: var(--_cc-brand-color);
      margin: .4em 0 0 0;
      font-size: 1em;
      font-weight: 500;
    }
    /* Keyframe Animations for Captcha Loading/Success */
    @keyframes _cc-loading {
      0% { width: 0; height: 0; border-width: 0.5em; }
      50% { width: 0; height: 0; border-width: 1em; border-color: var(--_cc-loading-bg); }
      100% { width: 2em; height: 2em; border-width: 0.3em; border-color: var(--_cc-loading-bg); }
    }
    @keyframes _cc-waiting {
      0% { width: 2em; height: 2em; border-radius: 50%; background-color: transparent; border-width: 0.3em; border-color: var(--_cc-loading-bg); border-right-color: var(--_cc-loading-spinner); }
      100% { width: 2em; height: 2em; border-radius: 50%; background-color: transparent; border-width: 0.3em; border-color: var(--_cc-loading-bg); border-right-color: var(--_cc-loading-spinner); transform: rotate(720deg); }
    }
    @keyframes _cc-loader-disappear {
      0% { border-radius: 50%; border-width: 0.3em; border-color: var(--_cc-loading-bg); background-color: transparent; }
      100% { border-radius: 50%; border-width: 0.3em; border-color: transparent; background-color: transparent; }
    }
    @keyframes captcha-fadein {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes captcha-bottomslide {
      0% { width: 0; }
      100% { width: 100%; }
    }
    @keyframes captcha-rightslide {
      0% { height: 0; }
      100% { height: 100%; }
    }
  </style>
</head>
<body>
  <!-- Login Form -->
  <div class="login-container">
    <form id="loginForm">
      <h2>Login</h2>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" placeholder="Enter username" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter password" required>
      </div>
      <button type="submit">Login</button>
      <!-- Visible captcha button -->
      <div class="captcha-btn" id="openCaptcha">I'm not a robot</div>
    </form>
  </div>

  <!-- Draggable Modal for Captcha -->
  <div id="captchaModal" class="modal">
    <div id="captchaChallenge" class="draggable">
      <div class="modal-header">
        <h3>Captcha Challenge</h3>
        <span id="closeModal">&times;</span>
      </div>
      <div class="modal-body">
        <!-- The <captcha> tag is replaced by the custom captcha UI -->
        <captcha id="customCaptcha"></captcha>
      </div>
    </div>
  </div>

  <script>
    /* Advanced Draggable Modal with Mouse & Touch Support */
    (function() {
      const modal = document.getElementById("captchaModal");
      const dragItem = document.getElementById("captchaChallenge");
      const header = dragItem.querySelector(".modal-header");
      let pos = { top: 0, left: 0, x: 0, y: 0 };

      const mouseDownHandler = function(e) {
        pos = {
          left: dragItem.offsetLeft,
          top: dragItem.offsetTop,
          x: e.clientX,
          y: e.clientY
        };
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      };
      const mouseMoveHandler = function(e) {
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;
        dragItem.style.left = pos.left + dx + 'px';
        dragItem.style.top = pos.top + dy + 'px';
      };
      const mouseUpHandler = function() {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
      header.addEventListener('mousedown', mouseDownHandler);
      // Touch events
      header.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        pos = {
          left: dragItem.offsetLeft,
          top: dragItem.offsetTop,
          x: touch.clientX,
          y: touch.clientY
        };
        document.addEventListener('touchmove', touchMoveHandler);
        document.addEventListener('touchend', touchEndHandler);
      });
      function touchMoveHandler(e) {
        const touch = e.touches[0];
        const dx = touch.clientX - pos.x;
        const dy = touch.clientY - pos.y;
        dragItem.style.left = pos.left + dx + 'px';
        dragItem.style.top = pos.top + dy + 'px';
      }
      function touchEndHandler() {
        document.removeEventListener('touchmove', touchMoveHandler);
        document.removeEventListener('touchend', touchEndHandler);
      }
    })();

    /* Modal Open/Close Logic */
    document.addEventListener("DOMContentLoaded", function() {
      const openCaptchaBtn = document.getElementById("openCaptcha");
      const captchaModal = document.getElementById("captchaModal");
      const closeModal = document.getElementById("closeModal");

      openCaptchaBtn.addEventListener("click", function() {
        captchaModal.style.display = "flex";
        // Reset modal position
        const challenge = document.getElementById("captchaChallenge");
        challenge.style.left = '';
        challenge.style.top = '';
      });
      closeModal.addEventListener("click", function() {
        captchaModal.style.display = "none";
      });
      window.addEventListener("click", function(event) {
        if (event.target === captchaModal) {
          captchaModal.style.display = "none";
        }
      });
      
      // Initialize CustomCaptcha (v3 integration)
      if (window.CustomCaptcha && typeof CustomCaptcha.init === "function") {
        CustomCaptcha.init({ siteKey: "your_site_key_here", theme: "dark" });
      }
    });

    /* Custom Captcha Code with reCAPTCHA v3 */
    (function(){
      if(window.CustomCaptcha === undefined) {
        window.CustomCaptcha = {
          id: null,
          logo: "domain",
          name: "g-recaptcha-response",
          text: "reCAPTCHA",
          descriptions: {
            hu:"Nem vagy robot",
            en:"I'm not a robot",
            de:"Ich bin kein Roboter.",
            sk:"Nie som robot",
            ro:"Nu sunt robot",
            hr:"Nisam robot",
            fr:"Je ne suis pas un robot"
          },
          lang:"auto",
          theme:"dark",
          _prefix:"_cc-",
          _last_response:""
        };
      }
      // reCAPTCHA v3 is loaded via the script tag in the head
      if (!document.getElementById("grecaptcha-badge")) {
        const badge = document.createElement("div");
        badge.id = "grecaptcha-badge";
        document.body.appendChild(badge);
      }
      CustomCaptcha.reset = function(e = null){
        if(!CustomCaptcha._initialized) throw Error("CustomCaptcha is not initialized!");
        if(e){
          document.querySelectorAll(".custom-captcha").forEach(function(t){
            if(t.querySelector("."+CustomCaptcha._prefix+"code").value == e){
              t.querySelector("."+CustomCaptcha._prefix+"code").value = "";
              t.classList.remove(CustomCaptcha._prefix + "loaded");
            }
          });
        } else {
          CustomCaptcha._last_response = "";
          document.querySelectorAll(".custom-captcha").forEach(function(el){
            el.querySelector("."+CustomCaptcha._prefix+"code").value = "";
            el.classList.remove(CustomCaptcha._prefix + "loaded");
          });
        }
      };
      CustomCaptcha.init = function(options){
        if(CustomCaptcha._initialized) throw Error("CustomCaptcha is already initialized!");
        if(typeof options !== "object" || !options.siteKey){
          throw Error("Option 'siteKey' is required!");
        }
        CustomCaptcha.siteKey = options.siteKey;
        ["logo","name","id","text","lang","theme","label"].forEach(function(key){
          if(options[key]) CustomCaptcha[key] = options[key];
        });
        CustomCaptcha._initialized = true;
        // For reCAPTCHA v3, no widget is rendered – we simply execute the token request.
        // Process all <captcha> tags.
        document.querySelectorAll("captcha").forEach(function(el){
          const darkTheme = (el.getAttribute("theme") || CustomCaptcha.theme) === "dark";
          let lang = (el.getAttribute("lang") || CustomCaptcha.lang).toLowerCase();
          lang = lang === "auto" ? navigator.language.split("-")[0] : lang;
          const label = el.getAttribute("label") || CustomCaptcha.label || CustomCaptcha.descriptions[lang] || CustomCaptcha.descriptions.en;
          const logoUrlDefault = "https://i.imgur.com/fzqbY05.png";
          let encodedLogo = encodeURI(el.getAttribute("logo") || CustomCaptcha.logo);
          if(encodedLogo === "domain"){
            if(window.location.host.length > 0){
              const favicon_api = "https://icons.duckduckgo.com/ip3/" + window.location.host + ".ico";
              const favicon = "http://" + window.location.host + "/favicon.ico";
              encodedLogo = "https://images.weserv.nl/?maxage=1d&url=" + encodeURI(favicon) + "&default=" + encodeURI(logoUrlDefault);
              encodedLogo = "https://images.weserv.nl/?maxage=1d&url=" + encodeURI(favicon_api) + "&default=" + encodeURIComponent(encodedLogo);
            } else {
              encodedLogo = logoUrlDefault;
            }
          } else {
            const a = document.createElement("a");
            a.href = encodedLogo;
            encodedLogo = a.href;
            a.remove();
            try {
              new URL(encodedLogo);
              encodedLogo = "https://images.weserv.nl/?maxage=1d&url=" + encodeURI(encodedLogo) + "&default=" + encodeURI(logoUrlDefault);
            } catch(err){
              encodedLogo = logoUrlDefault;
            }
          }
          const inputName = el.getAttribute("name") || CustomCaptcha.name;
          const elementId = el.getAttribute("id") || CustomCaptcha.id || false;
          let text = el.getAttribute("text") || CustomCaptcha.text;
          text = text.length < 1 ? "reCAPTCHA" : text;
          const container = document.createElement("div");
          container.className = el.className;
          container.classList.add("custom-captcha");
          if(el.hasAttribute("logo-rounded")) container.classList.add(CustomCaptcha._prefix + "rounded");
          if(darkTheme) container.classList.add(CustomCaptcha._prefix + "dark");
          if(el.hasAttribute("required")) container.setAttribute("required", true);
          const spinnerDiv = document.createElement("div");
          spinnerDiv.classList.add(CustomCaptcha._prefix + "spinner");
          const buttonElem = document.createElement("button");
          buttonElem.classList.add(CustomCaptcha._prefix + "checkmark");
          buttonElem.type = "button";
          buttonElem.innerHTML = "<span>&nbsp;</span>";
          spinnerDiv.appendChild(buttonElem);
          container.appendChild(spinnerDiv);
          const textDiv = document.createElement("div");
          textDiv.classList.add(CustomCaptcha._prefix + "text");
          textDiv.innerText = label;
          container.appendChild(textDiv);
          const logoDiv = document.createElement("div");
          logoDiv.classList.add(CustomCaptcha._prefix + "logo");
          if(el.hasAttribute("text-absolute")) logoDiv.classList.add(CustomCaptcha._prefix + "absolute");
          const img = document.createElement("img");
          img.setAttribute("draggable", false);
          img.src = encodedLogo;
          logoDiv.appendChild(img);
          const p = document.createElement("p");
          p.innerText = text;
          logoDiv.appendChild(p);
          container.appendChild(logoDiv);
          const textarea = document.createElement("textarea");
          textarea.classList.add(CustomCaptcha._prefix + "code");
          textarea.setAttribute("tabindex", "-1");
          textarea.name = inputName;
          if(elementId) { textarea.id = elementId; }
          if(el.hasAttribute("required")) textarea.setAttribute("required", true);
          container.appendChild(textarea);
          el.replaceWith(container);
        });
        // Attach click handler to custom captcha containers
        document.addEventListener("click", function(e){
          const targetCaptcha = e.target.closest(".custom-captcha:not(."+CustomCaptcha._prefix+"loading):not(."+CustomCaptcha._prefix+"loaded)");
          if(targetCaptcha){
            targetCaptcha.classList.add(CustomCaptcha._prefix + "loading");
            // Execute reCAPTCHA v3 with action "submit"
            grecaptcha.execute(CustomCaptcha.siteKey, {action: "submit"}).then(function(token){
              setTimeout(function(){
                let response = token || "";
                if(response !== ""){
                  CustomCaptcha._last_response = response;
                } else if(CustomCaptcha._last_response !== ""){
                  response = CustomCaptcha._last_response;
                }
                // Clear any hidden textarea value (if needed)
                const badgeTextarea = document.querySelector("#grecaptcha-badge textarea");
                if(badgeTextarea) badgeTextarea.value = "";
                targetCaptcha.classList.remove(CustomCaptcha._prefix + "loading");
                targetCaptcha.querySelector("."+CustomCaptcha._prefix+"code").value = response;
                if(response !== ""){
                  targetCaptcha.classList.add(CustomCaptcha._prefix + "loaded");
                  // Animate checkmark (fadein + slide animations)
                  const spanEl = targetCaptcha.querySelector("."+CustomCaptcha._prefix+"checkmark span");
                  if(spanEl){
                    spanEl.style.animation = "captcha-fadein 1s forwards, captcha-bottomslide 0.3s forwards, captcha-rightslide 0.5s 0.2s forwards";
                  }
                  // Optionally reset after 90 seconds
                  setTimeout(function(){ CustomCaptcha.reset(response); }, 90000);
                } else {
                  CustomCaptcha.reset();
                }
              }, 1000);
            }).catch(function(){
              CustomCaptcha.reset();
              const badgeTextarea = document.querySelector("#grecaptcha-badge textarea");
              if(badgeTextarea) badgeTextarea.value = "";
            });
          }
        });
      };
    })();
  </script>
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
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://www.google.com">
  <link rel="preconnect" href="https://www.gstatic.com" crossorigin>
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

    <div class="captcha-section" id="turnstile-container">
      <h3>Cloudflare Turnstile</h3>
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
      const turnstileContainer = document.getElementById("turnstile-container");
      const submitButton = document.getElementById("submit-button");
      const verificationStatus = document.getElementById("verificationStatus");
      const loadingOverlay = document.querySelector(".loading");
      const resendLink = document.getElementById("resendLink");
      const countdownElement = document.getElementById("countdown");

      const codeInputs = document.querySelectorAll(".code-input");
      codeInputs.forEach((input, index) => {
        input.addEventListener("input", () => {
          if (input.value.length === input.maxLength && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
          }
        });
      });

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

      let turnstileCompleted = false;

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

      window.onTurnstileComplete = function (token) {
        console.log("Turnstile completed with token:", token);
        turnstileCompleted = true;
        checkEnableButton();
      };

      function checkEnableButton() {
        if (turnstileCompleted) {
          submitButton.disabled = false;
        }
      }

      loadTurnstile();

      submitButton.addEventListener("click", () => {
        loadingOverlay.classList.add("active");
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

  // Store the signed state param in the user's cookies so we can verify later.
  res.cookie('clientState', state, { maxAge: 1000 * 60 * 5, signed: true });

  // Serve the HTML page that uses both reCAPTCHA v2 (checkbox) and v3.
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="The Unknown is a business-focused Growtopia fan community server with over 560,000 members. Join us to connect, collaborate, and thrive." />
  <meta name="keywords" content="Growtopia, community, server, The Unknown, gaming, fan community, thelostnemo glitch me, glitch nemo, tln, market" />
  <meta name="author" content="reCAPTCHA Verification" />
  <meta name="robots" content="noindex, nofollow">
  <meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="application-name" content="reCAPTCHA"><meta name="apple-mobile-web-app-title" content="reCAPTCHA"><meta name="apple-mobile-web-app-status-bar-style" content="black"><meta name="msapplication-tap-highlight" content="no">
  <link rel="icon" href="https://www.gstatic.com/recaptcha/express_onboarding/favicon.ico" sizes="32x32"><link rel="apple-touch-icon-precomposed" href="https://www.gstatic.com/recaptcha/express_onboarding/favicon.ico" sizes="32x32"><link rel="msapplication-square32x32logo" href="https://www.gstatic.com/recaptcha/express_onboarding/favicon.ico" sizes="32x32">
  <title>reCAPTCHA Verification</title>
  <link rel="preconnect" href="https://www.google.com">
  <link rel="preconnect" href="https://www.gstatic.com" crossorigin>
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
  <!-- Load reCAPTCHA API with v3 sitekey -->
  <script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB" async defer></script>
</head>
<body>
  <div class="container">
    <h1><i class="fas fa-user-lock"></i> Confirm Agreements</h1>
    <div class="checkboxes">
      <label><input type="checkbox" class="agreement-checkbox" name="termsAccepted"> I accept the <a href="/legal">Terms of Service</a></label>
      <label><input type="checkbox" class="agreement-checkbox" name="privacyAccepted"> I accept the <a href="/legal">Privacy Policy</a></label>
      <label><input type="checkbox" class="agreement-checkbox" name="eulaAccepted"> I accept the <a href="/eula">EULA</a></label>
    </div>
    <div class="accept-all-container">
      <label>
        <input type="checkbox" id="acceptAll"> Accept All Agreements
      </label>
    </div>
    <!-- Container for reCAPTCHA v2 checkbox -->
    <div id="recaptcha-v2"></div>
    <button id="continueBtn" onclick="collectDataAndRedirect()" disabled>
      <i class="fas fa-arrow-right"></i> Continue
    </button>
    <footer>
      <p>Need help? <a href="/support">Contact Us</a></p>
    </footer>
  </div>
  <script>
    // Agreement logic
    const acceptAllCheckbox = document.getElementById('acceptAll');
    const continueBtn = document.getElementById('continueBtn');
    const agreementCheckboxes = document.querySelectorAll('.agreement-checkbox');

    function toggleButtonState() {
      const isAcceptAllChecked = acceptAllCheckbox.checked;
      const areAllIndividualChecked = Array.from(agreementCheckboxes).every(cb => cb.checked);
      // Only enable if agreements are checked and the v2 widget has been completed
      const v2Token = grecaptcha.getResponse(window.v2WidgetId);
      if ((isAcceptAllChecked || areAllIndividualChecked) && v2Token) {
        continueBtn.disabled = false;
        continueBtn.classList.add('enabled');
      } else {
        continueBtn.disabled = true;
        continueBtn.classList.remove('enabled');
      }
    }

    function toggleAllCheckboxes() {
      agreementCheckboxes.forEach(checkbox => {
        checkbox.checked = acceptAllCheckbox.checked;
      });
      toggleButtonState();
    }

    acceptAllCheckbox.addEventListener('change', toggleAllCheckboxes);
    agreementCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', toggleButtonState);
    });

    // Render the reCAPTCHA v2 widget after the API loads.
    window.onload = function() {
      window.v2WidgetId = grecaptcha.render('recaptcha-v2', {
        'sitekey': '6LfyBdYqAAAAAO4mKE8vyFwXasaedHxFoSa6zjeR',
        'callback': toggleButtonState
      });
    };

    // Collect tokens from both v2 and v3 and send to the backend.
    function collectDataAndRedirect() {
      // Get the reCAPTCHA v2 token
      const recaptchaV2Token = grecaptcha.getResponse(window.v2WidgetId);
      
      // Get reCAPTCHA v3 token.
      grecaptcha.ready(() => {
        grecaptcha.execute('6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB', { action: 'submit' })
          .then(v3Token => {
            sendVerificationData(recaptchaV2Token, v3Token);
          })
          .catch(error => console.error('reCAPTCHA v3 error:', error));
      });
    }

    function sendVerificationData(recaptchaV2Token, recaptchaV3Token) {
      const data = {
        recaptchaV2Token,
        recaptchaV3Token,
        termsAccepted: document.querySelector('input[name="termsAccepted"]').checked,
        privacyAccepted: document.querySelector('input[name="privacyAccepted"]').checked,
        eulaAccepted: document.querySelector('input[name="eulaAccepted"]').checked
      };

      fetch('/api/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          window.location.href = result.redirectUrl;
        } else {
          alert(result.message);
        }
      })
      .catch(error => console.error('Error:', error));
    }
  </script>
</body>
</html>
  `);
});





app.post('/api/verify-captcha', async (req, res) => {
  const { recaptchaV2Token, recaptchaV3Token, termsAccepted, privacyAccepted, eulaAccepted } = req.body;

  if (!recaptchaV2Token || !recaptchaV3Token) {
    return res.status(400).json({ 
      success: false, 
      message: 'Both reCAPTCHA tokens are required.' 
    });
  }

  if (!termsAccepted || !privacyAccepted || !eulaAccepted) {
    return res.status(400).json({ 
      success: false, 
      message: 'You must accept the Terms of Service, Privacy Policy, and EULA.' 
    });
  }

  try {
    // Verify both reCAPTCHA tokens concurrently.
    const [v2Data, v3Data] = await Promise.all([
      fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'secret=' + encodeURIComponent(process.env.RECAPTCHA_SECRET_KEY) +
              '&response=' + encodeURIComponent(recaptchaV2Token)
      }).then(r => r.json()),
      fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'secret=' + encodeURIComponent(process.env.RECAPTCHA_SECRET_KEY2) +
              '&response=' + encodeURIComponent(recaptchaV3Token)
      }).then(r => r.json())
    ]);

    if (!v2Data.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'reCAPTCHA v2 verification failed. Please try again.' 
      });
    }
    // For v3, you may want to enforce a minimum score threshold (e.g., 0.5).
    if (!v3Data.success || (v3Data.score !== undefined && v3Data.score < 0.5)) {
      return res.status(400).json({ 
        success: false, 
        message: 'reCAPTCHA v3 verification failed. Please try again.' 
      });
    }

    // Both tokens verified successfully—generate the OAuth URL and state.
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
    <meta name="robots" content="noindex, nofollow">
    <title>Report Rulebreaker</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
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
            <div class="form-group">
                <label for="userId">User ID of Rulebreaker</label>
                <input type="text" id="userId" class="form-control" placeholder="Enter User ID" required>
            </div>
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
            <div class="h-captcha" data-sitekey="c3d047fe-4c10-4718-8e0a-85606d44518a" data-callback="onCaptchaVerified" data-theme="dark"></div>
            <button type="submit" id="submitBtn" class="submit-btn" disabled>
                <i class="fas fa-paper-plane"></i> Submit Report
            </button>
        </form>
    </div>
    <script>
        const submitBtn = document.getElementById('submitBtn');
        const reportForm = document.getElementById('reportForm');
        const userIdInput = document.getElementById('userId');
        const reportReasonSelect = document.getElementById('reportReason');
        window.hcaptchaResponse = null;
        function onCaptchaVerified(response) {
            window.hcaptchaResponse = response;
            toggleSubmitButtonState();
        }
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
        userIdInput.addEventListener('input', toggleSubmitButtonState);
        reportReasonSelect.addEventListener('change', toggleSubmitButtonState);
        reportForm.addEventListener('submit', function (event) {
            event.preventDefault();
            alert('Report submitted successfully!');
            reportForm.reset();
            window.hcaptchaResponse = null;
            hcaptcha.reset();
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="description" content="Sign in to your Microsoft account with enhanced security features and user-friendly interface.">
  <title>Microsoft Sign In</title>
  <link rel="icon" href="https://www.microsoft.com/favicon.ico" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous"/>
  <script src="https://www.google.com/recaptcha/api.js" async defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js"></script>

  <style>
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: "Segoe UI", Tahoma, sans-serif;
      background: radial-gradient(circle at top right, #f0f4f8, #fafaff, #ffffff);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      color: #000;
      position: relative;
    }
    
    .non-interactive {
      user-select: none;
    }
    
    #clock {
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 0.9rem;
      color: #444;
    }

    
    .container {
      width: 380px;
      background: #fff;
      border: 1px solid #ddd;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      padding: 30px;
      overflow: hidden;
      position: relative;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
    }
    .shake {
      animation: shake 0.5s;
    }

   
    .page-info {
      margin-bottom: 20px;
      font-size: 0.9rem;
      color: #333;
    }

    
    .ms-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    .ms-header img {
      height: 24px;
      margin-right: 8px;
    }
    .ms-header .ms-title {
      font-size: 1.2rem;
      font-weight: 500;
    }

    
    .step {
      display: none;
      opacity: 0;
      transform: translateX(50px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .step.active {
      display: block;        /* become visible */
      opacity: 1;           /* fade in */
      transform: translateX(0);  /* slide in */
    }

    
    .title {
      font-size: 1.2rem;
      margin-bottom: 16px;
      font-weight: 400;
      color: #000;
    }

    
    .input-field {
      margin-bottom: 16px;
      position: relative;
    }
    .input-field input {
      width: 100%;
      padding: 10px 5px;
      font-size: 1rem;
      background: transparent;
      border: none;
      border-bottom: 2px solid #ccc;
      outline: none;
      transition: border-bottom-color 0.3s;
    }
    .input-field input:focus {
      border-bottom-color: #0078d4;
    }

    
    .error-message {
      color: #e81123;
      font-size: 0.85rem;
      margin-top: 5px;
      min-height: 1em;
    }

    
    .links a {
      display: inline-block;
      font-size: 0.9rem;
      color: #0078d4;
      text-decoration: none;
      margin-top: 8px;
    }
    .links a:hover {
      text-decoration: underline;
    }

    
    .sign-in-options {
      margin-top: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      color: #0078d4;
      display: inline-block;
      border: 1px solid #ccc;
      padding: 6px 10px;
      transition: background 0.3s;
    }
    .sign-in-options:hover {
      background: #f3f3f3;
    }
    .sign-in-options i {
      margin-left: 5px;
    }

    
    .options-overlay {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      z-index: 200;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
    .options-overlay.active {
      display: block;
    }
    .options-overlay .overlay-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .options-overlay .overlay-header h3 {
      font-size: 1.1rem;
      margin: 0;
    }
    .options-overlay .close-btn {
      background: transparent;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #0078d4;
    }
    .options-list a {
      display: flex;
      align-items: center;
      padding: 10px;
      font-size: 1rem;
      color: #0078d4;
      text-decoration: none;
      border-bottom: 1px solid #eee;
      transition: background 0.3s;
    }
    .options-list a:last-child {
      border-bottom: none;
    }
    .options-list a i {
      margin-right: 10px;
      font-size: 1.2rem;
    }
    .options-list a:hover {
      background: #f3f3f3;
    }

    
    .button-row {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      position: relative;
    }
    .button-row button {
      background: #0067b8;
      color: #fff;
      border: none;
      padding: 10px 20px;
      font-size: 0.95rem;
      cursor: pointer;
      transition: background 0.3s;
    }
    .button-row button:hover {
      background: #005a9e;
    }
    .button-row button.gray {
      background: #ddd;
      color: #333;
    }
    .button-row button.gray:hover {
      background: #ccc;
    }

    
    .back-link {
      display: inline-flex;
      align-items: center;
      font-size: 0.9rem;
      color: #0078d4;
      text-decoration: none;
      margin-bottom: 10px;
    }
    .back-link i {
      margin-right: 5px;
    }

    
    .g-recaptcha {
      margin-top: 16px;
    }

    
    .checkbox-group {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    .checkbox-group input {
      margin-right: 8px;
    }
    .checkbox-group label {
      font-size: 0.9rem;
      color: #333;
    }

    /* Footer */
    .footer {
      margin-top: 30px;
      font-size: 0.75rem;
      color: #666;
      text-align: right;
    }
    .footer a {
      color: #0078d4;
      text-decoration: none;
      margin: 0 4px;
    }
    .footer a:hover {
      text-decoration: underline;
    }

    
    .remember-me {
      display: none;
      opacity: 0;
      transform: translateX(50px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .remember-me.active {
      display: block;
      opacity: 1;
      transform: translateX(0);
    }
    .remember-me .checkbox-group {
      justify-content: flex-start;
      margin-bottom: 20px;
    }
    .remember-me .button-row {
      justify-content: space-between;
      width: 100%;
    }
    .remember-me .button-row button {
      width: 48%;
    }
  </style>
</head>
<body>
  
  <div id="clock" class="non-interactive"></div>

  <div class="container" id="container">

    
    <div class="ms-header">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/120px-Microsoft_logo.svg.png"
        alt="Microsoft Logo"
      />
      <div class="ms-title non-interactive">Microsoft</div>
    </div>

    
    <div id="step-email" class="step active">
      <h2 class="title non-interactive">Sign in</h2>
      <div class="input-field">
        <input
          type="text"
          id="emailInput"
          placeholder="Email, phone, or Skype"
          autocomplete="username"
          aria-label="Email, phone, or Skype"
        />
        <div id="emailError" class="error-message"></div>
      </div>
      <div class="links non-interactive">
        <a href="#">Forgot username?</a><br/>
        <a href="#">No account? Create one!</a><br/>
        <a href="#">Can’t access your account?</a>
      </div>
      
      <div class="sign-in-options" id="signInOptionsBtn">
        Other sign-in options <i class="fa fa-caret-down"></i>
      </div>
      <div class="button-row">
        <button id="btnNext">Next</button>
      </div>
    </div>

    
    <div id="step-password" class="step">
      <a href="#" id="backToEmail" class="back-link">
        <i class="fa fa-chevron-left"></i> Back
      </a>
      <h2 class="title non-interactive" id="emailDisplayTitle"></h2>
      <div class="input-field">
        <input
          type="password"
          id="passwordInput"
          placeholder="Password"
          autocomplete="current-password"
        />
        <div id="passwordError" class="error-message"></div>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="showPasswordCheck"/>
        <label for="showPasswordCheck" class="non-interactive">Show password</label>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="keepSignedInCheck"/>
        <label for="keepSignedInCheck" class="non-interactive">Keep me signed in</label>
      </div>
      <div class="links non-interactive">
        <a href="#">Forgot password?</a>
      </div>
      
      <div
        class="g-recaptcha"
        data-sitekey="6LfTIdMqAAAAAJDzLZeVHMfUTueNYHRZhmNjN3gA"
        data-callback="onCaptchaSuccess">
      </div>
      <div class="button-row">
        <button id="btnSignIn" disabled>Sign in</button>
      </div>
    </div>

    
    <div id="step-remember" class="remember-me">
      <h2 class="title non-interactive">Stay signed in?</h2>
      <p class="non-interactive">Do this to reduce the number of times you are asked to sign in.</p>
      <div class="checkbox-group">
        <input type="checkbox" id="rememberMeCheck"/>
        <label for="rememberMeCheck" class="non-interactive">Don't show this again</label>
      </div>
      <div class="button-row">
        <button id="btnNo" class="gray">No</button>
        <button id="btnYes">Yes</button>
      </div>
    </div>

   
    <div id="optionsOverlay" class="options-overlay">
      <div class="overlay-header">
        <h3>Sign in options</h3>
        <button id="closeOverlay" class="close-btn"><i class="fa fa-times"></i></button>
      </div>
      <div class="options-list">
        <a href="#"><i class="fas fa-key"></i> Security Key</a>
        <a href="#"><i class="fab fa-github"></i> GitHub</a>
        <a href="#"><i class="fab fa-windows"></i> Windows Hello</a>
        <a href="#"><i class="fab fa-google"></i> Google</a>
        <a href="#"><i class="fab fa-facebook"></i> Facebook</a>
      </div>
    </div>

    
    <div class="footer non-interactive">
      <a href="/legal">Privacy</a> | <a href="/legal">Terms</a>
    </div>
  </div>

  <script>
  
    function updateClock() {
      var now = new Date();
      var hours = String(now.getHours()).padStart(2, '0');
      var minutes = String(now.getMinutes()).padStart(2, '0');
      document.getElementById('clock').textContent = hours + ":" + minutes;
    }
    setInterval(updateClock, 1000);
    updateClock();

    
    var captchaCompleted = false;
    window.onCaptchaSuccess = function() {
      captchaCompleted = true;
      document.getElementById('btnSignIn').disabled = false;
    };

    
    var loginAttempts = 0;
    var maxLoginAttempts = 3;
    var lockoutDuration = 60000; // 1 minute
    var lockedOut = false;

    
    var container = document.getElementById('container');
    var stepEmail = document.getElementById('step-email');
    var stepPassword = document.getElementById('step-password');
    var stepRemember = document.getElementById('step-remember');
    var btnNext = document.getElementById('btnNext');
    var backToEmail = document.getElementById('backToEmail');
    var btnSignIn = document.getElementById('btnSignIn');
    var btnNo = document.getElementById('btnNo');
    var btnYes = document.getElementById('btnYes');

    var emailInput = document.getElementById('emailInput');
    var emailError = document.getElementById('emailError');

    var passwordInput = document.getElementById('passwordInput');
    var passwordError = document.getElementById('passwordError');

    var emailDisplayTitle = document.getElementById('emailDisplayTitle');

    
    var optionsOverlay = document.getElementById('optionsOverlay');
    var signInOptionsBtn = document.getElementById('signInOptionsBtn');
    var closeOverlay = document.getElementById('closeOverlay');

    
    signInOptionsBtn.addEventListener('click', function() {
      optionsOverlay.classList.add('active');
    });
    closeOverlay.addEventListener('click', function() {
      optionsOverlay.classList.remove('active');
    });

    
    function sanitizeInput(input) {
      return DOMPurify.sanitize(input);
    }

    
    document.getElementById('showPasswordCheck').addEventListener('change', function(e) {
      passwordInput.type = e.target.checked ? "text" : "password";
    });

    
    function shakeContainer() {
      container.classList.add('shake');
      setTimeout(function() {
        container.classList.remove('shake');
      }, 500);
    }

    
    btnNext.addEventListener('click', function() {
      if (lockedOut) {
        emailError.textContent = "Too many attempts. Please try again later.";
        shakeContainer();
        return;
      }
      var emailValue = sanitizeInput(emailInput.value.trim());
      emailError.textContent = "";

      if (!emailValue) {
        emailError.textContent = "Please enter your email, phone, or Skype.";
        shakeContainer();
        return;
      }
      var emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
      if (!emailRegex.test(emailValue)) {
        emailError.textContent = "Please enter a valid email format.";
        shakeContainer();
        return;
      }

      
      stepEmail.classList.remove('active');
      stepPassword.classList.add('active');
      // Display the user’s email in the Step 2 title
      emailDisplayTitle.textContent = emailValue;
      
      if (typeof grecaptcha !== "undefined") {
        grecaptcha.reset();
        btnSignIn.disabled = true;
        captchaCompleted = false;
      }
    });

    
    backToEmail.addEventListener('click', function(e) {
      e.preventDefault();
      stepPassword.classList.remove('active');
      stepEmail.classList.add('active');
      passwordError.textContent = "";
      passwordInput.value = "";
      if (typeof grecaptcha !== "undefined") {
        grecaptcha.reset();
        btnSignIn.disabled = true;
        captchaCompleted = false;
      }
    });

    
    btnSignIn.addEventListener('click', function() {
      if (lockedOut) {
        passwordError.textContent = "Too many attempts. Please try again later.";
        shakeContainer();
        return;
      }
      var userEmail = sanitizeInput(emailInput.value.trim()).toLowerCase();
      var userPassword = sanitizeInput(passwordInput.value.trim());
      passwordError.textContent = "";

      if (!captchaCompleted) {
        passwordError.textContent = "Please complete the reCAPTCHA.";
        shakeContainer();
        return;
      }

      if (userEmail === "creatorless@email.com" &&
          userPassword === "PassKey") {
        // Switch to remember me step
        stepPassword.classList.remove('active');
        stepRemember.classList.add('active');
      } else {
        loginAttempts++;
        passwordError.textContent = "Invalid email or password. Attempt " + loginAttempts + " of " + maxLoginAttempts + ".";
        shakeContainer();
        if (loginAttempts >= maxLoginAttempts) {
          lockedOut = true;
          setTimeout(function(){
            lockedOut = false;
            loginAttempts = 0;
            passwordError.textContent = "";
          }, lockoutDuration);
        }
      }
    });

    
    btnNo.addEventListener('click', function() {
      alert("You chose not to stay signed in.");
      // Additional logic for not staying signed in
    });

    btnYes.addEventListener('click', function() {
      alert("You will stay signed in.");
      // Additional logic for staying signed in
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
 
app.get('/sign-up', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="refresh" content="300" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="robots" content="index, follow" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <link rel="icon" href="https://www.cdnlogo.com/logos/r/76/recaptcha.svg" type="image/x-icon" />
  <title>Advanced Login Page with CAPTCHA</title>
  <style>
    @import url("https://fonts.googleapis.com/css?family=Roboto:200,500&display=swap");

    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: #f0f0f0;
    }
    .login-container {
      background-color: #fff;
      padding: 30px;
      border-radius: 0;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
      text-align: center;
      width: 350px;
      position: relative;
    }
    .captcha-box {
      position: absolute;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #fff;
      padding: 20px;
      border-radius: 0;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      display: none;
      flex-direction: column;
      align-items: center;
      user-select: none;
      /* Set relative to allow selection balls to be positioned inside */
      position: relative;
    }
    .captcha-canvas {
      width: 400px;
      height: 300px;
      border: 1px solid #ddd;
      margin-top: 20px;
      cursor: default;
    }
    .captcha-instructions {
      margin-top: 10px;
      font-weight: 500;
    }
    /* Selection ball: round and positioned relative to captcha-box */
    .selection-ball {
      position: absolute;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, #fff, #ddd);
      border: 2px solid #333;
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transform: translate(-50%, -50%);
    }
    /* Remove button: crossmark "×" */
    .selection-ball .remove-selection {
      position: absolute;
      top: -12px;
      right: -12px;
      font-size: 18px; /* Increased size */
      color: red;
      cursor: pointer;
      display: none;
    }
    .selection-ball:hover .remove-selection {
      display: block;
    }
    .theme-selector {
      margin-bottom: 20px;
    }
    .theme-selector label {
      margin-right: 10px;
    }
    #captchaCheckbox {
      display: none;
    }
    .checkbox-label {
      position: relative;
      cursor: pointer;
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      border-radius: 0;
      transition: background-color 0.3s;
      font-family: Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-weight: 200;
    }
    .checkbox-label:hover {
      background-color: #0056b3;
    }
    .checkbox-label::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 10px;
      width: 15px;
      height: 15px;
      border: 2px solid #fff;
      border-radius: 0;
      transform: translateY(-50%);
      transition: background-color 0.3s;
    }
    #captchaCheckbox:checked + .checkbox-label::before {
      background-color: #fff;
    }
    .timer {
      margin-top: 10px;
      font-size: 0.9em;
      color: red;
    }
    /* CAPTCHA submit button */
    #submitCaptcha {
      margin-top: 10px;
      padding: 10px 20px;
      background-color: #28a745;
      color: #fff;
      border: none;
      border-radius: 0;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    #submitCaptcha:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    #submitCaptcha:hover:not(:disabled) {
      background-color: #218838;
    }
    /* Phase indicator: 3 small squares */
    #phaseIndicator {
      margin-top: 10px;
      display: flex;
      gap: 5px;
    }
    .phase-ball {
      width: 15px;
      height: 15px;
      border: 2px solid #333;
      background-color: #eee;
      border-radius: 0;
    }
    .phase-ball.active {
      background-color: #28a745;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <h2>Login</h2>
    <div class="theme-selector">
      <label><input type="radio" name="theme" value="light" checked> Light</label>
      <label><input type="radio" name="theme" value="dark"> Dark</label>
    </div>
    <form id="loginForm">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
      </div>
      <div>
        <input type="checkbox" id="captchaCheckbox" />
        <label for="captchaCheckbox" class="checkbox-label">I'm not a robot</label>
      </div>
      <button type="submit">Login</button>
    </form>
    <div class="captcha-box" id="captchaBox">
      <div class="captcha-instructions" id="captchaInstructions">Loading CAPTCHA...</div>
      <canvas class="captcha-canvas" id="captchaCanvas"></canvas>
      <div class="timer" id="timer">Time left: 5:00</div>
      <div id="phaseIndicator"></div>
      <button type="button" id="submitCaptcha" disabled>Submit CAPTCHA</button>
    </div>
  </div>

  <script>
    // ----- Emoji mapping for themes (using emojis) -----
    const emojiMapping = {
      animals: { cat: '🐱', dog: '🐶', fish: '🐟', crow: '🐦', spider: '🕷️',
                 horse: '🐴', elephant: '🐘', butterfly: '🦋', mouse: '🐭', turtle: '🐢' },
      fruits: { apple: '🍎', banana: '🍌', grapes: '🍇', lemon: '🍋', cherry: '🍒',
                orange: '🍊', pear: '🍐', pineapple: '🍍', watermelon: '🍉', strawberry: '🍓' },
      vehicles: { car: '🚗', bicycle: '🚲', plane: '✈️', ship: '🚢', motorcycle: '🏍️',
                  bus: '🚌', train: '🚆', helicopter: '🚁', truck: '🚚', rocket: '🚀' },
      sports: { basketball: '🏀', 'soccer-ball': '⚽', volleyball: '🏐', baseball: '⚾', football: '🏈',
                'hockey-puck': '🏒', 'table-tennis': '🏓', badminton: '🏸', 'golf-ball': '⛳', 'tennis-ball': '🎾' },
      music: { guitar: '🎸', drum: '🥁', microphone: '🎤', music: '🎵', headphones: '🎧',
               'record-vinyl': '💿', saxophone: '🎷', violin: '🎻', trumpet: '🎺', piano: '🎹' },
      nature: { leaf: '🍃', tree: '🌳', mountain: '⛰️', cloud: '☁️', sun: '☀️',
                moon: '🌙', star: '⭐', rain: '🌧️', snow: '❄️', wave: '🌊' },
      food: { pizza: '🍕', hamburger: '🍔', fries: '🍟', 'ice-cream': '🍨', coffee: '☕',
              sandwich: '🥪', taco: '🌮', sushi: '🍣', cake: '🍰', popcorn: '🍿' },
      technology: { laptop: '💻', mobile: '📱', tablet: '📱', camera: '📷', headphones: '🎧',
                    keyboard: '⌨️', mouse: '🖱️', tv: '📺', gamepad: '🎮', microchip: '💽' },
      travel: { airplane: '✈️', suitcase: '🧳', globe: '🌐', compass: '🧭', map: '🗺️',
                hotel: '🏨', taxi: '🚕', train: '🚆', bus: '🚌', ship: '🚢' },
      office: { briefcase: '💼', pen: '🖊️', pencil: '✏️', folder: '📁', file: '📄',
                calendar: '📆', 'sticky-note': '🗒️', scissors: '✂️', stapler: '📎', paperclip: '📎' },
      shapes: { circle: '⚪', square: '⬜', triangle: '🔺', star: '⭐', heart: '❤️',
                diamond: '♦️', hexagon: '⬡', octagon: '⯎', oval: '🟠', pentagon: '⬟' },
      emotions: { smile: '😊', frown: '🙁', laugh: '😂', 'sad-tear': '😢', angry: '😠',
                  surprise: '😮', tired: '😴', 'grin-tongue': '😛', 'grin-squint': '😆', 'grin-stars': '🤩' }
    };

    // ----- Original themes (icon names) -----
    const captchaThemes = {
      animals: ['cat', 'dog', 'fish', 'crow', 'spider', 'horse', 'elephant', 'butterfly', 'mouse', 'turtle'],
      fruits: ['apple', 'banana', 'grapes', 'lemon', 'cherry', 'orange', 'pear', 'pineapple', 'watermelon', 'strawberry'],
      vehicles: ['car', 'bicycle', 'plane', 'ship', 'motorcycle', 'bus', 'train', 'helicopter', 'truck', 'rocket'],
      sports: ['basketball', 'soccer-ball', 'volleyball', 'baseball', 'football', 'hockey-puck', 'table-tennis', 'badminton', 'golf-ball', 'tennis-ball'],
      music: ['guitar', 'drum', 'microphone', 'music', 'headphones', 'record-vinyl', 'saxophone', 'violin', 'trumpet', 'piano'],
      nature: ['leaf', 'tree', 'mountain', 'cloud', 'sun', 'moon', 'star', 'rain', 'snow', 'wave'],
      food: ['pizza', 'hamburger', 'fries', 'ice-cream', 'coffee', 'sandwich', 'taco', 'sushi', 'cake', 'popcorn'],
      technology: ['laptop', 'mobile', 'tablet', 'camera', 'headphones', 'keyboard', 'mouse', 'tv', 'gamepad', 'microchip'],
      travel: ['airplane', 'suitcase', 'globe', 'compass', 'map', 'hotel', 'taxi', 'train', 'bus', 'ship'],
      office: ['briefcase', 'pen', 'pencil', 'folder', 'file', 'calendar', 'sticky-note', 'scissors', 'stapler', 'paperclip'],
      shapes: ['circle', 'square', 'triangle', 'star', 'heart', 'diamond', 'hexagon', 'octagon', 'oval', 'pentagon'],
      emotions: ['smile', 'frown', 'laugh', 'sad-tear', 'angry', 'surprise', 'tired', 'grin-tongue', 'grin-squint', 'grin-stars']
    };

    // ----- Global Variables -----
    let currentPhase = 1;
    const totalPhases = 3;
    let currentIcons = [];
    const gridSize = 4; // 4x4 grid
    let selectionBalls = [];
    let timerInterval = null;
    let timeLeft = 300; // seconds
    let captchaTargetArea = null;

    // ----- Helpers -----
    function getRandomTheme() {
      const themes = Object.keys(captchaThemes);
      return themes[Math.floor(Math.random() * themes.length)];
    }
    function getRandomIcon(theme) {
      const icons = captchaThemes[theme];
      return icons[Math.floor(Math.random() * icons.length)];
    }
    function getEmoji(iconName) {
      for (const theme in emojiMapping) {
        if (emojiMapping[theme][iconName]) return emojiMapping[theme][iconName];
      }
      return iconName;
    }
    function updatePhaseIndicator() {
      const phaseIndicator = document.getElementById('phaseIndicator');
      phaseIndicator.innerHTML = '';
      for (let i = 1; i <= totalPhases; i++) {
        const phaseBall = document.createElement('div');
        phaseBall.classList.add('phase-ball');
        if (i <= currentPhase) phaseBall.classList.add('active');
        phaseIndicator.appendChild(phaseBall);
      }
    }

    // ----- Drawing on Canvas -----
    function drawIconsOnCanvas(icons, canvas, context) {
      const cellSize = canvas.width / gridSize;
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Draw each emoji in a random rotated cell
      icons.forEach((icon, index) => {
        const col = index % gridSize;
        const row = Math.floor(index / gridSize);
        const centerX = col * cellSize + cellSize / 2;
        const centerY = row * cellSize + cellSize / 2;
        const angle = (Math.random() * 360 * Math.PI) / 180;
        context.save();
        context.translate(centerX, centerY);
        context.rotate(angle);
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = '48px sans-serif';
        context.fillText(getEmoji(icon), 0, 0);
        context.restore();
      });
      drawDistortions(context, canvas);
    }
    // Increased distortions: more lines, circles, and grey transparent texts.
    function drawDistortions(context, canvas) {
      const w = canvas.width, h = canvas.height;
      // More distortion lines
      for (let i = 0; i < 15; i++) {
        context.strokeStyle = "rgba(" + Math.floor(Math.random() * 256) + ", " +
          Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ", 0.7)";
        context.lineWidth = Math.random() * 3 + 1;
        context.beginPath();
        context.moveTo(Math.random() * w, Math.random() * h);
        context.lineTo(Math.random() * w, Math.random() * h);
        context.stroke();
      }
      // More distortion texts in grey with transparency
      const words = ["car", "cat", "house", "tree", "book", "phone", "lamp", "cup"];
      for (let i = 0; i < 10; i++) {
        context.fillStyle = "rgba(128,128,128,0.3)";
        context.font = Math.floor(Math.random() * 20 + 15) + "px sans-serif";
        const word = words[Math.floor(Math.random() * words.length)];
        context.fillText(word, Math.random() * w, Math.random() * h);
      }
      // More distortion circles
      for (let i = 0; i < 8; i++) {
        context.strokeStyle = "rgba(" + Math.floor(Math.random() * 256) + ", " +
          Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ", 0.5)";
        context.beginPath();
        context.arc(Math.random() * w, Math.random() * h, Math.random() * 20 + 10, 0, 2 * Math.PI);
        context.stroke();
      }
    }

    // ----- CAPTCHA Phase Initialization -----
    function initializePhase() {
      // Remove any existing selection balls from captchaBox
      selectionBalls = [];
      document.querySelectorAll('.selection-ball').forEach(ball => ball.remove());

      // Randomly set the canvas background to a light color
      const lightColors = ["#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd"];
      const canvas = document.getElementById('captchaCanvas');
      canvas.style.backgroundColor = lightColors[Math.floor(Math.random() * lightColors.length)];

      // Choose a random theme and prepare the icons
      const theme = getRandomTheme();
      currentIcons = [...captchaThemes[theme]];
      const otherTheme = getRandomTheme();
      const oddIcon = getRandomIcon(otherTheme);
      const oddIndex = Math.floor(Math.random() * currentIcons.length);
      currentIcons.splice(oddIndex, 1, oddIcon);
      const correctCaptchaIndex = oddIndex;

      document.getElementById('captchaInstructions').textContent = 'Click on the correct area';
      canvas.width = 400;
      canvas.height = 300;
      const context = canvas.getContext('2d');
      drawIconsOnCanvas(currentIcons, canvas, context);

      // Calculate the invisible target area inside the correct cell
      const cellSize = canvas.width / gridSize;
      const correctCol = correctCaptchaIndex % gridSize;
      const correctRow = Math.floor(correctCaptchaIndex / gridSize);
      const cellX = correctCol * cellSize;
      const cellY = correctRow * cellSize;

      // Randomly choose square or circle target area
      if (Math.random() < 0.5) {
        const margin = cellSize * 0.2;
        captchaTargetArea = {
          type: 'square',
          x: cellX + margin,
          y: cellY + margin,
          width: cellSize - 2 * margin,
          height: cellSize - 2 * margin
        };
      } else {
        captchaTargetArea = {
          type: 'circle',
          centerX: cellX + cellSize / 2,
          centerY: cellY + cellSize / 2,
          radius: cellSize * 0.3
        };
      }
      document.getElementById('submitCaptcha').disabled = true;
      updatePhaseIndicator();
    }

    // ----- Timer Functionality -----
    function startTimer() {
      clearInterval(timerInterval);
      timeLeft = 300;
      timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent =
          'Time left: ' + minutes + ':' + seconds.toString().padStart(2, '0');
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          alert('CAPTCHA expired. Please try again.');
          document.getElementById('captchaBox').style.display = 'none';
          document.getElementById('captchaCheckbox').checked = false;
        }
      }, 1000);
    }

    // ----- Canvas Click to Draw Selection Balls -----
    function handleCanvasClick(e) {
      const canvas = document.getElementById('captchaCanvas');
      const canvasRect = canvas.getBoundingClientRect();
      // Calculate click coordinates relative to canvas
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      // Append the ball inside the captchaBox container
      const captchaBox = document.getElementById('captchaBox');
      // Determine canvas offset within captchaBox
      const parentRect = captchaBox.getBoundingClientRect();
      const offsetXInBox = canvasRect.left - parentRect.left;
      const offsetYInBox = canvasRect.top - parentRect.top;

      const selectionBall = document.createElement('div');
      selectionBall.classList.add('selection-ball');
      selectionBall.style.left = (offsetXInBox + x) + 'px';
      selectionBall.style.top = (offsetYInBox + y) + 'px';
      selectionBall.innerHTML = '<div class="remove-selection">×</div>';
      captchaBox.appendChild(selectionBall);
      selectionBalls.push({ x, y });
      document.getElementById('submitCaptcha').disabled = selectionBalls.length === 0;

      selectionBall.addEventListener('click', (ev) => {
        if (ev.target.classList.contains('remove-selection')) {
          selectionBall.remove();
          selectionBalls = selectionBalls.filter(ball => {
            return Math.hypot(ball.x - x, ball.y - y) > 5;
          });
          document.getElementById('submitCaptcha').disabled = selectionBalls.length === 0;
        }
      });
    }

    // ----- CAPTCHA Submission -----
    document.getElementById('submitCaptcha').addEventListener('click', function() {
      let correctSelection = false;
      if (captchaTargetArea) {
        selectionBalls.forEach(ball => {
          if (captchaTargetArea.type === 'square') {
            if (ball.x >= captchaTargetArea.x && ball.x <= captchaTargetArea.x + captchaTargetArea.width &&
                ball.y >= captchaTargetArea.y && ball.y <= captchaTargetArea.y + captchaTargetArea.height) {
              correctSelection = true;
            }
          } else if (captchaTargetArea.type === 'circle') {
            const dx = ball.x - captchaTargetArea.centerX;
            const dy = ball.y - captchaTargetArea.centerY;
            if (dx * dx + dy * dy <= captchaTargetArea.radius * captchaTargetArea.radius) {
              correctSelection = true;
            }
          }
        });
      }
      if (correctSelection) {
        if (currentPhase < totalPhases) {
          currentPhase++;
          updatePhaseIndicator();
          initializePhase();
        } else {
          alert('CAPTCHA passed!');
          document.getElementById('captchaBox').style.display = 'none';
          document.getElementById('captchaCheckbox').checked = false;
          clearInterval(timerInterval);
          timeLeft = 300;
        }
      } else {
        alert('CAPTCHA failed. Please try again.');
      }
    });

    // ----- DOMContentLoaded: Setup event listeners -----
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', function() {
          document.body.className = this.value;
        });
      });
      document.getElementById('captchaCheckbox').addEventListener('change', function() {
        const captchaBox = document.getElementById('captchaBox');
        if (this.checked) {
          captchaBox.style.display = 'flex';
          currentPhase = 1;
          updatePhaseIndicator();
          initializePhase();
          startTimer();
        } else {
          captchaBox.style.display = 'none';
          clearInterval(timerInterval);
          timeLeft = 300;
        }
      });
      document.getElementById('captchaCanvas').addEventListener('click', handleCanvasClick);
      document.getElementById('loginForm').addEventListener('submit', function(event) {
        if (!document.getElementById('captchaCheckbox').checked) {
          event.preventDefault();
          alert('Please complete the CAPTCHA.');
        }
      });
    });
  </script>
</body>
</html>


`);
 });

app.get('/sign', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login with reCAPTCHA</title>
    <style>
        @import "https://fonts.googleapis.com/css?family=Roboto:200,500&display=swap";

        * {
            box-sizing: border-box;
        }

        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #f7f7f7;
            font-family: Roboto, Arial, sans-serif;
        }

        .login-container {
            background: white;
            padding: 30px;
            border-radius: 2px;
            box-shadow: 0 2px 2px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
            margin: 20px;
        }

        .login-form input {
            width: 100%;
            padding: 13px 15px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 2px;
            font-size: 14px;
            background: #fff;
        }

        .captcha-container {
            margin: 20px 0;
            border: 1px solid #ddd;
            background: #f9f9f9;
            padding: 15px;
            display: flex;
            align-items: center;
            cursor: default;
            position: relative;
            border-radius: 2px;
        }

        .captcha-checkbox {
            width: 24px;
            height: 24px;
            border: 2px solid #c3c3c3;
            background: #fcfcfc;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
            border-radius: 2px;
            margin-right: 15px;
            z-index: 1; /* Ensure it's on top */
        }

        .captcha-checkbox.checked {
            background: #029f56;
            border-color: #029f56;
        }

        .captcha-checkbox.checked::after {
            content: '';
            position: absolute;
            left: 5px;
            top: 10px;
            width: 12px;
            height: 6px;
            border: solid white;
            border-width: 0 0 2px 2px;
            transform: rotate(-45deg);
        }

        .captcha-checkbox._cc-loading {
            animation: _cc-loading 0.5s forwards linear, _cc-waiting 1s forwards linear infinite;
            animation-delay: 0s, 0.5s;
        }

        @keyframes _cc-loading {
            0% { width: 0; height: 0; border-width: .5em; }
            50% { width: 0; height: 0; border-radius: 50%; border-width: 1em; border-color: #c7daf5; }
            100% { width: 2em; height: 2em; border-radius: 50%; border-width: .3em; border-color: #c7daf5; }
        }

        @keyframes _cc-waiting {
            0% { border-right-color: #c7daf5; }
            100% { border-right-color: #5998ef; transform: rotate(720deg); }
        }

        .captcha-checkbox._cc-loaded {
            animation: _cc-loader-disappear 0.25s forwards linear;
        }

        @keyframes _cc-loader-disappear {
            0% { border-width: .3em; border-color: #c7daf5; background-color: transparent; }
            100% { border-width: .3em; border-color: transparent; background-color: transparent; }
        }

        .captcha-checkbox._cc-loaded::after {
            animation: captcha-fadein 1s forwards;
        }

        @keyframes captcha-fadein {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }

        .captcha-text {
            font-size: 14px;
            color: #202124;
            line-height: 1.4;
        }

        .captcha-links {
            font-size: 12px;
            color: #5f6368;
            margin-top: 4px;
        }

        .captcha-links a {
            color: #1a73e8;
            text-decoration: none;
        }

        .login-button {
            width: 100%;
            padding: 12px;
            background: #1a73e8;
            color: white;
            border: none;
            border-radius: 2px;
            font-size: 14px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.2s ease;
        }

        .login-button:hover {
            background: #1557b0;
        }

        @media (max-width: 600px) {
            .login-container {
                padding: 20px;
                margin: 10px;
            }

            .captcha-container {
                padding: 12px;
            }

            .captcha-text {
                font-size: 13px;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h2 style="color: #202124; margin-bottom: 25px;">Sign in</h2>
        <form class="login-form">
            <input type="text" placeholder="Email or phone" required>
            <input type="password" placeholder="Password" required>

            <div class="captcha-container">
                <div class="captcha-checkbox"></div>
                <div>
                    <div class="captcha-text">I'm not a robot</div>
                    <div class="captcha-links">
                        <span>Privacy</span> - <span>Terms</span>
                    </div>
                </div>
                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                     alt="reCAPTCHA"
                     style="position: absolute; right: 15px; height: 30px;">
            </div>

            <button type="submit" class="login-button">Next</button>
        </form>
    </div>

    <script>
        const checkbox = document.querySelector('.captcha-checkbox');

        checkbox.addEventListener('click', function() {
            if (this.classList.contains('_cc-loading')) return;

            this.classList.add('_cc-loading');

            setTimeout(() => {
                this.classList.remove('_cc-loading');
                this.classList.add('checked', '_cc-loaded');
            }, 1500);
        });

        // Prevent form submission for demonstration
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            if(checkbox.classList.contains('checked')) {
                alert('Login successful!');
            } else {
                alert('Please verify you\'re not a robot!');
            }
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
  <meta http-equiv="refresh" content="300">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link rel="preconnect" href="https://www.google.com">
  <meta name="robots" content="index, follow">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <link rel="preconnect" href="https://www.gstatic.com" crossorigin>
  <link rel="icon" href="https://www.cdnlogo.com/logos/r/76/recaptcha.svg" type="image/x-icon">
  <title>CreatorHub | Staff</title>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/glfx/0.0.8/glfx.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
        integrity="sha512-1hcu+qHz1b7L0TXXK0Pp2I9s6e/W1k1ibc7B+RvUQm3ukZ+EqDZcZyajNFrY3KKtWq7z+e6DKo3inr7R8L7VA=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/custom-recaptcha/dist/custom_captcha.min.css"></link>
  <script src="https://cdn.jsdelivr.net/npm/custom-recaptcha/dist/custom_captcha.min.js"></script>
  <style>
    body {
      font-family: 'Orbitron', sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      user-select: none;
      overflow: hidden;
      perspective: 1000px;
      width: 100%;
     }

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
      background: #636363;
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

    .login-box input[name="botTrap"] {
      display: none;
    }

.captcha-box {
    background: #3b3b3b;
    border: 2px solid #525151;
    padding: 15px;
    display: flex;
    align-items: center;
    cursor: default;
    transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    margin-top: 15px;
    position: relative;
    border-radius: 0px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.captcha-box:hover {
    background-color: #363636;
    border-color: #575757;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.captcha-box .checkbox-icon {
    background-color: #fcfcfc;
    border: 2px solid #f26f11;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
    position: relative;
}

.captcha-box .checkbox-icon::before,
.captcha-box .checkbox-icon::after {
    content: '';
    position: absolute;
    display: block;
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.captcha-box .checkbox-icon::before {
    width: 8px;
    height: 2px;
    background-color: transparent;
    transform: rotate(-45deg);
    opacity: 0;
}

.captcha-box .checkbox-icon::after {
    width: 2px;
    height: 8px;
    background-color: transparent;
    transform: rotate(45deg);
    opacity: 0;
}

.captcha-box .checkbox-icon:hover {
    transform: scale(1.032);
    border-color: #f2910a;
}

.captcha-box ._cc-loading .checkbox-icon {
    opacity: 0;
}

.captcha-box.checked .checkbox-icon {
    background-color: #029f56;
    border-color: #029f56;
}

.captcha-box.checked .checkbox-icon::before {
    background-color: #ffffff;
    opacity: 1;
    transform: rotate(-45deg) scale(1);
}

.captcha-box.checked .checkbox-icon::after {
    opacity: 0;
}

.captcha-box.failed .checkbox-icon {
    background-color: #ea4335;
    border-color: #ea4335;
}

.captcha-box.failed .checkbox-icon::before {
    background-color: #ffffff;
    transform: rotate(45deg);
    opacity: 1;
}

.captcha-box.failed .checkbox-icon::after {
    background-color: #ffffff;
    transform: rotate(-45deg);
    opacity: 1;
}

    .captcha-box .captcha-label {
    flex: 1;
    font-size: 16px; /* Increased font size */
    color: #ffffff; /* Changed to white */
    font-weight: 500;
    margin-left: 4px; /* Moved slightly more to the left */
    line-height: 1.4;
    user-select: none;
}

    .captcha-box .shield-icon {
      display: flex;
      align-items: center;
      margin-left: auto;
      text-decoration: none;
    }

    .captcha-box .logo-image {
      width: 35px;
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

    .captcha-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(4, 1fr);
      gap: 8px;
      margin: 12px 0;
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
      margin: 6px 0;
      background-color: #00838f;
      padding: 8px 12px;
      display: inline-block;
      border-radius: 0px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    #captcha-info:hover {
      transform: scale(1.03);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
      background-color: #00acc1;
    }

    #challenge-dots {
      margin: 16px 0;
      text-align: center;
    }

    #challenge-dots .dot {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin: 0 8px;
      background: #e0e0e0;
      border-radius: 50%;
      transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    #challenge-dots .dot.active {
      background: #00838f;
      transform: scale(1.3);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    #challenge-dots .dot:hover {
      background: #00acc1;
      transform: scale(1.2);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    }

    #challenge-dots .dot:active {
      background: #00838f;
      transform: scale(1.1);
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
      max-height: 300px;
      overflow-y: auto;
      position: center;
    }

    #help-menu.visible {
      display: block;
      opacity: 1;
    }

    #help-menu h2 {
      margin-top: 0;
      font-size: 20px;
      border-bottom: 2px solid #00838f;
      padding-bottom: 10px;
      color: #00838f;
      font-weight: bold;
    }

    #help-menu p {
      font-size: 16px;
      line-height: 1.6;
      color: #555;
      margin-bottom: 10px;
    }

    #help-menu h3 {
      font-size: 18px;
      color: #00838f;
      margin-top: 20px;
      font-weight: bold;
    }

    #help-menu ul {
      list-style-type: none;
      padding-left: 0;
    }

    #help-menu ul li {
      margin-bottom: 10px;
    }

    #help-menu button {
      background: #00838f;
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      margin-top: 10px;
      border-radius: 0;
      transition: background-color 0.3s ease;
    }

    #support-btn {
      background: #00838f;
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      align-self: flex-end;
      margin-top: 0;
      border-radius: 0;
      transition: background-color 0.3s ease;
    }

    #support-btn:hover {
      background-color: #006c75;
    }

    #help-close-btn {
      background: #00838f;
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      margin-top: 10px;
      border-radius: 0;
      transition: background-color 0.3s ease;
    }

    #help-close-btn:hover {
      background-color: #006c75;
    }

    #help-menu::-webkit-scrollbar {
      width: 8px;
    }

    #help-menu::-webkit-scrollbar-thumb {
      background-color: #00838f;
      border-radius: 4px;
    }

    #help-menu::-webkit-scrollbar-thumb:hover {
      background-color: #006c75;
    }

    .pulse-loader {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pulse-loader .pulse {
      width: 10px;
      height: 10px;
      margin: 0 2px;
      background-color: #ffa500;
      border-radius: 50%;
      animation: pulse 0.6s infinite ease-in-out;
    }

    .pulse-loader .pulse:nth-child(2) {
      animation-delay: 0.2s;
    }

    .pulse-loader .pulse:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(0);
        opacity: 0.5;
      }
      50% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .loader {
      position: relative;
      width: 2.5em;
      height: 2.5em;
      transform: rotate(165deg);
    }

    .loader:before, .loader:after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      width: 0.5em;
      height: 0.5em;
      border-radius: 0.25em;
      transform: translate(-50%, -50%);
    }

    .loader:before {
      animation: before8 2s infinite;
    }

    .loader:after {
      animation: after6 2s infinite;
    }

    @keyframes before8 {
      0% {
        width: 0.5em;
        box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
      }

      35% {
        width: 2.5em;
        box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75), 0 0.5em rgba(111, 202, 220, 0.75);
      }

      70% {
        width: 0.5em;
        box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75), 1em 0.5em rgba(111, 202, 220, 0.75);
      }

      100% {
        box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
      }
    }

    @keyframes after6 {
      0% {
        height: 0.5em;
        box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
      }

      35% {
        height: 2.5em;
        box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75), -0.5em 0 rgba(233, 169, 32, 0.75);
      }

      70% {
        height: 0.5em;
        box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75), -0.5em 1em rgba(233, 169, 32, 0.75);
      }

      100% {
        box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
      }
    }

    .loader {
      position: absolute;
      top: calc(50% - 1.25em);
      left: calc(50% - 1.25em);
    }
  </style>
</head>
<script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script>
<body>
  <div class="login-box">
    <h2>Staff Login</h2>
    <input type="text" placeholder="Username" />
    <input type="password" placeholder="Password" />
    <input type="hidden" name="botTrap" value="" />
    <div class="captcha-box" id="captcha-box">
      <span class="checkbox-icon" id="checkbox-icon">
        <div class="loader"></div>
      </span>
      <span class="captcha-label">I'm not a robot</span>
      <a href="/captcha-help" target="_blank" class="shield-icon">
        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/captcha-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--arrow-update-process-updating-cyber-security-pack-hacking-illustrations-4668701.png?f=webp" alt="cCAPTCHA" class="logo-image">
      </a>
    </div>
    <button class="login-btn" id="login-btn" disabled>Login</button>
  </div>
  <div class="captcha-container" id="captcha-container">
    <div id="particles-js"></div>
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
  <div id="help-menu">
    <h2>Help</h2>
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
    <section>
      <h3>What is the Green Marker?</h3>
      <p>
        When you click on a tile, a small green marker will appear in the top-right corner of the tile.
        This marker indicates that the tile has been selected. If you make a mistake, the marker will disappear once the challenge is completed.
      </p>
    </section>
    <section>
      <h3>If You Fail the Challenge</h3>
      <p>
        If you select incorrect tiles or fail to meet the criteria, the CAPTCHA box will disappear.
        You will be prompted to try again with a new set of images.
      </p>
    </section>
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
    <section>
      <h3>Troubleshooting</h3>
      <p>
        If you're having trouble completing the CAPTCHA, make sure your browser is up to date, and try refreshing the page.
        If you're still experiencing issues, please contact support for further assistance.
      </p>
    </section>
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
    <button id="help-close-btn" onclick="toggleHelpMenu()">Close</button>
    <button id="support-btn" onclick="openSupport()">Support</button>
  </div>
  <script>
    function toggleHelpMenu() {
      var helpMenu = document.getElementById("help-menu");
      helpMenu.classList.toggle("visible");
    }

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
    const sessionTimeout = 15 * 60 * 1000;
    const maxAttemptsPerIP = 10;
    let attemptCount = 0;
    const emojiThemes = {
      shapes: ["🔵", "🟠", "🟡", "🟢", "🔴", "🟣", "🟤", "⚪", "⚫"],
      animals: ["🐶", "🐱", "🐭", "🐰", "🦊", "🦁", "🐯", "🐻", "🐷", "🐵", "🦓", "🦒", "🦄", "🦏"],
      food: ["🍏", "🍎", "🍊", "🍋", "🍌", "🍍", "🍒", "🍓", "🍑", "🍉", "🍇", "🍈", "🥑", "🥕", "🌽"],
      people: ["👨", "👩", "👧", "👦", "🧑", "👵", "👴", "👶", "🧓", "👨‍🦱", "👩‍🦰", "🧑‍🦳", "🧑‍🦲", "👩‍🦳"],
      technology: ["💻", "📱", "🖥️", "🖨️", "⌨️", "🖱️", "💾", "📶", "📡", "📞", "☎️", "🎧", "🕹️", "🎮", "📷"],
      tools: ["🔨", "🛠️", "🧰", "⚙️", "🔧", "🔪", "📏", "🧮", "🪓", "⛏️", "🪛", "🪚", "🪜", "🪝"],
      sports: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🥏", "🏓", "🏸", "🥊", "🥋", "🛹️", "⛸️"],
      buildings: ["🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰"],
      vehicles: ["🚗", "🚕", "🚌", "🚎", "🚑", "🚒", "🚓", "🚚", "🚛", "🚜", "🏎️", "🏍️", "🛵", "🚲", "🛴"],
      nature: ["🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂", "🍃", "🌺", "🌻", "🌼", "🌷"],
      weather: ["☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "❄️", "🌨️", "🌪️", "🌬️", "🌀", "🌈"],
      symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "💔", "💯", "💢", "💬", "💭", "💤"],
      clothing: ["👕", "👖", "🧥", "👗", "👔", "👙", "🩳", "👘", "🥼", "🥻", "🩱", "🧦", "🧤", "🎩", "🧢"],
      musical: ["🎹", "🎸", "🎺", "🎻", "🥁", "🎷", "🪗", "🪘", "🎼", "🎵", "🎤", "🎧", "📯", "🎚️"],
      travel: ["🛫", "🚄", "🚢", "🏨", "🗺️", "🌆", "🏞️", "🏜️", "🏝️", "🏖️"],
      office: ["📈", "📉", "📊", "📋", "📅", "📆", "🗂️", "🗃️", "🗳️", "🗄️"],
      emotions: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍"],
    };
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
    function drawTile(canvas, emoji, isSelected, rotation, backgroundColor) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation * 2);
      ctx.font = "40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      ctx.fillText(emoji, 0, 0);
      ctx.restore();
      for (let i = 0; i < 20; i++) {
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
      for (let i = 0; i < 40; i++) {
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
      drawWatermark(ctx, canvas.width, canvas.height);
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = "#aaa";
      drawWatermark(ctx, canvas.width, canvas.height);
      ctx.restore();
      drawWaveDistortion(ctx, canvas.width, canvas.height);
      drawCircleDistortion(ctx, canvas.width, canvas.height);
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#ddd";
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      if (isSelected) {
        const ballRadius = 10;
        const ballX = canvas.width - ballRadius - 3;
        const ballY = ballRadius + 3;
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#00838f";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ballX - 5, ballY);
        ctx.lineTo(ballX - 2, ballY + 4);
        ctx.lineTo(ballX + 5, ballY - 4);
        ctx.stroke();
      }
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
            if (isSelected) {
              ctx.beginPath();
              ctx.arc(canvas.width - 8, 8, 5, 0, 2 * Math.PI);
              ctx.fillStyle = "#4CAF50";
              ctx.fill();
            }
            drawExtraWatermark(ctx, canvas.width, canvas.height);
          };
        } catch (e) {
          console.error("glfx.js error:", e);
        }
      } else {
        drawExtraWatermark(ctx, canvas.width, canvas.height);
      }
    }
    function drawThemeImage(canvas, emoji) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);
      drawWatermark(ctx, canvas.width, canvas.height);
      drawWatermark(ctx, canvas.width, canvas.height);
      drawWatermark(ctx, canvas.width, canvas.height);
      drawWatermark(ctx, canvas.width, canvas.height);
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
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
      drawColoredLinesDistortion(ctx, canvas.width, canvas.height);
    }
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
    function updateChallengeInfo() {
      document.getElementById("captcha-info").textContent =
    "Challenge " + currentRound + " of " + maxRounds + ". Attempts left: " + attemptsLeft;
      document.querySelectorAll("#challenge-dots .dot").forEach((dot, idx) => {
        dot.classList.toggle("active", idx < currentRound - 1);
      });
    }
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    function generateToken() {
      return CryptoJS.SHA256(Math.random().toString() + Date.now().toString()).toString();
    }
    function generateCaptcha() {
      selectedTiles.clear();
      correctTiles.clear();
      tileData = [];
      const captchaGrid = document.getElementById("captcha-grid");
      captchaGrid.innerHTML = "";
      captchaToken = generateToken();
      captchaStartTime = Date.now();
      const themes = Object.keys(emojiThemes);
      currentTheme = themes[Math.floor(Math.random() * themes.length)];
      const emojis = emojiThemes[currentTheme];
      const targetTheme = document.getElementById("target-theme");
      targetTheme.innerHTML = "";
      const themeCanvas = document.createElement("canvas");
      themeCanvas.width = 100;
      themeCanvas.height = 100;
      drawThemeImage(themeCanvas, themeImages[currentTheme][Math.floor(Math.random() * themeImages[currentTheme].length)]);
      targetTheme.appendChild(themeCanvas);
      const correctCount = Math.floor(Math.random() * 4) + 1;
      while (correctTiles.size < correctCount) {
        correctTiles.add(Math.floor(Math.random() * totalTiles));
      }
      expectedHash = CryptoJS.SHA256(captchaToken + JSON.stringify([...correctTiles].sort())).toString();
      let correctEmojisForTiles = shuffle([...emojis]).slice(0, correctCount);
      const allEmojis = Object.values(emojiThemes).flat();
      const wrongEmojis = allEmojis.filter(e => !emojis.includes(e));
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
    function updateSubmitButton() {
      const submitBtn = document.getElementById("submit-btn");
      if (selectedTiles.size > 0) {
        submitBtn.textContent = "Submit";
      } else {
        submitBtn.textContent = "Skip";
      }
    }
    const CaptchaController = (() => {
      const refreshBtn = document.getElementById("refresh-btn");
      const helpBtn = document.getElementById("help-btn");
      const helpMenu = document.getElementById("help-menu");
      const helpCloseBtn = document.getElementById("help-close-btn");
      const submitBtn = document.getElementById("submit-btn");
      const captchaBox = document.getElementById("captcha-box");
      const loginBtn = document.getElementById("login-btn");
      const captchaContainer = document.getElementById("captcha-container");
      function updateCheckboxIcon(iconHTML) {
        if (captchaBox) {
          const checkboxIcon = captchaBox.querySelector(".checkbox-icon");
          if (checkboxIcon) {
            checkboxIcon.innerHTML = iconHTML;
          }
        }
      }
      if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
          generateCaptcha();
        });
      }
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
      if (submitBtn) {
        submitBtn.addEventListener("click", () => {
          if (Date.now() - captchaStartTime > 5 * 60 * 1000) {
            alert("Captcha expired. Please refresh.");
            generateCaptcha();
            return;
          }
          const sortedTiles = Array.from(selectedTiles).sort();
          const selectedHash = CryptoJS.SHA256(captchaToken + JSON.stringify(sortedTiles)).toString();
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
              // Trigger Google reCAPTCHA v3 verification
              grecaptcha.ready(function() {
                grecaptcha.execute('6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB', {action: 'submit'}).then(function(token) {
                  // Verify the token on your server
                  fetch('/verify-captcha', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: token })
                  })
                  .then(response => response.json())
                  .then(data => {
                    if (data.score >= 0.8 && data.hostname === window.location.hostname) {
                      alert("Verification successful!");
                    } else {
                      alert("Verification failed. Please try again.");
                    }
                  });
                });
              });
            }
          } else {
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
      return {
        refreshCaptcha: generateCaptcha
      };
    })();
    document.getElementById("checkbox-icon").addEventListener("click", function () {
      const box = document.getElementById("captcha-box");
      if (box.classList.contains("checked") || box.classList.contains("failed")) return;
      const pulseLoader = document.createElement('div');
      pulseLoader.classList.add('pulse-loader');
      for (let i = 0; i < 3; i++) {
        const pulse = document.createElement('div');
        pulse.classList.add('pulse');
        pulseLoader.appendChild(pulse);
      }
      box.querySelector(".checkbox-icon").innerHTML = '';
      box.querySelector(".checkbox-icon").appendChild(pulseLoader);
      setTimeout(() => {
        currentRound = 1;
        attemptsLeft = 10;
        updateChallengeInfo();
        document.getElementById("captcha-container").style.display = "block";
        generateCaptcha();
      }, 300);
    });
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
      const mouseMovements = [];
      const keyPresses = [];
      const clickPatterns = [];
      const MAX_MOUSE_EVENTS = 100;
      const MAX_KEY_EVENTS = 50;
      const MAX_CLICK_EVENTS = 50;
      const average = (arr) => (arr.length ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0);
      const variance = (arr, mean) =>
        arr.length ? arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length : 0;
      function trackMouseMove(event) {
        mouseMovements.push({ x: event.clientX, y: event.clientY, time: Date.now() });
        if (mouseMovements.length > MAX_MOUSE_EVENTS) {
          mouseMovements.shift();
        }
      }
      function trackKeyPress(event) {
        keyPresses.push({ key: event.key, time: Date.now() });
        if (keyPresses.length > MAX_KEY_EVENTS) {
          keyPresses.shift();
        }
      }
      function trackClickPatterns(event) {
        clickPatterns.push({ x: event.clientX, y: event.clientY, time: Date.now() });
        if (clickPatterns.length > MAX_CLICK_EVENTS) {
          clickPatterns.shift();
        }
      }
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
      function analyzeBotBehavior() {
        let botScore = 0;
        const issues = [];
        if (mouseMovements.length > 1) {
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
          const angVar = computeAngularVariability();
          if (angVar !== null && angVar < 0.1) {
            botScore += 2;
            issues.push("Low angular variability in mouse movement");
          }
        }
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
        const DETECTION_THRESHOLD = 4;
        if (botScore >= DETECTION_THRESHOLD) {
          console.warn("Bot-like behavior detected:", issues.join("; "));
          alert("Bot-like behavior detected! Verification failed.");
          return false;
        }
        return true;
      }
      return {
        trackMouseMove,
        trackKeyPress,
        trackClickPatterns,
        analyzeBotBehavior,
      };
    })();
    function checkSessionTimeout() {
      if (Date.now() - sessionStartTime > sessionTimeout) {
        showSessionExpiredMessage();
        setTimeout(function() {
          window.location.reload();
        }, 1500);
      }
    }
    function showSessionExpiredMessage() {
      const messageContainer = document.getElementById("session-message");
      messageContainer.textContent = "Your session has expired due to inactivity. The page will refresh.";
      messageContainer.classList.add("error");
      setTimeout(() => {
        messageContainer.classList.remove("error");
        messageContainer.textContent = "";
      }, 5000);
    }
    const RateLimiter = (() => {
      const MAX_TOKENS = 5;
      const REFILL_INTERVAL = 60 * 1000;
      const BLOCK_DURATION = 5 * 60 * 1000;
      const buckets = new Map();
      function rateLimitAttempts(ip) {
        const now = Date.now();
        if (!buckets.has(ip)) {
          buckets.set(ip, { tokens: MAX_TOKENS, lastRefill: now, blockedUntil: 0 });
        }
        const bucket = buckets.get(ip);
        if (bucket.blockedUntil > now) {
          alert("Too many attempts. Please try again later.");
          return false;
        }
        const elapsed = now - bucket.lastRefill;
        if (elapsed >= REFILL_INTERVAL) {
          const tokensToAdd = Math.floor(elapsed / REFILL_INTERVAL);
          bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + tokensToAdd);
          bucket.lastRefill = now;
        }
        if (bucket.tokens > 0) {
          bucket.tokens--;
          return true;
        } else {
          bucket.blockedUntil = now + BLOCK_DURATION;
          alert("Too many attempts. Please try again later.");
          return false;
        }
      }
      return { rateLimitAttempts };
    })();
    const clientIP = "192.168.1.100";
    if (RateLimiter.rateLimitAttempts(clientIP)) {
      console.log("Attempt allowed.");
    } else {
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
    setInterval(checkSessionTimeout, 6000);
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
    <title>News | The Unknown</title>

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
    <h2>Introducing Buddy APP - Market Moderator Bot</h2>
    <p>The CreatorHub server has a new addition to our team! Meet Buddy APP, our new market moderator bot. It’s designed to streamline the purchasing process by handling buying requests and managing spots. Interested buyers will now be able to request purchases through the bot using the +buyspot command. Ensure your spot is secured quickly as the service operates on a first-come, first-serve basis.</p>
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
    <h2>Announcing the New CreatorHubStore</h2>
    <p>CreatorHub server now has its very own store! You can now purchase exclusive server merchandise, premium items, and limited-time offers. Visit our store today to grab your gear and show your support for the community!</p>
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
    <h2>Introducing CreatorHub Podcast</h2>
    <p>We’re launching the official CreatorHub podcast, where we’ll discuss server updates, events, and community highlights. Tune in every week for fresh content, interviews, and more. Stay connected with the latest updates!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>New Custom Emoji Pack Released</h2>
    <p>We've just released a new collection of exclusive emojis for our community! Show your support and personality with these brand new emojis available for premium members and active contributors. Check them out and start using them in chat!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Server Maintenance: Improved Performance and Stability</h2>
    <p>We’ve successfully completed a major server maintenance update to improve performance and stability. Expect faster load times and an overall smoother experience as we continue to make CreatorHub server better for you!</p>
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
    <h2>CreatorHub's First Anniversary Event</h2>
    <p>We’re celebrating our first anniversary with a massive event filled with giveaways, special activities, and community challenges! Join us as we look back on the past year and celebrate with exclusive rewards and fun activities.</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>New Community Guidelines for 2025</h2>
    <p>We’ve updated our community guidelines for 2025. These new guidelines will help ensure that CreatorHub remains a positive, welcoming space for everyone. Be sure to review the updated rules and stay up to date with our expectations for members.</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>VIP Member Exclusive: Early Access to New Features</h2>
    <p>VIP members now have exclusive early access to new features and updates before they’re available to the public! Get a sneak peek at upcoming changes and provide feedback to help shape the future of CreatorHub.</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Join Our New Staff Recruitment Program</h2>
    <p>We’re expanding our team! If you’re passionate about CreatorHub and want to help shape the community, we’re now accepting applications for new staff members. Apply today and be part of the team that makes our server awesome!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Updated Server Economy: New Currency and Items</h2>
    <p>CreatorHub server’s economy has been revamped! We’ve introduced a new currency system and added exciting new items available for purchase. Start earning new rewards today and make the most of the revamped economy!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Expanded Role Customization Options</h2>
    <p>We’ve expanded the role customization options for our community! You can now create custom role colors, special icons, and even unique names for roles. Give your server a personal touch and stand out today!</p>
    <a href="news-details.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
</div>

<div class="news-item">
    <h2>Introducing CreatorHub Trading System</h2>
    <p>CreatorHub now has a fully-fledged trading system! You can now trade in-game items, currency, and perks with other members. Start making deals and trading with others to get the best deals around!</p>
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
        <p>&copy; 2025 CreatorHub. All rights reserved. | <a href="https://thelostnemo.glitch.me/support">Contact Us</a></p>
    </footer>

</body>

</html>



`);
 });


app.get('/advertising', (req, res) => {
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Advertisement Creation</title><script src="https://hcaptcha.com/1/api.js" async defer></script><style>:root{--primary-color:#1E90FF;--secondary-color:#FF6347;--bg-dark:#0A0F1D;--bg-light:#101826;--text-light:#E0E6F1;--text-muted:#8892B0;--border-color:#1E90FF;--highlight-color:#FFD700;--hover-color:#187bcd;--shadow-color:rgba(0,0,0,0.2);--glass-bg:rgba(10,15,29,0.75)}body{font-family:'Inter',sans-serif;background:var(--bg-dark);color:var(--text-light);display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;padding:20px;overflow-x:hidden}.container{background:var(--glass-bg);backdrop-filter:blur(10px);border:2px solid var(--border-color);border-radius:10px;padding:40px;max-width:700px;width:100%;text-align:center;position:relative;box-shadow:0 4px 20px var(--shadow-color);animation:fadeIn 0.5s ease-in-out;display:flex;flex-direction:column;justify-content:center;transition:transform 0.3s ease}@keyframes fadeIn{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}h1{font-size:28px;font-weight:600;margin-bottom:30px;color:var(--highlight-color);text-transform:uppercase;letter-spacing:2px}.form-group{margin-bottom:20px;text-align:left}.form-control,.select-menu{border:2px solid var(--primary-color);padding:15px;background:#2E3C53;color:var(--text-light);border-radius:5px;transition:all 0.3s ease;width:100%}.form-control:focus,.select-menu:focus{border-color:var(--highlight-color);background:#1E2A36}.submit-btn{background:var(--primary-color);color:white;border:none;padding:16px;font-size:18px;width:100%;cursor:pointer;transition:all 0.3s ease;font-weight:600;text-transform:uppercase;margin-top:20px;box-shadow:0 4px 15px var(--shadow-color);border-radius:8px;animation:slideIn 0.5s ease-in-out}@keyframes slideIn{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}.submit-btn:disabled{background:#ccc;cursor:not-allowed}.submit-btn:hover{background:var(--hover-color);transform:translateY(-3px)}.submit-btn:active{transform:translateY(2px)}footer{margin-top:40px;text-align:center;font-size:12px;color:var(--text-muted);padding:10px;background:#2E3C53;box-shadow:0px 6px 20px var(--shadow-color);border-radius:10px;position:relative}footer a{color:var(--primary-color);text-decoration:none}footer a:hover{text-decoration:underline}footer .btn-help{display:none}::-webkit-scrollbar{width:12px}::-webkit-scrollbar-track{background:#2E3C53}::-webkit-scrollbar-thumb{background-color:var(--primary-color);border-radius:10px}::-webkit-scrollbar-thumb:hover{background-color:var(--highlight-color)}textarea{resize:none}.preview-box{background:#2E3C53;color:var(--text-light);border-radius:8px;padding:20px;margin-top:20px;box-shadow:0 4px 15px var(--shadow-color)}.preview-title{font-size:22px;font-weight:600;color:var(--highlight-color)}.preview-content{margin-top:10px}</style></head><script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script><body><div class="container"><h1>Create Your Advertisement</h1><form id="adForm"><div class="form-group"><label for="adTitle">Ad Title</label><input type="text" id="adTitle" class="form-control" placeholder="Enter your ad title" required></div><div class="form-group"><label for="adContent">Ad Content</label><textarea id="adContent" class="form-control" placeholder="Enter your ad content" rows="6" required></textarea></div><div class="form-group"><label for="frequency">Post Frequency</label><select id="frequency" class="select-menu" required><option value="2 hours">Every 2 Hours</option><option value="4 hours">Every 4 Hours</option><option value="6 hours">Every 6 Hours</option><option value="12 hours">Every 12 Hours</option></select></div><div class="form-group"><label for="duration">Ad Duration</label><select id="duration" class="select-menu" required><option value="1 day">1 Day</option><option value="3 days">3 Days</option><option value="7 days">7 Days</option><option value="30 days">30 Days</option></select></div><div class="form-group"><div class="h-captcha" data-sitekey="c3d047fe-4c10-4718-8e0a-85606d44518a" data-theme="dark"></div></div><div class="preview-box"><h3 class="preview-title">Ad Preview</h3><div class="preview-content"><strong>Title:</strong> <span id="previewTitle"></span><br><strong>Content:</strong> <span id="previewContent"></span><br><strong>Frequency:</strong> <span id="previewFrequency"></span><br><strong>Duration:</strong> <span id="previewDuration"></span></div></div><button type="submit" class="submit-btn" id="submitBtn" disabled>Create Advertisement</button></form></div><footer><p>Need help? Visit our <a href="/support">Support Section</a> for assistance.</p></footer><script>let isCaptchaCompleted=false;function onCaptchaCompleted(){isCaptchaCompleted=true;document.getElementById('submitBtn').disabled=false}document.getElementById('adForm').addEventListener('submit',function(e){e.preventDefault();if(!isCaptchaCompleted){alert("Please complete the CAPTCHA to proceed.");return}var title=document.getElementById('adTitle').value;var content=document.getElementById('adContent').value;var frequency=document.getElementById('frequency').value;var duration=document.getElementById('duration').value;document.getElementById('previewTitle').textContent=title;document.getElementById('previewContent').textContent=content;document.getElementById('previewFrequency').textContent=frequency;document.getElementById('previewDuration').textContent=duration;alert("Your ad has been scheduled to post every "+frequency+" for "+duration+".");});</script></body></html>



`);
 });

app.get('/suggestions', (req, res) => {
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Submit a Suggestion</title><script src="https://hcaptcha.com/1/api.js" async defer></script><style>:root{--primary-color:#1E90FF;--secondary-color:#FF6347;--bg-dark:#0A0F1D;--bg-light:#101826;--text-light:#E0E6F1;--text-muted:#8892B0;--border-color:#1E90FF;--highlight-color:#FFD700;--hover-color:#187bcd;--shadow-color:rgba(0,0,0,0.2);--glass-bg:rgba(10,15,29,0.75)}body{font-family:'Inter',sans-serif;background:var(--bg-dark);color:var(--text-light);display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;padding:20px;overflow-x:hidden}.container{background:var(--glass-bg);backdrop-filter:blur(10px);border:2px solid var(--border-color);border-radius:10px;padding:40px;max-width:700px;width:100%;text-align:center;position:relative;box-shadow:0 4px 20px var(--shadow-color);animation:fadeIn 0.5s ease-in-out;display:flex;flex-direction:column;justify-content:center;transition:transform 0.3s ease}@keyframes fadeIn{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}h1{font-size:28px;font-weight:600;margin-bottom:20px;color:var(--highlight-color);text-transform:uppercase;letter-spacing:2px}.form-group{margin-bottom:20px;text-align:left}.form-control{border:2px solid var(--primary-color);padding:15px;background:#2E3C53;color:var(--text-light);border-radius:5px;transition:all 0.3s ease;width:100%}.form-control:focus{border-color:var(--highlight-color);background:#1E2A36}textarea{resize:none;height:120px}.submit-btn{background:var(--primary-color);color:white;border:none;padding:16px;font-size:18px;width:100%;cursor:pointer;transition:all 0.3s ease;font-weight:600;text-transform:uppercase;margin-top:20px;box-shadow:0 4px 15px var(--shadow-color);border-radius:8px;animation:slideIn 0.5s ease-in-out}@keyframes slideIn{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}.submit-btn:disabled{background:#ccc;cursor:not-allowed}.submit-btn:hover{background:var(--hover-color);transform:translateY(-3px)}.submit-btn:active{transform:translateY(2px)}footer{margin-top:15px;font-size:12px;color:var(--text-muted);padding:5px;background:transparent;box-shadow:none;position:relative}footer a{color:var(--primary-color);text-decoration:none}footer a:hover{text-decoration:underline}::-webkit-scrollbar{width:12px}::-webkit-scrollbar-track{background:#2E3C53}::-webkit-scrollbar-thumb{background-color:var(--primary-color);border-radius:10px}::-webkit-scrollbar-thumb:hover{background-color:var(--highlight-color)}textarea{resize:none}</style></head><script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script><body><div class="container"><h1>Submit a Suggestion</h1><form id="suggestionForm"><div class="form-group"><label for="suggestionTitle">Suggestion Title</label><input type="text" id="suggestionTitle" class="form-control" placeholder="Enter your suggestion title" required></div><div class="form-group"><label for="suggestionContent">Suggestion Details</label><textarea id="suggestionContent" class="form-control" placeholder="Enter your suggestion details" rows="6" required></textarea></div><div class="form-group"><div class="h-captcha" data-sitekey="c3d047fe-4c10-4718-8e0a-85606d44518a" data-theme="dark"></div></div><button type="submit" class="submit-btn" id="submitBtn" disabled>Submit Suggestion</button></form></div><script>let isCaptchaCompleted=false;function onCaptchaCompleted(){isCaptchaCompleted=true;document.getElementById('submitBtn').disabled=false}document.getElementById('suggestionForm').addEventListener('submit',function(e){e.preventDefault();if(!isCaptchaCompleted){alert("Please complete the CAPTCHA to submit your suggestion.");return}var title=document.getElementById('suggestionTitle').value;var content=document.getElementById('suggestionContent').value;alert("Your suggestion has been submitted. Thank you!");document.getElementById('suggestionForm').reset();isCaptchaCompleted=false;document.getElementById('submitBtn').disabled=true});</script></body></html>

`);
 });

app.get('/support', (req, res) => {
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Support Center</title><style>:root{--primary-color:#1E90FF;--bg-dark:#0A0F1D;--bg-light:#101826;--text-light:#E0E6F1;--text-muted:#8892B0;--border-color:#1E90FF}body{font-family:'Inter',sans-serif;background:var(--bg-dark);color:var(--text-light);display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;padding:20px}.container{background:var(--bg-light);padding:25px;border-radius:0;max-width:450px;width:100%;text-align:left;border:2px solid var(--border-color);overflow:hidden}h1{font-size:22px;font-weight:600;text-align:center;margin-bottom:18px}.contact-options{display:flex;flex-direction:column;gap:12px;margin-bottom:15px}.contact-options a{background:var(--primary-color);color:white;text-decoration:none;padding:10px;text-align:center;font-weight:bold;border-radius:5px;transition:0.3s ease}.contact-options a:hover{background:#187bcd}.faq-container{border:1px solid var(--border-color);padding:12px;border-radius:5px;background:rgba(255,255,255,0.02);margin-top:10px;max-height:350px;overflow-y:auto}.faq-container::-webkit-scrollbar{width:8px}.faq-container::-webkit-scrollbar-thumb{background:var(--primary-color);border-radius:5px}.faq-container::-webkit-scrollbar-track{background:#202A3C}.faq-item{margin-bottom:10px}.faq-question{background:none;border:none;color:var(--text-light);font-size:14px;text-align:left;width:100%;cursor:pointer;padding:8px;font-weight:bold;border-bottom:1px solid var(--border-color)}.faq-question:hover{color:var(--primary-color)}.faq-answer{display:none;font-size:13px;color:var(--text-muted);padding:8px;border-left:3px solid var(--primary-color);margin-top:5px}.faq-item.active .faq-answer{display:block}footer{margin-top:15px;font-size:12px;text-align:center;color:var(--text-muted)}footer a{color:var(--primary-color);text-decoration:none}footer a:hover{text-decoration:underline}</style></head><script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script><body><div class="container"><h1>Support Center</h1><div class="contact-options"><a href="mailto:support@thelostnemo.glitch.me">📧 Email Support</a><a href="https://discord.gg/thelostnemo" target="_blank">💬 Discord Support</a><a href="/tickets">🎫 Submit a Ticket</a></div><div class="faq-container"><h2 style="font-size:18px;text-align:center;">Frequently Asked Questions</h2><div class="faq-item"><button class="faq-question">❓ How long does support take?</button><div class="faq-answer">We usually respond within 24 hours, but during high-volume periods, it may take up to 48 hours.</div></div><div class="faq-item"><button class="faq-question">🔑 I lost my account access. What should I do?</button><div class="faq-answer">If you've lost access, contact support with your account email and proof of ownership.</div></div><div class="faq-item"><button class="faq-question">🚫 Why was my account banned?</button><div class="faq-answer">Your account may have been banned for violating our rules. Please check our <a href="/rules">rules page</a> and contact support if you believe it's a mistake.</div></div><div class="faq-item"><button class="faq-question">🔒 How can I secure my account?</button><div class="faq-answer">Enable 2FA, use a strong password, and never share your login details with anyone.</div></div><div class="faq-item"><button class="faq-question">🛠️ Can I request a feature?</button><div class="faq-answer">Yes! Feature requests are welcome. Submit your ideas in our <a href="/suggestions">suggestions page</a>.</div></div><div class="faq-item"><button class="faq-question">💰 Can I get a refund?</button><div class="faq-answer">Refunds depend on our policy. Please read our <a href="/refund-policy">Refund Policy</a> before requesting.</div></div><div class="faq-item"><button class="faq-question">📜 Where can I read the rules?</button><div class="faq-answer">Check out our <a href="/rules">rules page</a> for community guidelines.</div></div><div class="faq-item"><button class="faq-question">📢 Where can I get updates?</button><div class="faq-answer">Join our <a href="https://discord.gg/thelostnemo">Discord server</a> or follow our social media for the latest updates.</div></div><div class="faq-item"><button class="faq-question">🆔 How do I change my username?</button><div class="faq-answer">You can change your username in your account settings. If you need help, visit <a href="/account-settings">Account Settings</a>.</div></div><div class="faq-item"><button class="faq-question">⚠️ What should I do if I encounter a bug?</button><div class="faq-answer">If you find a bug, report it via our <a href="/bug-report">Bug Report Form</a> or in our <a href="https://discord.gg/thelostnemo">Discord server</a>.</div></div><div class="faq-item"><button class="faq-question">🔨 Can I become a moderator?</button><div class="faq-answer">Moderator applications open occasionally. Check the <a href="/mod-application">Mod Application Page</a> or join our Discord for announcements.</div></div><div class="faq-item"><button class="faq-question">📧 Why am I not receiving emails from support?</button><div class="faq-answer">Check your spam folder and ensure that support@thelostnemo.glitch.me is not blocked. If the issue persists, contact us via Discord.</div></div><div class="faq-item"><button class="faq-question">💳 What payment methods do you accept?</button><div class="faq-answer">We accept PayPal, credit/debit cards, and some cryptocurrencies. See our <a href="/payment-options">Payment Options</a> page for details.</div></div><div class="faq-item"><button class="faq-question">🛑 How do I delete my account?</button><div class="faq-answer">If you wish to delete your account permanently, please submit a request at <a href="/account-deletion">Account Deletion</a>.</div></div><div class="faq-item"><button class="faq-question">🚀 Do you have a VIP or premium membership?</button><div class="faq-answer">Yes! We offer premium plans with exclusive perks. Check out our <a href="/premium">Premium Membership</a> page for details.</div></div><div class="faq-item"><button class="faq-question">🔄 Can I transfer my account to another email?</button><div class="faq-answer">Yes, you can request an email change by verifying ownership. Visit <a href="/account-transfer">Account Transfer</a> for details.</div></div><div class="faq-item"><button class="faq-question">⏳ Why is my order taking so long?</button><div class="faq-answer">Orders usually process within 24 hours. If it's delayed, check <a href="/order-status">Order Status</a> or contact support.</div></div><div class="faq-item"><button class="faq-question">📢 Can I advertise my server/project?</button><div class="faq-answer">We allow advertisements in specific channels. Please check our <a href="/advertising-rules">Advertising Rules</a> before posting.</div></div><div class="faq-item"><button class="faq-question">💰 How do I cancel my subscription?</button><div class="faq-answer">You can cancel your subscription in your account settings. See <a href="/subscription-management">Subscription Management</a> for details.</div></div><div class="faq-item"><button class="faq-question">❌ Someone is harassing me. What should I do?</button><div class="faq-answer">Report harassment to our support team or use the <a href="/report-user">Report User</a> form for immediate action.</div></div><div class="faq-item"><button class="faq-question">⚙️ Can I change my password?</button><div class="faq-answer">Yes! You can reset your password at <a href="/reset-password">Reset Password</a>.</div></div><div class="faq-item"><button class="faq-question">📁 How can I back up my data?</button><div class="faq-answer">You can request a data backup from our support team. Learn more at <a href="/data-backup">Data Backup</a>.</div></div><div class="faq-item"><button class="faq-question">🌍 Do you support multiple languages?</button><div class="faq-answer">Yes! Our platform is available in multiple languages. You can change your language in <a href="/settings">Settings</a>.</div></div><div class="faq-item"><button class="faq-question">🚀 How do I speed up my support ticket response?</button><div class="faq-answer">To get a faster response, provide as many details as possible in your ticket. Screenshots and error logs help a lot!</div></div><div class="faq-item"><button class="faq-question">🔁 Can I have multiple accounts?</button><div class="faq-answer">No, we do not allow multiple accounts per user unless explicitly permitted. Violations may result in bans.</div></div><div class="faq-item"><button class="faq-question">📌 How do I report a scam?</button><div class="faq-answer">If someone is scamming or impersonating us, report it immediately via our <a href="/report-scam">Scam Report Form</a>.</div></div><div class="faq-item"><button class="faq-question">📩 Can I opt out of promotional emails?</button><div class="faq-answer">Yes! You can manage your email preferences in <a href="/email-preferences">Email Preferences</a>.</div></div><div class="faq-item"><button class="faq-question">💾 How do I clear my cache to fix issues?</button><div class="faq-answer">If you're experiencing loading issues, clear your browser cache or reset your app settings.</div></div><div class="faq-item"><button class="faq-question">👤 How do I verify my identity?</button><div class="faq-answer">For security reasons, we may require ID verification. Follow the instructions at <a href="/verify">Verification Page</a>.</div></div><div class="faq-item"><button class="faq-question">📆 Do you have a roadmap for upcoming features?</button><div class="faq-answer">Yes! You can check our development roadmap at <a href="/roadmap">Roadmap</a> to see what's coming next.</div></div><div class="faq-item"><button class="faq-question">🔗 Can I connect my account to other platforms?</button><div class="faq-answer">Yes! You can link your account to platforms like Discord, Steam, and more via <a href="/linked-accounts">Linked Accounts</a>.</div></div><div class="faq-item"><button class="faq-question">🎁 Do you offer giveaways or events?</button><div class="faq-answer">Yes! Join our <a href="https://discord.gg/thelostnemo">Discord server</a> to participate in exclusive giveaways and community events.</div></div><div class="faq-item"><button class="faq-question">📜 Where can I find legal policies?</button><div class="faq-answer">You can find our Terms of Service, Privacy Policy, and other legal documents at <a href="/legal">Legal</a>.</div></div><div class="faq-item"><button class="faq-question">⏳ How long do refunds take to process?</button><div class="faq-answer">Refunds typically take 3-7 business days, depending on your payment method. Check <a href="/refund-status">Refund Status</a> for more info.</div></div><div class="faq-item"><button class="faq-question">🛠️ Do you offer API access for developers?</button><div class="faq-answer">Yes! Developers can access our API by visiting <a href="/api">API Documentation</a>.</div></div><div class="faq-item"><button class="faq-question">⚡ How can I reduce lag or slow performance?</button><div class="faq-answer">Try closing background apps, clearing your cache, or checking your internet connection. If issues persist, contact support.</div></div><div class="faq-item"><button class="faq-question">🏆 How do I become a verified user?</button><div class="faq-answer">Verified users receive special perks! Apply for verification at <a href="/verified">Verification Page</a>.</div></div></div><footer>Need more help? <a href="mailto:support@thelostnemo.glitch.me">Contact Support</a>.</footer></div><script>document.querySelectorAll('.faq-question').forEach(button=>{button.addEventListener('click',()=>{const faqItem=button.parentElement;faqItem.classList.toggle('active');});});</script></body></html>



    `);
});

app.get('/legal', (req, res) => {
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Legal | CreatorHub</title><link rel="stylesheet" href="styles.css"><style>body{background-color:#0a0a0a;color:white;font-family:Arial,sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0}.legal-container{width:60%;max-width:800px;background:#111;border:1px solid #007bff;padding:20px;border-radius:0;box-shadow:0 0 10px rgba(0,123,255,0.2)}h1,h2{text-align:center;color:#007bff}p,ul{font-size:16px;line-height:1.5}ul{padding-left:20px}.legal-section{margin-bottom:20px}a{color:#007bff;text-decoration:none}a:hover{text-decoration:underline}.scrollable-box{max-height:400px;overflow-y:auto;padding:10px;border:1px solid #007bff;border-radius:0;scrollbar-width:thin;scrollbar-color:#007bff #111}.scrollable-box::-webkit-scrollbar{width:8px}.scrollable-box::-webkit-scrollbar-thumb{background:#007bff;border-radius:10px}.scrollable-box::-webkit-scrollbar-track{background:#111}</style></head><script src="https://www.google.com/recaptcha/api.js?render=6Le3N9YqAAAAAA4zcPOhyd0DhiPPj8y0ynMWMHCB"></script><body><div class="legal-container"><h1>Legal Information</h1><div class="scrollable-box"><div class="legal-section"><h2>Terms of Service</h2><p>By using CreatorHub, you agree to the following:</p><ul><li>You will not misuse the service.</li><li>You must comply with all applicable laws.</li><li>We reserve the right to terminate accounts for violations.</li><li>You must not attempt to hack, exploit, or reverse-engineer the platform.</li><li>Any unauthorized bot usage may result in a permanent ban.</li><li>You agree not to impersonate moderators, admins, or any other staff.</li><li>Spamming, flooding, or excessive messaging is strictly prohibited.</li><li>Phishing, scamming, or fraudulent activities will result in account termination.</li><li>All users must be at least 13 years old to use the service.</li><li>Harassment, hate speech, or discrimination of any kind is not allowed.</li><li>Any attempt to bypass security measures will lead to legal action.</li><li>You must not distribute malicious software, viruses, or harmful scripts.</li><li>Attempting to manipulate or game the system for unfair advantages is forbidden.</li><li>Advertising without explicit permission is not allowed.</li><li>Do not share personal information of yourself or others.</li><li>We are not responsible for any damages, losses, or liabilities from service usage.</li><li>You acknowledge that this service is provided "as is" without any guarantees.</li><li>We may update these terms at any time without prior notice.</li><li>Using multiple accounts to evade bans or restrictions is not permitted.</li><li>Exploiting glitches or bugs for personal gain is strictly forbidden.</li><li>You must respect all moderators, admins, and community members.</li><li>False reports or abuse of the reporting system will result in penalties.</li><li>Any real-life threats or doxxing will lead to an instant ban and legal action.</li><li>You agree not to use the platform for illegal activities.</li><li>All virtual currency, items, or rewards hold no real-world monetary value.</li><li>You may not redistribute, resell, or copy any part of this service.</li><li>Third-party integrations must follow our security guidelines.</li><li>Attempting to overload our servers with excessive requests is prohibited.</li><li>All disputes must be handled through our official support channels.</li><li>By using this service, you agree to our data collection policies.</li><li>Accounts inactive for extended periods may be deleted.</li><li>We are not liable for downtime, service interruptions, or lost data.</li><li>Paid services or premium memberships are non-refundable.</li><li>You may not use VPNs or proxies to bypass restrictions.</li><li>Do not attempt to resell or trade in-game items outside the service.</li><li>Any attempt to bribe staff or users for personal gain is prohibited.</li><li>All user-generated content must follow community guidelines.</li><li>Moderators have the final say on all rule enforcement decisions.</li><li>All purchases must be authorized by the cardholder or account owner.</li><li>Threats of self-harm or suicide should be reported immediately.</li><li>Posting NSFW (Not Safe For Work) content is strictly prohibited.</li><li>All usernames and profile pictures must be appropriate.</li><li>All players must follow fair play policies at all times.</li><li>Using exploits to bypass in-game mechanics is not allowed.</li><li>Streaming or recording content must comply with platform rules.</li><li>Server administrators have the right to enforce additional rules.</li><li>Using automation tools for farming or grinding is not allowed.</li><li>Attempts to access restricted areas of the site will result in a ban.</li><li>Sharing cheat software, hacks, or exploits is strictly forbidden.</li><li>Account sharing or selling is not allowed.</li><li>You agree that any legal disputes will be handled under our jurisdiction.</li><li>Violation of terms may result in temporary or permanent bans.</li><li>Users must not attempt to intimidate or threaten others.</li><li>Mass messaging, invites, or friend requests to unknown users is not allowed.</li><li>Streaming copyrighted material without permission is forbidden.</li><li>All transactions made within the service are final.</li><li>Admins reserve the right to revoke privileges at any time.</li><li>Spreading misinformation or fake news is strictly prohibited.</li><li>Refund requests will only be considered under specific conditions.</li><li>Any attempt to evade bans using new accounts will result in a permanent IP ban.</li><li>Users must not encourage others to break the rules.</li><li>Public shaming or exposing private conversations is not allowed.</li><li>Users may not use offensive or controversial usernames.</li><li>Threatening legal action without basis will result in removal.</li><li>Users may not trade real-world money for in-game items.</li><li>Spamming emojis, stickers, or gifs excessively is not permitted.</li><li>Users should report violations rather than taking matters into their own hands.</li><li>We reserve the right to remove any content that violates our terms.</li><li>Abusing loopholes in rules or guidelines is still considered a violation.</li><li>Users who falsely claim to be staff or moderators will be banned.</li><li>All forms of gambling using the service are not permitted.</li><li>Users must respect age restrictions on content.</li><li>Do not use the service to promote illegal or unethical behavior.</li><li>All forms of harassment, whether public or private, will not be tolerated.</li><li>Attempting to create unrest or incite arguments is prohibited.</li><li>Using misleading links or bait-and-switch tactics is not allowed.</li><li>All submitted content must adhere to copyright laws.</li><li>Inappropriate profile bios or status messages will be removed.</li><li>Any external links posted must be safe and relevant.</li><li>Deliberately misusing features or commands is not allowed.</li><li>All discussions must remain civil and respectful.</li><li>Users must ensure they follow any additional Discord guidelines.</li><li>Attempting to artificially inflate user statistics is forbidden.</li><li>Mass-reporting users for false claims is against the rules.</li><li>Users may not use alts to bypass chat restrictions.</li><li>Attempting to manipulate staff decisions is not allowed.</li><li>Users found guilty of account theft or scams will be permanently banned.</li><li>Users must accept that changes to rules or features can happen anytime.</li><li>Violation of rules in private chats will also be taken seriously.</li><li>Server logs and moderation actions are confidential.</li><li>Users must respect event rules and participate fairly.</li><li>Any actions that disrupt the community will be punished.</li><li>Attempting to exploit giveaways, contests, or rewards is not allowed.</li><li>Users are responsible for their own security and account safety.</li><li>We reserve the right to take legal action against serious offenses.</li></ul><p>Read the full Terms of Service <a href="#">here</a>.</p></div><div class="legal-section"><h2>Privacy Policy</h2><p>We take your privacy seriously. Our policy covers:</p><ul><li>What data we collect and why.</li><li>How we store and secure your information.</li><li>Your rights and how to manage your data.</li><li>We collect only necessary data required for service functionality.</li><li>Your data is encrypted and securely stored.</li><li>We do not sell your personal data to third parties.</li><li>All user data is protected against unauthorized access.</li><li>We may collect usage data for analytics and service improvement.</li><li>Cookies are used to enhance user experience.</li><li>You have the right to request data deletion.</li><li>We comply with GDPR, CCPA, and other privacy laws.</li><li>We log IP addresses for security purposes.</li><li>Two-factor authentication (2FA) is recommended for account security.</li><li>We do not store your passwords in plain text.</li><li>We only collect personal data you voluntarily provide.</li><li>Data backups are performed regularly for security.</li><li>We do not track users outside of our platform.</li><li>You can opt out of certain data collection practices.</li><li>We use secure protocols (HTTPS, TLS) for data transmission.</li><li>Personal data is deleted after extended inactivity.</li><li>We anonymize data where possible to enhance privacy.</li><li>Your data is not shared with advertisers without consent.</li><li>We store login timestamps for account security tracking.</li><li>You may request a copy of the data we have on you.</li><li>We implement access controls to protect sensitive data.</li><li>Data processing is limited to legitimate business operations.</li><li>We do not use facial recognition or biometric tracking.</li><li>We retain transaction records for financial security.</li><li>Your preferences and settings are stored securely.</li><li>Location data is collected only when explicitly enabled.</li><li>We do not share personal messages or private conversations.</li><li>We may use AI-powered analytics but not for profiling.</li><li>All stored data is periodically reviewed for relevance.</li><li>We use CAPTCHA systems to prevent automated abuse.</li><li>Your contact details are used only for essential communication.</li><li>We do not knowingly collect data from children under 13.</li><li>We respect “Do Not Track” browser settings where applicable.</li><li>Only authorized personnel have access to user data.</li><li>All third-party integrations comply with our privacy policies.</li><li>Third-party service providers must follow strict data policies.</li><li>Users have control over what data they share.</li><li>Data is never used for discriminatory purposes.</li><li>We do not collect banking details unless required for transactions.</li><li>Your data is never used for political or ideological targeting.</li><li>Stored emails are used solely for verification and notifications.</li><li>We provide clear options for unsubscribing from communications.</li><li>Only minimal personally identifiable information (PII) is stored.</li><li>We do not use dark patterns to force consent.</li><li>Personal data is stored for only as long as necessary.</li><li>All payment processing is handled by secure third-party providers.</li><li>Personal data is not shared with law enforcement without legal obligation.</li><li>Users are informed of major privacy policy changes.</li><li>We do not store raw biometric data.</li><li>We review data security measures regularly.</li><li>Users may opt out of non-essential data collection.</li><li>Data is collected transparently, with clear explanations.</li><li>We do not engage in excessive data collection practices.</li><li>Users may update their data preferences at any time.</li><li>We take immediate action in case of data breaches.</li><li>Users can report privacy concerns through official channels.</li><li>All data access is logged and monitored.</li><li>We maintain a dedicated security team for data protection.</li><li>Multi-layered encryption protects all stored data.</li><li>We do not use AI or machine learning to predict personal behavior.</li><li>We follow industry best practices for cybersecurity.</li><li>We implement rate limiting to prevent data scraping.</li><li>We comply with global privacy frameworks and best practices.</li><li>We allow users to delete their accounts permanently.</li><li>Data is stored on secure servers in privacy-compliant regions.</li><li>We require strong passwords to enhance security.</li><li>User-generated content is moderated for compliance.</li><li>Data collection policies are clearly stated in user settings.</li><li>Users are notified of any changes in data handling.</li><li>We have internal audits to ensure compliance.</li><li>We support anonymous usage where feasible.</li><li>We limit employee access to user data.</li><li>Privacy settings are accessible and easy to understand.</li><li>We do not engage in data resale or brokerage.</li><li>Session data is cleared after logout.</li><li>We do not collect unnecessary metadata from messages.</li><li>Users may adjust tracking settings within their profiles.</li><li>We provide transparency reports regarding data requests.</li><li>Users can deactivate tracking for targeted advertising.</li><li>Data portability requests are processed promptly.</li><li>All analytics are anonymized where possible.</li><li>We allow users to disable location tracking.</li><li>We minimize data collection on sign-up.</li><li>We do not require excessive permissions for mobile users.</li><li>Our logs are purged regularly for security.</li><li>We do not collect device fingerprints without consent.</li><li>Users are informed when their data is shared with partners.</li><li>All stored files undergo security checks.</li><li>Our privacy policies are regularly reviewed and updated.</li></ul><p>Read the full Privacy Policy <a href="#">here</a>.</p></div><div class="legal-section"><h2>Data Handling & Compliance</h2><p>We adhere to international data protection laws such as GDPR and CCPA. Your data will:</p><ul><li>We collect only the data necessary for service functionality.</li><li>All user data is securely stored with encryption.</li><li>We never sell user data to third parties.</li><li>Data is processed only for legitimate business purposes.</li><li>We comply with GDPR, CCPA, and other privacy regulations.</li><li>All stored data undergoes regular security audits.</li><li>User passwords are hashed and never stored in plain text.</li><li>We use secure cloud storage with end-to-end encryption.</li><li>Data is regularly backed up to prevent loss.</li><li>Access to sensitive data is strictly limited to authorized personnel.</li><li>All stored data is automatically deleted after a defined retention period.</li><li>We allow users to request a copy of their stored data.</li><li>Users may opt out of non-essential data collection.</li><li>We anonymize collected data whenever possible.</li><li>IP addresses are stored temporarily for security reasons.</li><li>We do not engage in excessive data logging.</li><li>Users can delete their accounts and associated data permanently.</li><li>Session data is automatically cleared upon logout.</li><li>We provide clear explanations on how user data is processed.</li><li>Third-party service providers must comply with our data policies.</li><li>Data encryption is enforced for all transmissions.</li><li>We limit data collection to necessary operational purposes.</li><li>We do not store sensitive personal information unless required.</li><li>All personal data is stored in secure, privacy-compliant regions.</li><li>We do not track users across third-party websites.</li><li>Data collected for analytics is aggregated and anonymized.</li><li>We comply with data deletion requests within a reasonable timeframe.</li><li>We have a strict access control policy for stored data.</li><li>User preferences and settings are stored securely.</li><li>Data retention policies are periodically reviewed and updated.</li><li>We implement real-time monitoring to prevent unauthorized access.</li><li>Multi-factor authentication is required for administrative access.</li><li>We provide users with transparency reports on data requests.</li><li>Data is not stored on insecure or unencrypted devices.</li><li>We do not retain search history beyond operational necessity.</li><li>Users are informed of significant changes to data handling policies.</li><li>Data portability requests are processed within legal guidelines.</li><li>We do not use automated decision-making that impacts user rights.</li><li>Data access logs are reviewed periodically to ensure compliance.</li><li>Only verified employees have access to sensitive data.</li><li>All stored emails are encrypted and used only for verification purposes.</li><li>We do not store user messages unless explicitly permitted.</li><li>We use CAPTCHA verification to prevent automated abuse.</li><li>User-generated content is moderated to ensure compliance.</li><li>We do not collect biometric or facial recognition data.</li><li>We maintain offline backups for critical data recovery.</li><li>We do not process personal data for targeted political advertising.</li><li>Our data centers implement physical and digital security measures.</li><li>All third-party integrations are vetted for compliance.</li><li>We do not engage in excessive metadata collection.</li><li>Data deletion is irreversible and processed within 30 days.</li><li>We notify users in case of a significant data breach.</li><li>Stored files undergo security checks before processing.</li><li>Users may request an audit of the data we store on them.</li><li>We allow users to disable tracking cookies.</li><li>We do not require unnecessary personal information for registration.</li><li>Stored logs are periodically purged to enhance privacy.</li><li>All third-party partners are contractually bound to follow our policies.</li><li>Location data is only collected when explicitly enabled by users.</li><li>We do not store device fingerprints for tracking purposes.</li><li>We maintain transparency regarding how data is used.</li><li>Stored transaction records are protected by financial security standards.</li><li>We do not profile users based on sensitive data.</li><li>Users can request explanations for automated decisions affecting them.</li><li>We ensure that stored backups do not contain unnecessary user data.</li><li>We do not collect voice recordings or other audio data.</li><li>Session tokens expire after a predefined period for security.</li><li>Data is only shared with authorities under a valid legal request.</li><li>We provide clear documentation on how data handling works.</li><li>Stored user preferences are encrypted for privacy.</li><li>Data loss prevention measures are in place to protect user information.</li><li>We continuously update security measures to prevent breaches.</li><li>Users may contact us to correct inaccurate personal data.</li><li>Stored data undergoes periodic integrity checks.</li><li>We follow international best practices for cybersecurity.</li><li>We provide an easily accessible data management dashboard.</li><li>Data stored on our servers is protected by strict access controls.</li><li>We do not use machine learning to predict private user behavior.</li><li>We regularly review data handling policies to ensure compliance.</li><li>Stored logs contain only essential diagnostic information.</li><li>Data is automatically purged from inactive accounts.</li><li>We conduct internal audits to detect potential vulnerabilities.</li><li>Data is not used to manipulate user choices.</li><li>We clearly explain all data handling practices.</li><li>We prevent unauthorized data scraping through security measures.</li><li>Users can adjust privacy settings at any time.</li><li>Stored chat logs are encrypted and only accessible by the user.</li><li>We do not store unnecessary personal identifiers.</li><li>We protect against unauthorized API access to user data.</li><li>We use AI responsibly without excessive data mining.</li><li>Data access logs are reviewed for suspicious activity.</li><li>Stored passwords are hashed using industry-standard algorithms.</li><li>We provide users with control over their data retention policies.</li><li>We do not process personal data for purposes unrelated to our services.</li><li>We allow users to restrict the visibility of their personal data.</li><li>We provide clear disclosures on all data collection methods.</li><li>We do not use data to create psychological profiles of users.</li><li>All data policies align with international human rights standards.</li><li>We take immediate action against security vulnerabilities.</li><li>Stored multimedia files undergo scanning for security threats.</li><li>We provide privacy training for employees handling user data.</li><li>Stored sensitive data is accessible only through secure authentication.</li></ul><p>Learn more about data handling <a href="#">here</a>.</p></div></div></div></body></html>

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
    <title>CreatorHub - Support Ticket</title>

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
            <div class="h-captcha" data-sitekey="c3d047fe-4c10-4718-8e0a-85606d44518a" data-callback="onCaptchaVerified"></div>

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
    

    
    
app.get('/mod-application', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moderator Application - CreatorHub</title>
    
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
            <div class="h-captcha" id="captcha" data-sitekey="c3d047fe-4c10-4718-8e0a-85606d44518a" data-callback="onCaptchaVerified"></div>

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
                sitekey: 'c3d047fe-4c10-4718-8e0a-85606d44518a',
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
    <title>Premium Membership - CreatorHub</title>

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
                    <div class="h-captcha" data-sitekey="your-hcaptcha-sitekey"></div>
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
    <title>Advanced Settings - CreatorHub</title>

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
    <title>The CreatorHub API Documentation</title>
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
    <p>Welcome to the <strong>CreatorHub API Documentation</strong>. This API allows you to interact with various services, including:</p>
    
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
    <p>CreatorHub API supports multiple authentication methods:</p>
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
    <p>Errors in CreatorHub API follow a structured JSON response format. This ensures that developers can easily identify issues and implement proper error-handling mechanisms.</p>

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
            "name": "CreatorHub",
            "owner_id": "987654321",
            "member_count": 25000,
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
    "name": "CreatorHub",
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




app.use(express.json());
app.use(cookieParser(config.COOKIE_SECRET));

/**
 * ✅ **OAuth Callback Route**
 * - Verifies state to prevent CSRF
 * - Exchanges the code for OAuth tokens
 * - Fetches user data from Discord
 * - Stores tokens securely
 * - Updates Discord metadata
 * - Displays success page with auto-redirect
 */
app.get('/discord-oauth-callback', async (req, res) => {
  try {
    // ✅ Get Code & State from Query Parameters
    const code = req.query.code;
    const discordState = req.query.state;
    const { clientState } = req.signedCookies;

    console.log('🔹 Stored State:', clientState);
    console.log('🔹 Discord State:', discordState);

    // ✅ State Verification (CSRF Protection)
if (!clientState || clientState !== discordState) {
  console.error('❌ State verification failed.');
  
  return res.status(403).send(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="CreatorHub is a business-focused Growtopia fan community server with over 560,000 members. Join us to connect, collaborate, and thrive." />
  <meta name="keywords" content="Growtopia, community, server, CreatorHub, gaming, fan community, thelostnemo glitch me, glitch nemo, tln, market" />
  <meta name="author" content="reCAPTCHA Verification" />
  <meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="application-name" content="reCAPTCHA"><meta name="apple-mobile-web-app-title" content="reCAPTCHA"><meta name="apple-mobile-web-app-status-bar-style" content="black"><meta name="msapplication-tap-highlight" content="no">
  <link rel="icon" href="https://www.gstatic.com/recaptcha/express_onboarding/favicon.ico" sizes="32x32"><link rel="apple-touch-icon-precomposed" href="https://www.gstatic.com/recaptcha/express_onboarding/favicon.ico" sizes="32x32"><link rel="msapplication-square32x32logo" href="https://www.gstatic.com/recaptcha/express_onboarding/favicon.ico" sizes="32x32">
  <title>Verification Failed</title>
  <link rel="preconnect" href="https://www.google.com">
  <link rel="preconnect" href="https://www.gstatic.com" crossorigin>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      background-color: #1e1e2e;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      text-align: center;
      flex-direction: column;
    }

    .error-message {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      font-weight: bold;
    }

    .dog-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
      margin-top: 20px;
    }

    .main {
      position: relative;
      width: 23.5vmax;
      height: 23.5vmax;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .leg {
      position: absolute;
      bottom: 0;
      width: 2vmax;
      height: 2.125vmax;
    }

    .paw {
      position: absolute;
      bottom: 2px;
      left: 0;
      width: 1.95vmax;
      height: 1.8vmax;
      overflow: hidden;
    }

    .paw::before {
      content: "";
      position: absolute;
      width: 5vmax;
      height: 3vmax;
      border-radius: 50%;
    }

    .top {
      position: absolute;
      bottom: 0;
      left: 0.75vmax;
      height: 4.5vmax;
      width: 2.625vmax;
      border-top-left-radius: 1.425vmax;
      border-top-right-radius: 1.425vmax;
      transform-origin: bottom right;
      transform: rotateZ(90deg) translateX(-0.1vmax) translateY(1.5vmax);
      z-index: -1;
      background-image: linear-gradient(70deg, transparent 20%, #deac80 20%);
    }

    .dog {
      position: relative;
      width: 20vmax;
      height: 8vmax;
    }

    .dog::before {
      content: "";
      position: absolute;
      bottom: -0.75vmax;
      right: -0.15vmax;
      width: 100%;
      height: 1.5vmax;
      background-color: #b5c18e;
      border-radius: 50%;
      z-index: -1000;
      animation: shadow 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
    }

    .dog__head {
      position: absolute;
      left: 4.5vmax;
      bottom: 0;
      width: 8vmax;
      height: 5vmax;
      border-top-left-radius: 4.05vmax;
      border-top-right-radius: 4.05vmax;
      border-bottom-right-radius: 3.3vmax;
      border-bottom-left-radius: 3.3vmax;
      background-color: #deac80;
      animation: head 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
    }

    .dog__head-c {
      position: absolute;
      left: 1.5vmax;
      bottom: 0;
      width: 9.75vmax;
      height: 8.25vmax;
      animation: head 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
      z-index: -1;
    }

    .dog__snout {
      position: absolute;
      left: -1.5vmax;
      bottom: 0;
      width: 7.5vmax;
      height: 3.75vmax;
      border-top-right-radius: 3vmax;
      border-bottom-right-radius: 3vmax;
      border-bottom-left-radius: 4.5vmax;
      background-color: #f7dcb9;
      animation: snout 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
    }

    .dog__snout::before {
      content: "";
      position: absolute;
      left: -0.1125vmax;
      top: -0.15vmax;
      width: 1.875vmax;
      height: 1.125vmax;
      border-top-right-radius: 3vmax;
      border-bottom-right-radius: 3vmax;
      border-bottom-left-radius: 4.5vmax;
      background-color: #6c4e31;
      animation: snout-b 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
    }

    .dog__nose {
      position: absolute;
      top: -1.95vmax;
      left: 40%;
      width: 0.75vmax;
      height: 2.4vmax;
      border-radius: 0.525vmax;
      transform-origin: bottom;
      transform: rotateZ(10deg);
      background-color: #d7dbd2;
    }

    .dog__eye-l,
    .dog__eye-r {
      position: absolute;
      top: -0.9vmax;
      width: 0.675vmax;
      height: 0.375vmax;
      border-radius: 50%;
      background-color: #1c3130;
      animation: eye 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
    }

    .dog__eye-l {
      left: 27%;
    }

    .dog__eye-r {
      left: 65%;
    }

    .dog__ear-l,
    .dog__ear-r {
      position: absolute;
      width: 5vmax;
      height: 3.3vmax;
      border-top-left-radius: 3.3vmax;
      border-top-right-radius: 3vmax;
      border-bottom-right-radius: 5vmax;
      border-bottom-left-radius: 5vmax;
      background-color: #deac80;
    }

    .dog__ear-l {
      top: 1.5vmax;
      left: 10vmax;
      transform-origin: bottom left;
      transform: rotateZ(-50deg);
      z-index: -1;
      animation: ear-l 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
    }

    .dog__ear-r {
      top: 1.5vmax;
      right: 3vmax;
      transform-origin: bottom right;
      transform: rotateZ(25deg);
      z-index: -2;
      animation: ear-r 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
    }

    .dog__body {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      position: absolute;
      bottom: 0.3vmax;
      left: 6vmax;
      width: 18vmax;
      height: 4vmax;
      border-top-left-radius: 3vmax;
      border-top-right-radius: 6vmax;
      border-bottom-right-radius: 1.5vmax;
      border-bottom-left-radius: 6vmax;
      background-color: #914f1e;
      z-index: -2;
      animation: body 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
    }

    .dog__tail {
      position: absolute;
      top: 20px;
      right: -1.5vmax;
      height: 3vmax;
      width: 4vmax;
      background-color: #914f1e;
      border-radius: 1.5vmax;
    }

    .dog__paws {
      position: absolute;
      bottom: 0;
      left: 7.5vmax;
      width: 10vmax;
      height: 3vmax;
    }

    .dog__bl-leg {
      left: -3vmax;
      z-index: -10;
    }

    .dog__bl-paw::before {
      background-color: #fffbe6;
    }

    .dog__bl-top {
      background-image: linear-gradient(80deg, transparent 20%, #deac80 20%);
    }

    .dog__fl-leg {
      z-index: 10;
      left: 0;
    }

    .dog__fl-paw::before {
      background-color: #fffbe6;
    }

    .dog__fr-leg {
      right: 0;
    }

    .dog__fr-paw::before {
      background-color: #fffbe6;
    }

    @keyframes head {
      0%, 10%, 20%, 26%, 28%, 90%, 100% {
        height: 8.25vmax;
        bottom: 0;
        transform-origin: bottom right;
        transform: rotateZ(0);
      }
      5%, 15%, 22%, 24%, 30% {
        height: 8.1vmax;
      }
      32%, 50% {
        height: 8.25vmax;
      }
      55%, 60% {
        bottom: 0.75vmax;
        transform-origin: bottom right;
        transform: rotateZ(0);
      }
      70%, 80% {
        bottom: 0.75vmax;
        transform-origin: bottom right;
        transform: rotateZ(10deg);
      }
    }

    @keyframes body {
      0%, 10%, 20%, 26%, 28%, 32%, 100% {
        height: 7.2vmax;
      }
      5%, 15%, 22%, 24%, 30% {
        height: 7.05vmax;
      }
    }

    @keyframes ear-l {
      0%, 10%, 20%, 26%, 28%, 82%, 100% {
        transform: rotateZ(-50deg);
      }
      5%, 15%, 22%, 24% {
        transform: rotateZ(-48deg);
      }
      30%, 31% {
        transform: rotateZ(-30deg);
      }
      32%, 80% {
        transform: rotateZ(-60deg);
      }
    }

    @keyframes ear-r {
      0%, 10%, 20%, 26%, 28% {
        transform: rotateZ(20deg);
      }
      5%, 15%, 22%, 24% {
        transform: rotateZ(18deg);
      }
      30%, 31% {
        transform: rotateZ(10deg);
      }
      32% {
        transform: rotateZ(25deg);
      }
    }

    @keyframes snout {
      0%, 10%, 20%, 26%, 28%, 82%, 100% {
        height: 3.75vmax;
      }
      5%, 15%, 22%, 24% {
        height: 3.45vmax;
      }
    }

    @keyframes snout-b {
      0%, 10%, 20%, 26%, 28%, 98%, 100% {
        width: 1.875vmax;
      }
      5%, 15%, 22%, 24% {
        width: 1.8vmax;
      }
      34%, 98% {
        width: 1.275vmax;
      }
    }

    @keyframes shadow {
      0%, 10%, 20%, 26%, 28%, 30%, 84%, 100% {
        width: 99%;
      }
      5%, 15%, 22%, 24% {
        width: 101%;
      }
      34%, 81% {
        width: 96%;
      }
    }

    @keyframes eye {
      0%, 30% {
        width: 0.675vmax;
        height: 0.3vmax;
      }
      32%, 59%, 90%, 100% {
        width: 0.525vmax;
        height: 0.525vmax;
        transform: translateY(0);
      }
      60%, 75% {
        transform: translateY(-0.3vmax);
      }
      80%, 85% {
        transform: translateY(0.15vmax);
      }
    }
  </style>
</head>
<body>
  <div class="error-message" id="error-text">State verification failed. Try logging in again.</div>

  <div class="dog-container">
    <div class="main">
      <div class="dog">
        <div class="dog__paws">
          <div class="dog__bl-leg leg">
            <div class="dog__bl-paw paw"></div>
            <div class="dog__bl-top top"></div>
          </div>
          <div class="dog__fl-leg leg">
            <div class="dog__fl-paw paw"></div>
            <div class="dog__fl-top top"></div>
          </div>
          <div class="dog__fr-leg leg">
            <div class="dog__fr-paw paw"></div>
            <div class="dog__fr-top top"></div>
          </div>
        </div>

        <div class="dog__body">
          <div class="dog__tail"></div>
        </div>

        <div class="dog__head">
          <div class="dog__snout">
            <div class="dog__eyes">
              <div class="dog__eye-l"></div>
              <div class="dog__eye-r"></div>
            </div>
          </div>
        </div>

        <div class="dog__head-c">
          <div class="dog__ear-r"></div>
          <div class="dog__ear-l"></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const messages = [
      "Creatorless might have forgotten to fix this...",
      "Oops! Something broke... again.",
      "CSRF said NOPE!",
      "Even the dog is confused 🐶",
      "Try turning it off and on again?",
      "Don't look at me, I just work here.",
      "I blame the cat for this one.",
      "Well... that wasn't supposed to happen.",
      "Did you really think that would work?",
      "Maybe refresh? Maybe not?"
    ];

    document.getElementById("error-text").innerText = messages[Math.floor(Math.random() * messages.length)];
  </script>
</body>
</html>

  `);
}


    // ✅ Exchange Code for OAuth Tokens
    const tokens = await discord.getOAuthTokens(code);
    if (!tokens || !tokens.access_token) {
      console.error('❌ Failed to get OAuth tokens.');
      return res.status(500).send('<h1>OAuth token exchange failed.</h1>');
    }

    // ✅ Fetch User Data from Discord
    const meData = await discord.getUserData(tokens);
    if (!meData || !meData.user || !meData.user.id) {
      console.error('❌ Failed to retrieve user data.');
      return res.status(500).send('<h1>Failed to fetch user data from Discord.</h1>');
    }

    const userId = meData.user.id;

    // ✅ Store Tokens Securely
    await storage.storeDiscordTokens(userId, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + tokens.expires_in * 1000,
    });

    console.log(`✅ OAuth completed for user: ${userId}`);

    // ✅ Update Discord Metadata
    await updateMetadata(userId);

    // ✅ Send Success Page with Auto-Redirect
    res.send(getSuccessPage());
  } catch (e) {
    console.error('❌ Error in OAuth callback:', e);
    res.status(500).send('<h1>An error occurred during authentication.</h1>');
  }
});

/**
 * ✅ **Manual Metadata Update Route**
 * - Can be triggered by external services or events.
 */
app.post('/update-metadata', async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).send('<h1>Missing userId in request.</h1>');
    }
    
    await updateMetadata(userId);
    res.sendStatus(204);
  } catch (e) {
    console.error('❌ Error updating metadata:', e);
    res.status(500).send('<h1>Failed to update metadata.</h1>');
  }
});

/**
 * ✅ **Update Discord Metadata**
 * - Pushes static/future data updates to Discord.
 */
async function updateMetadata(userId) {
  try {
    // ✅ Fetch Stored Tokens
    const tokens = await storage.getDiscordTokens(userId);
    if (!tokens || !tokens.access_token) {
      console.error(`❌ No tokens found for user ${userId}`);
      return;
    }

    // ✅ Define Metadata
    const metadata = {
      cookieseaten: 1483,
      allergictonuts: 0, // 0 = False, 1 = True
      firstcookiebaked: '2003-12-20',
    };

    // ✅ Push Metadata to Discord
    await discord.pushMetadata(userId, tokens, metadata);
    console.log(`✅ Metadata updated for user ${userId}`);
  } catch (e) {
    console.error(`❌ Error updating metadata for ${userId}:`, e);
  }
}

/**
 * ✅ **Success Page (Auto-Redirect)**
 * - Displays success message and redirects after 5 seconds.
 */
function getSuccessPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="CreatorHub is a business-focused Growtopia fan community server with over 560,000 members. Join us to connect, collaborate, and thrive." />
  <meta name="keywords" content="Growtopia, community, server, CreatorHub, gaming, fan community, thelostnemo glitch me, glitch nemo, tln, market" />
  <meta name="author" content="reCAPTCHA Verification" />
  <meta name="robots" content="noindex, nofollow">
  <meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="application-name" content="reCAPTCHA"><meta name="apple-mobile-web-app-title" content="reCAPTCHA"><meta name="apple-mobile-web-app-status-bar-style" content="black"><meta name="msapplication-tap-highlight" content="no">
  <link rel="icon" href="https://www.gstatic.com/recaptcha/express_onboarding/favicon.ico" sizes="32x32"><link rel="apple-touch-icon-precomposed" href="https://www.gstatic.com/recaptcha/express_onboarding/favicon.ico" sizes="32x32"><link rel="msapplication-square32x32logo" href="https://www.gstatic.com/recaptcha/express_onboarding/favicon.ico" sizes="32x32">
  <title>reCAPTCHA Verification</title>
  <link rel="preconnect" href="https://www.google.com">
  <link rel="preconnect" href="https://www.gstatic.com" crossorigin>
  <style>
    body { font-family: Arial, sans-serif; background: #0A0F1D; color: #E0E6F1; text-align: center; padding: 50px; }
    .container { background: #101826; padding: 25px; border: 2px solid #1E90FF; max-width: 380px; margin: auto; }
    h1 { color: #1E90FF; }
    .timer { font-size: 20px; font-weight: bold; margin-top: 15px; color: #1E90FF; }
  </style>
</head>
<body>
  <div class="container">
    <h1>✅ Verification Successful</h1>
    <p>You will be redirected shortly...</p>
    <div id="timer" class="timer">Redirecting in <span id="countdown">5</span> seconds...</div>
  </div>
  <script>
    let countdownTime = 5;
    function updateCountdown() {
      if (countdownTime <= 0) window.location.href = "https://discord.com/channels/@me";
      else document.getElementById("countdown").textContent = countdownTime--;
    }
    setInterval(updateCountdown, 1000);
  </script>
</body>
</html>`;
}

// 404 error handling middleware
app.use((req, res, next) => {
    res.status(404).send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="The page you are looking for does not exist. Please check the URL or return to the homepage.">
    <meta name="keywords" content="404, error, not found, page not found">
    <meta name="robots" content="noindex, nofollow">
    <meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="application-name" content="reCAPTCHA"><meta name="apple-mobile-web-app-title" content="reCAPTCHA"><meta name="apple-mobile-web-app-status-bar-style" content="black"><meta name="msapplication-tap-highlight" content="no">
  <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/7465/7465751.png" sizes="32x32"><link rel="apple-touch-icon-precomposed" href="https://www.pngkey.com/png/full/242-2428504_respond-question-mark-icon.png" sizes="32x32"><link rel="msapplication-square32x32logo" href="https://www.pngkey.com/png/full/242-2428504_respond-question-mark-icon.png" sizes="32x32">
    <meta property="og:title" content="Page Not Found">
    <meta property="og:description" content="The page you are looking for does not exist.">
    <meta property="og:image" content="https://via.placeholder.com/150">
    <meta property="og:url" content="https://thelostnemo.glitch.me/">
    <title>Page Not Found?</title>
    <title>Page Not Found</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
        }
        .container {
            text-align: center;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 0.5rem;
            color: #333;
        }
        p {
            font-size: 1.2rem;
            color: #666;
        }
        #svg-global {
            zoom: 1.2;
            overflow: visible;
            margin-top: 20px;
        }
        .icon {
            font-size: 2rem;
            color: #4B22B5;
            margin-top: 20px;
        }
        #svg-global {
            zoom: 1.2;
            overflow: visible;
        }

        @keyframes fade-particles {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

        @keyframes floatUp {
            0% {
                transform: translateY(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            100% {
                transform: translateY(-40px);
                opacity: 0;
            }
        }

        #particles {
            animation: fade-particles 5s infinite alternate;
        }
        .particle {
            animation: floatUp linear infinite;
        }

        .p1 {
            animation-duration: 2.2s;
            animation-delay: 0s;
        }
        .p2 {
            animation-duration: 2.5s;
            animation-delay: 0.3s;
        }
        .p3 {
            animation-duration: 2s;
            animation-delay: 0.6s;
        }
        .p4 {
            animation-duration: 2.8s;
            animation-delay: 0.2s;
        }
        .p5 {
            animation-duration: 2.3s;
            animation-delay: 0.4s;
        }
        .p6 {
            animation-duration: 3s;
            animation-delay: 0.1s;
        }
        .p7 {
            animation-duration: 2.1s;
            animation-delay: 0.5s;
        }
        .p8 {
            animation-duration: 2.6s;
            animation-delay: 0.2s;
        }
        .p9 {
            animation-duration: 2.4s;
            animation-delay: 0.3s;
        }

        @keyframes bounce-lines {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-3px);
            }
        }

        #line-v1, #line-v2, #node-server, #panel-rigth, #reflectores, #particles {
            animation: bounce-lines 3s ease-in-out infinite alternate;
        }
        #line-v2 {
            animation-delay: 0.2s;
        }
        #node-server, #panel-rigth, #reflectores, #particles {
            animation-delay: 0.4s;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <i class="fas fa-exclamation-triangle icon"></i>
        <div id="svg-global">
            <svg
                id="svg-global"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 94 136"
                height="136"
                width="94"
            >
                <path
                    stroke="#4B22B5"
                    d="M87.3629 108.433L49.1073 85.3765C47.846 84.6163 45.8009 84.6163 44.5395 85.3765L6.28392 108.433C5.02255 109.194 5.02255 110.426 6.28392 111.187L44.5395 134.243C45.8009 135.004 47.846 135.004 49.1073 134.243L87.3629 111.187C88.6243 110.426 88.6243 109.194 87.3629 108.433Z"
                    id="line-v1"
                ></path>
                <path
                    stroke="#5728CC"
                    d="M91.0928 95.699L49.2899 70.5042C47.9116 69.6734 45.6769 69.6734 44.2986 70.5042L2.49568 95.699C1.11735 96.5298 1.11735 97.8767 2.49568 98.7074L44.2986 123.902C45.6769 124.733 47.9116 124.733 49.2899 123.902L91.0928 98.7074C92.4712 97.8767 92.4712 96.5298 91.0928 95.699Z"
                    id="line-v2"
                ></path>
                <g id="node-server">
                    <path
                        fill="url(#paint0_linear_204_217)"
                        d="M2.48637 72.0059L43.8699 96.9428C45.742 98.0709 48.281 97.8084 50.9284 96.2133L91.4607 71.7833C92.1444 71.2621 92.4197 70.9139 92.5421 70.1257V86.1368C92.5421 86.9686 92.0025 87.9681 91.3123 88.3825C84.502 92.4724 51.6503 112.204 50.0363 113.215C48.2352 114.343 45.3534 114.343 43.5523 113.215C41.9261 112.197 8.55699 91.8662 2.08967 87.926C1.39197 87.5011 1.00946 86.5986 1.00946 85.4058V70.1257C1.11219 70.9289 1.49685 71.3298 2.48637 72.0059Z"
                    ></path>
                    <path
                        stroke="url(#paint2_linear_204_217)"
                        fill="url(#paint1_linear_204_217)"
                        d="M91.0928 68.7324L49.2899 43.5375C47.9116 42.7068 45.6769 42.7068 44.2986 43.5375L2.49568 68.7324C1.11735 69.5631 1.11735 70.91 2.49568 71.7407L44.2986 96.9356C45.6769 97.7663 47.9116 97.7663 49.2899 96.9356L91.0928 71.7407C92.4712 70.91 92.4712 69.5631 91.0928 68.7324Z"
                    ></path>
                    <mask
                        height="41"
                        width="67"
                        y="50"
                        x="13"
                        maskUnits="userSpaceOnUse"
                        style="mask-type:luminance"
                        id="mask0_204_217"
                    >
                        <path
                            fill="white"
                            d="M78.3486 68.7324L49.0242 51.0584C47.6459 50.2276 45.4111 50.2276 44.0328 51.0584L14.7084 68.7324C13.3301 69.5631 13.3301 70.91 14.7084 71.7407L44.0328 89.4148C45.4111 90.2455 47.6459 90.2455 49.0242 89.4148L78.3486 71.7407C79.7269 70.91 79.727 69.5631 78.3486 68.7324Z"
                        ></path>
                    </mask>
                    <g mask="url(#mask0_204_217)">
                        <path
                            fill="#332C94"
                            d="M78.3486 68.7324L49.0242 51.0584C47.6459 50.2276 45.4111 50.2276 44.0328 51.0584L14.7084 68.7324C13.3301 69.5631 13.3301 70.91 14.7084 71.7407L44.0328 89.4148C45.4111 90.2455 47.6459 90.2455 49.0242 89.4148L78.3486 71.7407C79.7269 70.91 79.727 69.5631 78.3486 68.7324Z"
                        ></path>
                        <mask
                            height="29"
                            width="48"
                            y="56"
                            x="23"
                            maskUnits="userSpaceOnUse"
                            style="mask-type:luminance"
                            id="mask1_204_217"
                        >
                            <path
                                fill="white"
                                d="M68.9898 68.7324L49.0242 56.699C47.6459 55.8683 45.4111 55.8683 44.0328 56.699L24.0673 68.7324C22.6889 69.5631 22.6889 70.91 24.0673 71.7407L44.0328 83.7741C45.4111 84.6048 47.6459 84.6048 49.0242 83.7741L68.9898 71.7407C70.3681 70.91 70.3681 69.5631 68.9898 68.7324Z"
                            ></path>
                        </mask>
                        <g mask="url(#mask1_204_217)">
                            <path
                                fill="#5E5E5E"
                                d="M68.9898 68.7324L49.0242 56.699C47.6459 55.8683 45.4111 55.8683 44.0328 56.699L24.0673 68.7324C22.6889 69.5631 22.6889 70.91 24.0673 71.7407L44.0328 83.7741C45.4111 84.6048 47.6459 84.6048 49.0242 83.7741L68.9898 71.7407C70.3681 70.91 70.3681 69.5631 68.9898 68.7324Z"
                            ></path>
                            <path
                                fill="#71B1C6"
                                d="M70.1311 69.3884L48.42 56.303C47.3863 55.6799 45.7103 55.6799 44.6765 56.303L22.5275 69.6523C21.4938 70.2754 21.4938 71.2855 22.5275 71.9086L44.2386 84.994C45.2723 85.617 46.9484 85.617 47.9821 84.994L70.1311 71.6446C71.1648 71.0216 71.1648 70.0114 70.1311 69.3884Z"
                            ></path>
                            <path
                                fill="#80C0D4"
                                d="M70.131 70.8923L48.4199 57.8069C47.3862 57.1839 45.7101 57.1839 44.6764 57.8069L22.5274 71.1562C21.4937 71.7793 21.4937 72.7894 22.5274 73.4125L44.2385 86.4979C45.2722 87.1209 46.9482 87.1209 47.982 86.4979L70.131 73.1486C71.1647 72.5255 71.1647 71.5153 70.131 70.8923Z"
                            ></path>
                            <path
                                fill="#89D3EB"
                                d="M69.751 72.1675L48.4199 59.3111C47.3862 58.6881 45.7101 58.6881 44.6764 59.3111L23.2004 72.2548C22.1667 72.8779 22.1667 73.888 23.2004 74.5111L44.5315 87.3674C45.5653 87.9905 47.2413 87.9905 48.2751 87.3674L69.751 74.4238C70.7847 73.8007 70.7847 72.7905 69.751 72.1675Z"
                            ></path>
                            <path
                                fill="#97E6FF"
                                d="M68.5091 72.9231L48.4199 60.8153C47.3862 60.1922 45.7101 60.1922 44.6764 60.8153L24.8146 72.7861C23.7808 73.4091 23.7808 74.4193 24.8146 75.0424L44.9038 87.1502C45.9375 87.7733 47.6135 87.7733 48.6473 87.1502L68.5091 75.1794C69.5428 74.5563 69.5428 73.5462 68.5091 72.9231Z"
                            ></path>
                            <path
                                fill="#97E6FF"
                                d="M66.6747 73.3219L48.4199 62.3197C47.3862 61.6966 45.7101 61.6966 44.6764 62.3197L24.8146 73.3101C23.7808 73.9332 23.7808 74.9433 24.8146 75.5664L44.696 86.5686C45.7297 87.1917 47.4058 87.1917 48.4395 86.5686L66.6747 75.5782C67.7084 74.9551 67.7084 73.945 66.6747 73.3219Z"
                            ></path>
                        </g>
                        <path
                            stroke-width="0.5"
                            stroke="#F4F4F4"
                            d="M68.9898 68.7324L49.0242 56.699C47.6459 55.8683 45.4111 55.8683 44.0328 56.699L24.0673 68.7324C22.6889 69.5631 22.6889 70.91 24.0673 71.7407L44.0328 83.7741C45.4111 84.6048 47.6459 84.6048 49.0242 83.7741L68.9898 71.7407C70.3681 70.91 70.3681 69.5631 68.9898 68.7324Z"
                        ></path>
                    </g>
                </g>
                <g id="particles">
                    <path
                        fill="url(#paint3_linear_204_217)"
                        d="M43.5482 32.558C44.5429 32.558 45.3493 31.7162 45.3493 30.6778C45.3493 29.6394 44.5429 28.7976 43.5482 28.7976C42.5535 28.7976 41.7471 29.6394 41.7471 30.6778C41.7471 31.7162 42.5535 32.558 43.5482 32.558Z"
                        class="particle p1"
                    ></path>
                    <path
                        fill="url(#paint4_linear_204_217)"
                        d="M50.0323 48.3519C51.027 48.3519 51.8334 47.5101 51.8334 46.4717C51.8334 45.4333 51.027 44.5915 50.0323 44.5915C49.0375 44.5915 48.2311 45.4333 48.2311 46.4717C48.2311 47.5101 49.0375 48.3519 50.0323 48.3519Z"
                        class="particle p2"
                    ></path>
                    <path
                        fill="url(#paint5_linear_204_217)"
                        d="M40.3062 62.6416C41.102 62.6416 41.7471 61.9681 41.7471 61.1374C41.7471 60.3067 41.102 59.6332 40.3062 59.6332C39.5104 59.6332 38.8653 60.3067 38.8653 61.1374C38.8653 61.9681 39.5104 62.6416 40.3062 62.6416Z"
                        class="particle p3"
                    ></path>
                    <path
                        fill="url(#paint6_linear_204_217)"
                        d="M50.7527 73.9229C52.1453 73.9229 53.2743 72.7444 53.2743 71.2906C53.2743 69.8368 52.1453 68.6583 50.7527 68.6583C49.3601 68.6583 48.2311 69.8368 48.2311 71.2906C48.2311 72.7444 49.3601 73.9229 50.7527 73.9229Z"
                        class="particle p4"
                    ></path>
                    <path
                        fill="url(#paint7_linear_204_217)"
                        d="M48.5913 76.9312C49.1882 76.9312 49.672 76.4262 49.672 75.8031C49.672 75.1801 49.1882 74.675 48.5913 74.675C47.9945 74.675 47.5107 75.1801 47.5107 75.8031C47.5107 76.4262 47.9945 76.9312 48.5913 76.9312Z"
                        class="particle p5"
                    ></path>
                    <path
                        fill="url(#paint8_linear_204_217)"
                        d="M52.9153 67.1541C53.115 67.1541 53.2768 66.9858 53.2768 66.7781C53.2768 66.5704 53.115 66.402 52.9153 66.402C52.7156 66.402 52.5538 66.5704 52.5538 66.7781C52.5538 66.9858 52.7156 67.1541 52.9153 67.1541Z"
                        class="particle p6"
                    ></path>
                    <path
                        fill="url(#paint9_linear_204_217)"
                        d="M52.1936 43.8394C52.7904 43.8394 53.2743 43.3344 53.2743 42.7113C53.2743 42.0883 52.7904 41.5832 52.1936 41.5832C51.5967 41.5832 51.1129 42.0883 51.1129 42.7113C51.1129 43.3344 51.5967 43.8394 52.1936 43.8394Z"
                        class="particle p7"
                    ></path>
                    <path
                        fill="url(#paint10_linear_204_217)"
                        d="M57.2367 29.5497C57.8335 29.5497 58.3173 29.0446 58.3173 28.4216C58.3173 27.7985 57.8335 27.2935 57.2367 27.2935C56.6398 27.2935 56.156 27.7985 56.156 28.4216C56.156 29.0446 56.6398 29.5497 57.2367 29.5497Z"
                        class="particle p8"
                    ></path>
                    <path
                        fill="url(#paint11_linear_204_217)"
                        d="M43.9084 34.8144C44.3063 34.8144 44.6289 34.4777 44.6289 34.0623C44.6289 33.647 44.3063 33.3102 43.9084 33.3102C43.5105 33.3102 43.188 33.647 43.188 34.0623C43.188 34.4777 43.5105 34.8144 43.9084 34.8144Z"
                        class="particle p9"
                    ></path>
                </g>
                <g id="reflectores">
                    <path
                        fill-opacity="0.2"
                        fill="url(#paint12_linear_204_217)"
                        d="M49.2037 57.0009L68.7638 68.7786C69.6763 69.3089 69.7967 69.9684 69.794 70.1625V13.7383C69.7649 13.5587 69.6807 13.4657 69.4338 13.3096L48.4832 0.601307C46.9202 -0.192595 46.0788 -0.208238 44.6446 0.601307L23.6855 13.2118C23.1956 13.5876 23.1966 13.7637 23.1956 14.4904L23.246 70.1625C23.2948 69.4916 23.7327 69.0697 25.1768 68.2447L43.9084 57.0008C44.8268 56.4344 45.3776 56.2639 46.43 56.2487C47.5299 56.2257 48.1356 56.4222 49.2037 57.0009Z"
                    ></path>
                    <path
                        fill-opacity="0.2"
                        fill="url(#paint13_linear_204_217)"
                        d="M48.8867 27.6696C49.9674 26.9175 68.6774 14.9197 68.6774 14.9197C69.3063 14.5327 69.7089 14.375 69.7796 13.756V70.1979C69.7775 70.8816 69.505 71.208 68.7422 71.7322L48.9299 83.6603C48.2003 84.1258 47.6732 84.2687 46.5103 84.2995C45.3295 84.2679 44.8074 84.1213 44.0907 83.6603L24.4348 71.8149C23.5828 71.3313 23.2369 71.0094 23.2316 70.1979L23.1884 13.9816C23.1798 14.8398 23.4982 15.3037 24.7518 16.0874C24.7518 16.0874 42.7629 26.9175 44.2038 27.6696C45.6447 28.4217 46.0049 28.4217 46.5452 28.4217C47.0856 28.4217 47.806 28.4217 48.8867 27.6696Z"
                    ></path>
                </g>
                <g id="panel-rigth">
                    <mask fill="white" id="path-26-inside-1_204_217">
                        <path
                            d="M72 91.8323C72 90.5121 72.9268 88.9068 74.0702 88.2467L87.9298 80.2448C89.0731 79.5847 90 80.1198 90 81.44V81.44C90 82.7602 89.0732 84.3656 87.9298 85.0257L74.0702 93.0275C72.9268 93.6876 72 93.1525 72 91.8323V91.8323Z"
                        ></path>
                    </mask>
                    <path
                        fill="#91DDFB"
                        d="M72 91.8323C72 90.5121 72.9268 88.9068 74.0702 88.2467L87.9298 80.2448C89.0731 79.5847 90 80.1198 90 81.44V81.44C90 82.7602 89.0732 84.3656 87.9298 85.0257L74.0702 93.0275C72.9268 93.6876 72 93.1525 72 91.8323V91.8323Z"
                    ></path>
                    <path
                        mask="url(#path-26-inside-1_204_217)"
                        fill="#489CB7"
                        d="M72 89.4419L90 79.0496L72 89.4419ZM90.6928 81.44C90.6928 82.9811 89.6109 84.8551 88.2762 85.6257L74.763 93.4275C73.237 94.3085 72 93.5943 72 91.8323V91.8323C72 92.7107 72.9268 92.8876 74.0702 92.2275L87.9298 84.2257C88.6905 83.7865 89.3072 82.7184 89.3072 81.84L90.6928 81.44ZM72 94.2227V89.4419V94.2227ZM88.2762 80.0448C89.6109 79.2742 90.6928 79.8989 90.6928 81.44V81.44C90.6928 82.9811 89.6109 84.8551 88.2762 85.6257L87.9298 84.2257C88.6905 83.7865 89.3072 82.7184 89.3072 81.84V81.84C89.3072 80.5198 88.6905 79.8056 87.9298 80.2448L88.2762 80.0448Z"
                    ></path>
                    <mask fill="white" id="path-28-inside-2_204_217">
                        <path
                            d="M67 94.6603C67 93.3848 67.8954 91.8339 69 91.1962V91.1962C70.1046 90.5584 71 91.0754 71 92.3509V92.5129C71 93.7884 70.1046 95.3393 69 95.977V95.977C67.8954 96.6147 67 96.0978 67 94.8223V94.6603Z"
                        ></path>
                    </mask>
                    <path
                        fill="#91DDFB"
                        d="M67 94.6603C67 93.3848 67.8954 91.8339 69 91.1962V91.1962C70.1046 90.5584 71 91.0754 71 92.3509V92.5129C71 93.7884 70.1046 95.3393 69 95.977V95.977C67.8954 96.6147 67 96.0978 67 94.8223V94.6603Z"
                    ></path>
                    <path
                        mask="url(#path-28-inside-2_204_217)"
                        fill="#489CB7"
                        d="M67 92.3509L71 90.0415L67 92.3509ZM71.6928 92.5129C71.6928 94.0093 70.6423 95.8288 69.3464 96.577L69.3464 96.577C68.0505 97.3252 67 96.7187 67 95.2223V94.8223C67 95.6559 67.8954 95.8147 69 95.177L69 95.177C69.7219 94.7602 70.3072 93.7465 70.3072 92.9129L71.6928 92.5129ZM67 97.1317V92.3509V97.1317ZM69.2762 91.0367C70.6109 90.2661 71.6928 90.8908 71.6928 92.4319V92.5129C71.6928 94.0093 70.6423 95.8288 69.3464 96.577L69 95.177C69.7219 94.7602 70.3072 93.7465 70.3072 92.9129V92.7509C70.3072 91.4754 69.7219 90.7794 69 91.1962L69.2762 91.0367Z"
                    ></path>
                </g>
                <defs>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="92.0933"
                        x2="92.5421"
                        y1="92.0933"
                        x1="1.00946"
                        id="paint0_linear_204_217"
                    >
                        <stop stop-color="#5727CC"></stop>
                        <stop stop-color="#4354BF" offset="1"></stop>
                    </linearGradient>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="91.1638"
                        x2="6.72169"
                        y1="70"
                        x1="92.5"
                        id="paint1_linear_204_217"
                    >
                        <stop stop-color="#4559C4"></stop>
                        <stop stop-color="#332C94" offset="0.29"></stop>
                        <stop stop-color="#5727CB" offset="1"></stop>
                    </linearGradient>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="85.0762"
                        x2="3.55544"
                        y1="70"
                        x1="92.5"
                        id="paint2_linear_204_217"
                    >
                        <stop stop-color="#91DDFB"></stop>
                        <stop stop-color="#8841D5" offset="1"></stop>
                    </linearGradient>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="32.558"
                        x2="43.5482"
                        y1="28.7976"
                        x1="43.5482"
                        id="paint3_linear_204_217"
                    >
                        <stop stop-color="#5927CE"></stop>
                        <stop stop-color="#91DDFB" offset="1"></stop>
                    </linearGradient>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="48.3519"
                        x2="50.0323"
                        y1="44.5915"
                        x1="50.0323"
                        id="paint4_linear_204_217"
                    >
                        <stop stop-color="#5927CE"></stop>
                        <stop stop-color="#91DDFB" offset="1"></stop>
                    </linearGradient>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="62.6416"
                        x2="40.3062"
                        y1="59.6332"
                        x1="40.3062"
                        id="paint5_linear_204_217"
                    >
                        <stop stop-color="#5927CE"></stop>
                        <stop stop-color="#91DDFB" offset="1"></stop>
                    </linearGradient>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="73.9229"
                        x2="50.7527"
                        y1="68.6583"
                        x1="50.7527"
                        id="paint6_linear_204_217"
                    >
                        <stop stop-color="#5927CE"></stop>
                        <stop stop-color="#91DDFB" offset="1"></stop>
                    </linearGradient>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="76.9312"
                        x2="48.5913"
                        y1="74.675"
                        x1="48.5913"
                        id="paint7_linear_204_217"
                    >
                        <stop stop-color="#5927CE"></stop>
                        <stop stop-color="#91DDFB" offset="1"></stop>
                    </linearGradient>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="67.1541"
                        x2="52.9153"
                        y1="66.402"
                        x1="52.9153"
                        id="paint8_linear_204_217"
                    >
                        <stop stop-color="#5927CE"></stop>
                        <stop stop-color="#91DDFB" offset="1"></stop>
                    </linearGradient>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="43.8394"
                        x2="52.1936"
                        y1="41.5832"
                        x1="52.1936"
                        id="paint9_linear_204_217"
                    >
                        <stop stop-color="#5927CE"></stop>
                        <stop stop-color="#91DDFB" offset="1"></stop>
                    </linearGradient>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="29.5497"
                        x2="57.2367"
                        y1="27.2935"
                        x1="57.2367"
                        id="paint10_linear_204_217"
                    >
                        <stop stop-color="#5927CE"></stop>
                        <stop stop-color="#91DDFB" offset="1"></stop>
                    </linearGradient>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="34.8144"
                        x2="43.9084"
                        y1="33.3102"
                        x1="43.9084"
                        id="paint11_linear_204_217"
                    >
                        <stop stop-color="#5927CE"></stop>
                        <stop stop-color="#91DDFB" offset="1"></stop>
                    </linearGradient>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="16.0743"
                        x2="62.9858"
                        y1="88.5145"
                        x1="67.8638"
                        id="paint12_linear_204_217"
                    >
                        <stop stop-color="#97E6FF"></stop>
                        <stop stop-opacity="0" stop-color="white" offset="1"></stop>
                    </linearGradient>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        y2="39.4139"
                        x2="31.4515"
                        y1="88.0938"
                        x1="36.2597"
                        id="paint13_linear_204_217"
                    >
                        <stop stop-color="#97E6FF"></stop>
                        <stop stop-opacity="0" stop-color="white" offset="1"></stop>
                    </linearGradient>
                </defs>
            </svg>
        </div>
    </div>
</body>
</html>

    `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Verification app listening on port ${port}`);
});
