import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.loadProductsByRatingChart();
    this.loadProductsByCategoryChart();
    this.loadCommentsByRegionChart();
    this.loadProductsByRegionChart();
  }

  loadProductsByRatingChart(): void {
    this.homeService.getProductsByAverageRating().subscribe(products => {
      const labels = products.map(product => product.name);
      const data = products.map(product => product.averageRating);
      new Chart('productsByRatingChart', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Rating promedio',
            data: data,
            backgroundColor: '#EDBA90',
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }

  loadProductsByCategoryChart(): void {
    this.homeService.getProductsByCategory().subscribe(products => {
      const categories = [...new Set(products.map(product => product.category.name))];
      const data = categories.map(category => {
        return products.filter(product => product.category.name === category).length;
      });
      new Chart('productsByCategoryChart', {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Cantidad de productos',
            data: data,
            backgroundColor: '#FBDB87',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }

  loadCommentsByRegionChart(): void {
    this.homeService.getCommentsQuantityByRegion().subscribe(comments => {
      const labels = comments.map(comment => comment.region.name);
      const data = comments.map(comment => comment.quantity);
      new Chart('commentsByRegionChart', {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            label: 'Cantidad de comentarios',
            data: data,
            backgroundColor: [
              '#E09898',
              '#DBCAED',
              '#EDBA90',
              '#FBDB87',
              '#BFE49A',
              '#C2E4F0'
            ],
            borderWidth: 1
          }]
        }
      });
    });
  }

  loadProductsByRegionChart(): void {
    this.homeService.getProductsByRegion().subscribe(products => {
      const regions = [...new Set(products.map(product => product.localCraftsman.region.name))];
      const data = regions.map(region => {
        return products.filter(product => product.localCraftsman.region.name === region).length;
      });
      new Chart('productsByRegionChart', {
        type: 'bar',
        data: {
          labels: regions,
          datasets: [{
            label: 'Cantidad de productos',
            data: data,
            backgroundColor: '#BFE49A',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }
}
