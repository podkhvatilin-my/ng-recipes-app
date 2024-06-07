import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

const DB_URL = 'https://ng-course-recipe-book-91a88-default-rtdb.europe-west1.firebasedatabase.app';

@Injectable()
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService
  ) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(`${DB_URL}/recipes.json`, recipes).subscribe();
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(`${DB_URL}/recipes.json`)
      .pipe(
        map((recipes) => recipes.map((recipe) => ({...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}))),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
