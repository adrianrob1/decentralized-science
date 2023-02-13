import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MyPapersComponent } from './my-papers/my-papers.component';
import { AboutComponent } from './about/about.component';
import { PublishPaperComponent } from './publish-paper/publish-paper.component';
import { PublishReviewDialog } from './publish-review/publish-review.component';
import { PaperDetailComponent } from './paper-detail/paper-detail.component';
import { PaperCardComponent } from './shared/components/paper-card/paper-card.component';
import { FileUploadComponent } from './shared/components/file-upload/file-upload.component';

import { Web3Service } from './shared/services/web3.service';
import { IpfsService } from './shared/services/ipfs.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    MyPapersComponent,
    AboutComponent,
    PublishPaperComponent,
    PublishReviewDialog,
    PaperDetailComponent,
    PaperCardComponent,
    FileUploadComponent
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
    MatDividerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatChipsModule,
    PdfViewerModule,
    MatDialogModule,
    MatButtonToggleModule
  ],
  providers: [
    Web3Service,
    IpfsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

declare global {
  interface Window {
    web3?: any;
    ethereum?: any;
  }
}