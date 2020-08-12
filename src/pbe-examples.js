
class Example {
  constructor(input, output) {
    this.input = input;
    this.output = output;
  }
}

class PBETask {
  constructor(task, taskId, name, exampleType, solution, exampleCount, hintExamples, exampleNotes, generalNotes) {
    this.task = task;
    this.taskId = taskId;
    this.name = name;
    this.exampleType = exampleType;
    this.solution = solution;
    this.exampleCount = exampleCount;
    this.hintExamples = hintExamples;
    this.inputExamples = [];
    this.exampleNotes = exampleNotes;
    this.generalNotes = generalNotes;
  }

  clearExamples() {
    this.inputExamples = [];
  }

  addExample(example) {
    this.inputExamples.push(example);
  }

  validateExample(example) {
    return this.solution(example.input) === example.output;
  }

  renderExampleInputForm() {
    let exampleInputs = '';
    for (let idx = 0; idx < this.exampleCount; idx += 1) {
      exampleInputs += `
        <div class="form-group ${this.taskId}-form">
            <input class="input form-control form-control-sm mb-1" type='text' placeholder='Example input...' aria-label='Example Input'>
            <input class="output form-control form-control-sm" type='text' placeholder='Example output...' aria-label='Example Output'>
        </div>
      `;
    }
    exampleInputs += `<button id="${this.taskId}-submit" class="btn btn-primary mb-2 mr-2">Test Examples</button>`
    exampleInputs += `<button id="${this.taskId}-hints" class="btn btn-secondary mb-2">Show Hint Examples</button>`

    return exampleInputs;
  }

  renderExampleValidation() {
    const renderExample= (example, exampleNumber) => {
      if (example.input === null && example.output === null) {
        return '';
      }

      if (example.input === null) {
        return '<span class="error">Missing example input</span>';
      }

      if (example.output === null) {
        return '<span class="error">Missing example output</span>';
      }

      const outputStatus = this.validateExample(example) ? 'success' : 'error';
      let exampleHtml = `${exampleNumber}. <span class="info">${example.input} -> </span><span class="${outputStatus}"> ${example.output}</span>`;
      if (this.validateExample(example)) {
        const exampleNote = this.exampleNotes(example);
        if (exampleNote) {
          exampleHtml += `<span class="info">, <span class="success">+ </span>${exampleNote}</span>`
        }
      } else {
        exampleHtml += `<span class="info">, expected <span class="success">${this.solution(example.input)}</span> as the output</span>`
      }
      return exampleHtml;
    };

    let exampleValidation = `
      <div class="example-block">
        <div class="examples">Example Validation</div>
    `;
    this.inputExamples.forEach((example, idx) => {
      exampleValidation += `<div>${renderExample(example, idx+1)}</div>`
    });

    if (this.inputExamples.length === 0) {
      exampleValidation += '<span class="error">No examples are provided, enter at least one example input and output pair!</span>';
    } else if (this.generalNotes(this.inputExamples).length > 0) {
      exampleValidation += '<br/>';
      this.generalNotes(this.inputExamples).forEach(note => {
        exampleValidation += `<div class="info"><span class="error">- </span>${note}</div>`
      });
    } else {
      exampleValidation += '<br/> <div class="success">Good examples!</div>'
    }

    exampleValidation += '</div></div>';
    return exampleValidation;
  }

  renderHints() {

  }

  render(taskNumber) {
    return `
     <div class="section example" id="${this.taskId}">
        <h3>${taskNumber}. ${this.task}</h3>
        <div class="container mx-0">
          <div class="row">
            <div class="col-sm">
              ${this.renderExampleInputForm()}
            </div>
            <div class="col-sm">
              <div id="${this.taskId}-validation"></div>
              <div id="${this.taskId}-hints"></div>
            </div>
          </div>
        </div>
     </div>
    `;
  }
}

const task1 = new PBETask(
  'Multiply each input number by itself',
  'multiply',
  'Multiplication',
    Number,
  n => n * n,
  4,
  [
      new Example(-1, 1),
      new Example(0, 0),
      new Example(1, 1),
      new Example(-14, 196),
      new Example(100, 10000)
  ],
  example => {
    if (example.input === 0) {
      return '0 often causes problems if not included as an input example';
    }

    if (example.input < 0) {
      return 'Negative numbers are commonly encountered numbers that are important to include';
    }

    if (example.input % 1 !== 0) {
      return 'Decimals are commonly encountered numbers that are important to include';
    }
  },
  examples => {
    const notes = []
    if (!examples.some(example => example.input < 0)) {
      notes.push('It would be useful to include some negative number examples');
    }
    if (!examples.some(example => example.input === 0)) {
      notes.push('0 is a common edge case for numeric tasks, and is a useful example to include');
    }

    if (!examples.some(example => example.input % 1 !== 0)) {
      notes.push('It would be useful to include some decimal examples');
    }

    return notes;
  }
);

const task2 = new PBETask(
    'Append the letters <i>abc</i> to the end of each input word',
    'append-abc',
    'Appending',
    i => i,
    s => s === " " ? s : s.split(" ").map(word => word + "abc").join(" "),
    4,
    [],
    example => {
      if (example.input === " ") {
        return 'An empty input " " is a good edge case to tackle directly in your example!'
      }

      if (example.input.split(" ").filter(word => word !== "").length > 1) {
        return 'Having multiple words in an example is important, since appending "abc" to the end of <i>each</i> word is part of the task'
      }
    },
    examples => []
);

const task3 = new PBETask(
  'Capitalize the first word of each input sentence, if its not already capitalized',
  'capitalize',
  'Capitalization',
  i => i,
  s => s.length > 0 ? s[0].toUppercase() + s.substring(1) : s,
  4,
  [],
  example => {},
  examples => []
);

const task4 = new PBETask(
  'Extract the domain from each input email address',
  'domain',
  'Domain Extraction',
  s => s,
  s => s.includes("@") ? s.split("@")[1] : "",
  4,
  [],
  example => {},
  examples => []
);

const tasks = [task1, task2, task3, task4];

$(() => {
  const exampleSection = $('#examples');

  const validateTask = task => {
    task.clearExamples();

    $(`.${task.taskId}-form`).each(function () {
      const formInputs = $(this).find('input');
      const input = formInputs[0].value ? task.exampleType(formInputs[0].value) : null;
      const output = formInputs[1].value ? task.exampleType(formInputs[1].value) : null;
      if (input !== null && output !== null) {
        task.addExample(new Example(input, output));
      }
    });

    $(`#${task.taskId}-validation`).empty();
    $(`#${task.taskId}-validation`).append(task.renderExampleValidation());
  }

  const taskHints = task => {
    console.log('taskHints');
  };

  tasks.forEach((task, idx) => {
    const taskNumber = idx + 1;

    exampleSection.append(task.render(taskNumber));

    $(`#${task.taskId}-submit`).click(() => validateTask(task));
    $(`#${task.taskId}-hints`).click(() => taskHints(task));
  });

  // Fill Table of Contents
  const toc = $('#table-of-contents > .example-block');
  tasks.forEach(task => {
    toc.append(`              
      <div class="toc-sub-section" data-target="#${task.taskId}">${task.name}</div>
    `);
  });
});