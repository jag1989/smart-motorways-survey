/*
 * Methods to read and write to Firebase Firestore
 *
 * Required variables will be imported from private.js
 *
 * API_KEY
 * PROJECT_ID
 * COLLECTION_NAME
 *
 */

window.firebase.apikey = API_KEY;
window.firebase.projectId = PROJECT_ID;
window.firebase.collection = COLLECTION_NAME;

new Vue({
	el: "#survey-app",
	data: {
		db: null,
		dbCollection: window.firebase.collection,
		dbApiKey: window.firebase.apikey,
		dbProjectId: window.firebase.projectId,
		validating: false,
		successfulSubmission: false
	},
	methods: {
		initDB() {
			const firebaseCredentials = {
				apiKey: `${this.dbApiKey}`,
				authDomain: `${this.projectId}.firebaseapp.com`,
				projectId: `${this.projectId}`
			};

			firebase.initializeApp(firebaseCredentials);
			this.db = firebase.firestore();

		},
		listSubmissions() {
			if (this.db !== null) {
				this.db.collection(this.dbCollection).get()
					.then(querySnapshot => {
						querySnapshot.forEach(submission => {
							console.log(submission.data());
						})
					})
					.catch(error => {
						console.log(`Error: ${error}`);
					});
			} else {
				console.log('No DB Connection');
			}
		},
		addSubmission(jsonCollectionData) {
			if (this.db !== null) {
				this.db.collection(this.dbCollection).add(jsonCollectionData)
					.then(submissionReference => {
						this.successfulSubmission = true;
						// TODO: Remove after debugging
						console.log(`Added: ${submissionReference.id}`);
						this.listSubmissions();
					})
					.catch(error => {
						console.log(`Error: ${error}`);
					})
			} else {
				console.log('No DB Connection');
			}
		},
		buildSubmissionData() {
			return {
				personal_1: 'yes',
				personal_2: 'no',
				personal_3: 'Cheshire',
				personal_4: '17-24',
				personal_5: '12+',
				personal_6: '20000',
			};
		},
		onPrimarySubmission() {
			console.log('primary submission clicked');
			if (this.validate()) {
				const jsonSubmissionData = this.buildSubmissionData();
				this.addSubmission(jsonSubmissionData);
			}
		},
		onSecondarySubmission() {
			console.log('secondary submission clicked');
		},
		validate() {
			this.validating = true;
			let valid = false;

			// TODO: Validate user inputs
			valid = true;

			this.validating = false;
			return valid;
		}
	},
	created() {
		this.initDB();
	}
});