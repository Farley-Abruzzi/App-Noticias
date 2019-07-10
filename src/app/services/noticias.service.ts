import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RespostaTopHeadlines } from '../interfaces/interfaces';
import { environment } from '../../environments/environment.prod';

const apiKey = environment.apiKey;
const apiUlr = environment.apiUlr;

const headers = new HttpHeaders({
  'X-Api-key': apiKey
});


@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  headlinesPage = 0;

  categoriaAtual = '';
  categoriaPage = 0;

  constructor( private http: HttpClient ) { }

  private executarQuery<T>( query: string ) {

    query = apiUlr + query;

    return this.http.get<T>( query, { headers } );
  }

  getTopHeadlines() {
    this.headlinesPage++;
    //return this.http.get<RespostaTopHeadLines>(`https://newsapi.org/v2/top-headlines?country=us&apiKey=5a66227533f841dc91410e8f6b8aa9ad`);
    return this.executarQuery<RespostaTopHeadlines>(`/top-headlines?country=br&page=${ this.headlinesPage }`);

  }
  getTopHeadlinesCategoria( categoria: string ) {

    if( this.categoriaAtual === categoria ) {
      this.categoriaPage++;
    } else {
      this.categoriaPage = 1;
      this.categoriaAtual = categoria;
    }
    //return this.http.get(`https://newsapi.org/v2/top-headlines?country=de&category=business&apiKey=5a66227533f841dc91410e8f6b8aa9ad`);
    return this.executarQuery<RespostaTopHeadlines>(`/top-headlines?country=br&category=${ categoria }&page=${ this.categoriaPage }`);
  }
}
