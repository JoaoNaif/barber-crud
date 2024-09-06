import { describe, it, expect } from 'vitest';
import { Cpf } from './cpf';

describe('Cpf', () => {
  it('must correctly format an 11-digit CPF', () => {
    const cpf = Cpf.createFromText('12345678909');

    expect(cpf.value).toBe('123.456.789-09');
  });

  it('should throw an error if the CPF does not have 11 digits', () => {
    expect(() => Cpf.createFromText('123456789')).toThrow(
      'CPF deve ter exatamente 11 dígitos.'
    );
  });

  it('should only accept numbers and ignore non-numeric characters', () => {
    const cpf = Cpf.createFromText('123.456.789-09');

    expect(cpf.value).toBe('123.456.789-09');
  });

  it('must ensure that the formatted CPF has only numbers, dots and dashes', () => {
    const cpf = Cpf.createFromText('12345678909');
    const onlyNumbersAndFormat = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    expect(cpf.value).toMatch(onlyNumbersAndFormat);
  });
});
