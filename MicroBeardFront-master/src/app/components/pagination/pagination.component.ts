import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { IPagination } from 'src/app/interfaces/query-string/pagination';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Output("getAll") getAll: EventEmitter<any> = new EventEmitter();
  @Input() Pagination: IPagination;
  totalPages: any[] = [];
  maxSize = 2
  constructor() { }

  ngOnInit(): void {
    this.totalPages = new Array(this.Pagination.TotalPages);
  }

  ngOnChanges() {
    this.totalPages = new Array(this.Pagination.TotalPages);
  }

  changePageNumber(pageNumber: number) {
    console.log("page number", pageNumber)
    this.Pagination.CurrentPage = pageNumber;
    this.getAll.emit();
  }

  next() {
    const nextPage = this.Pagination.CurrentPage + 1;

    if(this.Pagination.HasNext){
      this.changePageNumber(nextPage);
    } 
  }

  previous() {
    const previousPage = this.Pagination.CurrentPage - 1;

    if(this.Pagination.HasPrevious){
      this.changePageNumber(previousPage);
    } 
  }

}
