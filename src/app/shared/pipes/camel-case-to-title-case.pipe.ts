import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToTitleCase',
})
export class CamelCaseToTitleCasePipe implements PipeTransform {
  transform(value: string): string {
    const words = value.split(/(?=[A-Z])/);
    const titleCaseWords = words.map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word.toLowerCase();
      }
    });
    const titleCaseString = titleCaseWords.join(' ');

    return titleCaseString;
  }
}
