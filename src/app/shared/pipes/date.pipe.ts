import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
})
export class DatePipe implements PipeTransform {
  transform(value: any): string {
    const dateObject = value.toDate();
    const day = dateObject.getDate();
    const month = dateObject.toLocaleString('default', {
      month: 'long',
    });
    const formatedDate = `${day} ${month}`;

    return formatedDate;
  }
}
