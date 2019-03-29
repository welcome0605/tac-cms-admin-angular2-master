import { Directive } from '@angular/core';
import {
  ReactiveFormsModule,
  NG_VALIDATORS,
  FormsModule,
  FormGroup,
  FormControl,
  ValidatorFn,
  Validator
} from '@angular/forms';
import { MessageService } from './../../message.service';

@Directive({
  selector: '[appAllowValidEmail][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AllowValidEmailDirective,
      multi: true
    }
  ]
})
export class AllowValidEmailDirective
{

  validator: ValidatorFn;

  constructor(private mS: MessageService) {
    this.validator = this.emailValidator();
  }
  validate(c: FormControl) {
    return this.validator(c);
  }

  emailValidator(): ValidatorFn
  {
    return (c: FormControl) => {

      let isValid = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(c.value);

      if(isValid)
      {
        this.mS.setSaveDisable(false);
        return null;
      }
      else
      {
        this.mS.setSaveDisable(true);
        return {
          appAllowValidEmail:
          {
            valid: false
          }
        };
      }
    }
  }

}
