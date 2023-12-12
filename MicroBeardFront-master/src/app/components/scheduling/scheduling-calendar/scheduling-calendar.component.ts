import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, AfterViewInit, } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours,} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView,} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { Options } from '@popperjs/core/lib/modifiers/computeStyles';
import { SchedulingRepositoryService } from 'src/app/shared/services/repositories/scheduling-repository.service';
import { Scheduling } from 'src/app/interfaces/scheduling/scheduling.model';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SchedulingForUpdate } from 'src/app/interfaces/scheduling/scheduling-update.model';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { Order } from 'src/app/enums/order-enum';
import { SchedulingOrder } from 'src/app/interfaces/scheduling/scheduling-order';
import { SchedulingSearch } from 'src/app/interfaces/scheduling/scheduling-search';
import { IQueryString } from 'src/app/interfaces/query-string/query-string';
import { IPagination } from 'src/app/interfaces/query-string/pagination';
import { ISearchType } from 'src/app/interfaces/query-string/search';
import { QueryStringHelper } from 'src/app/shared/helpers/query-string-helper';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'scheduling-calendar-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }

      i {
        margin-right: 5px;
      }
    `,
  ],
  templateUrl: './scheduling-calendar.component.html',
})
export class SchedulingCalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;
  viewDate: Date = new Date();
  errorMessage: string = '';
  events: CalendarEvent[] = [];
  refresh = new Subject<void>();
  activeDayIsOpen: boolean = true;
  bsModalRef?: BsModalRef;

  queryString: IQueryString<SchedulingSearch, SchedulingOrder> = {
    Search: {
      Code: {
        SearchValue: null,
        DisplayValue: "Código",
        ValueType: ISearchType.number,
      },
      ServiceCode: {
        SearchValue: null,
        DisplayValue: "Código do Serviço",
        ValueType: ISearchType.number,
      },
      CollaboratorCode: {
        SearchValue: null,
        DisplayValue: "Código do Colaborador",
        ValueType: ISearchType.number,
      },
      LicenseCode: {
        SearchValue: null,
        DisplayValue: "Código da Habilitação",
        ValueType: ISearchType.number,
      },
      ContactCode: {
        SearchValue: null,
        DisplayValue: "Código do Cliente",
        ValueType: ISearchType.number,
      },
      DateDay: {
        SearchValue: null,
        DisplayValue: "Dia",
        ValueType: ISearchType.number,
      },
      DateMonth: {
        SearchValue: null,
        DisplayValue: "Mês",
        ValueType: ISearchType.number,
      },
      DateYear: {
        SearchValue: null,
        DisplayValue: "Ano",
        ValueType: ISearchType.number,
      },
    },
    Ordination: {
      Code: {
        Order: Order.none,
        OrderName: 'Code'
      },
      ServiceCode: {
          Order: Order.none,
          OrderName: 'ServiceCode'
      },
      CollaboratorCode: {
          Order: Order.none,
          OrderName: 'CollaboratorCode'
      },
      LicenseCode: {
          Order: Order.none,
          OrderName: 'LicenseCode'
      },
      ContactCode: {
          Order: Order.none,
          OrderName: 'ContactCode'
      },
      DateDay: {
          Order: Order.none,
          OrderName: 'DateDay'
      },
      DateMonth: {
          Order: Order.none,
          OrderName: 'DateMonth'
      },
      DateYear: {
          Order: Order.none,
          OrderName: 'DateYear'
      }
    },
    Pagination: {
      TotalCount: null,
      CurrentPage: 1,
      PageSize: 100,
      TotalPages: null,
      HasNext: null,
      HasPrevious: null
    }
  }

  constructor(private modal: NgbModal,
                private repository: SchedulingRepositoryService,
                private errorHandler: ErrorHandlerService,
                private queryStringService: QueryStringHelper<SchedulingSearch, SchedulingOrder>,
                private router: Router,
                private datePipe: DatePipe,
                private modalService: BsModalService) {}

  ngOnInit(): void {
    this.getAllSchedulings();    
    var queryStrings = this.router.url.split('?')[1]
    if(queryStrings != undefined){
      var queryIndex = queryStrings.indexOf("view")+5
      var view = queryStrings.substring(queryIndex, queryStrings.length)
      view = view .charAt(0).toUpperCase() + view.slice(1)
      var calendarView = CalendarView[view]
      this.setView(calendarView)  
    }
  }

  ngAfterViewInit(): void {
    this.refreshView();                                                                             
  }

  ngAfterViewChecked(): void {
    this.refreshView(); 
  }

  protected getAllSchedulings = () => {
    const apiAddress: string = 'Scheduling' + this.queryStringService.writeQueryStrings(this.queryString);
    this.repository.getSchedulings(apiAddress)
    .subscribe({
      next: (response: HttpResponse<Scheduling[]>) => {
        this.events = [];

        response.body.forEach(scheduling => {
          this.addEvent(scheduling);
        });
        this.queryString.Pagination = JSON.parse(response.headers.get('X-Pagination')) as IPagination
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

  addEvent(scheduling: Scheduling): void {
    this.events = [
      ...this.events,
      {
        code: scheduling.code,
        title: scheduling.title,
        start: new Date(scheduling.date+'-00:00'),
        end: new Date(scheduling.endDate+'-00:00'),
        cancelled: scheduling.cancelled,
        color: scheduling.cancelled ? colors.red: colors.blue,
        contactCode: scheduling.contactCode,
        licenseCode: scheduling.licenseCode,
        actions: this.actions,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  actions: CalendarEventAction[] = [
    {
      label: '<i class="bi bi-pencil-square"></i>',
      a11yLabel: 'Atualizar',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="bi bi-trash-fill"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
 
  handleEvent(action: string, event: CalendarEvent): void {
    switch(action){
      case 'Clicked':{
        this.router.navigate([`/scheduling/details/${event.code}`])
        break;
      }
      case 'Edited':{
        this.router.navigate([`/scheduling/update/${event.code}`])
        break;
      }
      case 'Deleted':{
        this.router.navigate([`/scheduling/delete/${event.code}`])
        break;
      }
      case 'Dropped or resized':{
        let schedulingForUpdate = this.mapToScheduling(event)
        const apiUri: string = `Scheduling/${event.code}`;

        this.repository.updateScheduling(apiUri, schedulingForUpdate)
        .subscribe({
          next: (_) => {
            const config: ModalOptions = {
              initialState: {
                modalHeaderText: 'Mensagem de sucesso',
                modalBodyText: 'Agendamento atualizado com sucesso',
                okButtonText: 'OK'
              }
            };

            this.bsModalRef = this.modalService.show(SuccessModalComponent, config);
          },
          error: (err) => {
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/scheduling/calendar'], {queryParams: {view: `${this.view}`}});
            }); 
            this.refreshView();
            this.errorHandler.handleError(err)
          }
        })
        break;
      }
    }
  }

  mapToScheduling(event): SchedulingForUpdate{
    
    return {
      title: event.title,
      licenseCode: event.licenseCode,
      contactCode: event.contactCode,
      date: event.start,
      endDate: event.end,
      cancelled: event.cancelled ? event.cancelled : false,
    }
  }

  modalData: {
    action: string;
    event: CalendarEvent;
  };


  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
          
        };
      }
      return iEvent;
    });
    event.start = newStart,
    event.end = newEnd
    this.handleEvent('Dropped or resized', event);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  refreshView(): void{
    this.refresh.next()
  }
}
