document.addEventListener('DOMContentLoaded', () => {
  fetchData('/api/solutions'); // Assuming you have a route for solutions in your server
});

async function fetchData(url) {
  try {
      const response = await fetch(url);
      const data = await response.json();
      displaySolutions(data);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

function displaySolutions(solutions) {
  const contentContainer = document.getElementById('content');

  solutions.forEach(solution => {
      const card = createSolutionCard(solution);
      contentContainer.appendChild(card);
  });
}

function createSolutionCard(solution) {
  const card = document.createElement('div');
  card.classList.add('card');

  const title = document.createElement('h2');
  title.textContent = solution.title;

  const description = document.createElement('p');
  description.textContent = solution.description;

  card.appendChild(title);
  card.appendChild(description);

  return card;
}
