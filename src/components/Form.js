//https://www.robinwieruch.de/react-update-item-in-list/
import React, { useState, useRef, useEffect } from 'react'
import { ReactComponent as Checkbox } from '../images/checkbox.svg'
import { nanoid } from 'nanoid'

function NewChecklistItem() {
  return {
    id: 'task-' + nanoid(),
    data: '',
    done: false,
  }
}

function Form(props) {
  const [isEditing, setEditing] = useState(false)
  const [data, setData] = useState('')
  const [checklistData, setChecklistData] = useState([NewChecklistItem()])
  const [newItemId, setNewItemId] = useState('')
  const [checklist, setChecklist] = useState(false)
  const inputLabel = 'Add a task'
  const addButtonLabel = 'Add'
  const lastRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    checklist ? props.addTask(checklistData) : props.addTask(data)
    setData('')
    setChecklistData([NewChecklistItem()])
    setEditing(false)
  }

  function blurCancel(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setEditing(false)
    }
  }

  function addChecklistItem(e, i) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newList = checklistData.slice()
      const newItem = NewChecklistItem()
      setNewItemId(newItem.id)
      newList.splice(i + 1, 0, newItem)
      setChecklistData(newList)
    }
  }

  function handleInput(e, i) {
    const element = e.target
    if (checklist) {
      let checklistDataCopy = [...checklistData]
      checklistDataCopy[i] = { ...checklistDataCopy[i], data: element.value }
      setChecklistData(checklistDataCopy)
    } else {
      setData(element.value)
    }
    element.style.height = '0'
    element.style.height = element.scrollHeight + 'px'
  }

  function toggleChecklist() {
    setChecklist((prevChecklist) => !prevChecklist)
  }

  function dataArea(item?, index?) {
    return (
      <textarea
        id={item ? item.id : 'task-' + nanoid()}
        name="data"
        className="input"
        value={item ? item.data : data}
        onKeyDown={(e) => addChecklistItem(e, index)}
        onInput={(e) => handleInput(e, index)}
        onFocus={() => setEditing(true)}
        placeholder={inputLabel}
        rows="1"
        ref={item && item.id === newItemId ? lastRef : undefined}
      />
    )
  }

  const checklistGroup = (
    <ul>
      {checklistData.map((item, i) => (
        <li key={i}>
          <input type="checkbox" aria-label="done" />
          {dataArea(item, i)}
        </li>
      ))}
    </ul>
  )

  const editingTemplate = (
    <div className="btn-group">
      <button type="submit" className="btn" id="add-button">
        {addButtonLabel}
      </button>
      <button type="button" className="btn btn__icon" onClick={() => toggleChecklist()}>
        <Checkbox aria-hidden="true" />
        <span className="visually-hidden">Checklist mode</span>
      </button>
    </div>
  )

  useEffect(() => {
    if (lastRef.current) lastRef.current.focus()
  }, [checklistData])

  return (
    <>
      <form onSubmit={handleSubmit} onBlur={blurCancel}>
        <label htmlFor="add-task" className="visually-hidden">
          {inputLabel}
        </label>
        {checklist ? checklistGroup : dataArea()}
        {isEditing ? editingTemplate : ''}
      </form>
    </>
  )
}

export default Form
