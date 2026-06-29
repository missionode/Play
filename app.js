/* ==========================================================================
   UNMASKED: GAME ENGINE & PROFILING ALGORITHM
   ========================================================================== */

// 1. DATABASE DEFINITIONS

// Core Values (Phase 1)
// Positive (prospect-aligned) values: increase probability when chosen
const PROSPECT_POSITIVE_VALUES = ['discretion', 'sensuality', 'luxury', 'independence', 'spontaneity'];

const VALUES_SINGLE = {
  sensuality: {
    id: 'sensuality',
    name: 'Sensual Joy',
    icon: 'fa-spa',
    desc: 'The pleasure of touch, atmosphere, and lived physical experiences that ignite the senses.'
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury',
    icon: 'fa-gem',
    desc: 'Surrounding yourself with quality, elegance, and experiences most people only dream of.'
  },
  independence: {
    id: 'independence',
    name: 'Independence',
    icon: 'fa-feather-pointed',
    desc: 'Living on your own schedule, making decisions alone, with no need for approval.'
  },
  spontaneity: {
    id: 'spontaneity',
    name: 'Spontaneity',
    icon: 'fa-bolt',
    desc: 'Acting on desire in the moment, chasing thrills without overthinking the rules.'
  },
  commitment: {
    id: 'commitment',
    name: 'Commitment',
    icon: 'fa-ring',
    desc: 'Building a long-term exclusive bond with one partner based on traditional expectations.'
  },
  social_approval: {
    id: 'social_approval',
    name: 'Social Approval',
    icon: 'fa-users',
    desc: 'Making choices that your circle, family, or community would respect and celebrate.'
  },
  emotional_safety: {
    id: 'emotional_safety',
    name: 'Emotional Safety',
    icon: 'fa-shield-heart',
    desc: 'Seeking connections where you feel fully protected, understood, and emotionally secure.'
  },
  romantic_idealism: {
    id: 'romantic_idealism',
    name: 'Romantic Idealism',
    icon: 'fa-wand-magic-sparkles',
    desc: 'Waiting for the perfect, fairy-tale romance rather than compromising for reality.'
  }
};

const VALUES_MARRIED = {
  discretion: {
    id: 'discretion',
    name: 'Discretion & Secrecy',
    icon: 'fa-user-secret',
    desc: 'Keeping connections private, valuing absolute secrecy, and sharing only on your terms.'
  },
  sensuality: {
    id: 'sensuality',
    name: 'Physical Recharge',
    icon: 'fa-spa',
    desc: 'Sensual touch, atmosphere, and physical rejuvenation outside of your daily marital routine.'
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury Pampering',
    icon: 'fa-gem',
    desc: 'Indulging in premium self-care, fine services, and elite experiences meant just for you.'
  },
  independence: {
    id: 'independence',
    name: 'Personal Escape',
    icon: 'fa-feather-pointed',
    desc: 'Having a private life, secrets, or time that is entirely your own, separate from spousal duties.'
  },
  marital_fidelity: {
    id: 'marital_fidelity',
    name: 'Marital Fidelity',
    icon: 'fa-ring',
    desc: 'Strictly honoring marriage vows and staying fully faithful to your husband/spouse.'
  },
  social_reputation: {
    id: 'social_reputation',
    name: 'Social Reputation',
    icon: 'fa-users',
    desc: 'Avoiding any risk of gossip, family shame, or threat to your social standing in the community.'
  },
  family_stability: {
    id: 'family_stability',
    name: 'Family Stability',
    icon: 'fa-house-chimney-window',
    desc: 'Keeping the household stable, protecting the children, and maintaining domestic peace.'
  },
  domestic_comfort: {
    id: 'domestic_comfort',
    name: 'Domestic Routine',
    icon: 'fa-couch',
    desc: 'Finding complete peace and satisfaction within the familiar boundaries of your home life.'
  }
};

let VALUES = VALUES_SINGLE;

// Crucial Dilemmas (Phase 2)
// optionA is always the prospect-aligned choice (increases probability)
// optionB is the traditional/non-prospect choice (decreases probability)
const DILEMMAS = [
  {
    id: 1,
    title: 'The Private Chakra Session for mind healing',
    valueA: 'discretion',
    valueB: 'social_approval',
    scenario: 'A highly skilled wellness practitioner offers you a completely private, all-expenses-paid luxury Chakra meditation and energy healing weekend session. The experience is deeply restorative and transformative. Your close friends and social circle would be surprised or judgmental if they knew. No one ever needs to find out.',
    optionA: {
      text: 'Accept. You deserve this nurturing time for yourself. What happens in your private wellness journey is entirely your business.',
      summary: 'Chose discretion over social approval.'
    },
    optionB: {
      text: 'Decline. Even though it sounds deeply healing, you could never do something your circle might not understand or approve of.',
      summary: 'Chose social approval over discretion.'
    }
  },
  {
    id: 2,
    title: 'The luxury Massage Experience for a better body',
    valueA: 'luxury',
    valueB: 'commitment',
    scenario: 'You are living a stable but emotionally and physically draining routine. A rare opportunity arises for a breathtaking, deeply rejuvenating premium full-body massage and energy alignment session with a master practitioner — a once-in-a-lifetime level of care. No one would ever know.',
    optionA: {
      text: 'Pursue the experience. Life is short, and you deserve this luxurious investment in your wellbeing.',
      summary: 'Chose luxury over commitment.'
    },
    optionB: {
      text: 'Walk away. You have your existing responsibilities and routines, and that boundary is absolute, regardless of how drained you feel.',
      summary: 'Chose commitment over luxury.'
    }
  },
  {
    id: 3,
    title: 'Intimate Wellness Exploration',
    valueA: 'independence',
    valueB: 'emotional_safety',
    scenario: 'A professional wellness practitioner offers a specialized private hygiene and rejuvenation session focused on intimate area cleansing and gentle energy balancing. The goal is to help you feel fresh, confident, and renewed so you can naturally surprise and enhance your current partner’s experience during intimate moments. Everything is explained clearly upfront, fully professional, and on your terms.',
    optionA: {
      text: 'Agree. You appreciate the independence to take care of your own body and explore ways to bring more confidence and freshness to your relationship. Surprising your partner with renewed energy feels like a positive step.',
      summary: 'Chose independence over emotional safety.'
    },
    optionB: {
      text: 'Decline. You prefer to only explore intimate hygiene or wellness practices when there is already deep emotional trust and safety with your partner first.',
      summary: 'Chose emotional safety over independence.'
    }
  },
  {
    id: 4,
    title: 'The Last Minute Healing Invitation',
    valueA: 'spontaneity',
    valueB: 'social_approval',
    scenario: 'A trusted wellness guide sends you a last-minute invitation to an exclusive, intimate self-healing body cleansing and energy purification session — deeply restorative, private, and transformative. It completely breaks your usual evening routine.',
    optionA: {
      text: 'Say yes. Your wellbeing doesn’t wait for a perfect schedule. You get ready and go nourish your body and spirit.',
      summary: 'Chose spontaneity over social approval.'
    },
    optionB: {
      text: 'Decline. It feels too impulsive. You need to know more details and ensure it fits your usual social expectations before committing.',
      summary: 'Chose social approval over spontaneity.'
    }
  }
];

// Default host passcode
const DEFAULT_PASSCODE = 'host123';

// 2. GAME STATE VARIABLE MANAGEMENT
let gameState = {
  playerName: '',
  maritalStatus: 'single', // 'single' or 'married'
  currentScreen: 'welcome',

  // Phase 1 (Bracket)
  bracketValues: [],       // Array of current values in tournament
  eliminatedValues: [],    // Values that lost
  roundIndex: 1,           // Current round (1 = quarters, 2 = semis, 3 = finals)
  matchIndex: 0,           // Match within current round
  p1Matches: [],           // Match history: { winner, loser, time }
  valuePoints: {},         // Score based on bracket depth
  p1StartTime: 0,

  // Phase 2 (Dilemmas)
  dilemmaIndex: 0,         // Active dilemma index (0 to 3)
  dilemmaAnswers: [],      // Choices made: { dilemmaId, selectedValue, chosenText, rejectedText, timeTaken }
  dilemmaStartTime: 0,
  dilemmaTimerInterval: null,

  // Prospect Probability (live tracking)
  prospectProbability: 50  // Starts at 50%, updated in real time
};

// 3. INITIALIZATION & ROUTING

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadDashboardData();
});

function setupEventListeners() {
  // Start Game Form
  document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('player-name').value.trim();
    const statusSelect = document.getElementById('player-marital-status').value;
    if (nameInput) {
      gameState.playerName = nameInput;
      gameState.maritalStatus = statusSelect;
      // Point global pointer to single vs married set
      VALUES = statusSelect === 'married' ? VALUES_MARRIED : VALUES_SINGLE;
      transitionToScreen('screen-phase1-intro');
    }
  });

  // Phase 1 Start
  document.getElementById('btn-start-phase1').addEventListener('click', () => {
    initPhase1();
    transitionToScreen('screen-phase1-game');
    document.getElementById('game-progress').classList.remove('hidden');
    updateProbabilityBar();
  });

  // Choice Cards Clicks
  document.getElementById('choice-a').addEventListener('click', () => handleBracketChoice('a'));
  document.getElementById('choice-b').addEventListener('click', () => handleBracketChoice('b'));

  // Keyboard access for cards
  document.getElementById('choice-a').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') handleBracketChoice('a');
  });
  document.getElementById('choice-b').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') handleBracketChoice('b');
  });

  // Early unlock screen triggers
  document.getElementById('btn-early-unlock').addEventListener('click', () => {
    transitionToScreen('screen-early-login');
  });

  document.getElementById('btn-cancel-early-login').addEventListener('click', () => {
    transitionToScreen('screen-phase1-game');
  });

  document.getElementById('early-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const passcode = document.getElementById('early-passcode').value;
    if (passcode === DEFAULT_PASSCODE) {
      document.getElementById('early-error-msg').classList.add('hidden');
      document.getElementById('early-passcode').value = '';
      compilePlayerReport();
      enterHostDashboard();
    } else {
      document.getElementById('early-error-msg').classList.remove('hidden');
    }
  });

  // Phase 2 Start
  document.getElementById('btn-start-phase2').addEventListener('click', () => {
    initPhase2();
    transitionToScreen('screen-phase2-game');
    updateProbabilityBar();
  });

  // Dilemma Cards Clicks
  document.getElementById('dilemma-choice-a').addEventListener('click', () => handleDilemmaChoice('a'));
  document.getElementById('dilemma-choice-b').addEventListener('click', () => handleDilemmaChoice('b'));

  // Keyboard access for dilemmas
  document.getElementById('dilemma-choice-a').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') handleDilemmaChoice('a');
  });
  document.getElementById('dilemma-choice-b').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') handleDilemmaChoice('b');
  });

  // Complete unlock form submission
  document.getElementById('complete-unlock-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const passcode = document.getElementById('complete-passcode').value;
    if (passcode === DEFAULT_PASSCODE) {
      document.getElementById('complete-error-msg').classList.add('hidden');
      document.getElementById('complete-passcode').value = '';
      enterHostDashboard();
    } else {
      document.getElementById('complete-error-msg').classList.remove('hidden');
    }
  });

  // Host Dashboard Trigger
  document.getElementById('host-trigger').addEventListener('click', () => {
    const trigger = document.getElementById('host-trigger');
    if (trigger.classList.contains('active')) {
      // Exit dashboard / host login
      resetGame();
      transitionToScreen('screen-welcome');
    } else {
      transitionToScreen('screen-host-login');
    }
  });

  // Host Login
  document.getElementById('host-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const passcode = document.getElementById('host-passcode').value;
    if (passcode === DEFAULT_PASSCODE) {
      document.getElementById('login-error-msg').classList.add('hidden');
      document.getElementById('host-passcode').value = '';
      enterHostDashboard();
    } else {
      document.getElementById('login-error-msg').classList.remove('hidden');
    }
  });

  document.getElementById('btn-cancel-login').addEventListener('click', () => {
    transitionToScreen('screen-welcome');
  });

  // Dashboard buttons
  document.getElementById('btn-exit-dashboard').addEventListener('click', () => {
    resetGame();
    transitionToScreen('screen-welcome');
  });

  document.getElementById('btn-clear-data').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all player reports? This action cannot be undone.')) {
      localStorage.removeItem('unmasked_sessions');
      loadDashboardData();
      renderDetailsPanelPlaceholder();
    }
  });

  // Dashboard search filter
  document.getElementById('player-search').addEventListener('input', (e) => {
    filterPlayerList(e.target.value);
  });

  // Mouse hover glow tracker effect
  document.querySelectorAll('.choice-card, .dilemma-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--glow-x', `${x}px`);
      card.style.setProperty('--glow-y', `${y}px`);
    });
  });
}

function transitionToScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
    screen.classList.add('hidden');
  });

  // Show target screen
  const target = document.getElementById(screenId);
  target.classList.remove('hidden');
  target.classList.add('active');

  // Manage header icons/dashboards active styles
  const trigger = document.getElementById('host-trigger');
  if (screenId === 'screen-host-dashboard' || screenId === 'screen-host-login' || screenId === 'screen-early-login') {
    trigger.classList.add('active');
    document.getElementById('game-progress').classList.add('hidden');
  } else {
    trigger.classList.remove('active');
    if (screenId === 'screen-welcome' || screenId === 'screen-phase1-intro' || screenId === 'screen-complete') {
      document.getElementById('game-progress').classList.add('hidden');
    }
  }
}

function updateProgressBar(percentage, labelText) {
  const fill = document.getElementById('progress-fill');
  const label = document.getElementById('progress-text');
  fill.style.width = `${percentage}%`;
  label.textContent = `${labelText} (${Math.round(percentage)}%)`;
}

function updateProbabilityBar() {
  const prob = Math.min(100, Math.max(0, gameState.prospectProbability));
  const fill = document.getElementById('progress-fill');
  const label = document.getElementById('progress-text');
  fill.style.width = `${prob}%`;
  label.textContent = `Match Probability: ${Math.round(prob)}%`;
}

function resetGame() {
  clearInterval(gameState.dilemmaTimerInterval);
  gameState = {
    playerName: '',
    maritalStatus: 'single',
    currentScreen: 'welcome',
    bracketValues: [],
    eliminatedValues: [],
    roundIndex: 1,
    matchIndex: 0,
    p1Matches: [],
    valuePoints: {},
    p1StartTime: 0,
    dilemmaIndex: 0,
    dilemmaAnswers: [],
    dilemmaStartTime: 0,
    dilemmaTimerInterval: null,
    prospectProbability: 50
  };
  VALUES = VALUES_SINGLE;
  document.getElementById('player-name').value = '';
  document.getElementById('player-marital-status').value = 'single';
  document.getElementById('game-progress').classList.add('hidden');
}


// ==========================================================================
// PHASE 1: BRACKET TOURNAMENT LOGIC
// ==========================================================================

function optimizeMatchups(keys) {
  const positives = keys.filter(k => PROSPECT_POSITIVE_VALUES.includes(k));
  const traditionals = keys.filter(k => !PROSPECT_POSITIVE_VALUES.includes(k));
  
  const optimized = [];
  const minLen = Math.min(positives.length, traditionals.length);
  
  // Pair positives with traditionals
  for (let i = 0; i < minLen; i++) {
    optimized.push(positives[i]);
    optimized.push(traditionals[i]);
  }
  
  // Push any remaining elements (which will be of the same category)
  const remaining = positives.length > traditionals.length ? positives.slice(minLen) : traditionals.slice(minLen);
  optimized.push(...remaining);
  
  return optimized;
}

function initPhase1() {
  const keys = Object.keys(VALUES);
  
  // Separate based on positive vs traditional
  const positives = keys.filter(k => PROSPECT_POSITIVE_VALUES.includes(k));
  const traditionals = keys.filter(k => !PROSPECT_POSITIVE_VALUES.includes(k));
  
  // Shuffle both sets randomly
  const shuffledPos = positives.sort(() => Math.random() - 0.5);
  const shuffledTrad = traditionals.sort(() => Math.random() - 0.5);
  
  // Combine and optimize to ensure 1 positive vs 1 traditional matches
  const shuffledAll = [...shuffledPos, ...shuffledTrad];
  gameState.bracketValues = optimizeMatchups(shuffledAll);
  
  gameState.eliminatedValues = [];
  gameState.roundIndex = 1; // Round 1: Quarter Finals
  gameState.matchIndex = 0;
  gameState.p1Matches = [];

  // Reset point tracking
  keys.forEach(k => {
    gameState.valuePoints[k] = 0;
  });

  renderBracketNodes();
  loadNextBracketMatch();
}

function renderBracketNodes() {
  const container = document.getElementById('bracket-nodes');
  container.innerHTML = '';

  const allValues = Object.keys(VALUES);

  allValues.forEach(valKey => {
    const valObj = VALUES[valKey];
    const pill = document.createElement('div');
    pill.className = 'bracket-pill';
    pill.id = `pill-${valKey}`;
    pill.textContent = valObj.name;

    // Status colorings
    if (gameState.eliminatedValues.includes(valKey)) {
      pill.classList.add('eliminated');
    } else if (gameState.bracketValues.includes(valKey)) {
      pill.classList.add('active');
    }

    container.appendChild(pill);
  });
}

function loadNextBracketMatch() {
  const valAKey = gameState.bracketValues[gameState.matchIndex * 2];
  const valBKey = gameState.bracketValues[gameState.matchIndex * 2 + 1];

  const valA = VALUES[valAKey];
  const valB = VALUES[valBKey];

  // Set Content Card A
  document.getElementById('choice-a-title').textContent = valA.name;
  document.getElementById('choice-a-desc').textContent = valA.desc;
  document.getElementById('choice-a').querySelector('.choice-icon i').className = `fa-solid ${valA.icon}`;
  document.getElementById('choice-a').dataset.valueKey = valAKey;

  // Set Content Card B
  document.getElementById('choice-b-title').textContent = valB.name;
  document.getElementById('choice-b-desc').textContent = valB.desc;
  document.getElementById('choice-b').querySelector('.choice-icon i').className = `fa-solid ${valB.icon}`;
  document.getElementById('choice-b').dataset.valueKey = valBKey;

  // Set titles
  let roundText = '';
  if (gameState.roundIndex === 1) roundText = `Quarter Finals • Match ${gameState.matchIndex + 1} of 4`;
  else if (gameState.roundIndex === 2) roundText = `Semi Finals • Match ${gameState.matchIndex + 1} of 2`;
  else if (gameState.roundIndex === 3) roundText = `Grand Finals • Ultimate Choice`;

  document.getElementById('p1-round-title').textContent = roundText;

  // Track progress bar (bracket covers 0% to 50%)
  // Quarters: 4 matches, Semis: 2 matches, Finals: 1 match. Total 7 matches.
  const currentMatchNumber = getMatchProgressNumber();
  const progressPercent = (currentMatchNumber - 1) / 7 * 50;
  updateProgressBar(progressPercent, `Phase 1: Match ${currentMatchNumber}/7`);

  // Record start time
  gameState.p1StartTime = performance.now();
}

function getMatchProgressNumber() {
  if (gameState.roundIndex === 1) return gameState.matchIndex + 1; // 1 to 4
  if (gameState.roundIndex === 2) return 5 + gameState.matchIndex;   // 5 to 6
  return 7; // Finals
}

function handleBracketChoice(cardId) {
  const endTime = performance.now();
  const timeTaken = (endTime - gameState.p1StartTime) / 1000;

  const cardA = document.getElementById('choice-a');
  const cardB = document.getElementById('choice-b');

  const valAKey = cardA.dataset.valueKey;
  const valBKey = cardB.dataset.valueKey;

  let winnerKey, loserKey;
  if (cardId === 'a') {
    winnerKey = valAKey;
    loserKey = valBKey;
  } else {
    winnerKey = valBKey;
    loserKey = valAKey;
  }

  // Record comparison details for profiling
  gameState.p1Matches.push({
    winner: winnerKey,
    loser: loserKey,
    time: timeTaken,
    round: gameState.roundIndex
  });

  // Assign bracket placement points
  gameState.valuePoints[loserKey] = gameState.roundIndex - 1;

  // === LIVE PROBABILITY UPDATE ===
  // Winning a positive value over a negative one: +3%
  // Winning a negative value over a positive one: -3%
  const winnerIsPositive = PROSPECT_POSITIVE_VALUES.includes(winnerKey);
  const loserIsPositive = PROSPECT_POSITIVE_VALUES.includes(loserKey);
  if (winnerIsPositive && !loserIsPositive) {
    gameState.prospectProbability = Math.min(100, gameState.prospectProbability + 3);
  } else if (!winnerIsPositive && loserIsPositive) {
    gameState.prospectProbability = Math.max(5, gameState.prospectProbability - 3);
  }
  updateProbabilityBar();

  // Track elimination
  gameState.eliminatedValues.push(loserKey);
  const loserPill = document.getElementById(`pill-${loserKey}`);
  if (loserPill) {
    loserPill.classList.remove('active');
    loserPill.classList.add('eliminated');
  }

  gameState.bracketValues[gameState.matchIndex] = winnerKey;
  gameState.matchIndex++;

  const expectedMatchesInRound = { 1: 4, 2: 2, 3: 1 }[gameState.roundIndex];

  if (gameState.matchIndex >= expectedMatchesInRound) {
    if (gameState.roundIndex === 3) {
      gameState.valuePoints[winnerKey] = 3;
      const winnerPill = document.getElementById(`pill-${winnerKey}`);
      if (winnerPill) winnerPill.classList.add('winner-crown');

      setTimeout(() => {
        transitionToScreen('screen-phase2-intro');
        updateProbabilityBar();
      }, 800);
    } else {
      const roundWinners = gameState.bracketValues.slice(0, expectedMatchesInRound);
      gameState.bracketValues = optimizeMatchups(roundWinners);
      gameState.roundIndex++;
      gameState.matchIndex = 0;
      setTimeout(() => { loadNextBracketMatch(); }, 300);
    }
  } else {
    setTimeout(() => { loadNextBracketMatch(); }, 300);
  }
}


// ==========================================================================
// PHASE 2: MORAL DILEMMAS LOGIC
// ==========================================================================

function initPhase2() {
  gameState.dilemmaIndex = 0;
  gameState.dilemmaAnswers = [];
  loadDilemma();
}

function loadDilemma() {
  const dilemma = DILEMMAS[gameState.dilemmaIndex];

  document.getElementById('p2-dilemma-title').textContent = `Scenario ${dilemma.id} of 4`;
  document.getElementById('p2-scenario-title').textContent = dilemma.title;
  document.getElementById('p2-scenario-desc').textContent = dilemma.scenario;

  document.getElementById('dilemma-choice-a-text').textContent = dilemma.optionA.text;
  document.getElementById('dilemma-choice-b-text').textContent = dilemma.optionB.text;

  document.getElementById('dilemma-choice-a').dataset.valueKey = dilemma.valueA;
  document.getElementById('dilemma-choice-b').dataset.valueKey = dilemma.valueB;

  // Show current probability during phase 2
  updateProbabilityBar();

  gameState.dilemmaStartTime = performance.now();
  startDilemmaTimer();
}

function startDilemmaTimer() {
  clearInterval(gameState.dilemmaTimerInterval);
  const timerLabel = document.getElementById('dilemma-timer');

  gameState.dilemmaTimerInterval = setInterval(() => {
    const elapsed = (performance.now() - gameState.dilemmaStartTime) / 1000;
    timerLabel.textContent = `${elapsed.toFixed(1)}s`;
  }, 100);
}

function handleDilemmaChoice(cardId) {
  clearInterval(gameState.dilemmaTimerInterval);
  const endTime = performance.now();
  const timeTaken = (endTime - gameState.dilemmaStartTime) / 1000;

  const choiceA = document.getElementById('dilemma-choice-a');
  const choiceB = document.getElementById('dilemma-choice-b');

  const valA = choiceA.dataset.valueKey;
  const valB = choiceB.dataset.valueKey;

  const currentDilemma = DILEMMAS[gameState.dilemmaIndex];

  let selectedVal, chosenText, rejectedVal, rejectedText;
  if (cardId === 'a') {
    selectedVal = valA;
    chosenText = currentDilemma.optionA.summary;
    rejectedVal = valB;
    rejectedText = currentDilemma.optionB.summary;
    // Option A is always the prospect-positive choice: +10%
    gameState.prospectProbability = Math.min(100, gameState.prospectProbability + 10);
  } else {
    selectedVal = valB;
    chosenText = currentDilemma.optionB.summary;
    rejectedVal = valA;
    rejectedText = currentDilemma.optionA.summary;
    // Option B is always the traditional/non-prospect choice: -10%
    gameState.prospectProbability = Math.max(5, gameState.prospectProbability - 10);
  }

  updateProbabilityBar();

  gameState.dilemmaAnswers.push({
    dilemmaId: currentDilemma.id,
    selectedValue: selectedVal,
    chosenText: chosenText,
    rejectedValue: rejectedVal,
    rejectedText: rejectedText,
    timeTaken: timeTaken
  });

  gameState.dilemmaIndex++;

  if (gameState.dilemmaIndex >= DILEMMAS.length) {
    compilePlayerReport();
    updateProbabilityBar();
    setTimeout(() => {
      document.getElementById('complete-player-name').textContent = gameState.playerName;
      transitionToScreen('screen-complete');
    }, 600);
  } else {
    setTimeout(() => { loadDilemma(); }, 300);
  }
}


// ==========================================================================
// PROFILING & REPORT COMPILATION ALGORITHM
// ==========================================================================

function compilePlayerReport() {
  const points = gameState.valuePoints;
  const answers = gameState.dilemmaAnswers;
  const finalProbability = Math.min(100, Math.max(0, gameState.prospectProbability));

  // Find bracket winner (highest ranked value)
  let bracketWinner = '';
  let highestPts = -1;
  Object.keys(points).forEach(key => {
    if (points[key] > highestPts) {
      highestPts = points[key];
      bracketWinner = key;
    }
  });

  // Fallback if no winner found (or all points are 0)
  if (!bracketWinner && gameState.bracketValues.length > 0) {
    bracketWinner = gameState.bracketValues[0];
  }

  // Simple verdict based on final probability
  let verdict, verdictClass, verdictIcon;
  if (finalProbability >= 75) {
    verdict = 'Perfect Match (High Interest)';
    verdictClass = 'verdict-high';
    verdictIcon = 'fa-fire';
  } else if (finalProbability >= 50) {
    verdict = 'Warm Match (Medium Interest)';
    verdictClass = 'verdict-mid';
    verdictIcon = 'fa-temperature-half';
  } else {
    verdict = 'Cold Match (Low Interest / Non-Prospect)';
    verdictClass = 'verdict-low';
    verdictIcon = 'fa-snowflake';
  }

  // Archetype, Advice, Quote, Rapport & Persuasion based on dominant value & probability
  let archetype, rapportAdvice, shareableQuote, persuasionScript, hostAdvice;

  const dominant = bracketWinner;

  if (finalProbability >= 75) {
    if (dominant === 'sensuality' || dominant === 'luxury') {
      archetype = 'The Pleasure Seeker';
      rapportAdvice = 'She values quality experiences deeply. Open with complimenting something specific about her presence — her energy, style, or a detail in her environment. Ask her about the last time she truly indulged herself.';
      shareableQuote = '"The most luxurious thing a person can own is the freedom to experience life on their own terms."';
      persuasionScript = `"I get the sense you know what you want, and you don't settle for less. I'd love to offer you something that matches that standard — private, curated, and completely on your terms. No drama, no expectations. Just the finest experience."`;
      hostAdvice = 'She is highly receptive. Mirror her energy — be polished and confident. Lean in slowly, not aggressively. Mention exclusivity: "This is for a very specific kind of person."';
    } else if (dominant === 'discretion' || dominant === 'independence') {
      archetype = 'The Discreet Adventurer';
      rapportAdvice = 'Build trust by signaling that you value privacy as much as she does. Mention that you never discuss your encounters. Ask open-ended questions about what she does for herself — not for others.';
      shareableQuote = '"True freedom is doing what you want, with who you want, without anyone needing to know."';
      persuasionScript = `"What we do stays between us — always. I have a strict privacy policy. No photos, no names, no traces. The kind of arrangement most people only dream about — but never get to experience."`;
      hostAdvice = 'She will not be won over by small talk. Signal competence and discretion immediately. Let her drive the pace, but gently suggest the idea of an exclusive arrangement.';
    } else {
      archetype = 'The Spontaneous Explorer';
      rapportAdvice = 'She is drawn to thrill and immediacy. Suggest something unexpected — an invitation, a mysterious plan. Do not over-explain. Use intrigue as the hook.';
      shareableQuote = '"The best stories begin with an unexpected yes."';
      persuasionScript = `"I usually don't ask twice — but I have a feeling you're someone who appreciates saying yes to the right things at the right moment. This would be one of those moments."`;
      hostAdvice = 'Move fast but smoothly. Hesitation will kill the mood. Plant the seed of something exciting and let her curiosity pull her in.';
    }
  } else if (finalProbability >= 50) {
    archetype = 'The Curious Independent';
    rapportAdvice = 'She is open but cautious. She needs to feel safe before she is open. Build warmth first — ask about her passions, her lifestyle. Do not rush.';
    shareableQuote = '"Some of the most beautiful experiences happen when you trust your instincts just a little more than your fears."';
    persuasionScript = `"I'd love to just talk more — no pressure. I find you genuinely interesting, and I'd like to get to know what kind of experiences really excite you. What's something you've always wanted to try but never found the right person to try it with?"`;
    hostAdvice = 'She scored in the middle range. She could go either way. Focus on comfort and connection first. Qualify her more before making any direct move. This session is about building rapport, not closing.';
  } else {
    archetype = 'The Traditional Romantic';
    rapportAdvice = 'She is not aligned with the service at this time. She prioritizes emotional safety and social approval. Engaging her directly is high risk. Gracefully transition to friendly conversation and exit.';
    shareableQuote = '"Not every flower blooms in every season — and that is perfectly okay."';
    persuasionScript = `"I really enjoyed talking with you. I don't think this is the right moment for us to connect on a deeper level, but I hope we cross paths again sometime."`;
    hostAdvice = 'She is a Non-Prospect at this time. Do NOT pursue an arrangement. She is motivated by social reputation and traditional values. Respectfully disengage. There is no risk as long as you keep it friendly.';
  }

  // Decision speed
  const p2Times = answers.map(a => a.timeTaken);
  const avgP2Time = p2Times.reduce((a, b) => a + b, 0) / (p2Times.length || 1);
  let slowestDilemma = null;
  let maxDilemmaTime = -1;
  answers.forEach((ans, idx) => {
    if (ans.timeTaken > maxDilemmaTime) {
      maxDilemmaTime = ans.timeTaken;
      slowestDilemma = DILEMMAS[idx].title;
    }
  });
  const speedVerdict = avgP2Time < 2.5 ? 'Impulsive & Decisive' : avgP2Time > 6 ? 'Deeply Conflicted' : 'Measured & Thoughtful';

  // Calculate contradictions
  const contradictions = [];
  answers.forEach(ans => {
    const selectedValPts = points[ans.selectedValue] || 0;
    const rejectedValPts = points[ans.rejectedValue] || 0;
    
    if (rejectedValPts > selectedValPts) {
      const valSelectedObj = VALUES[ans.selectedValue] || {};
      const valRejectedObj = VALUES[ans.rejectedValue] || {};
      contradictions.push(`Claimed to prioritize <strong>${valRejectedObj.name || ans.rejectedValue}</strong> in Phase 1, but chose <strong>${valSelectedObj.name || ans.selectedValue}</strong> in Dilemma ${ans.dilemmaId}.`);
    }
  });

  // Save Session Report
  const sessionReport = {
    id: Date.now().toString(),
    playerName: gameState.playerName,
    maritalStatus: gameState.maritalStatus,
    datePlayed: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    prospectProbability: Math.round(finalProbability),
    verdict: verdict,
    verdictClass: verdictClass,
    verdictIcon: verdictIcon,
    archetype: archetype,
    rapportAdvice: rapportAdvice,
    shareableQuote: shareableQuote,
    persuasionScript: persuasionScript,
    hostAdvice: hostAdvice,
    bracketWinner: VALUES[bracketWinner] ? VALUES[bracketWinner].name : bracketWinner,
    bracketWinnerIcon: VALUES[bracketWinner] ? VALUES[bracketWinner].icon : 'fa-star',
    dilemmaAnswers: answers,
    contradictions: contradictions,
    decisionSpeedVerdict: speedVerdict,
    avgDilemmaTime: avgP2Time.toFixed(1),
    slowestDilemma: slowestDilemma,
    slowestTime: maxDilemmaTime > 0 ? maxDilemmaTime.toFixed(1) : '—'
  };

  const activeSessions = JSON.parse(localStorage.getItem('unmasked_sessions') || '[]');
  activeSessions.unshift(sessionReport);
  localStorage.setItem('unmasked_sessions', JSON.stringify(activeSessions));
  loadDashboardData();
}


// ==========================================================================
// HOST DASHBOARD VIEWS & OPERATIONS
// ==========================================================================

function loadDashboardData() {
  const sessions = JSON.parse(localStorage.getItem('unmasked_sessions') || '[]');
  const countEl = document.getElementById('total-players-count');
  countEl.textContent = sessions.length;

  renderPlayerList(sessions);
}

function renderPlayerList(sessions) {
  const container = document.getElementById('dashboard-player-list');
  container.innerHTML = '';

  if (sessions.length === 0) {
    container.innerHTML = `
      <div class="no-data-placeholder">
        <i class="fa-regular fa-folder-open"></i>
        <span>No player results yet</span>
      </div>
    `;
    return;
  }

  sessions.forEach(session => {
    const item = document.createElement('div');
    item.className = 'player-list-item animate-fade-in';
    item.id = `player-item-${session.id}`;

    const prob = session.prospectProbability || 0;
    const probColorClass = prob >= 75 ? 'auth-high' : prob >= 50 ? 'auth-mid' : 'auth-low';

    const statusBadge = session.maritalStatus === 'married' ? 
      '<span class="badge-marital-status badge-married">M</span>' : 
      '<span class="badge-marital-status badge-single">S</span>';

    item.innerHTML = `
      <div class="player-list-item-header">
        <span class="player-list-item-name">${escapeHTML(session.playerName)} ${statusBadge}</span>
        <span class="player-list-item-score ${probColorClass}">${prob}%</span>
      </div>
      <div class="player-list-item-meta">
        <span>${session.verdict || session.archetype}</span>
        <span>${(session.datePlayed || '').split(',')[0]}</span>
      </div>
    `;

    item.addEventListener('click', () => selectPlayerForDetail(session.id));
    container.appendChild(item);
  });
}

function selectPlayerForDetail(sessionId) {
  // Toggle selection classes in list
  document.querySelectorAll('.player-list-item').forEach(item => {
    item.classList.remove('selected');
  });

  const selectedItem = document.getElementById(`player-item-${sessionId}`);
  if (selectedItem) selectedItem.classList.add('selected');

  const sessions = JSON.parse(localStorage.getItem('unmasked_sessions') || '[]');
  const session = sessions.find(s => s.id === sessionId);

  if (session) {
    renderPlayerDetails(session);
  }
}

function renderPlayerDetails(session) {
  const panel = document.getElementById('dashboard-details-panel');

  const prob = session.prospectProbability || 0;
  const barColor = prob >= 75 ? '#2ed573' : prob >= 50 ? '#ffa502' : '#ff4757';

  // Build dilemma choices summary HTML
  let choicesSummaryHTML = '';
  if (session.dilemmaAnswers && session.dilemmaAnswers.length > 0) {
    session.dilemmaAnswers.forEach((ans, idx) => {
      const dil = DILEMMAS[idx];
      const isPositive = PROSPECT_POSITIVE_VALUES.includes(ans.selectedValue);
      choicesSummaryHTML += `
        <div class="contradiction-item ${isPositive ? 'aligned' : ''}">
          <div class="contradiction-title">
            <span>${dil ? dil.title : 'Scenario ' + (idx + 1)}</span>
            <span class="contradiction-badge ${isPositive ? 'pass' : 'fail'}">${isPositive ? 'OPEN' : 'CLOSED'}</span>
          </div>
          <div class="contra-row">
            <span class="contra-label">Chose:</span>
            <span class="contra-value ${isPositive ? 'val-ideal' : 'val-real'}">${ans.chosenText}</span>
          </div>
          <div class="contra-row">
            <span class="contra-label">Speed:</span>
            <span class="contra-timing">${ans.timeTaken.toFixed(1)}s</span>
          </div>
        </div>
      `;
    });
  }

  // Build contradictions alert box HTML
  let contradictionsHTML = '';
  if (session.dilemmaAnswers && session.dilemmaAnswers.length > 0) {
    const contraList = session.contradictions || [];
    if (contraList.length > 0) {
      contradictionsHTML = `
        <div class="contradictions-box animate-slide-up">
          <h4><i class="fa-solid fa-triangle-exclamation"></i> Mask & Integrity Check</h4>
          <div class="contradiction-list">
            ${contraList.map(item => `<div class="contradiction-alert-item">${item}</div>`).join('')}
          </div>
        </div>
      `;
    } else {
      contradictionsHTML = `
        <div class="contradictions-box animate-slide-up" style="border-left-color: var(--success); background: rgba(46, 213, 115, 0.03); border-color: rgba(46, 213, 115, 0.12)">
          <h4><i class="fa-solid fa-circle-check" style="color: var(--success)"></i> Mask & Integrity Check</h4>
          <div class="no-contradictions-alert">
            <i class="fa-solid fa-face-smile" style="color: var(--success)"></i> Stated values in Phase 1 align with their choices in Phase 2.
          </div>
        </div>
      `;
    }
  }

  panel.innerHTML = `
    <!-- Profile Header -->
    <div class="profile-header animate-slide-up">
      <div class="profile-meta-main">
        <h2>
          ${escapeHTML(session.playerName)}
          <span class="badge-marital-status ${session.maritalStatus === 'married' ? 'badge-married' : 'badge-single'}">
            ${session.maritalStatus === 'married' ? 'Married' : 'Single'}
          </span>
        </h2>
        <span class="archetype-label">${session.archetype}</span>
      </div>
      <div class="text-right">
        <span class="profile-timestamp">${session.datePlayed}</span>
        <button class="btn btn-secondary btn-sm mt-2 block" onclick="deletePlayerReport('${session.id}')">
          <i class="fa-solid fa-trash"></i> Delete Report
        </button>
      </div>
    </div>

    <!-- ===== MATCH PROBABILITY METER ===== -->
    <div class="authenticity-section animate-slide-up">
      <div class="authenticity-header">
        <span class="authenticity-title">Match Probability</span>
        <span class="authenticity-percentage" style="color: ${barColor}">${prob}%</span>
      </div>
      <div class="authenticity-bar-track">
        <div class="authenticity-bar-fill" style="width: ${prob}%; background: ${barColor}"></div>
      </div>
    </div>

    <!-- ===== SIMPLE VERDICT ===== -->
    <div class="verdict-block animate-slide-up verdict-${prob >= 75 ? 'high' : prob >= 50 ? 'mid' : 'low'}">
      <div class="verdict-icon"><i class="fa-solid ${session.verdictIcon || 'fa-circle-dot'}"></i></div>
      <div class="verdict-content">
        <div class="verdict-title">${session.verdict}</div>
        <div class="verdict-tip">
          ${prob >= 75 ? '<strong>What this means:</strong> Very likely to be interested in a professional intimate arrangement. Safe to engage with confidence.' :
      prob >= 50 ? '<strong>What this means:</strong> Possibly open but has hesitations. Proceed with care, build more trust first.' :
        '<strong>What this means:</strong> Not aligned with the service at this time. Traditional values dominate. Engage only as a friend — do not propose an arrangement.'}
        </div>
      </div>
    </div>

    <!-- ===== CONTRADICTIONS BOX ===== -->
    ${contradictionsHTML}

    <!-- Comparison Row -->
    <div class="comparison-grid animate-slide-up">
      <div class="side-comparison-card">
        <span class="comparison-label">Top Desire Value</span>
        <span class="comparison-value val-ideal">
          <i class="fa-solid ${session.bracketWinnerIcon}"></i>
          ${session.bracketWinner}
        </span>
      </div>
      <div class="side-comparison-card">
        <span class="comparison-label">Decision Speed</span>
        <span class="comparison-value">
          <i class="fa-solid fa-gauge-high"></i>
          ${session.decisionSpeedVerdict}
        </span>
      </div>
    </div>

    <!-- ===== HOST ADVICE ===== -->
    <div class="dashboard-segment-title animate-slide-up">🎯 Host Strategy Advice</div>
    <div class="psychology-text-card advice-card animate-slide-up">
      <h4>How to Handle This Person Now</h4>
      <p>${session.hostAdvice}</p>
    </div>

    <!-- ===== RAPPORT BUILDER ===== -->
    <div class="dashboard-segment-title animate-slide-up">🤝 Rapport Builder</div>
    <div class="psychology-text-card rapport-card animate-slide-up">
      <h4>How to Build Connection With Her</h4>
      <p>${session.rapportAdvice}</p>
    </div>

    <!-- ===== SHAREABLE QUOTE ===== -->
    <div class="dashboard-segment-title animate-slide-up">💬 Quote to Share With Her</div>
    <div class="psychology-text-card quote-card animate-slide-up">
      <h4>Use This in Conversation</h4>
      <p class="shareable-quote">${session.shareableQuote}</p>
    </div>

    <!-- ===== PERSUASION SCRIPT ===== -->
    <div class="dashboard-segment-title animate-slide-up">🗣 Persuasion Script</div>
    <div class="psychology-text-card icebreaker-card animate-slide-up">
      <h4>Say This to Her — Word for Word</h4>
      <p>${session.persuasionScript}</p>
    </div>

    <!-- ===== SCENARIO CHOICES ===== -->
    <div class="dashboard-segment-title animate-slide-up">📋 Her Scenario Choices</div>
    <div class="contradictions-list animate-slide-up">
      ${choicesSummaryHTML}
    </div>
  `;
}

function renderDetailsPanelPlaceholder() {
  const panel = document.getElementById('dashboard-details-panel');
  panel.innerHTML = `
    <div class="no-data-placeholder text-center py-12">
      <i class="fa-solid fa-fingerprint fingerprint-placeholder"></i>
      <h3>Select a Player</h3>
      <p class="text-muted max-w-sm mx-auto">Choose a player profile from the left sidebar to unlock their psychological breakdown, values mapping, and contradiction analysis.</p>
    </div>
  `;
}

window.deletePlayerReport = function (sessionId) {
  if (confirm('Delete this player report?')) {
    const sessions = JSON.parse(localStorage.getItem('unmasked_sessions') || '[]');
    const updated = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem('unmasked_sessions', JSON.stringify(updated));
    loadDashboardData();
    renderDetailsPanelPlaceholder();
  }
};

function filterPlayerList(query) {
  const sessions = JSON.parse(localStorage.getItem('unmasked_sessions') || '[]');
  const filtered = sessions.filter(s => s.playerName.toLowerCase().includes(query.toLowerCase()));
  renderPlayerList(filtered);
}

function enterHostDashboard() {
  transitionToScreen('screen-host-dashboard');
  loadDashboardData();
  const sessions = JSON.parse(localStorage.getItem('unmasked_sessions') || '[]');
  if (sessions.length > 0) {
    selectPlayerForDetail(sessions[0].id);
  }
}

// 4. UTILITIES
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
