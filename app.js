/* ==========================================================================
   UNMASKED: GAME ENGINE & PROFILING ALGORITHM
   ========================================================================== */

// 1. DATABASE DEFINITIONS

// Core Values (Phase 1)
const VALUES = {
  compassion: {
    id: 'compassion',
    name: 'Compassion',
    icon: 'fa-hand-holding-heart',
    desc: 'Selflessness, empathy, and prioritizing the welfare of others above personal gain.'
  },
  achievement: {
    id: 'achievement',
    name: 'Ambition',
    icon: 'fa-trophy',
    desc: 'Personal success, status, gaining recognition, and making a significant mark.'
  },
  security: {
    id: 'security',
    name: 'Security',
    icon: 'fa-shield-halved',
    desc: 'Safety, stability, building a comfortable foundation, and avoiding high risk.'
  },
  freedom: {
    id: 'freedom',
    name: 'Freedom',
    icon: 'fa-feather-pointed',
    desc: 'Independence, autonomy, living without boundaries, and self-expression.'
  },
  truth: {
    id: 'truth',
    name: 'Truth',
    icon: 'fa-eye',
    desc: 'Honesty, fact-seeking, and calling out falsehoods regardless of consequences.'
  },
  harmony: {
    id: 'harmony',
    name: 'Harmony',
    icon: 'fa-handshake',
    desc: 'Peace, belonging, keeping the peace, and maintaining social comfort.'
  },
  loyalty: {
    id: 'loyalty',
    name: 'Loyalty',
    icon: 'fa-people-group',
    desc: 'Devotion to your close group, family, or friends, even at personal cost.'
  },
  pleasure: {
    id: 'pleasure',
    name: 'Pleasure',
    icon: 'fa-glass-cheers',
    desc: 'Sensory joy, fun, living in the moment, and personal enjoyment.'
  }
};

// Crucial Dilemmas (Phase 2)
// Each dilemma pits Value A directly against Value B.
const DILEMMAS = [
  {
    id: 1,
    title: 'The Collateral Promotion',
    valueA: 'achievement',
    valueB: 'compassion',
    scenario: 'A colleague is about to be fired for a major team project error you both contributed to. However, stepping forward to share the blame means you will definitely lose the dream promotion you\'ve worked two years to secure.',
    optionA: {
      text: 'Say nothing. Let your colleague take the fall, securing your promotion. You rationalize it as a tough business environment.',
      summary: 'Chose career success over saving a colleague.'
    },
    optionB: {
      text: 'Speak up to share the blame. You preserve your colleague\'s job, but your promotion is cancelled and your standing suffers.',
      summary: 'Chose to help a colleague at a direct career cost.'
    }
  },
  {
    id: 2,
    title: 'The Heartbreaking Secret',
    valueA: 'truth',
    valueB: 'harmony',
    scenario: 'You find undeniable proof that your best friend’s partner is cheating on them. If you tell them, it will break their heart and throw their life into chaos. If you stay quiet, they will marry happily next month, unaware.',
    optionA: {
      text: 'Tell your friend the truth immediately, presenting the proof and facing the painful emotional fallout.',
      summary: 'Chose painful truth over comfortable silence.'
    },
    optionB: {
      text: 'Burn the proof and keep the secret. You choose to preserve their current peace and happiness.',
      summary: 'Chose comfortable silence to protect harmony.'
    }
  },
  {
    id: 3,
    title: 'The Golden Cage',
    valueA: 'security',
    valueB: 'freedom',
    scenario: 'You are offered a massive multi-year contract that pays triple your current freelance rate, but it requires wearing an AI tracker, installing strict workplace surveillance on your home PC, and agreeing to absolute censorship on what you publish online.',
    optionA: {
      text: 'Sign the contract. You secure financial safety and luxury for your family, sacrificing your freedom of expression.',
      summary: 'Chose financial security over autonomy.'
    },
    optionB: {
      text: 'Reject the contract. You continue in your low-paying freelance gig, preserving your absolute independence and speech.',
      summary: 'Chose freedom and independence over financial safety.'
    }
  },
  {
    id: 4,
    title: 'The Reluctant Mover',
    valueA: 'loyalty',
    valueB: 'pleasure',
    scenario: 'Your sibling desperately needs you to help them move apartments on the only free weekend you\'ve had in six months, which you planned to spend relaxing at a premium luxury resort you\'ve already paid $800 for (non-refundable).',
    optionA: {
      text: 'Cancel your resort trip, lose the $800, and spend your weekend carrying heavy boxes for your sibling.',
      summary: 'Canceled plans and lost money to support family.'
    },
    optionB: {
      text: 'Make up a believable excuse about being ill, go to the luxury resort, and enjoy your paid relaxation.',
      summary: 'Chose personal enjoyment over sibling loyalty.'
    }
  }
];

// Default host passcode
const DEFAULT_PASSCODE = 'host123';

// 2. GAME STATE VARIABLE MANAGEMENT
let gameState = {
  playerName: '',
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
  dilemmaTimerInterval: null
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
    if (nameInput) {
      gameState.playerName = nameInput;
      transitionToScreen('screen-phase1-intro');
    }
  });

  // Phase 1 Start
  document.getElementById('btn-start-phase1').addEventListener('click', () => {
    initPhase1();
    transitionToScreen('screen-phase1-game');
    document.getElementById('game-progress').classList.remove('hidden');
    updateProgressBar(0, 'Phase 1: Bracket Sorter');
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

  // Phase 2 Start
  document.getElementById('btn-start-phase2').addEventListener('click', () => {
    initPhase2();
    transitionToScreen('screen-phase2-game');
    updateProgressBar(50, 'Phase 2: The Crucible');
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

  // Restart / Next Player
  document.getElementById('btn-restart-game').addEventListener('click', () => {
    resetGame();
    transitionToScreen('screen-welcome');
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
  if (screenId === 'screen-host-dashboard' || screenId === 'screen-host-login') {
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

function resetGame() {
  clearInterval(gameState.dilemmaTimerInterval);
  gameState = {
    playerName: '',
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
    dilemmaTimerInterval: null
  };
  document.getElementById('player-name').value = '';
  document.getElementById('game-progress').classList.add('hidden');
}


// ==========================================================================
// PHASE 1: BRACKET TOURNAMENT LOGIC
// ==========================================================================

function initPhase1() {
  // Shuffle value keys for random seeding
  const keys = Object.keys(VALUES);
  const shuffledKeys = keys.sort(() => Math.random() - 0.5);
  
  gameState.bracketValues = [...shuffledKeys];
  gameState.eliminatedValues = [];
  gameState.roundIndex = 1; // Round 1: Quarter Finals
  gameState.matchIndex = 0;
  gameState.p1Matches = [];
  
  // Reset point tracking
  shuffledKeys.forEach(k => {
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
  const timeTaken = (endTime - gameState.p1StartTime) / 1000; // in seconds

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
  // Quarter-final losers: 0 pts
  // Semi-final losers: 1 pt
  // Final runner-up: 2 pts
  // Grand Winner: 3 pts
  gameState.valuePoints[loserKey] = gameState.roundIndex - 1;

  // Track elimination
  gameState.eliminatedValues.push(loserKey);
  
  // Highlight eliminated in the list
  const loserPill = document.getElementById(`pill-${loserKey}`);
  if (loserPill) {
    loserPill.classList.remove('active');
    loserPill.classList.add('eliminated');
  }

  // Update current bracket list
  // Replace the pair in-place in the next round buffer or manage matchup list
  gameState.bracketValues[gameState.matchIndex] = winnerKey;

  gameState.matchIndex++;

  // Check if round is complete
  const expectedMatchesInRound = { 1: 4, 2: 2, 3: 1 }[gameState.roundIndex];

  if (gameState.matchIndex >= expectedMatchesInRound) {
    // End of round
    if (gameState.roundIndex === 3) {
      // Grand tournament complete!
      gameState.valuePoints[winnerKey] = 3;
      
      const winnerPill = document.getElementById(`pill-${winnerKey}`);
      if (winnerPill) {
        winnerPill.classList.add('winner-crown');
      }

      setTimeout(() => {
        transitionToScreen('screen-phase2-intro');
        updateProgressBar(50, 'Phase 1 Complete');
      }, 800);
    } else {
      // Advance to next round
      // Shrink bracketValues array to contain only winners (first half of array)
      gameState.bracketValues = gameState.bracketValues.slice(0, expectedMatchesInRound);
      gameState.roundIndex++;
      gameState.matchIndex = 0;
      
      setTimeout(() => {
        loadNextBracketMatch();
      }, 300);
    }
  } else {
    // Next match in current round
    setTimeout(() => {
      loadNextBracketMatch();
    }, 300);
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
  
  // Render descriptions
  document.getElementById('p2-dilemma-title').textContent = `Dilemma ${dilemma.id} of 4`;
  document.getElementById('p2-scenario-title').textContent = dilemma.title;
  document.getElementById('p2-scenario-desc').textContent = dilemma.scenario;

  // Options cards texts
  document.getElementById('dilemma-choice-a-text').textContent = dilemma.optionA.text;
  document.getElementById('dilemma-choice-b-text').textContent = dilemma.optionB.text;
  
  // Bind values associated with option keys
  document.getElementById('dilemma-choice-a').dataset.valueKey = dilemma.valueA;
  document.getElementById('dilemma-choice-b').dataset.valueKey = dilemma.valueB;

  // Reset progress bar (Phase 2 covers 50% to 90%)
  const progressPercent = 50 + (gameState.dilemmaIndex / 4 * 40);
  updateProgressBar(progressPercent, `Crucible Dilemma ${dilemma.id}/4`);

  // Start micro-timer
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
  } else {
    selectedVal = valB;
    chosenText = currentDilemma.optionB.summary;
    rejectedVal = valA;
    rejectedText = currentDilemma.optionA.summary;
  }

  // Save response
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
    // Phase 2 finished! Process report and compile profile.
    compilePlayerReport();
    updateProgressBar(100, 'Experiment Finished');
    
    setTimeout(() => {
      document.getElementById('complete-player-name').textContent = gameState.playerName;
      transitionToScreen('screen-complete');
    }, 600);
  } else {
    // Next dilemma
    setTimeout(() => {
      loadDilemma();
    }, 300);
  }
}


// ==========================================================================
// PROFILING & REPORT COMPILATION ALGORITHM
// ==========================================================================

function compilePlayerReport() {
  const points = gameState.valuePoints;
  const answers = gameState.dilemmaAnswers;
  
  // Find abstract winner (bracket winner)
  let bracketWinner = '';
  let highestPts = -1;
  Object.keys(points).forEach(key => {
    if (points[key] > highestPts) {
      highestPts = points[key];
      bracketWinner = key;
    }
  });

  // 1. Calculate Authenticity / Alignment Score
  // For each dilemma, compare player choice against their Phase 1 relative ranking preference.
  let contradictions = [];
  let alignedCount = 0;
  
  answers.forEach(ans => {
    const scoreA = points[ans.selectedValue];
    const scoreB = points[ans.rejectedValue];
    
    let isAligned = true;
    
    // Contradiction occurs if player chooses value with lower bracket score (they valued it less abstractly but picked it under pressure)
    if (scoreA < scoreB) {
      isAligned = false;
      contradictions.push({
        dilemmaId: ans.dilemmaId,
        declaredBetterValue: ans.rejectedValue,
        chosenLesserValue: ans.selectedValue,
        actionChosen: ans.chosenText,
        actionRejected: ans.rejectedText,
        timeTaken: ans.timeTaken
      });
    } else {
      alignedCount++;
    }
  });

  // Simple Authenticity scale: 4 dilemmas.
  // 4 aligned = 100%
  // 3 aligned = 75%
  // 2 aligned = 50%
  // 1 aligned = 25%
  // 0 aligned = 0%
  const authenticityScore = (alignedCount / DILEMMAS.length) * 100;

  // 2. Identify Archetype
  let archetype = '';
  let description = '';
  let icebreaker = '';

  if (authenticityScore >= 75) {
    if (bracketWinner === 'compassion' || bracketWinner === 'loyalty' || bracketWinner === 'truth') {
      archetype = 'The Quiet Saint';
      description = 'A rare breed of genuine integrity. They put community, trust, and others above themselves in theory, and stay true to that path even when it costs them real money or status.';
      icebreaker = `"${gameState.playerName}, you showed incredible alignment between your ideals and your actions. Do you ever regret putting others first, or does it come naturally?"`;
    } else if (bracketWinner === 'achievement' || bracketWinner === 'security' || bracketWinner === 'pleasure') {
      archetype = 'The Honest Pragmatist';
      description = 'Refreshing, raw, and highly practical. They do not put on a moral show or claim to be selfless. They openly value status, comfort, or safety, and act consistently on those motives.';
      icebreaker = `"${gameState.playerName}, you don't hide your ambition or desire for comfort. Does society pressure you to pretend to be more selfless than you actually are?"`;
    } else {
      archetype = 'The Autonomous Maverick';
      description = 'Highly values personal freedom and independent actions. They choose their own path and will reject comfort or money to preserve their boundaries and speech.';
      icebreaker = `"${gameState.playerName}, you consistently chose independence. What is the one thing you would never sacrifice for a high paycheck?"`;
    }
  } else if (authenticityScore >= 50) {
    // Mid range alignment
    if (bracketWinner === 'freedom') {
      archetype = 'The Free Spirit';
      description = 'Principled but highly flexible. They lean heavily towards freedom and personal agency, occasionally stepping out of bounds but generally acting in alignment with their values.';
      icebreaker = `"${gameState.playerName}, you values liberty highly. When was the last time you felt caged in your daily routine?"`;
    } else {
      archetype = 'The Adaptive Planner';
      description = 'A balanced realist. They strive to do good but understand that self-preservation is necessary. They display some contradictions but adjust choices logically based on stakes.';
      icebreaker = `"${gameState.playerName}, you showed moderate alignment. Do you believe morals are absolute, or do they change depending on how high the stakes are?"`;
    }
  } else {
    // Low alignment (Authenticity <= 25%)
    // Check if they claim to value compassion/loyalty but choose achievement/pleasure
    const choseSelfishOptions = answers.some(ans => 
      (ans.selectedValue === 'achievement' && ans.rejectedValue === 'compassion') ||
      (ans.selectedValue === 'pleasure' && ans.rejectedValue === 'loyalty')
    );

    if (choseSelfishOptions) {
      archetype = 'The Secret Boss';
      description = 'Presents a highly polished, selfless mask in public (values compassion and loyalty). However, when forced to make a real choice, they swiftly pivot to competitive self-interest and status.';
      icebreaker = `"${gameState.playerName}, you claim that helping others is a top value, but when it came to a promotion or personal money, you saved yourself. Do you think nice guys finish last?"`;
    } else {
      archetype = 'The Masked Chameleon';
      description = 'Highly inconsistent decision profile. They display massive contradictions between their claimed values and real reactions, indicating high susceptibility to pressure and external situations.';
      icebreaker = `"${gameState.playerName}, your choices contradicted your stated ideals on almost every front. Are you still trying to figure out what you actually stand for?"`;
    }
  }

  // 3. Reaction speed profiling
  // Classify reaction speed
  const p1Times = gameState.p1Matches.map(m => m.time);
  const p2Times = answers.map(a => a.timeTaken);

  const avgP1Time = p1Times.reduce((a, b) => a + b, 0) / p1Times.length;
  const avgP2Time = p2Times.reduce((a, b) => a + b, 0) / p2Times.length;

  let slowestDilemma = null;
  let maxDilemmaTime = -1;
  answers.forEach((ans, idx) => {
    if (ans.timeTaken > maxDilemmaTime) {
      maxDilemmaTime = ans.timeTaken;
      slowestDilemma = DILEMMAS[idx].title;
    }
  });

  const speedVerdict = avgP2Time < 2.5 
    ? 'Impulsive & Decisive' 
    : avgP2Time > 5 
      ? 'Intense Cognitive Contention' 
      : 'Calculated & Moderate';

  // 4. Save Session Report
  const sessionReport = {
    id: Date.now().toString(),
    playerName: gameState.playerName,
    datePlayed: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    authenticityScore: authenticityScore,
    archetype: archetype,
    description: description,
    icebreaker: icebreaker,
    bracketWinner: VALUES[bracketWinner].name,
    bracketWinnerIcon: VALUES[bracketWinner].icon,
    dilemmaAnswers: answers,
    contradictions: contradictions,
    decisionSpeedVerdict: speedVerdict,
    avgDilemmaTime: avgP2Time.toFixed(1),
    slowestDilemma: slowestDilemma,
    slowestTime: maxDilemmaTime.toFixed(1)
  };

  // Push to local storage database
  const activeSessions = JSON.parse(localStorage.getItem('unmasked_sessions') || '[]');
  activeSessions.unshift(sessionReport); // Add to beginning of list
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
    
    // Authenticity color indicator
    const authColorClass = session.authenticityScore >= 75 
      ? 'auth-high' 
      : session.authenticityScore >= 50 
        ? 'auth-mid' 
        : 'auth-low';

    item.innerHTML = `
      <div class="player-list-item-header">
        <span class="player-list-item-name">${escapeHTML(session.playerName)}</span>
        <span class="player-list-item-score ${authColorClass}">${session.authenticityScore}%</span>
      </div>
      <div class="player-list-item-meta">
        <span>${session.archetype}</span>
        <span>${session.datePlayed.split(',')[0]}</span>
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
  
  // Determine color coding for status bar
  const pct = session.authenticityScore;
  const barColor = pct >= 75 ? '#2ed573' : pct >= 50 ? '#ffa502' : '#ff4757';

  // Build key contradictions HTML list
  let contradictionsHTML = '';
  if (session.contradictions.length === 0) {
    contradictionsHTML = `
      <div class="contradiction-item aligned">
        <div class="contradiction-title">
          <span>Perfect Core Alignment</span>
          <span class="contradiction-badge pass">PASSED</span>
        </div>
        <p class="desc text-muted">This player did not exhibit any value trade-off compromises during testing. Their actual actions matched their stated ideals 100%.</p>
      </div>
    `;
  } else {
    session.contradictions.forEach(contra => {
      const declaredVal = VALUES[contra.declaredBetterValue];
      const lesserVal = VALUES[contra.chosenLesserValue];
      
      contradictionsHTML += `
        <div class="contradiction-item">
          <div class="contradiction-title">
            <span>Value Trade-Off Mismatch</span>
            <span class="contradiction-badge fail">CONTRADICTION</span>
          </div>
          <div class="contradiction-details">
            <div class="contra-row">
              <span class="contra-label">Stated Value:</span>
              <span class="contra-value val-ideal">${declaredVal.name}</span>
            </div>
            <div class="contra-row">
              <span class="contra-label">Actual Action:</span>
              <span class="contra-value val-real">${contra.actionChosen}</span>
            </div>
            <div class="contra-row">
              <span class="contra-label">Compromised:</span>
              <span class="contra-value">Abandoned ${declaredVal.name} for ${lesserVal.name}</span>
            </div>
            <div class="contra-row">
              <span class="contra-label">Decision Time:</span>
              <span class="contra-timing">${contra.timeTaken.toFixed(1)} seconds</span>
            </div>
          </div>
        </div>
      `;
    });
  }

  // Render HTML structure of player analysis
  panel.innerHTML = `
    <div class="profile-header animate-slide-up">
      <div class="profile-meta-main">
        <h2>${escapeHTML(session.playerName)}</h2>
        <span class="archetype-label">${session.archetype}</span>
      </div>
      <div class="text-right">
        <span class="profile-timestamp">${session.datePlayed}</span>
        <button class="btn btn-secondary btn-sm mt-2 block" onclick="deletePlayerReport('${session.id}')">
          <i class="fa-solid fa-trash"></i> Delete Report
        </button>
      </div>
    </div>

    <!-- Authenticity Rating Meter -->
    <div class="authenticity-section animate-slide-up">
      <div class="authenticity-header">
        <span class="authenticity-title">Authenticity Index</span>
        <span class="authenticity-percentage" style="color: ${barColor}">${session.authenticityScore}%</span>
      </div>
      <div class="authenticity-bar-track">
        <div class="authenticity-bar-fill" style="width: ${session.authenticityScore}%; background: ${barColor}"></div>
      </div>
      <p class="authenticity-desc">
        ${session.authenticityScore >= 75 
          ? 'Highly authentic. Stated ideals are consistently executed when presented with realistic consequences.' 
          : session.authenticityScore >= 50 
            ? 'Moderately aligned. Some adjustments made under pressure, but maintains core beliefs under standard conditions.' 
            : 'Low alignment. Features notable discrepancy between claimed priorities and self-preserving actions.'}
      </p>
    </div>

    <!-- Ideal vs Real Comparison -->
    <div class="comparison-grid animate-slide-up">
      <div class="side-comparison-card">
        <span class="comparison-label">Ideal Value Winner</span>
        <span class="comparison-value val-ideal">
          <i class="fa-solid ${session.bracketWinnerIcon}"></i>
          ${session.bracketWinner}
        </span>
      </div>
      <div class="side-comparison-card">
        <span class="comparison-label">Decision Speed Mode</span>
        <span class="comparison-value">
          <i class="fa-solid fa-gauge-high"></i>
          ${session.decisionSpeedVerdict}
        </span>
      </div>
    </div>

    <!-- Psych evaluation -->
    <div class="dashboard-segment-title animate-slide-up">Behavioral Breakdown</div>
    <div class="psychology-text-card animate-slide-up">
      <h4>Archetype Definition</h4>
      <p>${session.description}</p>
    </div>

    <!-- Speed diagnostics -->
    <div class="psychology-text-card animate-slide-up">
      <h4>Cognitive Friction Diagnostics</h4>
      <p>Average time taken on moral choices was <strong>${session.avgDilemmaTime}s</strong>. 
      The player hesitated longest on <strong>${session.slowestDilemma}</strong> taking <strong>${session.slowestTime}s</strong> to reach a decision.</p>
    </div>

    <!-- Mismatch lists -->
    <div class="dashboard-segment-title animate-slide-up">Ideal vs. Concrete Discrepancies</div>
    <div class="contradictions-list animate-slide-up">
      ${contradictionsHTML}
    </div>

    <!-- Icebreaker prompt card -->
    <div class="dashboard-segment-title animate-slide-up">Host Inquiry Prompt</div>
    <div class="psychology-text-card icebreaker-card animate-slide-up">
      <h4>Confrontation / Icebreaker Starter</h4>
      <p>${session.icebreaker}</p>
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

window.deletePlayerReport = function(sessionId) {
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
