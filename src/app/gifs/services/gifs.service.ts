import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResponse, Gif } from '../interfaces/gifs.interface';

//const GIPHY_API_KEY = 'DNc1CNGsr2RMKyJp0fFAdL5MnUD7bStb';
@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'DNc1CNGsr2RMKyJp0fFAdL5MnUD7bStb';
  private serviceUrl: string = 'http://api.giphy.com/v1/gifs';
  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    this.loadGifCardList();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify( this._tagsHistory ));
  }

  private loadLocalStorage(): void{
    //Save the search history on array _tagsHistory
    if (!localStorage.getItem('history')) return;
    const temporal = localStorage.getItem('history');
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    //Load the card list in position 0 on the array _tagsHistory
    if(this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0])

  }

  /*
  async searchTag(tag:string):Promise<void>{
    if(tag.length === 0) return;
    //this._tagsHistory.unshift(tag);
    fetch('http://api.giphy.com/v1/gifs/search?api_key=DNc1CNGsr2RMKyJp0fFAdL5MnUD7bStb&q=ronaldo&limit=10')
    .then(resp => resp.json())
    .then( data => console.log(data));
  }
  */

  /*
  async searchTag(tag:string):Promise<void>{
    if(tag.length === 0) return;
    this._tagsHistory.unshift(tag);
    const resp = await fetch('http://api.giphy.com/v1/gifs/search?api_key=DNc1CNGsr2RMKyJp0fFAdL5MnUD7bStb&q=ronaldo&limit=10');
    const data = await resp.json();
   console.log(data);
  }
  */

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    //this._tagsHistory.unshift(tag);
    this.organizeHistory(tag);
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);
    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
        console.log(this.gifList);
      });
  }
}
