import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './map/map.component';


const routes: Routes = [
    {
        path: '',
        component: MapComponent
    },
    {
        path: ':scale/:note',
        component: MapComponent
    },
    {
        path: 'major',
        redirectTo: 'major/C'
    },
    {
        path: 'minor',
        redirectTo: 'minor/A'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [MapComponent];
