import {Injectable} from "@angular/core";
import {fromEvent, map, Observable, tap} from "rxjs";

type KeyboardEvent = {
  event: Event;
}

@Injectable({ providedIn: 'root' })
export class KeyboardEventService {
  readonly keyDownEvent$: Observable<KeyboardEvent> = this.getKeyboardEvent();

  private getKeyboardEvent(): Observable<KeyboardEvent> {
    return fromEvent(document, 'keydown').pipe(
      map((event: Event): KeyboardEvent => ({ event })),
    );
  }
}
