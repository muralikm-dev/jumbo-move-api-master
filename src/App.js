import React from 'react';
import './App.css';
import {Router,Route} from "react-router-dom";
import {createBrowserHistory} from 'history';
import MovieTemplate from './components/MovieTemplate';
import MovieDetails from './components/MovieDetails';

class App extends React.Component{

    render(){
        const history = createBrowserHistory();
        return (
            <Router history={history}>
            <div className="App">
                <Route exact path="/" render={() => <MovieTemplate />}/>
                <Route path="/movies" render={(routeProps) => <MovieTemplate {...routeProps}/>} />
                <Route path="/details/:movieId" render={(routeProps) => <MovieDetails {...routeProps}/>}/>
            </div>
            </Router>
        );
    }


}
export default App;
