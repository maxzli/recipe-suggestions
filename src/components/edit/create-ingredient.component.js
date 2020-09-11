import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Row = props => (
    <tr>
        <td>{props.ingredient.name}</td>
        <td>{props.ingredient.expiration}</td>
        <td>
        <Link to={"/recipe-suggestions/ingredients/edit/"+props.ingredient._id}>edit</Link> |  <a href="#top" onClick={() => { props.deleteIngredient(props.ingredient._id) }}>delete</a>
        </td>
    </tr>
)

export default class CreateIngredient extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeExpiration = this.onChangeExpiration.bind(this)
        this.onSubmit = this.onSubmit.bind(this);

        this.deleteIngredient = this.deleteIngredient.bind(this)

        this.state = {
            name : '',
            expiration: 0,
            quantity: 0,
            ingredients: []
        }
    }

    componentDidMount(){ // code will run before page renders, add to state
        axios.get('http://localhost:5000/ingredients/')
            .then(response => {
                response.data.sort((a,b) =>
                    (a.name > b.name) ? 1: -1)
                this.setState({ ingredients: response.data })
            })
            .catch((error) =>{
                console.log(error);
            })
    }

    deleteIngredient(id) {
        axios.delete('http://localhost:5000/ingredients/' + id)
            .then(res => console.log(res.data));
        this.setState({
            ingredients: this.state.ingredients.filter(el => el._id !== id)
        })
    }

    ingredientList() {
        return this.state.ingredients.map(current => {
            return <Row ingredient={current} deleteIngredient={this.deleteIngredient} key={current._id}/>
        })
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value // target is text box, value is value of text box
        })
    }

    onChangeExpiration(e) {
        this.setState({
            expiration: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const ingredient = {
            name: this.state.name,
            expiration: this.state.expiration,
        }

        console.log(ingredient);

        axios.post('http://localhost:5000/ingredients/add/', ingredient)
        .then(res => console.log(res.data));

        this.setState({
            name: '',
            expiration: 0,
        })

        window.location.reload();
    }


    render() {
        return (
            <div>
            <h3>New Recipe Ingredient</h3>
            <form onSubmit={this.onSubmit}>
                <div className="form-group"> 
                <label>Add Ingredient and Expiration Date Below.</label>
                <br /><br />
                <label>Ingredient Name: </label>
                <input  type="text"
                    required
                    className="form-control"
                    value={this.state.name}
                    onChange={this.onChangeName}
                    />
                </div>
                <div className="form-group"> 
                        <label>Estimated Expiration: (days) </label>
                        <input  type="text"
                            required
                            className="form-control"
                            value={this.state.expiration}
                            onChange={this.onChangeExpiration}
                            />
                </div>
                <div className="form-group">
                <input type="submit" value="Create Ingredient" className="btn btn-primary" />
                </div>
                <div><br />

            </div>
            </form>
            <div>
            <h3>Saved Ingredients</h3>
                <table className="table">
                <thead className="thead-light">
                    <tr>
                    <th>Name</th>
                    <th>Expiration (days)</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { this.ingredientList() }
                </tbody>
                </table>
                </div>
            </div>
        )
    }
}