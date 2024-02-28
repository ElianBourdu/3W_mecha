export interface IGuide {
  guide__id: string,
  user__id: string,
  title: string,
  content: string
}

export class Guide implements IGuide {
  public guide__id: string
  public user__id: string
  public title: string
  public content: string

  public static fromObject(object: IGuide): Guide {
    const guide = new Guide()
    guide.guide__id = object.guide__id
    guide.user__id = object.user__id
    guide.title = object.title
    guide.content = object.content
    return guide
  }

  public toJson(): Record<string, string> {
    return {
      guide__id: this.guide__id,
      user__id: this.user__id,
      title: this.title,
      content: this.content
    }
  }
}