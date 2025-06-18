interface ModalElements {
  modal: HTMLElement;
  overlay: HTMLElement;
  closeBtn: HTMLElement;
  videoContainer: HTMLElement;
}

function createYouTubeIframe(videoId: string): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  iframe.allow = 'autoplay; fullscreen';
  iframe.setAttribute('title', 'SmartRecruiters video playback');
  return iframe;
}

function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const overlay = modal?.querySelector('.modal__overlay') as HTMLElement;
  const closeBtn = modal?.querySelector('.modal__close') as HTMLElement;
  const videoContainer = modal?.querySelector('[data-video-container]') as HTMLElement;
  const playBtn = document.querySelector<HTMLElement>('.gallery__play-button[data-video-id]');

  if (!modal || !overlay || !closeBtn || !videoContainer || !playBtn) return;

  playBtn.addEventListener('click', (event) => {
    event.preventDefault();
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
    if (modal) {
      modal.classList.remove('modal--open');
    }
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
    }
    videoContainer.innerHTML = '';
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