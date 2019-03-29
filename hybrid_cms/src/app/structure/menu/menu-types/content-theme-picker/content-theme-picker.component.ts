import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from './../../../../common.service';

@Component({
	selector: 'content-theme-picker',
	templateUrl: './content-theme-picker.component.html',
	styleUrls: ['./content-theme-picker.component.css']
})
export class ContentThemePickerComponent implements OnInit {

	appId: string;

	@Input()
	pickedTheme: number = -1;

	@Input()
	themes: any = [];

	@Output()
	change: EventEmitter<number> = new EventEmitter<number>();

	constructor(private commonService: CommonService) {
	}

	themePick(theme: number) {
		this.change.emit(theme);
	}

	ngOnInit() {
		
	}

}