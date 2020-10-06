export const find = (selector: string): HTMLElement => {
  const $elem = document.querySelector(selector);
  if ($elem instanceof HTMLElement) {
    return $elem;
  } else {
    throw new Error(`Ошибка, элемент с селектором: "${selector}" не найден на странице`);
  }
};

export const findAll = (selector: string): NodeListOf<HTMLElement> => {
  const $elems: NodeListOf<HTMLElement> = document.querySelectorAll(selector);
  if ($elems.length) {
    return $elems;
  } else {
    throw new Error(`Ошибка, элементы с селектором: ${selector} не найдены на странице!`);
  }
};
