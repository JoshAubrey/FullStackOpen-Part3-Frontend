import React from 'react'

const PersonDetails = ({person, deletePerson}) => {
    return (
      <div>
        <li key={person.id}>
          {person.name} {person.number} <button onClick={deletePerson}>delete</button>
        </li>
      </div>
    )
}

export default PersonDetails