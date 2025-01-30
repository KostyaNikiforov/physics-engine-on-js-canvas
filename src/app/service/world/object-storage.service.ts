import {Injectable} from "@angular/core";
import {Shape} from "../../model/shape";

@Injectable({
  providedIn: 'root'
})
export class ObjectStorageService {
  private objects: Shape[] = [];

  add(shape: Shape): void {
    this.objects.push(shape);
  }

  getAll(): Shape[] {
    return this.objects;
  }

  removeAll(): void {
    this.objects = [];
  }

  isEmpty(): boolean {
    return this.objects.length === 0;
  }
}
