import { Barber } from '@/domain/main/enterprise/entities/barber';

export function setPriceBasedOnOrder(
  hair: boolean,
  eyebrow: boolean,
  beard: boolean,
  barber: Barber,
  difficulty: 'easy' | 'intermediary' | 'hard'
): number {
  let price: number = 0;

  if (hair) {
    price += barber.hairPrice;
  }

  if (eyebrow) {
    price += barber.eyebrowPrice;
  }

  if (beard) {
    price += barber.beardPrice;
  }

  if (difficulty === 'hard') {
    price *= 2;
  }

  if (difficulty === 'intermediary') {
    price *= 1.5;
  }

  return price;
}
