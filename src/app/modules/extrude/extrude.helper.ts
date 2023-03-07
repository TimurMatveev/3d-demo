import { BufferGeometry } from "three";
import { BufferAttribute } from "three/src/core/BufferAttribute";

export type Vector = [number, number, number];

export function isVectorsEqual(...vectors: Vector[]): boolean {
  if (vectors.length < 2) {
    return true;
  }

  const [x0, y0, z0] = vectors.at(0) as Vector;
  return vectors.slice(1).every(([x, y, z]) => x === x0 && y === y0 && z === z0);
}

export function vectorToString(vector: Vector): string {
  return vector.join(',');
}

export function vectorsToString(vectors: Vector[]): string {
  return vectors.map(vectorToString).join('|');
}

export function vectorScalar([x, y, z]: Vector, scalar: number): Vector {
  return [x * scalar, y * scalar, z * scalar];
}

export function vectorSum(...vectors: Vector[]): Vector {
  return vectors.reduce(([x, y, z], [vx, vy, vz]) => [x + vx, y + vy, z + vz], [0, 0, 0]);
}

export function vectorLength(vector: Vector): number {
  return Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2);
}

export function vectorNormalize(vector: Vector): Vector {
  return vectorScalar(vector, 1 / vectorLength(vector));
}

function parseBufferAttribute({ array, itemSize, count }: BufferAttribute): Vector[] {
  return new Array(count)
    .fill(null)
    .map((_, i) => [
      array[i * itemSize],
      array[i * itemSize + 1],
      array[i * itemSize + 2],
    ]);
}

export type VertexConfig = {
  indexes: number[];
  vector: Vector;
  normal: Vector;
  faceNormals: Vector[];
}

export function extractVertexConfigs(geometry: BufferGeometry): VertexConfig[] {
  const vectors: Vector[] = parseBufferAttribute(geometry.getAttribute('position') as BufferAttribute);
  const normals: Vector[] = parseBufferAttribute(geometry.getAttribute('normal') as BufferAttribute);
  const vectorKeys: string[] = vectors.map(vectorToString);

  const keyVectorMap: Map<string, VertexConfig> = new Map();

  vectors.forEach((vector, index) => {
    const key: string = vectorKeys[index];
    const existing: VertexConfig | undefined = keyVectorMap.get(key);

    if (!existing) {
      keyVectorMap.set(key, {
        indexes: [index],
        vector,
        normal: [0, 0, 0],
        faceNormals: [normals[index]],
      });
    } else {
      existing.indexes.push(index);

      if (existing.faceNormals.every((normal) => !isVectorsEqual(normal, normals[index]))) {
        existing.faceNormals.push(normals[index]);
      }
    }
  });

  return [...keyVectorMap.values()].map((config: VertexConfig) => {
    config.normal = vectorNormalize(vectorSum(...config.faceNormals));
    return config;
  });
}

export function extrudeVertices(vertices: VertexConfig[], distance: number): VertexConfig[] {
  return vertices.map((vertex: VertexConfig) => ({
    ...vertex,
    vector: vectorSum(
      vertex.vector,
      vectorScalar(vertex.normal, distance),
    ),
  }));
}

export function getFlatVertices(vertices: VertexConfig[]): Float32Array {
  const size = vertices.reduce((result, vertex) => result + vertex.indexes.length, 0);
  const positions: Float32Array = new Float32Array(size * 3);

  vertices.forEach((vertex: VertexConfig) => {
    vertex.indexes.forEach((index: number) => {
      positions[index * 3] = vertex.vector[0];
      positions[index * 3 + 1] = vertex.vector[1];
      positions[index * 3 + 2] = vertex.vector[2];
    });
  });

  return positions;
}
