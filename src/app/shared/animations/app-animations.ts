import {
  animate,
  keyframes,
  state,
  style,
  transition,
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

export const FlashMessageAnimation = trigger('flash', [
  transition(':enter', [
    animate(
      '500ms',
      keyframes([
        style({ opacity: 0, transform: 'translateY(-100%) translateX(-50%)' }),
        style({ opacity: 1, transform: 'translateY(15%) translateX(-50%)' }),
        style({ opacity: 1, transform: 'translateY(0) translateX(-50%)' }),
        style({ opacity: 1, transform: 'translateY(-15%) translateX(-50%)' }),
        style({ opacity: 1, transform: 'translateY(0) translateX(-50%)' }),
      ])
    ),
  ]),
]);
