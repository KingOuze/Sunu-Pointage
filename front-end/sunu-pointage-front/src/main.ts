import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';  // Importez les routes 
import { provideHttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';



bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes) , provideHttpClient() ,// Utilisez provideRouter pour fournir les routes à l'application
 
  ]
})
  .catch(err => console.error(err));
