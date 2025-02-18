/* script.js – Додаємо кнопки Back та налаштовуємо навігацію */

document.addEventListener("DOMContentLoaded", () => {
  // 🌟 Екрани
  const pages = {
    start: document.getElementById('startPage'),
    registration: document.getElementById('registrationPage'),
    trainingSelection: document.getElementById('trainingSelectionPage'),
    target: document.getElementById('targetPage'),
    game: document.getElementById('gamePage'),
  };

  // 🟡 Кнопки
  const buttons = {
    start: document.getElementById('startButton'),
    nextToTraining: document.getElementById('nextToTrainingType'),
    backToRegistration: document.getElementById('backToRegistration'),
    nextToTarget: document.getElementById('nextToTarget'),
    backToTrainingSelection: document.getElementById('backToTrainingSelection'),
    startGame: document.getElementById('startGameButton'),
    backToTarget: document.getElementById('backToTarget'),
  };

  // 📝 Поля введення
  const playerMode = document.getElementById('playerMode');
  const playerCount = document.getElementById('playerCount');
  const playerNames = document.getElementById('playerNames');
  const individualTargetCheckbox = document.getElementById('individualTarget');
  const commonTargetInput = document.getElementById('commonTarget');
  const individualTargetsContainer = document.getElementById('individualTargets');

  // 🧩 База вправ та комплексів
  const exercises = [
    { id: 1, name: "Push-ups", reps: 15, calories: 10 },
    { id: 2, name: "Squats", reps: 20, calories: 12 },
    { id: 3, name: "Jumping Jacks", reps: 30, calories: 8 },
    { id: 4, name: "Plank", reps: 60, calories: 15 },
  ];

  const complexes = [
    {
      id: "morning",
      name: "Morning Energy",
      exercises: [1, 2]
    },
    {
      id: "fatburn",
      name: "Fat Burn Complex",
      exercises: [2, 3, 4]
    }
  ];

  let selectedExercises = [];
  const exerciseList = document.getElementById('exerciseList');
  const complexList = document.getElementById('complexList');
  
  // 🟡 Вкладки для вибору
  const manualTab = document.getElementById('manualTab');
  const complexTab = document.getElementById('complexTab');
  const manualSelection = document.getElementById('manualSelection');
  const complexSelection = document.getElementById('complexSelection');

  // 🟡 Виводимо вправи
  function renderExercises() {
    exerciseList.innerHTML = exercises.map(exercise => `
      <div class="exercise-item" data-id="${exercise.id}">
        ${exercise.name} - ${exercise.reps} reps (${exercise.calories} cal)
      </div>
    `).join('');
    document.querySelectorAll('.exercise-item').forEach(item => {
      item.addEventListener('click', () => toggleExercise(parseInt(item.dataset.id, 10)));
    });
  }

  // 🟡 Виводимо комплекси
  function renderComplexes() {
    complexList.innerHTML = complexes.map(complex => `
      <div class="complex-item" data-id="${complex.id}">
        ${complex.name}
      </div>
    `).join('');
    document.querySelectorAll('.complex-item').forEach(item => {
      item.addEventListener('click', () => selectComplex(item.dataset.id));
    });
  }

  // 🟡 Вибір/зняття вибору вправ
  function toggleExercise(exerciseId) {
    const index = selectedExercises.indexOf(exerciseId);
    if (index > -1) {
      selectedExercises.splice(index, 1); // Видаляємо, якщо обрана повторно
    } else {
      selectedExercises.push(exerciseId);
    }
    updateExerciseHighlight();
  }

  // 🟡 Підсвічування обраних вправ
  function updateExerciseHighlight() {
    document.querySelectorAll('.exercise-item').forEach(item => {
      const id = parseInt(item.dataset.id, 10);
      item.classList.toggle('selected', selectedExercises.includes(id));
    });
  }

  // 🟡 Вибір комплексу
  function selectComplex(complexId) {
    const complex = complexes.find(c => c.id === complexId);
    if (complex) {
      selectedExercises = complex.exercises;
      updateExerciseHighlight();
      updateComplexHighlight(complexId);
    }
  }
  
  // 🟡 Підсвічування обраного комплексу
  function updateComplexHighlight(selectedId) {
    document.querySelectorAll('.complex-item').forEach(item => {
      item.classList.toggle('selected', item.dataset.id === selectedId);
    });
  }

  // 🟡 Переключення вкладок
  manualTab.addEventListener('click', () => {
    manualTab.classList.add('active');
    complexTab.classList.remove('active');
    manualSelection.classList.remove('hidden');
    complexSelection.classList.add('hidden');
  });

  complexTab.addEventListener('click', () => {
    complexTab.classList.add('active');
    manualTab.classList.remove('active');
    complexSelection.classList.remove('hidden');
    manualSelection.classList.add('hidden');
  });

  // 📊 Дані гри
  let gameData = {
    players: [],
    targets: {},
  };

  // 🧩 Історія навігації
  let navigationHistory = [];

  // 🔄 Функція перемикання сторінок
  function showPage(page) {
    Object.values(pages).forEach(p => p.classList.add('hidden'));
    page.classList.remove('hidden');

    // 📌 Записуємо в історію лише, якщо це не остання сторінка
    if (navigationHistory.length === 0 || navigationHistory[navigationHistory.length - 1] !== page) {
      navigationHistory.push(page);
    }
    console.log("Navigation history:", navigationHistory);
  }

  // 🟡 Повернення на попередню сторінку
  function goBack() {
    if (navigationHistory.length > 1) {
      navigationHistory.pop();
      const previousPage = navigationHistory[navigationHistory.length - 1];
      showPage(previousPage);
    } else {
      showPage(pages.start);
    }
  }
  
  document.querySelectorAll('.back-button').forEach(button => {
    button.addEventListener('click', goBack);
  });  

  // 🧍‍♂️ Вибір режиму гравця
  playerMode.addEventListener('change', () => {
    document.getElementById('singlePlayerInput').classList.toggle('hidden', playerMode.value !== 'single');
    document.getElementById('multiplePlayersInput').classList.toggle('hidden', playerMode.value !== 'multiple');
  });

  // 📥 Генерація полів для введення імен
  playerCount.addEventListener('input', () => {
    playerNames.innerHTML = '';
    const count = parseInt(playerCount.value, 10);
    if (count > 0) {
      for (let i = 1; i <= count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Player ${i} Name`;
        input.classList.add('player-name');
        playerNames.appendChild(input);
      }
    }
  });

  // ✅ Переходи між екранами
  buttons.start.addEventListener('click', () => showPage(pages.registration));
  buttons.nextToTraining.addEventListener('click', () => {
    collectPlayers();
    showPage(pages.trainingSelection);
  });

  buttons.backToStart = document.getElementById('backToStart');
  buttons.backToStart.addEventListener('click', () => {
    showPage(pages.start);
    navigationHistory = [pages.start]; // Очищаємо історію при поверненні
  });

  buttons.backToRegistration.addEventListener('click', () => goBack());
  buttons.nextToTarget.addEventListener('click', () => {
    showPage(pages.target);
  });
  buttons.backToTrainingSelection.addEventListener('click', () => goBack());
  buttons.startGame.addEventListener('click', () => {
    collectTargets();
    showPage(pages.game);
  });
  buttons.backToTarget.addEventListener('click', () => goBack());

  // 📝 Збір даних про гравців
  function collectPlayers() {
    gameData.players = [];
    if (playerMode.value === 'single') {
      const playerName = document.getElementById('singlePlayerName').value.trim();
      if (playerName) {
        gameData.players.push(playerName);
      }
    } else {
      const inputs = playerNames.querySelectorAll('.player-name');
      inputs.forEach(input => {
        const name = input.value.trim();
        if (name) gameData.players.push(name);
      });
    }
    console.log('Players:', gameData.players);
  }

  // 🥇 Збір цільових калорій
  function collectTargets() {
    gameData.targets = {};
    if (individualTargetCheckbox.checked) {
      const inputs = individualTargetsContainer.querySelectorAll('.individual-target');
      inputs.forEach(input => {
        const player = input.dataset.player;
        gameData.targets[player] = parseInt(input.value, 10) || 0;
      });
    } else {
      const commonTarget = parseInt(commonTargetInput.value, 10) || 0;
      gameData.players.forEach(player => {
        gameData.targets[player] = commonTarget;
      });
    }
    console.log('Targets:', gameData.targets);
  }

  // 🧩 Показ індивідуальних цілей для кожного гравця
  individualTargetCheckbox.addEventListener('change', () => {
    individualTargetsContainer.innerHTML = '';
    if (individualTargetCheckbox.checked) {
      gameData.players.forEach(player => {
        const div = document.createElement('div');
        div.innerHTML = `
          <label>${player}'s Target:</label>
          <input type="number" class="individual-target" data-player="${player}" placeholder="Calories for ${player}">
        `;
        individualTargetsContainer.appendChild(div);
      });
      individualTargetsContainer.classList.remove('hidden');
      commonTargetInput.parentElement.classList.add('hidden');
    } else {
      individualTargetsContainer.classList.add('hidden');
      commonTargetInput.parentElement.classList.remove('hidden');
    }
  });

  // ✅ Починаємо зі стартової сторінки
  renderExercises();
  renderComplexes();
  navigationHistory = [pages.start];
  showPage(pages.start);  
});
