import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import Helpers from '../helpers';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class TextareaService {
	private queue = [];
	private subject = new Subject<any>();

	constructor() {
		this.checkQueue().subscribe(async options => {
			for(;;) {
				if (this.queue.length > 0) {
					await sleep(100);
					try {
						let iframe = $(`iframe[id="${options.target.name}_ifr"]`);
						let background = Helpers.getBackground();

						$("html", iframe.contents())[0].style.background = Helpers.getBackground();
						$("body", iframe.contents())[0].style.background = Helpers.getBackground();
					} finally {
						continue;	
					}
				}
				else {
					this.queue.push(options);
					for (let i = 0; i < 4; i++) {
						await sleep(500);
						(<any>window).tinymce.init(options);

						try {
							let iframe = $(`iframe[id="${options.target.name}_ifr"]`);
							let background = Helpers.getBackground();

							$("html", iframe.contents())[0].style.background = Helpers.getBackground();
							$("body", iframe.contents())[0].style.background = Helpers.getBackground();	
						} finally {
							
						}
					}
					this.queue.shift();
					break;
				}
			}
			return;
		});
	}

	putQueue(options) {
		this.subject.next(options);
	}

	checkQueue(): Observable<any> {
		return this.subject.asObservable();
	}
}