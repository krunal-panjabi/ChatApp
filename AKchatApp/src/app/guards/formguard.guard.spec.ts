import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { formguardGuard } from './formguard.guard';

describe('formguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => formguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
