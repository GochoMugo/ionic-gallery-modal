import { ModuleWithProviders } from '@angular/core';
import { FittedImage } from './fitted-image/fitted-image';
import { ZoomableImage } from './zoomable-image/zoomable-image';
import { GalleryModal } from './gallery-modal/gallery-modal';
import { TouchEventsDirective } from './directives/touch-events';
import { GalleryModalHammerConfig } from './overrides/gallery-modal-hammer-config';
export declare class GalleryModalModule {
    static forRoot(): ModuleWithProviders;
}
export { FittedImage, ZoomableImage, GalleryModal, GalleryModalHammerConfig, TouchEventsDirective };
