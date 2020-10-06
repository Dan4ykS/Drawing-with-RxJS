import { find } from './utils';
import { Component } from './Component';
import { Draw } from './Draw';

type ExeType = 'png' | 'jpeg';

export class Modal extends Component {
  private $modalInput: HTMLInputElement;
  private $modalSelect: HTMLSelectElement;
  private $saveBtn: HTMLElement;
  private $closeBtn: HTMLElement;
  private fileExtension: ExeType = 'png';
  private fileName = '';

  constructor(private draw: Draw) {
    super();
    this.$modalInput = find('.modal input') as HTMLInputElement;
    this.$modalSelect = find('.modal select') as HTMLSelectElement;
    this.$saveBtn = find('.modal__btns .save');
    this.$closeBtn = find('.modal__btns .closeModal');
  }

  init() {
    super.init();
    this.disabledBtn(this.$saveBtn);
  }

  protected addListeners() {
    this.$saveBtn.addEventListener('click', () => {
      this.draw.downloadImg(this.fileName, this.fileExtension);
      this.closeModal();
      this.draw.clearCanvas();
      this.fileName = '';
      this.$modalInput.value = ''
      this.fileExtension = 'png';
      this.$modalSelect.value = 'png'
    });
    this.$closeBtn.addEventListener('click', () => {
      this.closeModal();
    });
    this.$modalInput.addEventListener('input', (e) => {
      const input = e.target as HTMLInputElement;

      this.fileName = this.transformFileName(input.value.trim());
      this.toggleDisabledSaveBtn();
    });

    this.$modalSelect.addEventListener('change', (e) => {
      const select = e.target as HTMLSelectElement;

      this.fileExtension = select.value as ExeType;
    });
  }

  private transformFileName(fileName: string): string {
    const wordsInFileName = fileName.split(' ');

    return wordsInFileName.join('_');
  }

  private toggleDisabledSaveBtn(): void {
    if (this.fileName.trim()) {
      this.enabledBtn(this.$saveBtn);
    } else {
      this.disabledBtn(this.$saveBtn);
    }
  }
}
