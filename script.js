// ============================================================
//  Liste des joueurs — déduite depuis /france/*.jpg
//  Tu peux modifier librement le "name" si tu veux ajuster.
// ============================================================
const PLAYERS = [
  { file: "abbes.jpg",     name: "Claude Abbès" },
  { file: "abidal.jpg",    name: "Éric Abidal" },
  { file: "amoros.jpg",    name: "Manuel Amoros" },
  { file: "barthez.jpg",   name: "Fabien Barthez" },
  { file: "bats.jpg",      name: "Joël Bats" },
  { file: "battiston.jpg", name: "Patrick Battiston" },
  { file: "benzema.jpg",   name: "Karim Benzema" },
  { file: "blanc.jpg",     name: "Laurent Blanc" },
  { file: "bossis.jpg",    name: "Maxime Bossis" },
  { file: "desailly.jpg",  name: "Marcel Desailly" },
  { file: "deschamps.jpg", name: "Didier Deschamps" },
  { file: "djorkaeff.jpg", name: "Youri Djorkaeff" },
  { file: "ettori.jpg",    name: "Jean-Luc Ettori" },
  { file: "evra.jpg",      name: "Patrice Evra" },
  { file: "fernandez.jpg", name: "Luis Fernandez" },
  { file: "fontaine.jpg",  name: "Just Fontaine" },
  { file: "genghini.jpg",  name: "Bernard Genghini" },
  { file: "giresse.jpg",   name: "Alain Giresse" },
  { file: "giroud.jpg",    name: "Olivier Giroud" },
  { file: "griezmann.jpg", name: "Antoine Griezmann" },
  { file: "henry.jpg",     name: "Thierry Henry" },
  { file: "janvion.jpg",   name: "Gérard Janvion" },
  { file: "kante.jpg",     name: "N'Golo Kanté" },
  { file: "kopa.jpg",      name: "Raymond Kopa" },
  { file: "lizarazu.jpg",  name: "Bixente Lizarazu" },
  { file: "lloris.jpg",    name: "Hugo Lloris" },
  { file: "maignan.jpg",   name: "Mike Maignan" },
  { file: "makelele.jpg",  name: "Claude Makélélé" },
  { file: "mbappe.jpg",    name: "Kylian Mbappé" },
  { file: "nicolas.jpg",   name: "Jean Nicolas" },
  { file: "papin.jpg",     name: "Jean-Pierre Papin" },
  { file: "petit.jpg",     name: "Emmanuel Petit" },
  { file: "piantoni.jpg",  name: "Roger Piantoni" },
  { file: "pires.jpg",     name: "Robert Pirès" },
  { file: "platini.jpg",   name: "Michel Platini" },
  { file: "ribery.jpg",    name: "Franck Ribéry" },
  { file: "rocheteau.jpg", name: "Dominique Rocheteau" },
  { file: "sagnol.jpg",    name: "Willy Sagnol" },
  { file: "thuram.jpg",    name: "Lilian Thuram" },
  { file: "tigana.jpg",    name: "Jean Tigana" },
  { file: "tresor.jpg",    name: "Marius Trésor" },
  { file: "trezeguet.jpg", name: "David Trezeguet" },
  { file: "varane.jpg",    name: "Raphaël Varane" },
  { file: "vieira.jpg",    name: "Patrick Vieira" },
  { file: "zidane.jpg",    name: "Zinédine Zidane" },
];

// ============================================================
//  État du jeu
// ============================================================
const state = {
  pool: [],        // joueurs pas encore proposés
  champion: null,  // gagnant courant qui reste en place
  challenger: null,
  round: 1,
  history: [],     // { round, winner, loser }
};

// ============================================================
//  DOM refs
// ============================================================
const $ = (id) => document.getElementById(id);
const imgLeft = $("img-left");
const imgRight = $("img-right");
const nameLeft = $("name-left");
const nameRight = $("name-right");
const cardLeft = $("card-left");
const cardRight = $("card-right");
const roundNum = $("round-number");
const historyList = $("history");
const duelEl = $("duel");
const endEl = $("endscreen");

// ============================================================
//  Utils
// ============================================================
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function imgPath(p) {
  return `france/${p.file}`;
}

// Pré-charge toutes les photos en arrière-plan dès le démarrage.
// Une fois en cache, les changements de challenger sont instantanés.
const _imgCache = new Map();
function preloadAll() {
  PLAYERS.forEach((p) => {
    if (_imgCache.has(p.file)) return;
    const img = new Image();
    img.decoding = "async";
    img.src = imgPath(p);
    _imgCache.set(p.file, img);
  });
}

// Pré-charge spécifique : utile pour garantir que le prochain challenger
// est prêt même si le pré-chargement initial n'a pas fini.
function preloadOne(p) {
  if (!p || _imgCache.has(p.file)) return;
  const img = new Image();
  img.decoding = "async";
  img.src = imgPath(p);
  _imgCache.set(p.file, img);
}

// ============================================================
//  Démarrage / Reset
// ============================================================
function startGame() {
  // Lance le préchargement de toutes les photos en arrière-plan
  preloadAll();

  state.pool = shuffle(PLAYERS);
  state.champion = state.pool.shift();
  state.challenger = state.pool.shift();
  state.round = 1;
  state.history = [];

  endEl.classList.add("hidden");
  duelEl.style.display = "";
  historyList.innerHTML = "";
  renderDuel();
}

function renderDuel() {
  roundNum.textContent = state.round;

  // Le champion reste à gauche, le challenger à droite
  imgLeft.src = imgPath(state.champion);
  imgLeft.alt = state.champion.name;
  nameLeft.textContent = state.champion.name;

  imgRight.src = imgPath(state.challenger);
  imgRight.alt = state.challenger.name;
  nameRight.textContent = state.challenger.name;

  cardLeft.classList.remove("winner", "loser");
  cardRight.classList.remove("winner", "loser");
}

// ============================================================
//  Choix utilisateur
// ============================================================
function pick(side) {
  const winner = side === "left" ? state.champion : state.challenger;
  const loser  = side === "left" ? state.challenger : state.champion;

  // Animation
  (side === "left" ? cardLeft : cardRight).classList.add("winner");
  (side === "left" ? cardRight : cardLeft).classList.add("loser");

  state.history.push({ round: state.round, winner, loser });
  renderHistory();

  setTimeout(() => {
    state.champion = winner;

    if (state.pool.length === 0) {
      showEnd();
      return;
    }

    state.challenger = state.pool.shift();
    state.round += 1;
    renderDuel();
    // Anticipe le prochain challenger (le suivant dans le pool)
    preloadOne(state.pool[0]);
  }, 480);
}

// ============================================================
//  Historique
// ============================================================
function renderHistory() {
  historyList.innerHTML = state.history
    .map(
      (h) => `
        <li title="Duel ${h.round} : ${h.winner.name} vs ${h.loser.name}">
          <span class="num">${h.round}</span>
          <span class="pair">
            <span class="win">✓ ${h.winner.name}</span>
            <span class="lose">${h.loser.name}</span>
          </span>
        </li>`
    )
    .join("");
}

// ============================================================
//  Écran de fin
// ============================================================
function showEnd() {
  duelEl.style.display = "none";
  endEl.classList.remove("hidden");
  $("champion-img").src = imgPath(state.champion);
  $("champion-img").alt = state.champion.name;
  $("champion-name").textContent = state.champion.name;

  // Filet de sécurité : s'assure que la dernière entrée (duel 44) est bien rendue
  renderHistory();

  // Scroll jusqu'au dernier duel pour qu'il soit visible
  const last = historyList.lastElementChild;
  if (last) last.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ============================================================
//  Téléchargements
// ============================================================
function downloadText() {
  const lines = [
    "🏆 LE DUEL DES BLEUS — Récapitulatif",
    "=".repeat(40),
    "",
    ...state.history.map(
      (h) => `Duel ${h.round}: ${h.winner.name}  ✓   vs   ${h.loser.name}  ✗`
    ),
    "",
    state.pool.length === 0 && state.history.length > 0
      ? `🏆 Joueur préféré : ${state.champion.name}`
      : `Champion actuel : ${state.champion.name}`,
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "duel-des-bleus.txt";
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadImage() {
  const target = document.getElementById("recap-block");
  const actions = target.querySelector(".history-actions");

  // Masque temporairement les boutons pour qu'ils n'apparaissent pas sur la capture
  const prevDisplay = actions ? actions.style.display : "";
  if (actions) actions.style.display = "none";

  try {
    const canvas = await html2canvas(target, {
      backgroundColor: "#003b78",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
    const link = document.createElement("a");
    link.download = "duel-des-bleus.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Erreur capture image :", err);
    alert("Impossible de générer l'image. Ouvre le jeu via un serveur local (ex: python3 -m http.server) plutôt qu'en file://.");
  } finally {
    if (actions) actions.style.display = prevDisplay;
  }
}

// ============================================================
//  Partage réseaux
// ============================================================
// Récupère l'URL de la page d'intégration (la page hôte si on est en iframe,
// sinon l'URL courante). Mise à jour dynamiquement via postMessage si la page
// hôte la diffuse.
let hostUrl = (() => {
  try {
    if (window.top !== window.self) {
      return document.referrer || location.href;
    }
  } catch (e) {}
  return location.href;
})();

window.addEventListener("message", (e) => {
  if (e.data && typeof e.data === "object" && e.data.type === "host-url" && typeof e.data.url === "string") {
    hostUrl = e.data.url;
  }
});

function share(network) {
  const url = hostUrl;
  const text = state.history.length > 0
    ? `Mon joueur préféré pour le moment : ${state.champion.name} ! Joue au Duel des Bleus 🇫🇷⚽`
    : `Joue au Duel des Bleus 🇫🇷⚽ — qui est ton joueur préféré ?`;

  const enc = encodeURIComponent;
  const links = {
    twitter:  `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(text)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${enc(text + " " + url)}`,
  };

  if (network === "copy") {
    navigator.clipboard.writeText(url).then(() => {
      const toast = $("share-toast");
      toast.classList.remove("hidden");
      setTimeout(() => toast.classList.add("hidden"), 1800);
    });
    return;
  }
  window.open(links[network], "_blank", "noopener");
}

// ============================================================
//  Event listeners
// ============================================================
document.querySelectorAll(".choose-btn").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    pick(btn.dataset.side);
  })
);

cardLeft.addEventListener("click", () => pick("left"));
cardRight.addEventListener("click", () => pick("right"));

$("restart-btn").addEventListener("click", startGame);
$("download-txt").addEventListener("click", downloadText);
$("download-img").addEventListener("click", downloadImage);

document.querySelectorAll(".share-btn").forEach((btn) =>
  btn.addEventListener("click", () => share(btn.dataset.network))
);

// ============================================================
//  Communication de la hauteur vers la page hôte (iframe)
//  La page d'intégration reçoit un postMessage à chaque changement
//  de taille et peut ajuster la hauteur de l'iframe en continu.
// ============================================================
function sendHeight() {
  if (window.top === window.self) return; // pas en iframe, rien à faire
  const h = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  window.parent.postMessage({ type: "duel-height", height: h }, "*");
}

if (typeof ResizeObserver !== "undefined") {
  const ro = new ResizeObserver(() => sendHeight());
  ro.observe(document.body);
}
window.addEventListener("load", sendHeight);
window.addEventListener("resize", sendHeight);

// Go!
startGame();
sendHeight();
