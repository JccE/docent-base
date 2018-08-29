import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"
import {tap} from "rxjs/operators";

import { AuthUrl } from "./constants";

@Injectable() 

export class AuthService {

constructor(private http: HttpClient) {}

	registerUrl = AuthUrl + "register";
	loginUrl    = AuthUrl + "login";

	registerUser(user) {
		return this.http.post(this.registerUrl, user)
	}

	login(userCreds) {
		return this.http.post(this.loginUrl, userCreds)
		.pipe( tap( data => this.setSession(data), 
		            error => console.log(error)
		          )
		)
	}

	public logout() {
		localStorage.removeItem("docent-token");
	}

	private setSession(isAuthed) {
		console.log(isAuthed);
		localStorage.setItem("docent-token", JSON.stringify(isAuthed))
	}

	public isLoggedIn = () => !!localStorage.getItem("docent-token") 
}
