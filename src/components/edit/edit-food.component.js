import React, {Component} from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';



export default class FoodOnHand extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);


        this.state = {
            name : '',
            quantity: 0,
            date: new Date(),
            expirationdate: new Date(),
            expirations: {},
            foods: [],
        }
    }

    componentDidMount(){
        axios.get('/api/ingredients/')
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
                    expirations: result
                })
            }
        })
        axios.get('/api/foods/'+this.props.match.params.id)
            .then(response => {
                this.setState({
                    name: response.data.name,
                    date: new Date(response.data.date),
                    quantity: response.data.quantity,
                    expirationdate: new Date(response.data.expirationdate)
                })
            })
            .catch(function (error) {
                console.log(error);
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

        axios.post('/api/foods/update/'+this.props.match.params.id, food)
        .then(res => console.log(res.data));

        this.props.history.push('/recipe-suggestions/')  
    }


    render() {
        return (
            <div>
            <h3>Edit Food</h3>
            <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>Ingredient: </label>
                        <select ref="userInput"
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
                <input type="submit" value="Edit Food" className="btn btn-primary" />{' '}
                <Link to="/recipe-suggestions/foods/add/">
                <Button variant="outline-danger">Go Back</Button></Link>{' '}
                </div>
            </form>
            </div>
        )
        }
}