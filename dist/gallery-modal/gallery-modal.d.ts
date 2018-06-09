import { OnInit, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewController, NavParams, Slides, Platform } from 'ionic-angular';
import { CustomControl } from '../interfaces/custom-control';
import { Photo } from '../interfaces/photo-interface';
export declare class GalleryModal implements OnInit {
    private viewCtrl;
    private element;
    private platform;
    private domSanitizer;
    slider: Slides;
    private initialImage;
    photos: Photo[];
    private sliderDisabled;
    private initialSlide;
    private currentSlide;
    private sliderLoaded;
    private closeIcon;
    private resizeTriggerer;
    private slidesDragging;
    private panUpDownRatio;
    private panUpDownDeltaY;
    private dismissed;
    private customControls;
    private width;
    private height;
    private slidesStyle;
    private modalStyle;
    private transitionDuration;
    private transitionTimingFunction;
    constructor(viewCtrl: ViewController, params: NavParams, element: ElementRef, platform: Platform, domSanitizer: DomSanitizer);
    /** Index of the picture currently being shown. */
    getCurrentPictureIndex(): number;
    ngOnInit(): void;
    /**
     * Closes the modal (when user click on CLOSE)
     */
    dismiss(): void;
    /**
     * Execute a custom control's action passing the expected
     * arguments and updating the gallery (if need be).
     */
    execCustomControlAction(control: CustomControl): void;
    private resize(event);
    private orientationChange(event);
    /**
     * When the modal has entered into view
     */
    private ionViewDidEnter();
    /**
     * Disables the scroll through the slider
     *
     * @param  {Event} event
     */
    private disableScroll(event);
    /**
     * Enables the scroll through the slider
     *
     * @param  {Event} event
     */
    private enableScroll(event);
    /**
     * Called while dragging to close modal
     *
     * @param  {Event} event
     */
    private slidesDrag(event);
    /**
     * Called when the user pans up/down
     *
     * @param  {Hammer.Event} event
     */
    private panUpDownEvent(event);
    /**
     * Called when the user stopped panning up/down
     *
     * @param  {Hammer.Event} event
     */
    private panEndEvent(event);
}
