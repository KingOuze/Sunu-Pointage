import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone:true,
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, key: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();
    return items.filter(item => 
      item[key]?.toString().toLowerCase().includes(searchText)
    );
  }
}
