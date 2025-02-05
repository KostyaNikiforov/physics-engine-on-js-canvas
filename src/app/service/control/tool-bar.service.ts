import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ToolBarService {
  private isLandGravityEnabled: boolean = false;
  private isAirResistanceEnabled: boolean = false;
  private isGravityEnabled: boolean = false;
  private isCollisionEnabled: boolean = false;
  private isBorderCollisionEnabled: boolean = true;
  private isRotationEnabled: boolean = false;
  private isPaused: boolean = false;

  private circleRadius: number = 1;
  private _speed: number = 5;
  private _direction: number = 0;

  get direction(): number {
    return this._direction;
  }

  setDirection(value: number): void {
    this._direction = value;
  }

  get speed(): number {
    return this._speed;
  }

  setSpeed(value: number) {
    this._speed = value;
  }

  get radius(): number {
    return this.circleRadius;
  }

  set radius(value: number) {
    this.circleRadius = value;
  }

  get landGravityEnabled(): boolean {
    return this.isLandGravityEnabled;
  }

  get rotationEnabled(): boolean {
    return this.isRotationEnabled;
  }

  get borderCollisionEnabled(): boolean {
    return this.isBorderCollisionEnabled;
  }

  get collisionEnabled(): boolean {
    return this.isCollisionEnabled;
  }

  get gravityEnabled(): boolean {
    return this.isGravityEnabled;
  }

  get airResistanceEnabled(): boolean {
    return this.isAirResistanceEnabled;
  }

  get paused(): boolean {
    return this.isPaused;
  }

  switchRotation(isEnabled: boolean = !this.isRotationEnabled): void {
    this.isRotationEnabled = isEnabled;
  }

  switchBorderCollision(isEnabled: boolean = !this.isBorderCollisionEnabled): void {
    this.isBorderCollisionEnabled = isEnabled;
  }

  switchAirResistance(isEnabled: boolean = !this.isAirResistanceEnabled): void {
    this.isAirResistanceEnabled = isEnabled;
  }

  switchCollision(isEnabled: boolean = !this.isCollisionEnabled): void {
    this.isCollisionEnabled = isEnabled;
  }

  switchLandGravity(isEnabled: boolean = !this.isLandGravityEnabled): void {
    this.isLandGravityEnabled = isEnabled;
  }

  switchPause(value: boolean = !this.isPaused): void {
    this.isPaused =  value;
  }

  switchGravity(value: boolean = !this.isGravityEnabled): void {
    this.isGravityEnabled = value;
  }
}
