import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { GeneralModule } from './modules/general.model';


@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterOutlet, GeneralModule, SidenavComponent, HeaderComponent],
  templateUrl: './app.component.html', styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

}
