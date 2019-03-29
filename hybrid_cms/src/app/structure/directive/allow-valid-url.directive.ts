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
  selector: '[appAllowValidUrl][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AllowValidUrlDirective,
      multi: true
    }
  ]
})
export class AllowValidUrlDirective {

  validator: ValidatorFn;

  constructor(private mS: MessageService) {
    this.validator = this.urlValidator();
  }
  validate(c: FormControl) {
    return this.validator(c);
  }

  urlValidator(): ValidatorFn {
    return (c: FormControl) => {

      // let isValid = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/){1}[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(c.value);

      // let isValid = /^((?!ftp:\/\/)(?!http:\/\/)(?!https:\/\/))?([a-z0-9+!*(),;?&=.-]+(:[a-z0-9+!*(),;?&=.-]+)?@)?([a-z0-9\-\.]*)\.(([a-z]{2,4})|([0-9]{1,3}\.([0-9]{1,3})\.([0-9]{1,3})))(:[0-9]{2,5})?(\/.*)?$/.test(c.value);

      // try {
      //     const newUrl = c.value.replace(/^ftp:\/\/|http:\/\/|https:\/\/|:\/\/| /g, "");
      //     c.setValue(newUrl);
      //   } catch (ex) {
      // }

      let isValid = /([a-z0-9+!*(),;?&=.-]+(:[a-z0-9+!*(),;?&=.-]+)?@)?([a-z0-9\-\.]*)\.(([a-z]{2,4})|([0-9]{1,3}\.([0-9]{1,3})\.([0-9]{1,3})))(:[0-9]{2,5})?(\/.*)?$/.test(c.value);

      if(isValid)
      {
        this.mS.setSaveDisable(false);
        return null;
      }
      else
      {
        this.mS.setSaveDisable(true);
        return {
          appAllowValidUrl: {
            valid: false
          }
        };
      }
    }
  }

}
