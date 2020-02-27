// Import stylesheets
import "./style.css";
import { of, BehaviorSubject, combineLatest, fromEvent } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { switchMap, catchError, tap, map, debounceTime } from "rxjs/operators";
// Workshop sttings
const title = "RxJS Workshop: Gihpy API";
const current_presnetation = "Angular Honduras 🇭🇳";
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
<p><strong>Operators:</strong></p>
<p><a href="https://rxjs.dev/api/fetch/fromFetch">fromFetch</a></p>
<p><a href="https://rxjs.dev/api/operators/switchMap">switchMap</a></p>


<h3>STEP 2: Listen user inputs and reset gifs data</h3>
<p><strong>Operators:</strong></p>
<p><a href="https://www.learnrxjs.io/learn-rxjs/operators/filtering/debouncetime">debounceTime</a></p>
<p><strong>Clases:</strong></p>
<p><a href="https://rxjs.dev/api/index/class/BehaviorSubject">BehaviorSubject</a></p>

<input type="text" id="search" placeholder="Buscar por:" / >

<h3>STEP 3: Set pagination</h3>
<p><strong>Operators:</strong></p>
<p><a href="https://rxjs.dev/api/index/function/combineLatest">combineLatest</a></p>

<input type="number" id="pag" placeholder="Cantidad por página" / >

<h3>STEP 4: Bonus</h3>
<p>Use Angular and Angular Material to upload the Gify App to Firbase</p>
`;

// START HERE 👇👇
console.log(`Welcome to ${title}`);
console.log(`Please place your code below eachinstructions `);

// <h3>STEP 0: SET API CONFIGURATION</h3>
// <p>Giphy API Documentation <a href="https://developers.giphy.com/docs/api#quick-start-guide">from here</a></p>

// <h3>STEP 1: Retrieve data from API and presented on the console</h3>
// <p><strong>Operators:</strong></p>
// <p><a href="https://rxjs.dev/api/fetch/fromFetch">fromFetch</a></p>
// <p><a href="https://rxjs.dev/api/operators/switchMap">switchMap</a></p>

// <h3>STEP 2: Listen user inputs and reset gifs data</h3>
// <p><strong>Operators:</strong></p>
// <p><a href="https://www.learnrxjs.io/learn-rxjs/operators/filtering/debouncetime">debounceTime</a></p>
// <p><strong>Clases:</strong></p>
// <p><a href="https://rxjs.dev/api/index/class/BehaviorSubject">BehaviorSubject</a></p>

// <input type="text" id="search" placeholder="Buscar por:" / >

// <h3>STEP 3: Set pagination</h3>
// <p><strong>Operators:</strong></p>
// <p><a href="https://rxjs.dev/api/index/function/combineLatest">combineLatest</a></p>

// elem ref
const searchBox = document.getElementById("search");
const paginationLimitBox = document.getElementById("pag");
// streams
const searchKeyup$ = fromEvent(searchBox, "keyup");
const paginationLimitKeyup$ = fromEvent(paginationLimitBox, "keyup");
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

const paginationSubject = new BehaviorSubject(search_limit);
const paginationLimit$ = paginationSubject.asObservable();
let pages_number = 0;
// wait .5s between keyups to emit current value
paginationLimitKeyup$
  .pipe(
    map((pagination: any) => {
      const newLimit = pagination.currentTarget.value;
      paginationSubject.next(newLimit);
      return newLimit;
    }),
    debounceTime(500)
  )
  .subscribe();

const giphyApi$ = combineLatest([search$, paginationLimit$]).pipe(
  switchMap(([searchInput, paginationLimitInput]: any) => {
    return fromFetch(
      `${giphyApiURL}/${giphySearchTag}?q=${searchInput}&api_key=${giphyApiKey}&limit=${paginationLimitInput}`
    ).pipe(
      switchMap(response => {
        search_term = searchInput;
        search_limit = paginationLimitInput;
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
        return of({ error: true, message: err.message });
      }),
      map(response => {
        console.log(response.pagination);
        pages_number = Math.round(
          response.pagination.total_count / response.pagination.count
        );
        return response;
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
  console.log(`PAGINATION LIMIT:`);
  console.log(search_limit);
  console.log(`TOTAL PAGES:`);
  console.log(pages_number);
});

// <input type="number" id="pag" placeholder="Cantidad por página" / >

// <h3>STEP 4: Bonus</h3>
// <p>Use Angular and Angular Material to upload the Gify App to Firbase</p>
