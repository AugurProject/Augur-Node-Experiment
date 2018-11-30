import { Data } from './constants';
import * as Knex from "knex";

export class SQLiteDataCommiter {
    private readonly db: Knex;

    public constructor(db: Knex) {
        this.db = db;
    }

    public async initialize(): Promise<void> {
        await this.db.schema.createTable("data", (table: Knex.CreateTableBuilder): void => {
            table.string("_id", 66).primary().notNullable();
            table.integer("a").defaultTo(0);
            table.integer("b").defaultTo(0);
        });
    }

    public async commitDataSerially(data: Array<Data>): Promise<void> {
        for (let item of data) {
            await this.db.transaction(function(trx) {
                return trx.insert(item).into("data");
            });
        }
    }

    public async commitDataBulk(data: Array<Data>): Promise<void> {
        await this.db.transaction(function(trx) {
            return trx.batchInsert("data", data, 100);
        });
    }
}