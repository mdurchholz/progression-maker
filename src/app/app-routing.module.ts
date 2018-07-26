import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { WelcomeComponent } from './welcome/welcome.component';
import { MapComponent } from './map/map.component';


const routes: Routes = [
    {
        path: '',
        component: WelcomeComponent
    },
    {
        path: '**',
        component: MapComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }

export const routingComponents = [MapComponent];
