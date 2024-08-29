const searchBtn = document.getElementById('search-btn');
const resultContainer = document.getElementById('result-container');
const recipeContainer = document.getElementById('recipe-container');
const instructionsContainer = document.getElementById('instructions-container');
const searchContainer = document.getElementById('search-container');
const result = document.getElementById('result');
const recipeDetails = document.getElementById('recipe-details');
const recipeTitle = document.getElementById('recipe-title');
const ingredientList = document.getElementById('ingredient-list');
const recipeText = document.getElementById('recipe-text');
const backToResultBtn = document.getElementById('back-to-result');
const viewRecipeBtn = document.getElementById('view-recipe');
const backToDetailsBtn = document.getElementById('back-to-details');
const loader = document.getElementById('loader');

const api = 'https://api.api-ninjas.com/v1/recipe?query=';

let allRecipes = [];
let selectedRecipe = null;

function displayRecipeInstructions(recipe) {
    recipeText.textContent = recipe.instructions;
    recipeContainer.style.display = 'none';
    instructionsContainer.style.display = 'block';
}

function displayRecipeIngredients(recipe) {
    selectedRecipe = recipe;
    recipeTitle.textContent = `${recipe.title} - Ingredients`;
    ingredientList.innerHTML = "";

    const Ingredients = recipe.ingredients.split('|');

    Ingredients.forEach(ingredient => {
        const listItem = document.createElement('li');
        listItem.textContent = ingredient;
        ingredientList.appendChild(listItem);
    });

    searchContainer.style.display = 'none';
    resultContainer.style.display = 'none';
    recipeContainer.style.display = 'block';
}

function displayRecipes(recipes) {
    const noResultsMessage = document.getElementById('no-results-message');
    const recipeCardTemplate = document.getElementById('recipe-card-template');
    result.innerHTML = "";
    resultContainer.style.display = 'block';

    if (recipes.length == 0) {
        noResultsMessage.style.display = 'block';
        return;
    }

    noResultsMessage.style.display = 'none';

    recipes.forEach((recipe) => {
        const recipeCard = recipeCardTemplate.cloneNode(true);
        recipeCard.id = "";
        recipeCard.style.display = 'block';

        recipeCard.querySelector('.recipe-title').textContent = recipe.title;
        recipeCard.querySelector('.recipe-servings').textContent = recipe.servings;

        result.appendChild(recipeCard);

        recipeCard.addEventListener('click', () => {
            displayRecipeIngredients(recipe);
        });
    });
}

async function fetchRecipes(query) {
    result.innerHTML = ""; 
    loader.style.display = 'block'; 

    const response = await fetch((api + query), {
        method: 'GET',
        headers: {
            'X-Api-Key': API_KEY
        }
    });

    const data = await response.json();

    loader.style.display = 'none';

    if (data) {
        allRecipes = data;
        displayRecipes(allRecipes);
    } else {
        result.innerHTML = '<h3>No recipes found</h3>';
        resultContainer.style.display = 'block';
    }
}

searchBtn.addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.length === 0) {
        document.querySelector('.search').nextElementSibling.style.display = 'block';
        return;
    }
    resultContainer.style.display = 'none';
    fetchRecipes(userInput);
    document.querySelector('.search').nextElementSibling.style.display = 'none';
});

backToResultBtn.addEventListener('click', () => {
    recipeContainer.style.display = 'none';
    searchContainer.style.display = 'block';
    resultContainer.style.display = 'block';
});

viewRecipeBtn.addEventListener('click', () => {
    if (selectedRecipe) {
        displayRecipeInstructions(selectedRecipe);
    }
});

backToDetailsBtn.addEventListener('click', () => {
    instructionsContainer.style.display = 'none';
    recipeContainer.style.display = 'block';
});

fetchRecipes('all');