import gsap from "gsap";

import Prefix from "prefix";

import Media from "./Media";

import { Plane, Transform } from "ogl";

import map from "lodash/map";

export default class {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;

    this.transformPrefix = Prefix("transform");

    this.group = new Transform();

    this.galleryElement = document.querySelector(".collections__gallery");
    this.galleryWrapperElement = document.querySelector(
      ".collections__gallery__wrapper"
    );
    this.titlesElement = document.querySelector(".collections__titles");
    this.collectionsElements = document.querySelectorAll(
      ".collections__article"
    );
    this.collectionsElementsActive = "collection__article--active";
    this.mediasElements = document.querySelectorAll(
      ".collections__gallery__media"
    );

    this.scroll = {
      current: 0,
      target: 0,
      start: 0,
      lerp: 0.1,
      velocity: 0.5,
    };

    this.createGeometry();
    this.createGallery();

    this.group.setParent(this.scene);

    this.show();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGallery() {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes,
      });
    });
  }

  show() {
    map(this.medias, (media) => media.show());
  }

  hide() {
    map(this.medias, (media) => media.hide());
  }

  /**
   * Events.
   */
  onResize(event) {
    this.sizes = event.sizes;

    this.bounds = this.galleryWrapperElement.getBoundingClientRect();

    this.scroll.x = this.scroll.target = 0;
    this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth;

    map(this.medias, (media) => media.onResize(event, this.scroll));
  }

  onTouchDown({ x, y }) {
    this.scroll.last = this.scroll.current;
  }

  onTouchMove({ x, y }) {
    const distance = x.start - x.end;

    this.scroll.target = this.scroll.last - distance;

    console.log(this.scroll.target, distance);
  }

  onWheel({ pixelY }) {
    this.scroll.target += pixelY;
  }

  onTouchUp({ x, y }) {}

  /**
   * Changed
   */
  onChange(index) {
    this.index = index;

    const selectedCollection = parseInt(
      this.mediasElements[this.index].getAttribute("data-index")
    );

    map(this.collectionsElements, (element, elementIndex) => {
      if (elementIndex === selectedCollection) {
        element.classList.add(this.collectionsElementsActive);
      } else {
        element.classList.remove(this.collectionsElementsActive);
      }
    });

    this.titlesElement.style[this.transformPrefix] = `translateY(-${
      25 * selectedCollection
    }%) translateY(-50%, -50%) rotate(-90deg)`;
  }

  /**
   * Update
   */
  update() {
    if (!this.bounds) return;

    this.scroll.target = gsap.utils.clamp(
      -this.scroll.limit,
      0,
      this.scroll.target
    );

    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.lerp
    );

    this.galleryElement.style[
      this.transformPrefix
    ] = `translateX(${this.scroll.current}px)`;

    if (this.scroll.last < this.scroll.current) {
      this.scroll.direction = "right";
    } else if (this.scroll.last > this.scroll.current) {
      this.scroll.direction = "left";
    }

    this.scroll.last = this.scroll.current;

    map(this.medias, (media, index) => {
      media.update(this.scroll.current);
    });

    const index = Math.floor(
      Math.abs(this.scroll.current / this.scroll.limit) * this.medias.length
    );

    console.log(index);

    if (this.index !== index) {
      this.onChange(index);
    }
  }

  /**
   * Destroy.
   */
  destroy() {
    this.scene.removeChild(this.group);
  }
}
