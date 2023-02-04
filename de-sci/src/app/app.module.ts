import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './home/home.component';
import { MyPapersComponent } from './my-papers/my-papers.component';
import { AboutComponent } from './about/about.component';
import { PublishPaperComponent } from './publish-paper/publish-paper.component';
import { PublishReviewComponent } from './publish-review/publish-review.component';
import { PaperDetailComponent } from './paper-detail/paper-detail.component';
import { PaperCardComponent } from './shared/components/paper-card/paper-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    MyPapersComponent,
    AboutComponent,
    PublishPaperComponent,
    PublishReviewComponent,
    PaperDetailComponent,
    PaperCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
