import {Injectable} from "@angular/core";
import {Shape} from "../model/entities/shape";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ObjectStorageService {
  private readonly objectsNumber: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  readonly objectsNumber$: Observable<number> = this.objectsNumber.asObservable();

  private objects: Shape[] = [];

  add(shape: Shape): void {
    this.objectsNumber.next(this.objects.length + 1);
    this.objects.push(shape);
  }

  getAll(): Shape[] {
    return this.objects;
  }

  removeAll(): void {
    this.objectsNumber.next(0);
    this.objects = [];
  }

  isEmpty(): boolean {
    return this.objects.length === 0;
  }

  removeLast(): void {
    this.objectsNumber.next(this.objects.length - 1);
    this.objects.pop();
  }
}
