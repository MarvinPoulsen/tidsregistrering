import format from 'date-fns/format';

function isExecption(resp: SpatialServer.DSResponse): resp is SpatialServer.SPSError {
    return !!(resp as SpatialServer.SPSError).exception;
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
    allDay: boolean;
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
    teamId: number;
    horizon: Date;
    importance: number;
    projectName: string;
    sbsysId: number;
    timeframe: number;
    obsolete: boolean;
}

export interface SpsUser {
    name: string;
    shortid: string;
    hasPermission: (permission: string) => boolean;
}

export interface User {
    id: number;
    name: string;
    abbreviation: string;
    normName: string;
    balance: number;
    team: string;
    sektor: string;
    obsolete: boolean;
}

export interface Holiday {
    id: number;
    title: string;
    note: string;
    allDay: boolean;
    start: Date;
    end: Date;
    workTime: number;
}

export interface FlexBalance {
    id: number;
    userId: string;
    balanceDate: Date;
    flexBalance: number;
    obsolete: boolean;
}

export interface Norm {
    id: number;
    normName: string;
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
    obsolete: boolean;
}

export default class SPS {
    private ses: SpatialServer.Session;

    constructor() {
        this.ses = new SpatialServer.Session();
    }

    async initialize(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, _reject) => {
            this.ses.asyncInit(async () => {
                resolve();
            });
        });
    }

    getUser(): SpatialServer.Principal {
        return this.ses.getPrincipal();
    }

    getParameter(paramName: string): string {
        return this.ses.getParam(paramName);
    }

    async getProfiles(): Promise<Profile[]> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, _reject) => {
            this.ses.createPageRequest('profileselector_get_profiles').call(null, (profileResponse) => {
                const availableProfiles: Profile[] = profileResponse.row[0].row.map((p) => {
                    return {
                        profileName: p.name,
                        displayName: p.displayname,
                    };
                });
                resolve(availableProfiles);
            });
        });
    }

    async executeOnDs(
        dsName: string,
        options?: SpatialServer.ExecutionOptions
    ): Promise<Record<string, SpatialServer.SpsTypes>[]> {
        return new Promise((resolve, reject) => {
            const opts = options ? options : { command: 'read' };
            const ds = this.ses.getDatasource(dsName);
            ds.execute(opts, (resp) => {
                if (isExecption(resp)) {
                    reject(resp);
                } else {
                    resolve(resp);
                }
            });
        });
    }

    async getTimeRegistrationData(): Promise<TimeEntry[]> {
        const data = await this.executeOnDs('lk_tasm_registration', { command: 'read-by-user' });
        const timeEntries: TimeEntry[] = data.map((element) => {
            return {
                taskDate: new Date(element.task_date as string),
                id: parseInt(element.id as string),
                note: element.note as string,
                taskId: parseInt(element.task_id as string),
                taskTime: parseInt(element.task_time as string),
                userId: element.user_id as string,
                taskStart: new Date(element.task_start as string),
                taskEnd: new Date(element.task_end as string),
                allDay: element.all_day as boolean,
            };
        });
        return timeEntries;
    }

    async getTaskData(): Promise<FavoritTask[]> {
        const data = await this.executeOnDs('lk_tasm_tasks', { command: 'read-current' });
        // console.log('lk_tasm_tasks: ', data)
        const favorites = await this.getFavoritTasks();
        const taskData: FavoritTask[] = data.map((element) => {
            const id = parseInt(element.id as string);
            const projectId = parseInt(element.project_id as string);
            return {
                id,
                projectId,
                taskName: element.task_name as string,
                description: element.description as string,
                isFavorite: favorites.includes(id),
            };
        });
        return taskData;
    }

    async getProjectsData(): Promise<Project[]> {
        const data = await this.executeOnDs('lk_tasm_projects', { command: 'read-current' });
        // console.log('lk_tasm_projects: ', data)
        // filter for obsolete not true only false are valid projects
        const projectData: Project[] = data.map((element) => {
            const id = parseInt(element.id as string);
            return {
                id,
                teamId: parseInt(element.team_id as string),
                projectName: element.project_name as string,
                horizon: new Date(element.horizon as string),
                importance: parseInt(element.importance as string),
                sbsysId: parseInt(element.sbsys_id as string),
                timeframe: parseInt(element.timeframe as string),
                obsolete: element.obsolete === 'true',
            };
        });
        return projectData;
    }

    async getOwnUserData(): Promise<User> {
        const data = await this.executeOnDs('lk_tasm_users', { command: 'read-own-user' });
        // console.log('read-own-user: ',typeof data, data)
            const balance = data[0].balance ? parseFloat(data[0].balance as string) : 0;
        return {
            id: parseInt(data[0].id as string),
            name: data[0].user_name as string,
            abbreviation: data[0].abbreviation as string,
            normName: data[0].norm as string,
            balance,
            team: data[0].team as string,
            sektor: data[0].sektor as string,
            obsolete: data[0].obsolete === 'true',
        }
    }

    async insertTimeRegistration(entry: TimeEntry): Promise<void> {
        // console.log('TimeEntry: ',entry)
        // console.log('allDay: ',typeof entry.allDay)

        try {
            await this.executeOnDs('lk_tasm_registration', {
                command: 'insert-registration',
                ...entry,
                taskDate: format(entry.taskDate, 'yyyy-MM-dd'),
                taskStart: format(entry.taskStart, 'yyyy-MM-dd HH:mm'),
                taskEnd: format(entry.taskEnd, 'yyyy-MM-dd HH:mm'),
            });
        } catch (e) {
            console.error(e.exception.message);
            throw new Error('Tidsregistrering fejlede');
        }
    }

    async deleteTimeRegistration(id: number): Promise<void> {
        this.executeOnDs('lk_tasm_registration', { command: 'delete-by-id', id });
    }

    async updateTimeRegistration(entry: TimeEntry): Promise<void> {
        // console.log('TimeEntry: ',entry)
        // console.log('allDay: ',typeof entry.allDay)
        try {
            await this.executeOnDs('lk_tasm_registration', {
                command: 'update-by-id',
                ...entry,
                taskDate: format(entry.taskDate, 'yyyy-MM-dd'),
                taskStart: format(entry.taskStart, 'yyyy-MM-dd HH:mm'),
                taskEnd: format(entry.taskEnd, 'yyyy-MM-dd HH:mm'),
            });
        } catch (e) {
            console.error(e.exception.message);
            throw new Error('Opdatering af tidsregistrering fejlede');
        }
    }

    async getFavoritTasks(): Promise<number[]> {
        const data = await this.executeOnDs('lk_tasm_favorites', { command: 'read-by-user' });
        return data.map((r) => parseInt(r.task_id as string));
    }

    async updateFavorites(favoriteIds: number[]): Promise<void> {
        await this.executeOnDs('lk_tasm_favorites', { command: 'delete-by-user' });
        for (const favoriteId of favoriteIds) {
            await this.executeOnDs('lk_tasm_favorites', { command: 'insert', taskId: favoriteId });
        }
    }

    async getAdminProjectsData(): Promise<Project[]> {
        const data = await this.executeOnDs('lk_tasm_admin_projects');
        // console.log('AdminProjectsData: ',data)
        const projectData: Project[] = data.map((element) => {
            const id = parseInt(element.id as string);
            return {
                id,
                teamId: parseInt(element.team_id as string),
                projectName: element.project_name as string,
                horizon: new Date(element.horizon as string),
                importance: parseInt(element.importance as string),
                timeframe: parseInt(element.timeframe as string),
                sbsysId: parseInt(element.sbsys_id as string),
                obsolete: element.obsolete === 'true',
            };
        });
        return projectData;
    }

    async insertProject(entry: Project): Promise<void> {
        // console.log('Project: ',entry)

        try {
            await this.executeOnDs('lk_tasm_admin_projects', {
                command: 'insert-project',
                ...entry,
                horizon: format(entry.horizon, 'yyyy-MM-dd'),
            });
        } catch (e) {
            console.error(e.exception.message);
            throw new Error('Projekt oprettelse fejlede');
        }
    }

    async updateProject(entry: Project): Promise<void> {
        // console.log('Project: ',entry)
        try {
            await this.executeOnDs('lk_tasm_admin_projects', {
                command: 'update-project-by-id',
                ...entry,
                horizon: format(entry.horizon, 'yyyy-MM-dd'),
            });
        } catch (e) {
            console.error(e.exception.message);
            throw new Error('Opdatering af projektet fejlede');
        }
    }

    async getAdminTasksData(): Promise<Task[]> {
        const data = await this.executeOnDs('lk_tasm_admin_tasks');
        // console.log('AdminTasksData: ',data)
        const taskData: Task[] = data.map((element) => {
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
            };
        });
        return taskData;
    }

    async insertTask(entry: Task): Promise<void> {
        // console.log('Task: ',entry)

        try {
            await this.executeOnDs('lk_tasm_admin_tasks', {
                command: 'insert-task',
                ...entry,
                milestone: format(entry.milestone, 'yyyy-MM-dd'),
            });
        } catch (e) {
            console.error(e.exception.message);
            throw new Error('Projekt oprettelse fejlede');
        }
    }

    async updateTask(entry: Task): Promise<void> {
        // console.log('Task: ',entry)
        try {
            await this.executeOnDs('lk_tasm_admin_tasks', {
                command: 'update-task-by-id',
                ...entry,
                milestone: format(entry.milestone, 'yyyy-MM-dd'),
            });
        } catch (e) {
            console.error(e.exception.message);
            throw new Error('Opdatering af projektet fejlede');
        }
    }

    
    async getAdminUsersData(): Promise<User[]> {
        const data = await this.executeOnDs('lk_tasm_admin_users', { command: 'read-all-users' });
        const userData: User[] = data.map((element) => {
            const id = parseInt(element.id as string);
            const balance = element.balance ? parseFloat(element.balance as string) : 0;
            return {
                id,
                name: element.user_name as string,
                abbreviation: element.abbreviation as string,
                normName: element.norm as string,
                balance: parseFloat(element.balance as string),
                team: element.team as string,
                sektor: element.sektor as string,
                obsolete: element.obsolete === 'true',
            };
        });
        return userData;
    }

    
    async getHolidays(): Promise<Holiday[]> {
        const data = await this.executeOnDs('lk_tasm_holidays', { command: 'read-all' });
        // console.log('lk_tasm_holidays: ', data)
        const holidaysData: Holiday[] = data.map((element) => {
            const id = parseInt(element.id as string);
            const workTime = element.work_time ? parseInt(element.work_time as string) : null; 
            return {
                id,
                title: element.holiday_name as string,
                note: element.note as string,
                allDay: element.all_day === 'true',
                start: new Date(element.holiday_start as string),
                end: new Date(element.holiday_end as string),
                workTime,
            };
        });
        return holidaysData;
    }
    
    async getBalances(): Promise<FlexBalance[]> {
        const data = await this.executeOnDs('lk_tasm_balances', { command: 'read-by-user' });
        // console.log('lk_tasm_balances: ', data)
        const balances: FlexBalance[] = data.map((element) => {
            const id = parseInt(element.id as string);
            return {
                id,
                userId: element.user_id as string,
                balanceDate: new Date(element.balance_date as string),
                flexBalance: parseInt(element.flex_balance as string),
                obsolete: element.obsolete === 'true',
            };
        });
        return balances;
    }
    
    async getOwnNorms(normName: string): Promise<number[]> {
        const data = await this.executeOnDs('lk_tasm_norms', { command: 'read-by-name', normName });
        // console.log('lk_tasm_norms: ', data)
        let norm: number[] = []
        norm.push(parseInt(data[0].sunday as string))
        norm.push(parseInt(data[0].monday as string))
        norm.push(parseInt(data[0].tuesday as string))
        norm.push(parseInt(data[0].wednesday as string))
        norm.push(parseInt(data[0].thursday as string))
        norm.push(parseInt(data[0].friday as string))
        norm.push(parseInt(data[0].saturday as string))
        return norm;
    }
}