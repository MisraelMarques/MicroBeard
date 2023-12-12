import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule  } from '@angular/forms';
import { ISearch, ISearchType } from 'src/app/interfaces/query-string/search';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Output("getAll") getAll: EventEmitter<any> = new EventEmitter();
  @Input() Search: ISearch;

  currentSearchValue: string = "Code";
  searchForm: FormGroup

  constructor() { }

  ngOnInit(): void {
    console.log(this.Search)
    this.searchForm = new FormGroup({
      search: new FormControl('', [])
    })

    this.searchForm.get("search").valueChanges.subscribe(x => {
      if(x === null || x === undefined || x === ''){
        this.executeSearch()
      }
   }
   )
  }

  executeSearch() {
    Object.entries(this.Search).forEach(([key, value]) => {
      value.SearchValue = null;
    })
    var searchValue = this.searchForm.get("search").value;
    this.Search[this.currentSearchValue].SearchValue = searchValue;

    if(this.Search[this.currentSearchValue].ValueType == ISearchType.number) {
      var parsed = parseInt(searchValue.replace(/\D/g,''))
      if(!Number.isNaN(parsed)) {
        this.Search[this.currentSearchValue].SearchValue = parsed;
        this.searchForm.get("search").setValue(parsed.toString())
      }
      else{
        if(searchValue !== null && searchValue !== undefined && searchValue !== ''){
          alert(`O valor pesquisado deve ser um número válido para a propriedade ${this.Search[this.currentSearchValue].DisplayValue}.`)
          return;
        }
      }
    }
    this.getAll.emit()
  }

  updateDropDownName(key: string) {
    this.currentSearchValue = key;
    this.executeSearch()
  }
}
