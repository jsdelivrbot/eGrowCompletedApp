import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FcmProvider } from '../providers/fcm/fcm';

import { Firebase } from '@ionic-native/firebase';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { Vibration } from '@ionic-native/vibration';

import { HTTP } from '@ionic-native/http';

import { NativeRingtones } from '@ionic-native/native-ringtones';


const firebase = {
    apiKey: "AIzaSyCmYRmIo58g83z4NrqLaEetJ-tO5pYUJ5U",
    authDomain: "easygate-9cf24.firebaseapp.com",
    databaseURL: "https://easygate-9cf24.firebaseio.com",
    projectId: "easygate-9cf24",
    storageBucket: "easygate-9cf24.appspot.com",
    messagingSenderId: "303627576636"
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebase), 
    AngularFirestoreModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FcmProvider,
    Firebase,
    Vibration,
    NativeRingtones,
    HTTP
  ]
})
export class AppModule {}
