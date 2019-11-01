import React from 'react';
import MovieDetails from './MovieDetails';
import {Link, withRouter } from 'react-router-dom';


class MovieTemplate extends React.Component{

    constructor(props){
        super(props);

        this.movieRowIndexed = {};
        this.movieRows = [];
        this.movieTitle = "Popular Movies";
        this.state = {
            items: [],
            detailClicked:false,
            movieId:{}
        }
        this.fetchData = this.fetchData.bind(this);
        this.populateMovies = this.populateMovies.bind(this);
        this.calculateVoteColor = this.calculateVoteColor.bind(this);
        this.calculateMonthYear = this.calculateMonthYear.bind(this);
    }

    componentDidMount() {
        this.popularMovies();
         //console.log(this.state.items);
    }


    fetchMovieDetails(movId){
        console.log(movId);
        this.setState({detailClicked:true,movieId:movId});
        //return (<Route path="/details" render={() => <MovieDetails movieId={420818}/>} />);
    }

    popularMovies(){
        const url = "http://api.themoviedb.org/3/movie/popular?api_key=6ed12e064b90ae1290fa326ce9e790ff&language=en-US&page=1";
        this.fetchData(url);
        this.movieTitle = "Popular Movies";
    }

    fetchData(url) {
        const response = fetch(url, {
            method: 'GET',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(json => {
                //console.log(json);
                this.setState({items: json.results});
                //console.log(this.state.items);
            });

        //console.log(this.state.items);
     }


    populateMovies() {
        //const movies = this.state.items;
        this.movieRows = [];
        const imagePath = "http://image.tmdb.org/t/p/w500";
        const percentage = "%";
        this.state.items.forEach((movie) => {
            this.movieRowIndexed[movie.id] = {
                id: movie.id,
                title: movie.title,
                release_date: this.calculateMonthYear(movie.release_date),
                poster_path: imagePath + movie.poster_path,
                vote_average: movie.vote_average * 10 + percentage,
                vote_color: this.calculateVoteColor(movie.vote_average)
            }
            this.movieRows.push(this.movieRowIndexed[movie.id]);

        })
        //this.props.history.push('/movies',{movieRows:this.movieRows});
        //console.log(this.movieRows);
    }

    calculateMonthYear(releaseDate){
        var dt = new Date(releaseDate);
        var month = new Array();
          month[0] = "January";
          month[1] = "February";
          month[2] = "March";
          month[3] = "April";
          month[4] = "May";
          month[5] = "June";
          month[6] = "July";
          month[7] = "August";
          month[8] = "September";
          month[9] = "October";
          month[10] = "November";
          month[11] = "December";

        var monthStr = month[dt.getMonth()];
        //console.log(monthStr);
        //console.log(dt.getFullYear());
        return monthStr + " " + dt.getFullYear();
    }

    calculateVoteColor(vote_avg){
       var vColor = "#01D277";
       //console.log(vote_avg);
        if(vote_avg >= 0 && vote_avg < 6){
            vColor = "#D1225B";
        }else if(vote_avg > 6 && vote_avg < 8){
            vColor = "#4902A3";
        }

        //console.log(vColor);
        return vColor;
    }

    searchHandler(event){
        //console.log(event.target.value);
        const searchQuery = event.target.value;
        if(searchQuery === ""){
            console.log("Nothing to search for going back to popular movie");
            this.popularMovies();
        }else{
            this.performSearch(searchQuery);
        }

    }

    performSearch(searchQuery){
        const searchUrl = "http://api.themoviedb.org/3/search/movie?api_key=6ed12e064b90ae1290fa326ce9e790ff&language=en-US&page=1&include_adult=false&query=";
        this.fetchData(searchUrl+searchQuery);
        this.movieTitle = "Searched Movies";
     }

    render(){
        const {history} = this.props;

        history.listen((newLocation, action) => {
              if (action === "POP") {
                if (
                  newLocation.pathname !== this.currentPathname ||
                  newLocation.search !== this.currentSearch
                ) {
                  // Save new location
                  this.currentPathname = newLocation.pathname;
                  this.currentSearch = newLocation.search;

                  // Clone location object and push it to history
                  history.push({
                    pathname: newLocation.pathname,
                    search: newLocation.search,
                    state:this.state.movieRows
                  });
                }
              }
            });
        console.log(history);

        if(this.state.detailClicked === true){
            return (
            <div>
                <Link to={'/details/${this.props.movieId}'} />
                <MovieDetails movieId={this.state.movieId} key={this.state.movieId}/>
            </div>);
        }
        this.populateMovies();
        //console.log(this.props.history.length);

        var halfwayPoint = this.movieRows.length / 2;
        //console.log(this.movieRows.length);
        //console.log(halfwayPoint);
        var movieResultsColA = this.movieRows.slice(0, halfwayPoint);
        var movieResultsColB = this.movieRows.slice(halfwayPoint);

        //console.log(movieResultsColA.length);
        //console.log(movieResultsColB.length);
        return(
          <div>

            <div className="Movies-header">

                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="Heading_image"><img alt="app-icon" width="65px" src="primary-green-icon.svg"/></div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            <div className="Search-span">
                                 <input className="Search-bar" onChange={this.searchHandler.bind(this)} placeholder="Search" />
                                 <span id="search-icon"><i className="fas fa-search"></i></span>
                             </div>
                            </td>
                        </tr>
                    </tbody>
                 </table>

            </div>
            <div className="App-body">

                <h2>{this.movieTitle}</h2>
                <div>
                <table>
                <tbody>
                <tr>
                    <td>
                            {movieResultsColA.map((movie,index) => {

                                return(
                                    <div className="movieRow" key={index}>
                                    <table key={movie.id}>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <div>
                                                <img className="Image-span" alt="poster_path" src={movie.poster_path} onClick={() => this.fetchMovieDetails(movie.id)} />
                                                <span className="Movie-votes" style={{background : movie.vote_color }}>{movie.vote_average}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="movieTitle" onClick={() => this.fetchMovieDetails(movie.id)}>{movie.title}</span>
                                            <p className="releaseDate">{movie.release_date}</p>
                                        </td>

                                    </tr>
                                    </tbody>
                                </table>
                                  </div>
                                )
                            })

                            }

                    </td>
                    <td>
                    </td>
                    <td>

                            {movieResultsColB.map((movieB,index) => {

                                return(
                                    <div key={index}>
                                        <table key={movieB.id}>
                                        <tbody>
                                        <tr>
                                            <td>

                                                <div>
                                                    <img className="Image-span" alt="poster_path" src={movieB.poster_path}  onClick={() => this.fetchMovieDetails(movieB.id)}/>
                                                    <span className="Movie-votes2" style={{background : movieB.vote_color }}>{movieB.vote_average}</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span className="movieTitle" onClick={() => this.fetchMovieDetails(movieB.id)}>{movieB.title}</span>
                                                <p className="releaseDate">{movieB.release_date}</p>
                                            </td>

                                        </tr>
                                        </tbody>
                                    </table>
                                    </div>
                                  )
                                })
                            }

                    </td>
                </tr>
                </tbody>
                </table>
              </div>
          </div>
        </div>

      );
    }
}

export default withRouter(MovieTemplate);