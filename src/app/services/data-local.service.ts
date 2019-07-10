import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Article } from '../interfaces/interfaces';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  noticias: Article[] = [];

  constructor( private storage: Storage, public toastController: ToastController ) { 

    this.carregarFavoritos();
   }
   async presentToast( message: string ) {
    const toast = await this.toastController.create({
      message,
      duration: 1500
    });
    toast.present();
  }

  guardarNoticia( noticia: Article ) {

    const existe = this.noticias.find( noti => noti.title === noticia.title );

    if( !existe ) {
      this.noticias.unshift( noticia );
      this.storage.set('favoritos', this.noticias );
    }
    this.presentToast('Salvo nos favoritos!');
  }
  async carregarFavoritos() {

    const favoritos = await this.storage.get('favoritos');

    if( favoritos ) {
      this.noticias = favoritos;
    }
  }
  apagarNoticia( noticia: Article ) {
    this.noticias = this.noticias.filter( noti => noti.title !== noticia.title );
    this.storage.set('favoritos', this.noticias );
    this.presentToast('Apagado dos favoritos!');
  }
}
