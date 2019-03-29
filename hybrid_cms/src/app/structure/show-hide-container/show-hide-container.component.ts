import { Component, OnInit, ContentChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService} from './../../common.service';
@Component({
  selector: 'app-show-hide-container',
  templateUrl: './show-hide-container.component.html',
  styleUrls: ['./show-hide-container.component.css']
})
export class ShowHideContainerComponent implements OnInit {

  show = false;
  //jcr 416
  is_access_app_operation = true;

  @ContentChild('showhideinput') input;

  @Input() input_group_show: boolean;


  constructor(
    private router: Router,
    private commonService: CommonService
  ) 
  {
    //jcr 416
		this.commonService.check_user_token_valid().subscribe(res => {
			if(res == false) {
			  this.router.navigate(['sign-in']);
			} else {
			  const currentuserdata = this.commonService.get_user_data();
			  const userRole = currentuserdata.role_id;
			  if (userRole !== 1) {
				this.is_access_app_operation = false;
			  }
			}
		  });
  }

  ngOnInit() {
  }
  toggleShow() {
    this.show = !this.show;
    if (this.show) {
      this.input.nativeElement.type = 'text';
    } else {
      this.input.nativeElement.type = 'password';
    }
  }

}
