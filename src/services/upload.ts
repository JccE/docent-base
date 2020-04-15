import { Injectable } from "@angular/core";
import * as upload from "./azure-storage.blob.min";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { DocentStorageAccount, SAS } from "./constants";
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http"
import { AuthUrl } from "./constants";


var createFileMutation = gql`
	mutation addFile( $assessmentId: String
										$questionId:   Int
										$url:          String
										$name:         String )
    {
			addFile( assessmentId: $assessmentId
               questionId:   $questionId
               url:          $url
               name:         $name )
			{
				caption
			}
		}
`


@Injectable()
export class UploadService {

	accountName: string = DocentStorageAccount;
	sas:         string = SAS;

	constructor(private apollo: Apollo,
											private auth: AuthService,
                      private http: HttpClient) {
											}



	uploadFile(file, assessmentId, questionId) {
		console.log("UploadFile: $$$$$$$$$$$");
		const blobUri = `https://${this.accountName}.blob.core.windows.net`;
		console.log("Blob service start: **********");
		const blobService = upload.createBlobServiceWithSas(blobUri, this.sas);
		console.log("Blob service end: **********");

		console.log("Blob service Create start: **********");
		blobService.createBlockBlobFromBrowserFile('test', file.name, file,
		(error, result) => {
			console.log("Blob service Create error: **********");
			if (error) {	console.error(error); }
				console.log("Blob service Create error: **********");
				 else {
					 console.log("Blob service should be a success");
						var url = this.generateUrl(file.name);
						this.createGQL(url, assessmentId, Number(questionId), file.name);
				 }
		});
		console.log("Blob service Create end: **********");

		console.log("End UploadFile: $$$$$$$$$$$");
		return {name: file.name, questionId: questionId, url: this.generateUrl(file.name)};
	}

	uploadJSON(file){
		var user = this.auth.currentUser();
		var jsonRoute = AuthUrl + "uploadJSON"

		var fileInfo = {
			file: file,
			email: user.email
		}
		return this.http.post(jsonRoute, fileInfo);
	}

	generateUrl(name) {
		return `https://${this.accountName}.blob.core.windows.net/test/${name}`
	}

	createGQL(url, assessmentId, questionId, name) {
		this.apollo.mutate({
			mutation: createFileMutation,
			variables: {
				url,
				assessmentId,
				questionId,
				name
			}
		}).subscribe(a => null);
	}

	// createGQLJSON(url, userId, name) {
	//
	// }

}
