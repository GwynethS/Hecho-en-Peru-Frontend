import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { Comment } from './models/comment';
import { finalize, mergeMap } from 'rxjs';
import { LoadingService } from '../../../../../../core/services/loading.service';

@Injectable()
export class CommentsService {
  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {}

  getCommentsByProduct(productId: string) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<Comment[]>(`${environment.apiURL}comments?productId=${productId}`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getCommentsByPageByProduct(productId: string, offSet: number, limit: number) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<Comment[]>(
        `${environment.apiURL}commentsByPage?productId=${productId}&offset=${offSet}&limit=${limit}`
      )
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  addComment(data: Comment, offSet: number, limit: number) {
    this.loadingService.setIsLoading(true);
    
    return this.httpClient
      .post<Comment>(`${environment.apiURL}comment`, data)
      .pipe(
        mergeMap(() =>
          this.getCommentsByPageByProduct(data.product.id, offSet, limit)
        )
      ).pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }
}
