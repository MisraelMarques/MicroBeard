import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfcnpj'
})
export class CpfCnpjPipe implements PipeTransform {
  transform(value: string, zenkaku: boolean = true): string {
    if (!value && value == null &&value.length < 10) {
      return value;
    }
    else if(value.length < 12){
      return `${value.substring(0,3)}.${value.substring(3, 6)}.${value.substring(6, 9)}-${value.substring(9,11)}`
    }else{
      return `${value.substring(0,2)}.${value.substring(2, 5)}.${value.substring(5, 8)}/${value.substring(8, 12)}-${value.substring(12, 14)}`
    }
  }
}