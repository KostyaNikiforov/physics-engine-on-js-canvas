import {Injectable} from "@angular/core";
import {BehaviorSubject, map, Observable, startWith, Subject} from "rxjs";

const TIME_SPEED_COEFFICIENT: number = 100;

export const INITIAL_TIME_SPEED: number = 1;

@Injectable({
  providedIn: 'root'
})
export class ToolBarService {
  private readonly timeSpeed: Subject<number> = new Subject<number>();
  readonly timeSpeedChanged$: Observable<number> = this.timeSpeed.asObservable();
  readonly timeSpeedValue$: Observable<number> = this.timeSpeed.pipe(
    startWith(INITIAL_TIME_SPEED),
    map((value: number): number => value * TIME_SPEED_COEFFICIENT)
  );

  private isLandGravityEnabled: boolean = true;
  private isAirResistanceEnabled: boolean = true;
  private isGravityEnabled: boolean = false;
  private isCollisionEnabled: boolean = true;
  private isBorderCollisionEnabled: boolean = true;
  private isPaused: boolean = false;

  private circleRadius: number = 10;
  private _speed: number = 0;
  private _direction: number = 0;

  set timeSpeedValue(value: number) {
    this.timeSpeed.next(value / TIME_SPEED_COEFFICIENT);
  }

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
