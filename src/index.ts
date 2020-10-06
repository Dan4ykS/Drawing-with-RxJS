import './styles/variables.scss';
import './styles/main.scss';
import { Theme } from './scripts/Theme';
import { Draw } from './scripts/Draw';
import { find } from './scripts/utils';
import { Modal } from './scripts/Modal';

window.addEventListener('DOMContentLoaded', () => {
  const theme = new Theme(),
    canvas = find('canvas') as HTMLCanvasElement,
    drawInCanvas = new Draw(canvas),
    modal = new Modal(drawInCanvas);

  theme.init();
  drawInCanvas.init();
  modal.init();
});
