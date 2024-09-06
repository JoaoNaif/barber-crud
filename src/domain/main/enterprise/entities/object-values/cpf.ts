export class Cpf {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    return new Cpf(value);
  }

  static createFromText(text: string): Cpf {
    const cleanedText = text.replace(/\D/g, '');

    if (cleanedText.length !== 11) {
      throw new Error('CPF deve ter exatamente 11 dígitos.');
    }

    const cpfText = `${cleanedText.slice(0, 3)}.${cleanedText.slice(3, 6)}.${cleanedText.slice(6, 9)}-${cleanedText.slice(9, 11)}`;

    return new Cpf(cpfText);
  }
}
