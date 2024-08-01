import createTsMask from ".";
import { MaskType } from "../enums";
import { MaskOptions } from "../types";

describe("Mask Utils", () => {
  test("mask default", () => {
    const TsMask = createTsMask();
    const value = "ABC12345678";
    const maskedPlate = "ABC-1234";
    const unmaskedPlate = "ABC1234";

    expect(
      TsMask.mask(value, TsMask.getMask(value, MaskType.LICENSE_PLATE_BR))
    ).toStrictEqual({
      masked: maskedPlate,
      unmasked: unmaskedPlate,
    });
  });

  test("mask formated", () => {
    const TsMask = createTsMask();
    const value = "abc-1234";
    const maskedPlate = "ABC-1234";
    const unmaskedPlate = "ABC1234";

    expect(
      TsMask.mask(value, TsMask.getMask(value, MaskType.LICENSE_PLATE_BR))
    ).toStrictEqual({
      masked: maskedPlate,
      unmasked: unmaskedPlate,
    });
  });

  test("mask transform", () => {
    const TsMask = createTsMask();
    const value = "abc-1d34";
    const maskedPlate = "ABC-1D34";
    const unmaskedPlate = "ABC1D34";

    expect(
      TsMask.mask(value, TsMask.getMask(value, MaskType.LICENSE_PLATE_BR))
    ).toStrictEqual({
      masked: maskedPlate,
      unmasked: unmaskedPlate,
    });
  });

  test("mask validate", () => {
    const TsMask = createTsMask({
      rulesMask: new Map<string, MaskOptions>([
        [
          "9",
          {
            pattern: /\d/,
            validate: (value) => Number(value) < 1000,
          },
        ],
      ]),
    });
    const value = "1000";
    const maskedPlate = "100";
    const unmaskedPlate = "100";

    expect(TsMask.mask(value, "9999")).toStrictEqual({
      masked: maskedPlate,
      unmasked: unmaskedPlate,
    });
  });

  test("mask wrong char", () => {
    const TsMask = createTsMask();
    const value = "ABC";
    const maskedWrongValue = "";
    const unmaskedWrongValue = "";

    expect(TsMask.mask(value, "00/00/0000")).toStrictEqual({
      masked: maskedWrongValue,
      unmasked: unmaskedWrongValue,
    });
  });

  test("mask wrong char typing", () => {
    const TsMask = createTsMask();
    const value = "01A";
    const maskedWrongValue = "01/";
    const unmaskedWrongValue = "01";

    expect(TsMask.mask(value, "00/00/0000")).toStrictEqual({
      masked: maskedWrongValue,
      unmasked: unmaskedWrongValue,
    });
  });

  test("unmask phone", () => {
    const TsMask = createTsMask();
    const maskedPhone = "(82)3542-5482";
    const unmaskedPhone = "8235425482";

    expect(
      TsMask.unmask(maskedPhone, TsMask.getMask(maskedPhone, MaskType.PHONE_BR))
    ).toBe(unmaskedPhone);
  });

  test("unmask document", () => {
    const TsMask = createTsMask();
    const maskedDocument = "41.996.557/0001-01";
    const unmaskedDocument = "41996557000101";

    expect(
      TsMask.unmask(
        maskedDocument,
        TsMask.getMask(maskedDocument, MaskType.DOCUMENT_BR)
      )
    ).toBe(unmaskedDocument);
  });

  test("CPF mask", () => {
    const TsMask = createTsMask();
    const text = "3016079801999*";
    const maskedCpf = "301.607.980-19";
    const unmaskedCpf = "30160798019";

    expect(
      TsMask.mask(text, TsMask.getMask(unmaskedCpf, MaskType.DOCUMENT_BR))
    ).toStrictEqual({
      masked: maskedCpf,
      unmasked: unmaskedCpf,
    });
  });

  test("CNPJ mask", () => {
    const TsMask = createTsMask();
    const text = "4199655700010199";
    const maskedCnpj = "41.996.557/0001-01";
    const unmaskedCnpj = "41996557000101";

    expect(
      TsMask.mask(text, TsMask.getMask(unmaskedCnpj, MaskType.DOCUMENT_BR))
    ).toStrictEqual({
      masked: maskedCnpj,
      unmasked: unmaskedCnpj,
    });
  });
});

describe("Mask Money Utils", () => {
  test("mask money", () => {
    const TsMask = createTsMask();
    const value = "123456789";
    const masked = "1.234.567,89";
    const unmasked = "1234567.89";

    expect(TsMask.maskMoney(value)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("mask money wrong value", () => {
    const TsMask = createTsMask();
    const value = "ABC";
    const masked = "0,00";
    const unmasked = "0.00";

    expect(TsMask.maskMoney(value)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("unmask money", () => {
    const TsMask = createTsMask();
    const masked = "1.234.567,89";
    const unmasked = "1234567.89";

    expect(TsMask.unmaskMoney(masked)).toBe(unmasked);
  });

  test("mask money integer", () => {
    const TsMask = createTsMask({
      rulesMoney: {
        thousands: " ",
        decimal: ",",
        precision: 0,
        prefix: "R$ ",
        suffix: " *",
      },
    });
    const value = "123456789";
    const masked = "R$ 123 456 789 *";
    const unmasked = "123456789";

    expect(TsMask.maskMoney(value)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("unmask money integer", () => {
    const TsMask = createTsMask({
      rulesMoney: {
        thousands: " ",
        decimal: ",",
        precision: 0,
        prefix: "R$ ",
        suffix: " *",
      },
    });
    const masked = "R$ 123 456 789 *";
    const unmasked = "123456789";

    expect(TsMask.unmaskMoney(masked)).toBe(unmasked);
  });

  test("mask money decimal", () => {
    const TsMask = createTsMask({
      rulesMoney: {
        thousands: " ",
        decimal: ".",
        precision: 5,
        prefix: "R$ ",
        suffix: " *",
      },
    });
    const text = "123456789";
    const masked = "R$ 1 234.56789 *";
    const unmasked = "1234.56789";

    expect(TsMask.maskMoney(text)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("unmask money decimal", () => {
    const TsMask = createTsMask({
      rulesMoney: {
        thousands: " ",
        decimal: ",",
        precision: 3,
        prefix: "R$ ",
        suffix: " *",
      },
    });
    const masked = "R$ 1 234,567 *";
    const unmasked = "1234.567";

    expect(TsMask.unmaskMoney(masked)).toBe(unmasked);
  });
});
