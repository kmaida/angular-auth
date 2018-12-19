interface IDino {
  name: string;
  pronunciation: string;
  favorite?: boolean;
}
interface IDinoDetails {
  name: string;
  pronunciation: string;
  meaningOfName: string;
  diet: string;
  length: string;
  period: string;
  mya: string;
  info: string;
  favorite?: boolean;
}

export { IDino, IDinoDetails };
