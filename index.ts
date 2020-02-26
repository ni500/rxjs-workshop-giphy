// Import stylesheets
import "./style.css";
import { of } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { switchMap, catchError } from "rxjs/operators";
// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById("app");
appDiv.innerHTML = `
<h1>RxJS Workshop: Gihpy</h1>
<h2>Angular Honduras</h2>
`;

// Get the documentation from

const giphyApiURL = "https://api.giphy.com/v1/gifs";
const giphySearchTag = "search";

let limit = 20;

// TO DO: Replace for your own API_KEY at https://developers.giphy.com/dashboard/
const giphyApiKey = "TrOGqCcvWgEZMlGSVx8hoS1q1v46KFZ6";

const gifs$ = fromFetch(
  "https://api.giphy.com/v1/gifs/search?q=angular+honduras&api_key=TrOGqCcvWgEZMlGSVx8hoS1q1v46KFZ6&limit=20"
).pipe(
  switchMap(response => {
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

gifs$.subscribe(x => console.log(x));
