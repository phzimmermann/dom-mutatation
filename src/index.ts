// import createBrowserDomMutation from "./browserDomMutation";

// const root = document.getElementById('root');

// const mutation = createBrowserDomMutation(root as HTMLElement);

// const propsDiv = {
//     onClick: () => console.log('hello'),
//     style: { borderLeft: 'pink solid 2px', width: '200px', padding: '5px', margin: '5px' },
//     className: 'superClass superClass2'
// };
// const div = mutation.add(mutation.getRoot(), null, 'div', propsDiv)

// mutation.add(div, null, 'text', { text: 'blah'})


// setTimeout(() => {
//     const div2 = mutation.add(mutation.getRoot(), null, 'div', {
//         onClick: () => console.log('hello'),
//         onMouseMove: () => console.log('move'),
//         style: { borderLeft: 'blue solid 2px', width: '200px', padding: '5px', margin: '5px' },
//         className: 'superClass superClass2',
//     });
//     mutation.add(div2, null, 'text', { text: 'blubb'})

//     mutation.update(div, propsDiv, {
//         style: {
//             borderLeft: 'dashed 2px',
//             borderLeftColor: 'green',
//             padding: '5px', margin: '5px'
//         }
//     })
// }, 3000);

// setTimeout(() => {
//     mutation.remove(div)
// }, 6000);

export { default as createBrowserDomMutation } from './browserDomMutation';
export { default as createMemoryDomMutation } from './memoryDomMutation';