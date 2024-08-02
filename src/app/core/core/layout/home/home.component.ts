import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from 'src/app/config/menu-items.config';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventBusService } from 'src/app/shared/event-bus.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly _baseRoute = '../auth/login';

  content?: string;
  mobileQuery!: MediaQueryList;
  private _mobileQueryListener!: () => void;

  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  refresh_token!: string;
  eventBusSub?: Subscription;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private userService: UserService,
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private router: Router,
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      //TODO: revisar este código
      // this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      // this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
    //TODO: revisar este código
    // this.userService.getPublicContent().subscribe({
    //   next: (data) => {
    //     this.content = data;
    //   },
    //   error: (err) => {
    //     if (err.error) {
    //       try {
    //         const res = JSON.parse(err.error);
    //         this.content = res.message;
    //       } catch {
    //         this.content = `Error with status: ${err.status} - ${err.statusText}`;
    //       }
    //     } else {
    //       this.content = `Error with status: ${err.status}`;
    //     }
    //   },
    // });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  ngAfterViewInit(): void {}

  logout(): void {
    this.refresh_token = this.storageService.getUser().refresh_token;

    this.authService.logout(this.refresh_token).subscribe({
      next: (res) => {
        //console.log(res);
        this.storageService.clean();
        this.router.navigate([this._baseRoute]).then((res) => {
          window.location.reload();
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
