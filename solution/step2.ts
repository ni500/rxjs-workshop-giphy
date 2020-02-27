// Import stylesheets
import "./style.css";
import { of, BehaviorSubject, combineLatest, fromEvent } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { switchMap, catchError, tap, map, debounceTime } from "rxjs/operators";
// Workshop sttings
const title = "RxJS Workshop: Gihpy API";
const current_presnetation = "Angular Honduras";
// HTML
const appDiv: HTMLElement = document.getElementById("app");
// STEP 0: SET API CONFIGURATION
// Giphy API Documentation from: https://developers.giphy.com/docs/api#quick-start-guide
const giphyApiURL = "https://api.giphy.com/v1/gifs";
const giphySearchTag = "search";
let search_term = "Angular Honduras";
let search_limit = 20;
// TO DO: Replace for your own API_KEY at https://developers.giphy.com/dashboard/
const giphyApiKey = "TrOGqCcvWgEZMlGSVx8hoS1q1v46KFZ6";

appDiv.innerHTML = `
<h1>${title}</h1>
<h2>${current_presnetation}</h2>
<p>This is a playground with the Giphy API to practice and master RxJS 😎</p>
<p>Open the Console below and start coding!👇</p>
<hr>
<h3>STEP 0: SET API CONFIGURATION</h3>
<p>Giphy API Documentation <a href="https://developers.giphy.com/docs/api#quick-start-guide">from here</a></p>
<h3>STEP 1: Retrieve data from API and presented on the console</h3>
<p>OPERATOR: <a href="https://rxjs.dev/api/fetch/fromFetch">fromFetch</a></p>
<p>OPERATOR: <a href="https://rxjs.dev/api/operators/switchMap">switchMap</a></p>
<h3>STEP 2: Listen user inputs and reset gifs data</h3>
<p>OBSERVABLE: <a href="https://rxjs.dev/api/index/class/BehaviorSubject">BehaviorSubject</a></p>

<p>Buscando: ${search_term}</p>
<input type="text" id="search" / >


<h3>STEP 3: Set pagination</h3>
<p>OBSERVABLE: <a href="https://rxjs.dev/api/index/function/combineLatest">combineLatest</a></p>
<h3>STEP 4: Bonus</h3>
<p>Use Angular and Angular Material to upload the Gify App to Firbase</p>
`;

// START HERE 👇👇
console.log(`Welcome to ${title}`);
console.log(`Please place your code below eachinstructions `);

//<h3>STEP 1: Retrieve data from API and presented on the console</h3>
//<p>OPERATOR: <a href="https://rxjs.dev/api/fetch/fromFetch">fromFetch</a></p>
//<p>OPERATOR: <a href="https://rxjs.dev/api/operators/switchMap">switchMap</a></p>

//<h3>STEP 2: Listen user inputs and reset gifs data</h3>
//<p>OBSERVABLE: <a href="https://rxjs.dev/api/index/class/BehaviorSubject">BehaviorSubject</a></p>

// elem ref
const searchBox = document.getElementById("search");
// streams
const searchKeyup$ = fromEvent(searchBox, "keyup");
const searchSubject = new BehaviorSubject(search_term);
const search$ = searchSubject.asObservable();

// wait .5s between keyups to emit current value
searchKeyup$
  .pipe(
    map((i: any) => {
      const newSearch = i.currentTarget.value;
      searchSubject.next(newSearch);
      return newSearch;
    }),
    debounceTime(500)
  )
  .subscribe();

const giphyApi$ = search$.pipe(
  switchMap((searchInput: any) => {
    return fromFetch(
      `${giphyApiURL}/${giphySearchTag}?q=${searchInput}&api_key=${giphyApiKey}&limit=${search_limit}`
    ).pipe(
      switchMap(response => {
        search_term = searchInput;
        if (response.ok) {
          // OK return data
          return response.json();
        } else {
          // Server is returning a status requiring the client to try something else.
          return of({ error: true, message: `Error ${response.status}` });
        }
      }),
      catchError(err => {
        // Network or other error, handle appropriately
        console.error(err);
        return of({ error: true, message: err.message });
      })
    );
  })
);

let gifs = [];
giphyApi$.subscribe(response => {
  console.log(`API FETCH RESULT`);
  console.log(response);
  console.log(`GIFS:`);
  gifs = response.data;
  console.log(gifs);
  console.log(`SEARCH TERM:`);
  console.log(search_term);
});

// STEP 3: Retrieve data from API and presented on the console
// OPERATOR: fromFetch https://rxjs.dev/api/fetch/fromFetch

// STEP 4: Retrieve data from API and presented on the console
// OPERATOR: fromFetch https://rxjs.dev/api/fetch/fromFetch
