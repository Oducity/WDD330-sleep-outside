export function getDiscount(price) {
  const xmasPerc = 3 / 100;
  const easterPerc = 2 / 100;
  const date = new Date();
  let value = 1;
  const monthIndex = date.getMonth(); // 0 = January, 1 = February, 2 = March, 3 = April, ...

  if (monthIndex === 2 && price >= 170) {
    value = price * xmasPerc;
  } else if (monthIndex === 3 && price >= 170) {
    value = price * easterPerc;
  }

  return value;
}
