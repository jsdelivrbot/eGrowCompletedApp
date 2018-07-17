import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { connect } from 'mqtt';

import { AlertController } from 'ionic-angular';

import { Vibration } from '@ionic-native/vibration';

import { LoadingController } from 'ionic-angular';

import { Firebase } from '@ionic-native/firebase';

//import { HTTP } from '@ionic-native/http';

import { FcmProvider } from '../../providers/fcm/fcm';

//import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';

import { ToastController } from 'ionic-angular';

import { Platform } from 'ionic-angular';

//import { NativeRingtones } from '@ionic-native/native-ringtones';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
 

export class HomePage {
    public isToggled: boolean;
    loader;
    j:any = "0";
    temp="";
    humid="";
    solo="";
    //timer = 0;
    btnPortaoEnabled = true;
    aberto = true;
    cor_cadeado="";
    
    timer:any;
    horas = 0;
    minutos = 0;
    segundos = 0;
    sTimer = "";
    showTimer = false;
    
    status_portao="carregando.."
//    options: any = {
//        username: 'calhwsyy',
//        password: 'JrmHJ9mseB-2',
//        port: '34800'
//    }
    
    options: any = {
       // port: '443'
    }
   client : any;
   

     constructor(platform: Platform, public navCtrl: NavController, public alertCtrl: AlertController, private vibration: Vibration, public loadingCtrl: LoadingController, public fcm: FcmProvider,public firebaseNative: Firebase, toastCtrl: ToastController) {
      this.isToggled = false;
       this.fcm.getToken();
       this.fcm.subscribeTopic("egrow_201805160912YnUMz2rCWyCv_push");
       
       this.fcm.temPermissao();
       
        // Listen to incoming messages
        this.fcm.listenToNotifications().pipe(
              tap(msg => {
                // show a toast
                const toast = toastCtrl.create({
                  message: msg.body,
                  duration: 10000
                });
                toast.present();
              })
            )
            .subscribe(res=>{
                if(res.tap){
                    console.log('background');
                    console.log(res);
                }else{
                    console.log('foreground');
                    console.log(res);                    
                }
            });
         
            platform.ready().then(() => {
              // Okay, so the platform is ready and our plugins are available.
              // Here you can do any higher level native things you might need.
                console.log('platform ready');
                platform.resume.subscribe ( (e) => {
                console.trace("resume called"); });

                platform.pause.subscribe ( (e) => {
                  console.trace("pause called"); });

            });
    
         
         
         
         //this.client  = connect('wss://m23.cloudmqtt.com', this.options);
     this.client  = connect('wss://iot.eclipse.org:443/ws', this.options); 
     this.loader = this.loadingCtrl.create({
         content : "Carregando.."
     });
           
        this.loader.present();
        
        this.client.on('error', function (err) {
          console.log(err);
          this.client.end();
        })

        this.client.on('connect', () => {
          console.log('connected:');
          this.btnPortaoEnabled = true;
        })

      this.client.subscribe('egrow/201805160912YnUMz2rCWyCv/status', { qos: 1 });
      this.client.subscribe('egrow/201805160912YnUMz2rCWyCv/recebi', { qos: 1 });
      this.client.subscribe('egrow/201805160912YnUMz2rCWyCv/temp', { qos: 1 });
      this.client.subscribe('egrow/201805160912YnUMz2rCWyCv/humid', { qos: 1 });
      this.client.subscribe('egrow/201805160912YnUMz2rCWyCv/air_cond', { qos: 1 });
      this.client.subscribe('egrow/201805160912YnUMz2rCWyCv/solo', { qos: 1 });
      
      //this.client.subscribe('egrow/lamp', { qos: 1 });

    //  this.client.publish('egrow/portao', "0", { qos: 1, retain: false });

        this.client.on('message', (topic, message, packet)=> {
          console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic);
          
          if(topic.search('status')>0){
             // alert(topic.search('status'));
              this.status_portao = message.toString();
              if(this.status_portao=="aberto"){
                  this.aberto = true;
                  this.cor_cadeado = "danger"; 
                  //this.startTimer();                
              }else{
                  this.aberto = false;
                  this.cor_cadeado = "secondary";
                  //this.stopTimer();     
              }
              this.loader.dismiss();
          }
          if(topic.search('recebi')>0){
             // alert(topic.search('recebi'));
              this.btnPortaoEnabled = true;
              this.loader.dismiss();
          } 
          if(topic.search('temp')>0){
            this.temp =  message.toString();
          }  
          
          if(topic.search('humid')>0){
            this.humid =  message.toString();
          }   
          if(topic.search('air_cond')>0){
            if(message.toString()=="1"){
                this.isToggled = true;
            }else{
                this.isToggled = false;
            }
          }
          if(topic.search('solo')>0){
            this.solo =  message.toString();
          }                     
        })

        this.client.on('close', function () {
          console.log(' disconnected');
        })
        
        this.client.on('offline', ()=> {
           this.btnPortaoEnabled = false;
           this.status_portao = "sem conexão.."
        })
  
    }
    
    
    startTimer(){
     this.showTimer = true;
     this.timer = setInterval(()=>{
         console.log("timer started");
        this.segundos++; 
        console.log(this.segundos);
        if (this.segundos == 60){
            this.segundos = 0;
            this.minutos ++;
        }
        if (this.minutos == 60){
            this.minutos = 0;
            this.horas ++;
        }
        this.sTimer = ("0" + this.horas).slice(-2) + ":" + ("0" + this.minutos).slice(-2) + ":" + ("0" + this.segundos).slice(-2) ;
     }
     ,1000)
    }
    
    stopTimer(){
        this.showTimer = false;
        console.log("timer stopped");
        this.horas = 0;
        this.minutos = 0;
        this.segundos = 0;
        clearTimeout(this.timer);
    }
  
    sendMessage(){
       // this.client  = connect('wss://m23.cloudmqtt.com', this.options);
        if (this.j=="0"){
            this.j="1";
        }else{
            this.j="0";
        }
        this.client.publish('egrow/201805160912YnUMz2rCWyCv/portao',  this.j, { qos: 1, retain: false });     
    }
    
    comandoPortao(){
       
        this.btnPortaoEnabled = false;
        this.vibration.vibrate(400);
        
        this.client.publish('egrow/201805160912YnUMz2rCWyCv/portao',  "1", { qos: 2, retain: false }, (err)=>{
            
        });
        
        
    /*    setTimeout(()=>{
            if(this.btnPortaoEnabled == false){
                this.btnPortaoEnabled = true;
                this.loader.dismiss();
                this.showAlert('Erro conexão','Verifique se o seu EasyGate está ligado e conectado!',['ok']);
            }
        },
        20000); */
    }
        
      showAlert(title, subTitle, buttons) {
        let alert = this.alertCtrl.create({
          title: title,
          subTitle: subTitle,
          buttons: buttons
        });
        alert.present();
      }
      
   doRefresh(refresher) {
   // this.btnPortaoEnabled = true;
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
    
    setTimeout(() => {
      refresher.complete();
    }, 500);
  }
  
  fireAir(){
       this.vibration.vibrate(200);
      if (this.isToggled){
        this.client.publish('egrow/201805160912YnUMz2rCWyCv/air_cond',  "1", { qos: 2, retain: true }, (err)=>{
         });
      }else{
         this.client.publish('egrow/201805160912YnUMz2rCWyCv/air_cond',  "0", { qos: 2, retain: true }, (err)=>{
        });
      }
  }
}