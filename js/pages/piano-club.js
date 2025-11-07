import clubInfoAndEvents from "../utils/club-info-and-events.js";

export default async function pianoClub() {
  const info = await clubInfoAndEvents('k92m');

  const pianohtml = `
    <div class="content">
      <section>
        <h1>Information</h1>
        <p>
          This is the club page for Semir Club. Here you can find all the latest updates 
          and information about our activities and events.
        </p>

        <!-- Hidden audio player controlled by SVG button -->
        <audio id="play" src="https://ia802806.us.archive.org/8/items/Winter_Sunshine_EP-8201/Evgeny_Grinko_-_01_-_Winter_Sunshine.mp3"></audio>

        <!-- SVG button to play/pause the audio -->
        <svg id="playButton" class="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40"
          fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd"
            d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
            clip-rule="evenodd" />
        </svg>
      </section>

      <section>
        <h1>About Semir Club</h1>
        <p>
          Semir Club is a community of enthusiasts who share a passion for various hobbies and interests.
          We organize regular meetups, workshops, and social events to foster connections among members.
        </p>
      </section>

      <section>
        <h1>Welcome to Semir Club!</h1>
        <!-- Button linking to booking page (handled by booking.js) -->
        <button class="btn" id="booking">Boka Biljett</button>
      </section>
    </div>

    <footer>
      <p>&copy; 2024 Semir Club. All rights reserved.</p>
    </footer>
  `;

  return { pianohtml, info };
}