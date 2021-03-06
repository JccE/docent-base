import { Component } from '@angular/core';
import { NavParams, ToastController } from 'ionic-angular';
import { UploadService } from "../../services/upload";

@Component({
  selector: 'json-upload-popover',
  templateUrl: 'json-upload-popover.html'
})

export class JsonUploadPopoverComponent {

	questionId:		string;
	assessmentId: string;
	emitter:			any;
	file:         any;
	user: any;
	finalFile: any;

	constructor(	public upload: UploadService,
								public navParams: NavParams,
                private toastCtrl: ToastController ) {

		var {navParams} = this;

		this.questionId		= navParams.get("questionId");
		this.assessmentId = navParams.get("assessmentId");
		this.emitter			= navParams.data.emitter;

  }

	setFile(e) {
		this.file = e.target.files[0];
	}

	ngOnInit() {
		console.log("this has an on-init function");
		var styling = `
		padding: 30px;
    height: 400px;
		width: 800px;
		`

		var test = document.getElementsByClassName("popover-content")

    var newVar = test[test.length - 1] as HTMLElement;

				newVar.style.cssText = styling
	}

  
  invalidJSONToast() {
	  var toast = this.toastCtrl.create({
	    message: 'It appears this file is not valid JSON',
	    duration: 4500,
      showCloseButton: true,
      position: 'top',
      cssClass: 'error-toast'
	  });

    toast.present();
  }

  unknownErrorToast() {
	  var toast = this.toastCtrl.create({
	    message: 'Unknown error',
	    duration: 4500,
      showCloseButton: true,
      position: 'top',
      cssClass: 'error-toast'
	  });

    toast.present();
  }

  async uploadJSON(event){
    // TODO -- change this to allow user input to name the file.
		// var fileName = this.file.name;
		var fileReader = new FileReader();
		fileReader.readAsText(this.file);
		fileReader.onloadend = () => {

    try { 
			var finalFile = {
				file: JSON.parse(fileReader.result),
				fileName: this.file.name
		}
    
		var uploadResponse = this.upload.uploadJSON(finalFile);
    <any>uploadResponse.subscribe(a => {
	    var user = localStorage.getItem('docent-token');
	    user = JSON.parse(user);
	    (<any>user).user = a;
	    localStorage.setItem('docent-token', JSON.stringify(user));
		})
    }
    catch (error) {
       if (error.message.includes('Unexpected token')) {
        this.invalidJSONToast();       
       } else {
        this.unknownErrorToast(); 
       }
    }
		}
  }
}
