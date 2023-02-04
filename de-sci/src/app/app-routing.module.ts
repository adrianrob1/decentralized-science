import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyPapersComponent } from './my-papers/my-papers.component';
import { AboutComponent } from './about/about.component';
import { PaperDetailComponent } from './paper-detail/paper-detail.component';
import { PublishPaperComponent } from './publish-paper/publish-paper.component';

const routes: Routes = [
  { path: 'my-papers', component: MyPapersComponent, title: "My Research" },
  { path: 'about', component: AboutComponent, title: "About" },
  { path: 'paper/:id', component: PaperDetailComponent, title: "Paper Detail" },
  { path: 'publish', component: PublishPaperComponent, title: "Publish Paper" },
  { path: '**', component: HomeComponent, title: "Home" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
