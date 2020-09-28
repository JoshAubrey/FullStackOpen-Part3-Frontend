import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/personService'


const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState('')
  const [ notification, setNotification ] = useState(null)
  const [ error, setError ] = useState(false)


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons  => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name.includes(newName))){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){ 
        const personToChange = persons.find(p => p.name === newName)
        const changedPerson = {...personToChange, number: newNumber}

        personService
          .update(personToChange.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== personToChange.id ? p : returnedPerson))
          })
          .catch(error => {
            setError(true)
            setNotification(
              `the person '${personToChange.name}' was already deleted from server`
            )
            setTimeout(() => {
              setError(false)
              setNotification(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== personToChange.id))
          })
        setNewName('')
        setNewNumber('')
      }
    }
    else {
      const personObject = {
        id: persons.length + 1,
        name: newName,
        number: newNumber,
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })

        setNotification(
          `Added '${personObject.name}'`
        )
        setTimeout(() => {
          setNotification(null)
        }, 5000)
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if(window.confirm(`Delete ${person.name} ?`)){
      personService
      .deletePerson(id)
      .then(
        setPersons(persons.filter(p => p.id !== id))
      )
      .catch(error => {
        setError(true)
        setNotification(
          `the person '${person.name}' was already deleted from server`
        )
        setTimeout(() => {
          setError(false)
          setNotification(null)
        }, 5000)
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const personsToShow = newSearch === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification} error={error}/>
      <Filter value={newSearch} onChange={handleSearchChange}/>

      <h2>Add new</h2>
      <PersonForm
         addPerson = {addPerson}
         newName = {newName}
         handleNameChange = {handleNameChange}
         newNumber = {newNumber}
         handleNumberChange = {handleNumberChange}     
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App