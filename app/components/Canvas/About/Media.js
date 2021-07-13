import { Mesh, Program } from "ogl";

import GSAP from "gsap";

import fragment from "shaders/plane-fragment.glsl";
import vertex from "shaders/plane-vertex.glsl";

export default class {
  constructor({ element, geometry, gl, index, scene, sizes }) {
    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.index = index;
    this.scene = scene;
    this.sizes = sizes;

    this.createTexture();
    this.createProgram();
    this.createMesh();

    this.extra = {
      x: 0,
      y: 0,
    };
  }

  createTexture() {
    const image = this.element.querySelector("img");

    this.texture = window.TEXTURES[image.getAttribute("data-src")];
  }

  createProgram() {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        tMap: { value: this.texture },
      },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.setParent(this.scene);
  }

  createBounds(sizes) {
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY();
  }

  /**
   * Animations
   */
  show() {
    GSAP.fromTo(
      this.program.uniforms.uAlpha,
      {
        values: 0,
      },
      {
        value: 1,
      }
    );
  }

  hide() {
    GSAP.to(this.program.uniforms.uAlpha, {
      values: 0,
    });
  }

  /**
   * Events
   */
  onResize(sizes, scroll) {
    this.extra = 0;

    this.createBounds(sizes);
    this.updateX(scroll);
    this.updateY(0);
  }

  /**
   * Loops
   */
  updateRotation() {
    this.mesh.rotation.z = GSAP.utils.mapRange(
      -this.sizes.width / 2,
      this.sizes.width / 2,
      Math.PI * 0.1,
      -Math.PI * 0.1,
      this.mesh.position.x
    );
  }

  updateScale() {
    this.width = this.bounds.width / window.innerHeight;
    this.height = this.bounds.height / window.innerHeight;

    this.mesh.scale.x = this.sizes.width * this.width;
    this.mesh.scale.y = this.sizes.height * this.height;

    // const scale = GSAP.utils.mapRange(
    //   0,
    //   this.sizes.width / 2,
    //   0.1,
    //   0,
    //   Math.abs(this.mesh.position.x)
    // );

    // this.mesh.scale.x += scale;
    // this.mesh.scale.y += scale;
  }

  updateX(x = 0) {
    this.x = (this.bounds.left + x) / window.innerWidth;

    this.mesh.position.x =
      -this.sizes.width / 2 +
      this.mesh.scale.x / 2 +
      this.x * this.sizes.width +
      this.extra;
  }
  updateY(y = 0) {
    this.y = (this.bounds.top + y) / window.innerHeight;

    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      this.y * this.sizes.height;

    this.mesh.postion.y +=
      Math.cos((this.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 40 -
      40;
  }

  update(scroll) {
    if (!this.bounds) return;

    this.updateRotation();
    this.updateScale();
    this.updateX(scroll);
    this.updateY(0);
  }
}
