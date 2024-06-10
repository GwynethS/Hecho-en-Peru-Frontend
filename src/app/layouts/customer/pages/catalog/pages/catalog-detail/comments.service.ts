import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { Comment } from './models/comment';
import { mergeMap } from 'rxjs';

@Injectable()
export class CommentsService {
  constructor(private httpClient: HttpClient) {}

  getCommentsByProduct(productId: string) {
    return this.httpClient.get<Comment[]>(
      `${environment.apiURL}comments?productId=${productId}`
    );
  }

  getCommentsByPageByProduct(productId: string, offSet: number, limit: number) {
    return this.httpClient.get<Comment[]>(
      `${environment.apiURL}commentsByPage?productId=${productId}&offset=${offSet}&limit=${limit}`
    );
  }

  addComment(data: Comment, offSet: number, limit: number) {
    return this.httpClient
      .post<Comment>(`${environment.apiURL}comment`, data)
      .pipe(
        mergeMap(() =>
          this.getCommentsByPageByProduct(data.product.id, offSet, limit)
        )
      );
  }
}
