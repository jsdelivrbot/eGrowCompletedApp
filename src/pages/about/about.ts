import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';

import { LoadingController } from 'ionic-angular';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
 logList:any = [];
 url:string;
 loader;
 
  constructor(public http: HTTP, public navCtrl: NavController, public loadingCtrl: LoadingController){   

  }
  
  ionViewDidLoad(){

      this.getLogs();
      
  }
  
  ionViewWillEnter(){
       this.getLogs();
  }
  
   doRefresh(refresher) {
      this.getLogs();
      setTimeout(() => {
      refresher.complete();
    }, 500);
   }
  
  getLogs(){
           this.loader = this.loadingCtrl.create({
         content : "Carregando.."
     });
     
     this.url = "http://marmitariapliniao.com.br/easygate/public/listlog";
      this.http.get(this.url, '', '').then(data => {

        console.log(JSON.parse(data.data)); // data received by server
        this.logList = JSON.parse(data.data);
        this.loader.dismiss();
      })
      .catch(error => {

        console.log(error.status);
        alert(error.error); // error message as string
        console.log(error.headers);
        this.loader.dismiss();

      });
    }
}