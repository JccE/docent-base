import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { QuestionsPage } from '../../pages/questions/questions';

import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

var assessmentQuery = gql`
query assessment($_id: String!) {
	assessment(_id: $_id) {
		questions{
      subThreadName
      questionText
      questionId
			mrLevel
    }
	}
}
`

/**
 * Generated class for the SubthreadPopupComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'subthread-popup',
  templateUrl: 'subthread-popup.html'
})
export class SubthreadPopupComponent {

	public targetMRL: any;
	public questions: any;
	public currentQuestions: any;
	@Input() public assessmentId: any;
	@Input() private subTitle: any;

  constructor(private apollo: 			 Apollo,
							 public navCtrl: 			 NavController,
							 public navParams: 		 NavParams) {}

	 ngOnInit() {
	 	this.assessmentId ? this.getAssessmentData() : null;
	 }

	 getAssessmentData() {
	 	this.apollo.watchQuery<any>({
	 		query: assessmentQuery,
	 		variables: {
	 			_id: this.assessmentId
	 		}
	 	}).valueChanges
	 		.subscribe( ({data, loading}) => {
	 			console.log(data);
	 			this.targetMRL  = data.assessment.targetMRL;
				this.questions = data.assessment.questions;
	 		});
	 }

  navToQuestion(questionId) {
		this.navCtrl.push(QuestionsPage, {
			data: 			this.assessmentId,
			questionId: questionId
		});
	}

}
