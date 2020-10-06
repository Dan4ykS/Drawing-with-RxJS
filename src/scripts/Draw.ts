import { fromEvent, Observable } from 'rxjs';
import { map, pairwise, startWith, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Component } from './Component';
import { find } from './utils';

export class Draw extends Component {
  private $colorInput: HTMLInputElement;
  private $boldnessSelect: HTMLSelectElement;
  private $clearBtn: HTMLElement;
  private $saveBtn: HTMLElement;
  private context: CanvasRenderingContext2D;
  private canvasRect: DOMRect;
  private scale: number;
  private drawing$: Observable<MouseEvent>;
  private mouseDown$: Observable<MouseEvent>;
  private mouseUp$: Observable<MouseEvent>;
  private mouseOut$: Observable<MouseEvent>;
  private strokeStyle$: Observable<string>;
  private lineWidth$: Observable<number>;

  constructor(private $canvas: HTMLCanvasElement) {
    super();
    this.$colorInput = find('input[type=color]') as HTMLInputElement;
    this.$boldnessSelect = find('select') as HTMLSelectElement;
    this.$clearBtn = find('.clear');
    this.$saveBtn = find('.openModal');
    this.context = $canvas.getContext('2d')!;
    this.canvasRect = $canvas.getBoundingClientRect();
    this.scale = window.devicePixelRatio;
    this.drawing$ = fromEvent<MouseEvent>($canvas, 'mousemove');
    this.mouseDown$ = fromEvent<MouseEvent>($canvas, 'mousedown');
    this.mouseUp$ = fromEvent<MouseEvent>($canvas, 'mouseup');
    this.mouseOut$ = fromEvent<MouseEvent>($canvas, 'mouseout');
    this.strokeStyle$ = this.createOptionsStream(this.$colorInput, 'input') as Observable<string>;
    this.lineWidth$ = this.createOptionsStream(this.$boldnessSelect, 'change') as Observable<number>;
  }

  init() {
    super.init();
    this.updateCanvasParams();
  }

  downloadImg(fileName: string, fileExtension: 'png' | 'jpeg'): void {
    if (fileExtension === 'jpeg') {
      this.context.globalCompositeOperation = 'destination-over';
      this.context.fillStyle = '#ffffff';
      this.context.fillRect(0, 0, this.$canvas.width, this.$canvas.height);
    }

    const downloadLik = this.$canvas.toDataURL(`image/${fileExtension}`, 1),
      body = find('body'),
      download = document.createElement('a');

    download.setAttribute('href', downloadLik);
    download.setAttribute('download', fileName);
    download.style.display = 'none';
    body.appendChild(download);
    download.click();
    body.removeChild(download);
  }

  clearCanvas(): void {
    this.context.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
  }

  protected addListeners(): void {
    fromEvent(window, 'resize').subscribe(() => {
      this.updateCanvasParams();
    });

    this.mouseDown$
      .pipe(
        withLatestFrom(this.strokeStyle$, this.lineWidth$, (_, strokeStyle, lineWidth) => ({
          strokeStyle,
          lineWidth,
        })),
        switchMap((options) =>
          this.drawing$.pipe(
            map((e) => ({
              x: e.offsetX,
              y: e.offsetY,
              options,
            })),
            pairwise(),
            takeUntil(this.mouseUp$),
            takeUntil(this.mouseOut$)
          )
        )
      )
      .subscribe(([prevPos, pos]) => {
        const { strokeStyle, lineWidth } = pos.options;

        [this.$clearBtn, this.$saveBtn].forEach((btn) => this.enabledBtn(btn));

        this.context.beginPath();
        this.context.strokeStyle = strokeStyle;
        this.context.lineWidth = lineWidth;
        this.context.moveTo(prevPos.x, prevPos.y);
        this.context.lineTo(pos.x, pos.y);
        this.context.stroke();
      });

    fromEvent(this.$clearBtn, 'click').subscribe(() => {
      this.clearCanvas();
      [this.$clearBtn, this.$saveBtn].forEach((btn) => this.disabledBtn(btn));
    });

    fromEvent(this.$saveBtn, 'click').subscribe(() => {
      this.openModal();
    });
  }

  private createOptionsStream(
    node: HTMLInputElement | HTMLSelectElement,
    event: 'input' | 'change'
  ): Observable<string | number> {
    return fromEvent<Event>(node, event).pipe(
      map((e) => {
        const elem = e.target as HTMLInputElement | HTMLSelectElement;

        return node instanceof HTMLSelectElement ? +elem.value : elem.value;
      }),
      startWith(node instanceof HTMLSelectElement ? +node.value : node.value)
    );
  }

  private updateCanvasParams(): void {
    this.context = this.$canvas.getContext('2d')!;
    this.canvasRect = this.$canvas.getBoundingClientRect();
    this.scale = window.devicePixelRatio;
    this.$canvas.width = this.canvasRect.width * this.scale;
    this.$canvas.height = this.canvasRect.height * this.scale;
    this.context.scale(this.scale, this.scale);
  }
}
