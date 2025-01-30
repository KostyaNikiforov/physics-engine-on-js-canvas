const G: number = 6.674 * Math.pow(10, -11);
const LAND_MASS = 5.972 * Math.pow(10, 24);

export class PhysicUtil {
  static calculateGravityForce(mass1: number, mass2: number, distance: number): number {
    return G * (mass1 * mass2) / distance ** 2;
  }

  static calculateGravityForceToLand(mass: number, distance: number): number {
    return G * (mass * LAND_MASS) / distance ** 2;
  }

  static calculateResistanceForce(
    airDensity: number,
    square: number,
    resistanceCoefficient: number,
    speed: number
  ): number {
    return (airDensity * square * resistanceCoefficient * speed ** 2) / 2;
  }
}
