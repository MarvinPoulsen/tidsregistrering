import format from 'date-fns/format'

function isExecption(resp: SpatialServer.DSResponse): resp is SpatialServer.SPSError { 
    return !!(resp as SpatialServer.SPSError).exception
}

interface Profile {
    name: string;
    displayName: string;
  }

export interface TimeEntry {
    date: Date;
    id?: number;
    note: string;
    taskId: number;
    time: number;
    userId: string;
}  

export interface Task {
    id: number;
    name: string;
    description: string;
    isFavorite: boolean;
} 

export interface Project {
    id: number;
    group_id: string;
    horizon: Date;
    importance: number;
    name: string;
    sbsys_id: number;
    timeframe: number;
}



export default class SPS {
    private ses: SpatialServer.Session;

    constructor() {
        this.ses = new SpatialServer.Session();
    }

    async initialize(): Promise<void> {
        return new Promise ((resolve, _reject) => {
            this.ses.asyncInit(async () => {
                resolve();
            });
        });
    }

    getUser(): SpatialServer.Principal {
        return this.ses.getPrincipal()
    }

    async getProfiles(): Promise<Profile[]> {
        return new Promise((resolve, _reject) => {
            this.ses.createPageRequest('profileselector_get_profiles').call(null, (profileResponse) => {
                const availableProfiles: Profile[] = profileResponse.row[0].row.map(p => {
                    return {
                        name: p.name,
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
        const data = await this.executeOnDs('lk_tmm_registration', {command: "read-by-user"});
        const timeEntries: TimeEntry[] = data.map(element => {
            return {
                date: new Date(element.date as string),
                id: parseInt(element.id as string),
                note: element.note as string,
                taskId: parseInt(element.task_id as string),
                time: parseInt(element.time as string),
                userId: element.user_id as string,
            }
        })
        return timeEntries
    }

    async getTaskData(): Promise<Task[]> {
        const data = await this.executeOnDs('lk_tmm_tasks');
        const favorites = await this.getFavoritTasks();
        const taskData: Task[] = data.map(element => {
            const id = parseInt(element.id as string);
            return {
                id,
                name: element.name as string,
                description: element.description as string,
                isFavorite: favorites.includes(id)
            }
        })
        return taskData
    }

        
    async getProjectsData(): Promise<any[]> {
        const data = await this.executeOnDs('lk_tmm_projects');
        return data
    }

        
    async getUsersData(): Promise<any[]> {
        const data = await this.executeOnDs('lk_tmm_users');
        return data
    }

    async insertTimeRegistration(entry: TimeEntry): Promise<void> {
        try{
            await this.executeOnDs('lk_tmm_registration', {command: "insert-registration", 
            ...entry,
            date: format(entry.date, 'yyyy-MM-dd')
         });
        }catch(e){
            console.error(e.exception.message)
            throw new Error('Tidsregistrering fejlede');
        }        
    }

    async deleteTimeRegistration(id: number): Promise<void> {
        this.executeOnDs('lk_tmm_registration', {command: "delete-by-id", id});
    }

    async updateTimeRegistration(entry: TimeEntry): Promise<void> {
        try{
            await this.executeOnDs('lk_tmm_registration', {command: "update-by-id", 
            ...entry,
            date: format(entry.date, 'yyyy-MM-dd')
         });
        }catch(e){
            console.error(e.exception.message)
            throw new Error('Opdatering af tidsregistrering fejlede');
        }        
    }

    async getFavoritTasks(): Promise<number[]> {
        const data = await this.executeOnDs('lk_tmm_favorites', {command: "read-by-user"});
        return data.map(r=> parseInt(r.task_id as string))
    }
}
