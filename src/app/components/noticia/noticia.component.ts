import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../interfaces/interfaces';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss'],
})
export class NoticiaComponent implements OnInit {

  @Input() noticia: Article;
  @Input() indice: number;
  @Input() emFavoritos;

  constructor( private iab: InAppBrowser, 
               private actionSheetCtrl: ActionSheetController, 
               private socialSharing: SocialSharing,
               private dataLocalService: DataLocalService,
               private platform: Platform ) { }

  ngOnInit() {}

  abrirnoticia() {
    // console.log('Noticia', );
    const browser = this.iab.create(this.noticia.url, '_system');

  }
  async lancarMenu() {

    let guardarApagarBtn;

    if( this.emFavoritos ) {
      // apagar favoritos
      guardarApagarBtn = {
        text: 'Apagar Favorito',
        icon: 'trash',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Apagando Favorito');
          this.dataLocalService.apagarNoticia( this.noticia );
        }
      };

    } else {
      guardarApagarBtn = {
        text: 'Favoritos',
        icon: 'star',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Favorito');
          this.dataLocalService.guardarNoticia( this.noticia );
        }
      };
    }



    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [{
        text: 'Compartilhar',
        icon: 'share',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Share clicked');

          this.compartilharNoticia(); 
        }
      },
      guardarApagarBtn,
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  compartilharNoticia() {

    if( this.platform.is('cordova') ) {
      
          this.socialSharing.share(
            this.noticia.title,
            this.noticia.source.name,
            '',
            this.noticia.url
          );
    } else {

      if (navigator['share']) {
        navigator['share'] ({
            title: this.noticia.title,
            text: this.noticia.description,
            url: this.noticia.url,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      } else {
        console.log('Sem suporte para compartilhar.');
      }
    }
  }
}
