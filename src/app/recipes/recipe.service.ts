import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService) { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;

    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipeData: { name: string, description: string, imagePath: string, ingredients: { name: string, amount: number }[] }) {
    this.recipes.push(new Recipe(
      recipeData.name,
      recipeData.description,
      recipeData.imagePath,
      recipeData.ingredients.map(({ name, amount }: Ingredient) => new Ingredient(name, amount)),
    ));
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(
    index: number,
    recipeData: { name: string, description: string, imagePath: string, ingredients: { name: string, amount: number }[] }
  ) {
    this.recipes[index] =  new Recipe(
      recipeData.name,
      recipeData.description,
      recipeData.imagePath,
      recipeData.ingredients.map(({ name, amount }: Ingredient) => new Ingredient(name, amount)),
    );

    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
