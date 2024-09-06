type Difficulty = 'easy' | 'intermediary' | 'hard';

export function setTimeBasedOnDifficulty(difficulty: Difficulty): Date {
  const time = new Date();

  switch (difficulty) {
    case 'easy':
      time.setMinutes(time.getMinutes() + 30);
      break;
    case 'intermediary':
      time.setHours(time.getHours() + 1);
      break;
    case 'hard':
      time.setHours(time.getHours() + 2);
      break;
    default:
      throw new Error('Invalid difficulty level');
  }

  return time;
}
