import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ContactComponent } from '../contact/contact.component';
import { ServiceComponent } from '../service/service.component';
import { AboutComponent } from '../about/about.component';
import { BannerComponent } from '../banner/banner.component';
import { PostDisplayComponent } from '../../posts/posts.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,RouterOutlet,RouterLink, AboutComponent,BannerComponent, ServiceComponent, ContactComponent,PostDisplayComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
