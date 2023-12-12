import { EnvironmentUrlService } from '../environment-url.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Collaborator } from 'src/app/interfaces/collaborator/collaborator.model';
import { CollaboratorForCreation } from 'src/app/interfaces/collaborator/collaborator-create.model';
import { CollaboratorForUpdate } from 'src/app/interfaces/collaborator/collaborator-update.model';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root',
})
export class CollaboratorRepositoryService {
  constructor(
    private http: HttpClient,
    private envUrl: EnvironmentUrlService,
    private repo: RepositoryService
  ) {}
  public getCollaborators = (route: string) => {
    return this.http.get<Collaborator[]>(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      {observe: 'response'}
    );
  };

  public getCollaborator = (route: string) => {
    return this.http.get<Collaborator>(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      
    );
  };

  public createCollaborator = (
    route: string,
    collaborator: CollaboratorForCreation
  ) => {
    return this.http.post<Collaborator>(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      collaborator,
      
    );
  };

  public updateCollaborator = (
    route: string,
    collaborator: CollaboratorForUpdate
  ) => {
    return this.http.put(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      collaborator,
      
    );
  };

  public deleteCollaborator = (route: string) => {
    return this.http.delete(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      
    );
  };
}
