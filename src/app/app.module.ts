import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './view/principal/principal.component';
import { NavbarComponent } from './view/navbar/navbar.component';
import { LoginComponent } from './view/login/login.component';
import { ChatWidgeComponent } from './view/chat-widge/chat-widge.component';
import { SharedDirectivesModule } from './shared/shared-directives.module';

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    NavbarComponent,
    LoginComponent,
    ChatWidgeComponent 
  ],
  imports: [
    BrowserModule,         
    AppRoutingModule,
    HttpClientModule,
    FormsModule,            
    ReactiveFormsModule,    
    SharedDirectivesModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
