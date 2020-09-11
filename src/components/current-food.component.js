import React, {Component} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
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

export default class FoodOnHand extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.deleteFood = this.deleteFood.bind(this);


        this.state = {
            name : '',
            quantity: 0,
            date: new Date(),
            expirationdate: new Date(),
            foods: [],
            expirations: {},
            currentfoods: []
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
                    names.sort((a,b) =>
                        (a > b) ? 1: -1)
                    this.setState({
                        foods: names,
                        name: names[0],
                        expirations: result
                    })
                }
            })
        axios.get('http://localhost:5000/foods/')
            .then(response => {
                response.data.sort((a,b) =>
                    (a.expirationdate > b.expirationdate) ? 1: -1)
                this.setState({ currentfoods: response.data })
            })
            .catch((error) =>{
                console.log(error);
            })
    }

    deleteFood(id) {
        axios.delete('http://localhost:5000/foods/' + id)
            .then(res => console.log(res.data));
        this.setState({
            currentfoods: this.state.currentfoods.filter(el => el._id !== id)
        })
    }

    foodList() {
        return this.state.currentfoods.map(current => {
            return <Row food={current} deleteFood={this.deleteFood} key={current._id}/>
        })
    }


    onChangeName(e) {
        this.setState({
            name: e.target.value // target is text box, value is value of text box
        })
    }

    onChangeDate(date) {
        this.setState({
            date: date
        })
    }

    onChangeQuantity(e) {
        this.setState({
            quantity: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        var expiration = new Date(this.state.date);
        expiration.setDate(expiration.getDate() + this.state.expirations[this.state.name])

        const food = {
            name: this.state.name,
            date: this.state.date,
            expirationdate: expiration,
            quantity: this.state.quantity
        }

        console.log(food);

        axios.post('http://localhost:5000/foods/add/', food)
        .then(res => console.log(res.data));

        this.setState({
            name: '',
            expiration: 0,
            quantity: 0
        })

        window.location.reload();
    }


    render() {
        return (
            <div>
            <h3>New Food</h3>
            <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>Ingredient: </label>
                        <div className="form-row">
                        <div className="col-sm">
                        <select 
                            required
                            className="form-control"
                            value={this.state.name}
                            onChange={this.onChangeName}>
                            {
                            this.state.foods.map(function(food) {
                                // for each food in the array foods (map allows this)
                                // return this
                                return <option 
                                    key={food} // key, value, then actual text which appears, which is food
                                    value={food}>{food}
                                    </option>;
                                })
                            }
                        </select>    
                        </div>
                        <div className="col-sm">
                            <Button href = "/ingredients/add" variant="outline-secondary">Modify Ingredients List</Button>{' '}
                        </div>
                        </div>
                    </div>
                <div className="form-group"> 
                    <label>Weight(g): </label>
                    <input  type="text"
                        required
                        className="form-control"
                        value={this.state.quantity}
                        onChange={this.onChangeQuantity}
                        />
                </div>
                <div className="form-group">
                        <label>Opened Date: </label>
                        <div>
                            <DatePicker
                            selected={this.state.date}
                            onChange={this.onChangeDate}
                            />
                        </div>
                </div>
                <div className="form-group">
                <input type="submit" value="Add Food" className="btn btn-primary" />
                </div>
            </form>
            <div>
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
                </div>
            </div>
        )
        }
}