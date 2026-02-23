import { Component } from '@angular/core';
import { SharedService } from '../../../core/services/shared.service';
import { Router } from '@angular/router';
import { E_STORAGE } from '../../../core/enums/storage.enum';
import { ConfirmationService } from '../../../core/services/confirmation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  loggedInUser: any;


  constructor(private sharedService: SharedService, private router: Router, private confirmationService: ConfirmationService) {
    this.loggedInUser = this.sharedService.getUser();
  }

  ngOnInit() {
    this.loggedInUser = this.sharedService.getUser();
  }

  async logout() {
    const confirmed = await this.confirmationService.confirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      this.sharedService.clearUser();
      this.loggedInUser = false;
      this.router.navigate(['/login']);
    }
  }
}
