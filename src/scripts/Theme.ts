import { Component } from './Component';
import { find } from './utils';

type ThemeType = 'theme_dark' | 'them_light';

export class Theme extends Component {
  private $body: HTMLElement;
  private $content: HTMLElement;
  private $changeThemeBtn: HTMLElement;
  private theme: ThemeType;

  constructor() {
    super();
    this.$body = find('body');
    this.$content = find('.content');
    this.$changeThemeBtn = find('.changeTheme');
    this.theme = this.$body.classList.value as ThemeType;
  }

  protected addListeners(): void {
    this.$changeThemeBtn.addEventListener('click', () => {
      this.changeTheme();
    });
  }

  protected changeTheme(): void {
    if (this.theme === 'theme_dark') {
      [this.$body, this.$content].forEach((el) => el.classList.remove('theme_dark'));
      [this.$body, this.$content].forEach((el) => el.classList.add('theme_light'));
      this.theme = 'them_light';
    } else {
      [this.$body, this.$content].forEach((el) => el.classList.remove('theme_light'));
      [this.$body, this.$content].forEach((el) => el.classList.add('theme_dark'));
      this.theme = 'theme_dark';
    }
  }
}
