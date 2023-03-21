import createMemoryDomMutation, { MemoryDomElement } from "../memoryDomMutation";

describe("memoryDomMutation", () => {
  test("creates a root", () => {
    const domMutation = createMemoryDomMutation();
    expect(domMutation.getRoot()).toEqual({
      children: [],
      parent: null,
      type: 'root',
      props: {},
    });
  });

  test("adds stuff to root", () => {
    const domMutation = createMemoryDomMutation();
    const child1 = domMutation.add(domMutation.getRoot(), null, 'div', {})
    domMutation.add(domMutation.getRoot(), child1, 'text', { text: 'blah' });

    expect((domMutation.getRoot() as MemoryDomElement<'root'>).children).toEqual(
        [
            {
                parent: domMutation.getRoot(),
                children: [],
                type: 'div',
                props: {},
            },
            {
                parent: domMutation.getRoot(),
                children: [],
                type: 'text',
                props: { text: 'blah' },
            },
        ]
    )
  });

  test("removes child", () => {
    const domMutation = createMemoryDomMutation();
    const child1 = domMutation.add(domMutation.getRoot(), null, 'div', {})
    domMutation.add(domMutation.getRoot(), child1, 'text', { text: 'blah' });

    domMutation.remove(child1);

    expect((domMutation.getRoot() as MemoryDomElement<'root'>).children).toEqual(
        [
            {
                parent: domMutation.getRoot(),
                children: [],
                type: 'text',
                props: { text: 'blah' },
            },
        ]
    )
  });

  test("updates props", () => {
    const domMutation = createMemoryDomMutation();
    const child1 = domMutation.add(domMutation.getRoot(), null, 'div', { title: '100%' })
    const child2 = domMutation.add(domMutation.getRoot(), child1, 'text', { text: '70% '});

    domMutation.update(child2, { text: '70% '}, { text: '100%' });

    expect((domMutation.getRoot() as MemoryDomElement<'root'>).children).toEqual(
        [
            {
                parent: domMutation.getRoot(),
                children: [],
                type: 'div',
                props: { title: '100%' },
            },
            {
                parent: domMutation.getRoot(),
                children: [],
                type: 'text',
                props: { text: '100%' },
            },
        ]
    )
  });

  test("render to string", () => {
    const domMutation = createMemoryDomMutation();
    const child1 = domMutation.add(domMutation.getRoot(), null, 'div', { style: { borderLeft: 'pink solid 1px' }, title: "100%", onClick: () => {} })
    domMutation.add(child1, null, 'text', { text: 'test-text'});

    expect(domMutation.renderToString()).toBe("<div title=\"100%\" style=\"border-left:pink solid 1px;\">test-text</div>")
  });
});
