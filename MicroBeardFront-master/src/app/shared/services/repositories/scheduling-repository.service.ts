import { EnvironmentUrlService } from '../environment-url.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Scheduling } from 'src/app/interfaces/scheduling/scheduling.model';
import { SchedulingForCreation } from 'src/app/interfaces/scheduling/scheduling-create.model';
import { SchedulingForUpdate } from 'src/app/interfaces/scheduling/scheduling-update.model';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root',
})
export class SchedulingRepositoryService {
  constructor(
    private http: HttpClient,
    private envUrl: EnvironmentUrlService,
    private repo: RepositoryService
  ) {}
  public getSchedulings = (route: string) => {
    return this.http.get<Scheduling[]>(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      {observe: 'response'}
    );
  };

  public getScheduling = (route: string) => {
    return this.http.get<Scheduling>(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      
    );
  };

  public createScheduling = (
    route: string,
    scheduling: SchedulingForCreation
  ) => {
    return this.http.post<Scheduling>(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      scheduling,
      
    );
  };

  public updateScheduling = (
    route: string,
    scheduling: SchedulingForUpdate
  ) => {
    return this.http.put(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      scheduling,
      
    );
  };

  public deleteScheduling = (route: string) => {
    return this.http.delete(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      
    );
  };
}
