import {
  transition,
  animate,
  keyframes,
  style,
  state,
  trigger,
} from '@angular/animations';

export const FilterBlockAnimation = trigger('fade', [
  transition(':enter', [
    animate(
      '180ms',
      keyframes([
        style({ opacity: 0, height: 0 }),
        style({ opacity: 1, height: '*' }),
      ])
    ),
  ]),
  transition(':leave', [animate('200ms', style({ opacity: 0, height: 0 }))]),
]);

export const ArrowRotateAnimation = trigger('openClose', [
  state('open', style({ rotate: '180deg' })),
  transition('open => close', [animate('0.25s')]),
  transition('close => open', [animate('0.25s')]),
]);
