// const { convert } = require("convert");
// var convert = require("convert-units");

// convert(1).from("oz").to("ml");

const searchBtn = document.getElementById("search-btn");
const cocktailList = document.getElementById("cocktail");
const cocktailDetailsContent = document.querySelector(
  ".cocktail-details-content"
);
const recipeCloseBtn = document.getElementById("recipe-close-btn");

// EVENT LISTENERS
searchBtn.addEventListener("click", getCocktailList);
cocktailList.addEventListener("click", getCocktailRecipe);
recipeCloseBtn.addEventListener("click", () => {
  cocktailDetailsContent.parentElement.classList.remove("showRecipe");
});

//get cocktail list that matches the ingredient
function getCocktailList() {
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = ``;
      if (data.drinks) {
        data.drinks.forEach((drink) => {
          html += `
          <div class="cocktail-item" data-id="${drink.idDrink}">
                <div class="cocktail-img">
                    <img
                        src="${drink.strDrinkThumb}"
                        alt=""
                    />
                </div>
                <div class="cocktail-name">
                    <h3>${drink.strDrink}</h3>
                    <a href="" class="recipe-btn">Get recipe</a>
                </div>
          </div>`;
        });
        cocktailList.classList.remove("notFound");
      }
      //else {
      //     html = "Sorry, we didn't find any cocktail!";
      //     cocktailList.classList.add("notFound");
      //   }
      cocktailList.innerHTML = html;
    })
    .catch(() => {
      html = "Input isn't valid!";
      cocktailList.classList.add("notFound");
      cocktailList.innerHTML = html;
    });
}

//get cocktail recipe
function getCocktailRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let cocktailItem = e.target.parentElement.parentElement;
    fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        cocktailRecipeModal(data.drinks);
      });
  }
}

//create a modal
function cocktailRecipeModal(drink) {
  console.log(drink);
  drink = drink[0];
  let count = 1;
  let ingredients = [];
  for (let i in drink) {
    let ingredient = "";
    let measure = "";
    if (i.startsWith("strIngredient") && drink[i]) {
      ingredient = drink[i];
      if (drink[`strMeasure` + count]) {
        measure = drink[`strMeasure` + count];
      } else {
        measure = "";
      }
      count += 1;
      ingredients.push(`${measure} ${ingredient}`);
    }
  }
  console.log(ingredients);
  let html = `<h2 class="recipe-title">${drink.strDrink}</h2>
  <p class="recipe-category">${drink.strCategory}</p>
  <div class="recipe-instruct">
    <h3>Ingredients:</h3>
    <ul class="ingredients"></ul>
    <h3>Instructions:</h3>
    <p>
     ${drink.strInstructions}
    </p>
    <p>Serve in ${drink.strGlass}</p>
  </div>
  <div class="recipe-cocktail-img">
    <img
      src="${drink.strDrinkThumb}"
      alt=""
    />
  </div>`;
  cocktailDetailsContent.innerHTML = html;
  cocktailDetailsContent.parentElement.classList.add("showRecipe");
  let ingredientsContainer = document.querySelector(".ingredients");
  ingredients.forEach((item) => {
    let listItem = document.createElement("li");
    listItem.innerText = item;
    ingredientsContainer.appendChild(listItem);
  });
}
