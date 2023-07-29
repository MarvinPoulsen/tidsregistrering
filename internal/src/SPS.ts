import format from 'date-fns/format'

function isExecption(resp: SpatialServer.DSResponse): resp is SpatialServer.SPSError { 
    return !!(resp as SpatialServer.SPSError).exception
}

/**
 * @description
 */
interface Profile {
    profileName: string;
    displayName: string;
  }

export interface TimeEntry {
    id?: number;
    userId: string;
    taskDate: Date;
    taskTime: number;
    taskId: number;
    taskStart: Date;
    taskEnd: Date;
    note: string;
    allDay:boolean;
}  

export interface Task {
    id?: number;
    projectId: number;
    taskName: string;
    milestone: Date;
    importance: number;
    timeframe: number;
    description: string;
    obsolete: boolean;
} 

export interface FavoritTask {
    id: number;
    projectId: number;
    taskName: string;
    description: string;
    isFavorite: boolean;
} 

export interface Project {
    id?: number;
    groupId: string;
    horizon: Date;
    importance: number;
    projectName: string;
    sbsysId: number;
    timeframe: number;
    obsolete: boolean;
}

export interface User{
    name: string;
    shortid: string;
    hasPermission: (permission: string) => boolean;
}

export default class SPS {
    private ses: SpatialServer.Session;

    constructor() {
        this.ses = new SpatialServer.Session();
    }

    async initialize(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise ((resolve, _reject) => {
            this.ses.asyncInit(async () => {
                resolve();
            });
        });
    }

    getUser(): SpatialServer.Principal {
        return this.ses.getPrincipal()
    }

    getParameter(paramName:string):string {
        return this.ses.getParam(paramName)
    }

    async getProfiles(): Promise<Profile[]> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, _reject) => {
            this.ses.createPageRequest('profileselector_get_profiles').call(null, (profileResponse) => {
                const availableProfiles: Profile[] = profileResponse.row[0].row.map(p => {
                    return {
                        profileName: p.name,
                        displayName: p.displayname
                    };
                });
                resolve(availableProfiles);
            });
        });
    }

    async executeOnDs(dsName: string, options?: SpatialServer.ExecutionOptions): Promise<Record<string,SpatialServer.SpsTypes>[]> {
        return new Promise((resolve, reject) => {
            const opts = options? options : {command: 'read'};
            const ds = this.ses.getDatasource(dsName);
            ds.execute(opts, (resp) => {
                if (isExecption(resp)) {
                    reject(resp)
                } else {
                    resolve(resp);
                }
            });
        });
    }

    async getTimeRegistrationData(): Promise<TimeEntry[]> {
        const data = await this.executeOnDs('lk_tasm_registration', {command: "read-by-user"});
        const timeEntries: TimeEntry[] = data.map(element => {
            return {
                taskDate: new Date(element.task_date as string),
                id: parseInt(element.id as string),
                note: element.note as string,
                taskId: parseInt(element.task_id as string),
                taskTime: parseInt(element.task_time as string),
                userId: element.user_id as string,
                taskStart: new Date(element.task_start as string),
                taskEnd: new Date(element.task_end as string),
                allDay:element.all_day as boolean,
            }
        })
        return timeEntries
    }

    async getTaskData(): Promise<FavoritTask[]> {
        const data = await this.executeOnDs('lk_tasm_tasks', {command: "read-current"});        
        // console.log('lk_tasm_tasks: ', data)
        const favorites = await this.getFavoritTasks();
        const taskData: FavoritTask[] = data.map(element => {
            const id = parseInt(element.id as string);
            const projectId = parseInt(element.project_id as string);
            return {
                id,
                projectId,
                taskName: element.task_name as string,
                description: element.description as string,
                isFavorite: favorites.includes(id)
            }
        })
        return taskData
    }

        
    async getProjectsData(): Promise<Project[]> {
        const data = await this.executeOnDs('lk_tasm_projects', {command: "read-current"});
        // console.log('lk_tasm_projects: ', data)
        // filter for obsolete not true only false are valid projects
        const projectData: Project[] = data.map(element => {
            const id = parseInt(element.id as string);
            return {
                id,
                groupId: element.group_id as string,
                projectName: element.project_name as string,
                horizon: new Date(element.horizon as string),
                importance: parseInt(element.importance as string),
                sbsysId: parseInt(element.group_id as string),
                timeframe: parseInt(element.timeframe as string),
                obsolete: element.obsolete === 'true',
                
            }
        })
        return projectData
    }

        
    async getUsersData(): Promise<unknown[]> {
        const data = await this.executeOnDs('lk_tasm_users');
        // console.log('UsersData: ',data)
        return data
    }

    async insertTimeRegistration(entry: TimeEntry): Promise<void> {
        // console.log('TimeEntry: ',entry)
        // console.log('allDay: ',typeof entry.allDay)

        try{
            await this.executeOnDs('lk_tasm_registration', {command: "insert-registration", 
            ...entry,
            taskDate: format(entry.taskDate, 'yyyy-MM-dd'),
            taskStart: format(entry.taskStart, 'yyyy-MM-dd HH:mm'),
            taskEnd: format(entry.taskEnd, 'yyyy-MM-dd HH:mm')
         });
        }catch(e){
            console.error(e.exception.message)
            throw new Error('Tidsregistrering fejlede');
        }        
    }

    async deleteTimeRegistration(id: number): Promise<void> {
        this.executeOnDs('lk_tasm_registration', {command: "delete-by-id", id});
    }

    async updateTimeRegistration(entry: TimeEntry): Promise<void> {
        // console.log('TimeEntry: ',entry)
        // console.log('allDay: ',typeof entry.allDay)
        try{
            await this.executeOnDs('lk_tasm_registration', {command: "update-by-id", 
            ...entry,
            taskDate: format(entry.taskDate, 'yyyy-MM-dd'),
            taskStart: format(entry.taskStart, 'yyyy-MM-dd HH:mm'),
            taskEnd: format(entry.taskEnd, 'yyyy-MM-dd HH:mm')
         });
        }catch(e){
            console.error(e.exception.message)
            throw new Error('Opdatering af tidsregistrering fejlede');
        }        
    }

    async getFavoritTasks(): Promise<number[]> {
        const data = await this.executeOnDs('lk_tasm_favorites', {command: "read-by-user"});
        return data.map(r=> parseInt(r.task_id as string))
    }

    async updateFavorites(favoriteIds: number[]): Promise<void> {
        await this.executeOnDs('lk_tasm_favorites', {command: "delete-by-user"});
        for (const favoriteId of favoriteIds) {
            await this.executeOnDs('lk_tasm_favorites', {command: "insert", taskId: favoriteId});
        }        
    }
            
    async getAdminProjectsData(): Promise<Project[]> {
        const data = await this.executeOnDs('lk_tasm_admin_projects');
        console.log('AdminProjectsData: ',data)
        const projectData: Project[] = data.map(element => {
            const id = parseInt(element.id as string);
            return {
                id,
                groupId: element.group_id as string,
                projectName: element.project_name as string,
                horizon: new Date(element.horizon as string),
                importance: parseInt(element.importance as string),
                timeframe: parseInt(element.timeframe as string),
                sbsysId: parseInt(element.sbsys_id as string),
                obsolete: element.obsolete === 'true',
            }
        })
        return projectData
    }

    
    async insertProject(entry: Project): Promise<void> {
        // console.log('Project: ',entry)

        try{
            await this.executeOnDs('lk_tasm_admin_projects', {command: "insert-project", 
            ...entry,
            horizon: format(entry.horizon, 'yyyy-MM-dd')
         });
        }catch(e){
            console.error(e.exception.message)
            throw new Error('Projekt oprettelse fejlede');
        }        
    }

    async updateProject(entry: Project): Promise<void> {
        // console.log('Project: ',entry)
        try{
            await this.executeOnDs('lk_tasm_admin_projects', {command: "update-project-by-id", 
            ...entry,
            horizon: format(entry.horizon, 'yyyy-MM-dd')
         });
        }catch(e){
            console.error(e.exception.message)
            throw new Error('Opdatering af projektet fejlede');
        }        
    }
            
    async getAdminTasksData(): Promise<Task[]> {
        const data = await this.executeOnDs('lk_tasm_admin_tasks');
        // console.log('AdminTasksData: ',data)
        const taskData: Task[] = data.map(element => {
            const id = parseInt(element.id as string);
            return {
                id,
                projectId: parseInt(element.project_id as string),
                taskName: element.task_name as string,
                milestone: new Date(element.milestone as string),
                importance: parseInt(element.importance as string),
                timeframe: parseInt(element.timeframe as string),
                description: element.description as string,
                obsolete: element.obsolete === 'true',
            }
        })
        return taskData
    }

    async insertTask(entry: Task): Promise<void> {
        // console.log('Task: ',entry)

        try{
            await this.executeOnDs('lk_tasm_admin_tasks', {command: "insert-task", 
            ...entry,
            milestone: format(entry.milestone, 'yyyy-MM-dd')
         });
        }catch(e){
            console.error(e.exception.message)
            throw new Error('Projekt oprettelse fejlede');
        }        
    }

    async updateTask(entry: Task): Promise<void> {
        // console.log('Task: ',entry)
        try{
            await this.executeOnDs('lk_tasm_admin_tasks', {command: "update-task-by-id", 
            ...entry,
            milestone: format(entry.milestone, 'yyyy-MM-dd')
         });
        }catch(e){
            console.error(e.exception.message)
            throw new Error('Opdatering af projektet fejlede');
        }        
    }
}
