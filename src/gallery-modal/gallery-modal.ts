import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ViewController, NavParams, Slides, Platform } from 'ionic-angular';
import { CustomControl } from '../interfaces/custom-control';
import { Photo } from '../interfaces/photo-interface';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'gallery-modal',
  templateUrl: './gallery-modal.html',
  styleUrls: ['./gallery-modal.scss'],
})
export class GalleryModal implements OnInit {
  @ViewChild('slider') slider: Slides;

  private initialImage: any;

  public photos: Photo[];
  private sliderDisabled: boolean = false;
  private initialSlide: number = 0;
  private currentSlide: number = 0;
  private sliderLoaded: boolean = false;
  private closeIcon: string = 'arrow-back';
  private previousIcon: string = 'arrow-round-back';
  private nextIcon: string = 'arrow-round-forward';
  private resizeTriggerer: Subject<any> = new Subject();
  private slidesDragging: boolean = false;
  private panUpDownRatio: number = 0;
  private panUpDownDeltaY: number = 0;
  private dismissed: boolean = false;
  private autoLockSwipes: boolean = false;
  private customControls: Array<CustomControl> = [];

  private width: number = 0;
  private height: number = 0;

  private slidesStyle: any = {
    visibility: 'hidden',
  };
  private modalStyle: any = {
    backgroundColor: 'rgba(0, 0, 0, 1)',
  };

  private transitionDuration: string = '200ms';
  private transitionTimingFunction: string = 'cubic-bezier(0.33, 0.66, 0.66, 1)';

  constructor(private viewCtrl: ViewController, params: NavParams, private element: ElementRef, private platform: Platform, private domSanitizer: DomSanitizer) {
    this.photos = params.get('photos') || [];
    this.closeIcon = params.get('closeIcon') || 'arrow-back';
    this.previousIcon = params.get('previousIcon') || 'arrow-round-back';
    this.nextIcon = params.get('nextIcon') || 'arrow-round-forward';
    this.initialSlide = params.get('initialSlide') || 0;
    this.autoLockSwipes = params.get('autoLockSwipes') || false;
    this.customControls = params.get('customControls') || [];

    this.initialImage = this.photos[this.initialSlide] || {};
  }

  /** Index of the picture currently being shown. */
  public getCurrentPictureIndex() {
    return this.slider.getActiveIndex();
  }

  public ngOnInit() {
    // call resize on init
    this.resize({});
  }

  /**
   * Closes the modal (when user click on CLOSE)
   */
  public dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   * Move to the previous picture in gallery.
   */
  public goToPreviousPicture() {
    this.slider.slidePrev();
  }

  /**
   * Move to the next picture in gallery.
   */
  public goToNextPicture() {
    this.slider.slideNext();
  }

  /**
   * Choose a picture in the gallery.
   */
  public choosePicture(index: number) {
    this.slider.slideTo(index);
  }

  /**
   * Execute a custom control's action passing the expected
   * arguments and updating the gallery (if need be).
   */
  public execCustomControlAction(control: CustomControl) {
    const photoIndex = this.getCurrentPictureIndex();
    const promise = control.action(photoIndex, this.photos[photoIndex], this.photos);
    if (promise instanceof Promise) {
      promise.then((photos) => {
        if (!photos.length) {
          this.dismiss();
          return;
        }
        const nextPhotoIndex = photos[photoIndex] ?
          photoIndex :
          photoIndex - 1;
        this.photos = photos;
        this.slider.update();
        this.slider.slideTo(nextPhotoIndex);
      });
    }
  }

  private resize(event) {
    if (this.slider)
      this.slider.update();

    this.width = this.element.nativeElement.offsetWidth;
    this.height = this.element.nativeElement.offsetHeight;

    this.resizeTriggerer.next({
      width: this.width,
      height: this.height,
    });
  }

  private orientationChange(event) {
    // TODO: See if you can remove timeout
    window.setTimeout(() => {
      this.resize(event);
    }, 150);
  }

  /**
   * When the modal has entered into view
   */
  private ionViewDidEnter() {
    this.resize(false);
    this.sliderLoaded = true;
    this.slidesStyle.visibility = 'visible';
    this.lockSwipes();
  }

  /**
   * Disables the scroll through the slider
   *
   * @param  {Event} event
   */
  private disableScroll(event) {
    if (!this.sliderDisabled) {
      this.currentSlide = this.slider.getActiveIndex();
      this.sliderDisabled = true;
    }
  }

  /**
   * Enables the scroll through the slider
   *
   * @param  {Event} event
   */
  private enableScroll(event) {
    if (this.sliderDisabled) {
      this.slider.slideTo(this.currentSlide, 0, false);
      this.sliderDisabled = false;
    }
  }

  /**
   * Called after slide has changed.
   *
   * @param  {Event} event
   */
  private slidesDidChange(event) {
    // NOTE/impl: In some edge cases, the slider goes beyond
    // the last index. Force it back to the last slide.
    // TODO: Is this fix avoidable?
    if (this.getCurrentPictureIndex() >= this.photos.length) {
      this.slider.slideTo(this.photos.length - 1);
    }
    this.lockSwipes();
  }

  /**
   * Called while dragging to close modal
   *
   * @param  {Event} event
   */
  private slidesDrag(event) {
    this.slidesDragging = true;
  }

  /**
   * Called when the user pans up/down
   *
   * @param  {Hammer.Event} event
   */
  private panUpDownEvent(event) {
    event.preventDefault();

    if (this.slidesDragging || this.sliderDisabled) {
      return;
    }

    let ratio = (event.distance / (this.height / 2));
    if (ratio > 1) {
      ratio = 1;
    } else if (ratio < 0) {
      ratio = 0;
    }
    const scale = (event.deltaY < 0 ? 1 : 1 - (ratio * 0.2));
    const opacity = (event.deltaY < 0 ? 1 - (ratio * 0.5) : 1 - (ratio * 0.2));
    const backgroundOpacity = (event.deltaY < 0 ? 1 : 1 - (ratio * 0.8));

    this.panUpDownRatio = ratio;
    this.panUpDownDeltaY = event.deltaY;

    this.slidesStyle.transform = `translate(0, ${event.deltaY}px) scale(${scale})`;
    this.slidesStyle.opacity = opacity;
    this.modalStyle.backgroundColor = `rgba(0, 0, 0, ${backgroundOpacity})`;

    delete this.slidesStyle.transitionProperty;
    delete this.slidesStyle.transitionDuration;
    delete this.slidesStyle.transitionTimingFunction;
    delete this.modalStyle.transitionProperty;
    delete this.modalStyle.transitionDuration;
    delete this.modalStyle.transitionTimingFunction;
  }

  /**
   * Called when the user stopped panning up/down
   *
   * @param  {Hammer.Event} event
   */
  private panEndEvent(event) {
    this.slidesDragging = false;

    this.panUpDownRatio += event.velocityY * 30;

    if (this.panUpDownRatio >= 0.65 && this.panUpDownDeltaY > 0) {
      if (!this.dismissed) {
        this.dismiss();
      }
      this.dismissed = true;
    } else {
      this.slidesStyle.transitionProperty = 'transform';
      this.slidesStyle.transitionTimingFunction = this.transitionTimingFunction;
      this.slidesStyle.transitionDuration = this.transitionDuration;

      this.modalStyle.transitionProperty = 'background-color';
      this.modalStyle.transitionTimingFunction = this.transitionTimingFunction;
      this.modalStyle.transitionDuration = this.transitionDuration;

      this.slidesStyle.transform = 'none';
      this.slidesStyle.opacity = 1;
      this.modalStyle.backgroundColor = 'rgba(0, 0, 0, 1)';
    }
  }

  /**
   * Lock the slider from swiping (if necessary).
   */
  private lockSwipes() {
    if (!this.autoLockSwipes) {
      return;
    }
    this.slider.lockSwipes(false);
    if (this.slider.isBeginning()) {
      this.slider.lockSwipeToPrev(true);
    }
    if (this.slider.isEnd()) {
      this.slider.lockSwipeToNext(true);
    }
  }
}
