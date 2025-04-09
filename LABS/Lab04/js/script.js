// script.js

const API_BASE_URL = 'http://localhost:3001/api';

// Function to fetch and display characters
async function loadCharacters() {
  try {
    const response = await fetch(`${API_BASE_URL}/characters`);
    const characters = await response.json();

    const container = document.getElementById('characters-container');
    container.innerHTML = ''; // Clear existing content

    characters.forEach(character => {
      const card = document.createElement('div');
      card.className = 'col-md-4';
      card.innerHTML = `
        <div class="card">
          <img src="img/character${character.id}.jpg" class="card-img-top" alt="${character.name}">
          <div class="card-body">
            <h5 class="card-title">${character.name}</h5>
            <p class="card-text">
              <strong>Fiction Genre:</strong> ${character.fictionGenre}<br>
              <strong>Role:</strong> ${character.role}<br>
              <strong>Hair Color:</strong> ${character.hairColor}<br>
              <strong>Glasses:</strong> ${character.glasses ? 'Yes' : 'No'}<br>
              <strong>Gender:</strong> ${character.gender}<br>
              <strong>Has Power:</strong> ${character.hasPower ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading characters:', error);
  }
}

// Function to fetch and display hypotheses for a specific game
async function loadHypotheses(gameId) {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}/hypotheses`);
    const hypotheses = await response.json();

    const list = document.getElementById('hypotheses-list');
    list.innerHTML = ''; // Clear existing content

    hypotheses.forEach(hypothesis => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.textContent = hypothesis;
      list.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error loading hypotheses:', error);
  }
}

// Function to reset visibility of all characters
async function resetVisibility() {
  try {
    await fetch(`${API_BASE_URL}/characters/reset-visibility`, { method: 'POST' });
    alert('Visibility reset successfully!');
    loadCharacters(); // Reload characters after resetting visibility
  } catch (error) {
    console.error('Error resetting visibility:', error);
  }
}

// Event listener for reset visibility button
document.getElementById('reset-visibility-btn').addEventListener('click', resetVisibility);

// Initial load
loadCharacters();
loadHypotheses(1); // Load hypotheses for game with ID 1