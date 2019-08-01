import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AuthGuard } from './auth.guard';

import { AppWrapComponent } from './app-wrap/app-wrap.component';


const routes: Routes = [
    {
        path: '',
        component: AppWrapComponent
    }
    // {
    //     path: '**',
    //     component: MapComponent,
    //     canActivate: [AuthGuard]
    // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  // providers: [AuthGuard]
})
export class AppRoutingModule { }

export const routingComponents = [AppWrapComponent];
