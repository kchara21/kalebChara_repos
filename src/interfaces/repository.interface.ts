

export type state = 'E' | 'D' | 'A';
export type status = 'A' | 'I';

export interface State {
   state:state;
}

export interface Status {
    status:status;
}