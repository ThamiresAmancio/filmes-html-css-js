import { API_KEY } from "./key.js"

const moviesContainer = document.querySelector('.movies')
const input = document.querySelector('input')
const searchButton = document.querySelector('.searchIcon')
const checked = document.querySelector("#onlyFavorites")


function cleanAllMovies() {
  moviesContainer.innerHTML = ''
}

function verificationChecked () {
 if(checked.checked){
  cleanAllMovies()
  const movies = getFavoriteMovies() 
  movies.forEach(movie => renderMovie(movie))
 }
 else{
  cleanAllMovies()
  renderizandoFilmes()
 }
}

async function searchMovie() {
  if (input.value != '') {
    cleanAllMovies()
    const movies = await getFilterMovies()
    movies.forEach(movie => renderMovie(movie))
  }
}

async function getFilterMovies() {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${input.value}&language=en-US&page=1`).then( result => result.json())
    return response.results
}

async function getPopularMovies() {
  const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`).then( result => result.json());
  return response.results
} 

function favoriteButtonPressed(event, movie) {
  const favoriteState = {
    favorited: 'img/Vector.svg',
    
    notFavorited: 'img/Heart.svg'
  }

  if(event.target.src.includes(favoriteState.notFavorited)) {
    event.target.src = favoriteState.favorited
    console.log('SIM')
    return saveToLocalStorage(movie)
  } else {
    event.target.src = favoriteState.notFavorited
    console.log('NÃO')
    return removeFromLocalStorage(movie.id)
  }
}

function getFavoriteMovies() {
  return JSON.parse(localStorage.getItem('favoriteMovies'))
}

function saveToLocalStorage(movie) {
  const movies = getFavoriteMovies() || []
  movies.push(movie)
  const moviesJSON = JSON.stringify(movies)
  localStorage.setItem('favoriteMovies', moviesJSON)
}

function checkMovieIsFavorited(id) {
  const movies = getFavoriteMovies() || []
  return movies.find(movie => movie.id == id)
}

function removeFromLocalStorage(id) {
  const movies = getFavoriteMovies() || []
  const findMovie = movies.find(movie => movie.id == id)
  const newMovies = movies.filter(movie => movie.id != findMovie.id)
  localStorage.setItem('favoriteMovies', JSON.stringify(newMovies))
}

//redenrizando os filmes
async function renderizandoFilmes() {
  const movies = await getPopularMovies()
  movies.forEach(movie => renderMovie(movie))
}

function renderMovie(movie) {

  const { id, title, poster_path, vote_average, release_date, overview } = movie
  const isFavorited = checkMovieIsFavorited(id)

  const year = new Date(release_date).getFullYear()
  
  const movieElement = document.createElement('div')
  movieElement.classList.add('movie')
  moviesContainer.appendChild(movieElement)

  const movieInformations = document.createElement('div')
  movieInformations.classList.add('movie-informations')

  const movieImageContainer = document.createElement('div')
  movieImageContainer.classList.add('movie-image')
  const movieImage = document.createElement('img')
  movieImage.src = `https://image.tmdb.org/t/p/w500${poster_path}`
  movieImage.alt = `${title} Poster`
  movieImageContainer.appendChild(movieImage)
  movieInformations.appendChild(movieImageContainer)

  const movieTextContainer = document.createElement('div')
  movieTextContainer.classList.add('movie-text')
  const movieTitle = document.createElement('h4')
  movieTitle.textContent = `${title} (${year})`
  movieTextContainer.appendChild(movieTitle)
  movieInformations.appendChild(movieTextContainer)

  const informations = document.createElement('div')
  informations.classList.add('movie-informations')
  movieTextContainer.appendChild(informations)

  const ratingContainer = document.createElement('div')
  ratingContainer.classList.add('rating')
  const starImage = document.createElement('img')
  starImage.src = 'img/Star.svg'
  starImage.alt = 'Star'
  const movieRate = document.createElement('span')
  movieRate.classList.add('movie-rate')
  movieRate.textContent = vote_average
  ratingContainer.appendChild(starImage)
  ratingContainer.appendChild(movieRate)
  informations.appendChild(ratingContainer)

  const favorite = document.createElement('div')
  favorite.classList.add('favorite')
  const favoriteImage = document.createElement('img')
  favoriteImage.src = isFavorited ? 'img/Vector.svg' : 'img/Heart.svg'
  favoriteImage.alt = 'Heart'
  favoriteImage.classList.add('favoriteImage')
  favoriteImage.addEventListener('click', (event) => favoriteButtonPressed(event, movie))
  const favoriteText = document.createElement('span')
  favoriteText.classList.add('movie-favorite')
  favoriteText.textContent = 'Favoritar'
  favorite.appendChild(favoriteImage)
  favorite.appendChild(favoriteText)
  informations.appendChild(favorite)

  const movieDescriptionContainer = document.createElement('div')
  movieDescriptionContainer.classList.add('movie-description')
  const movieDescription = document.createElement('span')
  movieDescription.textContent = overview
  movieDescriptionContainer.appendChild(movieDescription)
  
  movieElement.appendChild(movieInformations)
  movieElement.appendChild(movieDescriptionContainer)
}

searchButton.addEventListener('click', searchMovie)
checked.addEventListener("click",verificationChecked)

renderizandoFilmes()