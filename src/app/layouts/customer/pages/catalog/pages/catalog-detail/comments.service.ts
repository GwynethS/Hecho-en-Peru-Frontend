import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { Comment } from './models/Comment';

@Injectable()
export class CommentsService {
  constructor(private httpClient: HttpClient) {}

  getCommentsByProduct(productId: string){
    return this.httpClient.get<Comment[]>(
      `${environment.apiURL}comments?productId=${productId}`
    );
  }

  getCommentsByPageByProduct(productId: string, offSet: number, limit: number) {
    return this.httpClient.get<Comment[]>(
      `${environment.apiURL}commentsByPage?productId=${productId}&offset=${offSet}&limit=${limit}`
    );
  }
}
