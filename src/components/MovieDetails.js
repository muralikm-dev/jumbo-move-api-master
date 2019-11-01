import React from 'react';
import '../css/movies.css';
import {Link,withRouter} from 'react-router-dom'

class MovieDetails extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            movieDetails: []
        }
        this.movieDetail = {};
        this.fetchData = this.fetchData.bind(this);
        this.populateDetails = this.populateDetails.bind(this);
        this.createMovieDetail = this.createMovieDetail.bind(this);
        this.convertHoursAndMin = this.convertHoursAndMin.bind(this);
        this.calculateReleaseYear = this.calculateReleaseYear.bind(this);
    }

    componentDidMount() {
        this.populateDetails();
    }

    populateDetails(){
        const url = "http://api.themoviedb.org/3/movie/" + this.props.movieId + "?api_key=6ed12e064b90ae1290fa326ce9e790ff&language=en-US";
        console.log(url);
        this.fetchData(url);
    }

    createMovieDetail(){
        const imagePath = "http://image.tmdb.org/t/p/w500";

        this.movieDetail = {
            id: this.state.movieDetails.id,
            backdrop_path:imagePath + this.state.movieDetails.backdrop_path,
            poster_path:imagePath + this.state.movieDetails.poster_path,
            title:this.state.movieDetails.original_title,
            releaseYear:this.calculateReleaseYear(this.state.movieDetails.release_date),
            runtime:this.convertHoursAndMin(this.state.movieDetails.runtime),
            vote_avg:this.state.movieDetails.vote_average * 10,
            overview:this.state.movieDetails.overview
        }
    }

    calculateReleaseYear(releaseDate){
        const dt = new Date(releaseDate);
        return dt.getFullYear();
    }

    convertHoursAndMin(minutes){
        const Hours = Math.floor(minutes/60);
        const Minute = minutes%60;
        //console.log(Hours);
        //console.log(Minute);

        return (
            <span>{Hours}h : {Minute}mins</span>
        )
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
                this.setState({movieDetails: json});
                console.log(this.state.movieDetails);
            });

        //console.log(this.state.items);
    }

    handleBack() {
        return this.props.history.goBack();
    }

    render(){

        const {history} = this.props;
        console.log(history);
        this.createMovieDetail();
        //this.populateDetails();
        console.log(this.movieDetail);

        return (

            <div className="App-body">
                <table align="center">
                    <tbody>
                    <tr>
                        <td colSpan="3">
                           <img className="Image-bg" alt="backdrop_path" src={this.movieDetail.backdrop_path} />
                        </td>

                    <td>
                    <p>
                        <img className="Image-overlap" alt="backdrop_path" src={this.movieDetail.poster_path} />
                    </p>
                    </td>
                    </tr>
                    </tbody>
                </table>
                <table align="center" className="MovieDetail-table">
                    <tbody>
                    <tr>
                        <td className="MovieDetail-title">{this.movieDetail.title}</td>
                        <td><br/><br/></td>
                    </tr>
                    <tr>
                        <td className="Details.span"> {this.movieDetail.releaseYear} &nbsp;&nbsp;<b>.</b> &nbsp;{this.movieDetail.vote_avg}% User Score</td>
                    </tr>
                    <tr>
                        <td>{this.movieDetail.runtime}</td>

                    </tr>
                    </tbody>
                </table>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>

                <hr/>
                <span className="Overview.span">
                {this.movieDetail.overview}
                </span>


            </div>
        )
    }
}

export default withRouter(MovieDetails);