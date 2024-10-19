import { RouterModule, Routes } from '@angular/router';
// import { AuthComponent } from './auth/auth.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    // { path: 'auth', component: AuthComponent },
    { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
