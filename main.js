import CodeMirror from "./vendor/codemirror";
import beauty from "./vendor/beautify";

const codeMirror = CodeMirror.fromTextArea(document.querySelector("#code"), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true
});

const nodeCode = CodeMirror.fromTextArea(document.querySelector("#node-code"), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true
});

const doc = codeMirror.getDoc();

let index = 0;
let marker = null;
let list = [];

const doHighlight = () => {
  const current = list[index];

  if (marker) {
    marker.clear();
  }

  const json = list[index]?.node;

  nodeCode.setValue(`${beauty(json)}`);

  if (current) {
    marker = doc.markText(
      { line: current.start.line - 1, ch: current.start.column },
      { line: current.end.line - 1, ch: current.end.column },
      {
        className: "highlight"
      }
    );
  }
};

const auto = () => {
  const interval = setInterval(() => {
    doHighlight();

    index++;

    if (!list[index]) {
      clearInterval(interval);
    }
  }, 500);
};

document.querySelector(".compile").addEventListener("click", () => {
  fetch("http://localhost:8080", {
    method: "POST",
    body: codeMirror.getValue()
  })
    .then((res) => res.json())
    .then((data) => {
      list = data;
      index = 0;

      doHighlight();
    })
    .catch((err) => console.log(err));
});

document.querySelector(".auto").addEventListener("click", () => {
  auto();
});

document.querySelector(".back").addEventListener("click", () => {
  index--;

  if (!list[index]) {
    index++;
  }

  doHighlight();
});

document.querySelector(".forward").addEventListener("click", () => {
  index++;

  if (!list[index]) {
    index--;
  }

  doHighlight();
});
