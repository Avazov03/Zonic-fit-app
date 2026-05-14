import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

interface DataPoint {
  label: string;
  value: number;
  highlighted?: boolean;
}

interface TacticalGlobeProps {
  data: DataPoint[];
  size?: number;
}

const TacticalGlobe: React.FC<TacticalGlobeProps> = ({ data, size = 256 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<any>(null);

  useEffect(() => {
    // Fetch world map data
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(topology => {
        setWorldData(topojson.feature(topology, (topology as any).objects.countries));
      });
  }, []);

  useEffect(() => {
    if (!worldData || !svgRef.current) return;

    const width = size;
    const height = size;
    const sensitivity = 75;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const projection = d3.geoOrthographic()
      .scale(size * (120 / 256))
      .center([0, 0])
      .rotate([0, -30])
      .translate([width / 2, height / 2]);

    const initialScale = projection.scale();
    const path = d3.geoPath().projection(projection);

    // Background circle (Ocean/Deep space)
    const oceanGlow = svg.append('defs')
      .append('radialGradient')
      .attr('id', 'ocean-gradient');
    
    oceanGlow.append('stop').attr('offset', '0%').attr('stop-color', '#050505');
    oceanGlow.append('stop').attr('offset', '100%').attr('stop-color', '#1e1b4b');

    svg.append('circle')
      .attr('fill', 'url(#ocean-gradient)')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', '0.5')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', initialScale);

    // Stars background
    const stars = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 0.8,
      opacity: Math.random()
    }));

    svg.append('g')
      .selectAll('circle')
      .data(stars)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('fill', '#fff')
      .attr('opacity', d => d.opacity * 0.3);

    // Graticule (Meridians & Parallels)
    const graticule = d3.geoGraticule();
    svg.append('path')
      .datum(graticule())
      .attr('class', 'graticule')
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', '0.15')
      .attr('opacity', 0.15);

    // Highlight Equator and Prime Meridian
    svg.append('path')
      .datum(d3.geoGraticule().step([0, 0]).outline())
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', '0.5')
      .attr('opacity', 0.4);
    
    svg.append('path')
      .datum({ type: 'LineString', coordinates: [[0, -90], [0, 90]] })
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', '0.5')
      .attr('opacity', 0.4);

    svg.append('path')
      .datum({ type: 'LineString', coordinates: [[-180, 0], [180, 0]] })
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', '0.5')
      .attr('opacity', 0.4);

    // Land masses with gradient
    const landGradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'land-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '100%');
    
    landGradient.append('stop').attr('offset', '0%').attr('stop-color', '#312e81');
    landGradient.append('stop').attr('offset', '100%').attr('stop-color', '#1e1b4b');

    svg.append('g')
      .selectAll('path')
      .data(worldData.features)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', 'url(#land-gradient)')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', '0.2')
      .attr('opacity', 0.8);

    // Atmosphere Glow (Outer)
    svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', initialScale + 2)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', '0.5')
      .attr('opacity', 0.2);

    // Territory Points
    const pointsGroup = svg.append('g');

    const updatePoints = () => {
      const points = pointsGroup.selectAll('circle')
        .data(data);

      points.enter()
        .append('circle')
        .merge(points as any)
        .attr('cx', (d, i) => {
          const angle = (i / data.length) * 360;
          const coords = projection([angle, 41]) || [0, 0];
          return coords[0];
        })
        .attr('cy', (d, i) => {
          const angle = (i / data.length) * 360;
          const coords = projection([angle, 41]) || [0, 0];
          return coords[1];
        })
        .attr('r', (d: any) => d.highlighted ? 4 : 2)
        .attr('fill', (d: any) => d.highlighted ? '#6366f1' : '#1e1b4b')
        .attr('stroke', '#fff')
        .attr('stroke-width', (d: any) => d.highlighted ? 1 : 0.5)
        .attr('opacity', (d: any, i: number) => {
          const angle = (i / data.length) * 360;
          const geoPoint: [number, number] = [angle, 41];
          const distance = d3.geoDistance(geoPoint, [-projection.rotate()[0], -projection.rotate()[1]]);
          return distance > Math.PI / 2 ? 0 : 1; // Hide points on the back side
        })
        .style('filter', (d: any) => d.highlighted ? 'drop-shadow(0 0 8px #6366f1)' : 'none');
    };

    // Auto-rotation
    const timer = d3.timer((elapsed) => {
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();
      projection.rotate([rotate[0] - 1 * k, rotate[1]]);
      svg.selectAll('path').attr('d', path as any);
      updatePoints();
    });

    return () => timer.stop();
  }, [worldData, data]);

  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center rounded-full overflow-hidden border border-indigo-500/30 shadow-[0_0_60px_rgba(99,102,241,0.2)] bg-black">
      <svg 
        ref={svgRef} 
        width={size}
        height={size}
        className="z-10"
      />
      {/* Overlay effects for 3D feel */}
      <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_-30px_-30px_60px_rgba(0,0,0,0.9),inset_30px_30px_60px_rgba(255,255,255,0.1)] rounded-full" />
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none rounded-full" />
      <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.3),inset_0_0_20px_rgba(99,102,241,0.2)] z-30 pointer-events-none" />
    </div>
  );
};

export default TacticalGlobe;
