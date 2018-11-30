import { Data } from './constants';

export class PouchDataCommiter {
    private readonly db: any;

    public constructor(db: any) {
        this.db = db;
    }

    public async commitDataSerially(data: Array<Data>): Promise<void> {
        for (let item of data) await this.db.put(item);
    }

    public async commitDataBulk(data: Array<Data>): Promise<void> {
        await this.db.bulkDocs(data);
    }
}