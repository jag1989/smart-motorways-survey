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

let DATA = {
	personal_1: 'yes',
	personal_2: 'no',
	personal_3: 'Cheshire',
	personal_4: '17-24',
	personal_5: '12+',
	personal_6: '20000',
};

firebase.initializeApp({
	apiKey: API_KEY,
	authDomain: `${PROJECT_ID}.firebaseapp.com`,
	projectId: PROJECT_ID
});
const db = firebase.firestore();

const showSubmissions = () => {
	db.collection(COLLECTION_NAME).get()
		.then(querySnapshot => {
			querySnapshot.forEach(submission => {
				console.log(submission.data());
			})
		});
}

showSubmissions()

// db.collection(COLLECTION_NAME).add(DATA)
// 	.then(submissionReference => {
// 		console.log(`Added: ${submissionReference.id}`);
// 		showSubmissions();
// 	})
// 	.catch(error => {
// 		console.log(`Error: ${error}`);
// 	})