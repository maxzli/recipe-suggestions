import React, {Component} from 'react';
import axios from 'axios';
import {Button} from 'react-bootstrap';
import { Link} from 'react-router-dom';



export default class EditIngredient extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeExpiration = this.onChangeExpiration.bind(this)
        this.onChangeQuantity = this.onChangeQuantity.bind(this)
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name : '',
            expiration: 0,
            quantity: 0
        }
    }

    componentDidMount(){
        axios.get('http://localhost:5000/ingredients/'+this.props.match.params.id)
            .then(response => {
                this.setState({
                    name: response.data.name,
                    expiration: response.data.expiration,
                    quantity: response.data.quantity
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

    onChangeExpiration(e) {
        this.setState({
            expiration: e.target.value
        })
    }

    onChangeQuantity(e) {
        this.setState({
            quantity: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const ingredient = {
            name: this.state.name,
            expiration: this.state.expiration,
            quantity: this.state.quantity
        }

        console.log(ingredient);

        axios.post('http://localhost:5000/ingredients/update/'+this.props.match.params.id, ingredient)
        .then(res => console.log(res.data));

        this.props.history.push('/recipe-suggestions/ingredients/add/')  
    }


    render() {
        return (
            <div>
            <h3>Edit Ingredient</h3>
            <form onSubmit={this.onSubmit}>
                <div className="form-group"> 
                <label>Please use all lowercase.</label>
                <br /><br />
                <label>Name: </label>
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
                <input type="submit" value="Edit Ingredient" className="btn btn-primary" />{' '}
                <Link to="/recipe-suggestions/ingredients/add/">
                <Button variant="outline-danger">Go Back</Button></Link>{' '}
                </div>
            </form>
            </div>
        )
        }
}