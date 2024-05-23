import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'Tasty Schnitzel',
      'A super-tasty Schnitzel - just awesome!',
      // tslint:disable-next-line:max-line-length
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Breitenlesau_Krug_Br%C3%A4u_Schnitzel.JPG/220px-Breitenlesau_Krug_Br%C3%A4u_Schnitzel.JPG',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20)
      ]
    ),
    new Recipe(
      'Big Fat Burger',
      'What else you need to say?',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hamburger_%28black_bg%29.jpg/274px-Hamburger_%28black_bg%29.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1)
      ]
    )
  ];

  constructor(private shoppingListService: ShoppingListService) { }

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
