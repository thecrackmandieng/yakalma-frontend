import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private showSuccessModalSubject = new BehaviorSubject<boolean>(false);
  private showErrorModalSubject = new BehaviorSubject<boolean>(false);
  private errorMessageSubject = new BehaviorSubject<string>('');

  showSuccessModal$ = this.showSuccessModalSubject.asObservable();
  showErrorModal$ = this.showErrorModalSubject.asObservable();
  errorMessage$ = this.errorMessageSubject.asObservable();

  showSuccessModal() {
    this.showSuccessModalSubject.next(true);
  }

  hideSuccessModal() {
    this.showSuccessModalSubject.next(false);
  }

  showErrorModal(message: string) {
    this.errorMessageSubject.next(message);
    this.showErrorModalSubject.next(true);
  }

  hideErrorModal() {
    this.showErrorModalSubject.next(false);
  }
}
