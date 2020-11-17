export interface File {
  name: string;
  created: Date;
}

export interface CommandObject {
  rawfile?: string;
  nosync?: boolean;
}