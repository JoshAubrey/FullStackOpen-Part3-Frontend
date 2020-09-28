import React from 'react'
import PersonDetails from './PersonDetails'

const Persons = ({personsToShow, deletePerson}) => {
    return (
      <div>
        <ul>
            {personsToShow.map(person => <PersonDetails key={person.id} person={person} deletePerson={() => deletePerson(person.id)}/>)}
        </ul>
      </div>
    )
}

export default Persons