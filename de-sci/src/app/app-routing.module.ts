import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyPapersComponent } from './my-papers/my-papers.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: '', component: HomeComponent, title: "Home" },
  { path: 'my-papers', component: MyPapersComponent, title: "My Research" },
  { path: 'about', component: AboutComponent, title: "About" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
