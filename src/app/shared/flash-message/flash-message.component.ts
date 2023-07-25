import { Component, Input } from '@angular/core';
import { FlashMessageAnimation } from '../animations/app-animations';

@Component({
  selector: 'app-flash-message',
  templateUrl: './flash-message.component.html',
  styleUrls: ['./flash-message.component.scss'],
  animations: [FlashMessageAnimation],
})
export class FlashMessageComponent {
  @Input() messageText: string;
  @Input() messageType: string;
}
