const giphyApi$ = combineLatest([searchInput$, paginatorInput$])
  .pipe(
    switchMap((data: any) => {
    return fromFetch(
      `${giphyApiURL}/${giphySearchTag}?q=${data[0]}&api_key=${giphyApiKey}&limit=${data[1].pageSize}`
    ).pipe(
      switchMap(response => {
        console.log(search);
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
    map((data: any) => {
      console.log(data);
      //searchInput.next(data[0].currentTarget.value);
    }),
    debounceTime(500)
  )
  .subscribe();

const gifsL = document.getElementById("gifsList");
let text = "<ul>";
let gifs = [];
giphyApi$.subscribe(response => {
  console.log(`API FETCH RESULT`);
  console.log(response);
  gifs = response.data;
});