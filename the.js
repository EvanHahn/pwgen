/* global crypto, requestAnimationFrame */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const state = [].reduce.call($$('[data-bind]'), (s, el) => {
  function update () {
    s[el.dataset.bind] = el.value
    render()
  }

  el.addEventListener('change', update)
  el.addEventListener('input', update)

  s[el.dataset.bind] = el.value

  return s
}, {})

const $output = $('#output')
const $alphabet = $('#alphabet')
const $alphabetPresets = $$('label[for="alphabet"] a')

;[].forEach.call($alphabetPresets, (el) => {
  el.addEventListener('click', (event) => {
    event.preventDefault()
    state.alphabet = $alphabet.value = el.dataset.alphabet
    render()
  })
})

function generate ({ minLength, maxLength, alphabet }) {
  let length
  if (minLength === maxLength) {
    length = minLength
  } else {
    length = Math.floor((Math.random() * (maxLength - minLength)) + minLength)
  }

  console.log(length)

  const arr = new Uint8Array(length)
  crypto.getRandomValues(arr)

  return [].map.call(arr, (v) => {
    return alphabet[v % alphabet.length]
  }).join('')
}

function sanitize (str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function render () {
  requestAnimationFrame(() => {
    let [minLength, maxLength] = state.length.split('-', 2).map((s) => parseInt(s))
    minLength = minLength || 1
    maxLength = maxLength || minLength

    $output.innerHTML = sanitize(generate({
      minLength: minLength,
      maxLength: maxLength,
      alphabet: state.alphabet
    }))
  })
}

render()
