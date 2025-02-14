import {Injectable} from "@angular/core";
import {Vector2} from "../../common/util/model/vector2";
import { reflectVector } from "../../common/util/vector.util";
import { Shape} from "../../model/entity";

@Injectable({ providedIn: 'root' })
export class ContactResolvingService {
  resolve(shapes: Shape[]): void {
    shapes
      .forEach(this.handleContact.bind(this));
  }

  // TODO: can handle both shapes at the same time if need optimization
  private handleContact(shape: Shape): void {
    if (!shape.hasContact()) {
      return;
    }

    for (let contact of shape.contacts) {
      const shape1Speed: number = shape.getSpeed();
      const shape2Speed: number = contact.shape.getSpeed();

      const shape1: Shape = shape;
      const shape2: Shape = contact.shape;

      const newCircle1Speed: number
        = Math.abs((2 * shape2.mass * shape2Speed + shape1Speed * (shape1.mass - shape2.mass))
        / (shape1.mass + shape2.mass));

      const reflectedDirection: Vector2 = reflectVector(
        shape.direction(),
        contact.normal
      );

      shape1.velocity.x = reflectedDirection.x * newCircle1Speed;
      shape1.velocity.y = reflectedDirection.y * newCircle1Speed;

      shape1.removeContact(contact.id);
    }
  }
}
