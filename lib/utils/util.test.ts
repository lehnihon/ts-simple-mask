import { getMask, mask, maskMoney, unmask, unmaskMoney } from ".";
import { MaskType } from "../enums";

describe("Mask Utils", () => {
  test("mask", () => {
    const unmaskedPlate = "ABC1234";
    const maskedPlate = "ABC-1234";
    expect(
      mask(unmaskedPlate, getMask(unmaskedPlate, MaskType.LICENSE_PLATE_BR))
    ).toStrictEqual({
      masked: maskedPlate,
      unmasked: unmaskedPlate,
    });
  });

  test("unmask", () => {
    const unmaskedPhone = "8235425482";
    const maskedPhone = "(82)3542-5482";
    expect(unmask(maskedPhone)).toBe(unmaskedPhone);
  });

  test("CPF mask", () => {
    const unmaskedCpf = "30160798019";
    const maskedCpf = "301.607.980-19";
    expect(
      mask(unmaskedCpf, getMask(unmaskedCpf, MaskType.DOCUMENT_BR))
    ).toStrictEqual({
      masked: maskedCpf,
      unmasked: unmaskedCpf,
    });
  });

  test("CNPJ mask", () => {
    const unmaskedCpf = "41996557000101";
    const maskedCpf = "41.996.557/0001-01";
    expect(
      mask(unmaskedCpf, getMask(unmaskedCpf, MaskType.DOCUMENT_BR))
    ).toStrictEqual({
      masked: maskedCpf,
      unmasked: unmaskedCpf,
    });
  });
});

describe("Mask Money Utils", () => {
  test("mask money", () => {
    const value = "123456789";
    const unmasked = "1234567.89";
    const masked = "1.234.567,89";
    expect(maskMoney(value)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("unmask money", () => {
    const unmasked = "1234567.89";
    const masked = "1.234.567,89";
    expect(unmaskMoney(masked)).toBe(unmasked);
  });

  test("mask money integer", () => {
    const value = "123456789";
    const unmasked = "123456789";
    const masked = "123 456 789";
    const RULES = { thousands: " ", decimal: ",", precision: 0 };
    expect(maskMoney(value, RULES)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("unmask money integer", () => {
    const unmasked = "123456789";
    const masked = "123 456 789";
    const RULES = { thousands: " ", decimal: ",", precision: 0 };
    expect(unmaskMoney(masked, RULES)).toBe(unmasked);
  });

  test("mask money decimal", () => {
    const unmasked = "0.12";
    const masked = "0,12";
    expect(maskMoney(unmasked)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("unmask money decimal", () => {
    const unmasked = "0.12";
    const masked = "0,12";
    expect(unmaskMoney(masked)).toBe(unmasked);
  });
});
