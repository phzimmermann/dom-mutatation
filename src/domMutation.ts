export type DomELementType = keyof HTMLElementTagNameMap | keyof AdditionalTypes;
type AdditionalTypes = { root: {}; text: { text: string } }

export interface DomElement {
    parent: DomElement | null;
    type: DomELementType;
}

type EventKey = `on${string}`;

export type Props<T extends DomELementType> = T extends (keyof HTMLElementTagNameMap)
    ? Partial<Omit<HTMLElementTagNameMap[T], 'style'> & { style: Partial<HTMLElementTagNameMap[T]['style']>} & Record<EventKey, EventListenerOrEventListenerObject>>
    : T extends (keyof AdditionalTypes) ? AdditionalTypes[T] : never;

export type DomMutation = {
    getRoot: () => DomElement;
    add: <T extends DomELementType>(parent: DomElement, after: DomElement | null, type: T, props: Props<T>) => DomElement;
    remove: (element: DomElement) => void;
    update: <T extends DomELementType>(element: DomElement, prevProps: Props<T>, nextProps: Props<T>) => void;
};
  