// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { ToasterComponent } from './shared/components/toaster/toaster.component';
import { SharedService } from './core/services/shared.service';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToasterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  showHeader$!: Observable<boolean>;

  constructor(
    private sharedService: SharedService,
    private router: Router
  ) {
    this.showHeader$ = combineLatest([
      this.sharedService.isLoggedIn$,
      this.router.events.pipe(map(() => this.router.url))
    ]).pipe(
      map(([isLoggedIn, url]) => {
        return isLoggedIn && url !== '/login';
      })
    );
  }
}
