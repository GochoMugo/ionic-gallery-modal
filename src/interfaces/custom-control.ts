import { Photo } from './photo-interface';

// Custom control interface
export interface CustomControl {
  /** Icon class. */
  icon: string;
  /**
   * Function invoked when control is activated (i.e. clicked on).
   * If a `Promise` is returned, it will be waited on.
   * Returning a promise allows passing back an updated list of
   * photos.
   */
  action: (photoIndex: number, photo: Photo, photos: Photo[]) => void | Promise<Photo[]>;
}
