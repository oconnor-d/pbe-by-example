
class Example {
  constructor(task, exampleCount, hints) {
    this.task = task;
    this.minExamples = exampleCount;
    this.hints = hints;
  }
}

const example1 = new Example(
  'Multiply each input number by itself',
  4,
  []
);

const example2 = new Example(
  'Append the letters <i>abc</i> to the end of each input word',
  4,
  []
);

const example3 = new Example(
  'Capitalize the first word of each input sentence, if its not already capitalized',
  5,
  []
);

const example4 = new Example(
  'Extract the domain from each input email address',
  5,
  []
);

const examples = [example1, example2, example3, example4];

const exampleTemplate = `
  <div class="container example">
    <h3>
  </div>
`;

$(() => {
  const exampleSection = $('#examples');

  examples.forEach((example, idx) => {
    const exampleNumber = idx + 1;

    console.log(Array(example.exampleCount).keys().map(() => `
    <input type='text' placeholder='Example...' aria-label='Example'>
  `))

    exampleSection.append(`
      <div class="container example pb-2">
        <h3>${exampleNumber}. ${example.task}</h3>
        ${Array(example.exampleCount).keys().map(() => `
          <input type='text' placeholder='Example...' aria-label='Example'>
        `)}
      </div>    
    `);
  })
});