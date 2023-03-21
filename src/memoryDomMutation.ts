import { DomElement, DomELementType, DomMutation, Props } from "./domMutation";
import { isEvent, styleToText, transformDomStyle } from "./utils";

export interface MemoryDomElement<T extends DomELementType> extends DomElement {
    children: MemoryDomElement<any>[];
    props: Props<T>;
}

export type MemoryDomMutation = DomMutation & { renderToString: () => string };

const createMemoryDomMutation = (): MemoryDomMutation => {
  const root: MemoryDomElement<'root'> = { parent: null, children: [], type: 'root', props: {} };
  return {
    getRoot: (): MemoryDomElement<'root'> => root,
    add: <T extends DomELementType>(parent: DomElement, after: DomElement | null, type: T, props: Props<T>) => {
      const newElement: MemoryDomElement<T> = {
        parent,
        children: [],
        type,
        props,
      };
      const parentChildren = (parent as MemoryDomElement<any>).children;
      if (after) {
        const index = parentChildren.findIndex((child) => child === after);
        (parent as MemoryDomElement<any>).children = [...parentChildren.filter((_child, i) => i <= index), newElement, ...parentChildren.filter((_child, i) => i > index)]
      } else {
        (parent as MemoryDomElement<any>).children = [newElement, ...parentChildren];
      }
      return newElement;
    },
    remove: (element: DomElement) => {
        const parentChildren = (element.parent as MemoryDomElement<any>).children;
        element.parent && ((element.parent as MemoryDomElement<any>).children = parentChildren.filter(child => child !== element));
    },
    update: <T extends DomELementType>(element: DomElement, _prevProps: Props<T>, nextProps: Props<T>) => {
        (element as MemoryDomElement<any>).props = nextProps;
    },
    renderToString: () => {
        return root.children.map(renderElement).join("")
    }
  };
};

const renderElement = (element: DomElement): string => {
    if (element.type === "text") {
        return (element as MemoryDomElement<any>).props.text as string;
    }

    const { style, ...props } = (element as MemoryDomElement<any>).props;
    const styleText = !!style ? styleToText(style) : "";

    const propText = propsToText({...props, style: styleText });
    const start = "<" + element.type + propText + ">";
    const end = "</" + element.type + ">";
    const children = (element as MemoryDomElement<any>).children.map(renderElement).join("");

    return start + children + end;
}

const propsToText = (props: Record<string, any>) => Object.keys(props)
    .filter(key => !isEvent(key))
    .reduce((curr, key) => curr + " " + transformDomStyle(key) + "=\"" + props[key].toString() + "\"","")

export default createMemoryDomMutation;