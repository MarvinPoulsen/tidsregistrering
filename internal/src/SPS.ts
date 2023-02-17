import format from 'date-fns/format'

function isExecption(resp: SpatialServer.DSResponse): resp is SpatialServer.SPSError { 
    return !!(resp as SpatialServer.SPSError).exception
}

interface Profile {
    profileName: string;
    displayName: string;
  }
/**
 * @description
 */
export interface TimeEntry {
    taskDate: Date;
    id?: number;
    note: string;
    taskId: number;
    taskTime: number;
    userId: string;
    taskStart: Date;
    taskEnd: Date;
    allDay:boolean;
}  

export interface Task {
    id: number;
    projectId: number;
    taskName: string;
    description: string;
    isFavorite: boolean;
} 

export interface Project {
    id: number;
    // groupId: string;
    // horizon: Date;
    // importance: number;
    projectName: string;
    // sbsysId: number;
    // timeframe: number;
}

export interface User{
    name: string;
    shortId: string;
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

    async getTaskData(): Promise<Task[]> {
        const data = await this.executeOnDs('lk_tasm_tasks', {command: "read-current"});        
        // console.log('lk_tasm_tasks: ', data)
        const favorites = await this.getFavoritTasks();
        const taskData: Task[] = data.map(element => {
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
                projectName: element.project_name as string,
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
}
