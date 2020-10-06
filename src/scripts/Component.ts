import { find } from './utils';

export abstract class Component {
  private $modalWrapper: HTMLElement;

  constructor() {
    this.$modalWrapper = find('.modalWrapper');
  }

  protected abstract addListeners(): void;

  init() {
    this.addListeners();
  }

  protected disabledBtn(button: HTMLElement): void {
    button.setAttribute('disabled', 'true');
  }

  protected enabledBtn(button: HTMLElement): void {
    button.removeAttribute('disabled');
  }

  protected closeModal(): void {
    this.$modalWrapper.classList.add('hiddenElement');
  }

  protected openModal(): void {
    this.$modalWrapper.classList.remove('hiddenElement');
  }
}
