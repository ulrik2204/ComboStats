class Element {
  private name: string;
  private chara: string[]; // The characteristics of an element
  constructor(name: string, ...chara: string[]) {
    this.name = name;
    this.chara = chara;
  }
}

export default Element;
