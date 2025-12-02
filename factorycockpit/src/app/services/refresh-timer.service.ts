import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, interval, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefreshTimerService implements OnDestroy {
  private refreshSubject = new Subject<void>();
  refresh$: Observable<void> = this.refreshSubject.asObservable();

  private timerSub?: Subscription;

  startRefresh(intervalMs: number = 10000) {
    // default to every 10 seconds.
    this.stopRefresh(); // Ensure no duplicates.
    this.timerSub = interval(intervalMs).subscribe(() => {
      this.refreshSubject.next();
    });
  }

  stopRefresh() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = undefined;
    }
  }

  ngOnDestroy() {
    this.stopRefresh();
    this.refreshSubject.complete();
  }
}