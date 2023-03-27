const reg = /[A-Z]/g;
export const transformDomStyle = (key: string): string => key.replace(reg, (v) => "-" + v.toLowerCase());
export const styleToText = (style: Record<string, string>) => Object.keys(style).reduce((curr, key) => curr + transformDomStyle(key) + ":" + style[key] + ";",'');

export type UnknownProps = Record<string, any>;

export const isEvent = (key: string) => key.startsWith("on");
export const isNew = (prev: UnknownProps, next: UnknownProps) => (key: string) => prev[key as keyof UnknownProps] !== next[key as keyof UnknownProps];
export const isGone = (_prev: UnknownProps, next: UnknownProps) => (key: string) => !(key in next);
export const isProperty = (key: string) => !isEvent(key);

export const  getGoneProps = (prevProps: UnknownProps, nextProps: UnknownProps) => Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps));

export const getNewOrChanged = (prevProps: UnknownProps, nextProps: UnknownProps) => Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))