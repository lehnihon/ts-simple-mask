import { MaskOptions } from "ts-simple-mask";
import createTsMask from ".";
import { MaskType } from "../enums";

describe("Mask Utils", () => {
  test("default", () => {
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

  test("transform", () => {
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

  test("before mask", () => {
    const TsMask = createTsMask({
      rulesMask: {
        map: new Map<string, MaskOptions>([["#", { pattern: /[A-Za-z]/ }]]),
        beforeMask: (value) => value + "g",
      },
    });
    const value = "abcdef";
    const maskedPlate = "abc-defg";
    const unmaskedPlate = "abcdefg";

    expect(TsMask.mask(value, "###-####")).toStrictEqual({
      masked: maskedPlate,
      unmasked: unmaskedPlate,
    });
  });

  test("after mask", () => {
    const TsMask = createTsMask({
      rulesMask: {
        map: new Map<string, MaskOptions>([["#", { pattern: /[A-Za-z]/ }]]),
        afterMask: (value) => value + "g",
      },
    });
    const value = "abcdef";
    const maskedPlate = "abc-defg";
    const unmaskedPlate = "abcdefg";

    expect(TsMask.mask(value, "###-###")).toStrictEqual({
      masked: maskedPlate,
      unmasked: unmaskedPlate,
    });
  });

  test("wrong char", () => {
    const TsMask = createTsMask();
    const value = "ABC";
    const maskedWrongValue = "";
    const unmaskedWrongValue = "";

    expect(TsMask.mask(value, "00/00/0000")).toStrictEqual({
      masked: maskedWrongValue,
      unmasked: unmaskedWrongValue,
    });
  });

  test("wrong char typing", () => {
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

    expect(TsMask.unmask(maskedPhone)).toBe(unmaskedPhone);
  });

  test("unmask document", () => {
    const TsMask = createTsMask();
    const maskedDocument = "41.996.557/0001-01";
    const unmaskedDocument = "41996557000101";

    expect(TsMask.unmask(maskedDocument)).toBe(unmaskedDocument);
  });

  test("CPF", () => {
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

  test("CNPJ", () => {
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

  test("get placeholder", () => {
    const TsMask = createTsMask();
    const placeholder = "__-__-____";

    expect(TsMask.getPlaceholder("SS-SS-SSSS")).toBe(placeholder);
  });
});

describe("Mask Money Utils", () => {
  test("default", () => {
    const TsMask = createTsMask();
    const value = "123456789";
    const masked = "1.234.567,89";
    const unmasked = "1234567.89";

    expect(TsMask.maskMoney(value)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("wrong value", () => {
    const TsMask = createTsMask();
    const value = "ABC";
    const masked = "0,00";
    const unmasked = "0.00";

    expect(TsMask.maskMoney(value)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("unmask", () => {
    const TsMask = createTsMask();
    const masked = "1.234.567,89";
    const unmasked = "1234567.89";

    expect(TsMask.unmaskMoney(masked)).toBe(unmasked);
  });

  test("negative", () => {
    const TsMask = createTsMask({
      rulesMoney: {
        thousands: ".",
        decimal: ",",
        precision: 2,
        allowNegative: true,
      },
    });
    const value = "-123456";
    const masked = "-1.234,56";
    const unmasked = "1234.56";

    expect(TsMask.maskMoney(value)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("negative to positive", () => {
    const TsMask = createTsMask({
      rulesMoney: {
        thousands: ".",
        decimal: ",",
        precision: 2,
        allowNegative: true,
      },
    });
    const value = "-123456-";
    const masked = "1.234,56";
    const unmasked = "1234.56";

    expect(TsMask.maskMoney(value)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("negative plus sign", () => {
    const TsMask = createTsMask({
      rulesMoney: {
        thousands: ".",
        decimal: ",",
        precision: 2,
        allowNegative: true,
      },
    });
    const value = "-123456+";
    const masked = "1.234,56";
    const unmasked = "1234.56";

    expect(TsMask.maskMoney(value)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("money before", () => {
    const TsMask = createTsMask({
      rulesMoney: {
        thousands: ".",
        decimal: ",",
        precision: 2,
        beforeMask: (value) => value + 5,
      },
    });
    const value = "123456";
    const masked = "1.239,56";
    const unmasked = "1239.56";

    expect(TsMask.maskMoney(value)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("money after", () => {
    const TsMask = createTsMask({
      rulesMoney: {
        thousands: ".",
        decimal: ",",
        precision: 2,
        afterMask: (value) => "R$" + value,
      },
    });
    const value = "123456";
    const masked = "R$1.234,56";
    const unmasked = "1234.56";

    expect(TsMask.maskMoney(value)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("money integer", () => {
    const TsMask = createTsMask({
      rulesMoney: {
        thousands: " ",
        decimal: ",",
        precision: 0,
      },
    });
    const value = "123456789";
    const masked = "123 456 789";
    const unmasked = "123456789";

    expect(TsMask.maskMoney(value)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("unmask integer", () => {
    const TsMask = createTsMask({
      rulesMoney: {
        thousands: " ",
        decimal: ",",
        precision: 0,
      },
    });
    const masked = "123 456 789";
    const unmasked = "123456789";

    expect(TsMask.unmaskMoney(masked)).toBe(unmasked);
  });

  test("decimal", () => {
    const TsMask = createTsMask({
      rulesMoney: {
        thousands: " ",
        decimal: ".",
        precision: 5,
      },
    });
    const text = "123456789";
    const masked = "1 234.56789";
    const unmasked = "1234.56789";

    expect(TsMask.maskMoney(text)).toStrictEqual({
      masked,
      unmasked,
    });
  });

  test("unmask decimal", () => {
    const TsMask = createTsMask({
      rulesMoney: {
        thousands: " ",
        decimal: ",",
        precision: 3,
      },
    });
    const masked = "1 234,567";
    const unmasked = "1234.567";

    expect(TsMask.unmaskMoney(masked)).toBe(unmasked);
  });
});
