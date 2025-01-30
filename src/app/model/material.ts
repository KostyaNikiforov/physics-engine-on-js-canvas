export interface Material {
  density: number;
}

export enum MaterialType {
  WOOD = 'WOOD',
  METAL = 'METAL',
}

export const MATERIALS: { [key: string]: Material } = {
  [MaterialType.WOOD]: {
    density: 0.5,
  },
  [MaterialType.METAL]: {
    density: 7.8,
  }
}
