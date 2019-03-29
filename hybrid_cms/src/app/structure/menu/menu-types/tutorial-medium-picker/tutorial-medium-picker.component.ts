import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonService } from './../../../../common.service';
import { Constants } from '../../constants';

declare var $: any;
declare var jQuery: any;

@Component({
	selector: 'tutorial-medium-picker',
	templateUrl: './tutorial-medium-picker.component.html',
	styleUrls: ['./tutorial-medium-picker.component.css']
})
export class TutorialMediumPickerComponent implements AfterViewInit {

	mediaTypes = [
	    {
	        name: 'Image',
	        value: this.IMAGE
	    },
	    {
	        name: 'Video',
	        value: this.VIDEO
	    }
	];

	mediumData = {
		type: this.IMAGE,
		url: ''
	};

	@Input() removable: boolean = false;

    @Input() index: number = -1;

    @Output()
    remove: EventEmitter<number> = new EventEmitter<number>();

    @Output()
    corruptImage: EventEmitter<any> = new EventEmitter<any>();

	@Output() slideDataChange = new EventEmitter();

	@Input()
	get slideData() {
		return this.mediumData;
	}

	set slideData(val) {
		this.mediumData = val;
		this.slideDataChange.emit(this.mediumData);
	}

	get IMAGE() {
		return Constants.IMAGE;
	}

	get VIDEO() {
		return Constants.VIDEO;
	}

	constructor(private commonService: CommonService) {
	}

	ngAfterViewInit() {
		let fileWrapper = $(`[name="file_upload_${this.index}"]`);
		const drEvent = fileWrapper.dropify({
	      defaultFile: this.slideData.type == this.IMAGE ? this.slideData.url : null
	    });
	    drEvent.change(() => {
	    	fileWrapper.simpleCropper(1242, 2208);
	    });
	    drEvent.on('changed', (event) => {
	    	this.corruptImage.emit(this.index);
	    })
	    drEvent.on('dropify.afterClear', (event) => {
		    this.corruptImage.emit(this.index);
		});
	}

	removePicker() {
		this.remove.emit(this.index);
	}


}