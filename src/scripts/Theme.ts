import { Component } from './Component';
import { find } from './utils';

type ThemeType = 'theme_dark' | 'theme_light';

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
    this.theme = localStorage.getItem('theme') as ThemeType || 'theme_dark';
  }

  init() {
    super.init();
    this.setTheme(this.theme);
  }

  protected addListeners(): void {
    this.$changeThemeBtn.addEventListener('click', () => {
      this.changeTheme();
    });
  }

  private changeTheme(): void {
    if (this.theme === 'theme_dark') {
      this.theme = 'theme_light';
      this.removeTheme('theme_dark');
      this.setTheme(this.theme);
    } else {
      this.theme = 'theme_dark';
      this.removeTheme('theme_light');
      this.setTheme(this.theme);
    }
    localStorage.setItem('theme', this.theme);
  }

  private setTheme(theme: ThemeType): void {
    [this.$body, this.$content].forEach((el) => el.classList.add(theme));
  }

  private removeTheme(theme: ThemeType): void {
    [this.$body, this.$content].forEach((el) => el.classList.remove(theme));
  }
}
