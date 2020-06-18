import React, {Component} from 'react';
import Persons from './utils/Persons';
import Server from './Server';


// ASSUMPTIONS
/*
* 1. I assumed only one creation process can happen since it's not specified
* */

let id = 0;
export default class Client extends Component {
    constructor() {
        super();
        this.state = {
            persons: new Persons(),
            updating: false
        };
    }

    createPerson() {
        // Always give the id a value of -1 so we can always have one input box open
        const person = {
            name: '',
            id: id - 1,
        };

        /*Check if such new person to be created already exists in the state with same data,
        if it exists, it means there's an empty input waiting to be populated on the page*/

        if (!this.state.persons.has(person)) {
            this.setState(state => ({
                persons: state.persons.add(person),
            }));
        }
    }

    onClickCreatePerson = () => {
        this.createPerson();
    }

    onClickSaveName(person) {
        this.savePerson(person);
    }

    onChangeName(person, event) {
        const name = event.target.value;

        this.setState(state => ({
            persons: state.persons.update({
                ...person,
                name,
            }),
        }));
    }

    savePerson(person) {
        const isCreate = person.id < 0;
        const method = isCreate
            ? 'post'
            : 'patch';
        /* Check if a UI update is currently going on, i.e check if the user is still typing,
         if user is not typing, then send current value to server
         */
        if (!this.state.updating) {
            this.setState({
                updating: true
            }, () => {
                Server[method](person)
                    .then(this.onSaveSuccess);
            });
        }
    }

    onSaveSuccess = person => {
        const persons = this.state.persons.get().filter(item => item.id > -1);

        /* Check if saved person already exists in state which signifies an update operation or
        it doesn't exist which signifies a create operation*/

        const isPersonInState = this.state.persons.has(person);
        /*If it exists, find it, update it make sure the client and server are in sync*/
        if (isPersonInState) {
            const currentPerson = this.state.persons.get().find(item => item.id === person.id);
            this.syncUpdate({persons, person, currentPerson});
        } else {
            // Else find the negative id'd value and sync with server
            const currentPerson = this.state.persons.get().find(item => item.id < 0);
            this.syncUpdate({persons, person, currentPerson, cb: () => this.savePerson(person)});
        }
    }

    /*
    * This function syncs the client with the server on post-update, and
    * this makes it possible to have the last input as what's sent to the server
    * */
    syncUpdate({persons = [], person, cb, currentPerson}) {
        const isChanged = currentPerson.name !== person.name;
        if (isChanged) {
            person.name = currentPerson.name;
            this.setState(state => ({
                persons: new Persons(persons).upsert(person),
                updating: false
            }), () => {
                if (typeof (cb) === "function") {
                    cb();
                }
            });
        } else {
            this.setState(state => ({
                persons: new Persons(persons).upsert(person),
                updating: false
            }));
        }
    }

    renderPersons() {
        if (!this.state.persons.get().length) {
            return <div className="challenge-person-empty">There are no persons yet.</div>
        }
        return this.state.persons
            .get()
            .map(person => (
                <div key={person.id} className="challenge-person">
                    <span className="challenge-person-id">
                        {person.id}
                    </span>
                    <input
                        value={person.name}
                        className="challenge-person-name"
                        onChange={event => this.onChangeName(person, event)}
                    />
                    <button
                        className="challenge-person-save-name-button"
                        onClick={() => this.onClickSaveName(person)}
                    >
                        Save Name
                    </button>
                </div>
            ));
    }

    render() {
        return (
            <div className="challenge">
                <button
                    className="challenge-create-person-button"
                    onClick={this.onClickCreatePerson}
                >
                    Create Person
                </button>
                <div className="challenge-persons">
                    {this.renderPersons()}
                </div>
            </div>
        );
    }
}
