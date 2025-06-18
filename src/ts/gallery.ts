interface ModalElements {
  modal: HTMLElement;
  overlay: HTMLElement;
  closeBtn: HTMLElement;
  videoContainer: HTMLElement;
}

export function createYouTubeIframe(videoId: string): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  iframe.allow = 'autoplay; fullscreen';
  iframe.setAttribute('title', 'SmartRecruiters video playback');
  return iframe;
}

export function initVideoModal() {
  const modal = document.getElementById('video-modal');
  if (!modal) return;
  const overlay = modal.querySelector('.modal__overlay') as HTMLElement | null;
  const closeBtn = modal.querySelector('.modal__close') as HTMLElement | null;
  const videoContainer = modal.querySelector('[data-video-container]') as HTMLElement | null;
  const playBtn = document.querySelector<HTMLElement>('.gallery__play-button[data-video-id]');
  if (!overlay || !closeBtn || !videoContainer || !playBtn) return;

  let lastFocusedElement: HTMLElement | null = null;

  playBtn.addEventListener('click', (event) => {
    event.preventDefault();
    lastFocusedElement = playBtn;
    const videoId = playBtn.getAttribute('data-video-id');
    if (!videoId) return;

    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');

    videoContainer.innerHTML = '';
    if (window.matchMedia('(min-width: 768px)').matches) {
      const iframe = createYouTubeIframe(videoId);
      videoContainer.appendChild(iframe);
    }

    closeBtn.focus();
  });

  function closeModal() {
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
    modal!.classList.remove('modal--open');
    modal!.setAttribute('aria-hidden', 'true');
    videoContainer!.innerHTML = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });
}

document.addEventListener('DOMContentLoaded', initVideoModal);