import { TestBed, inject } from '@angular/core/testing';

import { TopBarService } from './top-bar.service';

describe('TopBarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopBarService]
    });
  });

  it('should be created', inject([TopBarService], (service: TopBarService) => {
    expect(service).toBeTruthy();
  }));
});
