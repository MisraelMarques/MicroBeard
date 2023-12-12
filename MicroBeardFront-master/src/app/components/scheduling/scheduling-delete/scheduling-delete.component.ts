import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { Scheduling } from 'src/app/interfaces/scheduling/scheduling.model';
import { SchedulingRepositoryService } from 'src/app/shared/services/repositories/scheduling-repository.service';

@Component({
  selector: 'app-scheduling-delete',
  templateUrl: './scheduling-delete.component.html',
  styleUrls: ['./scheduling-delete.component.css']
})
export class SchedulingDeleteComponent implements OnInit {

  scheduling: Scheduling;
  bsModalRef?: BsModalRef;

  constructor(private repository: SchedulingRepositoryService,
              private errorHandler: ErrorHandlerService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private modal: BsModalService) { }

  ngOnInit(): void {
    this.getSchedulingByCode();
  }

  private getSchedulingByCode = () => {
    const schedulingCode: string = this.activeRoute.snapshot.params['code'];
    const apiUrl: string = `Scheduling/${schedulingCode}`;

    this.repository.getScheduling(apiUrl)
    .subscribe({
      next: (colab: Scheduling) => this.scheduling = colab,
      error: (err: HttpErrorResponse) => this.errorHandler.handleError(err)
    })
  }

  redirectToSchedulingList = () => {
    this.router.navigate(['/scheduling/calendar']);
  }

  deleteScheduling = () => {
    const deleteUri: string = `Scheduling/${this.scheduling.code}`;

    this.repository.deleteScheduling(deleteUri)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Mensagem de sucesso',
            modalBodyText: 'Agendamento excluído com sucesso',
            okButtonText: 'OK'
          }
        };

        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToSchedulingList());
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleError(err)
    })
  }

}
