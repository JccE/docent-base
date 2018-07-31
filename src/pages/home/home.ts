import { Component, OnInit, EventEmitter } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import {Subscription} from "rxjs";
import { NgForm } from "@angular/forms";

import { QuestionsPage } from '../questions/questions';
import { RegisterPage } from "../register/register";
import { LoginPage }    from "../login/login";
import { ReviewPage } from '../review/review';
import { DashboardPage } from '../dashboard/dashboard';
import { NavigatePage } from '../navigate/navigate';
import { NotapplicablePage } from '../notapplicable/notapplicable';
import { SkippedquestionsPage } from '../skippedquestions/skippedquestions';
import { ActionitemsPage } from '../actionitems/actionitems';


import { AcronymsPage } from '../acronyms/acronyms';
import { DefinitionsPage } from '../definitions/definitions';
import { HelpmenuComponent } from '../../components/helpmenu/helpmenu';
import { AssessmentslistComponent } from "../../components/assessmentslist/assessmentslist";
import { ThreadsListComponent } from "../../components/threads-list/threads-list";
import { AuthService } from "../../services/auth.service";
import { TopbarComponent } from "../../components/topbar/topbar";

import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

import { BackUrl } from "../../services/constants";

var assessmentQuery = gql`
query{
assessments {
	_id
	name
	}
	}
`
var threadsQuery = gql`
query {
	allThreadNames
}
`
var oneAssessment = gql`
query assessment($id: Int!){
	assessment(id: $id) {
questions {
	threadName
}
}

}
`
var createAssessmentMutation = gql`
 mutation createAssessment(                                                                         
     $threads:     [Int],                                                                           
     $location:    String,                                                                          
    $targetMRL:   Int,                                                                             
     $id:          Int,                                                                             
     $scope:       String,                                                                          
     $targetDate:  Date,
		 $deskbookVersion: String,
     $name: String																																					
   ) {                                                                                              
     createAssessment(                                                                              
       threads:    $threads,                                                                        
       location:   $location,                                                                       
       targetMRL:  $targetMRL,                                                                      
       id:         $id,                                                                             
       scope:      $scope,                                                                          
       targetDate: $targetDate, 
       deskbookVersion: $deskbookVersion,
			 name: $name
     ) {                                                                                                                                                                           
          _id                                                          
                                                                                               
       }                                                                                            
     } 
`
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {
	backEnd: true;
  acronymsPage = AcronymsPage;
  definitionsPage = DefinitionsPage;
	loading: boolean;
	allThreads: any;
	assessments: any;

	assForm: any = {};

  members = [];
	ionicForm = {};
	threadsSelected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	location: any;

	private querySubscription: Subscription;

  constructor(public navCtrl: NavController,
							public popOver: PopoverController,
							private apollo: Apollo,
							private auth: AuthService) {

							fetch(BackUrl)
								.then(a => console.log("connected"))
								.catch(e => this.backEnd = false );
	}

	// use form?? 
	createAssessment(event) {
		event.preventDefault();
		if (this.backEnd) {
		var values = this.assForm;
		values.threads = this.threadsSelected;

		this.apollo.mutate({
				mutation:		createAssessmentMutation, 
				variables:	{
				threads:				values.threads,
				location: values.location,
				targetMRL:				values.targetMRL, 
				name: values.name,
				//		levelSwitching:		false,
				//		deskBookVersion:	"2017",
				scope: values.scope,
				targetDate: values.targetDate,

				}
		})
			.subscribe(({data}) => {
					this.page_2(data.createAssessment._id);
			});
		}
	}

	ngOnInit() {
	if (this.backEnd) {
	this.querySubscription = this.apollo.watchQuery<any>({
		query: assessmentQuery
		})
		 .valueChanges
		 .subscribe(({data, loading}) => {
		 this.loading = loading;
		 this.assessments = data.assessments
		 });
	this.querySubscription = this.apollo.watchQuery<any>({
		query: threadsQuery 
		})
		 .valueChanges
		 .subscribe(({data, loading}) => {
				this.allThreads = data.allThreadNames.map(a => ({name: a, index: data.allThreadNames.indexOf(a) + 1}))
		 });
	}
	}


	showAssessmentsList(myEvent) {
	var popoverClick = this.popOver.create(AssessmentslistComponent, {assessments: this.assessments});	
		popoverClick.present({
			ev: myEvent
		});
	}

  showPopover(myEvent) {
    var popoverClick = this.popOver.create(HelpmenuComponent, {}, {cssClass: 'help-menu'});
      popoverClick.present({
        ev: myEvent
      });
    }	

	showThreads(myEvent) {
		myEvent.preventDefault();
		
		let myEmitter = new EventEmitter<any>();
		myEmitter.subscribe( v =>  this.toggleThread(v.index));

		var popoverClick = this.popOver.create(ThreadsListComponent, {allThreads: this.allThreads, emitter: myEmitter, threadsSelected: this.threadsSelected});
      popoverClick.present({
        ev: myEvent
      });
	}

	toggleThread(thread) {
		var {threadsSelected} = this;
		threadsSelected.includes(thread) ? 
		threadsSelected = threadsSelected.filter(a => a !== thread) :
		threadsSelected.push(thread)

		threadsSelected.sort((a,b) => a-b);
	}

  addMember(nameIn:string,roleIn:string){
    var newMember = {name: nameIn, role: roleIn};
    this.members.push(newMember);
  }

  removeMember(){
    this.members.pop()
  }

  questions(date,val,loc){
    this.navCtrl.push(QuestionsPage,{
      mrl: val,
      date: date,
      location: loc
    });
  }

  page_2(_id){
    this.navCtrl.push(QuestionsPage,{
		data: _id });}
}
