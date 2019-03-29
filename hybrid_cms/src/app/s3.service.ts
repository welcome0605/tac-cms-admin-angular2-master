import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../environments/environment';

@Injectable()
export class S3Service {

	constructor(
		private http: HttpClient
	) { 
	}

	deleteFileByUrl(url: string) {
		this.http.delete(`${environment.s3ApiUrl}/images/?key=${url.split("/").pop()}`)
			.subscribe(
				res => {
					console.log(res);
				},
				err => {
					console.log(err);
				}
			);
	}

	uploadBase64(base64: Blob) {
		const data = {'image': base64};
		return this.http.post(`${environment.s3ApiUrl}/images`, data);
	}

	uploadAppData(fileData:any) {
		const data = {'file_data': fileData}
		return this.http.post(`${environment.s3ApiUrl}/appdata`, data);
	}

	uploadFirebase(fileData:any) {
		const data = {'file_data': fileData}
		return this.http.post(`${environment.s3ApiUrl}/firebaseinfo`, data);		
	}
}