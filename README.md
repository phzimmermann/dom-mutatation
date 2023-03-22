# dom-mutatation
Simple dom mutation as base for frontend frameworks. This library serves as a layer to build frontend frameworks on top of it. An abstraction to manipulate DOM without making the hands dirty.

## Create a new `DomMutation` object

Either you can create an object that lives only in memory for testing or server purposes or you can work with the browser dom

### BrowserMutation
``` typescript
import { createBrowserMutation } from "dom-mutation";

const root = document.getElementById("root");

const domMutation = createBrowserMutation(root);
```

### MemoryMutation

``` typescript
import { createMemoryMutation } from "dom-mutation";

const domMutation = createMemoryMutation();
```

## Add elements to the dom

``` typescript
const divElement = domMutation.add(domMutation.getRoot(), null, 'div', { style: { color: 'blue' } })
const txtElement = domMutation.add(divElement, null, 'text', { text: 'Hello World' })
```

## Remove elements:
Pass the pointer to the element you want to delete to the DomMutation.
``` typescript
domMutation.remove(element);
```

## Update elements:
To update elements, you need to store the previous props somewhere.
``` typescript
domMutation.update(
  element, // whatever you receive from domMutation.add(...)
  prevProps, // props that you sent the last time, it's your job to trigger this update function and to store the last props.
  nextProps, // new props
)
```
