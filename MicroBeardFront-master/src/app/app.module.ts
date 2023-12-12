import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { NotFoundComponent } from './components/error-pages/not-found/not-found.component';
import { InternalServerComponent } from './components/error-pages/internal-server/internal-server.component';
import { UnauthorizedComponent } from './components/error-pages/unauthorized/unauthorized.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoginComponent } from './components/login/login.component';

import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactModule } from './components/contact/contact.module';
import { ServiceModule } from './components/service/service.module';
import { CollaboratorModule } from './components/collaborator/collaborator.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { SchedulingModule } from './components/scheduling/scheduling.module';
import { NgxMaskModule } from 'ngx-mask';
import { BsDropdownModule,BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {TokenInterceptor} from './shared/services/interceptors/token.interceptor';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';


defineLocale('pt-br', ptBrLocale);
registerLocaleData(localePt, 'pt');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    NotFoundComponent,
    InternalServerComponent,
    UnauthorizedComponent,
    SidebarComponent,
    LoginComponent,
    PrincipalComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CollapseModule.forRoot(),
    ContactModule,
    ServiceModule,
    CollaboratorModule,
    NgbModule,
    TimepickerModule.forRoot(),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    SchedulingModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: false,
    }),
    BsDropdownModule.forRoot(),
    NgbDropdownModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt',
    },

    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL',
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    BsDropdownConfig,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private bsLocaleService: BsLocaleService) {
    this.bsLocaleService.use('pt-br');
    }
}
