import { Component, OnInit } from '@angular/core';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is simply test', 'https://arbuz.com/wp-content/uploads/2010/07/Main-image.jpg'),
    new Recipe('A Test Recipe', 'This is simply test', 'https://arbuz.com/wp-content/uploads/2010/07/Main-image.jpg')
  ];

  constructor() { }

  ngOnInit() {
  }

}
