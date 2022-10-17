import React, { useState, useEffect } from 'react';
import { Task, Project } from '../../SPS';

interface FavoritesProps {
    isActive: boolean;
    taskList: Task[];
    onSave: () => void;
    onClose: () => void;
    projectList: Project[];
}

const Favorites = (props: FavoritesProps) => {
    console.log('FavoritesProps :', props);
    const [taskListCopy, setTaskListCopy] = useState<Task[]>([]);

    useEffect(() => {
        setTaskListCopy(props.taskList);
    }, [props.taskList]);

    const onChange = (e) => {
        console.log('entry: ',e)
        const id = parseInt(e.target.value);
        const on = e.target.checked;
        const newTaskList = [...taskListCopy];
        const task = newTaskList.find((t) => t.id === id);
        task.isFavorite = on;
        setTaskListCopy(newTaskList);
    };
    console.log('taskListCopy: ', taskListCopy);
    const checkboxes = [];
    for (const task of taskListCopy) {
        checkboxes.push(
            <div className="control" key={task.id}>
                <label className="checkbox">
                    <input
                        type="checkbox"
                        checked={task.isFavorite}
                        onChange={onChange}
                        value={task.id}
                    />
                    {task.name}
                </label>
            </div>
        );
    }
    console.log('checkboxes: ', checkboxes);
    const projeckName = 'prjektnavn';
    const sublist = [];
    <div className="field">
        <label className="label">{projeckName}</label>
        {sublist}
    </div>;

    return (
        <>
            <div className={'modal' + (props.isActive ? ' is-active' : '')}>
                <div className="modal-background" onClick={props.onClose}></div>
                <div className="modal-content">
                    <div className="box">
                        <p>Vælg favoritter</p>
                        {checkboxes}
                        <button
                            className="button is-success"
                            onClick={props.onSave}
                        >
                            Gem
                        </button>
                        <button className="button" onClick={props.onClose}>
                            Annuler
                        </button>
                    </div>
                </div>
                <button
                    className="modal-close is-large"
                    aria-label="close"
                    onClick={props.onClose}
                ></button>
            </div>
        </>
    );
};
export default Favorites;
