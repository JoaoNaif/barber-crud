import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class BarberAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Baber ${identifier} already exists.`);
  }
}
