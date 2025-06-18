import { createYouTubeIframe, initVideoModal } from '../src/ts/gallery';

function setViewportWidth(width: number) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
            matches: window.innerWidth >= width,
            media: query,
            onchange: null,
            addListener: () => { },
            removeListener: () => { },
            addEventListener: () => { },
            removeEventListener: () => { },
            dispatchEvent: () => false
        })
    });
}

describe('createYouTubeIframe', () => {
    it('creates an iframe', () => {
        const videoId = 'testId';
        const iframe = createYouTubeIframe(videoId);
        expect(iframe.tagName).toBe('IFRAME');
        expect(iframe.src).toBe(`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
        expect(iframe.allow).toContain('autoplay');
        expect(iframe.allow).toContain('fullscreen');
        expect(iframe.getAttribute('title')).toBe('SmartRecruiters video playback');

    });
});

describe('initVideoModal behavior', () => {
    let modal: HTMLElement;
    let overlay: HTMLElement;
    let closeBtn: HTMLElement;
    let playBtn: HTMLElement;
    let videoContainer: HTMLElement;

    function setupDOM() {
        document.body.innerHTML = `
      <div id="video-modal" class="modal" aria-hidden="true">
        <div class="modal__overlay"></div>
        <div class="modal__content">
          <button class="modal__close"></button>
          <div data-video-container></div>
        </div>
      </div>
      <button class="gallery__play-button" data-video-id="abc123"></button>
    `;
        modal = document.getElementById('video-modal')!;
        overlay = modal.querySelector('.modal__overlay')!;
        closeBtn = modal.querySelector('.modal__close')!;
        videoContainer = modal.querySelector('[data-video-container]')!;
        playBtn = document.querySelector('.gallery__play-button[data-video-id]')!;
    }

    beforeEach(() => {
        setupDOM();
    });

    it('opens modal and injects iframe on desktop', () => {
        window.innerWidth = 1024;
        setViewportWidth(768);
        initVideoModal();

        playBtn.click();
        expect(modal.classList.contains('modal--open')).toBe(true);
        expect(modal.getAttribute('aria-hidden')).toBe('false');
        const iframe = videoContainer.querySelector('iframe');
        expect(iframe).not.toBeNull();
        expect((iframe as HTMLIFrameElement).src).toContain('abc123');
    });

    it('opens modal without injecting iframe on mobile', () => {
        window.innerWidth = 320;
        setViewportWidth(768);
        initVideoModal();

        playBtn.click();
        expect(modal.classList.contains('modal--open')).toBe(true);
        expect(modal.getAttribute('aria-hidden')).toBe('false');
        expect(videoContainer.querySelector('iframe')).toBeNull();
    });

    it('closes modal and clears iframe on close button click', () => {
        window.innerWidth = 1024;
        setViewportWidth(768);
        initVideoModal();
        playBtn.click();
        expect(modal.classList.contains('modal--open')).toBe(true);

        closeBtn.click();
        expect(modal.classList.contains('modal--open')).toBe(false);
        expect(modal.getAttribute('aria-hidden')).toBe('true');
        expect(videoContainer.children.length).toBe(0);
    });

    it('closes modal on overlay click', () => {
        window.innerWidth = 1024;
        setViewportWidth(768);
        initVideoModal();
        playBtn.click();
        expect(modal.classList.contains('modal--open')).toBe(true);

        overlay.click();
        expect(modal.classList.contains('modal--open')).toBe(false);
        expect(videoContainer.children.length).toBe(0);
    });

    it('closes modal on Escape key press', () => {
        window.innerWidth = 1024;
        setViewportWidth(768);
        initVideoModal();
        playBtn.click();
        expect(modal.classList.contains('modal--open')).toBe(true);

        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);
        expect(modal.classList.contains('modal--open')).toBe(false);
        expect(videoContainer.children.length).toBe(0);
    });

    it('does not throw if required elements are missing', () => {
        document.body.innerHTML = `<button class="gallery__play-button"></button>`;
        expect(() => initVideoModal()).not.toThrow();
    });
});
