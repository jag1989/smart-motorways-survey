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
		inputsValid: false,
		formWasSubmitted: false,
		showPrimaryForm: true,
		showNonUKMessage: false,
		showSuccess: false,
		isUKDriver: true,
		isUKResident: true,
		jsonSubmissionData: {}
	},
	computed: {
		showValidationErrorMessage() {
			return this.formWasSubmitted && !this.inputsValid;
		}
	},
	watch: {
		showValidationErrorMessage(changedTo) {
			if (changedTo == true) {
				Vue.nextTick().then(() => {
					document.getElementById("error-messages").scrollIntoView({
						behavior: "smooth"
					});
				});
			}
		},
		showSuccess() {
			this.showPrimaryForm = !this.showPrimaryForm;
		}
	},
	methods: {
		initDB() {
			const firebaseCredentials = {
				apiKey: `${this.dbApiKey}`,
				authDomain: `${this.dbProjectId}.firebaseapp.com`,
				projectId: `${this.dbProjectId}`
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
		addSubmission() {
			if (this.db !== null) {
				this.db.collection(this.dbCollection).add(this.jsonSubmissionData)
					.then(submissionReference => {
						this.showSuccess = true;
					})
					.catch(error => {
						console.log(`Error: ${error}`);
					})
			} else {
				console.log('No DB Connection');
			}
		},
		buildSubmissionData() {
			this.jsonSubmissionData = {
				submissionDate: this.getCurrentDate(),
				personal_1: this.getCurrentValueForRadioInput('personal-1'),
				personal_2: this.getCurrentValueForRadioInput('personal-2'),
				personal_3: this.getCurrentValueForSelect('personal-country'),
				personal_4: this.getCurrentValueForRadioInput('personal-4'),
				personal_5: this.getCurrentValueForRadioInput('personal-5'),
				personal_6: this.getCurrentValueForRadioInput('personal-6'),
				general_1: this.getCurrentValueForRadioInput('general-1'),
				general_2: this.getCurrentValueForRadioInput('general-2'),
				general_3: this.getCurrentValueForRadioInput('general-3'),
				general_4: this.getCurrentValuesForCheckbox('general-4'),
				general_5: this.getCurrentValueForRadioInput('general-5'),
				general_6: this.getCurrentValueForRadioInput('general-6'),
				detail_1: this.getCurrentValueForRadioInput('detail-1'),
				detail_2: this.getCurrentValueForRadioInput('detail-2'),
				detail_3: this.getCurrentValueForRadioInput('detail-3'),
				detail_4: this.getCurrentValueForRadioInput('detail-4'),
				detail_5: this.getCurrentValuesForCheckbox('detail-5'),
				detail_6: this.getCurrentValuesForCheckbox('detail-6'),
				detail_7: this.getCurrentValuesForCheckbox('detail-7'),
				detail_8: this.getCurrentValueForRadioInput('detail-8'),
				detail_9: this.getCurrentValuesForCheckbox('detail-9'),
				detail_10: this.getCurrentValueForRadioInput('detail-10'),
				detail_11: this.getCurrentValueForRadioInput('detail-11'),
				detail_12: this.getCurrentValueForRadioInput('detail-12'),
				comments: this.getCurrentValueForTextArea('additional-comments')
			};
		},
		onPrimarySubmission() {
			this.formWasSubmitted = true;
			this.buildSubmissionData();

			if (this.validate()) {
				this.addSubmission();
			}
		},
		onSecondarySubmission() {
			console.log('secondary submission clicked');
		},
		validate() {
			this.validating = true;
			this.inputsValid = true;

			for (var key in this.jsonSubmissionData) {
				if (this.jsonSubmissionData[key] == null) {
					this.inputsValid = false;
					break;
				}
			}
			this.validating = false;
			return this.inputsValid;
		},
		getCurrentDate() {
			const today = new Date();
			const dd = today.getDate();
			const mm = today.getMonth() + 1;
			const yyyy = today.getFullYear();

			return `${dd}/${mm}/${yyyy}`;
		},
		getCurrentValueForSelect(inputName) {
			const selectElement = document.getElementById(inputName);

			return selectElement.options[selectElement.selectedIndex].value;
		},
		getCurrentValueForRadioInput(inputName) {
			return (document.querySelector(`input[name="${inputName}"]:checked`) !== null) ? document.querySelector(`input[name="${inputName}"]:checked`).value : null;
		},
		getCurrentValueForTextArea(inputName) {
			return (document.querySelector(`input[name="${inputName}"].value`) !== null) ? document.querySelector(`input[name="${inputName}"].value`) : '';
		},
		getCurrentValuesForCheckbox(groupName) {
			const selectedCheckboxes = document.querySelectorAll(`input[name="${groupName}"]:checked`);
			let selectedValues = [];

			if (selectedCheckboxes.length > 0) {
				for (var i = 0; i < selectedCheckboxes.length; i++) {
					selectedValues.push(selectedCheckboxes[i].value)
				}
			} else {
				selectedValues = null;
			}

			return selectedValues;
		}
	},
	created() {
		this.initDB();
	}
});