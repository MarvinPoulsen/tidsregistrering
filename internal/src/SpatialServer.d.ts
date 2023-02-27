declare namespace SpatialServer {
    class Principal {
        name: string;
        shortid: string;
        isanonymous: boolean;
        hasPermission: (permission: string) => boolean;
        getTicket: () => string;
    }

    class Page {
        call: (unknown: null, callback: (resp: any) => void) => void;
    }

    interface SPSError {
        exception: {
            message: string;
        }
    }
    type SpsTypes = number | string | boolean;

    interface ExecutionOptions {
        command: string;
    }

    interface knownExecutionOptions {
        command: string;
        outputformat?: "json",
        jsonFormat?: "compact"
    }
    
    interface ExecutionOptions {
        [key : string]: any | knownExecutionOptions;
    }

    type DSResponse = Record<string,SpsTypes>[] | SPSError;

    class Datasource {
        execute: (options: ExecutionOptions, callback: (data: DSResponse) => void) => void;
    }

    class Session {
        asyncInit: (callback: () => void) => void;
        getPrincipal: () => Principal;
        createPageRequest: (page: string) => Page;
        getDatasource: (name: string) => Datasource;
        getString: (name: string, ...params: string[]) => string;
        getParam: (name: string) => string;
        getSfs: (sfsOpts: {ticket: string}, readyHandler: (sfs: Sfs) => void, errorHandler: (err: any) => void) => SpatialServer.Sfs;
    }

    class Sfs {
        addAttachment: (featureType: string, id: string, name: string, description: string, data: File) => Promise<{id: number}>;
        deleteAttachment: (featureType: string, id: string, attachmentId: string) => Promise<void>;
        getAttachmentList: (featureType: string, id: string) => Promise<string[]>;
        getAttachment: (featureType: string, id: string, attachmentId: string) => Promise<string>;
    }
}


