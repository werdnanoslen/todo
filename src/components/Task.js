import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as Checkbox } from '../images/checkbox.svg';
import { ReactComponent as Check } from '../images/check.svg';
import { ReactComponent as Rubbish } from '../images/rubbish.svg';
import { ReactComponent as Pin } from '../images/pin.svg';
import { nanoid } from 'nanoid';
import TextareaAutosize from 'react-textarea-autosize';
import { ReactSortable } from 'react-sortablejs';

function NewChecklistItem(data) {
  return {
    id: 'task-' + nanoid(),
    data: data ? data : '',
    done: false,
  };
}

function Form(props) {
  const iChecklist = props.data && typeof props.data !== 'string';
  const [checklist, setChecklist] = useState(iChecklist);

  const [data, setData] = useState(iChecklist ? '' : props.data);

  const iChecklistData = iChecklist ? props.data : [NewChecklistItem()];
  const [checklistData, setChecklistData] = useState(iChecklistData);

  const [taskID, settaskID] = useState(props.id ? props.id : '');

  const [isEditing, setIsEditing] = useState(false);
  const [newItemId, setNewItemId] = useState('');
  const [isMoving, setIsMoving] = useState(false);
  const newTask = props.id === 'new-task';
  const inputLabel = newTask ? 'Add task' : 'Edit task';
  const lastRef = useRef(null);
  const completeLabel = props.done ? 'Restore' : 'Complete';

  function handleSubmit(e) {
    e && e.preventDefault();
    const newData = checklist ? checklistData : data;
    if (newTask) {
      props.addTask(newData);
      setData('');
      setChecklistData([NewChecklistItem()]);
    } else {
      props.editTask(props.id, newData);
    }
    setIsEditing(false);
  }

  function blurCancel(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      checklist ? setChecklistData(iChecklistData) : setData(props.data);
      setChecklist(iChecklist);
      setIsEditing(false);
    }
  }

  function addChecklistItem(e, i) {
    if (checklist && e.key === 'Enter') {
      e.preventDefault();
      const newList = checklistData.slice();
      const newItem = NewChecklistItem();
      setNewItemId(newItem.id);
      newList.splice(i + 1, 0, newItem);
      setChecklistData(newList);
    }
  }

  function deleteListItem(id) {
    const remainingItems = checklistData.filter((item) => id !== item.id);
    setChecklistData(remainingItems);
    if (remainingItems.length === 0) {
      setChecklistData(iChecklistData);
      setChecklist(false);
      setData('');
    }
    handleSubmit();
  }

  function toggleListItemDone(id) {
    const updatedItems = [...checklistData]
    updatedItems.forEach((item) => {
      if (id === item.id) {
        item.done = !item.done
      }
    });
    setChecklistData(updatedItems);
    handleSubmit();
  }

  function handleInput(e, i) {
    const input = e.target.value;
    if (checklist) {
      let checklistDataCopy = [...checklistData];
      checklistDataCopy[i] = { ...checklistDataCopy[i], data: input };
      setChecklistData(checklistDataCopy);
    } else {
      setData(input);
    }
  }

  function toggleChecklist() {
    setChecklist((prevChecklist) => !prevChecklist);
    const n = String.fromCharCode(10); //newline character
    let newData
    if (checklist) {
      const listify = (p, c, i) => p.concat((i ? n : '') + c.data);
      newData = checklistData.reduce(listify, '');
      setData(newData);
    } else {
      if (data && data.length > 0) {
        newData = data.split(n).map((line) => NewChecklistItem(line));
      } else {
        newData = [NewChecklistItem()]
      }
      setChecklistData(newData)
    }
    props.editTask(props.id, newData);
  }

  function moveTask(e) {
    if (newTask) return;
    switch (e.key) {
      case ' ':
      case 'Enter':
        setIsMoving((prevIsMoving) => !prevIsMoving);
        props.moveTask(props.id, 0, !isMoving);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        isMoving && props.moveTask(props.id, 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        isMoving && props.moveTask(props.id, -1);
        break;
    }
  }

  function dataArea(item, index) {
    return (
      <TextareaAutosize
        id={`edit-${props.id}`}
        name="data"
        className="input"
        value={item ? item.data : data}
        onKeyDown={(e) => addChecklistItem(e, index)}
        onInput={(e) => handleInput(e, index)}
        onFocus={() => setIsEditing(true)}
        placeholder={inputLabel}
        aria-label={inputLabel}
        rows="1"
        ref={item && item.id === newItemId ? lastRef : undefined}
      />
    );
  }

  function checklistGroup() {
    return (
      <ReactSortable tag="ul" list={checklistData} setList={setChecklistData}>
        {checklistData.map((item, i) => (
          <li key={i}>
            <div className="list-controls">
              <button className="btn btn__icon btn__drag">
                <span className="visually-hidden">Move list item</span>
                <span aria-hidden="true">{String.fromCharCode(8661)}</span>
              </button>
              <input type="checkbox" defaultChecked={item.done} aria-label="done" onClick={() => toggleListItemDone(item.id)} />
            </div>
            {dataArea(item, i)}
            <button
              className="btn btn__icon btn__close"
              onClick={() => deleteListItem(item.id)}
            >
              <span className="visually-hidden">Delete list item</span>
              <span aria-hidden="true">{String.fromCharCode(10005)}</span>
            </button>
          </li>
        ))}
      </ReactSortable>
    );
  }

  const editingTools = (
    <>
      <button type="submit" className="btn">
        Save <span className="visually-hidden">{props.id}</span>
      </button>
      <button
        type="button"
        className="btn btn__icon"
        onClick={() => props.toggleTaskDone(props.id)}
      >
        <Check aria-hidden="true" />
        <span className="visually-hidden">
          {completeLabel} {props.id}
        </span>
      </button>
      <button
        type="button"
        className="btn btn__icon"
        onClick={() => props.deleteTask(props.id)}
      >
        <Rubbish aria-hidden="true" />
        <span className="visually-hidden">Delete {props.id}</span>
      </button>
      <button
        type="button"
        className="btn btn__icon"
        onClick={() => props.toggleTaskPinned(props.id)}
      >
        <Pin aria-hidden="true" />
        <span className="visually-hidden">{props.pinned && 'Un-'}Pin task</span>
      </button>
    </>
  );

  const addingTools = (
    <button type="submit" className="btn" id="add-button">
      Add
    </button>
  );

  const toolbar = (
    <div className="btn-group">
      {newTask ? addingTools : editingTools}
      <button
        type="button"
        className="btn btn__icon"
        onClick={() => toggleChecklist()}
      >
        <Checkbox aria-hidden="true" />
        <span className="visually-hidden">Checklist mode</span>
      </button>
    </div>
  );

  useEffect(() => {
    if (lastRef.current) lastRef.current.focus();
  }, [checklistData]);

  return (
    <li
      className={`task ${props.hide ? 'hide' : ''} ${isMoving ? 'moving' : ''}`}
      tabIndex={isMoving ? 0 : props.movement ? -1 : 0}
      name="Task"
      draggable="true"
      role="option"
      aria-describedby={newTask ? 'instructions' : ''}
      aria-grabbed={isMoving}
      aria-dropeffect={isMoving ? 'move' : 'none'}
      onDragEnd={handleSubmit}
      onKeyDown={(e) => moveTask(e)}
      onBlur={(e) => {
        if (isMoving) {
          setIsMoving(false);
          props.moveTask(props.id, 0, false);
        }
      }}
    >
      <form onSubmit={handleSubmit} onBlur={blurCancel} id={props.id} className={isEditing ? 'isEditing' : undefined}>
        {checklist ? checklistGroup() : dataArea()}
        {isEditing && toolbar}
      </form>
    </li>
  );
}

export default Form;
