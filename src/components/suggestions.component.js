import React, {Component} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {Button} from 'react-bootstrap';


const Row = props => (
    <tr>
        <td>{props.food.name}</td>
        <td>{props.food.quantity}</td>
        <td>{props.food.date.substring(0,10)}</td>
        <td>{props.food.expirationdate.substring(0,10)}{(Date.parse(props.food.expirationdate)-Date.parse(new Date()) < 0) && 
        <span><font color={'red'}> EXPIRED!</font></span>}</td>
        <td>
        <Link to={"/foods/edit/"+props.food._id}>edit</Link> |  <a href="#top" onClick={() => { props.deleteFood(props.food._id) }}>delete</a>
        </td>
    </tr>
)

const RecipeRow = props => (
    <tr>
    <td>{props.recipe.name}</td>
    <td><table><tbody>
    {props.recipe.quantities.map((ing, i)=>(
        <tr key={i}>{ing.name}: {ing.wt} grams</tr>
    ))}</tbody></table>
    </td>
    <td>{props.recipe.serving.toFixed(1)}</td>
    <td>{props.recipe.expiration.substring(0,10)}{(Date.parse(props.recipe.expiration)-Date.parse(new Date()) < 0) && 
        <span><font color={'red'}> EXPIRED!</font></span>}</td>
    <td>{props.recipe.notes}</td>
    </tr>
)

export default class Suggestions extends Component {
    constructor(props) {
        super(props);

        // this.onSubmit = this.onSubmit.bind(this);

        this.deleteFood = this.deleteFood.bind(this);


        this.state = {
            expirations: {},
            weights: {},
            currentfoods: [],
            allrecipes: [],
            possiblerecipes: []
        }
    }

    componentDidMount(){
        axios.get('http://localhost:5000/ingredients/')
            .then(response => {
                if (response.data.length > 0){
                    var result = {};
                    var names = response.data.map(ingredient => ingredient.name);
                    var expirations = response.data.map(ingredient => ingredient.expiration);
                    names.forEach((key, i) => result[key] = expirations[i]);
                    this.setState({
                        expirations: result
                    })
                }
            })

        axios.get('http://localhost:5000/foods/')
            .then(response => {
                if (response.data.length > 0){
                    var result = {};
                    var names = response.data.map(food => food.name);
                    var wts = response.data.map(food => food.quantity);
                    names.forEach((key, i) => result[key] = wts[i]);

                    response.data.sort((a,b) =>
                        (a.expirationdate > b.expirationdate) ? 1: -1)
                    this.setState({ 
                        currentfoods: response.data,
                        weights: result})
                    
                    axios.get('http://localhost:5000/recipes/')
                        .then(response => {
                            if (response.data.length > 0){
                            this.setState({ allrecipes: response.data })}
            
                            var possible = this.returnValidRecipes();
                            possible.sort((a,b) =>
                            (a.expiration > b.expiration) ? 1: -1)    
                            this.setState({possiblerecipes: possible})
                        })
                        .catch((error) =>{
                            console.log(error);})                
                }})
            .catch((error) =>{
                console.log(error);
            })
    }

    validRecipe(recipe) {
        var i;
        for (i = 0; i < recipe.quantities.length; i++){
            if (!this.state.weights[recipe.quantities[i].name] || recipe.quantities[i].wt > this.state.weights[recipe.quantities[i].name]){return false}
        }
        return true
    }

    returnValidRecipes(){
        var possible = [];
        for (var i = 0; i < this.state.allrecipes.length; i++){
            if (this.validRecipe(this.state.allrecipes[i])){
                var recipe = this.state.allrecipes[i];
                var serving = this.state.weights[recipe.quantities[0].name]/recipe.quantities[0].wt;
                if (recipe.quantities.length > 1){
                for (var j = 1; j < recipe.quantities.length; j++){
                    serving = Math.min(serving, this.state.weights[recipe.quantities[j].name]/recipe.quantities[j].wt)
                }}
                recipe.serving = serving
                recipe.expiration = this.returnExpiration(recipe)
                possible.push(recipe)
            }
        }
        return possible
    }

    returnExpiration(recipe){
        var result; var newdate;
        result = this.state.currentfoods.find(obj => {
            return obj.name === recipe.quantities[0].name});
        result = result.expirationdate
        if (recipe.quantities.length > 1){
            for (let i = 1; i < recipe.quantities.length; i++){
                newdate = this.state.currentfoods.find(obj => {
                    return obj.name === recipe.quantities[i].name})
                newdate = newdate.expirationdate;
                if (Date.parse(newdate)-Date.parse(result) < 0){
                    result = newdate;}
                }
            }
        return result
    }



    deleteFood(id) {
        axios.delete('http://localhost:5000/foods/' + id)
            .then(res => console.log(res.data));
        this.setState({
            currentfoods: this.state.currentfoods.filter(el => el._id !== id)
        })
        window.location.reload()
    }

    foodList() {
        return this.state.currentfoods.map(current => {
            return <Row food={current} deleteFood={this.deleteFood} key={current._id}/>
        })
    }

    recipeList(){
        return this.state.possiblerecipes.map(current => {
            return <RecipeRow recipe={current} key={current._id}/>
        })
    }

    // onSubmit(e) {
    //     e.preventDefault();

    //     var expiration = new Date(this.state.date);
    //     expiration.setDate(expiration.getDate() + this.state.expirations[this.state.name])

    //     const food = {
    //         name: this.state.name,
    //         date: this.state.date,
    //         expirationdate: expiration,
    //         quantity: this.state.quantity
    //     }

    //     console.log(food);

    //     axios.post('http://localhost:5000/foods/add/', food)
    //     .then(res => console.log(res.data));

    //     this.setState({
    //         name: '',
    //         expiration: 0,
    //         quantity: 0
    //     })

    //     window.location.reload();
    // }


    render() {
        return (
            <div>
            <h3>Suggestions</h3>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                    <th>Recipe Name</th>
                    <th>Single Serving</th>
                    <th>Servings possible</th>
                    <th>Earliest Expiration Date</th>
                    <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    { this.recipeList() }
                </tbody>
                </table><br /><br />
            <h3>Fridge</h3>
                <table className="table">
                <thead className="thead-light">
                    <tr>
                    <th>Food</th>
                    <th>Weight(g)</th>
                    <th>Opened Date</th>
                    <th>Expiration Date</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { this.foodList() }
                </tbody>
                </table>
                <Button href = "/foods/add" variant="outline-primary">Add to Fridge</Button>{' '}
                </div>
        )
        }
}