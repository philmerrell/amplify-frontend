import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileType',
  standalone: true
})
export class FileTypePipe implements PipeTransform {

  transform(value: string): unknown {
    switch(value) {
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'Word'
      case 'application/json':
        return 'JSON'
      case 'application/pdf':
        return 'PDF'
      case 'image/jpeg':
        return 'Image'
      case 'image/png':
        return 'Image'
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'Excel'
      default: 
        return value;
    }
  }

}
