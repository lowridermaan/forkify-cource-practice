import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import 'core-js/stable'; // polifiling
import 'regenerator-runtime/runtime'; //polifiling async await
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2
// API key
// 5578940a-0436-4b1a-a2fe-df070111bccf

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }

const controllRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpiner();

    // updating
    resultsView.update(model.getSearchResultsPage());
    //updating recipe
    bookmarkView.update(model.state.bookmarks);
    // loading recipe
    await model.loadRecipe(id);
    // rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpiner();
    // get query and clear input field
    const query = searchView.getQuery();
    if (!query) return;
    // load search results
    await model.loadRecipeSearch(query);
    // render results

    resultsView.render(model.getSearchResultsPage());
    // render pagination btns
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controllPagination = function (goToPage) {
  // render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // render NEW pagination btns
  paginationView.render(model.state.search);
};

const controllServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add/Remove bookmark icon
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  //update the view
  recipeView.update(model.state.recipe);
  //render bookmark
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show spinner
    addRecipeView.renderSpiner();
    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // render recipe
    recipeView.render(model.state.recipe);

    //succsess message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarkView.render(model.state.bookmarks);

    //change id in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 1000 * MODAL_CLOSE_SEC);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const newFunction = function () {
  console.log('Welcome to the app!');
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controllRecipes);
  recipeView.addHandlerServings(controllServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controllPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFunction();
};

init();
