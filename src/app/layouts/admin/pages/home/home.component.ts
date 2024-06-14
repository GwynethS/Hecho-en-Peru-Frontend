import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AlertService } from '../../../../core/services/alert.service';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  dataLoadedSuccessfully = true;

  constructor(private homeService: HomeService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.loadProductsByRatingChart();
    this.loadProductsByCategoryChart();
    this.loadCommentsByRegionChart();
    this.loadProductsByRegionChart();
  }

  loadProductsByRatingChart(): void {
    this.homeService.getProductsByAverageRating().subscribe({
      next: (products) => {
        const labels = products.map((product) => product.rangeAverageRating);
        const data = products.map((product) => product.quantity);
        new Chart('productsByRatingChart', {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: [
                  '#EEB8B8',
                  '#FAE2A3',
                  '#F0CAAA',
                  '#CDE9B2',
                  '#DBCAED',
                  '#C2E4F0',
                  '#D9D9D9',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                beginAtZero: true,
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 5,
                },
              }
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });
      },
      error: () => {
        this.dataLoadedSuccessfully = false;
        this.showLoadDataError();
      }
    });
  }

  loadProductsByCategoryChart(): void {
    this.homeService.getProductsQuantityByCategory().subscribe({
      next: (products) => {
        const categories = products.map((product) => product.categoryName);
        const data = products.map((product) => product.quantityProductsSold);
        new Chart('productsByCategoryChart', {
          type: 'bar',
          data: {
            labels: categories,
            datasets: [
              {
                data: data,
                backgroundColor: [
                  '#EEB8B8',
                  '#FAE2A3',
                  '#F0CAAA',
                  '#CDE9B2',
                  '#DBCAED',
                  '#C2E4F0',
                  '#D9D9D9',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });
      },
      error: () => {
        this.dataLoadedSuccessfully = false;
        this.showLoadDataError();
      }
    });
  }

  loadCommentsByRegionChart(): void {
    this.homeService.getCommentsQuantityByRegion().subscribe({
      next: (comments) => {
        const labels = comments.map((comment) => comment.regionName);
        const data = comments.map((comment) => comment.percentage);
        new Chart('commentsByRegionChart', {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: [
                  '#EEB8B8',
                  '#FAE2A3',
                  '#F0CAAA',
                  '#CDE9B2',
                  '#DBCAED',
                  '#C2E4F0',
                  '#D9D9D9',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            plugins: {
              datalabels: {
                formatter: (value) => {
                  return value.toFixed(2) + '%';
                },
              },
            },
          },
        });
      },
      error: () => {
        this.dataLoadedSuccessfully = false;
        this.showLoadDataError();
      }
    });
  }

  loadProductsByRegionChart(): void {
    this.homeService.getProductsQuantityByRegion().subscribe({
      next: (products) => {
        const regions = products.map((product) => product.regionName);
        const data = products.map((product) => product.quantityProductsSold);
        new Chart('productsByRegionChart', {
          type: 'bar',
          data: {
            labels: regions,
            datasets: [
              {
                data: data,
                backgroundColor: [
                  '#EEB8B8',
                  '#FAE2A3',
                  '#F0CAAA',
                  '#CDE9B2',
                  '#DBCAED',
                  '#C2E4F0',
                  '#D9D9D9',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });
      },
      error: () => {
        this.dataLoadedSuccessfully = false;
        this.showLoadDataError();
      }
    });
  }

  showLoadDataError(): void {
    if (!this.dataLoadedSuccessfully) {
      this.alertService.showError(
        'Ups! Ocurrió un error',
        'No se pudieron cargar los datos correctamente'
      );
    }
  }
}
