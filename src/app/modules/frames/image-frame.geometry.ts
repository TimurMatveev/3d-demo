import { BufferAttribute, BufferGeometry } from "three";

export function createFacesBufferGeometry(faces: number[][][]): BufferGeometry {
  const geometry: BufferGeometry = new BufferGeometry();
  const positions: Float32Array = new Float32Array(9 * faces.length);

  faces.forEach((face, i) => {
    face.forEach((vertex, j) => {
      vertex.forEach((coordinate, k) => {
        positions[i * 9 + j * 3 + k] = coordinate;
      });
    });
  });

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.computeVertexNormals();

  return geometry;
}

export function createImageFrameGeometry(
  w: number,
  h: number,
  d: number,
  b: number,
): BufferGeometry {
  const x = w / 2;
  const y = h / 2;
  const z = d / 2;

  return createFacesBufferGeometry([
    [
      [x, y, -z],
      [x, -y, -z],
      [-x, y, -z],
    ],
    [
      [-x, y, -z],
      [x, -y, -z],
      [-x, -y, -z],
    ],
    [
      [x, y, -z],
      [x, y, z],
      [x, -y, -z],
    ],
    [
      [x, -y, -z],
      [x, y, z],
      [x, -y, z],
    ],
    [
      [x, y, z],
      [x, y, -z],
      [-x, y, -z],
    ],
    [
      [x, y, z],
      [-x, y, -z],
      [-x, y, z],
    ],
    [
      [-x, y, z],
      [-x, y, -z],
      [-x, -y, -z],
    ],
    [
      [-x, y, z],
      [-x, -y, -z],
      [-x, -y, z],
    ],
    [
      [x, -y, -z],
      [x, -y, z],
      [-x, -y, -z],
    ],
    [
      [-x, -y, -z],
      [x, -y, z],
      [-x, -y, z],
    ],
    [
      [x, y, z],
      [-x, y, z],
      [x - b, y - b, z],
    ],
    [
      [x - b, y - b, z],
      [-x, y, z],
      [-x + b, y - b, z],
    ],
    [
      [-x + b, y - b, z],
      [-x, y, z],
      [-x, -y, z],
    ],
    [
      [-x + b, y - b, z],
      [-x, -y, z],
      [-x + b, -y + b, z],
    ],
    [
      [-x + b, -y + b, z],
      [-x, -y, z],
      [x, -y, z],
    ],
    [
      [-x + b, -y + b, z],
      [x, -y, z],
      [x - b, -y + b, z],
    ],
    [
      [x, y, z],
      [x - b, y - b, z],
      [x - b, -y + b, z],
    ],
    [
      [x, y, z],
      [x - b, -y + b, z],
      [x, -y, z],
    ],
  ]);
}

export function createImageFrameBorderGeometry(
  w: number,
  h: number,
  d: number,
  b: number,
): BufferGeometry {
  const x = w / 2;
  const y = h / 2;
  const z = d / 2;

  return createFacesBufferGeometry([
    [
      [x, y, z],
      [-x, y, z],
      [x - b, y - b, z],
    ],
    [
      [x - b, y - b, z],
      [-x, y, z],
      [-x + b, y - b, z],
    ],
    [
      [-x + b, y - b, z],
      [-x, y, z],
      [-x, -y, z],
    ],
    [
      [-x + b, y - b, z],
      [-x, -y, z],
      [-x + b, -y + b, z],
    ],
    [
      [-x + b, -y + b, z],
      [-x, -y, z],
      [x, -y, z],
    ],
    [
      [-x + b, -y + b, z],
      [x, -y, z],
      [x - b, -y + b, z],
    ],
    [
      [x, y, z],
      [x - b, y - b, z],
      [x - b, -y + b, z],
    ],
    [
      [x, y, z],
      [x - b, -y + b, z],
      [x, -y, z],
    ],
  ]);
}
