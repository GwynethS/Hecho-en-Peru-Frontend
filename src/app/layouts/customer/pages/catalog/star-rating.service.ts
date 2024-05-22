import { Injectable } from '@angular/core';
import { StarRatingConfigService } from 'angular-star-rating';

@Injectable()
export class StarRatingService extends StarRatingConfigService{

  constructor() {
    super();
    this.numOfStars = 5;
    this.staticColor = 'positive';
  }
}
