const reg = /[A-Z]/g;
export const transformDomStyle = (key: string): string => key.replace(reg, (v) => "-" + v.toLowerCase());
export const styleToText = (style: Record<string, string>) => Object.keys(style).reduce((curr, key) => curr + transformDomStyle(key) + ":" + style[key] + ";",'');

export const isEvent = (key: string) => key.startsWith("on");
