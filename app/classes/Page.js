import gsap from "gsap";
import Prefix from "prefix";

import each from "lodash/each";
import map from "lodash/map";

import Highlight from "animations/Highlight";
import Label from "animations/Label";
import Paragraph from "animations/Paragraph";
import Title from "animations/Title";

import { ColorsManager } from "classes/Colors";
import AsyncLoad from "classes/AsyncLoad";

export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsHighlight: '[data-animation="highlight"]',
      animationsLabel: '[data-animation="label"]',
      animationsParagraph: '[data-animation="paragraph"]',
      animationsTitle: '[data-animation="title"]',

      preloaders: "[data-src]",
    };

    this.id = id;

    this.transformPrefix = Prefix("transform");

    // console.log(this.transformPrefix);
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key] === 0) {
          this.elements[key] = null;
        } else if (this.elements[key] === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });

    this.createAnimations();
    this.createPreloader();
  }

  createAnimations() {
    this.animations = [];

    //Highlight
    this.animationsHighlight = map(
      this.elements.animationsHighlight,
      (element) => {
        return new Highlight({
          element,
        });
      }
    );

    this.animations.push(...this.animationsHighlight);

    //Title
    this.animationsTitle = map(this.elements.animationsTitle, (element) => {
      return new Title({
        element,
      });
    });

    this.animations.push(...this.animationsTitle);

    //Paragraph
    this.animationsParagraph = map(
      this.elements.animationsParagraph,
      (element) => {
        return new Paragraph({
          element,
        });
      }
    );

    this.animations.push(...this.animationsParagraph);

    //Label
    this.animationsLabel = map(this.elements.animationsLabel, (element) => {
      return new Label({
        element,
      });
    });

    this.animations.push(...this.animationsLabel);
  }

  createPreloader() {
    this.preloaders = map(this.elements.preloaders, (element) => {
      return new AsyncLoad({ element });
    });
  }

  /**
   * Animations.
   */
  show() {
    return new Promise((resolve) => {
      ColorsManager.change({
        backgroundColor: this.element.getAttribute("data-background"),
        color: this.element.getAttribute("data-color"),
      });
      this.animationIn = gsap.timeline();

      this.animationIn.fromTo(
        this.element,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
        }
      );

      this.animationIn.call((_) => {
        this.addEventListeners();
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.destroy();

      this.animationOut = gsap.timeline();

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  /**
   * Events.
   */

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;
    }
    each(this.animations, (animation) => animation.onResize());
  }

  onWheel({ pixelY }) {
    this.scroll.target += pixelY;
  }

  /**
   * Loop.
   */
  update() {
    this.scroll.target = gsap.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.1
    );

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      this.elements.wrapper.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`;
    }
  }

  /**
   * Listeners.
   */
  addEventListeners() {}

  removeEventListeners() {}

  /**
   * Destroy.
   */
  destroy() {
    this.removeEventListeners();
  }
}
