import React, {Component} from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Row = props => (
    <tr>
        <td>{props.recipe.name}</td><td><table><tbody>
        {props.recipe.quantities.map((ing, i)=>(
            <tr key={i}>{ing.name}: {ing.wt} grams</tr>
        ))}</tbody></table>
        </td><td>{props.recipe.notes}</td>
        <td>
        <a href="#top" onClick={() => { props.deleteRecipe(props.recipe._id) }}>delete</a>
        </td>
    </tr>
)

export default class CreateRecipe extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeNotes = this.onChangeNotes.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.deleteRecipe = this.deleteRecipe.bind(this);

        this.state = {
            name : '',
            ingredient: '',
            notes: '',
            allfoods: [],
            quantities: [],
            recipes: []
        }
    }

    componentDidMount(){
        axios.get('http://localhost:5000/ingredients/')
            .then(response => {
                if (response.data.length > 0){
                    response.data.sort((a,b) =>
                        (a.name > b.name) ? 1: -1)
                    this.setState({
                        allfoods: response.data.map(ingredient => ingredient.name),
                        ingredient: response.data[0].name
                    })
                }
            })
        axios.get('http://localhost:5000/recipes/')
            .then(response => {
                response.data.sort((a,b) =>
                    (a.name > b.name) ? 1: -1)
                this.setState({ recipes: response.data })
            })
            .catch((error) =>{
                console.log(error);
            })
    }

    deleteRecipe(id) {
        axios.delete('http://localhost:5000/recipes/' + id)
            .then(res => console.log(res.data));
        this.setState({
            recipes: this.state.recipes.filter(el => el._id !== id)
    })
    }

    recipeList() {
        return this.state.recipes.map(current => {
            return <Row recipe={current} deleteRecipe={this.deleteRecipe} key={current._id}/>
        })
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value // target is text box, value is value of text box
        })
    }

    onChangeNotes(e) {
        this.setState({
            notes: e.target.value // target is text box, value is value of text box
        })
    }

    onChangeIngredient = (e) => {
        this.setState({
            ingredient: e.target.value
        })
        console.log(this.state.allfoods)
    }

    onSubmit(e) {
        e.preventDefault();

        const recipe = {
            name: this.state.name,
            quantities: this.state.quantities,
            notes: this.state.notes
        }

        console.log(recipe);

        axios.post('http://localhost:5000/recipes/add/', recipe)
        .then(res => console.log(res.data));

        window.location.reload();
    }

    handleChange = (e) => { 
        if (["wt"].includes(e.target.className)){
            let quantities = [...this.state.quantities]
            quantities[e.target.dataset.id][e.target.className] = e.target.value
            this.setState({ quantities}, () => console.log(this.state.quantities))
        } else{
            this.setState({ [e.target.name]: e.target.value})
        }
    }
    addIng = (e) => {
        var temp = this.state.allfoods.filter(item => item!==this.state.ingredient)
        this.setState((prevState) => ({
            quantities: [...prevState.quantities, {name: this.state.ingredient, wt: 0}],
            allfoods: temp,
            ingredient: temp[0],
        }))
    }

    remIng = (e) => {
        var temp = this.state.quantities;
        var temp2 = temp.pop()
        temp2 = [...this.state.allfoods, temp2.name]
        temp2.sort((a,b) =>
            (a > b) ? 1: -1)
        this.setState((prevState)=>({
            quantities: temp,
            allfoods: temp2
        }));
    }

    render() {
        let {quantities} = this.state
        return (
            <div>
            <h3>New Recipe</h3>
            
            <form onSubmit={this.onSubmit} onChange={this.handleChange}>
                <div className="form-group"> 
                    <label>Add Ingredients as Needed Below!</label>
                    <br /><br />
                    <label>Recipe Name: </label>
                    <input  type="text"
                        required
                        className="form-control"
                        value={this.state.name}
                        onChange={this.onChangeName}
                        />
                </div>
                <div className="form-group"> 
                    <label>Select Ingredient: </label>
                    <div className="form-row">
                        <div className="col-4">
                            <select className="form-control"
                                required
                                value={this.state.ingredient}
                                onChange={this.onChangeIngredient}>
                                {
                                this.state.allfoods.map(function(ingredient) {
                                    // for each ingredient in the array ingredients (map allows this)
                                    // return this
                                    return <option 
                                        key={ingredient} // key, value, then actual text which appears, which is ingredient
                                        value={ingredient}>{ingredient}
                                        </option>;
                                    })
                                }
                            </select>
                        </div>
                        <div className="col">
                        <Button onClick={this.addIng} variant="outline-primary">Add Ingredient</Button>{' '}
                        <Button href = "/recipe-suggestions/ingredients/add/" variant="outline-secondary">Modify Ingredients List</Button>{' '}
                        <Button onClick={this.remIng} variant="outline-danger">Remove Last Ingredient</Button>{' '}
                        </div>
                    </div>
                    {
                        quantities.map((val, idx)=> {
                            let ingId = `name-${idx}`, quaId = `wt-${idx}`
                            return (
                                <div key={idx}>
                                    <br />
                                    <label htmlFor={ingId}>{`Ingredient #${idx + 1}: ${val.name}`}</label>
                                    <br />
                                    <label htmlFor={quaId}>Weight in grams:</label>
                                    <input
                                    type="text"
                                    name={quaId}
                                    data-id={idx}
                                    id={quaId}
                                    className="wt"
                                    />
                                </div>
                            )
                        })
                    }
                </div>
                <div className="form-group"> 
                    <label>Notes: (optional) </label>
                    <input  type="text"
                        className="form-control"
                        value={this.state.notes}
                        onChange={this.onChangeNotes}
                        />
                </div>
                <div className="form-group">
                <input type="submit" value="Create Recipe" className="btn btn-primary" />
                </div>
                <div>
                </div>
            </form>
            <div>
            <br />
            <h3>Saved Recipes</h3>
                <table className="table">
                <thead className="thead-light">
                    <tr>
                    <th>Recipe Name</th>
                    <th>Single Serving</th>
                    <th>Notes</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { this.recipeList() }
                </tbody>
                </table>
                </div>
            </div>
        )
        }
}