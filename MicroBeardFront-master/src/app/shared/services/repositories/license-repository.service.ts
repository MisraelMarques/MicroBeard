import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from '../environment-url.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { License } from 'src/app/interfaces/license/license.model';
import { LicenseForCreation } from 'src/app/interfaces/license/license-create.model';
import { LicenseForUpdate } from 'src/app/interfaces/license/license-update.model';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root',
})
export class LicenseRepositoryService {
  constructor(
    private http: HttpClient,
    private envUrl: EnvironmentUrlService,
    private repo: RepositoryService
  ) {}

  public getLicenses = (route: string) => {
    return this.http.get<License[]>(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      {observe: 'response'}
    );
  };

  public getLicense = (route: string) => {
    return this.http.get<License>(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      
    );
  };
}
