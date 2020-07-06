import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  tokenName = "--token-ASM-PROD";

  public set(key, value){
    if( localStorage){
      localStorage.setItem(key, value);
    }
    else{
      alert('Browser does not support localStorage API');
    }
  }

  public get(key){
    if(localStorage){
      if(key in localStorage){
          return localStorage.getItem(key);
      }
    }
    else{
      alert('Browser does not support localStorage API');
    }
  }

  public setToken(token){
    this.set(this.tokenName, token);
  }

  public getToken(){
    return this.get(this.tokenName);
  }

  public removeToken(){
    localStorage.removeItem(this.tokenName);
  }

  public getParsedToken(){
    let token = this.getToken();
    return JSON.parse(atob(token.split(".")[1]))
  }
}
