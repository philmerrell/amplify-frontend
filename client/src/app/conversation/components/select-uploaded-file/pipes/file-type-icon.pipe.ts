import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileTypeIcon',
  standalone: true
})
export class FileTypeIconPipe implements PipeTransform {

  transform(value: string | undefined): unknown {
    switch(value) {
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'document-outline'
      case 'application/json':
        return 'reader-outline'
      case 'application/pdf':
        return 'document-outline'
      case 'image/jpeg':
        return 'image-outline'
      case 'image/png':
        return 'image-outline'
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'list-outline'
      default: 
        return value;
    }
  }

}
