import { DomElement, DomELementType, DomMutation, Props } from "./domMutation";
import { isEvent, styleToText } from "./utils";

type BrowserDomElement = DomElement & {
    dom: HTMLElement;
}

const createBrowserDomMutation = (rootElement: HTMLElement): DomMutation => {
    const root: BrowserDomElement = {
        parent: null,
        dom: rootElement,
        type: 'root',
    }
    return {
        getRoot: () => root,
        add: <T extends DomELementType>(parent: DomElement, after: DomElement | null, type: DomELementType, props: Props<T>) => {
            const dom = type === 'text'
                ? createTextNode((parent as BrowserDomElement).dom, (after as BrowserDomElement | null)?.dom || null, (props as Props<'text'>).text || "")
                : createHtmlNode((parent as BrowserDomElement).dom, (after as BrowserDomElement | null)?.dom || null, type, props );
            return {
                parent,
                dom,
                props,
                type,
            }
        },
        remove: (element: DomElement) => {
            (element.parent as BrowserDomElement).dom.removeChild((element as BrowserDomElement).dom);
        },
        update: <T extends DomELementType>(element: DomElement, prevProps: Props<T>, nextProps: Props<T>) => {
            updateProps((element as BrowserDomElement).dom, prevProps, nextProps);
        },
    }
}

const createTextNode = (parentDom: HTMLElement, after: HTMLElement | null, text: string) => {
    const dom = document.createTextNode(text);
    parentDom.insertBefore(dom, after?.nextSibling || null)
    return dom;
}

const createHtmlNode = <T extends DomELementType>(parentDom: HTMLElement, after: HTMLElement | null, type: T,  props: Props<T>) => {
    const dom = document.createElement(type);
    parentDom.insertBefore(dom, after?.nextSibling || null);
    updateProps(dom, {}, props);
    return dom;
}

type UknownProps = Record<string, any>;

const isProperty = (key: string) => key !== "children" && !isEvent(key);
const isNew = (prev: UknownProps, next: UknownProps) => (key: string) => prev[key as keyof UknownProps] !== next[key as keyof UknownProps];
const isGone = (prev: UknownProps, next: UknownProps) => (key: string) => !(key in next);

const updateProps = (dom: HTMLElement, prevProps: UknownProps, nextProps: UknownProps) => {
    Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
        // @ts-ignore
      dom[name] = "";
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      if (name === "style") {
        // update style
        // @ts-ignore
        dom.style = styleToText(nextProps.style)
        // transformDomStyle(dom, nextProps.style);
      } else if (name === "className") {
        // update className
        prevProps.className &&
          dom.classList.remove(...prevProps.className.split(/\s+/));
        dom.classList.add(...(nextProps.className || '').split(/\s+/));
      } else {
        // @ts-ignore
        dom[name] = nextProps[name];
      }
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

export default createBrowserDomMutation;