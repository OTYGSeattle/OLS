export declare const schemaDirectory: string;
export declare function listSchemas(): Promise<string[]>;
export declare function loadSchema(name: string): Promise<Record<string, unknown>>;
