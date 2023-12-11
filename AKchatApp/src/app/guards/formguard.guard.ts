import { SafeData } from './save-data.interface';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogueComponent } from '../confirmdialogue/confirmdialogue.component';

@Injectable({
  providedIn: 'root',
})
export class FormGuardGuard implements CanDeactivate<SafeData> {
  constructor(private dialog: MatDialog) {}
  canDeactivate(
    component: SafeData
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!component.isDataSaved()) {
      const dialogRef = this.dialog.open(ConfirmdialogueComponent);
      return dialogRef.afterClosed();
    }
    return of(true);
  }
}