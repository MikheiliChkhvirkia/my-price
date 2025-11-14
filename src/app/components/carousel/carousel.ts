import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'my-price-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel implements AfterViewInit, OnDestroy {
  @ViewChild('track') private trackRef?: ElementRef<HTMLDivElement>;

  protected canScrollPrev = signal(false);
  protected canScrollNext = signal(false);

  private readonly scrollAmount = 320;
  private mutationObserver?: MutationObserver;

  ngAfterViewInit(): void {
    queueMicrotask(() => this.updateScrollState());
    this.observeMutations();
  }

  ngOnDestroy(): void {
    this.mutationObserver?.disconnect();
  }

  protected scroll(direction: 'left' | 'right'): void {
    const track = this.trackRef?.nativeElement;
    if (!track) {
      return;
    }

    const amount = direction === 'left' ? -this.scrollAmount : this.scrollAmount;
    track.scrollBy({ left: amount, behavior: 'smooth' });

    setTimeout(() => this.updateScrollState(), 180);
  }

  protected onTrackScroll(): void {
    this.updateScrollState();
  }

  @HostListener('window:resize')
  protected onResize(): void {
    this.updateScrollState();
  }

  private observeMutations(): void {
    const track = this.trackRef?.nativeElement;
    if (!track) {
      return;
    }

    this.mutationObserver = new MutationObserver(() => {
      this.updateScrollState();
    });

    this.mutationObserver.observe(track, {
      childList: true,
      subtree: true,
    });
  }

  private updateScrollState(): void {
    const track = this.trackRef?.nativeElement;
    if (!track) {
      return;
    }

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    const currentScroll = track.scrollLeft;

    this.canScrollPrev.set(currentScroll > 8);
    this.canScrollNext.set(maxScrollLeft - currentScroll > 8);
  }
}
