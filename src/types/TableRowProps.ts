import { JSX } from "react";

export interface TableRow {
    [key: string]: string | number | JSX.Element;
  }