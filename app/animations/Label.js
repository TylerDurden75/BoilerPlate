import GSAP from "gsap";

import Animation from "../classes/Animation";

export default class Label extends Animation {
  constructor(element, elements) {
    super({ element, elements });
  }

  animateIn() {
    this.timeLineIn = GSAP.timeline({
      delay: 0.5,
    });
    this.timeLineIn.to(this.element, {
      autoAlpha: 1,
      duration: 1,
    });
  }

  animateOut() {
    GSAP.set(this.element, {
      autoAlpha: 0,
    });
  }
}
