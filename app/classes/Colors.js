import gsap from "gsap";

class Colors {
  change({ backgroundColor, color }) {
    gsap.to(document.documentElement, {
      background: backgroundColor,
      color,
      duration: 1.5,
    });
  }
}

export const ColorsManager = new Colors();
