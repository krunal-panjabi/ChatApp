declare interface JQuery<TElement = HTMLElement> {
    slick(): JQuery;
    slick(methodName: 'slickGoTo', index: number): JQuery;
    slick(methodName: string, ...args: any[]): JQuery;
  }
  