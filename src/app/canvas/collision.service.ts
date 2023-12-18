import {Injectable} from "@angular/core";
import {ObjectStorageService} from "./object-storage.service";
import {Shape} from "../model/shape";
import {Circle} from "../model/circle";
import {CANVAS_PROPERTY} from "./canvas.component";

@Injectable({
  providedIn: 'root'
})
export class CollisionService {
  private lowestVelocity: number = 0.9;

  constructor(
    private objectStorageService: ObjectStorageService,
  ) {
  }

  handleCollisionWithBorders(): void {
    this.objectStorageService.getAll().forEach(
      (circle: Circle): void => {
        if (circle.position.x < circle.radius) {
          circle.position.x = circle.radius;
          circle.velocity.x = -(circle.velocity.x * this.lowestVelocity);
        }

        if (circle.position.x > CANVAS_PROPERTY.width - circle.radius) {
          circle.position.x = CANVAS_PROPERTY.width - circle.radius;
          circle.velocity.x = -(circle.velocity.x * this.lowestVelocity);
        }

        if (circle.position.y < circle.radius) {
          circle.position.y = circle.radius;
          circle.velocity.y = -(circle.velocity.y * this.lowestVelocity);
        }

        if (circle.position.y > CANVAS_PROPERTY.height - circle.radius) {
          circle.position.y = CANVAS_PROPERTY.height - circle.radius;
          circle.velocity.y = -(circle.velocity.y * this.lowestVelocity);
        }
      }
    );
  }
}
