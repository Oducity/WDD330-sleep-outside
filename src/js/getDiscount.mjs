export function getDiscount(price) {
    const xmasPerc = 3 / 100;
    const easterPerc = 2 / 100;
    const date = new Date();
    const value = 1;
    const month = date.toLocaleString("default", { month: "long" });
    if (month === "March" && price >= 170) {
        value = price * xmasPerc;
    } else if (month === "April" && price >= 170) {
      value = price * easterPerc;
    } else {
      value;
    }
    return value

}