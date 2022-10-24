import React, { useState, useEffect } from 'react';
import { Task, Project } from '../../SPS';

interface FavoritesProps {
    isActive: boolean;
    taskList: Task[];
    onSave: (favoriteIds: number[]) => void;
    onClose: () => void;
    projectList: Project[];
}

const Favorites = (props: FavoritesProps) => {
    const [taskListCopy, setTaskListCopy] = useState<Task[]>([]);
    useEffect(() => {
        setTaskListCopy(props.taskList);
    }, [props.taskList]);


    const onChange = (e) => {
        const id = parseInt(e.target.value);
        const on = e.target.checked;
        const newTaskList = [...taskListCopy];
        const task = newTaskList.find((t) => t.id === id);
        task.isFavorite = on;
        setTaskListCopy(newTaskList);
    };

    const onSaveButtonClicked = () =>{
        const favoriteIds = taskListCopy.filter((item: Task) => item.isFavorite).map((item: Task)=>item.id)
        props.onSave(favoriteIds)
    }

    const listOfTasks = [];
    const projects = props.projectList
    for (const project of projects) {
            const filteredCheckboxes = [];
            const filteredTasks = taskListCopy.filter(
                (item) => item.projectId === project.id
            );
                for (const task of filteredTasks) {
                    filteredCheckboxes.push(
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
            
        listOfTasks.push(
                <div className="field" key={project.id}>
                    <label className="label">{project.name}</label>
                     {filteredCheckboxes}
                 </div>
        );
    };


    return (
        <>
            <div className={'modal' + (props.isActive ? ' is-active' : '')}>
                <div className="modal-background" onClick={props.onClose}></div>
                <div className="modal-content">
                    <div className="box">
                        <h1 className="title">Vælg favoritter</h1>
                        {listOfTasks}
                        <button
                            className="button is-success"
                            onClick={onSaveButtonClicked}
                        >
                            Gem
                        </button>
                        <button className="button" onClick={props.onClose}>
                            Annuller
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
