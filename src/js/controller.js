import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';
import paginationView from './Views/paginationView.js';
import bookmarkView from './Views/bookmarkView.js';
import addRecipeView from './Views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Close_Modal_Sec } from './config.js';


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// if (module.hot) module.hot.accept();

const controlRecipes = async function () {
  try {
    // Getting id
    const id = window.location.hash.slice(1);

    if (!id) return;
    // Render Loading spinner
    recipeView.renderSpinner();

    // Update result view to Mark selected
    resultsView.update(model.getSearchResultsPage(1));
    // load Recipe
    await model.loadRecipe(id);

    bookmarkView.update(model.state.bookmarks);
    // Render Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderErrorMessage();
  }
};

const controlSearchRecipes = async function () {
  try {
    resultsView.renderSpinner();

    // Getting Query
    const query = searchView.getQuery();
    if (!query) return;

    // Loading Search Results
    await model.loadSearchRecipes(query);

    // Rendering Results

    resultsView.render(model.getSearchResultsPage(1));

    paginationView.render(model.state.search);
  } catch (err) {
    // console.log(err);
    resultsView.renderErrorMessage();
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  model.updateServings(updateTo);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarkView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, Close_Modal_Sec * 1000);
  } catch (err) {
    addRecipeView.renderErrorMessage(err.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchRecipes);
  paginationView.addHandlerClick(controlPagination);
  bookmarkView.addHandlerBookmarks(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

console.log("hello");