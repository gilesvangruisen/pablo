'use strict'
var size = 658
var canvas = document.getElementById('pablo-canvas')
canvas.width = canvas.height = size

var context = canvas.getContext('2d')

function fillEntireCanvas (color) {
  context.beginPath()
  context.rect(0, 0, canvas.width, canvas.height)
  context.fillStyle = color
  context.fill()
}

function textVariations (text) {
  var index = text.lastIndexOf(' ')

  if (index === -1) {
    return {
      first: text,
      second: text,
      third: text
    }
  } else {
    var untilSpace = text.slice(0, index)
    var afterSpace = text.slice(index + 1)

    return {
      first: untilSpace + '        ' + afterSpace,
      second: untilSpace + '    ' + afterSpace,
      third: untilSpace + '      ' + afterSpace,
    }
  }
}

function drawImage(image, context, pos, size, callback) {
   loadImage(image, function() {
      context.drawImage(this, pos.x, pos.y, size.width, size.height)
      callback()
   })
}

function repeatText (opts) {
  var times = opts.times
  var gap = opts.gap
  var x = opts.x
  var text = opts.text

  var y = opts.y
  for (var i = 0; i < times; i++, y+= gap) {
    context.fillText(text, x, y)
  }

  return {
    y: y,
    gap: gap
  }
}

var imageCache = {}
function loadImage (url, callback) {
  if (imageCache[url]) {
    callback.call(imageCache[url])
  } else {
    var img = new Image()
    img.src = url

    img.onload = callback
    imageCache[url] = img
  }
}

function drawPablo (mainText, secondaryText, bootyPic, famPic, callback) {
  mainText = mainText.toUpperCase()
  secondaryText = secondaryText.toUpperCase()



  fillEntireCanvas('#F58B57')
  context.fillStyle = 'black'
  context.font = 'bold 43px sans-serif'

  var variations = textVariations(mainText)

  var mainX = 92
  var mainY = 64
  var mainGap = 50

  context.fillText(variations.first, mainX, mainY)

  var result = repeatText({
    times: 5,
    gap: mainGap,
    x: mainX,
    y: mainY + mainGap,
    text: variations.second
  })

  context.fillText(variations.third, mainX, result.y + result.gap)

  context.font = 'bold 17px sans-serif'

  repeatText({
    times: 10,
    gap: 21,
    x: 78,
    y: 436,
    text: secondaryText
  })

  repeatText({
    times: 10,
    gap: 21,
    x: 440,
    y: 436,
    text: secondaryText
  })

  var bootyDrawn = false
  var bootyPos = { x: 290, y: 457 }
  var bootySize = { width: 179, height: 154 }

  if (bootyPic) {
    drawImage(URL.createObjectURL(bootyPic), context, bootyPos, bootySize, function() {
      bootyDrawn = true
      runCallbackIfReady()
    })
  } else {
    drawImage('booty.jpg', context, bootyPos, bootySize, function() {
      bootyDrawn = true
      runCallbackIfReady()
    })
  }

  var famDrawn = false
  var famPos = { x: 261, y: 182 }
  var famSize = { width: 261, height: 182}

  if (famPic) {
    drawImage(URL.createObjectURL(famPic), context, famPos, famSize, function() {
      famDrawn = true
      runCallbackIfReady()
    })
  } else {
    drawImage('fam.jpg', context, famPos, famSize, function() {
      famDrawn = true
      runCallbackIfReady()
    })
  }

  function runCallbackIfReady () {
    if (bootyDrawn && famDrawn) {
      callback()
    }
  }
}

var mainEl = document.getElementById('main-text')
var secondaryEl = document.getElementById('secondary-text')
var bootypicEl = document.getElementById('booty-pic')
var fampicEl = document.getElementById('fam-pic')

var imageEl = document.getElementById('pablo-img')
function refresh () {
  drawPablo(mainEl.value, secondaryEl.value, bootypicEl.files[0], fampicEl.files[0], function () {
    var pabloDataURL = canvas.toDataURL('image/png')
    imageEl.src = pabloDataURL
  })
}

mainEl.onkeyup = refresh
secondaryEl.onkeyup = refresh
bootypicEl.onchange = refresh
fampicEl.onchange = refresh
refresh()
