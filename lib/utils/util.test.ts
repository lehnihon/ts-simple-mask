import { getMask, mask, maskMoney, unmask, unmaskMoney } from ".";
import { MaskType } from "../enums";

describe("Mask Utils", () => {
  test("mask default", () => {
    const value = "ABC12345678";
    const unmaskedPlate = "ABC1234";
    const maskedPlate = "ABC-1234";
    expect(
      mask(value, getMask(value, MaskType.LICENSE_PLATE_BR))
    ).toStrictEqual({
      masked: maskedPlate,
      unmasked: unmaskedPlate,
    });
  });

  test("mask formated", () => {
    const value = "ABC-123456";
    const unmaskedPlate = "ABC1234";
    const maskedPlate = "ABC-1234";
    expect(
      mask(value, getMask(value, MaskType.LICENSE_PLATE_BR))
    ).toStrictEqual({
      masked: maskedPlate,
      unmasked: unmaskedPlate,
    });
  });

  test("unmask phone", () => {
    const maskedPhone = "(82)3542-5482";
    const unmaskedPhone = "8235425482";

    expect(unmask(maskedPhone, getMask(maskedPhone, MaskType.PHONE_BR))).toBe(
      unmaskedPhone
    );
  });

  test("unmask document", () => {
    const maskedDocument = "41.996.557/0001-01";
    const unmaskedDocument = "41996557000101";

    expect(
      unmask(maskedDocument, getMask(maskedDocument, MaskType.DOCUMENT_BR))
    ).toBe(unmaskedDocument);
  });

  test("CPF mask", () => {
    const text = "3016079801999*";
    const unmaskedCpf = "30160798019";
    const maskedCpf = "301.607.980-19";
    expect(
      mask(text, getMask(unmaskedCpf, MaskType.DOCUMENT_BR))
    ).toStrictEqual({
      masked: maskedCpf,
      unmasked: unmaskedCpf,
    });
  });

  test("CNPJ mask", () => {
    const text = "4199655700010199";
    const unmaskedCnpj = "41996557000101";
    const maskedCnpj = "41.996.557/0001-01";
    expect(
      mask(text, getMask(unmaskedCnpj, MaskType.DOCUMENT_BR))
    ).toStrictEqual({
      masked: maskedCnpj,
      unmasked: unmaskedCnpj,
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
    const masked = "R$ 123 456 789 *";
    const RULES = {
      thousands: " ",
      decimal: ",",
      precision: 0,
      prefix: "R$ ",
      suffix: " *",
    };
    expect(maskMoney(value, RULES)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("unmask money integer", () => {
    const masked = "R$ 123 456 789 *";
    const unmasked = "123456789";
    const RULES = {
      thousands: " ",
      decimal: ",",
      precision: 0,
      prefix: "R$ ",
      suffix: " *",
    };
    expect(unmaskMoney(masked, RULES)).toBe(unmasked);
  });

  test("mask money decimal", () => {
    const text = "123456789";
    const masked = "R$ 1 234.56789 *";
    const unmasked = "1234.56789";
    const RULES = {
      thousands: " ",
      decimal: ".",
      precision: 5,
      prefix: "R$ ",
      suffix: " *",
    };
    expect(maskMoney(text, RULES)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("unmask money decimal", () => {
    const masked = "R$ 1 234,567 *";
    const unmasked = "1234.567";
    const RULES = {
      thousands: " ",
      decimal: ",",
      precision: 3,
      prefix: "R$ ",
      suffix: " *",
    };
    expect(unmaskMoney(masked, RULES)).toBe(unmasked);
  });
});
