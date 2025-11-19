import React, { useRef } from 'react';
import Sketch from 'react-p5';

const AuraVisualization = ({ sentiment, intensity, sentimentLabel }) => {
  const particles = useRef([]);
  const flowField = useRef([]);
  const cols = useRef(0);
  const rows = useRef(0);
  const scl = 20; // Scale of flow field grid
  const inc = 0.1; // Increment for Perlin noise
  const zoff = useRef(0);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    
    // Calculate grid dimensions
    cols.current = Math.floor(p5.width / scl);
    rows.current = Math.floor(p5.height / scl);
    
    // Initialize flow field
    flowField.current = new Array(cols.current * rows.current);
    
    // Create particles
    const particleCount = 500 + Math.floor(intensity * 1000);
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        pos: p5.createVector(Math.random() * p5.width, Math.random() * p5.height),
        vel: p5.createVector(0, 0),
        acc: p5.createVector(0, 0),
        maxSpeed: 2 + intensity * 3,
        prevPos: p5.createVector(Math.random() * p5.width, Math.random() * p5.height)
      });
    }
  };

  const draw = (p5) => {
    // Dynamic background based on sentiment
    const bgAlpha = 10 + intensity * 20; // More intensity = faster fade = more trails
    
    if (sentimentLabel === 'positive') {
      p5.background(15, 5, 50, bgAlpha); // Deep blue-purple
    } else if (sentimentLabel === 'negative') {
      p5.background(50, 5, 15, bgAlpha); // Deep red
    } else {
      p5.background(20, 20, 30, bgAlpha); // Neutral gray-blue
    }

    // Update flow field using Perlin noise
    let yoff = 0;
    for (let y = 0; y < rows.current; y++) {
      let xoff = 0;
      for (let x = 0; x < cols.current; x++) {
        const index = x + y * cols.current;
        const angle = p5.noise(xoff, yoff, zoff.current) * p5.TWO_PI * 4;
        const v = p5.constructor.Vector.fromAngle(angle);
        v.setMag(1);
        flowField.current[index] = v;
        xoff += inc;
      }
      yoff += inc;
    }
    
    // Increase z for 3D noise evolution
    zoff.current += 0.001 + intensity * 0.01;

    // Update and draw particles
    particles.current.forEach(particle => {
      // Get flow field vector at particle position
      const x = Math.floor(particle.pos.x / scl);
      const y = Math.floor(particle.pos.y / scl);
      const index = x + y * cols.current;
      const force = flowField.current[index];
      
      if (force) {
        particle.acc.add(force);
      }

      // Update physics
      particle.vel.add(particle.acc);
      particle.vel.limit(particle.maxSpeed);
      particle.prevPos.set(particle.pos);
      particle.pos.add(particle.vel);
      particle.acc.mult(0);

      // Wrap edges
      if (particle.pos.x > p5.width) {
        particle.pos.x = 0;
        particle.prevPos.x = 0;
      }
      if (particle.pos.x < 0) {
        particle.pos.x = p5.width;
        particle.prevPos.x = p5.width;
      }
      if (particle.pos.y > p5.height) {
        particle.pos.y = 0;
        particle.prevPos.y = 0;
      }
      if (particle.pos.y < 0) {
        particle.pos.y = p5.height;
        particle.prevPos.y = p5.height;
      }

      // Draw particle trail
      p5.strokeWeight(1 + intensity * 2);
      
      // Color based on sentiment
      let r, g, b;
      if (sentimentLabel === 'positive') {
        // Blue to cyan spectrum
        r = 50 + sentiment * 100;
        g = 150 + sentiment * 105;
        b = 255;
      } else if (sentimentLabel === 'negative') {
        // Red to orange spectrum
        r = 255;
        g = 50 + Math.abs(sentiment) * 100;
        b = 50;
      } else {
        // Purple to white spectrum
        r = 150 + intensity * 105;
        g = 100 + intensity * 155;
        b = 200 + intensity * 55;
      }
      
      const alpha = 150 + intensity * 105;
      p5.stroke(r, g, b, alpha);
      
      p5.line(
        particle.prevPos.x,
        particle.prevPos.y,
        particle.pos.x,
        particle.pos.y
      );
    });
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
};

export default AuraVisualization;